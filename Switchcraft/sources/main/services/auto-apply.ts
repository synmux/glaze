/**
 * Applies a preset when its chosen device connects while Switchcraft is running.
 */
import { logger } from "@glaze/core/backend";

import { applyPresetById } from "./apply-preset.js";
import { audio } from "./audio-bridge.js";
import { getPresets } from "./store.js";

// Give macOS a moment to finish its own automatic switching for the new device first.
const SETTLE_DELAY_MS = 1500;

let knownDevices: Set<string> | null = null;
const timers = new Map<string, NodeJS.Timeout>();

export function startAutoApply(): void {
  audio.onSnapshot((snapshot) => {
    const connected = new Set(snapshot.devices.map((device) => device.uid));
    const previous = knownDevices;
    knownDevices = connected;
    // The first snapshot is the starting point, not a connection.
    if (!previous) return;

    for (const uid of connected) {
      if (previous.has(uid)) continue;
      if (!getPresets().some((preset) => preset.autoApplyDevice?.uid === uid))
        continue;

      const existing = timers.get(uid);
      if (existing) clearTimeout(existing);
      timers.set(
        uid,
        setTimeout(() => {
          timers.delete(uid);
          const stillConnected =
            audio.getSnapshot()?.devices.some((device) => device.uid === uid) ??
            false;
          const preset = getPresets().find(
            (p) => p.autoApplyDevice?.uid === uid,
          );
          if (!stillConnected || !preset) return;
          logger.info("auto-apply", "Device connected; applying its preset", {
            uid,
            slug: preset.slug,
          });
          applyPresetById(preset.id, "device").catch((error: unknown) => {
            logger.warn(
              "auto-apply",
              "Couldn't apply preset for connected device",
              {
                uid,
                error: String(error),
              },
            );
          });
        }, SETTLE_DELAY_MS),
      );
    }
  });
}
