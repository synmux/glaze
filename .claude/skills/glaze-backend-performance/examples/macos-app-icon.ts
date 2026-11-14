// Example: Display a macOS app icon without spawning a process or transferring base64 over IPC.

import { getFileIconUrl } from "@glaze/core/utils";

/**
 * Returns a display-density-aware native URL for an application bundle icon.
 * Use this directly as an image `src` in the renderer.
 */
export function appIconUrl(appPath: string, size = 64): string {
  return getFileIconUrl(appPath, { size });
}

// Backend image manipulation is also available when a URL is not sufficient:
//
// import { app } from "@glaze/core/backend";
// const icon = await app.getFileIcon("/Applications/Calendar.app", { size: "large" });
// const retinaPng = icon.toPNG({ scaleFactor: 2 });
