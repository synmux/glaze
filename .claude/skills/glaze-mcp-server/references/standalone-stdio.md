# Standalone Stdio MCP Server

Use this default shape when tools read or write the app's persisted data. It runs as a plain Node process spawned by the MCP client and works whether or not the app is open.

- [Files and dependencies](#files-and-dependencies)
- [Resolve the app data directory](#resolve-the-app-data-directory)
- [Server template](#server-template)
- [Tool design](#tool-design)
- [Required smoke test](#required-smoke-test)

## Files and dependencies

Create:

- `mcp/glaze-data.mjs` — copy this skill's `assets/glaze-data.mjs` verbatim.
- `mcp/server.mjs` — the server and its app-specific tools.

Install from the project root:

```bash
npm install --include=dev @modelcontextprotocol/sdk zod@^3
```

The `mcp/` directory is separate from the app build; do not import it from `main/` or `renderer/`.

## Resolve the app data directory

The backend uses `app.getPath("userData")`. A standalone process must derive the same directory without a hardcoded machine path.

Copy `assets/glaze-data.mjs` into the project as `mcp/glaze-data.mjs`. It exports:

- `resolveDataDir(): string`
- `readJsonFile(dataDir, fileName, fallback)`
- `writeJsonFile(dataDir, fileName, value)` with atomic temp-file replacement

Do not retype or customize the helper per app.

## Server template

Read the app's backend services first and replace the example tools with tools matching its real data files.

```javascript
#!/usr/bin/env node
// mcp/server.mjs
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readJsonFile, resolveDataDir, writeJsonFile } from "./glaze-data.mjs";

const dataDir = resolveDataDir();

if (process.argv.includes("--print-data-dir")) {
  console.log(dataDir);
  process.exit(0);
}

const server = new McpServer({ name: "notes", version: "1.0.0" });

server.registerTool(
  "list_notes",
  {
    title: "List notes",
    description: "Return all notes with id, title, and timestamps.",
    inputSchema: {},
  },
  async () => {
    const notes = readJsonFile(dataDir, "notes.json", []);
    return { content: [{ type: "text", text: JSON.stringify(notes, null, 2) }] };
  },
);

server.registerTool(
  "add_note",
  {
    title: "Add note",
    description: "Create a note. The app shows it after reloading its data.",
    inputSchema: { title: z.string(), body: z.string() },
  },
  async ({ title, body }) => {
    const notes = readJsonFile(dataDir, "notes.json", []);
    const note = { id: crypto.randomUUID(), title, body, createdAt: new Date().toISOString() };
    notes.push(note);
    writeJsonFile(dataDir, "notes.json", notes);
    return { content: [{ type: "text", text: `Created note ${note.id}` }] };
  },
);

await server.connect(new StdioServerTransport());
```

## Tool design

- Prefer a few task-shaped tools such as `list_notes`, `add_note`, or `search_history`; do not expose a generic file tool.
- Use snake_case tool names and the app slug as the server name.
- Describe the user-facing data or action, not its storage implementation.
- Return compact JSON as text content. Cap unbounded lists, such as the newest 100 items, and document the cap.
- Make write tools last-write-wins-safe. If the running app caches files in memory, add backend file watching or state that changes appear after reload/restart.
- Never log to stdout from module initialization or tool handlers.

## Required smoke test

First verify data-directory resolution:

```bash
node mcp/server.mjs --print-data-dir
```

It must print an existing directory and exit successfully. Then exercise initialization, tool discovery, and one real tool:

```bash
printf '%s\n%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke-test","version":"0.0.0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_notes","arguments":{}}}' \
  | node mcp/server.mjs
```

Expect JSON responses only: initialize, `tools/list` with every registered tool, and a real tool result. Fix any non-JSON stdout before continuing.
