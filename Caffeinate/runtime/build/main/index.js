
import { createRequire as __createRequire__ } from 'module';
const require = __createRequire__(import.meta.url);


// main/index.ts
import { app as app4, Menu as Menu2, logger as logger8, initDevToolsButtonState } from "@glaze/core/backend";

// main/handlers/index.ts
import * as path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { ipcMain as ipcMain3, logger as logger7 } from "@glaze/core/backend";

// main/handlers/app.ts
import { logger } from "@glaze/core/backend";
var appHandlers = {
  // Example: Get app information
  getInfo: async () => {
    logger.info("app", "App info requested");
    return {
      name: "My Glaze App",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "production"
    };
  }
  // TODO: Add your app handlers here
  // Example:
  // myMethod: async (params: { arg1: string }) => {
  //   return { result: 'success' };
  // }
};

// main/services/settings.ts
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app, logger as logger2 } from "@glaze/core/backend";
var DEFAULTS = {
  keepDisplayAwake: false,
  hideDockIcon: false
};
function isFileNotFound(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
function normalize(parsed) {
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return {
    keepDisplayAwake: typeof source.keepDisplayAwake === "boolean" ? source.keepDisplayAwake : DEFAULTS.keepDisplayAwake,
    hideDockIcon: typeof source.hideDockIcon === "boolean" ? source.hideDockIcon : DEFAULTS.hideDockIcon
  };
}
var SettingsService = class {
  cache = { ...DEFAULTS };
  settingsPath = null;
  saveQueue = Promise.resolve();
  async getSettingsPath() {
    if (!this.settingsPath) {
      const userDataPath = app.getPath("userData");
      await fs.mkdir(userDataPath, { recursive: true });
      this.settingsPath = path.join(userDataPath, "settings.json");
    }
    return this.settingsPath;
  }
  async load() {
    try {
      const data = await fs.readFile(await this.getSettingsPath(), "utf-8");
      this.cache = normalize(JSON.parse(data));
    } catch (error) {
      if (!isFileNotFound(error)) {
        logger2.error("settings", "Failed to load settings.json", error);
        throw error;
      }
      this.cache = { ...DEFAULTS };
    }
  }
  get() {
    return { ...this.cache };
  }
  async set(key, value) {
    this.cache = { ...this.cache, [key]: value };
    const snapshot = { ...this.cache };
    const save = this.saveQueue.catch(() => void 0).then(async () => {
      const filePath = await this.getSettingsPath();
      const tempPath = `${filePath}.${process.pid}.tmp`;
      try {
        await fs.writeFile(tempPath, JSON.stringify(snapshot, null, 2));
        await fs.rename(tempPath, filePath);
      } finally {
        await fs.rm(tempPath, { force: true });
      }
    });
    this.saveQueue = save;
    await save;
  }
};
var settingsService = new SettingsService();

// main/services/dock.ts
import { app as app2, ipcMain, logger as logger3 } from "@glaze/core/backend";
async function applyDockVisibility() {
  const { hideDockIcon } = settingsService.get();
  try {
    if (hideDockIcon) {
      app2.dock.hide();
    } else if (!app2.dock.isVisible()) {
      await app2.dock.show();
    }
  } catch (error) {
    logger3.error("dock", "Failed to apply dock visibility", error);
  }
}
async function setHideDock(hidden) {
  await settingsService.set("hideDockIcon", hidden);
  await applyDockVisibility();
  ipcMain.broadcast("settings:hideDockIcon-changed", { value: hidden });
  return hidden;
}

// main/windows/control-window.ts
import { BrowserWindow, logger as logger4 } from "@glaze/core/backend";

// main/windows/window-paths.ts
import * as fs2 from "fs";
import * as path2 from "path";
import { fileURLToPath, pathToFileURL } from "url";
var currentFilePath = fileURLToPath(import.meta.url);
var currentDirPath = path2.dirname(currentFilePath);
var BUILD_ROOT = path2.resolve(currentDirPath, "..");
function resolveWindowHtml(htmlFileName) {
  return path2.join(BUILD_ROOT, htmlFileName);
}
function getWindowFileUrl(htmlFileName) {
  return pathToFileURL(resolveWindowHtml(htmlFileName)).toString();
}
function getPreloadPath() {
  return path2.join(BUILD_ROOT, "assets", "preload.js");
}
async function getWindowUrl(htmlFileName) {
  const devServerHostFile = path2.join(BUILD_ROOT, "..", ".devserverhost");
  if (fs2.existsSync(devServerHostFile)) {
    try {
      const devServerHost = (await fs2.promises.readFile(devServerHostFile, "utf-8")).trim();
      if (devServerHost) {
        return `${devServerHost}/${htmlFileName}`;
      }
    } catch {
    }
  }
  return getWindowFileUrl(htmlFileName);
}

// main/windows/control-window.ts
var controlWindow = null;
function getControlWindow() {
  return controlWindow && !controlWindow.isDestroyed() ? controlWindow : null;
}
async function createControlWindow() {
  const existing = getControlWindow();
  if (existing) {
    return existing;
  }
  controlWindow = new BrowserWindow({
    width: 380,
    height: 560,
    title: "Caffeinate",
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: getPreloadPath()
    }
  });
  controlWindow.once("ready-to-show", () => {
    controlWindow?.show();
  });
  controlWindow.on("closed", () => {
    controlWindow = null;
  });
  const url = await getWindowUrl("main-window.html");
  logger4.info("main", "Loading control window", { url });
  await controlWindow.loadURL(url);
  return controlWindow;
}
async function showControlWindow() {
  const win = getControlWindow() ?? await createControlWindow();
  if (win.isMinimized()) {
    win.restore();
  }
  win.show();
  win.focus();
}

