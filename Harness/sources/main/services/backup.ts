import * as fs from "fs/promises";
import * as path from "path";

import { backupsDir } from "./library-store.js";
import { loadLibrary } from "./library-store.js";

/**
 * Copies a config file into a timestamped backup folder before Harness
 * changes it. Missing files are skipped rather than failing the write.
 */
export async function backupFile(filePath: string): Promise<void> {
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return;
  }
  if (!stat.isFile()) return;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const folder = path.join(backupsDir(), stamp);
  await fs.mkdir(folder, { recursive: true });

  // Keep the original file name, disambiguated by its parent folder so two
  // "config" files from different tools don't collide.
  const label = `${path.basename(path.dirname(filePath))}__${path.basename(filePath)}`;
  await fs.copyFile(filePath, path.join(folder, label));

  await trimBackups();
}

async function trimBackups(): Promise<void> {
  const library = await loadLibrary();
  const keep = library.settings.backupKeep;
  const root = backupsDir();

  let entries: string[];
  try {
    entries = await fs.readdir(root);
  } catch {
    return;
  }

  const sorted = entries.filter((name) => !name.startsWith(".")).sort();
  const extra = sorted.slice(0, Math.max(0, sorted.length - keep));
  await Promise.all(extra.map((name) => fs.rm(path.join(root, name), { recursive: true, force: true })));
}

export async function listBackups(): Promise<{ name: string; files: string[] }[]> {
  const root = backupsDir();
  let entries: string[];
  try {
    entries = await fs.readdir(root);
  } catch {
    return [];
  }

  const sorted = entries.filter((name) => !name.startsWith(".")).sort().reverse();
  const result = [];
  for (const name of sorted.slice(0, 30)) {
    const files = await fs.readdir(path.join(root, name)).catch(() => [] as string[]);
    result.push({ name, files });
  }
  return result;
}
