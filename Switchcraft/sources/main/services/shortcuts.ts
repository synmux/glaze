/**
 * Global keyboard shortcuts that apply presets from anywhere, plus conflict checks.
 */
import { globalShortcut, logger } from "@glaze/core/backend";

import type { ShortcutCheckResult, ShortcutState } from "../shared/types.js";
import { applyPresetById } from "./apply-preset.js";
import { audio } from "./audio-bridge.js";
import { emitChange } from "./changes.js";
import { acceleratorProblem, normalizeAccelerator } from "./preset-model.js";
import { getPresets } from "./store.js";

/** Standard shortcuts every Mac app relies on; taking them globally would break other apps. */
const STANDARD_SHORTCUTS: Record<string, string> = {
  "Command+Q": "Quit",
  "Command+W": "Close Window",
  "Command+H": "Hide",
  "Alt+Command+H": "Hide Others",
  "Command+M": "Minimize",
  "Command+Tab": "switching apps",
  "Shift+Command+Tab": "switching apps",
  "Command+Space": "Spotlight",
  "Command+C": "Copy",
  "Command+V": "Paste",
  "Command+X": "Cut",
  "Command+Z": "Undo",
  "Shift+Command+Z": "Redo",
  "Command+A": "Select All",
  "Command+S": "Save",
  "Command+N": "New",
  "Command+O": "Open",
  "Command+P": "Print",
  "Command+F": "Find",
  "Command+T": "New Tab",
  "Command+Backspace": "Delete",
  "Control+Command+Q": "Lock Screen",
  "Control+Command+F": "Full Screen",
  "Control+Command+Space": "Emoji & Symbols",
  "Shift+Command+Q": "Log Out",
  "Alt+Shift+Command+Q": "Log Out",
};

const registered = new Map<string, string>(); // accelerator → preset id
let states = new Map<string, ShortcutState>(); // preset id → state
let recording = false;
let lock: Promise<unknown> = Promise.resolve();

function exclusive<T>(task: () => Promise<T>): Promise<T> {
  const run = lock.then(task);
  lock = run.catch(() => undefined);
  return run;
}

function resumeIfRecording(): void {
  if (!recording) return;
  recording = false;
  globalShortcut.setSuspended(false);
}

function trigger(presetId: string): void {
  applyPresetById(presetId, "shortcut").catch((error: unknown) => {
    logger.warn("shortcuts", "Shortcut couldn't apply its preset", {
      presetId,
      error: String(error),
    });
  });
}

export function getShortcutStates(): Record<string, ShortcutState> {
  return Object.fromEntries(states);
}

/** Registers exactly the shortcuts the presets ask for. */
export function syncShortcuts(): Promise<void> {
  return exclusive(async () => {
    resumeIfRecording();
    const desired = new Map<string, string>();
    for (const preset of getPresets()) {
      if (preset.shortcut) desired.set(preset.shortcut, preset.id);
    }

    for (const [accelerator, presetId] of registered) {
      if (desired.get(accelerator) !== presetId) {
        globalShortcut.unregister(accelerator);
        registered.delete(accelerator);
      }
    }

    const next = new Map<string, ShortcutState>();
    for (const [accelerator, presetId] of desired) {
      if (registered.get(accelerator) === presetId) {
        next.set(presetId, { status: "ok" });
        continue;
      }
      let ok = false;
      try {
        ok = await globalShortcut.register(accelerator, () =>
          trigger(presetId),
        );
      } catch (error) {
        logger.warn("shortcuts", "Shortcut registration failed", {
          accelerator,
          error: String(error),
        });
      }
      if (ok) {
        registered.set(accelerator, presetId);
        next.set(presetId, { status: "ok" });
      } else {
        next.set(presetId, {
          status: "taken",
          message:
            "Another app is using this shortcut, so it won't work until that app lets it go.",
        });
      }
    }
    states = next;
    emitChange();
  }).catch((error: unknown) => {
    logger.error("shortcuts", "Couldn't update global shortcuts", {
      error: String(error),
    });
  });
}

/** Checks whether a shortcut is free to use for a preset. */
export function checkShortcut(
  raw: string,
  presetId: string | null,
): Promise<ShortcutCheckResult> {
  return exclusive(async (): Promise<ShortcutCheckResult> => {
    const accelerator = normalizeAccelerator(raw);
    if (!accelerator)
      return { ok: false, message: "That key can't be used in a shortcut." };
    const problem = acceleratorProblem(accelerator);
    if (problem) return { ok: false, message: problem };

    const standard = STANDARD_SHORTCUTS[accelerator];
    if (standard)
      return {
        ok: false,
        message: `That's the standard macOS shortcut for ${standard}.`,
      };

    const other = getPresets().find(
      (p) => p.id !== presetId && p.shortcut === accelerator,
    );
    if (other) return { ok: false, message: `Already used by ${other.slug}.` };

    try {
      const systemName = await audio.checkSystemShortcut(accelerator);
      if (systemName)
        return {
          ok: false,
          message: `macOS uses this shortcut for “${systemName}”.`,
        };
    } catch (error) {
      logger.warn("shortcuts", "Couldn't check macOS shortcuts", {
        error: String(error),
      });
    }

    if (presetId && registered.get(accelerator) === presetId)
      return { ok: true };

    resumeIfRecording();
    let ok = false;
    try {
      ok = await globalShortcut.register(accelerator, () => undefined);
    } catch (error) {
      logger.warn("shortcuts", "Shortcut test registration failed", {
        accelerator,
        error: String(error),
      });
    }
    if (!ok)
      return {
        ok: false,
        message: "Another app is already using this shortcut.",
      };
    globalShortcut.unregister(accelerator);
    return { ok: true };
  });
}

/** While Preferences records a shortcut, existing ones are paused so they can be re-recorded. */
export function setShortcutRecording(on: boolean): void {
  if (recording === on) return;
  recording = on;
  try {
    globalShortcut.setSuspended(on);
  } catch (error) {
    logger.warn("shortcuts", "Couldn't pause shortcuts", {
      error: String(error),
    });
  }
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll();
  registered.clear();
}
