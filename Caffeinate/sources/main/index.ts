// Main process entry point - Node.js backend for Caffeinate
//
// The glaze CLI runtime automatically handles all framework wiring (IPC server,
// native bridge, lifecycle, signal handlers) before this file runs.

import { app, Menu, logger, initDevToolsButtonState } from "@glaze/core/backend";

import { registerHandlers } from "./handlers/index.js";
import { settingsService } from "./services/settings.js";
import { shutdown as shutdownKeepAwake } from "./services/keep-awake.js";
import { applyDockVisibility } from "./services/dock.js";
import { createTray, destroyTray } from "./tray/tray-controller.js";
import { createControlWindow, showControlWindow } from "./windows/control-window.js";

// ── IPC Handlers ──────────────────────────────────────────────────────
// ipcMain is already wired to the IPC server by the runtime bootstrap.
registerHandlers();

// ── Dev-only parity harness ───────────────────────────────────────────
// The parity autotest lives in main/dev/, which is excluded from scaffolded
// apps. The build (build-backend) defines GLAZE_DEV_HARNESS="1" only when that
// directory is present, so esbuild dead-code-eliminates this block — and never
// resolves the missing module — for user apps. A no-op unless a scenario env var
// is set even in the template.
type DevHarness = {
  applyParityScenarioStartup(): void;
  runParityAutotestIfRequested(): Promise<void>;
};
type AppAiDevHarness = {
  runAppAiAutotest(): Promise<void>;
};
let devHarness: DevHarness | null = null;
let appAiDevHarness: AppAiDevHarness | null = null;
if (process.env.GLAZE_DEV_HARNESS === "1") {
  // @ts-ignore dev-only harness; present only in the template, excluded from scaffolded apps
  devHarness = (await import("./dev/parity-autotest.js")) as DevHarness;
  devHarness.applyParityScenarioStartup();
  // @ts-ignore dev-only harness; present only in the template, excluded from scaffolded apps
  appAiDevHarness = (await import("./dev/app-ai-autotest.js")) as AppAiDevHarness;
}

// ── Application menu ──────────────────────────────────────────────────
async function setupApplicationMenu() {
  await initDevToolsButtonState();
  const menu = Menu.buildFromTemplate([
    {
      label: "App",
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Caffeinate Controls…",
          icon: "cup.and.saucer",
          accelerator: "Command+,",
          click: () => void showControlWindow(),
        },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ]);
  Menu.setApplicationMenu(menu);
  logger.info("main", "Application menu configured");
}

// ── Lifecycle events ──────────────────────────────────────────────────
// Menu-bar utility: stay resident in the tray when all windows close.
app.on("window-all-closed", () => {
  // Intentionally no-op — the app keeps running in the menu bar.
});

app.on("activate", (hasVisibleWindows) => {
  // macOS re-shows the Dock tile on activate; re-apply the hide preference.
  void applyDockVisibility();
  if (!hasVisibleWindows) {
    void showControlWindow();
  }
});

app.on("before-quit", () => {
  logger.info("main", "App before-quit, releasing power assertion...");
  shutdownKeepAwake();
});

app.on("will-quit", () => {
  destroyTray();
});

// ── App ready ─────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  await devHarness?.runParityAutotestIfRequested();
  await appAiDevHarness?.runAppAiAutotest();

  await settingsService.load();
  await setupApplicationMenu();

  createTray();
  await applyDockVisibility();

  createControlWindow().catch((error) => {
    logger.error("main", "Failed to create control window", error);
  });
});
