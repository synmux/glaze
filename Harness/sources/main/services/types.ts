/**
 * Neutral shapes shared by every harness adapter.
 * Tool-specific formats are translated to and from these.
 */

export type ToolId = "claudeCode" | "claudeDesktop" | "codex" | "goose";

export const TOOL_IDS: ToolId[] = ["claudeCode", "claudeDesktop", "codex", "goose"];

export const TOOL_LABELS: Record<ToolId, string> = {
  claudeCode: "Claude Code",
  claudeDesktop: "Claude Desktop",
  codex: "Codex",
  goose: "Goose",
};

export type Targets = Record<ToolId, boolean>;

export function emptyTargets(): Targets {
  return { claudeCode: false, claudeDesktop: false, codex: false, goose: false };
}

export type McpTransport = "stdio" | "http" | "sse";

export interface KeyValue {
  key: string;
  value: string;
}

/** One MCP server as Harness stores it, independent of any tool. */
export interface McpServer {
  id: string;
  name: string;
  transport: McpTransport;
  command: string;
  args: string[];
  env: KeyValue[];
  url: string;
  headers: KeyValue[];
  timeoutSec: number | null;
  targets: Targets;
}

/** A server found in a tool's config, before it belongs to the library. */
export interface DiscoveredMcp {
  name: string;
  transport: McpTransport;
  command: string;
  args: string[];
  env: KeyValue[];
  url: string;
  headers: KeyValue[];
  timeoutSec: number | null;
  /** Raw text for display only, secrets masked. */
  summary: string;
}

export interface SkillRecord {
  /** Folder name inside the Harness skill store. */
  name: string;
  description: string;
  targets: Targets;
}

export interface LibrarySettings {
  /** How many timestamped backups to keep. */
  backupKeep: number;
  /** When true, ticking a checkbox writes immediately. */
  autoApply: boolean;
}

export interface Library {
  version: 1;
  settings: LibrarySettings;
  mcpServers: McpServer[];
  skills: SkillRecord[];
  /**
   * Names Harness is responsible for in each tool. Sync may add, update or
   * remove only these. Everything else in a tool's config is left alone.
   */
  ownedMcp: Record<ToolId, string[]>;
  ownedSkills: Record<ToolId, string[]>;
}

export function emptyLibrary(): Library {
  return {
    version: 1,
    settings: { backupKeep: 20, autoApply: true },
    mcpServers: [],
    skills: [],
    ownedMcp: { claudeCode: [], claudeDesktop: [], codex: [], goose: [] },
    ownedSkills: { claudeCode: [], claudeDesktop: [], codex: [], goose: [] },
  };
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function mask(value: string): string {
  if (value.length <= 4) return value ? "••••" : "";
  return `••••${value.slice(-4)}`;
}

export function kvToRecord(pairs: KeyValue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of pairs) {
    const key = pair.key.trim();
    if (key) out[key] = pair.value;
  }
  return out;
}

export function recordToKv(record: Record<string, string> | undefined): KeyValue[] {
  if (!record) return [];
  return Object.entries(record).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : String(value),
  }));
}

export function mcpSummary(server: {
  transport: McpTransport;
  command: string;
  args: string[];
  url: string;
}): string {
  if (server.transport === "stdio") {
    return [server.command, ...server.args].filter(Boolean).join(" ");
  }
  return server.url;
}
