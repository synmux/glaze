import * as fs from "fs/promises";
import * as path from "path";

import { app } from "@glaze/core/backend";

import { emptyLibrary, type Library } from "./types.js";

function dataDir(): string {
  return app.getPath("userData");
}

export function libraryFile(): string {
  return path.join(dataDir(), "library.json");
}

export function skillStoreDir(): string {
  return path.join(dataDir(), "library", "skills");
}

export function backupsDir(): string {
  return path.join(dataDir(), "backups");
}

let cache: Library | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Fills in anything a hand-edited or older file is missing. */
function normalize(raw: unknown): Library {
  const base = emptyLibrary();
  if (!isRecord(raw)) return base;

  if (isRecord(raw.settings)) {
    if (typeof raw.settings.backupKeep === "number") {
      base.settings.backupKeep = Math.max(1, Math.min(200, raw.settings.backupKeep));
    }
    if (typeof raw.settings.autoApply === "boolean") {
      base.settings.autoApply = raw.settings.autoApply;
    }
  }

  if (Array.isArray(raw.mcpServers)) base.mcpServers = raw.mcpServers as Library["mcpServers"];
  if (Array.isArray(raw.skills)) base.skills = raw.skills as Library["skills"];

  for (const key of ["ownedMcp", "ownedSkills"] as const) {
    const section = raw[key];
    if (isRecord(section)) {
      for (const tool of Object.keys(base[key]) as (keyof typeof base.ownedMcp)[]) {
        const list = section[tool];
        if (Array.isArray(list)) {
          base[key][tool] = list.filter((item): item is string => typeof item === "string");
        }
      }
    }
  }

  return base;
}

export async function loadLibrary(): Promise<Library> {
  if (cache) return cache;
  try {
    const text = await fs.readFile(libraryFile(), "utf8");
    cache = normalize(JSON.parse(text));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    cache = emptyLibrary();
  }
  return cache;
}

export async function saveLibrary(library: Library): Promise<void> {
  const file = libraryFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(library, null, 2)}\n`, "utf8");
  await fs.rename(temp, file);
  cache = library;
}

export async function updateLibrary(mutate: (library: Library) => void): Promise<Library> {
  const library = await loadLibrary();
  mutate(library);
  await saveLibrary(library);
  return library;
}
