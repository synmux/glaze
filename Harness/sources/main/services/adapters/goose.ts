import { parseDocument, isMap, isSeq, type YAMLMap } from "yaml";

import { rawToDiscovered, type RawMcp } from "./mcp-core.js";
import { readText, writeTextAtomic } from "../atomic-write.js";
import { kvToRecord, type DiscoveredMcp, type McpServer } from "../types.js";

function scalar(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  // Map keys come back as Scalar nodes, whose value lives one level down.
  if (typeof value === "object" && value !== null && "value" in value) {
    return scalar((value as { value: unknown }).value);
  }
  return "";
}

function readExtension(name: string, node: YAMLMap): RawMcp | null {
  const type = scalar(node.get("type"));
  // builtin and platform extensions ship with Goose. Harness never owns them.
  if (type !== "stdio" && type !== "streamable_http" && type !== "sse") return null;

  const argsNode = node.get("args");
  const args = isSeq(argsNode) ? argsNode.items.map((item) => scalar(item)) : [];

  const envNode = node.get("envs");
  const env: Record<string, string> = {};
  if (isMap(envNode)) {
    for (const pair of envNode.items) env[scalar(pair.key)] = scalar(pair.value);
  }

  const headerNode = node.get("headers");
  const headers: Record<string, string> = {};
  if (isMap(headerNode)) {
    for (const pair of headerNode.items) headers[scalar(pair.key)] = scalar(pair.value);
  }

  const timeout = node.get("timeout");
  return {
    name,
    transport: type === "stdio" ? "stdio" : type === "sse" ? "sse" : "http",
    command: scalar(node.get("cmd")),
    args,
    env,
    url: scalar(node.get("uri")),
    headers,
    timeoutSec: typeof timeout === "number" ? timeout : null,
  };
}

function extensionsOf(doc: ReturnType<typeof parseDocument>): YAMLMap | null {
  const root = doc.contents;
  if (!isMap(root)) return null;
  const extensions = root.get("extensions");
  return isMap(extensions) ? extensions : null;
}

export async function readGooseMcp(file: string): Promise<{ found: DiscoveredMcp[]; raw: RawMcp[] }> {
  const text = await readText(file);
  if (text === null) return { found: [], raw: [] };

  const doc = parseDocument(text);
  const extensions = extensionsOf(doc);
  if (!extensions) return { found: [], raw: [] };

  const raw: RawMcp[] = [];
  for (const pair of extensions.items) {
    if (!isMap(pair.value)) continue;
    const entry = readExtension(scalar(pair.key), pair.value);
    if (entry) raw.push(entry);
  }
  return { found: raw.map(rawToDiscovered), raw };
}

const EXTENSION_KEY = /^ {2}([A-Za-z0-9_-]+):\s*$/;

/** Renders one extension in the same two-space style Goose already uses. */
function renderExtension(server: McpServer): string {
  const lines = [`  ${server.name}:`];
  const add = (key: string, value: string) => lines.push(`    ${key}: ${value}`);

  if (server.transport === "stdio") {
    if (server.args.length > 0) {
      lines.push("    args:");
      for (const arg of server.args) lines.push(`      - ${JSON.stringify(arg)}`);
    }
    add("cmd", JSON.stringify(server.command));
    add("enabled", "true");
    const env = kvToRecord(server.env);
    if (Object.keys(env).length > 0) {
      lines.push("    envs:");
      for (const [key, value] of Object.entries(env)) lines.push(`      ${key}: ${JSON.stringify(value)}`);
    }
    add("name", JSON.stringify(server.name));
    add("timeout", String(server.timeoutSec ?? 300));
    add("type", "stdio");
  } else {
    add("enabled", "true");
    const headers = kvToRecord(server.headers);
    if (Object.keys(headers).length > 0) {
      lines.push("    headers:");
      for (const [key, value] of Object.entries(headers)) {
        lines.push(`      ${key}: ${JSON.stringify(value)}`);
      }
    }
    add("name", JSON.stringify(server.name));
    add("timeout", String(server.timeoutSec ?? 300));
    add("type", server.transport === "sse" ? "sse" : "streamable_http");
    add("uri", JSON.stringify(server.url));
  }
  return lines.join("\n");
}

/**
 * Inserts and removes extension blocks as plain text. Re-serializing the whole
 * document would rewrap every description Goose already wrote, so only the
 * blocks Harness owns are touched.
 */
export async function writeGooseMcp(
  file: string,
  owned: string[],
  desired: McpServer[],
): Promise<void> {
  const ownedSet = new Set(owned);
  if (ownedSet.size === 0) return;

  const text = (await readText(file)) ?? "extensions:\n";
  // Validate before editing so a broken file is never half-written.
  const doc = parseDocument(text);
  if (doc.errors.length > 0) {
    throw new Error(`${file} isn't valid YAML, so Harness won't write to it.`);
  }

  const lines = text.split("\n");
  const kept: string[] = [];
  let skipping: string | null = null;

  for (const line of lines) {
    const key = line.match(EXTENSION_KEY)?.[1];
    if (key && ownedSet.has(key)) {
      skipping = key;
      continue;
    }
    // A new top-level key or a sibling extension ends the skipped block.
    if (skipping && (/^\S/.test(line) || EXTENSION_KEY.test(line))) skipping = null;
    if (!skipping) kept.push(line);
  }

  const additions = desired
    .filter((server) => ownedSet.has(server.name))
    .map(renderExtension)
    .join("\n");

  const keptLines = kept.join("\n").replace(/\n{3,}/g, "\n\n").replace(/\n+$/, "").split("\n");

  if (additions) {
    // The new block belongs inside the extensions section, directly after its
    // header, so it stays part of that mapping.
    const header = keptLines.findIndex((line) => /^extensions:\s*$/.test(line));
    if (header === -1) keptLines.push("extensions:", additions);
    else keptLines.splice(header + 1, 0, additions);
  }

  await writeTextAtomic(file, `${keptLines.join("\n")}\n`);
}
