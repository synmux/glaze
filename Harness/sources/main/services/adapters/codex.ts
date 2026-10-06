import { stringify as tomlStringify } from "smol-toml";

import { rawToDiscovered, type RawMcp } from "./mcp-core.js";
import { readText, writeTextAtomic } from "../atomic-write.js";
import { kvToRecord, type DiscoveredMcp, type McpServer } from "../types.js";

const HEADER = /^\[mcp_servers\.([^\].]+)(\.[^\]]+)?\]\s*$/;

interface Block {
  header: string;
  name: string;
  lines: string[];
}

/** Splits the file into the blocks Harness may own and the text around them. */
function splitBlocks(text: string): { blocks: Block[]; gaps: string[] } {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  const gaps: string[] = [];
  let buffer: string[] = [];
  let current: Block | null = null;

  const flushBuffer = () => {
    gaps.push(buffer.join("\n"));
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(HEADER);
    if (match) {
      if (current) {
        blocks.push(current);
        gaps.push("");
      } else {
        flushBuffer();
      }
      current = { header: line, name: match[1], lines: [] };
    } else if (current && line.startsWith("[")) {
      blocks.push(current);
      current = null;
      buffer.push(line);
    } else if (current) {
      current.lines.push(line);
    } else {
      buffer.push(line);
    }
  }

  if (current) {
    blocks.push(current);
    gaps.push("");
  } else {
    flushBuffer();
  }

  return { blocks, gaps };
}

function parseAssignment(line: string): { key: string; raw: string } | null {
  const match = line.match(/^\s*([A-Za-z0-9_-]+)\s*=\s*(.*)$/);
  if (!match) return null;
  return { key: match[1], raw: match[2].trim() };
}

function unquote(raw: string): string {
  if (raw.startsWith("\"") && raw.endsWith("\"")) {
    try {
      return JSON.parse(raw) as string;
    } catch {
      return raw.slice(1, -1);
    }
  }
  return raw;
}

function parseStringArray(raw: string): string[] {
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "");
  const values: string[] = [];
  const pattern = /"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(inner))) {
    try {
      values.push(JSON.parse(`"${match[1]}"`) as string);
    } catch {
      values.push(match[1]);
    }
  }
  return values;
}

/** Reads Codex's [mcp_servers.*] tables without parsing the rest of the file. */
export async function readCodexMcp(file: string): Promise<{ found: DiscoveredMcp[]; raw: RawMcp[] }> {
  const text = await readText(file);
  if (text === null) return { found: [], raw: [] };

  const { blocks } = splitBlocks(text);
  const byName = new Map<string, RawMcp>();

  for (const block of blocks) {
    const sub = block.header.match(HEADER)?.[2]?.replace(/^\./, "") ?? "";
    const entry = byName.get(block.name) ?? {
      name: block.name,
      transport: "stdio" as const,
      command: "",
      args: [],
      env: {},
      url: "",
      headers: {},
      timeoutSec: null,
    };

    for (const line of block.lines) {
      const assignment = parseAssignment(line);
      if (!assignment) continue;
      if (sub === "env") entry.env[assignment.key] = unquote(assignment.raw);
      else if (sub === "http_headers") entry.headers[assignment.key] = unquote(assignment.raw);
      else if (assignment.key === "command") entry.command = unquote(assignment.raw);
      else if (assignment.key === "url") {
        entry.url = unquote(assignment.raw);
        entry.transport = "http";
      } else if (assignment.key === "args" && assignment.raw.startsWith("[")) {
        entry.args = parseStringArray(assignment.raw);
      } else if (assignment.key === "startup_timeout_sec") {
        const seconds = Number(assignment.raw);
        if (!Number.isNaN(seconds)) entry.timeoutSec = seconds;
      }
    }
    byName.set(block.name, entry);
  }

  const raw = [...byName.values()];
  return { found: raw.map(rawToDiscovered), raw };
}

function renderServer(server: McpServer): string {
  if (server.transport === "stdio") {
    const table: Record<string, unknown> = {
      command: server.command,
      args: server.args,
    };
    if (server.timeoutSec) table.startup_timeout_sec = server.timeoutSec;
    const env = kvToRecord(server.env);
    let text = tomlStringify({ [`mcp_servers.${server.name}`]: table });
    if (Object.keys(env).length > 0) {
      text += tomlStringify({ [`mcp_servers.${server.name}.env`]: env });
    }
    return text.trimEnd();
  }

  const table: Record<string, unknown> = { url: server.url };
  if (server.timeoutSec) table.startup_timeout_sec = server.timeoutSec;
  const headers = kvToRecord(server.headers);
  let text = tomlStringify({ [`mcp_servers.${server.name}`]: table });
  if (Object.keys(headers).length > 0) {
    text += tomlStringify({ [`mcp_servers.${server.name}.http_headers`]: headers });
  }
  return text.trimEnd();
}

/**
 * Removes the owned server blocks and appends fresh ones. Every other line,
 * including comments and project tables, is kept exactly as it was.
 */
export async function writeCodexMcp(
  file: string,
  owned: string[],
  desired: McpServer[],
): Promise<void> {
  const text = (await readText(file)) ?? "";
  const { blocks, gaps } = splitBlocks(text);
  const ownedSet = new Set(owned);

  // No owned blocks to remove and nothing to add: don't touch the file at all.
  if (!blocks.some((block) => ownedSet.has(block.name)) && desired.length === 0) return;

  const kept: string[] = [];
  blocks.forEach((block, index) => {
    kept.push(gaps[index]);
    if (!ownedSet.has(block.name)) kept.push([block.header, ...block.lines].join("\n"));
  });
  kept.push(gaps[gaps.length - 1] ?? "");

  const rendered = desired
    .filter((server) => ownedSet.has(server.name))
    .map(renderServer)
    .join("\n\n");

  let result = kept.join("").replace(/\n{3,}/g, "\n\n").trimEnd();
  if (rendered) result = `${result}\n\n${rendered}`;
  await writeTextAtomic(file, `${result}\n`);
}
