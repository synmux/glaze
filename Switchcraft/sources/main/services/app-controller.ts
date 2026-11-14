/**
 * Starts and stops Switchcraft's services.
 */
import { logger } from "@glaze/core/backend";

import { openSettingsWindow } from "../windows/settings-window.js";
import { audio } from "./audio-bridge.js";
import { startAutoApply } from "./auto-apply.js";
import { emitChange } from "./changes.js";
import { initCurrentPreset, validateCurrentPreset } from "./current-preset.js";
import { syncShortcuts, unregisterAllShortcuts } from "./shortcuts.js";
import { startStatePublishing } from "./state.js";
import { flushStore, getPresets, loadStore } from "./store.js";
import { createTray, destroyTray } from "./tray.js";

const FIRST_SNAPSHOT_TIMEOUT_MS = 5000;

export async function startSwitchcraft(): Promise<void> {
  loadStore();
  initCurrentPreset();

  audio.onSnapshot((snapshot) => {
    validateCurrentPreset(snapshot);
    emitChange();
  });
  startAutoApply();
  startStatePublishing();
  createTray();
  audio.start();

  const snapshot = await audio.waitForSnapshot(FIRST_SNAPSHOT_TIMEOUT_MS);
  if (snapshot) {
    logger.info("main", "Audio devices ready", {
      devices: snapshot.devices.map((device) => device.name),
      defaults: snapshot.defaults,
    });
  } else {
    logger.warn("main", "Audio devices weren't available at startup");
  }

  await syncShortcuts();
  emitChange();

  if (getPresets().length === 0) await openSettingsWindow();
}

export function stopSwitchcraft(): Promise<void> {
  unregisterAllShortcuts();
  audio.stop();
  destroyTray();
  return flushStore();
}
