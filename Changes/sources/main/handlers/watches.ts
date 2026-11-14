import { ipcMain } from "@glaze/core/backend";

import {
  addWatch,
  checkWatchNow,
  getWatches,
  removeWatch,
  setWatchEnabled,
  updateWatch,
  validateIgnorePaths,
  type WatchInput,
} from "../services/watch-service.js";
import { coerceSoundOption } from "../services/sound-options.js";
import { dismissAlerts, getAlertPayload, openChangedUrl } from "../windows/alert-window.js";

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid arguments: expected an object");
  }
  return value as Record<string, unknown>;
}

function requireId(value: unknown): string {
  const { id } = asRecord(value);
  if (typeof id !== "string" || id.length === 0) throw new Error("Invalid arguments: 'id' is required");
  return id;
}

function parseWatchInput(value: unknown): WatchInput {
  const v = asRecord(value);
  const url = typeof v.url === "string" ? v.url.trim() : "";
  if (!/^https?:\/\//i.test(url)) {
    throw new Error("Invalid arguments: 'url' must start with http:// or https://");
  }
  const intervalSeconds = typeof v.intervalSeconds === "number" && Number.isFinite(v.intervalSeconds)
    ? Math.floor(v.intervalSeconds)
    : 300;
  const jsonNormalize = v.jsonNormalize === true;
  const ignorePaths = Array.isArray(v.ignorePaths)
    ? v.ignorePaths.filter((p): p is string => typeof p === "string" && p.trim().length > 0).map((p) => p.trim())
    : [];

  if (jsonNormalize && ignorePaths.length > 0) validateIgnorePaths(ignorePaths);

  return {
    url,
    label: typeof v.label === "string" ? v.label.trim() : "",
    intervalSeconds,
    sound: coerceSoundOption(v.sound),
    jsonNormalize,
    ignorePaths,
    cacheBust: v.cacheBust === true,
    showDiff: v.showDiff === true,
  };
}

export function registerWatchHandlers(): void {
  ipcMain.handle("watches:list", async () => getWatches());

  ipcMain.handle("watches:add", async (_event, input: unknown) => addWatch(parseWatchInput(input)), {
    isMutation: true,
  });

  ipcMain.handle(
    "watches:update",
    async (_event, args: unknown) => {
      const id = requireId(args);
      return updateWatch(id, parseWatchInput(args));
    },
    { isMutation: true },
  );

  ipcMain.handle(
    "watches:setEnabled",
    async (_event, args: unknown) => {
      const v = asRecord(args);
      return setWatchEnabled(requireId(args), v.enabled === true);
    },
    { isMutation: true },
  );

  ipcMain.handle(
    "watches:remove",
    async (_event, args: unknown) => {
      await removeWatch(requireId(args));
      return { ok: true };
    },
    { isMutation: true },
  );

  ipcMain.handle("watches:checkNow", async (_event, args: unknown) => {
    await checkWatchNow(requireId(args));
    return { ok: true };
  });

  // Alert window channels
  ipcMain.handle("alert:get", async () => getAlertPayload());

  ipcMain.handle("alert:open", async (_event, args: unknown) => {
    await openChangedUrl(requireId(args));
    return { ok: true };
  });

  ipcMain.handle("alert:dismiss", async () => {
    dismissAlerts();
    return { ok: true };
  });
}
