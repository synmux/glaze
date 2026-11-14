---
name: glaze-component-patterns
description: Build or modify native macOS-style Glaze renderer UI with the design system. Use for layouts, sidebars, toolbars, forms, dialogs, lists, grids, tables, component selection, semantic styling, scrolling, sticky regions, overlays, or any custom UI markup.
---

# Glaze Component Patterns

Glaze apps should resemble native macOS applications: flat surfaces, separation by structure, design-system components over custom markup, and semantic tokens over raw values.

## Component-first gate

1. Choose the Glaze design-system components needed for the task.
2. Before writing them, read their exact documentation for props, variants, composition, behavior, layout constraints, and pitfalls. Use one deferred `GetComponentDocs` call with the concrete task and up to nine exact Markdown paths when available; otherwise read the task-relevant Markdown files directly from `../../.sdk/@glaze/core/src/components/`.
3. If the right component, exact export name, or documentation path is unclear, read [component-catalog.md](references/component-catalog.md). If absent there, search `SDK Symbol Lines` once.

## Non-negotiable rules

- Import UI, hooks, and utilities only from their public `@glaze/core/{components,hooks,utils}` entrypoints.
- Do not hand-roll raw controls or layout primitives when a Glaze component exists.
- Every movable app-owned window needs a `Toolbar`, a `Sidebar`, or an explicit top drag region.
- Prefer each wrapper's high-level chrome props for standard structure (`ScrollArea` title/subtitle/actions/leading, `Sidebar` actions/searchable, `Inspector` title/actions). Use `toolbar` only for multi-row or structurally custom headers, and pass a complete `<Toolbar>`; never assemble `ToolbarContent` / `ToolbarActions` outside it.
- Put custom toolbar buttons inside `ToolbarActions` and omit ordinary `variant` / `size` props. The slot applies content-area glass/large or sidebar-appropriate defaults automatically; set those props only for an intentional override.
- Build settings windows with `ScrollArea` title chrome and `FieldSet` / `Field` rows. Do not hand-roll section headings, settings cards, dividers, or a redundant Done footer; native window controls already close the window.
- Use `SplitView` only for sidebar/list/primary/inspector app shells; use `PanelGroup` for other resizable layouts.
- Keep one visible `variant="accent"` primary action per screen or dialog.
- Render text with `Text` variants or matching semantic utilities; never use raw palette colors or web-card styling.
- Prefer component props before `className` overrides. Components own their native sizing, radius, focus, and interaction behavior.

## Semantic color quick reference

- Text roles descend by emphasis: `primary` for main content, `secondary` for supporting content, `tertiary` for metadata, and `quaternary` for faint accessories. Prefer `Text color` props; matching utilities are `text-*`.
- Surfaces: `bg-control-subtle` for faint control/placeholder fills, `bg-control` for filled controls, `bg-well` for large recessed groups, `bg-list-hover` / `bg-list-selection` for custom row states, and `bg-popover` only for elevated overlays.
- Boundaries: use `divide-y divide-separator` or `border-separator` between rows, `border-field` around input-like groups, and `border-secondary` for a subtle container boundary.
- Do not grep SDK source to discover colors. If these roles are insufficient, read [custom-styling-and-overlays.md](references/custom-styling-and-overlays.md). Never substitute raw palette colors.

## Conditional references

- Unknown component/export or raw-element replacement → [component-catalog.md](references/component-catalog.md).
- A real choice between `SplitView`/`PanelGroup`, dialog types, custom sidebar selection, or complex form composition → [layout-and-forms.md](references/layout-and-forms.md).
- Semantic styling beyond the quick reference, custom list-row chrome, sticky/portal/stacking/paint-order failures, or other unusual custom markup → [custom-styling-and-overlays.md](references/custom-styling-and-overlays.md).

Do not read all three references for a normal first implementation.

## Verification gate

- No raw HTML where a design-system component exists.
- Every selected component was checked against its current documentation before implementation.
- The window has a drag affordance.
- Scrollable header chrome renders `[data-toolbar]`, clears the window-control inset, and retains progressive blur when content scrolls underneath.
- `SplitView`, dialogs, fields, and primary actions match their decision rules.
- Custom markup uses semantic typography, colors, radii, and spacing.
- Flexible text has `min-w-0`; fixed icons have `shrink-0`; changing numbers use `tabular-nums`.
- Overlays portal or otherwise avoid ancestor clipping and stacking traps.

Use `glaze-icon-usage` for icon coloring, `glaze-theming` for app-wide colors, and `glaze-browser-window-recipes` for window surfaces.
