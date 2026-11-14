/**
 * Applying presets. `applyPresetBySlug` is the single self-contained action every trigger
 * uses: the menu, global shortcuts, device-connect rules, Preferences, and future external
 * triggers (for example a Slack message naming a slug).
 */
import { logger, Notification } from "@glaze/core/backend";

import type {
  ApplyResult,
  ApplySkip,
  ApplySource,
  AudioDevice,
  Preset,
} from "../shared/types.js";
import { audio } from "./audio-bridge.js";
import { beginApply, endApply, markApplied } from "./current-preset.js";
import { getPresetById, getPresets, type RoleExpectations } from "./store.js";

let queue: Promise<unknown> = Promise.resolve();

export function applyPresetBySlug(
  slug: string,
  source: ApplySource = "external",
): Promise<ApplyResult> {
  const wanted = slug.trim().toLowerCase();
  const preset = getPresets().find((p) => p.slug === wanted);
  if (!preset)
    return Promise.reject(new Error(`There's no preset called "${slug}".`));
  return applyPresetById(preset.id, source);
}

/** Applies are queued so two triggers never interleave their device changes. */
export function applyPresetById(
  presetId: string,
  source: ApplySource,
): Promise<ApplyResult> {
  const run = queue.then(() => runApply(presetId, source));
  queue = run.catch(() => undefined);
  return run;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

interface ApplyOutcome {
  applied: string[];
  skipped: ApplySkip[];
  expected: RoleExpectations;
}

async function runApply(
  presetId: string,
  source: ApplySource,
): Promise<ApplyResult> {
  const preset = getPresetById(presetId);
  if (!preset) throw new Error("That preset no longer exists.");

  beginApply();
  let outcome: ApplyOutcome;
  try {
    outcome = await performApply(preset);
    if (outcome.applied.length > 0) markApplied(preset.id, outcome.expected);
  } finally {
    endApply();
  }

  const result: ApplyResult = {
    presetId: preset.id,
    slug: preset.slug,
    source,
    applied: outcome.applied,
    skipped: outcome.skipped,
    becameCurrent: outcome.applied.length > 0,
  };
  logger.info("apply", `Applied ${preset.slug}`, {
    source,
    applied: result.applied,
    skipped: result.skipped,
  });

  // Re-read devices so the tracker validates against the settled state.
  audio.refresh().catch((error: unknown) => {
    logger.warn("apply", "Couldn't re-read devices after applying", {
      error: errorMessage(error),
    });
  });

  if (result.skipped.length > 0) notifySkips(result);
  return result;
}

async function performApply(preset: Preset): Promise<ApplyOutcome> {
  const snapshot = await audio.refresh();
  const devices = new Map(
    snapshot.devices.map((device) => [device.uid, device]),
  );
  const find = (uid: string | null): AudioDevice | undefined =>
    uid ? devices.get(uid) : undefined;

  const applied: string[] = [];
  const skipped: ApplySkip[] = [];
  const expected: RoleExpectations = {};

  let finalOutput = find(snapshot.defaults.output);
  let finalInput = find(snapshot.defaults.input);
  let outputSkipped: string | null = null;
  let inputSkipped: string | null = null;

  // ── Main output ──
  if (preset.output.kind === "device") {
    const wanted = preset.output.device;
    const device = devices.get(wanted.uid);
    if (!device || !device.canBeDefaultOutput) {
      outputSkipped = `${wanted.name} isn't connected`;
      skipped.push({
        what: `Output (${wanted.name})`,
        reason: "not connected",
      });
    } else {
      try {
        if (snapshot.defaults.output !== device.uid)
          await audio.setDefaultDevice("output", device.uid);
        finalOutput = device;
        expected.output = device.uid;
        applied.push(`Output: ${device.name}`);
      } catch (error) {
        outputSkipped = `${device.name} couldn't be selected`;
        skipped.push({
          what: `Output (${device.name})`,
          reason: errorMessage(error),
        });
      }
    }
  }

  // ── Alert sounds ──
  if (preset.alert.kind === "sameAsOutput") {
    if (!finalOutput) {
      skipped.push({
        what: "Alerts (same as output)",
        reason: "there's no main output device",
      });
    } else if (!finalOutput.canBeSystemOutput) {
      skipped.push({
        what: "Alerts (same as output)",
        reason: `${finalOutput.name} can't play alert sounds`,
      });
    } else {
      try {
        if (snapshot.defaults.alert !== finalOutput.uid)
          await audio.setDefaultDevice("alert", finalOutput.uid);
        expected.alert = finalOutput.uid;
        applied.push(`Alerts: ${finalOutput.name}`);
      } catch (error) {
        skipped.push({
          what: `Alerts (${finalOutput.name})`,
          reason: errorMessage(error),
        });
      }
    }
  } else if (preset.alert.kind === "device") {
    const wanted = preset.alert.device;
    const device = devices.get(wanted.uid);
    if (!device || !device.hasOutput) {
      skipped.push({
        what: `Alerts (${wanted.name})`,
        reason: "not connected",
      });
    } else if (!device.canBeSystemOutput) {
      skipped.push({
        what: `Alerts (${device.name})`,
        reason: "this device can't play alert sounds",
      });
    } else {
      try {
        if (snapshot.defaults.alert !== device.uid)
          await audio.setDefaultDevice("alert", device.uid);
        expected.alert = device.uid;
        applied.push(`Alerts: ${device.name}`);
      } catch (error) {
        skipped.push({
          what: `Alerts (${device.name})`,
          reason: errorMessage(error),
        });
      }
    }
  }

  // ── Input ──
  if (preset.input.kind === "device") {
    const wanted = preset.input.device;
    const device = devices.get(wanted.uid);
    if (!device || !device.canBeDefaultInput) {
      inputSkipped = `${wanted.name} isn't connected`;
      skipped.push({ what: `Input (${wanted.name})`, reason: "not connected" });
    } else {
      try {
        if (snapshot.defaults.input !== device.uid)
          await audio.setDefaultDevice("input", device.uid);
        finalInput = device;
        expected.input = device.uid;
        applied.push(`Input: ${device.name}`);
      } catch (error) {
        inputSkipped = `${device.name} couldn't be selected`;
        skipped.push({
          what: `Input (${device.name})`,
          reason: errorMessage(error),
        });
      }
    }
  }

  // ── Volumes ──
  const volumes = preset.volumes;
  if (volumes.enabled && volumes.output !== null) {
    let outputVolumeSet = false;
    if (outputSkipped) {
      skipped.push({
        what: "Output volume",
        reason: `skipped because ${outputSkipped}`,
      });
    } else if (!finalOutput) {
      skipped.push({
        what: "Output volume",
        reason: "there's no main output device",
      });
    } else if (!finalOutput.outputVolumeSettable) {
      skipped.push({
        what: "Output volume",
        reason: `${finalOutput.name} has no adjustable volume`,
      });
    } else {
      try {
        await audio.setVolume(finalOutput.uid, "output", volumes.output);
        outputVolumeSet = true;
        applied.push(`Output volume: ${volumes.output}%`);
      } catch (error) {
        skipped.push({ what: "Output volume", reason: errorMessage(error) });
      }
    }

    if (outputVolumeSet) {
      const alertLevel = volumes.alertLinked ? volumes.output : volumes.alert;
      try {
        await audio.setAlertVolume(alertLevel);
        applied.push(`Alert volume: ${alertLevel}%`);
      } catch (error) {
        skipped.push({ what: "Alert volume", reason: errorMessage(error) });
      }
    } else {
      skipped.push({
        what: "Alert volume",
        reason: "left alone because the output volume wasn't set",
      });
    }
  }

  if (volumes.enabled && volumes.input !== null) {
    if (inputSkipped) {
      skipped.push({
        what: "Input volume",
        reason: `skipped because ${inputSkipped}`,
      });
    } else if (!finalInput) {
      skipped.push({ what: "Input volume", reason: "there's no input device" });
    } else if (!finalInput.inputVolumeSettable) {
      skipped.push({
        what: "Input volume",
        reason: `${finalInput.name} has no adjustable volume`,
      });
    } else {
      try {
        await audio.setVolume(finalInput.uid, "input", volumes.input);
        applied.push(`Input volume: ${volumes.input}%`);
      } catch (error) {
        skipped.push({ what: "Input volume", reason: errorMessage(error) });
      }
    }
  }

  return { applied, skipped, expected };
}

function notifySkips(result: ApplyResult): void {
  const title = result.becameCurrent
    ? `Switched to ${result.slug}, with some skips`
    : `Couldn't switch to ${result.slug}`;
  const body = result.skipped
    .map((skip) => `${skip.what}: ${skip.reason}`)
    .join("\n");
  try {
    new Notification({ title, body }).show();
  } catch (error) {
    logger.warn("apply", "Couldn't show the skipped-settings notification", {
      error: errorMessage(error),
    });
  }
}
