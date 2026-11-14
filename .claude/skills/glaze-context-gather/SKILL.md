---
name: glaze-context-gather
description: Gather task-relevant rules from the Glaze App Guide before fresh app creation, or targeted project context for broad or unfamiliar work in an existing app.
context: fork
model: haiku
agent: Explore
allowed-tools: Read Grep Glob
argument-hint: '"<glaze-app-guide-path>" "<original user request verbatim>" "<Explicit: ... | Inferred: ... | Unresolved: ...>" "<fresh or existing>"'
arguments:
  - guide_path
  - original_request
  - task_brief
  - scope
---

Original user request: `$original_request`

Expanded task brief: `$task_brief`

Glaze App Guide path: `$guide_path`

Raw invocation arguments: $ARGUMENTS

Context scope: `$scope`

## Primary Objective

Extract Glaze App Guide rules that materially affect how the task must be implemented. Return concrete constraints the parent can apply immediately, not a generic guide summary or a list of sections read. When the guide supplies the necessary APIs or call shapes, include the minimal exact usage and mark that capability implementation-ready so the parent does not reopen the guide or SDK declarations.

## Task Fidelity

- Treat `$original_request` as authoritative. `$task_brief` may add detail but must not broaden, replace, or discard explicit requirements; if they conflict, the original request wins.
- Preserve interaction and surface terms exactly. `context menu`, `native menu`, and `simple menu` mean the native tray-menu capability; `panel`, `popover`, and `custom window` mean the custom-window capability.
- Do not reinterpret a simple menu as rich custom UI merely because it includes actions such as refresh, copy, or quit.
- If `Unresolved` contains a mutually exclusive architecture choice, stop before any `Read`, `Grep`, or `Glob`. Return only `Clarification required — [choice]`; do not gather both alternatives.
- Use `Explicit` requirements to select guide sections. Include `Inferred` requirements only when compatible with them. Report any architecture-changing `Unresolved` item as a gap instead of choosing silently.

## Fresh Scaffold Scope

If `$scope` is `fresh`:

- The parent already received the scaffold source digest. Do not read or search project memory or scaffold source files.
- Do not use `Read`, `Grep`, or `Glob` on these digest-covered files:
  - `package.json`
  - `main/index.ts`
  - `main/handlers/index.ts`
  - `main/windows/settings-window.ts`
  - `renderer/preload.ts`
  - `renderer/main/index.tsx`
  - `renderer/main/router.tsx`
  - `renderer/main/root-view.tsx`
  - `renderer/main/home-view.tsx`
  - `settings-window.html`
  - `renderer/settings/index.tsx`
  - `renderer/settings/settings-view.tsx`
- Still read the Glaze App Guide's Critical Rules, Decision Trees, Quick Reference, and task-relevant section. This guide pass is required before implementation.
- Report only relevant guide constraints. Do not spend output explaining the scaffold or repeating information from the digest.

## Guide Retrieval Workflow

1. Read Critical Rules, Decision Trees, and Quick Reference for every task.
2. Identify every capability in the task and read each matching task-specific section from the index below. Do not stop after the first match. For example, a menu bar timer with a custom panel and completion alerts requires System Tray, Window Management, and System Notifications.
3. Extract only guidance that changes implementation: required APIs or import paths, mutually exclusive patterns, lifecycle or event rules, platform behavior, forbidden approaches, and task-specific validation requirements.
4. For each task capability, include the smallest exact API usage already supplied by the guide: imports, constructors, methods, event names, and critical options. Do not reproduce full examples.
5. Express each finding as `Section — rule → implementation consequence`. Omit background explanation that does not affect the implementation.
6. Classify a capability as implementation-ready when the guide provides enough information to write it. If a material signature or behavior is absent, report that specific gap instead of filling it with assumptions.

## Scope And Search

- Work only from the provided paths and context.
- Keep searches and reads inside `sources/`, `$guide_path`, and other explicit `<runtime_context>` paths such as provided log paths.
- Never search home directories, iCloud, OneDrive, or paths outside those explicit scopes.
- Never run broad `find` commands such as `find /`, `find ~`, `find /Users`, or similar full-home/full-disk scans; they can trigger macOS privacy permission prompts.
- Use only `Grep`, `Glob`, and `Read` for searches and reads.
- Never run `Bash` or shell commands.
- If required information is missing, report it instead of widening the search.
- Batch independent reads and searches in one turn; sequence only when a call depends on a prior result.

## App Guide Section Index

Read the Glaze App Guide at `$guide_path`. Use `Read` with `offset` and `limit` to read only relevant sections — never read the full guide. If `$guide_path` is missing or equals `(not found)`, report "Glaze App Guide path unavailable" and continue with project memory and code only; do not search for the guide.

**Guide section index (line numbers → use as offset):** | Section | Lines | When to read | | Critical Rules | 52-72 | Always | | Decision Trees | 73-120 | Always | | Overview / Architecture | 121-144 | Often | | Backend (handlers, services) | 145-550 | Backend tasks | | Window Management | 162-336 | Window tasks | | Adding Backend Handlers | 337-370 | New IPC handlers | | Global Shortcuts | 371-408 | Hotkey tasks | | System Notifications | 409-442 | Notification tasks | | System Tray | 443-550 | Menu bar tasks | | Frontend (components, routing) | 551-613 | UI tasks | | Configuration | 614-684 | Config tasks | | Bundling & Publishing | 685-908 | Native modules | | Static Assets | 909-1200 | Images/fonts | | App Updates | 1201-1235 | Update/auto-update tasks | | Quick Reference / Patterns | 1236-1366 | Always | | File Modification Guide | 1367-1395 | What to edit/avoid | | Settings Convention & Cross-Window Sync | 1396-1405 | Settings/cross-window tasks | | Debugging Runtime Errors | 1406-1415 | Runtime bug tasks | | WKWebView Rendering Caveat | 1416+ | Rendering bug tasks |

If a section is not at the listed offset (guide edits shift line numbers), locate its heading with Grep instead of scanning the file.

## Additional Existing-App Sources

Use these only when `$scope` is `existing`. The guide workflow above remains required.

### Project Memory

Read `.glaze_memory/PROJECT-CONTEXT.md` only when it is already known to exist, and extract only task-relevant current state and recent history. If it is absent or unknown, report "No project memory yet" and continue with the guide and code.

### Existing Codebase

- Check only the smallest existing implementation needed to establish the integration pattern.
- Do not read an edit target merely because it may change; the caller reads exact targets after using this summary.

## Output Format

```
## Context for: [Original User Request]

### Required Guide Constraints
- [Section] — [rule] → [implementation consequence]

### Implementation-Ready Capabilities
- [Capability] — [minimal exact APIs or call shapes] — no follow-up guide or SDK read needed

### Existing-App Context
- [Project memory or code finding, or "Not inspected — fresh scaffold"]

### Implementation Checklist
- [Concise action derived from the guide]

### Unresolved Guide Gaps
- [Material unanswered question, or "None"]
```

## Rules

1. Report guide requirements, not speculative architecture or package dependencies
2. Keep explicit user terminology intact; never substitute a broader interaction pattern
3. Be concise — summarize, don't dump file contents
4. Only include relevant info — skip unrelated sections
5. Do NOT read `@glaze/core` component files — component usage is out of scope here
6. Put a capability under Unresolved Guide Gaps instead of Implementation-Ready Capabilities when an exact API detail is still missing
7. Output must be under 300 words
