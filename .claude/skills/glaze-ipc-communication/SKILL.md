---
name: glaze-ipc-communication
description: Implement, review, or debug secure communication between a Glaze renderer, backend, preload, and native APIs. Use for ipcMain handlers, window.glazeAPI calls, notifications, preload exposure, sensitive clipboard/shell/file APIs, native dialogs, channel typing, or large IPC payloads.
---

# Glaze IPC Communication

Keep the renderer behind a narrow, typed preload surface:

```text
renderer → window.glazeAPI → preload wrapper → backend/native handler
```

Only `renderer/preload.ts` imports `ipcRenderer`. Renderer components never import it directly.

## Standard app-owned IPC fast path

The scaffold already exposes `window.glazeAPI.glaze.ipc`. For ordinary app handlers:

1. Register a feature-prefixed `ipcMain.handle("feature:action", …)` from `main/handlers/index.ts` (directly or through an imported feature module).
2. Call `window.glazeAPI.glaze.ipc.invoke("feature:action", args)` in the renderer.

This path requires **no read or edit of `main/index.ts` or `renderer/preload.ts`**. For opening an external HTTP(S) URL, prefer a validated feature-prefixed backend handler that imports `shell` from `@glaze/core/backend`; do not expose the broad shell API to the renderer.

## Non-negotiable rules

- Expose only the exact preload methods the feature needs; a compromised renderer can call every exposed method.
- Use `window.glazeAPI.glaze.ipc` for app-specific backend handlers.
- Keep app channels under feature-specific prefixes. Do not register under SDK-owned namespaces such as `clipboard:`, `dialog:`, `shell:`, `screen:`, `nativeTheme:`, `Menu:`, `systemPreferences:`, `location:`, or `glaze:`.
- Define and match request/result shapes at both ends. Validate user-controlled values in the backend before file, URL, shell, or native operations.
- Keep polling and broadcast payloads lightweight. Send identifiers and metadata, not binary/base64 data.
- Use a custom protocol for binary payloads over 100 KB.

## Read only the file(s) for the task

- Exposing or reviewing preload methods, enabling clipboard/shell/file APIs, extending `GlazeAPI` types, or reasoning about renderer compromise: read [preload-security.md](references/preload-security.md).
- Backend notifications, native dialogs, or safe native APIs beyond the standard app-owned fast path: read [app-and-native-ipc.md](references/app-and-native-ipc.md).
- Designing request/result types, debugging mismatches, or moving large/list/polled payloads: read [payloads-and-type-safety.md](references/payloads-and-type-safety.md).

## Verification

- Renderer code imports no backend or preload-only module.
- Every exposed preload method has a real caller and a narrow argument shape.
- Handler names avoid SDK-owned namespaces and register exactly once.
- Frontend requests match backend parameter types.
- Sensitive inputs are validated at the backend boundary.
- List, poll, and notification payloads exclude large binary data.

Use `glaze-protocol-large-files` for large file transport and `glaze-backend-performance` for polling, caching, and cleanup.
