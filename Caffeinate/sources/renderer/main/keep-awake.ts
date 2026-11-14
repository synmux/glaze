/**
 * Renderer-side keep-awake API + shared types.
 *
 * All backend access goes through the exposed `window.glazeAPI.glaze.ipc` bridge.
 * Types mirror the backend contract in main/services/keep-awake.ts + settings.ts.
 */

export type KeepAwakeMode = "off" | "indefinite" | "timed";

export interface KeepAwakeState {
  active: boolean;
  mode: KeepAwakeMode;
  keepDisplayAwake: boolean;
  endsAt: number | null;
}

export interface AppSettings {
  keepDisplayAwake: boolean;
  hideDockIcon: boolean;
}

export const DEFAULT_STATE: KeepAwakeState = {
  active: false,
  mode: "off",
  keepDisplayAwake: false,
  endsAt: null,
};

export const DEFAULT_SETTINGS: AppSettings = {
  keepDisplayAwake: false,
  hideDockIcon: false,
};

const ipc = () => window.glazeAPI.glaze.ipc;

export const keepAwakeApi = {
  getStatus: () => ipc().invoke<KeepAwakeState>("keepAwake:getStatus"),
  startIndefinite: () => ipc().invoke<KeepAwakeState>("keepAwake:startIndefinite"),
  startFor: (durationMs: number) => ipc().invoke<KeepAwakeState>("keepAwake:startFor", durationMs),
  startUntil: () => ipc().invoke<KeepAwakeState>("keepAwake:startUntil"),
  startAt: (endMs: number) => ipc().invoke<KeepAwakeState>("keepAwake:startAt", endMs),
  stop: () => ipc().invoke<KeepAwakeState>("keepAwake:stop"),
  setKeepDisplayAwake: (value: boolean) => ipc().invoke<KeepAwakeState>("keepAwake:setKeepDisplayAwake", value),
  getSettings: () => ipc().invoke<AppSettings>("settings:get"),
  setHideDock: (value: boolean) => ipc().invoke<boolean>("settings:setHideDock", value),
  onStatusChanged: (callback: (state: KeepAwakeState) => void): (() => void) =>
    ipc().onNotification("keepAwake:statusChanged", (params) => callback(params as KeepAwakeState)),
};

export const DURATION_PRESETS: { label: string; ms: number }[] = [
  { label: "15 min", ms: 15 * 60 * 1000 },
  { label: "30 min", ms: 30 * 60 * 1000 },
  { label: "1 hour", ms: 60 * 60 * 1000 },
  { label: "2 hours", ms: 2 * 60 * 60 * 1000 },
  { label: "5 hours", ms: 5 * 60 * 60 * 1000 },
];

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

export function formatEndTime(endsAt: number): string {
  const end = new Date(endsAt);
  const sameDay = end.toDateString() === new Date().toDateString();
  return sameDay
    ? end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : end.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
