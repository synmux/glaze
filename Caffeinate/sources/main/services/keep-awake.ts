/**
 * Keep-awake engine — the single source of truth for sleep-prevention state.
 *
 * Uses the SDK `powerSaveBlocker` (the same IOKit power-assertion mechanism the
 * `caffeinate` CLI drives) so there is no child process to manage or leak.
 *   - "prevent-app-suspension" → system stays awake, display may sleep (default)
 *   - "prevent-display-sleep"  → system + display stay awake ("keep display on")
 *
 * State changes are broadcast to renderer windows via `keepAwake:statusChanged`
 * and to in-process subscribers (the tray controller) via `subscribe`.
 */

import { powerSaveBlocker, Notification, ipcMain, logger } from "@glaze/core/backend";

import { settingsService } from "./settings.js";

export type KeepAwakeMode = "off" | "indefinite" | "timed";

export interface KeepAwakeState {
  active: boolean;
  mode: KeepAwakeMode;
  keepDisplayAwake: boolean;
  /** Epoch ms when a timed session ends, or null for off/indefinite. */
  endsAt: number | null;
}

type PowerSaveBlockerType = "prevent-app-suspension" | "prevent-display-sleep";
type Listener = (state: KeepAwakeState) => void;

let blockerId: number | null = null;
let activeType: PowerSaveBlockerType | null = null;
let mode: KeepAwakeMode = "off";
let endsAt: number | null = null;
let endTimer: ReturnType<typeof setTimeout> | null = null;

const listeners = new Set<Listener>();

function desiredType(): PowerSaveBlockerType {
  return settingsService.get().keepDisplayAwake ? "prevent-display-sleep" : "prevent-app-suspension";
}

function startBlocker(): void {
  const type = desiredType();
  if (blockerId !== null && powerSaveBlocker.isStarted(blockerId) && activeType === type) {
    return;
  }
  stopBlocker();
  blockerId = powerSaveBlocker.start(type);
  activeType = type;
  logger.info("keep-awake", "Power save blocker started", { id: blockerId, type });
}

function stopBlocker(): void {
  if (blockerId !== null && powerSaveBlocker.isStarted(blockerId)) {
    powerSaveBlocker.stop(blockerId);
    logger.info("keep-awake", "Power save blocker stopped", { id: blockerId });
  }
  blockerId = null;
  activeType = null;
}

function clearTimers(): void {
  if (endTimer) {
    clearTimeout(endTimer);
    endTimer = null;
  }
}

export function getStatus(): KeepAwakeState {
  return {
    active: mode !== "off",
    mode,
    keepDisplayAwake: settingsService.get().keepDisplayAwake,
    endsAt,
  };
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(): void {
  const state = getStatus();
  for (const listener of listeners) {
    try {
      listener(state);
    } catch (error) {
      logger.error("keep-awake", "Status listener threw", error);
    }
  }
  ipcMain.broadcast("keepAwake:statusChanged", state);
}

function beginTimed(end: number): void {
  clearTimers();
  mode = "timed";
  endsAt = end;
  startBlocker();
  endTimer = setTimeout(handleExpiry, Math.max(0, end - Date.now()));
  emit();
}

function handleExpiry(): void {
  stop();
  if (Notification.isSupported()) {
    try {
      new Notification({
        title: "Caffeinate",
        body: "Time's up — your Mac can sleep again.",
      }).show();
    } catch (error) {
      logger.error("keep-awake", "Failed to show expiry notification", error);
    }
  }
}

export function startIndefinite(): KeepAwakeState {
  clearTimers();
  mode = "indefinite";
  endsAt = null;
  startBlocker();
  emit();
  return getStatus();
}

export function startFor(durationMs: number): KeepAwakeState {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs <= 0) {
    return getStatus();
  }
  beginTimed(Date.now() + durationMs);
  return getStatus();
}

export function startAt(end: number): KeepAwakeState {
  if (typeof end !== "number" || !Number.isFinite(end) || end <= Date.now()) {
    return getStatus();
  }
  beginTimed(end);
  return getStatus();
}

export function stop(): KeepAwakeState {
  clearTimers();
  stopBlocker();
  mode = "off";
  endsAt = null;
  emit();
  return getStatus();
}

export async function setKeepDisplayAwake(value: boolean): Promise<KeepAwakeState> {
  await settingsService.set("keepDisplayAwake", value);
  if (mode !== "off") {
    startBlocker(); // restart with the new assertion type
  }
  emit();
  return getStatus();
}

/** Release the assertion and clear timers on quit. Does not emit. */
export function shutdown(): void {
  clearTimers();
  stopBlocker();
}
