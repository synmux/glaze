import * as fs from "fs/promises";
import * as path from "path";

import { migrationSkillDirs, pathsFor } from "./harness-paths.js";
import { loadLibrary, saveLibrary, skillStoreDir, updateLibrary } from "./library-store.js";
import { emptyTargets, TOOL_IDS, type SkillRecord, type ToolId } from "./types.js";

export interface SkillView extends SkillRecord {
  /** Absolute path of the master copy. */
  storePath: string;
  /** Tools where a symlink currently points at the store. */
  linkedIn: Record<ToolId, boolean>;
}

export interface MigrationMove {
  name: string;
  from: string;
  /** Tools that already reference this skill, so they'll keep it. */
  keepIn: ToolId[];
}

async function readFrontmatter(skillDir: string): Promise<{ name: string; description: string }> {
  const fallback = { name: path.basename(skillDir), description: "" };
  let text: string;
  try {
    text = await fs.readFile(path.join(skillDir, "SKILL.md"), "utf8");
  } catch {
    return fallback;
  }

  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return fallback;

  const description = match[1].match(/^description:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, "");
  const name = match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  return { name: name || fallback.name, description: description ?? "" };
}

async function isLinkToStore(linkPath: string, storePath: string): Promise<boolean> {
  try {
    const target = await fs.realpath(linkPath);
    return target === (await fs.realpath(storePath));
  } catch {
    return false;
  }
}

export async function listSkills(): Promise<SkillView[]> {
  const library = await loadLibrary();
  const store = skillStoreDir();
  await fs.mkdir(store, { recursive: true });

  const entries = await fs.readdir(store, { withFileTypes: true });
  const views: SkillView[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const storePath = path.join(store, entry.name);
    const meta = await readFrontmatter(storePath);
    const record = library.skills.find((skill) => skill.name === entry.name);

    const linkedIn = {} as Record<ToolId, boolean>;
    for (const tool of TOOL_IDS) {
      const dir = pathsFor(tool).skillsDir;
      linkedIn[tool] = dir ? await isLinkToStore(path.join(dir, entry.name), storePath) : false;
    }

    views.push({
      name: entry.name,
      description: record?.description || meta.description,
      targets: record?.targets ?? emptyTargets(),
      storePath,
      linkedIn,
    });
  }

  views.sort((a, b) => a.name.localeCompare(b.name));
  return views;
}

async function linkSkill(name: string, tool: ToolId, enabled: boolean): Promise<void> {
  const dir = pathsFor(tool).skillsDir;
  if (!dir) return;
  const linkPath = path.join(dir, name);
  const storePath = path.join(skillStoreDir(), name);

  if (!enabled) {
    const stat = await fs.lstat(linkPath).catch(() => null);
    // Only remove links Harness created. A real folder is never deleted.
    if (stat?.isSymbolicLink() && (await isLinkToStore(linkPath, storePath))) {
      await fs.unlink(linkPath);
    }
    return;
  }

  await fs.mkdir(dir, { recursive: true });
  const relative = path.relative(dir, storePath);
  const existing = await fs.lstat(linkPath).catch(() => null);
  if (existing?.isSymbolicLink()) await fs.unlink(linkPath);
  else if (existing) {
    throw new Error(`${linkPath} already exists and isn't a link, so it was left alone.`);
  }
  await fs.symlink(relative, linkPath);
}

export async function setSkillTarget(name: string, tool: ToolId, enabled: boolean): Promise<void> {
  if (!pathsFor(tool).skillsDir) {
    throw new Error(`${pathsFor(tool).label} doesn't keep skills in a folder.`);
  }

  await updateLibrary((library) => {
    let record = library.skills.find((skill) => skill.name === name);
    if (!record) {
      record = { name, description: "", targets: emptyTargets() };
      library.skills.push(record);
    }
    record.targets[tool] = enabled;
    if (enabled && !library.ownedSkills[tool].includes(name)) {
      library.ownedSkills[tool].push(name);
    }
  });

  await linkSkill(name, tool, enabled);
}

