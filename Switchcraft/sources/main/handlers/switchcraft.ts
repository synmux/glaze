/**
 * IPC for the Preferences window. Business logic lives in main/services.
 */
import { ipcMain } from "@glaze/core/backend";

import { applyPresetById } from "../services/apply-preset.js";
import { setPreferences } from "../services/preferences.js";
import {
  createPreset,
  deletePreset,
  duplicatePreset,
  getCurrentTargets,
  reorderPresets,
  updatePreset,
} from "../services/presets.js";
import { checkShortcut, setShortcutRecording } from "../services/shortcuts.js";
import { getState } from "../services/state.js";

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Expected ${label} to be a non-empty string.`);
  }
  return value;
}

function requireStringArray(value: unknown, label: string): string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item): item is string => typeof item === "string")
  ) {
    throw new Error(`Expected ${label} to be a list of ids.`);
  }
  return value;
}

export function registerSwitchcraftHandlers(): void {
  ipcMain.handle("switchcraft:getState", () => getState());

  ipcMain.handle("presets:create", () => createPreset());
  ipcMain.handle("presets:update", (_event, preset: unknown) =>
    updatePreset(preset),
  );
  ipcMain.handle("presets:duplicate", (_event, id: unknown) =>
    duplicatePreset(requireString(id, "preset id")),
  );
  ipcMain.handle("presets:delete", (_event, id: unknown) =>
    deletePreset(requireString(id, "preset id")),
  );
  ipcMain.handle("presets:reorder", (_event, ids: unknown) =>
    reorderPresets(requireStringArray(ids, "preset order")),
  );
  ipcMain.handle("presets:apply", (_event, id: unknown) =>
    applyPresetById(requireString(id, "preset id"), "preferences"),
  );

  ipcMain.handle("audio:getCurrentTargets", () => getCurrentTargets());

  ipcMain.handle(
    "shortcuts:check",
    (_event, accelerator: unknown, presetId: unknown) =>
      checkShortcut(
        requireString(accelerator, "shortcut"),
        typeof presetId === "string" ? presetId : null,
      ),
  );
  ipcMain.handle("shortcuts:setRecording", (_event, recording: unknown) => {
    setShortcutRecording(recording === true);
  });

  ipcMain.handle("prefs:set", (_event, preferences: unknown) =>
    setPreferences(preferences),
  );
}
