import * as fs from "fs";

import { ipcMain } from "@glaze/core/backend";

import { toolPaths } from "./harness-paths.js";

const watchers: fs.FSWatcher[] = [];
let timer: NodeJS.Timeout | null = null;

function broadcast(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    ipcMain.broadcast("harness:changed", { at: Date.now() });
  }, 400);
}

/** Watches each tool's config so the UI refreshes when something else edits it. */
export function startConfigWatcher(): void {
  for (const tool of toolPaths()) {
    if (!tool.configFile) continue;
    try {
      const watcher = fs.watch(tool.configFile, broadcast);
      watcher.on("error", () => {
        /* The file may not exist yet; a missing tool just isn't watched. */
      });
      watchers.push(watcher);
    } catch {
      // Tool isn't installed.
    }
  }
}

export function stopConfigWatcher(): void {
  if (timer) clearTimeout(timer);
  for (const watcher of watchers) watcher.close();
  watchers.length = 0;
}
