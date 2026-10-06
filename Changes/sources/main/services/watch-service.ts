import * as crypto from "crypto";

import { JSONPath } from "jsonpath-plus";

import { app, ipcMain, logger } from "@glaze/core/backend";

import { loadWatches, saveWatches, type Watch } from "./watch-store.js";
import type { SoundOption } from "./sound-options.js";
import { computeLineDiff } from "./text-diff.js";
import { showChangeAlert } from "../windows/alert-window.js";

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

const MIN_INTERVAL_SECONDS = 5;
const FETCH_TIMEOUT_MS = 20000;

const timers = new Map<string, ReturnType<typeof setInterval>>();
let watches: Watch[] = [];
let started = false;

// In-memory only (never persisted): the last compared snapshot per watch, kept solely to
// diff against on the next change when that watch has "show diff" enabled.
const lastCompared = new Map<string, string>();

export function getWatches(): Watch[] {
  return watches;
}

function broadcast(): void {
  ipcMain.broadcast("watches:changed", { watches });
}

/** Deterministic JSON stringify with recursively sorted object keys. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

/** Delete every node matched by a JSONPath expression, deepest matches first. */
function stripJsonPath(root: unknown, path: string): void {
  const pointers = JSONPath({ path, json: root as object, resultType: "pointer", eval: false }) as string[];
  const sorted = [...pointers].sort((a, b) => b.length - a.length);

  for (const pointer of sorted) {
    if (pointer === "") continue; // Ignoring the whole document is a no-op for diffing.
    const segments = pointer
      .split("/")
      .slice(1)
      .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
    const lastKey = segments.pop();
    if (lastKey === undefined) continue;

    let parent: unknown = root;
    for (const segment of segments) {
      if (parent === null || typeof parent !== "object") {
        parent = null;
        break;
      }
      parent = (parent as Record<string, unknown>)[segment];
    }
    if (parent === null || typeof parent !== "object") continue;

    if (Array.isArray(parent)) {
      const index = Number(lastKey);
      if (Number.isInteger(index) && index >= 0 && index < parent.length) parent.splice(index, 1);
    } else {
      delete (parent as Record<string, unknown>)[lastKey];
    }
  }
}

