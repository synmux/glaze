export type ToolId = "claudeCode" | "claudeDesktop" | "codex" | "goose";

export const TOOLS: { id: ToolId; label: string; short: string }[] = [
  { id: "claudeCode", label: "Claude Code", short: "Claude" },
  { id: "claudeDesktop", label: "Claude Desktop", short: "Desktop" },
  { id: "codex", label: "Codex", short: "Codex" },
  { id: "goose", label: "Goose", short: "Goose" },
];

export interface McpRow {
  id: string;
  name: string;
  managed: boolean;
  transport: "stdio" | "http" | "sse";
  summary: string;
  targets: Record<ToolId, boolean>;
  presentIn: Record<ToolId, boolean>;
  status: "in-sync" | "drift" | "pending" | "unmanaged";
  driftedTools: ToolId[];
}

export interface ToolStatus {
  id: ToolId;
  installed: boolean;
  configFile: string | null;
  error: string | null;
}

export interface SyncOverview {
  rows: McpRow[];
  tools: ToolStatus[];
  pendingChanges: number;
}

export interface SkillView {
  name: string;
  description: string;
  targets: Record<ToolId, boolean>;
  storePath: string;
  linkedIn: Record<ToolId, boolean>;
}

export interface MigrationMove {
  name: string;
  from: string;
  keepIn: ToolId[];
}

export interface PluginView {
  id: string;
  name: string;
  tool: "claudeCode" | "codex";
  marketplace: string;
  version: string;
  enabled: boolean;
  installPath: string;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface McpServerInput {
  id: string;
  name: string;
  transport: "stdio" | "http" | "sse";
  command: string;
  args: string[];
  env: KeyValue[];
  url: string;
  headers: KeyValue[];
  timeoutSec: number | null;
  targets: Record<ToolId, boolean>;
}

export interface LibrarySettings {
  backupKeep: number;
  autoApply: boolean;
}

async function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return window.glazeAPI.glaze.ipc.invoke(channel, ...args) as Promise<T>;
}

export const api = {
  overview: () => invoke<SyncOverview>("harness:overview"),
  saveServer: (server: McpServerInput) => invoke<SyncOverview>("harness:saveServer", server),
  deleteServer: (id: string) => invoke<SyncOverview>("harness:deleteServer", id),
  setTarget: (id: string, tool: ToolId, enabled: boolean) =>
    invoke<SyncOverview>("harness:setTarget", id, tool, enabled),
  importServer: (name: string) => invoke<SyncOverview>("harness:importServer", name),
  takeToolVersion: (id: string, tool: ToolId) =>
    invoke<SyncOverview>("harness:takeToolVersion", id, tool),
  applyAll: () => invoke<SyncOverview>("harness:applyAll"),

  skills: () => invoke<SkillView[]>("harness:skills"),
  setSkillTarget: (name: string, tool: ToolId, enabled: boolean) =>
    invoke<SkillView[]>("harness:setSkillTarget", name, tool, enabled),
  addSkill: () => invoke<{ name: string; skills: SkillView[] } | null>("harness:addSkill"),
  migrationPlan: () => invoke<MigrationMove[]>("harness:migrationPlan"),
  migrateSkills: () => invoke<{ moved: number; skills: SkillView[] }>("harness:migrateSkills"),
  deleteSkill: (name: string) => invoke<SkillView[]>("harness:deleteSkill", name),
  revealSkill: (name: string) => invoke<void>("harness:revealSkill", name),

  plugins: () => invoke<PluginView[]>("harness:plugins"),
  setPluginEnabled: (tool: string, id: string, enabled: boolean) =>
    invoke<PluginView[]>("harness:setPluginEnabled", tool, id, enabled),

  getSettings: () => invoke<LibrarySettings>("harness:getSettings"),
  saveSettings: (settings: Partial<LibrarySettings>) =>
    invoke<LibrarySettings>("harness:saveSettings", settings),
  revealLibrary: () => invoke<void>("harness:revealLibrary"),
  revealBackups: () => invoke<void>("harness:revealBackups"),
};

export function toolLabel(id: ToolId): string {
  return TOOLS.find((tool) => tool.id === id)?.label ?? id;
}
