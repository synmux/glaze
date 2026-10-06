import { readCodexMcp, writeCodexMcp } from "./codex.js";
import { readGooseMcp, writeGooseMcp } from "./goose.js";
import { readJsonMcp, serializeClaude, serializeDesktop, writeJsonMcp } from "./json-config.js";
import { type RawMcp } from "./mcp-core.js";
import { pathsFor } from "../harness-paths.js";
import { type DiscoveredMcp, type McpServer, type ToolId } from "../types.js";

export interface ToolMcpSnapshot {
  tool: ToolId;
  installed: boolean;
  configFile: string | null;
  found: DiscoveredMcp[];
  raw: RawMcp[];
  error: string | null;
}

export async function readToolMcp(tool: ToolId): Promise<ToolMcpSnapshot> {
  const paths = pathsFor(tool);
  if (!paths.installed || !paths.configFile) {
    return { tool, installed: false, configFile: paths.configFile, found: [], raw: [], error: null };
  }

  try {
    const read =
      tool === "codex"
        ? await readCodexMcp(paths.configFile)
        : tool === "goose"
          ? await readGooseMcp(paths.configFile)
          : await readJsonMcp(paths.configFile);
    return { tool, installed: true, configFile: paths.configFile, ...read, error: null };
  } catch (error) {
    return {
      tool,
      installed: true,
      configFile: paths.configFile,
      found: [],
      raw: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function readAllMcp(): Promise<ToolMcpSnapshot[]> {
  return Promise.all(
    (["claudeCode", "claudeDesktop", "codex", "goose"] as ToolId[]).map(readToolMcp),
  );
}

export async function writeToolMcp(
  tool: ToolId,
  owned: string[],
  desired: McpServer[],
): Promise<void> {
  const paths = pathsFor(tool);
  if (!paths.configFile) throw new Error(`${paths.label} has no config file Harness can write.`);

  if (tool === "codex") return writeCodexMcp(paths.configFile, owned, desired);
  if (tool === "goose") return writeGooseMcp(paths.configFile, owned, desired);

  return writeJsonMcp(
    {
      file: paths.configFile,
      rereadBeforeWrite: tool === "claudeCode",
      serialize: tool === "claudeDesktop" ? serializeDesktop : serializeClaude,
    },
    owned,
    desired,
  );
}
