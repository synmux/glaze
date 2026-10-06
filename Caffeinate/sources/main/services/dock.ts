/**
 * Dock icon visibility — user-toggleable "Hide Dock Icon" preference.
 *
 * The app ships as a regular (Dock-visible) app; hiding is done at runtime via
 * app.dock so no Info.plist/bundle change is needed. macOS re-shows the Dock
 * tile on activate, so `applyDockVisibility` must also be called from the
 * `activate` handler to keep it hidden.
 */

import { app, ipcMain, logger } from "@glaze/core/backend";

import { settingsService } from "./settings.js";

/** Apply the persisted preference to the Dock (call on launch and on activate). */
export async function applyDockVisibility(): Promise<void> {
  const { hideDockIcon } = settingsService.get();
  try {
    if (hideDockIcon) {
      app.dock.hide();
    } else if (!app.dock.isVisible()) {
      await app.dock.show();
    }
  } catch (error) {
    logger.error("dock", "Failed to apply dock visibility", error);
  }
}

/** Persist the preference, apply it, and broadcast the change. */
export async function setHideDock(hidden: boolean): Promise<boolean> {
  await settingsService.set("hideDockIcon", hidden);
  await applyDockVisibility();
  ipcMain.broadcast("settings:hideDockIcon-changed", { value: hidden });
  return hidden;
}