// main/tray/tray-controller.ts
import { app as app3, Tray, Menu, dialog, logger as logger6 } from "@glaze/core/backend";

// main/services/keep-awake.ts
import { powerSaveBlocker, Notification, ipcMain as ipcMain2, logger as logger5 } from "@glaze/core/backend";
var blockerId = null;
var activeType = null;
var mode = "off";
var endsAt = null;
var endTimer = null;
var listeners = /* @__PURE__ */ new Set();
function desiredType() {
  return settingsService.get().keepDisplayAwake ? "prevent-display-sleep" : "prevent-app-suspension";
}
function startBlocker() {
  const type = desiredType();
  if (blockerId !== null && powerSaveBlocker.isStarted(blockerId) && activeType === type) {
    return;
  }
  stopBlocker();
  blockerId = powerSaveBlocker.start(type);
  activeType = type;
  logger5.info("keep-awake", "Power save blocker started", { id: blockerId, type });
}
function stopBlocker() {
  if (blockerId !== null && powerSaveBlocker.isStarted(blockerId)) {
    powerSaveBlocker.stop(blockerId);
    logger5.info("keep-awake", "Power save blocker stopped", { id: blockerId });
  }
  blockerId = null;
  activeType = null;
}
function clearTimers() {
  if (endTimer) {
    clearTimeout(endTimer);
    endTimer = null;
  }
}
function getStatus() {
  return {
    active: mode !== "off",
    mode,
    keepDisplayAwake: settingsService.get().keepDisplayAwake,
    endsAt
  };
}
function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function emit() {
  const state = getStatus();
  for (const listener of listeners) {
    try {
      listener(state);
    } catch (error) {
      logger5.error("keep-awake", "Status listener threw", error);
    }
  }
  ipcMain2.broadcast("keepAwake:statusChanged", state);
}
function beginTimed(end) {
  clearTimers();
  mode = "timed";
  endsAt = end;
  startBlocker();
  endTimer = setTimeout(handleExpiry, Math.max(0, end - Date.now()));
  emit();
}
function handleExpiry() {
  stop();
  if (Notification.isSupported()) {
    try {
      new Notification({
        title: "Caffeinate",
        body: "Time's up \u2014 your Mac can sleep again."
      }).show();
    } catch (error) {
      logger5.error("keep-awake", "Failed to show expiry notification", error);
    }
  }
}
function startIndefinite() {
  clearTimers();
  mode = "indefinite";
  endsAt = null;
  startBlocker();
  emit();
  return getStatus();
}
function startFor(durationMs) {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs <= 0) {
    return getStatus();
  }
  beginTimed(Date.now() + durationMs);
  return getStatus();
}
function startAt(end) {
  if (typeof end !== "number" || !Number.isFinite(end) || end <= Date.now()) {
    return getStatus();
  }
  beginTimed(end);
  return getStatus();
}
function stop() {
  clearTimers();
  stopBlocker();
  mode = "off";
  endsAt = null;
  emit();
  return getStatus();
}
async function setKeepDisplayAwake(value) {
  await settingsService.set("keepDisplayAwake", value);
  if (mode !== "off") {
    startBlocker();
  }
  emit();
  return getStatus();
}
function shutdown() {
  clearTimers();
  stopBlocker();
}

