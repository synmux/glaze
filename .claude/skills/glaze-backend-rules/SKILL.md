---
name: glaze-backend-rules
description: Rules for Glaze backend, service, settings, and IPC implementation.
---

# Glaze Backend Rules

Use this before backend, service, settings, or IPC implementation.

## Task Setup

- Review the IPC contract in the task prompt before implementing.

## Backend Rules

- Keep handlers in `main/handlers/` thin; put business logic in `main/services/`.
- Validate all IPC inputs at the boundary; use `unknown` with type guards, never `any`.
- Handler parameter and response shapes must exactly match the IPC contract.
- Use specific, actionable error messages with paths or codes when useful; log before re-throwing.
- After writing a setting, broadcast `ipcMain.broadcast("settings:<key>-changed", { value })` so all windows react.
