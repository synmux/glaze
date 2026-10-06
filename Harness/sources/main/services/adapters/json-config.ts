import { parseJsonServer, rawToDiscovered, type RawMcp } from "./mcp-core.js";
import { readText, writeTextAtomic } from "../atomic-write.js";
import { kvToRecord, type DiscoveredMcp, type McpServer } from "../types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export interface JsonAdapterOptions {
  file: string;
  /**
   * Claude Code rewrites ~/.claude.json constantly, so the file is re-read
   * immediately before writing rather than trusting an earlier snapshot.
   */
  rereadBeforeWrite: boolean;
  /** Builds the tool-specific server object from the neutral shape. */
  serialize: (server: McpServer) => Record<string, unknown>;
}

export async function readJsonMcp(file: string): Promise<{ found: DiscoveredMcp[]; raw: RawMcp[] }> {
  const text = await readText(file);
  if (text === null) return { found: [], raw: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${file} isn't valid JSON, so Harness won't touch it.`);
  }
  if (!isRecord(parsed)) return { found: [], raw: [] };

  const servers = isRecord(parsed.mcpServers) ? parsed.mcpServers : {};
  const raw: RawMcp[] = [];
  for (const [name, value] of Object.entries(servers)) {
    const entry = parseJsonServer(name, value);
    if (entry) raw.push(entry);
  }
  return { found: raw.map(rawToDiscovered), raw };
}

/**
 * Rewrites only the mcpServers entries Harness owns. Every other key in the
 * file, and every server Harness doesn't own, is preserved.
 */
export async function writeJsonMcp(
  options: JsonAdapterOptions,
  owned: string[],
  desired: McpServer[],
): Promise<void> {
  const text = await readText(options.file);
  let parsed: Record<string, unknown> = {};
  if (text !== null) {
    try {
      const value: unknown = JSON.parse(text);
      if (isRecord(value)) parsed = value;
    } catch {
      throw new Error(`${options.file} isn't valid JSON, so Harness won't write to it.`);
    }
  }

  const servers = isRecord(parsed.mcpServers) ? { ...parsed.mcpServers } : {};
  const ownedSet = new Set(owned);

  for (const name of ownedSet) {
    if (!desired.some((server) => server.name === name)) delete servers[name];
  }
  for (const server of desired) {
    if (ownedSet.has(server.name)) servers[server.name] = options.serialize(server);
  }

  parsed.mcpServers = servers;

  // Re-read so changes Claude Code made while we were working aren't lost.
  if (options.rereadBeforeWrite) {
    const fresh = await readText(options.file);
    if (fresh !== null) {
      const again = JSON.parse(fresh) as Record<string, unknown>;
      again.mcpServers = servers;
      await writeTextAtomic(options.file, `${JSON.stringify(again, null, 2)}\n`);
      return;
    }
  }

  await writeTextAtomic(options.file, `${JSON.stringify(parsed, null, 2)}\n`);
}

/** The Claude Code serialization: stdio or remote, with secrets kept. */
export function serializeClaude(server: McpServer): Record<string, unknown> {
  if (server.transport === "stdio") {
    const out: Record<string, unknown> = {
      type: "stdio",
      command: server.command,
      args: server.args,
    };
    const env = kvToRecord(server.env);
    if (Object.keys(env).length > 0) out.env = env;
    return out;
  }
  const out: Record<string, unknown> = { type: server.transport, url: server.url };
  const headers = kvToRecord(server.headers);
  if (Object.keys(headers).length > 0) out.headers = headers;
  return out;
}

/**
 * Claude Desktop only runs local servers. Remote ones are bridged through
 * mcp-remote, with headers passed as repeated --header flags.
 */
export function serializeDesktop(server: McpServer): Record<string, unknown> {
  if (server.transport === "stdio") {
    const out: Record<string, unknown> = { command: server.command, args: server.args };
    const env = kvToRecord(server.env);
    if (Object.keys(env).length > 0) out.env = env;
    return out;
  }

  const args = ["-y", "mcp-remote", server.url];
  for (const header of server.headers) {
    if (header.key.trim()) args.push("--header", `${header.key}: ${header.value}`);
  }
  return { command: "npx", args };
}
