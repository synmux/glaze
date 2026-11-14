---
name: glaze-frontend-rules
description: Rules for Glaze frontend implementation with React, TanStack Router, React Query, and @glaze/core components.
---

# Glaze Frontend Rules

Use this before frontend implementation.

## Task Setup

- If an IPC contract is provided in the task, use it for backend calls.
- `glaze-component-patterns` is the authoritative reference for design-system components, layout shells, and Tailwind/token rules.

## Scope And Search

- Work with provided file paths and context.
- Keep reads narrowly scoped to directly relevant files and files they directly import.
- If required information is missing, report it in `Issues:` instead of hunting for unrelated context.
- Batch independent reads, searches, and edits in one turn; sequence only when a call depends on a prior result.
- Keep file searches inside `sources/`, provided log paths, or other explicit `<runtime_context>` paths.
- Never run broad `find` commands such as `find /`, `find ~`, `find /Users`, or similar full-home/full-disk scans; they can trigger macOS privacy permission prompts.
- Never search home directories, iCloud, OneDrive, or paths outside the project and explicit runtime paths.
- Use `Grep`, `Glob`, and `Read` for file searches and reads instead of shell `find`, `grep`, `cat`, `head`, or `sed`.

## Component Documentation

- Read the documentation for every selected component before writing it. Request up to nine documents through one deferred `GetComponentDocs` call with the concrete task, passing each component's absolute `.md` path, when the tool is available; otherwise read the task-relevant files directly from `../../.sdk/@glaze/core/src/components/`. Do not inspect component implementation source when the usage document answers the question.
- If the design changes to use another component, get that component's documentation before writing it.
- Resolve component names from the SDK Symbol Map, the component catalog, or the `.md` filenames in the external SDK directory.

## Frontend Rules

- Use URL-driven state with TanStack Router `useParams` / `useNavigate`; do not use local `useState` for routed selection.
- Use React Query for data fetching; prefer derived state over `useEffect`.
- Use design system components from `@glaze/core/components`; do not build raw HTML sidebars, panels, or lists.
- Do not use `any`; use explicit types or `unknown` with guards.
- Use lucide icons only; do not use emojis as UI icons.
- Render skeleton placeholders with exact dimensions; avoid layout shift and avoid returning `null` while loading.
- Never use CSS/WebKit blur (`backdrop-filter`, `-webkit-backdrop-filter`, Tailwind `backdrop-blur-*`) as a window background or root/full-window glass surface. For frosted HUDs, panels, popovers, or translucent windows, the backend must use native `BrowserWindow` vibrancy and the renderer root should stay transparent.
- `backdrop-blur-*` is acceptable only for localized inner UI effects inside normal opaque content, never on `html`, `body`, `#root`, root shells, full-window cards, HUD cards, menu-bar panels, or anything acting as the window material.
- **Reuse before rebuild.** When asked to make element B match existing element A (visually or behaviorally), reuse A's actual implementation — render the same component, or extract it into a shared component in `renderer/components/` used by both. Never rebuild a lookalike from scratch, and never modify the working reference element in the process.
- **Sibling controls in one group share one implementation.** Buttons/tabs/rows that belong to the same group render through the same component or class constant so they cannot drift apart. Fixing one of them means fixing the shared path; forking a one-off copy for a single sibling is a defect.
- **Style exactly the element the user names.** "Make the answer word bold green" restyles that word's own element — not the sentence around it, the container, or siblings. If the named target isn't its own element yet, wrap it in one rather than widening the change.
