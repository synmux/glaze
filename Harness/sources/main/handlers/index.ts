/**
 * Handler Registration
 *
 * Register all your IPC handlers here
 */

import * as path from "path";
import { fileURLToPath } from "url";

import { appHandlers } from "./app.js";
import { harnessHandlers } from "./harness.js";
import { getSettingsWindow, openSettingsWindow } from "../windows/settings-window.js";

import { ipcMain, logger } from "@glaze/core/backend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerHandlers(): void {
  logger.info("handlers", "Registering IPC handlers...");

  // Register app handlers using ipcMain API
  ipcMain.handle("app:getInfo", async (_event) => {
    return await appHandlers.getInfo();
  });

  // Return the .glaze project path (used for deep links back to the host)
  // __dirname = build/main, so two levels up is the app root
  ipcMain.handle("app:getProjectPath", async () => {
    return path.join(__dirname, "..", "..");
  });

  // Settings window handlers
  ipcMain.handle("window:openSettings", async (_event) => {
    await openSettingsWindow();
  });

  ipcMain.handle("window:closeSettings", async (_event) => {
    getSettingsWindow()?.close();
  });

  ipcMain.handle("harness:overview", (_event) => harnessHandlers.overview());
  ipcMain.handle("harness:saveServer", (_event, input: unknown) => harnessHandlers.saveServer(input));
  ipcMain.handle("harness:deleteServer", (_event, id: unknown) => harnessHandlers.deleteServer(id));
  ipcMain.handle("harness:setTarget", (_event, id: unknown, tool: unknown, enabled: unknown) =>
    harnessHandlers.setTarget(id, tool, enabled),
  );
  ipcMain.handle("harness:importServer", (_event, name: unknown) =>
    harnessHandlers.importServer(name),
  );
  ipcMain.handle("harness:takeToolVersion", (_event, id: unknown, tool: unknown) =>
    harnessHandlers.takeToolVersion(id, tool),
  );
  ipcMain.handle("harness:applyAll", (_event) => harnessHandlers.applyAll());

  ipcMain.handle("harness:skills", (_event) => harnessHandlers.skills());
  ipcMain.handle("harness:setSkillTarget", (_event, name: unknown, tool: unknown, enabled: unknown) =>
    harnessHandlers.setSkillTarget(name, tool, enabled),
  );
  ipcMain.handle("harness:addSkill", (_event) => harnessHandlers.addSkill());
  ipcMain.handle("harness:migrationPlan", (_event) => harnessHandlers.migrationPlan());
  ipcMain.handle("harness:migrateSkills", (_event) => harnessHandlers.migrateSkills());
  ipcMain.handle("harness:deleteSkill", (_event, name: unknown) => harnessHandlers.deleteSkill(name));
  ipcMain.handle("harness:revealSkill", (_event, name: unknown) => harnessHandlers.revealSkill(name));

  ipcMain.handle("harness:plugins", (_event) => harnessHandlers.plugins());
  ipcMain.handle("harness:setPluginEnabled", (_event, tool: unknown, id: unknown, enabled: unknown) =>
    harnessHandlers.setPluginEnabled(tool, id, enabled),
  );

  ipcMain.handle("harness:getSettings", (_event) => harnessHandlers.getSettings());
  ipcMain.handle("harness:saveSettings", (_event, input: unknown) =>
    harnessHandlers.saveSettings(input),
  );
  ipcMain.handle("harness:backups", (_event) => harnessHandlers.backups());
  ipcMain.handle("harness:revealBackups", (_event) => harnessHandlers.revealBackups());
  ipcMain.handle("harness:revealLibrary", (_event) => harnessHandlers.revealLibrary());

  logger.info("handlers", "✓ IPC handlers registered");
}
