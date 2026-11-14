/**
 * The menu bar item: icon, current preset slug, and the preset menu.
 */
import {
  app,
  logger,
  Menu,
  Tray,
  type MenuItemConstructorOptions,
} from "@glaze/core/backend";

import type { AudioSnapshot, DeviceRef, Preset } from "../shared/types.js";
import { openSettingsWindow } from "../windows/settings-window.js";
import { applyPresetById } from "./apply-preset.js";
import { audio } from "./audio-bridge.js";
import { getCurrentPresetId } from "./current-preset.js";
import { getPresets, getShowDeviceDetails } from "./store.js";

// Stable across releases so macOS keeps the item where the user placed it.
const TRAY_GUID = "5b0f3c1e-7a2d-4e8b-9f61-3c4d2a8e7b90";
const TRAY_SYMBOL = "hifispeaker.2";

let tray: Tray | null = null;

function deviceLabel(ref: DeviceRef, snapshot: AudioSnapshot | null): string {
  if (!snapshot) return ref.name;
  const live = snapshot.devices.find((device) => device.uid === ref.uid);
  return live ? live.name : `${ref.name} (not connected)`;
}

/** One line each for output, alerts and input, leaving out anything the preset doesn't change. */
export function describePreset(
  preset: Preset,
  snapshot: AudioSnapshot | null,
): string[] {
  const volumes = preset.volumes;
  const outputVolume = volumes.enabled ? volumes.output : null;
  const inputVolume = volumes.enabled ? volumes.input : null;
  const alertVolume =
    volumes.enabled && volumes.output !== null
      ? volumes.alertLinked
        ? volumes.output
        : volumes.alert
      : null;

  const lines: string[] = [];
  const add = (label: string, device: string | null, volume: number | null) => {
    const parts = [device, volume !== null ? `${volume}%` : null].filter(
      (part): part is string => !!part,
    );
    if (parts.length > 0) lines.push(`${label}: ${parts.join(" · ")}`);
  };

  add(
    "Output",
    preset.output.kind === "device"
      ? deviceLabel(preset.output.device, snapshot)
      : null,
    outputVolume,
  );
  let alertDevice: string | null = null;
  if (preset.alert.kind === "sameAsOutput") alertDevice = "Same as output";
  else if (preset.alert.kind === "device")
    alertDevice = deviceLabel(preset.alert.device, snapshot);
  add("Alerts", alertDevice, alertVolume);
  add(
    "Input",
    preset.input.kind === "device"
      ? deviceLabel(preset.input.device, snapshot)
      : null,
    inputVolume,
  );
  return lines;
}

function buildMenu(): Menu {
  const presets = getPresets();
  const currentId = getCurrentPresetId();
  const snapshot = audio.getSnapshot();
  const showDetails = getShowDeviceDetails();

  const items: MenuItemConstructorOptions[] = [];
  if (presets.length === 0) {
    items.push({ label: "No presets yet", enabled: false });
  }
  for (const preset of presets) {
    const details = showDetails ? describePreset(preset, snapshot) : [];
    const item: MenuItemConstructorOptions = {
      type: "checkbox",
      label: preset.slug,
      checked: preset.id === currentId,
      click: () => {
        applyPresetById(preset.id, "menu").catch((error: unknown) => {
          logger.warn("tray", "Couldn't apply preset from the menu", {
            slug: preset.slug,
            error: String(error),
          });
        });
      },
    };
    if (details.length > 0) item.sublabel = details.join("\n");
    if (preset.shortcut) {
      item.accelerator = preset.shortcut;
      item.registerAccelerator = false;
    }
    items.push(item);
  }
  items.push(
    { type: "separator" },
    {
      label: "Preferences…",
      accelerator: "Command+,",
      registerAccelerator: false,
      click: () => {
        openSettingsWindow().catch((error: unknown) => {
          logger.error("tray", "Couldn't open Preferences", {
            error: String(error),
          });
        });
      },
    },
    {
      label: "Quit Switchcraft",
      accelerator: "Command+Q",
      registerAccelerator: false,
      click: () => app.quit(),
    },
  );
  return Menu.buildFromTemplate(items);
}

export function createTray(): void {
  if (tray && !tray.isDestroyed()) return;
  tray = new Tray(TRAY_SYMBOL, TRAY_GUID);
  tray.setToolTip("Switchcraft");
  refreshTray();
}

export function refreshTray(): void {
  if (!tray || tray.isDestroyed()) return;
  const currentId = getCurrentPresetId();
  const current = getPresets().find((preset) => preset.id === currentId);
  tray.setTitle(current ? current.slug : "");
  tray.setContextMenu(buildMenu());
}

export function destroyTray(): void {
  if (tray && !tray.isDestroyed()) tray.destroy();
  tray = null;
}
