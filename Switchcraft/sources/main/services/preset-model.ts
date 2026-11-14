/**
 * Pure preset helpers: parsing untrusted data, validation, slugs and shortcut normalisation.
 */
import type {
  AlertTarget,
  DeviceRef,
  DeviceTarget,
  Preset,
  PresetValidationErrors,
  PresetVolumes,
} from "../shared/types.js";

export const SLUG_MAX_LENGTH = 24;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_ALERT_LEVEL = 50;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ── Parsing ───────────────────────────────────────────────────────────

export function parseDeviceRef(value: unknown): DeviceRef | null {
  if (
    !isRecord(value) ||
    typeof value.uid !== "string" ||
    value.uid.length === 0
  )
    return null;
  const name =
    typeof value.name === "string" && value.name.trim()
      ? value.name
      : "Unknown device";
  return { uid: value.uid, name };
}

function parseDeviceTarget(value: unknown): DeviceTarget {
  if (isRecord(value) && value.kind === "device") {
    const device = parseDeviceRef(value.device);
    if (device) return { kind: "device", device };
  }
  return { kind: "noChange" };
}

function parseAlertTarget(value: unknown): AlertTarget {
  if (isRecord(value) && value.kind === "sameAsOutput")
    return { kind: "sameAsOutput" };
  return parseDeviceTarget(value);
}

export function clampLevel(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.round(Math.min(100, Math.max(0, value)));
}

function parseVolumes(value: unknown): PresetVolumes {
  const raw = isRecord(value) ? value : {};
  return {
    enabled: raw.enabled === true,
    output: clampLevel(raw.output),
    input: clampLevel(raw.input),
    alertLinked: raw.alertLinked !== false,
    alert: clampLevel(raw.alert) ?? DEFAULT_ALERT_LEVEL,
  };
}

export function parsePreset(value: unknown): Preset | null {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id)
    return null;
  if (typeof value.slug !== "string") return null;
  return {
    id: value.id,
    slug: value.slug.trim(),
    output: parseDeviceTarget(value.output),
    alert: parseAlertTarget(value.alert),
    input: parseDeviceTarget(value.input),
    volumes: parseVolumes(value.volumes),
    shortcut:
      typeof value.shortcut === "string"
        ? normalizeAccelerator(value.shortcut)
        : null,
    autoApplyDevice: parseDeviceRef(value.autoApplyDevice),
  };
}

export function emptyPreset(id: string, slug: string): Preset {
  return {
    id,
    slug,
    output: { kind: "noChange" },
    alert: { kind: "noChange" },
    input: { kind: "noChange" },
    volumes: {
      enabled: false,
      output: null,
      input: null,
      alertLinked: true,
      alert: DEFAULT_ALERT_LEVEL,
    },
    shortcut: null,
    autoApplyDevice: null,
  };
}

// ── Shortcuts ─────────────────────────────────────────────────────────

type Modifier = "Control" | "Alt" | "Shift" | "Command";
const MODIFIER_ORDER: readonly Modifier[] = [
  "Control",
  "Alt",
  "Shift",
  "Command",
];
const MODIFIER_ALIASES: Record<string, Modifier> = {
  control: "Control",
  ctrl: "Control",
  alt: "Alt",
  option: "Alt",
  shift: "Shift",
  command: "Command",
  cmd: "Command",
  commandorcontrol: "Command",
  cmdorctrl: "Command",
  super: "Command",
  meta: "Command",
};
const NAMED_KEYS = [
  "Space",
  "Tab",
  "Return",
  "Backspace",
  "Delete",
  "Up",
  "Down",
  "Left",
  "Right",
  "Home",
  "End",
  "PageUp",
  "PageDown",
];

function normalizeKey(key: string): string | null {
  if (/^[a-z0-9]$/i.test(key)) return key.toUpperCase();
  const functionKey = /^f([1-9]|1[0-9]|20)$/i.exec(key);
  if (functionKey) return `F${functionKey[1]}`;
  if (key.toLowerCase() === "enter") return "Return";
  return (
    NAMED_KEYS.find((name) => name.toLowerCase() === key.toLowerCase()) ?? null
  );
}

