import { sameDefinition } from "./adapters/mcp-core.js";
import { readAllMcp, writeToolMcp, type ToolMcpSnapshot } from "./adapters/index.js";
import { loadLibrary, updateLibrary } from "./library-store.js";
import {
  emptyTargets,
  mcpSummary,
  newId,
  recordToKv,
  TOOL_IDS,
  type DiscoveredMcp,
  type Library,
  type McpServer,
  type ToolId,
} from "./types.js";

export type RowStatus = "in-sync" | "drift" | "pending" | "unmanaged";

export interface McpRow {
  /** Library id, or a synthetic id for unmanaged rows. */
  id: string;
  name: string;
  managed: boolean;
  transport: McpServer["transport"];
  summary: string;
  targets: Record<ToolId, boolean>;
  /** Where the server currently exists, whether or not Harness owns it. */
  presentIn: Record<ToolId, boolean>;
  status: RowStatus;
  /** Tools whose on-disk definition no longer matches the library. */
  driftedTools: ToolId[];
}

export interface SyncOverview {
  rows: McpRow[];
  tools: { id: ToolId; installed: boolean; configFile: string | null; error: string | null }[];
  pendingChanges: number;
}

function desiredFor(library: Library, tool: ToolId): McpServer[] {
  return library.mcpServers.filter((server) => server.targets[tool]);
}

export async function syncOverview(): Promise<SyncOverview> {
  const library = await loadLibrary();
  const snapshots = await readAllMcp();
  const byTool = new Map(snapshots.map((snapshot) => [snapshot.tool, snapshot]));

  const rows: McpRow[] = library.mcpServers.map((server) => {
    // Only a tool where the server exists but differs counts as "drift" (take-able).
    // A tool where it's simply missing just needs to be applied, not taken from.
    const driftedTools = TOOL_IDS.filter((tool) => {
      if (!server.targets[tool]) return false;
      const raw = byTool.get(tool)?.raw.find((entry) => entry.name === server.name);
      return raw != null && !sameDefinition(server, raw);
    });
    const missingTools = TOOL_IDS.filter((tool) => {
      if (!server.targets[tool]) return false;
      return !byTool.get(tool)?.raw.some((entry) => entry.name === server.name);
    });

    const presentIn = {} as Record<ToolId, boolean>;
    for (const tool of TOOL_IDS) {
      presentIn[tool] = byTool.get(tool)?.raw.some((entry) => entry.name === server.name) ?? false;
    }

    return {
      id: server.id,
      name: server.name,
      managed: true,
      transport: server.transport,
      summary: mcpSummary(server),
      targets: { ...server.targets },
      presentIn,
      status: driftedTools.length > 0 ? "drift" : missingTools.length > 0 ? "pending" : "in-sync",
      driftedTools,
    };
  });

  // Servers that exist in a tool but aren't in the library.
  const managedNames = new Set(library.mcpServers.map((server) => server.name));
  const unmanaged = new Map<string, DiscoveredMcp[]>();
  for (const snapshot of snapshots) {
    for (const found of snapshot.found) {
      if (managedNames.has(found.name)) continue;
      const list = unmanaged.get(found.name) ?? [];
      list.push(found);
      unmanaged.set(found.name, list);
    }
  }

  for (const [name, copies] of unmanaged) {
    const first = copies[0];
    const presentIn = {} as Record<ToolId, boolean>;
    for (const tool of TOOL_IDS) {
      presentIn[tool] = byTool.get(tool)?.found.some((entry) => entry.name === name) ?? false;
    }
    rows.push({
      id: `unmanaged:${name}`,
      name,
      managed: false,
      transport: first.transport,
      summary: first.summary,
      targets: emptyTargets(),
      presentIn,
      status: "unmanaged",
      driftedTools: [],
    });
  }

  rows.sort((a, b) => Number(a.managed) - Number(b.managed) || a.name.localeCompare(b.name));

  return {
    rows,
    tools: snapshots.map((snapshot) => ({
      id: snapshot.tool,
      installed: snapshot.installed,
      configFile: snapshot.configFile,
      error: snapshot.error,
    })),
    pendingChanges: rows.filter((row) => row.status === "drift" || row.status === "pending").length,
  };
}

/** Writes the library's desired state into one tool, touching only owned names. */
export async function applyTool(tool: ToolId, library?: Library): Promise<void> {
  const current = library ?? (await loadLibrary());
  const owned = new Set(current.ownedMcp[tool]);
  for (const server of current.mcpServers) {
    if (server.targets[tool]) owned.add(server.name);
  }
  await writeToolMcp(tool, [...owned], desiredFor(current, tool));
  await updateLibrary((next) => {
    next.ownedMcp[tool] = [...owned];
  });
}

