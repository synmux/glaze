/**
 * Tray controller — the menu bar status item and its context menu.
 *
 * Reflects keep-awake state: icon (empty vs filled cup), a live monospaced
 * countdown title for timed sessions, a descriptive tooltip, and a context menu
 * whose checkmarks/labels are rebuilt on every state change.
 */

import { app, Tray, Menu, dialog, logger, type MenuItemConstructorOptions } from "@glaze/core/backend";

import { settingsService } from "../services/settings.js";
import { setHideDock } from "../services/dock.js";
import { showControlWindow } from "../windows/control-window.js";
import {
  getStatus,
  subscribe,
  startIndefinite,
  startFor,
  startAt,
  stop,
  setKeepDisplayAwake,
  type KeepAwakeState,
} from "../services/keep-awake.js";

// Stable, hardcoded GUID literal so the menu-bar item keeps its position across
// relaunches. Never generate this at runtime.
const TRAY_GUID = "b3f1c2a4-7d8e-4f2a-9c1b-2e5a6f0d3c47";

const PRESETS: { label: string; ms: number }[] = [
  { label: "15 minutes", ms: 15 * 60 * 1000 },
  { label: "30 minutes", ms: 30 * 60 * 1000 },
  { label: "1 hour", ms: 60 * 60 * 1000 },
  { label: "2 hours", ms: 2 * 60 * 60 * 1000 },
  { label: "5 hours", ms: 5 * 60 * 60 * 1000 },
];

let tray: Tray | null = null;
let ticker: ReturnType<typeof setInterval> | null = null;
let unsubscribe: (() => void) | null = null;

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

function formatEndTime(endsAt: number): string {
  const end = new Date(endsAt);
  const sameDay = end.toDateString() === new Date().toDateString();
  return sameDay
    ? end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : end.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function statusLabel(state: KeepAwakeState): string {
  if (state.mode === "timed" && state.endsAt) return `Awake until ${formatEndTime(state.endsAt)}`;
  if (state.mode === "indefinite") return "Keeping awake";
  return "Sleep allowed";
}

function tooltip(state: KeepAwakeState): string {
  return `Caffeinate — ${statusLabel(state)}`;
}

async function promptAndStartUntil(): Promise<void> {
  if (!tray) return;
  const bounds = tray.getBounds();
  const now = Date.now();
  try {
    const result = await dialog.showDatePicker({
      mode: "dateAndTime",
      x: Math.round(bounds.x),
      y: Math.round(bounds.y + bounds.height + 4),
      initialValue: new Date(now + 60 * 60 * 1000).toISOString(),
      min: new Date(now + 60 * 1000).toISOString(),
    });
    if (result.canceled || !result.value) return;
    startAt(new Date(result.value).getTime());
  } catch (error) {
    logger.error("tray", "Date picker failed", error);
  }
}

function buildMenu(state: KeepAwakeState): Menu {
  const template: MenuItemConstructorOptions[] = [
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
      },
    },
    {
      label: "Keep Awake For",
      submenu: PRESETS.map((preset) => ({
        label: preset.label,
        type: "radio" as const,
        checked: false,
        click: () => {
          startFor(preset.ms);
        },
      })),
    },
    {
      label: "Keep Awake Until…",
      click: () => {
        void promptAndStartUntil();
      },
    },
    { type: "separator" },
    {
      label: "Allow Sleep Now",
      enabled: state.active,
      click: () => {
        stop();
      },
    },
    { type: "separator" },
    {
      label: "Keep Display Awake",
      type: "checkbox",
      checked: state.keepDisplayAwake,
      click: () => {
        void setKeepDisplayAwake(!state.keepDisplayAwake);
      },
    },
    {
      label: "Hide Dock Icon",
      type: "checkbox",
      checked: settingsService.get().hideDockIcon,
      click: () => {
        void setHideDock(!settingsService.get().hideDockIcon);
      },
    },
    {
      label: "Start at Login",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: () => {
        app.setLoginItemSettings({ openAtLogin: !app.getLoginItemSettings().openAtLogin });
      },
    },
    { type: "separator" },
    {
      label: "Open Caffeinate",
      click: () => {
        void showControlWindow();
      },
    },
    { label: "Quit Caffeinate", role: "quit" },
  ];
  return Menu.buildFromTemplate(template);
}

function updateTitle(): void {
  if (!tray) return;
  const state = getStatus();
  if (state.mode === "timed" && state.endsAt) {
    tray.setTitle(formatCountdown(state.endsAt - Date.now()), { fontType: "monospacedDigit" });
  } else {
    tray.setTitle("");
  }
}

function configureTicker(state: KeepAwakeState): void {
  if (state.mode === "timed" && state.endsAt) {
    if (!ticker) ticker = setInterval(updateTitle, 1000);
    updateTitle();
  } else {
    if (ticker) {
      clearInterval(ticker);
      ticker = null;
    }
    tray?.setTitle("");
  }
}

function render(state: KeepAwakeState): void {
  if (!tray) return;
  tray.setImage(state.active ? "cup.and.saucer.fill" : "cup.and.saucer");
  tray.setToolTip(tooltip(state));
  tray.setContextMenu(buildMenu(state));
  configureTicker(state);
}

export function createTray(): void {
  if (tray) return;
  tray = new Tray("cup.and.saucer", TRAY_GUID);
  unsubscribe = subscribe(render);
  render(getStatus());
  logger.info("tray", "Tray created");
}

export function destroyTray(): void {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
  unsubscribe?.();
  unsubscribe = null;
  tray?.destroy();
  tray = null;
}

export { promptAndStartUntil };
