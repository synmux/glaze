import { BrowserWindow, ipcMain, logger, shell } from "@glaze/core/backend";

import { getPreloadPath, getWindowUrl } from "./window-paths.js";
import { pickLoudestSound, type SoundOption } from "../services/sound-options.js";
import type { DiffLine } from "../services/text-diff.js";

export interface PendingChange {
  id: string;
  label: string;
  url: string;
  changedAt: number;
  sound: SoundOption;
  diff?: DiffLine[];
}

let alertWindow: BrowserWindow | null = null;
const pending = new Map<string, PendingChange>();

export function getPendingChanges(): PendingChange[] {
  return Array.from(pending.values()).sort((a, b) => b.changedAt - a.changedAt);
}

export function getAlertPayload(): { changes: PendingChange[]; sound: SoundOption } {
  const changes = getPendingChanges();
  return { changes, sound: pickLoudestSound(changes.map((c) => c.sound)) };
}

function broadcastAlert(): void {
  ipcMain.broadcast("alert:changed", getAlertPayload());
}

export function dismissAlerts(): void {
  pending.clear();
  if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
}

export async function openChangedUrl(id: string): Promise<void> {
  const change = pending.get(id);
  if (change) await shell.openExternal(change.url);
  pending.delete(id);
  if (pending.size === 0) {
    if (alertWindow && !alertWindow.isDestroyed()) alertWindow.close();
  } else {
    broadcastAlert();
  }
}

export async function showChangeAlert(change: PendingChange, sound: SoundOption): Promise<void> {
  pending.set(change.id, change);

  if (alertWindow && !alertWindow.isDestroyed()) {
    broadcastAlert();
    alertWindow.show();
    alertWindow.moveTop();
    return;
  }

  logger.info("alert-window", "Opening change alert", { url: change.url });

  alertWindow = new BrowserWindow({
    windowKey: "change-alert",
    width: 440,
    height: 340,
    minWidth: 380,
    minHeight: 260,
    frame: true,
    titleBarStyle: "hidden",
    toolbarStyle: "none",
    backgroundColor: "#00000000",
    vibrancy: "hud",
    visualEffectState: "active",
    alwaysOnTop: true,
    hasShadow: true,
    center: true,
    visibleOnAllWorkspaces: true,
    hiddenInMissionControl: true,
    show: false,
    webPreferences: { preload: getPreloadPath() },
  });

  alertWindow.setAlwaysOnTop(true, "floating");
  alertWindow.setWindowButtonVisibility(false);

  alertWindow.once("ready-to-show", () => {
    alertWindow?.show();
    alertWindow?.moveTop();
  });

  alertWindow.on("closed", () => {
    alertWindow = null;
  });

  void sound; // Sound is played by the alert renderer for a repeating, dismissible chime.
  await alertWindow.loadURL(await getWindowUrl("alert-window.html"));
}
