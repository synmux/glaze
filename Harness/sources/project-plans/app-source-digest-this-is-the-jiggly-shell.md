# Harness: one place to manage AI skills, plugins and MCP servers

## Context
You use four AI tools, and each one keeps its own copy of MCP servers, skills and plugins in a different file format. Harness becomes the single source of truth. It keeps a central library, you tick which tools get each item, and Harness writes the right format into each tool's config. Anything it doesn't manage stays untouched.

Decisions you made:
- Central library with sync.
- First version includes: MCP add/edit/remove, enable/disable per tool, copy between tools, and skills folders.
- Sidebar organized by type.
- Master skill copies live in a Harness-owned folder, symlinked into every tool.
- Remote MCP servers reach Claude Desktop through `mcp-remote`.

## What each tool supports (from your real files)
| | MCP servers | Skills | Plugins |
|---|---|---|---|
| **Claude Code** | `~/.claude.json` → `mcpServers` (stdio `{type,command,args,env}`, http/sse `{type,url,headers}`) | `~/.claude/skills/<name>` (symlinks) | `~/.claude/settings.json` → `enabledPlugins["name@marketplace"]`, plus `plugins/installed_plugins.json` |
| **Claude Desktop** | `claude_desktop_config.json` → `mcpServers` (local only; remote servers bridged as `npx -y mcp-remote <url> --header K:V`) | — (not file-based) | — |
| **Codex** | `~/.codex/config.toml` → `[mcp_servers.<name>]` (`command,args,env` / `url,http_headers`, `enabled`, `startup_timeout_sec`) | `~/.agents/skills/<name>` (symlinks) | `[plugins."name@market"] enabled` |
| **Goose** | `~/.config/goose/config.yaml` → `extensions.<key>` (`type: stdio` `cmd,args,envs,timeout,enabled`; `type: streamable_http` `uri,headers`). `builtin`/`platform` entries are never touched | `~/.config/goose/skills/<name>` (symlinks) | — |

Grid cells marked "—" show a disabled checkbox with an explanation.

## Architecture
The backend does all file work: reading and writing configs, symlinks and backups. The renderer is UI only and talks to the backend through the existing `window.glazeAPI.glaze.ipc`.

**Library storage:** everything lives under `app.getPath("userData")`.
- `library.json`: MCP servers in a neutral shape `{id, name, transport: stdio|http|sse, command, args, env, url, headers, timeoutSec, targets: {claudeCode, claudeDesktop, codex, goose}}`, the skill targets, and a list of names Harness owns in each tool.
- `library/skills/<name>/`: master SKILL.md folders.
- `backups/<timestamp>/`: a copy of every config file just before Harness writes it. A setting controls how many are kept.

**Ownership rule:** sync only adds, updates or removes entries whose names appear in the library's owned-names list for that tool. Unmanaged entries show up as **Not managed** rows with an **Import** action.

### Backend files (`main/`)
- `services/harness-paths.ts`: resolves each tool's paths and checks which tools are installed.
- `services/library-store.ts`: loads and saves `library.json` (atomic write via temp file + rename).
- `services/backup.ts`: copies a config before every write and trims old backups.
- `services/adapters/{claude-code,claude-desktop,codex,goose}.ts`: one adapter per tool. Each has `readMcp()`, which maps the tool's format to neutral entries, and `writeMcp(owned, desired)`, which merges back while preserving every unrelated key.
  - JSON files: read, modify the `mcpServers` key only, then write atomically. `~/.claude.json` is re-read right before writing, because Claude Code rewrites it constantly.
  - TOML (Codex): replace only the text blocks for `[mcp_servers.<owned>]` and `[mcp_servers.<owned>.*]`, then append fresh blocks generated with `smol-toml`. Your comments, projects and other tables stay byte-for-byte.
  - YAML (Goose): uses the `yaml` package's Document API, which keeps comments and ordering.
- `services/sync-engine.ts`: computes a per-tool plan from the library and each adapter (adds, updates, removes, drift), then applies it. Drift means a tool's file was changed outside Harness. Drifted rows get an **Out of sync** badge with **Use library** / **Take tool's version** actions.
- `services/skills-service.ts`:
  - Scans the store and parses SKILL.md frontmatter (name, description).
  - Each tool toggle creates or removes a symlink in that tool's skills folder.
  - **Import/migrate:** finds real folders and symlinks in `~/.agents/skills`, `~/.claude/skills`, `~/.config/goose/skills` and `~/.codex/skills`, then moves them into the store and repoints the symlinks. Each tool keeps the skills it had before. This runs only after a confirmation sheet that lists every move, and it takes a backup copy first.
  - **Add skill from folder:** opens a dialog and copies the folder into the store.
