/**
 * Preset editing: create, update, duplicate, delete, reorder and "Use current settings".
 */
import { randomUUID } from "crypto";

import { logger } from "@glaze/core/backend";

import type {
  AlertTarget,
  AudioSnapshot,
  CurrentSettings,
  CurrentTargets,
  DeviceRef,
  DeviceTarget,
  Preset,
  PresetUpdateResult,
} from "../shared/types.js";
import { audio } from "./audio-bridge.js";
import { emitChange } from "./changes.js";
import {
  clearCurrentPreset,
  getCurrentPresetId,
  recheckAfterEdit,
} from "./current-preset.js";
import {
  emptyPreset,
  nextNewSlug,
  parsePreset,
  uniqueSlug,
  validatePreset,
} from "./preset-model.js";
import { checkShortcut, syncShortcuts } from "./shortcuts.js";
import { getPresets, setPresets } from "./store.js";

function refFor(
  uid: string | null,
  snapshot: AudioSnapshot | null,
): DeviceRef | null {
  if (!uid) return null;
  const device = snapshot?.devices.find((d) => d.uid === uid);
  return { uid, name: device?.name ?? "Unknown device" };
}

function targetsFromSettings(
  settings: CurrentSettings,
  snapshot: AudioSnapshot | null,
): { output: DeviceTarget; alert: AlertTarget; input: DeviceTarget } {
  const output = refFor(settings.defaults.output, snapshot);
  const alert = refFor(settings.defaults.alert, snapshot);
  const input = refFor(settings.defaults.input, snapshot);
  let alertTarget: AlertTarget = { kind: "noChange" };
  if (alert && output && alert.uid === output.uid)
    alertTarget = { kind: "sameAsOutput" };
  else if (alert) alertTarget = { kind: "device", device: alert };
  return {
    output: output ? { kind: "device", device: output } : { kind: "noChange" },
    alert: alertTarget,
    input: input ? { kind: "device", device: input } : { kind: "noChange" },
  };
}

function requireIndex(all: readonly Preset[], id: string): number {
  const index = all.findIndex((preset) => preset.id === id);
  if (index < 0) throw new Error("That preset no longer exists.");
  return index;
}

function targetsChanged(before: Preset, after: Preset): boolean {
  return (
    JSON.stringify([before.output, before.alert, before.input]) !==
    JSON.stringify([after.output, after.alert, after.input])
  );
}

export async function getCurrentTargets(): Promise<CurrentTargets> {
  const [settings, snapshot] = await Promise.all([
    audio.getCurrentSettings(),
    audio.refresh(),
  ]);
  return {
    ...targetsFromSettings(settings, snapshot),
    volumes: settings.volumes,
  };
}

/** New presets start from whatever the Mac is using now, so they're valid straight away. */
export async function createPreset(): Promise<Preset> {
  const preset = emptyPreset(randomUUID(), nextNewSlug(getPresets()));
  try {
    const [settings, snapshot] = await Promise.all([
      audio.getCurrentSettings(),
      audio.refresh(),
    ]);
    Object.assign(preset, targetsFromSettings(settings, snapshot));
  } catch (error) {
    logger.warn("presets", "Couldn't read current settings for a new preset", {
      error: String(error),
    });
  }
  setPresets([...getPresets(), preset]);
  emitChange();
  logger.info("presets", "Created preset", { slug: preset.slug });
  return preset;
}

/** Saves an edited preset if it's valid; otherwise returns the problems and saves nothing. */
export async function updatePreset(
  input: unknown,
): Promise<PresetUpdateResult> {
  const preset = parsePreset(input);
  if (!preset)
    throw new Error("Switchcraft received preset details it couldn't read.");
  const all = getPresets();
  const index = requireIndex(all, preset.id);
  const existing = all[index];

  const errors = validatePreset(preset, all);
  if (
    !errors.shortcut &&
    preset.shortcut &&
    preset.shortcut !== existing.shortcut
  ) {
    const check = await checkShortcut(preset.shortcut, preset.id);
    if (!check.ok)
      errors.shortcut = check.message ?? "That shortcut isn't available.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const next = [...getPresets()];
  next[requireIndex(next, preset.id)] = preset;
  setPresets(next);

  if (getCurrentPresetId() === preset.id && targetsChanged(existing, preset)) {
    recheckAfterEdit(preset, audio.getSnapshot());
  }
  if (existing.shortcut !== preset.shortcut) void syncShortcuts();
  emitChange();
  return { ok: true, preset };
}

export function duplicatePreset(id: string): Preset {
  const all = getPresets();
  const index = requireIndex(all, id);
  const source = all[index];
  const copy: Preset = {
    ...structuredClone(source),
    id: randomUUID(),
    slug: uniqueSlug(`${source.slug}-copy`, all),
    shortcut: null,
    autoApplyDevice: null,
  };
  const next = [...all];
  next.splice(index + 1, 0, copy);
  setPresets(next);
  emitChange();
  return copy;
}

export function deletePreset(id: string): void {
  const all = getPresets();
  const index = requireIndex(all, id);
  const removed = all[index];
  setPresets(all.filter((preset) => preset.id !== id));
  if (getCurrentPresetId() === id) clearCurrentPreset("preset deleted");
  if (removed.shortcut) void syncShortcuts();
  emitChange();
  logger.info("presets", "Deleted preset", { slug: removed.slug });
}

export function reorderPresets(ids: readonly string[]): void {
  const all = getPresets();
  const byId = new Map(all.map((preset) => [preset.id, preset]));
  if (
    ids.length !== all.length ||
    new Set(ids).size !== ids.length ||
    !ids.every((id) => byId.has(id))
  ) {
    throw new Error("The new preset order doesn't match the saved presets.");
  }
  setPresets(
    ids
      .map((id) => byId.get(id))
      .filter((preset): preset is Preset => preset !== undefined),
  );
  emitChange();
}
