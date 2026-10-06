/**
 * Control window — the compact main window for Caffeinate.
 *
 * A normal app-owned window (Dock-visible app). Closing it does not quit the app;
 * it stays resident in the menu bar and can be reopened from the tray or Dock.
 */

import { BrowserWindow, logger } from "@glaze/core/backend";

import { getPreloadPath, getWindowUrl } from "./window-paths.js";

let controlWindow: BrowserWindow | null = null;

export function getControlWindow(): BrowserWindow | null {
  return controlWindow && !controlWindow.isDestroyed() ? controlWindow : null;
}

export async function createControlWindow(): Promise<BrowserWindow> {
  const existing = getControlWindow();
  if (existing) {
    return existing;
  }

  // No windowKey → frame persistence is disabled, so this fixed-size utility
  // window always opens at its compact dimensions.
  controlWindow = new BrowserWindow({
    width: 380,
    height: 560,
    title: "Caffeinate",
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  controlWindow.once("ready-to-show", () => {
    controlWindow?.show();
  });

  controlWindow.on("closed", () => {
    controlWindow = null;
  });

  const url = await getWindowUrl("main-window.html");
  logger.info("main", "Loading control window", { url });
  await controlWindow.loadURL(url);

  return controlWindow;
}

/** Show the control window, creating it if needed, and bring it to the front. */
export async function showControlWindow(): Promise<void> {
  const win = getControlWindow() ?? (await createControlWindow());
  if (win.isMinimized()) {
    win.restore();
  }
  win.show();
  win.focus();
}
