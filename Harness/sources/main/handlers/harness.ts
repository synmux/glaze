import { dialog, shell } from "@glaze/core/backend";

import { listBackups } from "../services/backup.js";
import { libraryFile, loadLibrary, saveLibrary } from "../services/library-store.js";
import { listPlugins, setPluginEnabled } from "../services/plugins-service.js";
import {
  addSkillFromFolder,
  deleteSkill,
  listSkills,
  migrateSkills,
  planMigration,
  setSkillTarget,
  skillFile,
} from "../services/skills-service.js";
import {
  applyAll,
  deleteServer,
  importFromTool,
  saveServer,
  setTarget,
  syncOverview,
  takeToolVersion,
} from "../services/sync-engine.js";
import { invalidNameReason } from "../services/adapters/mcp-core.js";
import { backupsDir } from "../services/library-store.js";
import {
  TOOL_IDS,
  type KeyValue,
  type McpServer,
  type McpTransport,
  type ToolId,
} from "../services/types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value;
}

function requireTool(value: unknown): ToolId {
  if (typeof value === "string" && (TOOL_IDS as string[]).includes(value)) return value as ToolId;
  throw new Error("Unknown tool.");
}

function asKeyValues(value: unknown): KeyValue[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((pair) => ({
    key: typeof pair.key === "string" ? pair.key : "",
    value: typeof pair.value === "string" ? pair.value : "",
  }));
}

function asServer(value: unknown): McpServer {
  if (!isRecord(value)) throw new Error("Missing server details.");
  const name = requireString(value.name, "Name").trim();
  const problem = invalidNameReason(name);
  if (problem) throw new Error(problem);

  const transport = value.transport;
  if (transport !== "stdio" && transport !== "http" && transport !== "sse") {
    throw new Error("Pick a transport: local command, HTTP, or SSE.");
  }

  const targets = isRecord(value.targets) ? value.targets : {};
  return {
    id: typeof value.id === "string" && value.id ? value.id : `${Date.now().toString(36)}`,
    name,
    transport: transport as McpTransport,
    command: typeof value.command === "string" ? value.command : "",
    args: Array.isArray(value.args)
      ? value.args.filter((arg): arg is string => typeof arg === "string")
      : [],
    env: asKeyValues(value.env),
    url: typeof value.url === "string" ? value.url : "",
    headers: asKeyValues(value.headers),
    timeoutSec: typeof value.timeoutSec === "number" ? value.timeoutSec : null,
    targets: {
      claudeCode: targets.claudeCode === true,
      claudeDesktop: targets.claudeDesktop === true,
      codex: targets.codex === true,
      goose: targets.goose === true,
    },
  };
}

export const harnessHandlers = {
  overview: () => syncOverview(),

  saveServer: async (input: unknown) => {
    await saveServer(asServer(input));
    return syncOverview();
  },

  deleteServer: async (id: unknown) => {
    await deleteServer(requireString(id, "Server"));
    return syncOverview();
  },

  setTarget: async (id: unknown, tool: unknown, enabled: unknown) => {
    await setTarget(requireString(id, "Server"), requireTool(tool), enabled === true);
    return syncOverview();
  },

  importServer: async (name: unknown) => {
    await importFromTool(requireString(name, "Name"));
    return syncOverview();
  },

  takeToolVersion: async (id: unknown, tool: unknown) => {
    await takeToolVersion(requireString(id, "Server"), requireTool(tool));
    return syncOverview();
  },

  applyAll: async () => {
    await applyAll();
    return syncOverview();
  },

  skills: () => listSkills(),

  setSkillTarget: async (name: unknown, tool: unknown, enabled: unknown) => {
    await setSkillTarget(requireString(name, "Skill"), requireTool(tool), enabled === true);
    return listSkills();
  },

  addSkill: async () => {
    const result = await dialog.showOpenDialog({
      title: "Choose a skill folder",
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    const name = await addSkillFromFolder(result.filePaths[0]);
    return { name, skills: await listSkills() };
  },

  migrationPlan: () => planMigration(),

  migrateSkills: async () => {
    const moved = await migrateSkills();
    return { moved, skills: await listSkills() };
  },

  deleteSkill: async (name: unknown) => {
    await deleteSkill(requireString(name, "Skill"));
    return listSkills();
  },

  revealSkill: async (name: unknown) => {
    shell.showItemInFolder(skillFile(requireString(name, "Skill")));
  },

  plugins: () => listPlugins(),

  setPluginEnabled: async (tool: unknown, id: unknown, enabled: unknown) => {
    const which = requireTool(tool);
    if (which !== "claudeCode" && which !== "codex") {
      throw new Error("Plugins can only be toggled for Claude Code and Codex.");
    }
    await setPluginEnabled(which, requireString(id, "Plugin"), enabled === true);
    return listPlugins();
  },

  getSettings: async () => (await loadLibrary()).settings,

  saveSettings: async (input: unknown) => {
    if (!isRecord(input)) throw new Error("Missing settings.");
    const library = await loadLibrary();
    if (typeof input.backupKeep === "number") {
      library.settings.backupKeep = Math.max(1, Math.min(200, Math.round(input.backupKeep)));
    }
    if (typeof input.autoApply === "boolean") library.settings.autoApply = input.autoApply;
    await saveLibrary(library);
    return library.settings;
  },

  backups: () => listBackups(),

  revealBackups: () => shell.openPath(backupsDir()),

  revealLibrary: () => shell.showItemInFolder(libraryFile()),
};
