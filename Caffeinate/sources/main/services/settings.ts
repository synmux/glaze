/**
 * Settings service — durable app preferences persisted to userData/settings.json.
 *
 * Small, typed store for the two Caffeinate preferences. Atomic writes, serialized
 * saves, and ENOENT-only first-run defaults per Glaze data-storage rules.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";

import { app, logger } from "@glaze/core/backend";

export interface AppSettings {
  /** When true, keep-awake also prevents the display from sleeping. */
  keepDisplayAwake: boolean;
  /** When true, the app's Dock icon is hidden (menu-bar-only presence). */
  hideDockIcon: boolean;
}

const DEFAULTS: AppSettings = {
  keepDisplayAwake: false,
  hideDockIcon: false,
};

function isFileNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as { code?: string }).code === "ENOENT";
}

function normalize(parsed: unknown): AppSettings {
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  return {
    keepDisplayAwake: typeof source.keepDisplayAwake === "boolean" ? source.keepDisplayAwake : DEFAULTS.keepDisplayAwake,
    hideDockIcon: typeof source.hideDockIcon === "boolean" ? source.hideDockIcon : DEFAULTS.hideDockIcon,
  };
}

class SettingsService {
  private cache: AppSettings = { ...DEFAULTS };
  private settingsPath: string | null = null;
  private saveQueue: Promise<void> = Promise.resolve();

  private async getSettingsPath(): Promise<string> {
    if (!this.settingsPath) {
      const userDataPath = app.getPath("userData");
      await fs.mkdir(userDataPath, { recursive: true });
      this.settingsPath = path.join(userDataPath, "settings.json");
    }
    return this.settingsPath;
  }

  async load(): Promise<void> {
    try {
      const data = await fs.readFile(await this.getSettingsPath(), "utf-8");
      this.cache = normalize(JSON.parse(data));
    } catch (error) {
      if (!isFileNotFound(error)) {
        logger.error("settings", "Failed to load settings.json", error);
        throw error;
      }
      this.cache = { ...DEFAULTS };
    }
  }

  get(): AppSettings {
    return { ...this.cache };
  }

  async set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    this.cache = { ...this.cache, [key]: value };
    const snapshot = { ...this.cache };
    const save = this.saveQueue
      .catch(() => undefined)
      .then(async () => {
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
}

export const settingsService = new SettingsService();