export async function applyAll(): Promise<void> {
  const library = await loadLibrary();
  for (const tool of TOOL_IDS) {
    if (library.ownedMcp[tool].length === 0 && !library.mcpServers.some((s) => s.targets[tool])) {
      continue;
    }
    await applyTool(tool, library);
  }
}

/** Pulls a server found in a tool into the library and marks it owned there. */
export async function importFromTool(name: string): Promise<McpServer> {
  const snapshots = await readAllMcp();
  const sources = snapshots
    .map((snapshot) => ({
      tool: snapshot.tool,
      raw: snapshot.raw.find((entry) => entry.name === name),
    }))
    .filter((source): source is { tool: ToolId; raw: NonNullable<typeof source.raw> } =>
      Boolean(source.raw),
    );

  if (sources.length === 0) throw new Error(`${name} wasn't found in any tool.`);

  const base = sources[0].raw;
  const targets = emptyTargets();
  for (const source of sources) targets[source.tool] = true;

  const server: McpServer = {
    id: newId(),
    name,
    transport: base.transport,
    command: base.command,
    args: base.args,
    env: recordToKv(base.env),
    url: base.url,
    headers: recordToKv(base.headers),
    timeoutSec: base.timeoutSec,
    targets,
  };

  await updateLibrary((library) => {
    library.mcpServers = library.mcpServers.filter((entry) => entry.name !== name);
    library.mcpServers.push(server);
    for (const source of sources) {
      if (!library.ownedMcp[source.tool].includes(name)) {
        library.ownedMcp[source.tool].push(name);
      }
    }
  });

  return server;
}

export async function saveServer(input: McpServer): Promise<void> {
  const library = await loadLibrary();
  const index = library.mcpServers.findIndex((server) => server.id === input.id);
  const previous = index >= 0 ? library.mcpServers[index] : null;

  if (library.mcpServers.some((server) => server.name === input.name && server.id !== input.id)) {
    throw new Error(`There's already a server named ${input.name}.`);
  }

  if (index >= 0) library.mcpServers[index] = input;
  else library.mcpServers.push(input);

  // A rename means the old name must be removed from tools that had it.
  if (previous && previous.name !== input.name) {
    for (const tool of TOOL_IDS) {
      if (!library.ownedMcp[tool].includes(previous.name)) {
        library.ownedMcp[tool].push(previous.name);
      }
    }
  }

  const { saveLibrary } = await import("./library-store.js");
  await saveLibrary(library);

  if (library.settings.autoApply) {
    for (const tool of TOOL_IDS) {
      if (input.targets[tool] || previous?.targets[tool]) await applyTool(tool);
    }
  }
}

export async function deleteServer(id: string): Promise<void> {
  const library = await loadLibrary();
  const server = library.mcpServers.find((entry) => entry.id === id);
  if (!server) return;

  for (const tool of TOOL_IDS) {
    if (server.targets[tool] && !library.ownedMcp[tool].includes(server.name)) {
      library.ownedMcp[tool].push(server.name);
    }
    server.targets[tool] = false;
  }
  library.mcpServers = library.mcpServers.filter((entry) => entry.id !== id);

  const { saveLibrary } = await import("./library-store.js");
  await saveLibrary(library);
  if (library.settings.autoApply) await applyAll();
}

export async function setTarget(id: string, tool: ToolId, enabled: boolean): Promise<void> {
  const library = await loadLibrary();
  const server = library.mcpServers.find((entry) => entry.id === id);
  if (!server) throw new Error("That server isn't in the library.");
  server.targets[tool] = enabled;
  if (!library.ownedMcp[tool].includes(server.name)) library.ownedMcp[tool].push(server.name);

  const { saveLibrary } = await import("./library-store.js");
  await saveLibrary(library);
  if (library.settings.autoApply) await applyTool(tool);
}

/** Overwrites the library copy with what a tool currently has on disk. */
export async function takeToolVersion(id: string, tool: ToolId): Promise<void> {
  const snapshot = (await readAllMcp()).find((entry) => entry.tool === tool);
  const library = await loadLibrary();
  const server = library.mcpServers.find((entry) => entry.id === id);
  const raw = snapshot?.raw.find((entry) => entry.name === server?.name);
  if (!server || !raw) throw new Error("Couldn't find that server in the tool.");

  server.transport = raw.transport;
  server.command = raw.command;
  server.args = raw.args;
  server.env = recordToKv(raw.env);
  server.url = raw.url;
  server.headers = recordToKv(raw.headers);
  server.timeoutSec = raw.timeoutSec;

  const { saveLibrary } = await import("./library-store.js");
  await saveLibrary(library);
}

export type { ToolMcpSnapshot };
