/**
 * Tracks the current preset: the last one applied, for as long as every device it actually
 * set is still in that role. Volume changes never clear it.
 */
import { logger } from "@glaze/core/backend";

import type { AudioSnapshot, DeviceRole, Preset } from "../shared/types.js";
import { emitChange } from "./changes.js";
import {
  getLastApplied,
  getPresetById,
  setLastApplied,
  type RoleExpectations,
} from "./store.js";

const ROLES: readonly DeviceRole[] = ["output", "alert", "input"];

let currentId: string | null = null;
let applying = 0;

export function initCurrentPreset(): void {
  const last = getLastApplied();
  if (last && getPresetById(last.presetId)) {
    currentId = last.presetId;
  } else if (last) {
    setLastApplied(null);
  }
}

export function getCurrentPresetId(): string | null {
  return currentId;
}

export function beginApply(): void {
  applying++;
}

export function endApply(): void {
  applying = Math.max(0, applying - 1);
}

export function markApplied(
  presetId: string,
  expected: RoleExpectations,
): void {
  currentId = presetId;
  setLastApplied({ presetId, expected });
  emitChange();
}

export function clearCurrentPreset(reason: string): void {
  if (!currentId) return;
  logger.info("current", "Current preset cleared", {
    presetId: currentId,
    reason,
  });
  currentId = null;
  setLastApplied(null);
  emitChange();
}

/** Called for every device snapshot. Ignored while a preset is being applied. */
export function validateCurrentPreset(snapshot: AudioSnapshot): void {
  if (applying > 0 || !currentId) return;
  const last = getLastApplied();
  if (!last || last.presetId !== currentId || !getPresetById(currentId)) {
    clearCurrentPreset("preset no longer exists");
    return;
  }
  for (const role of ROLES) {
    const expectedUid = last.expected[role];
    if (expectedUid && snapshot.defaults[role] !== expectedUid) {
      clearCurrentPreset(`${role} device changed`);
      return;
    }
  }
}

/** After the current preset's devices are edited, keep it current only if it still matches. */
export function recheckAfterEdit(
  preset: Preset,
  snapshot: AudioSnapshot | null,
): void {
  if (currentId !== preset.id || !snapshot) return;
  const defaults = snapshot.defaults;
  const expected: RoleExpectations = {};

  if (preset.output.kind === "device") {
    if (defaults.output !== preset.output.device.uid)
      return clearCurrentPreset("output edited");
    expected.output = preset.output.device.uid;
  }
  if (preset.alert.kind === "device") {
    if (defaults.alert !== preset.alert.device.uid)
      return clearCurrentPreset("alerts edited");
    expected.alert = preset.alert.device.uid;
  } else if (preset.alert.kind === "sameAsOutput") {
    if (!defaults.alert || defaults.alert !== defaults.output)
      return clearCurrentPreset("alerts edited");
    expected.alert = defaults.alert;
  }
  if (preset.input.kind === "device") {
    if (defaults.input !== preset.input.device.uid)
      return clearCurrentPreset("input edited");
    expected.input = preset.input.device.uid;
  }
  markApplied(preset.id, expected);
}
