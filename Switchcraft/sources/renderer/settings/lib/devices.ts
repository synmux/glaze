import type {
  AlertTarget,
  AudioDevice,
  AudioSnapshot,
  DeviceRef,
  DeviceTarget,
  Preset,
} from "../../../main/shared/types";

export type PickerRole = "output" | "alert" | "input";

export interface DeviceOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: string;
  disabled?: boolean;
}

export const NO_CHANGE = "noChange";
export const SAME_AS_OUTPUT = "sameAsOutput";
export const NO_TRIGGER = "none";
const DEVICE_PREFIX = "device:";

export function deviceValue(uid: string): string {
  return `${DEVICE_PREFIX}${uid}`;
}

function uidFromValue(value: string): string | null {
  return value.startsWith(DEVICE_PREFIX)
    ? value.slice(DEVICE_PREFIX.length)
    : null;
}

function supportsRole(device: AudioDevice, role: PickerRole): boolean {
  if (role === "output") return device.canBeDefaultOutput;
  if (role === "alert") return device.canBeSystemOutput;
  return device.canBeDefaultInput;
}

/** SF Symbol for a device, by how it's connected. */
export function transportIcon(transport: string, role: PickerRole): string {
  switch (transport) {
    case "builtIn":
      return role === "input" ? "mic" : "laptopcomputer";
    case "usb":
      return "cable.connector";
    case "bluetooth":
      return "headphones";
    case "airplay":
      return "airplayaudio";
    case "display":
      return "display";
    case "thunderbolt":
      return "bolt";
    case "aggregate":
      return "square.stack.3d.up";
    case "virtual":
      return "waveform";
    default:
      return role === "input" ? "mic" : "hifispeaker";
  }
}

/** Devices available for a role now, plus the saved device marked if it isn't connected. */
export function roleOptions(
  snapshot: AudioSnapshot | null,
  role: PickerRole,
  saved: DeviceRef | null,
): DeviceOption[] {
  const devices = (snapshot?.devices ?? []).filter((device) =>
    supportsRole(device, role),
  );
  const options: DeviceOption[] = devices.map((device) => ({
    value: deviceValue(device.uid),
    label: device.name,
    icon: transportIcon(device.transport, role),
  }));
  if (saved && !devices.some((device) => device.uid === saved.uid)) {
    const connected =
      snapshot?.devices.some((device) => device.uid === saved.uid) ?? false;
    options.push({
      value: deviceValue(saved.uid),
      label: saved.name,
      sublabel: connected ? "Not available for this" : "Not connected",
      icon: role === "input" ? "mic.slash" : "speaker.slash",
    });
  }
  return options;
}

export function savedDevice(
  target: DeviceTarget | AlertTarget,
): DeviceRef | null {
  return target.kind === "device" ? target.device : null;
}

export function targetValue(target: DeviceTarget | AlertTarget): string {
  if (target.kind === "device") return deviceValue(target.device.uid);
  return target.kind;
}

function refForUid(
  uid: string,
  snapshot: AudioSnapshot | null,
  saved: DeviceRef | null,
): DeviceRef {
  const live = snapshot?.devices.find((device) => device.uid === uid);
  return {
    uid,
    name: live?.name ?? (saved?.uid === uid ? saved.name : "Unknown device"),
  };
}

export function deviceTargetFromValue(
  value: string,
  snapshot: AudioSnapshot | null,
  saved: DeviceRef | null,
): DeviceTarget {
  const uid = uidFromValue(value);
  return uid
    ? { kind: "device", device: refForUid(uid, snapshot, saved) }
    : { kind: "noChange" };
}

export function alertTargetFromValue(
  value: string,
  snapshot: AudioSnapshot | null,
  saved: DeviceRef | null,
): AlertTarget {
  if (value === SAME_AS_OUTPUT) return { kind: "sameAsOutput" };
  return deviceTargetFromValue(value, snapshot, saved);
}

/** Every known device for the auto-apply rule; devices used by another preset are disabled. */
export function triggerOptions(
  snapshot: AudioSnapshot | null,
  presets: readonly Preset[],
  presetId: string,
  saved: DeviceRef | null,
): DeviceOption[] {
  const usedBy = new Map<string, string>();
  for (const preset of presets) {
    if (preset.id !== presetId && preset.autoApplyDevice)
      usedBy.set(preset.autoApplyDevice.uid, preset.slug);
  }
  const options: DeviceOption[] = (snapshot?.devices ?? []).map((device) => {
    const owner = usedBy.get(device.uid);
    return {
      value: deviceValue(device.uid),
      label: device.name,
      icon: transportIcon(
        device.transport,
        device.hasOutput ? "output" : "input",
      ),
      sublabel: owner ? `Used by ${owner}` : undefined,
      disabled: owner !== undefined,
    };
  });
  if (
    saved &&
    !options.some((option) => option.value === deviceValue(saved.uid))
  ) {
    options.push({
      value: deviceValue(saved.uid),
      label: saved.name,
      sublabel: "Not connected",
      icon: "speaker.slash",
    });
  }
  return options;
}

export function triggerFromValue(
  value: string,
  snapshot: AudioSnapshot | null,
  saved: DeviceRef | null,
): DeviceRef | null {
  const uid = uidFromValue(value);
  return uid ? refForUid(uid, snapshot, saved) : null;
}
