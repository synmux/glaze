// Main process entry point - Node.js backend for Switchcraft.
//
// Switchcraft is a menu bar app: no Dock icon and no main window. The tray menu applies
// presets; Preferences is the only window.

import {
  app,
  Menu,
  logger,
  initDevToolsButtonState,
} from "@glaze/core/backend";

import { registerHandlers } from "./handlers/index.js";
import {
  startSwitchcraft,
  stopSwitchcraft,
} from "./services/app-controller.js";
import { openSettingsWindow } from "./windows/settings-window.js";

// ── IPC Handlers ──────────────────────────────────────────────────────
// ipcMain is already wired to the IPC server by the runtime bootstrap.
registerHandlers();

// ── Dev-only parity harness ───────────────────────────────────────────
// The parity autotest lives in main/dev/, which is excluded from scaffolded
// apps. The build (build-backend) defines GLAZE_DEV_HARNESS="1" only when that
// directory is present, so esbuild dead-code-eliminates this block — and never
// resolves the missing module — for user apps.
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
  appAiDevHarness =
    (await import("./dev/app-ai-autotest.js")) as AppAiDevHarness;
}

// Ignore activation that is part of launching; respond only to later re-opens.
const ACTIVATE_GRACE_MS = 3000;
let readyAt: number | null = null;

// ── Application menu (shown while Preferences is focused) ─────────────
async function setupApplicationMenu() {
  await initDevToolsButtonState();
  const menu = Menu.buildFromTemplate([
    {
      label: "Switchcraft",
      submenu: [
        { role: "about" },
        { type: "separator" },
        {
          label: "Preferences…",
          icon: "gearshape",
          accelerator: "Command+,",
          click: async () => await openSettingsWindow(),
        },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ]);
  Menu.setApplicationMenu(menu);
}

// ── Lifecycle events ──────────────────────────────────────────────────
app.on("window-all-closed", () => {
  // Menu bar app: keep running with no windows open.
});

app.on("activate", (hasVisibleWindows) => {
  // Opening Switchcraft again (e.g. from Finder) while it's running shows Preferences.
  if (readyAt === null || Date.now() - readyAt < ACTIVATE_GRACE_MS) return;
  if (!hasVisibleWindows) {
    openSettingsWindow().catch((error: unknown) => {
      logger.error("main", "Couldn't open Preferences on activate", {
        error: String(error),
      });
    });
  }
});

app.on("before-quit", () => {
  logger.info("main", "Quitting; stopping Switchcraft services");
  stopSwitchcraft().catch((error: unknown) => {
    logger.error("main", "Cleanup failed while quitting", {
      error: String(error),
    });
  });
});

// ── App ready ─────────────────────────────────────────────────────────
app
  .whenReady()
  .then(async () => {
    readyAt = Date.now();
    await devHarness?.runParityAutotestIfRequested();
    await appAiDevHarness?.runAppAiAutotest();

    await setupApplicationMenu();
    await startSwitchcraft();
    logger.info("main", "Switchcraft is running in the menu bar");
  })
  .catch((error: unknown) => {
    logger.error("main", "Switchcraft failed to start", {
      error: String(error),
    });
  });