// main/tray/tray-controller.ts
var TRAY_GUID = "b3f1c2a4-7d8e-4f2a-9c1b-2e5a6f0d3c47";
var PRESETS = [
  { label: "15 minutes", ms: 15 * 60 * 1e3 },
  { label: "30 minutes", ms: 30 * 60 * 1e3 },
  { label: "1 hour", ms: 60 * 60 * 1e3 },
  { label: "2 hours", ms: 2 * 60 * 60 * 1e3 },
  { label: "5 hours", ms: 5 * 60 * 60 * 1e3 }
];
var tray = null;
var ticker = null;
var unsubscribe = null;
function pad(n) {
  return n.toString().padStart(2, "0");
}
function formatCountdown(ms) {
  const total = Math.max(0, Math.round(ms / 1e3));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
function formatEndTime(endsAt2) {
  const end = new Date(endsAt2);
  const sameDay = end.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
  return sameDay ? end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : end.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function statusLabel(state) {
  if (state.mode === "timed" && state.endsAt) return `Awake until ${formatEndTime(state.endsAt)}`;
  if (state.mode === "indefinite") return "Keeping awake";
  return "Sleep allowed";
}
function tooltip(state) {
  return `Caffeinate \u2014 ${statusLabel(state)}`;
}
async function promptAndStartUntil() {
  if (!tray) return;
  const bounds = tray.getBounds();
  const now = Date.now();
  try {
    const result = await dialog.showDatePicker({
      mode: "dateAndTime",
      x: Math.round(bounds.x),
      y: Math.round(bounds.y + bounds.height + 4),
      initialValue: new Date(now + 60 * 60 * 1e3).toISOString(),
      min: new Date(now + 60 * 1e3).toISOString()
    });
    if (result.canceled || !result.value) return;
    startAt(new Date(result.value).getTime());
  } catch (error) {
    logger6.error("tray", "Date picker failed", error);
  }
}
function buildMenu(state) {
  const template = [
    { label: statusLabel(state), enabled: false },
    { type: "separator" },
    {
      label: "Keep Awake Indefinitely",
      type: "checkbox",
      checked: state.mode === "indefinite",
      click: () => {
        if (state.mode === "indefinite") {
          stop();
        } else {
          startIndefinite();
        }
      }
    },
    {
      label: "Keep Awake For",
      submenu: PRESETS.map((preset) => ({
        label: preset.label,
        type: "radio",
        checked: false,
        click: () => {
          startFor(preset.ms);
        }
      }))
    },
    {
      label: "Keep Awake Until\u2026",
      click: () => {
        void promptAndStartUntil();
      }
    },
    { type: "separator" },
    {
      label: "Allow Sleep Now",
      enabled: state.active,
      click: () => {
        stop();
      }
    },
    { type: "separator" },
    {
      label: "Keep Display Awake",
      type: "checkbox",
      checked: state.keepDisplayAwake,
      click: () => {
        void setKeepDisplayAwake(!state.keepDisplayAwake);
      }
    },
    {
      label: "Hide Dock Icon",
      type: "checkbox",
      checked: settingsService.get().hideDockIcon,
      click: () => {
        void setHideDock(!settingsService.get().hideDockIcon);
      }
    },
    {
      label: "Start at Login",
      type: "checkbox",
      checked: app3.getLoginItemSettings().openAtLogin,
      click: () => {
        app3.setLoginItemSettings({ openAtLogin: !app3.getLoginItemSettings().openAtLogin });
      }
    },
    { type: "separator" },
    {
      label: "Open Caffeinate",
      click: () => {
        void showControlWindow();
      }
    },
    { label: "Quit Caffeinate", role: "quit" }
  ];
  return Menu.buildFromTemplate(template);
}
function updateTitle() {
  if (!tray) return;
  const state = getStatus();
  if (state.mode === "timed" && state.endsAt) {
    tray.setTitle(formatCountdown(state.endsAt - Date.now()), { fontType: "monospacedDigit" });
  } else {
    tray.setTitle("");
  }
}
function configureTicker(state) {
  if (state.mode === "timed" && state.endsAt) {
    if (!ticker) ticker = setInterval(updateTitle, 1e3);
    updateTitle();
  } else {
    if (ticker) {
      clearInterval(ticker);
      ticker = null;
    }
    tray?.setTitle("");
  }
}
function render(state) {
  if (!tray) return;
  tray.setImage(state.active ? "cup.and.saucer.fill" : "cup.and.saucer");
  tray.setToolTip(tooltip(state));
  tray.setContextMenu(buildMenu(state));
  configureTicker(state);
}
function createTray() {
  if (tray) return;
  tray = new Tray("cup.and.saucer", TRAY_GUID);
  unsubscribe = subscribe(render);
  render(getStatus());
  logger6.info("tray", "Tray created");
}
function destroyTray() {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
  unsubscribe?.();
  unsubscribe = null;
  tray?.destroy();
  tray = null;
}

// main/handlers/index.ts
var __filename = fileURLToPath2(import.meta.url);
var __dirname = path3.dirname(__filename);
function asBoolean(value) {
  return value === true;
}
function asPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
function registerHandlers() {
  logger7.info("handlers", "Registering IPC handlers...");
  ipcMain3.handle("app:getInfo", async () => appHandlers.getInfo());
  ipcMain3.handle("app:getProjectPath", async () => path3.join(__dirname, "..", ".."));
  ipcMain3.handle("keepAwake:getStatus", async () => getStatus());
  ipcMain3.handle("keepAwake:startIndefinite", async () => startIndefinite());
  ipcMain3.handle("keepAwake:startFor", async (_event, durationMs) => startFor(asPositiveNumber(durationMs)));
  ipcMain3.handle("keepAwake:startUntil", async () => {
    await promptAndStartUntil();
    return getStatus();
  });
  ipcMain3.handle("keepAwake:startAt", async (_event, endMs) => startAt(asPositiveNumber(endMs)));
  ipcMain3.handle("keepAwake:stop", async () => stop());
  ipcMain3.handle(
    "keepAwake:setKeepDisplayAwake",
    async (_event, value) => setKeepDisplayAwake(asBoolean(value))
  );
  ipcMain3.handle("settings:get", async () => settingsService.get());
  ipcMain3.handle("settings:setHideDock", async (_event, value) => setHideDock(asBoolean(value)));
  ipcMain3.handle("window:openControls", async () => {
    await showControlWindow();
  });
  logger7.info("handlers", "\u2713 IPC handlers registered");
}

// main/index.ts
registerHandlers();
var devHarness = null;
var appAiDevHarness = null;
if (false) {
  devHarness = await null;
  devHarness.applyParityScenarioStartup();
  appAiDevHarness = await null;
}
async function setupApplicationMenu() {
  await initDevToolsButtonState();
  const menu = Menu2.buildFromTemplate([
    {
      label: "App",
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Caffeinate Controls\u2026",
          icon: "cup.and.saucer",
          accelerator: "Command+,",
          click: () => void showControlWindow()
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" }
  ]);
  Menu2.setApplicationMenu(menu);
  logger8.info("main", "Application menu configured");
}
app4.on("window-all-closed", () => {
});
app4.on("activate", (hasVisibleWindows) => {
  void applyDockVisibility();
  if (!hasVisibleWindows) {
    void showControlWindow();
  }
});
app4.on("before-quit", () => {
  logger8.info("main", "App before-quit, releasing power assertion...");
  shutdown();
});
app4.on("will-quit", () => {
  destroyTray();
});
app4.whenReady().then(async () => {
  await devHarness?.runParityAutotestIfRequested();
  await appAiDevHarness?.runAppAiAutotest();
  await settingsService.load();
  await setupApplicationMenu();
  createTray();
  await applyDockVisibility();
  createControlWindow().catch((error) => {
    logger8.error("main", "Failed to create control window", error);
  });
});
//# sourceMappingURL=index.js.map
