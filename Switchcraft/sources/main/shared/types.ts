/**
 * Types shared by the backend and the Preferences renderer.
 * Type-only: keep runtime values out of this file so the renderer can `import type` it.
 */

export type DeviceRole = "output" | "alert" | "input";

export interface AudioDevice {
  uid: string;
  name: string;
  transport: string;
  hasOutput: boolean;
  hasInput: boolean;
  canBeDefaultOutput: boolean;
  canBeDefaultInput: boolean;
  canBeSystemOutput: boolean;
  outputVolumeSettable: boolean;
  inputVolumeSettable: boolean;
}

export interface AudioDefaults {
  output: string | null;
  alert: string | null;
  input: string | null;
}

export interface AudioSnapshot {
  devices: AudioDevice[];
  defaults: AudioDefaults;
}

export interface VolumeLevels {
  output: number | null;
  input: number | null;
  alert: number | null;
}

export interface CurrentSettings {
  defaults: AudioDefaults;
  volumes: VolumeLevels;
}

/** A device saved in a preset. The name is kept so unplugged gear can still be shown. */
export interface DeviceRef {
  uid: string;
  name: string;
}

export type DeviceTarget =
  { kind: "noChange" } | { kind: "device"; device: DeviceRef };

export type AlertTarget =
  | { kind: "noChange" }
  | { kind: "sameAsOutput" }
  | { kind: "device"; device: DeviceRef };

export interface PresetVolumes {
  /** "Set volumes" switch. When off the preset never touches any volume. */
  enabled: boolean;
  /** 0–100, or null for "No change". */
  output: number | null;
  /** 0–100, or null for "No change". */
  input: number | null;
  /** Alert volume follows the output volume when linked. */
  alertLinked: boolean;
  /** Alert level used when unlinked. */
  alert: number;
}

export interface Preset {
  id: string;
  slug: string;
  output: DeviceTarget;
  alert: AlertTarget;
  input: DeviceTarget;
  volumes: PresetVolumes;
  /** Accelerator such as "Control+Alt+1", or null. */
  shortcut: string | null;
  /** Apply this preset automatically when this device connects. */
  autoApplyDevice: DeviceRef | null;
}

export interface PresetValidationErrors {
  slug?: string;
  changes?: string;
  shortcut?: string;
  autoApplyDevice?: string;
}

export type PresetUpdateResult =
  { ok: true; preset: Preset } | { ok: false; errors: PresetValidationErrors };

/** What "Use current settings" fills in. */
export interface CurrentTargets {
  output: DeviceTarget;
  alert: AlertTarget;
  input: DeviceTarget;
  volumes: VolumeLevels;
}

export interface ShortcutState {
  status: "ok" | "taken";
  message?: string;
}

export interface ShortcutCheckResult {
  ok: boolean;
  message?: string;
}

export interface AppSettings {
  showDeviceDetails: boolean;
  launchAtLogin: boolean;
}

export interface SwitchcraftState {
  presets: Preset[];
  currentPresetId: string | null;
  snapshot: AudioSnapshot | null;
  audioError: string | null;
  shortcuts: Record<string, ShortcutState>;
  settings: AppSettings;
}

export type ApplySource =
  "menu" | "shortcut" | "device" | "preferences" | "external";

export interface ApplySkip {
  what: string;
  reason: string;
}

export interface ApplyResult {
  presetId: string;
  slug: string;
  source: ApplySource;
  applied: string[];
  skipped: ApplySkip[];
  becameCurrent: boolean;
}
