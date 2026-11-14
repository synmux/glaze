/**
 * The full app state sent to Preferences, and the publisher that keeps the tray and
 * every open window in sync.
 */
import { ipcMain } from "@glaze/core/backend";

import type { SwitchcraftState } from "../shared/types.js";
import { audio } from "./audio-bridge.js";
import { onChange } from "./changes.js";
import { getCurrentPresetId } from "./current-preset.js";
import { getAppSettings } from "./preferences.js";
import { getShortcutStates } from "./shortcuts.js";
import { getPresets } from "./store.js";
import { refreshTray } from "./tray.js";

export const STATE_CHANNEL = "switchcraft:changed";

export function getState(): SwitchcraftState {
  return {
    presets: [...getPresets()],
    currentPresetId: getCurrentPresetId(),
    snapshot: audio.getSnapshot(),
    audioError: audio.getError(),
    shortcuts: getShortcutStates(),
    settings: getAppSettings(),
  };
}

export function startStatePublishing(): void {
  onChange(() => {
    refreshTray();
    ipcMain.broadcast(STATE_CHANNEL, getState());
  });
}
