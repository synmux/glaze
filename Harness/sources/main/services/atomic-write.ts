import * as fs from "fs/promises";
import * as path from "path";

import { backupFile } from "./backup.js";

/** Backs up the current file, then replaces it atomically. */
export async function writeTextAtomic(filePath: string, contents: string): Promise<void> {
  await backupFile(filePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(temp, contents, "utf8");
  await fs.rename(temp, filePath);
}

export async function readText(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