async function copyDir(from: string, to: string): Promise<void> {
  await fs.cp(from, to, { recursive: true, dereference: true });
}

/** Copies a chosen folder into the store. The original is left where it is. */
export async function addSkillFromFolder(folder: string): Promise<string> {
  const stat = await fs.stat(folder).catch(() => null);
  if (!stat?.isDirectory()) throw new Error("That isn't a folder.");

  const name = path.basename(folder);
  const destination = path.join(skillStoreDir(), name);
  if (await fs.stat(destination).catch(() => null)) {
    throw new Error(`${name} is already in the library.`);
  }

  await fs.mkdir(skillStoreDir(), { recursive: true });
  await copyDir(folder, destination);
  const meta = await readFrontmatter(destination);

  await updateLibrary((library) => {
    library.skills.push({ name, description: meta.description, targets: emptyTargets() });
  });
  return name;
}

/** Lists what a migration would move, without changing anything. */
export async function planMigration(): Promise<MigrationMove[]> {
  const seen = new Map<string, MigrationMove>();

  for (const source of migrationSkillDirs()) {
    let entries;
    try {
      entries = await fs.readdir(source.dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(source.dir, entry.name);
      const stat = await fs.lstat(full).catch(() => null);
      if (!stat) continue;

      // Follow symlinks to find the real folder, but record every tool that
      // references the name so each keeps the skill after the move.
      const real = await fs.realpath(full).catch(() => null);
      if (!real) continue;
      const realStat = await fs.stat(real).catch(() => null);
      if (!realStat?.isDirectory()) continue;

      const existing = seen.get(entry.name);
      if (existing) {
        if (source.tool && !existing.keepIn.includes(source.tool)) existing.keepIn.push(source.tool);
        continue;
      }

      // Skip anything already inside the store.
      if (real.startsWith(skillStoreDir())) continue;

      seen.set(entry.name, {
        name: entry.name,
        from: stat.isSymbolicLink() ? real : full,
        keepIn: source.tool ? [source.tool] : [],
      });
    }
  }

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Moves every discovered skill into the store and repoints each tool's entry
 * as a symlink. Real folders are copied first, then the original is replaced
 * only after the copy succeeds.
 */
export async function migrateSkills(): Promise<number> {
  const moves = await planMigration();
  const store = skillStoreDir();
  await fs.mkdir(store, { recursive: true });

  const library = await loadLibrary();

  for (const move of moves) {
    const destination = path.join(store, move.name);
    if (!(await fs.stat(destination).catch(() => null))) {
      await copyDir(move.from, destination);
    }

    for (const source of migrationSkillDirs()) {
      if (!source.tool) continue;
      const linkPath = path.join(source.dir, move.name);
      const stat = await fs.lstat(linkPath).catch(() => null);
      if (!stat) continue;

      if (stat.isSymbolicLink() || stat.isDirectory()) {
        await fs.rm(linkPath, { recursive: true, force: true });
        const relative = path.relative(source.dir, destination);
        await fs.symlink(relative, linkPath);
      }
    }

    const meta = await readFrontmatter(path.join(store, move.name));
    const targets = emptyTargets();
    for (const tool of move.keepIn) targets[tool] = true;

    const record = library.skills.find((skill) => skill.name === move.name);
    if (record) record.targets = targets;
    else library.skills.push({ name: move.name, description: meta.description, targets });

    for (const tool of move.keepIn) {
      if (!library.ownedSkills[tool].includes(move.name)) library.ownedSkills[tool].push(move.name);
    }
  }

  await saveLibrary(library);
  return moves.length;
}

export async function deleteSkill(name: string): Promise<void> {
  for (const tool of TOOL_IDS) await linkSkill(name, tool, false);
  await fs.rm(path.join(skillStoreDir(), name), { recursive: true, force: true });
  await updateLibrary((library) => {
    library.skills = library.skills.filter((skill) => skill.name !== name);
  });
}

export function skillFile(name: string): string {
  return path.join(skillStoreDir(), name, "SKILL.md");
}
