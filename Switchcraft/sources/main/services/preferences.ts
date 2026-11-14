/**
 * App-wide preferences: device details in the menu and launch at login.
 */
import { app, logger } from "@glaze/core/backend";

import type { AppSettings } from "../shared/types.js";
import { emitChange } from "./changes.js";
import { isRecord } from "./preset-model.js";
import { getShowDeviceDetails, setShowDeviceDetails } from "./store.js";

function getLaunchAtLogin(): boolean {
  try {
    return app.getLoginItemSettings().openAtLogin;
  } catch (error) {
    logger.warn("preferences", "Couldn't read the login item setting", {
      error: String(error),
    });
    return false;
  }
}

export function getAppSettings(): AppSettings {
  return {
    showDeviceDetails: getShowDeviceDetails(),
    launchAtLogin: getLaunchAtLogin(),
  };
}

export function setPreferences(input: unknown): AppSettings {
  if (!isRecord(input))
    throw new Error("Preferences update must be an object.");
  if (typeof input.showDeviceDetails === "boolean") {
    setShowDeviceDetails(input.showDeviceDetails);
  }
  if (typeof input.launchAtLogin === "boolean") {
    try {
      app.setLoginItemSettings({ openAtLogin: input.launchAtLogin });
    } catch (error) {
      logger.error("preferences", "Couldn't change the login item", {
        error: String(error),
      });
      throw new Error("macOS didn't accept the Launch at login change.");
    }
  }
  emitChange();
  return getAppSettings();
}
