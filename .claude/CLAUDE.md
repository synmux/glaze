# CLAUDE.md

Context for building Glaze apps. Only non-obvious, can't-infer-from-code guidance lives here — task recipes are in `GLAZE-APP-GUIDE.md` (read on demand) and the skills.

## Architecture

Frontend (React/Vite, `sources/renderer/`) renders in a macOS WebView and talks to the Backend (Node.js, `sources/main/`, which calls Swift host APIs) over a native bridge + IPC (JSON-RPC 2.0). The Glaze SDK mirrors most of Electron's API surface — use Electron knowledge as a starting point, but verify each API/option is actually implemented here before relying on it.

Edit source in `sources/` (sibling to the runtime-output `runtime/`):

```
sources/
├── main/          ← Backend (handlers/, services/)
├── renderer/      ← Frontend (main/home-view.tsx, main/router.tsx, components/)
├── package.json   ← Add deps here
└── .glaze_memory/ ← Canonical app context plus SDK-managed memory
```

## Memory

SDK auto-memory owns incidental durable learnings. `PROJECT-CONTEXT.md` is not a general memory dump: keep it as the concise canonical reference for the app's current purpose, architecture, and recent changes needed after task-boundary resets. Read it on a fresh context when it exists. After completing a change, update its current state and prepend a concise entry under `## Recent History` using a `### YYYY-MM-DD — Short title` heading followed by one or more `- ...` summary bullets; never write bare history bullets without the `###` heading. `PROJECT-HISTORY.md` is maintained automatically; read it only when older context is needed and never write it directly.

## Constraints

<critical>
- Edit only in `sources/`. **NEVER edit or create files in `runtime/`, `build/`, `@glaze/core/`, or `../../.sdk/@glaze/core/`** — they are generated or protected. Change `glaze.config.ts` for build output and customize shared components through wrappers in `renderer/components/`.
- `@glaze/core` resolves through Glaze's tsconfig paths and ESM hooks; never `npm install` it. The `glaze` CLI is already on PATH; never install it from node_modules.
- **Forbidden imports (cause runtime breakage):** `backendNativeBridge`, `@glaze/core/backend/internal`, `GlazeIPCServer`, `GlazeLifecycle`, `registerNativeApiHandlers`, `wireProtocolHandlers`. Use public `@glaze/core/backend` exports instead (`dialog`, `shell`, `clipboard`, `Notification`, `Menu`, `Tray`, …). Do not suppress `no-restricted-imports`; if an API isn't exported (e.g. `powerMonitor`), tell the user it's unavailable.
- **Do not install or configure Xcode.** Before adding a native Swift sidecar, verify that Xcode 16.3+ is already available with `xcodebuild -version`. If it is missing, too old, or not selected, do not run an installer, `xcode-select --install`, `sudo xcode-select`, or Xcode first-launch setup. Re-plan with public Glaze APIs, Node/npm, an existing system tool, AppleScript/JXA, or a reduced feature; if none works, explain the requirement and let the user decide whether to set up Xcode themselves.
- **The Glaze-managed `.npmrc` is OFF-LIMITS** (`~/Library/Application Support/app.glaze.macos.main*/.npmrc`, applied to every install via `NPM_CONFIG_USERCONFIG`). Never read, edit, move, copy, or recreate it; never touch `NPM_CONFIG_USERCONFIG`; never set its keys — `min-release-age`, `before`, `allow-git`, `registry`, `ignore-scripts` — in a project `.npmrc`, and strip them from an existing `sources/.npmrc` before installing (other keys like `legacy-peer-deps` are fine). If `npm install` fails because a version is too new, pin `package.json` to an older version rather than weakening the policy.
</critical>

## Conventions

- For exact SDK exports / `window.glazeAPI` / type signatures, read the `SDK Symbol Map`, `SDK Symbol Lines`, and `SDK API Reference` paths from `<runtime_context>` (don't enumerate or grep the SDK directory).

## Commands

- Install deps with `npm install --include=dev` from `sources/` (NODE_ENV=production prunes devDeps otherwise).
