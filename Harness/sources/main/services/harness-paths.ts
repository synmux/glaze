import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import type { ToolId } from "./types.js";

export interface ToolPaths {
  id: ToolId;
  label: string;
  /** The config file Harness reads and writes for MCP servers. */
  configFile: string | null;
  /** Folder where skill symlinks live, or null when the tool has no skills. */
  skillsDir: string | null;
  installed: boolean;
}

function home(...parts: string[]): string {
  return path.join(os.homedir(), ...parts);
}

function exists(target: string): boolean {
  try {
    fs.accessSync(target);
    return true;
  } catch {
    return false;
  }
}

/** Resolves every tool's locations and whether it looks installed. */
export function toolPaths(): ToolPaths[] {
  const claudeConfig = home(".claude.json");
  const desktopConfig = home(
    "Library",
    "Application Support",
    "Claude",
    "claude_desktop_config.json",
  );
  const codexConfig = home(".codex", "config.toml");
  const gooseConfig = home(".config", "goose", "config.yaml");

  return [
    {
      id: "claudeCode",
      label: "Claude Code",
      configFile: claudeConfig,
      skillsDir: home(".claude", "skills"),
      installed: exists(claudeConfig) || exists(home(".claude")),
    },
    {
      id: "claudeDesktop",
      label: "Claude Desktop",
      configFile: desktopConfig,
      skillsDir: null,
      installed: exists(path.dirname(desktopConfig)),
    },
    {
      id: "codex",
      label: "Codex",
      configFile: codexConfig,
      // Codex reads skills from ~/.agents/skills, which is also where this
      // user's existing skills already live.
      skillsDir: home(".agents", "skills"),
      installed: exists(codexConfig) || exists(home(".codex")),
    },
    {
      id: "goose",
      label: "Goose",
      configFile: gooseConfig,
      skillsDir: home(".config", "goose", "skills"),
      installed: exists(gooseConfig),
    },
  ];
}

export function pathsFor(id: ToolId): ToolPaths {
  const found = toolPaths().find((tool) => tool.id === id);
  if (!found) throw new Error(`Unknown tool: ${id}`);
  return found;
}

/** Extra skill folders scanned during migration, beyond the per-tool dirs. */
export function migrationSkillDirs(): { tool: ToolId | null; dir: string }[] {
  return [
    { tool: "codex", dir: home(".agents", "skills") },
    { tool: "claudeCode", dir: home(".claude", "skills") },
    { tool: "goose", dir: home(".config", "goose", "skills") },
    { tool: null, dir: home(".codex", "skills") },
  ];
}
