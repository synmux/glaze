import * as fs from "fs";
import * as path from "path";

import { app, logger } from "@glaze/core/backend";

import { coerceSoundOption, type SoundOption } from "./sound-options.js";

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

const DATA_DIR = app.getPath("userData");
const FILE = path.join(DATA_DIR, "watches.json");

function coerceWatch(value: unknown): Watch | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.url !== "string") return null;
  return {
    id: v.id,
    url: v.url,
    label: typeof v.label === "string" ? v.label : "",
    intervalSeconds: typeof v.intervalSeconds === "number" ? v.intervalSeconds : 300,
    sound: coerceSoundOption(v.sound),
    jsonNormalize: v.jsonNormalize === true,
    ignorePaths: Array.isArray(v.ignorePaths) ? v.ignorePaths.filter((p): p is string => typeof p === "string") : [],
    cacheBust: v.cacheBust === true,
    showDiff: v.showDiff === true,
    enabled: v.enabled !== false,
    lastHash: typeof v.lastHash === "string" ? v.lastHash : null,
    lastCheckedAt: typeof v.lastCheckedAt === "number" ? v.lastCheckedAt : null,
    lastChangedAt: typeof v.lastChangedAt === "number" ? v.lastChangedAt : null,
    lastStatus:
      v.lastStatus === "watching" || v.lastStatus === "changed" || v.lastStatus === "error"
        ? v.lastStatus
        : "idle",
    lastError: typeof v.lastError === "string" ? v.lastError : null,
  };
}

export async function loadWatches(): Promise<Watch[]> {
  try {
    const raw = await fs.promises.readFile(FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(coerceWatch).filter((w): w is Watch => w !== null);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    logger.error("watch-store", "Failed to load watches.json", {
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

export async function saveWatches(watches: Watch[]): Promise<void> {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  await fs.promises.writeFile(FILE, JSON.stringify(watches, null, 2), "utf-8");
}
