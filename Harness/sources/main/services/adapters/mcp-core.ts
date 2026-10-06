import {
  mcpSummary,
  recordToKv,
  type DiscoveredMcp,
  type McpServer,
  type McpTransport,
} from "../types.js";

export interface RawMcp {
  name: string;
  transport: McpTransport;
  command: string;
  args: string[];
  env: Record<string, string>;
  url: string;
  headers: Record<string, string>;
  timeoutSec: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asStringRecord(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") out[key] = entry;
    else if (typeof entry === "number") out[key] = String(entry);
  }
  return out;
}

/** Reads one server object in the Claude-style JSON shape. */
export function parseJsonServer(name: string, value: unknown): RawMcp | null {
  if (!isRecord(value)) return null;

  const declared = asString(value.type);
  const url = asString(value.url);
  const command = asString(value.command);

  let transport: McpTransport = "stdio";
  if (declared === "http" || declared === "sse") transport = declared;
  else if (url && !command) transport = "http";

  return {
    name,
    transport,
    command,
    args: asStringList(value.args),
    env: asStringRecord(value.env),
    url,
    headers: asStringRecord(value.headers),
    timeoutSec: typeof value.timeout === "number" ? value.timeout : null,
  };
}

export function rawToDiscovered(raw: RawMcp): DiscoveredMcp {
  const env = recordToKv(raw.env);
  const headers = recordToKv(raw.headers);
  return {
    name: raw.name,
    transport: raw.transport,
    command: raw.command,
    args: raw.args,
    env,
    url: raw.url,
    headers,
    timeoutSec: raw.timeoutSec,
    summary: mcpSummary(raw),
  };
}

/** Compares the fields Harness owns, ignoring target membership. */
export function sameDefinition(server: McpServer, raw: RawMcp): boolean {
  return (
    server.transport === raw.transport &&
    server.command === raw.command &&
    server.url === raw.url &&
    (server.timeoutSec ?? null) === (raw.timeoutSec ?? null) &&
    JSON.stringify(server.args) === JSON.stringify(raw.args) &&
    JSON.stringify(Object.fromEntries(server.env.map((pair) => [pair.key, pair.value]))) ===
      JSON.stringify(raw.env) &&
    JSON.stringify(Object.fromEntries(server.headers.map((pair) => [pair.key, pair.value]))) ===
      JSON.stringify(raw.headers)
  );
}

/** Names that would break a TOML table key or a YAML mapping key. */
export function invalidNameReason(name: string): string | null {
  if (!name.trim()) return "A name is required.";
  if (/\s/.test(name)) return "Names can't contain spaces.";
  if (/[[\]"'#=]/.test(name)) return "Names can't contain [ ] \" ' # or =.";
  return null;
}
