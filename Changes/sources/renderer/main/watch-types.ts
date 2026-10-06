import type { SoundOption } from "../lib/alert-sounds";

export type WatchStatus = "idle" | "watching" | "changed" | "error";

export interface Watch {
  id: string;
  url: string;
  label: string;
  intervalSeconds: number;
  sound: SoundOption;
  jsonNormalize: boolean;
  ignorePaths: string[];
  cacheBust: boolean;
  showDiff: boolean;
  enabled: boolean;
  lastHash: string | null;
  lastCheckedAt: number | null;
  lastChangedAt: number | null;
  lastStatus: WatchStatus;
  lastError: string | null;
}

export interface WatchInput {
  url: string;
  label: string;
  intervalSeconds: number;
  sound: SoundOption;
  jsonNormalize: boolean;
  ignorePaths: string[];
  cacheBust: boolean;
  showDiff: boolean;
}

export type IntervalUnit = "seconds" | "minutes" | "hours";

const UNIT_SECONDS: Record<IntervalUnit, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
};

export function toSeconds(value: number, unit: IntervalUnit): number {
  return Math.max(5, Math.round(value * UNIT_SECONDS[unit]));
}

export function fromSeconds(totalSeconds: number): { value: number; unit: IntervalUnit } {
  if (totalSeconds % 3600 === 0 && totalSeconds >= 3600) return { value: totalSeconds / 3600, unit: "hours" };
  if (totalSeconds % 60 === 0 && totalSeconds >= 60) return { value: totalSeconds / 60, unit: "minutes" };
  return { value: totalSeconds, unit: "seconds" };
}

export function formatInterval(totalSeconds: number): string {
  const { value, unit } = fromSeconds(totalSeconds);
  const label = unit === "seconds" ? "sec" : unit === "minutes" ? "min" : "hr";
  return `Every ${value} ${label}${value === 1 ? "" : "s"}`;
}

export function formatRelative(timestamp: number | null): string {
  if (!timestamp) return "never";
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return "just now";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
