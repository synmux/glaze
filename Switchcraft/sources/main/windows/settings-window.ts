import { app, BrowserWindow, logger } from "@glaze/core/backend";

import { setShortcutRecording } from "../services/shortcuts.js";
import { getPreloadPath, getWindowUrl } from "./window-paths.js";

let settingsWindow: BrowserWindow | null = null;

/** Switchcraft has no Dock icon, so bring the app forward before showing its window. */
function present(win: BrowserWindow): void {
  app.focus({ steal: true });
  win.show();
  win.focus();
}

export async function openSettingsWindow(): Promise<void> {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    present(settingsWindow);
    return;
  }

  logger.info("settings", "Creating Preferences window");

  const win = new BrowserWindow({
    windowKey: "preferences",
    width: 820,
    height: 600,
    minWidth: 700,
    minHeight: 480,
    title: "Switchcraft Preferences",
    show: false,
    center: true,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  settingsWindow = win;

  win.once("ready-to-show", () => present(win));

  win.on("closed", () => {
    if (settingsWindow === win) settingsWindow = null;
    // Never leave global shortcuts paused if the window closes mid-recording.
    setShortcutRecording(false);
  });

  const url = await getWindowUrl("settings-window.html");
  logger.info("settings", "Loading Preferences URL", { url });

  await win.loadURL(url);
}

export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow;
}
