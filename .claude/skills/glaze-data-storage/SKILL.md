---
name: glaze-data-storage
description: Persist Glaze app UI state, user content, settings, history, caches, secrets, or relational data. Use when choosing localStorage, Application Support JSON files, safeStorage, or SQLite; implementing data stores; or debugging missing, corrupted, insecure, or repository-relative persistence.
---

# Glaze Data Storage

Choose the smallest persistence tier that matches the data:

```text
Ephemeral view state? → React state
UI preferences such as panel sizes, tabs, filters, or sort order? → localStorage
Durable app settings, content, history, or cache? → backend JSON in userData
API key, token, or secret? → safeStorage plus a backend file
Relational queries, full-text search, or roughly 10k+ records? → consider SQLite
```

## Non-negotiable rules

- Store durable data under `app.getPath("userData")`, never `process.cwd()`, `__dirname`, `.glaze_memory`, the source tree, or a hardcoded user path.
- Create the data directory before writing.
- Treat only `ENOENT` as a missing-file default. Surface parse, permission, and I/O failures instead of silently replacing data.
- Write JSON atomically through a temporary file and rename; serialize concurrent saves.
- Validate or deliberately normalize parsed data before exposing it to the app.
- Keep secrets out of localStorage and plaintext JSON; encrypt them with `safeStorage` in the backend.

## Read only the file(s) for the task

- Implementing localStorage, JSON persistence, an atomic reusable store, safeStorage, or file organization: read [json-and-secrets.md](references/json-and-secrets.md).
- Deciding whether SQLite is warranted, selecting its location, or understanding the native-binding requirement: read [sqlite.md](references/sqlite.md).

## Verification

- Restart the app and confirm durable state survives.
- Exercise first-run missing files separately from malformed JSON and permission errors.
- Trigger overlapping saves and confirm the last completed state is valid JSON.
- Confirm secrets are unreadable without `safeStorage.decryptString`.
- Confirm no runtime data appears under `sources`, `runtime`, `.glaze`, or another repository path.

Use `glaze-backend-performance` for high-volume caching and polling, and `glaze-mcp-server` when an external process must share the same persisted files.
