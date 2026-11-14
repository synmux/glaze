# MCP Client Installation

Read this after the server's smoke test succeeds.

## Local installation commands

Derive the real server name and project path from the current app. Commands must be copy-paste ready, quote the script path, and keep the home prefix as a literal `$HOME` inside double quotes.

The commands below demonstrate the required shape. Replace the sample app slug and directory before showing a command to the user; never output the examples verbatim.

Claude Code example:

```bash
claude mcp add --scope user notes -- node "$HOME/Glaze (Development)/Notes/sources/mcp/server.mjs"
```

Use `--scope user`; local scope incorrectly ties an app-level server to the current directory. Verify with:

```bash
claude mcp list
```

Codex CLI example:

```bash
codex mcp add notes -- node "$HOME/Glaze (Development)/Notes/sources/mcp/server.mjs"
```

If the installed Codex lacks `codex mcp add`, provide a `~/.codex/config.toml` block. TOML does not expand shell variables, so use the real absolute path:

```toml
[mcp_servers.notes]
command = "node"
args = ["/real/absolute/path/mcp/server.mjs"]
```

For Cursor or Claude Desktop, use the same `command`/`args` shape in the client's MCP JSON configuration. GUI-launched clients do not inherit the shell PATH, so use the absolute Node path from `command -v node`.

Do not include unrequested client variants. After installation, give the user one verification command and one example prompt.

## Project agent access

To let the Glaze agent use the tools in later sessions, add a project-relative `.mcp.json`:

```json
{
  "mcpServers": {
    "notes": {
      "command": "node",
      "args": ["mcp/server.mjs"],
      "cwd": "."
    }
  }
}
```

This proposes the server but does not authorize it. Tell the user to review and trust it in Glaze's MCP Servers dialog; later config edits require re-trusting.

## Instructions for other people

Choose instructions based on the audience:

- **Store-installed users:** They do not have project sources on disk. Use the in-app HTTP shape and document that the app must be open.
- **People running the same project locally:** A `$HOME`-based stdio command works when the app directory and Glaze flavor match. Otherwise tell them to ask their Glaze agent for the machine-specific command.
- Never put this machine's literal home directory into shared documentation.

## Updates and removal

Editing `mcp/server.mjs` does not require reinstalling; clients load changes in a new session.

Remove with:

```bash
claude mcp remove --scope user notes
codex mcp remove notes
```
