/**
 * Local persistence: one JSON file in the app's Application Support folder.
 * Writes are atomic (temp file + rename) and serialised.
 */
import * as fs from "fs";
import * as path from "path";

import { app, logger } from "@glaze/core/backend";

import type { DeviceRole, Preset } from "../shared/types.js";
import { isRecord, parsePreset } from "./preset-model.js";

export type RoleExpectations = Partial<Record<DeviceRole, string>>;

/** The last applied preset and the device each role it actually set. */
export interface LastApplied {
  presetId: string;
  expected: RoleExpectations;
}

interface StoreData {
  version: 1;
  presets: Preset[];
  showDeviceDetails: boolean;
  lastApplied: LastApplied | null;
}

const FILE_NAME = "switchcraft.json";
const ROLES: readonly DeviceRole[] = ["output", "alert", "input"];

let data: StoreData = {
  version: 1,
  presets: [],
  showDeviceDetails: true,
  lastApplied: null,
};
let filePath: string | null = null;
let writeChain: Promise<void> = Promise.resolve();

function parseLastApplied(value: unknown): LastApplied | null {
  if (!isRecord(value) || typeof value.presetId !== "string") return null;
  const rawExpected = isRecord(value.expected) ? value.expected : {};
  const expected: RoleExpectations = {};
  for (const role of ROLES) {
    const uid = rawExpected[role];
    if (typeof uid === "string" && uid) expected[role] = uid;
  }
  return { presetId: value.presetId, expected };
}

function parseStore(raw: unknown): StoreData {
  const result: StoreData = {
    version: 1,
    presets: [],
    showDeviceDetails: true,
    lastApplied: null,
  };
  if (!isRecord(raw)) return result;
  if (Array.isArray(raw.presets)) {
    const seen = new Set<string>();
    for (const item of raw.presets) {
      const preset = parsePreset(item);
      if (preset && !seen.has(preset.id)) {
        seen.add(preset.id);
        result.presets.push(preset);
      }
    }
  }
  result.showDeviceDetails = raw.showDeviceDetails !== false;
  result.lastApplied = parseLastApplied(raw.lastApplied);
  return result;
}

export function loadStore(): void {
  filePath = path.join(app.getPath("userData"), FILE_NAME);
  if (!fs.existsSync(filePath)) {
    logger.info("store", "No saved presets yet", { filePath });
    return;
  }
  try {
    data = parseStore(JSON.parse(fs.readFileSync(filePath, "utf-8")));
    logger.info("store", "Loaded presets", {
      count: data.presets.length,
      filePath,
    });
  } catch (error) {
    logger.error(
      "store",
      "Saved presets couldn't be read; keeping a backup and starting fresh",
      {
        filePath,
        error: String(error),
      },
    );
    try {
      fs.copyFileSync(filePath, `${filePath}.unreadable-${Date.now()}`);
    } catch {
      // Backup is best-effort.
    }
  }
}

function save(): void {
  const target = filePath;
  if (!target) return;
  const contents = JSON.stringify(data, null, 2);
  writeChain = writeChain
    .then(async () => {
      await fs.promises.mkdir(path.dirname(target), { recursive: true });
      const temporary = `${target}.tmp`;
      await fs.promises.writeFile(temporary, contents, "utf-8");
      await fs.promises.rename(temporary, target);
    })
    .catch((error: unknown) => {
      logger.error("store", "Couldn't save presets", {
        filePath: target,
        error: String(error),
      });
    });
}

export function flushStore(): Promise<void> {
  return writeChain;
}

export function getPresets(): readonly Preset[] {
  return data.presets;
}

export function getPresetById(id: string): Preset | undefined {
  return data.presets.find((preset) => preset.id === id);
}

export function setPresets(presets: Preset[]): void {
  data.presets = presets;
  save();
}

export function getShowDeviceDetails(): boolean {
  return data.showDeviceDetails;
}

export function setShowDeviceDetails(value: boolean): void {
  data.showDeviceDetails = value;
  save();
}

export function getLastApplied(): LastApplied | null {
  return data.lastApplied;
}

export function setLastApplied(value: LastApplied | null): void {
  data.lastApplied = value;
  save();
}
