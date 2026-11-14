---
name: glaze-mcp-server
description: Expose a Glaze app's data or actions as an MCP server so the user can work with the app from Claude Code, Codex, or other MCP clients. Use when the user asks to create an MCP server for their app, connect the app to Claude/Codex/AI agents/assistants, or make app data and actions available to outside tools.
---

# Glaze MCP Server

Choose the server shape from what its tools need:

| Shape                          | Use when                                                      | App must be open? |
| ------------------------------ | ------------------------------------------------------------- | ----------------- |
| **Standalone stdio** (default) | Tools read or write persisted app data                        | No                |
| **In-app HTTP**                | Tools need live in-memory state or must drive the running app | Yes               |

Default to standalone stdio. Use in-app HTTP only for genuinely live control, and tell the user that those tools require the app to remain open.

## Non-negotiable rules

- Never hardcode user home paths, bundle IDs, flavors, ports, secrets, or machine-specific values in generated source.
- Give the user final copy-paste-ready install commands, not placeholders. Quote every script path because `Application Support` contains a space.
- Stdio stdout is the JSON-RPC channel. Send diagnostics to stderr and never print unrelated output.
- Match the app's real persisted file names, shapes, and IDs. Bound list results and write files atomically.
- Keep secrets in the app's existing secure storage. Never put tokens in MCP configs or install commands.
- Verify `tools/list` and one real tool call before presenting installation instructions.
- Record the MCP path and tool list in `.glaze_memory/PROJECT-CONTEXT.md`; update the server whenever its data contract changes.

## Read only the file(s) for the task

- Creating the default standalone server, resolving the data directory, designing tools, or running the protocol smoke test: read [standalone-stdio.md](references/standalone-stdio.md).
- Installing the server into Claude Code, Codex, Cursor, Claude Desktop, or project `.mcp.json`; writing instructions for other users; or removing/updating an installation: read [client-installation.md](references/client-installation.md).
- Building live control against a running app, selecting a stable local port, or implementing Streamable HTTP sessions: read [in-app-http.md](references/in-app-http.md).
- Diagnosing connection, stale-tool, stdout, data-directory, or live-write problems: read [troubleshooting.md](references/troubleshooting.md) plus the relevant server-shape reference.

## Quick task map

- Notes/history/settings while the app is closed → standalone stdio.
- Actions against current window or unsaved state → in-app HTTP.
- Local developer setup → client installation with a `$HOME`-based path.
- Published/store-user setup → in-app HTTP; installed users do not have project sources.

Use `glaze-data-storage` for the app's persistence contract and `glaze-backend-performance` for long-running or high-volume tool operations.
