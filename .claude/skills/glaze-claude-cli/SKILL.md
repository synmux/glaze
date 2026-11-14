---
name: glaze-claude-cli
description: "Build Glaze apps that explicitly integrate with a user's local Claude Code CLI subscription via `claude -p` / `--print`. Do not use this as the default way to add AI to an app: it requires the target user to have Claude Code installed and logged in. Use only for local/private projects or apps whose users are known to have Claude Code available."
---

# Glaze Claude CLI

Use this skill when generating a user app that should call the user's installed Claude Code CLI locally. The app should use the user's existing Claude Code subscription login, not collect API keys, OAuth tokens, or Claude credential files.

Do not use this as the default AI path. It is appropriate only for local/private apps or audiences known to have Claude Code installed and logged in.

## Non-negotiable rules

1. Run `claude` in the backend through narrow IPC; never spawn from the renderer.
2. Never collect API keys, OAuth tokens, Keychain values, Claude config/credential files, or `CLAUDE_CODE_OAUTH_TOKEN`.
3. Subscription users install Claude Code and run `claude` in Terminal to log in. Do not use `--bare`; it bypasses OAuth/keychain reads.
4. Every process must close/ignore stdin, enforce timeout and output limits, and kill on violation.
5. Prefer `--output-format json` with `--json-schema`; never scrape human terminal output for app logic.
6. Use `--tools ""` for pure generation. Grant only required tools and `--add-dir` paths; non-interactive mode skips the workspace trust dialog, so every directory is a trust decision.
7. Sanitize inherited API-key/gateway environment variables for subscription mode and never log credentials, prompts, generated source, environment values, or full output.
8. `claude --version` proves only binary presence, not GUI-process authentication. Direct spawn may need a login-shell PTY fallback on macOS.

Before relying on a CLI flag, check the installed `claude --help`; the CLI changes quickly.

## Read only the file(s) for the task

- Binary resolution, typed setup checks, bounded process execution, error classification, direct `spawn`, login verification, or a first feature call: read both [setup-and-direct-spawn.md](references/setup-and-direct-spawn.md) and [structured-output-and-security.md](references/structured-output-and-security.md); the direct recipes call the sanitization and parsing helpers defined there.
- Subscription environment sanitization, JSON schema/envelope parsing, large input, or streaming output: read [structured-output-and-security.md](references/structured-output-and-security.md).
- `"not logged in"` from a GUI app when Terminal works, login-shell PTY execution, quoting, or nonce extraction: read [macos-pty-auth.md](references/macos-pty-auth.md), [setup-and-direct-spawn.md](references/setup-and-direct-spawn.md), and [structured-output-and-security.md](references/structured-output-and-security.md); the PTY recipe reuses the error and parsing helpers defined there.
- Adding or packaging `node-pty`, externalizing it, or fixing `spawn-helper` permissions: read [node-pty-packaging.md](references/node-pty-packaging.md).
- Building the persistent setup screen, long-running state, or actionable error UX: read [setup-ui-and-errors.md](references/setup-ui-and-errors.md).

## Expected app shape

- Backend service for resolution, setup checks, process execution, and parsing.
- Narrow IPC methods for setup and feature actions.
- Persistent renderer setup state with Check Again and optional custom binary path.
- `node-pty` plus packaging configuration for robust macOS subscription auth.
- Long-running UI state; repository-scale PTY calls can take a minute or more.

Use `glaze-ipc-communication` for handler wiring and `glaze-cli-dependencies` for general external-CLI setup patterns.