/** Canonical accelerator: modifiers in ⌃⌥⇧⌘ order, then the key. Null if unusable. */
export function normalizeAccelerator(raw: string): string | null {
  const parts = raw
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  const modifiers = new Set<Modifier>();
  let key: string | null = null;
  for (const part of parts) {
    const modifier = MODIFIER_ALIASES[part.toLowerCase()];
    if (modifier) {
      modifiers.add(modifier);
      continue;
    }
    if (key) return null;
    key = normalizeKey(part);
    if (!key) return null;
  }
  if (!key) return null;
  return [
    ...MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)),
    key,
  ].join("+");
}

export function acceleratorProblem(accelerator: string): string | undefined {
  const parts = accelerator.split("+");
  const key = parts[parts.length - 1] ?? "";
  const modifiers = parts.slice(0, -1);
  const hasPrimaryModifier = modifiers.some(
    (m) => m === "Control" || m === "Alt" || m === "Command",
  );
  if (!hasPrimaryModifier && !/^F\d+$/.test(key)) {
    return "Include ⌘, ⌃ or ⌥ so the shortcut doesn't get in the way of normal typing.";
  }
  return undefined;
}

// ── Validation ────────────────────────────────────────────────────────

export function validateSlug(
  slug: string,
  all: readonly Preset[],
  selfId: string,
): string | undefined {
  if (!slug) return "Enter a name.";
  if (slug.length > SLUG_MAX_LENGTH)
    return `Keep it to ${SLUG_MAX_LENGTH} characters or fewer.`;
  if (!SLUG_PATTERN.test(slug)) {
    return "Use lowercase letters, digits and single hyphens, like desk or head-set.";
  }
  if (all.some((preset) => preset.id !== selfId && preset.slug === slug)) {
    return `Another preset is already called ${slug}.`;
  }
  return undefined;
}

export function changesSomething(preset: Preset): boolean {
  if (preset.output.kind !== "noChange") return true;
  if (preset.alert.kind !== "noChange") return true;
  if (preset.input.kind !== "noChange") return true;
  return (
    preset.volumes.enabled &&
    (preset.volumes.output !== null || preset.volumes.input !== null)
  );
}

export function validatePreset(
  preset: Preset,
  all: readonly Preset[],
): PresetValidationErrors {
  const errors: PresetValidationErrors = {};
  const slugError = validateSlug(preset.slug, all, preset.id);
  if (slugError) errors.slug = slugError;
  if (!changesSomething(preset)) {
    errors.changes =
      "This preset doesn't change anything yet. Choose at least one device or volume.";
  }
  const trigger = preset.autoApplyDevice;
  if (trigger) {
    const other = all.find(
      (p) => p.id !== preset.id && p.autoApplyDevice?.uid === trigger.uid,
    );
    if (other) {
      errors.autoApplyDevice = `${trigger.name} already applies ${other.slug}. A device can trigger only one preset.`;
    }
  }
  if (preset.shortcut) {
    const problem = acceleratorProblem(preset.shortcut);
    if (problem) {
      errors.shortcut = problem;
    } else {
      const other = all.find(
        (p) => p.id !== preset.id && p.shortcut === preset.shortcut,
      );
      if (other) errors.shortcut = `Already used by ${other.slug}.`;
    }
  }
  return errors;
}

// ── Slugs ─────────────────────────────────────────────────────────────

function trimSlug(slug: string, maxLength: number): string {
  return slug.slice(0, maxLength).replace(/-+$/, "");
}

export function uniqueSlug(base: string, all: readonly Preset[]): string {
  const taken = new Set(all.map((preset) => preset.slug));
  const clean = trimSlug(base, SLUG_MAX_LENGTH) || "preset";
  if (!taken.has(clean)) return clean;
  for (let n = 2; ; n++) {
    const suffix = `-${n}`;
    const candidate = `${trimSlug(clean, SLUG_MAX_LENGTH - suffix.length)}${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
}

export function nextNewSlug(all: readonly Preset[]): string {
  const taken = new Set(all.map((preset) => preset.slug));
  for (let n = 1; ; n++) {
    const candidate = `preset-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
