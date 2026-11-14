/**
 * Handler Registration
 *
 * Thin IPC boundary — all business logic lives in main/services/. Inputs are
 * validated here before reaching the services.
 */

import * as path from "path";
import { fileURLToPath } from "url";

import { ipcMain, logger } from "@glaze/core/backend";

import { appHandlers } from "./app.js";
import { settingsService } from "../services/settings.js";
import { setHideDock } from "../services/dock.js";
import { showControlWindow } from "../windows/control-window.js";
import { promptAndStartUntil } from "../tray/tray-controller.js";
import {
  getStatus,
  startIndefinite,
  startFor,
  startAt,
  stop,
  setKeepDisplayAwake,
} from "../services/keep-awake.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asPositiveNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

export function registerHandlers(): void {
  logger.info("handlers", "Registering IPC handlers...");

  ipcMain.handle("app:getInfo", async () => appHandlers.getInfo());
  ipcMain.handle("app:getProjectPath", async () => path.join(__dirname, "..", ".."));

  // ── Keep-awake ──────────────────────────────────────────────────────
  ipcMain.handle("keepAwake:getStatus", async () => getStatus());
  ipcMain.handle("keepAwake:startIndefinite", async () => startIndefinite());
  ipcMain.handle("keepAwake:startFor", async (_event, durationMs: unknown) => startFor(asPositiveNumber(durationMs)));
  ipcMain.handle("keepAwake:startUntil", async () => {
    await promptAndStartUntil();
    return getStatus();
  });
  ipcMain.handle("keepAwake:startAt", async (_event, endMs: unknown) => startAt(asPositiveNumber(endMs)));
  ipcMain.handle("keepAwake:stop", async () => stop());
  ipcMain.handle("keepAwake:setKeepDisplayAwake", async (_event, value: unknown) =>
    setKeepDisplayAwake(asBoolean(value)),
  );

  // ── Settings ────────────────────────────────────────────────────────
  ipcMain.handle("settings:get", async () => settingsService.get());
  ipcMain.handle("settings:setHideDock", async (_event, value: unknown) => setHideDock(asBoolean(value)));
  ipcMain.handle("window:openControls", async () => {
    await showControlWindow();
  });

  logger.info("handlers", "✓ IPC handlers registered");
}