- `services/plugins-service.ts`: lists Claude Code plugins (installed + enabled state, marketplace, version) and Codex plugins, and toggles `enabledPlugins` / `[plugins."x"].enabled`. Plugins can't move between tools, so each one shows its own tool's column only.
- `services/config-watcher.ts`: debounced `fs.watch` on each config file. It broadcasts `harness:changed`, and watchers close on `before-quit`.
- `handlers/harness.ts`: registered from `handlers/index.ts`.
  - `library:get`
  - `mcp:save` / `mcp:delete` / `mcp:setTarget` / `mcp:importFromTool` / `mcp:resolveDrift`
  - `skills:list` / `skills:setTarget` / `skills:addFromFolder` / `skills:planMigration` / `skills:migrate` / `skills:reveal`
  - `plugins:list` / `plugins:setEnabled`
  - `sync:status` / `sync:applyAll`
  - `backups:list` / `backups:reveal`

New dependencies: `smol-toml` and `yaml`.

### Frontend (`renderer/`)
- **Window:** 1120×740, minimum 820×520 (`main/index.ts`).
- **Sidebar** (`root-view.tsx` using the SplitView sidebar):
  - **MCP Servers**, **Skills**, **Plugins**, each with a count.
  - A **Tools** footer showing which of the four tools are installed.
- **Routes** (`router.tsx`): `/mcp` (default), `/skills`, `/plugins`.
- **`mcp-view.tsx`:** a toolbar with search, **Add Server** (+) and **Sync** (shows the pending-change count).
  - Table columns: Name · Transport · Command/URL · Claude Code · Claude Desktop · Codex · Goose. Each tool column holds checkboxes.
  - Checking a box is the "copy between tools" action, and unchecking removes the server from that tool. Changes are written immediately and a toast offers Undo.
  - A **Not managed** section lists entries found in tools but missing from the library, each with **Import**. Matching names are merged, and conflicting definitions are flagged.
  - A right-click menu offers Edit, Duplicate, Delete, and Reveal config file.
- **`mcp-editor-sheet.tsx`:** a form for name, transport (segmented control), and either command + args or URL. Env and headers are key/value lists with masked values. It also has a timeout and the target checkboxes, and it validates names that are invalid for TOML or YAML.
- **`skills-view.tsx`:** a table with Name · Description · one checkbox column for each of Claude Code, Codex and Goose (Claude Desktop is disabled). The toolbar has **Add Skill…** and **Import Existing…**, which opens a migration preview sheet. The right-click menu offers Reveal in Finder, Open SKILL.md, and Delete.
- **`plugins-view.tsx`:** grouped by tool, then marketplace, with an enable switch, version and install path.
- **Settings** (`settings/settings-view.tsx`):
  - backups to keep
  - auto-apply changes vs. manual Sync
  - tool path overrides
  - Reveal library folder
- **Data loading:** React Query keyed per resource, refreshed on the `harness:changed` notification.

## Safety
- Back up before every write. Writes are atomic. Unrelated keys and comments are never removed.
- Secrets in env vars and headers are kept in `library.json` inside Harness's private data folder. They are already plain text in the tools' own configs. The UI masks them.
- The first launch writes nothing. Harness only reads, then offers **Import** to build the library.

## Verification
1. Build and launch.
2. Check that the sidebar, all three views and the per-tool grids show your real servers and skills (14 Claude Code servers, 11 Desktop servers, and so on). Everything should start in **Not managed**.
3. Import `dash` and enable it for Goose. Confirm that `config.yaml` gains a `dash` stdio extension, the other keys and comments are unchanged, and a backup exists.
4. Add a remote server enabled for Claude Desktop and check that it is written as an `mcp-remote` entry.
5. Disable a server for Codex and confirm that only that `[mcp_servers.x]` block was removed (diff against the backup).
6. Preview the skills migration and check the move list without applying it. Then add a test skill folder, toggle it per tool, and confirm the symlinks appear and disappear.
7. Edit a config externally and check that the **Out of sync** badge appears.
8. Update `.glaze_memory/PROJECT-CONTEXT.md`.