function normalizeContent(text: string, jsonNormalize: boolean, ignorePaths: string[]): string {
  if (!jsonNormalize) return text;
  try {
    const parsed: unknown = JSON.parse(text);
    for (const path of ignorePaths) {
      try {
        stripJsonPath(parsed, path);
      } catch (err) {
        logger.warn("watch-service", "Skipping invalid ignore path", {
          path,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    return stableStringify(parsed);
  } catch {
    // Not valid JSON — fall back to comparing the raw body.
    return text;
  }
}

/** Throws if any expression is not a syntactically valid JSONPath. */
export function validateIgnorePaths(paths: string[]): void {
  for (const path of paths) {
    try {
      JSONPath({ path, json: {}, resultType: "pointer", eval: false });
    } catch (err) {
      throw new Error(`Invalid JSONPath expression "${path}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/** Appends a random 8-character GET parameter to defeat caches, using `&` if the URL already has a query string. */
function appendCacheBuster(url: string): string {
  const value = crypto.randomBytes(4).toString("hex");
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${value}`;
}

function clearWatchTimer(id: string): void {
  const t = timers.get(id);
  if (t) {
    clearInterval(t);
    timers.delete(id);
  }
}

function scheduleWatch(watch: Watch): void {
  clearWatchTimer(watch.id);
  if (!watch.enabled) return;
  const ms = Math.max(MIN_INTERVAL_SECONDS, watch.intervalSeconds) * 1000;
  timers.set(
    watch.id,
    setInterval(() => {
      void checkWatch(watch);
    }, ms),
  );
}

async function checkWatch(watch: Watch): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const fetchUrl = watch.cacheBust ? appendCacheBuster(watch.url) : watch.url;
    const res = await fetch(fetchUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "cache-control": "no-cache", pragma: "no-cache" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    const text = await res.text();
    const normalized = normalizeContent(text, watch.jsonNormalize, watch.jsonNormalize ? watch.ignorePaths : []);
    const hash = crypto.createHash("sha256").update(normalized).digest("hex");

    watch.lastCheckedAt = Date.now();
    watch.lastError = null;

    if (watch.lastHash === null) {
      // First successful fetch establishes the baseline; not a change.
      watch.lastHash = hash;
      watch.lastStatus = "watching";
    } else if (watch.lastHash !== hash) {
      watch.lastHash = hash;
      watch.lastChangedAt = Date.now();
      watch.lastStatus = "changed";
      // Comparing the same normalized form used for hashing, so with JSON normalization on,
      // the diff is between both normalized versions rather than the raw fetched bodies.
      const previous = lastCompared.get(watch.id);
      const diff = watch.showDiff && previous !== undefined ? computeLineDiff(previous, normalized) : undefined;
      await showChangeAlert(
        {
          id: watch.id,
          label: watch.label || watch.url,
          url: watch.url,
          changedAt: watch.lastChangedAt,
          sound: watch.sound,
          diff,
        },
        watch.sound,
      );
    } else {
      watch.lastStatus = "watching";
    }

    if (watch.showDiff) lastCompared.set(watch.id, normalized);
    else lastCompared.delete(watch.id);
  } catch (err) {
    watch.lastCheckedAt = Date.now();
    watch.lastStatus = "error";
    watch.lastError = err instanceof Error ? err.message : String(err);
    logger.warn("watch-service", "Check failed", { url: watch.url, error: watch.lastError });
  } finally {
    clearTimeout(timeout);
    await saveWatches(watches);
    broadcast();
  }
}

export async function startWatchService(): Promise<void> {
  if (started) return;
  started = true;

  watches = await loadWatches();
  for (const watch of watches) {
    scheduleWatch(watch);
    if (watch.enabled) void checkWatch(watch);
  }

  app.on("before-quit", () => {
    for (const t of timers.values()) clearInterval(t);
    timers.clear();
  });

  logger.info("watch-service", `Started with ${watches.length} watch(es)`);
}

export async function addWatch(input: WatchInput): Promise<Watch> {
  const watch: Watch = {
    id: crypto.randomUUID(),
    url: input.url,
    label: input.label,
    intervalSeconds: Math.max(MIN_INTERVAL_SECONDS, input.intervalSeconds),
    sound: input.sound,
    jsonNormalize: input.jsonNormalize,
    ignorePaths: input.ignorePaths,
    cacheBust: input.cacheBust,
    showDiff: input.showDiff,
    enabled: true,
    lastHash: null,
    lastCheckedAt: null,
    lastChangedAt: null,
    lastStatus: "idle",
    lastError: null,
  };
  watches.push(watch);
  await saveWatches(watches);
  scheduleWatch(watch);
  void checkWatch(watch);
  broadcast();
  return watch;
}

export async function updateWatch(id: string, patch: WatchInput): Promise<Watch> {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);

  // Changing what we fetch or how we compare invalidates the stored baseline.
  const resetBaseline =
    patch.url !== watch.url ||
    patch.jsonNormalize !== watch.jsonNormalize ||
    JSON.stringify(patch.ignorePaths) !== JSON.stringify(watch.ignorePaths);

  watch.url = patch.url;
  watch.label = patch.label;
  watch.intervalSeconds = Math.max(MIN_INTERVAL_SECONDS, patch.intervalSeconds);
  watch.sound = patch.sound;
  watch.jsonNormalize = patch.jsonNormalize;
  watch.ignorePaths = patch.ignorePaths;
  watch.cacheBust = patch.cacheBust;
  watch.showDiff = patch.showDiff;

  if (resetBaseline) {
    watch.lastHash = null;
    watch.lastChangedAt = null;
    watch.lastStatus = "idle";
    watch.lastError = null;
    lastCompared.delete(watch.id);
  }

  await saveWatches(watches);
  scheduleWatch(watch);
  if (watch.enabled) void checkWatch(watch);
  broadcast();
  return watch;
}

export async function setWatchEnabled(id: string, enabled: boolean): Promise<Watch> {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);
  watch.enabled = enabled;
  await saveWatches(watches);
  scheduleWatch(watch);
  if (enabled) void checkWatch(watch);
  broadcast();
  return watch;
}

export async function removeWatch(id: string): Promise<void> {
  clearWatchTimer(id);
  lastCompared.delete(id);
  watches = watches.filter((w) => w.id !== id);
  await saveWatches(watches);
  broadcast();
}

export async function checkWatchNow(id: string): Promise<void> {
  const watch = watches.find((w) => w.id === id);
  if (!watch) throw new Error(`Watch not found: ${id}`);
  await checkWatch(watch);
}
