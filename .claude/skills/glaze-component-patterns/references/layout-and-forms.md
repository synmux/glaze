# Layout and Form Decisions

## Selection decisions

- **`SplitView` vs `PanelGroup`:** Use `SplitView` only when columns play sidebar, list, primary, or inspector roles. Use `PanelGroup` for kanban boards, peer columns, editors, vertical splits, or other resizable layouts. Give nested `SplitView`s unique `storageKey` values. Do not migrate a working `PanelGroup` shell unless asked.
- **`Dialog` vs `AlertDialog`:** If accidental Escape is a safe no-op, use `Dialog`. If the user must decide before continuing—delete, sign out, unpublish, or leave with unsaved changes—use `AlertDialog`. Set `confirmVariant="destructive"` only for irreversible actions, use a specific action label, and describe the concrete impact.
- **Sugar vs primitives:** Prefer the sugar APIs for `Dialog`, `AlertDialog`, `Field`, `ScrollArea`, `Sidebar`, and `Inspector`. Use primitives for custom footers, multi-step flows, multiple equally primary actions, or structurally custom/multi-row headers.
- **Sidebar API:** Prefer `searchable`, `actions`, and item props. Use the toolbar or children escape hatches only for structural overrides. Prefer managed list selection; use manual selection only for route-based navigation.

## Layout and toolbar invariants

- Every movable app-owned window needs a `Toolbar` or top drag region; `Sidebar` supplies its own.
- Default chrome uses the wrapper's high-level props (`ScrollArea` title/subtitle/actions/leading, `Sidebar` actions/searchable, `Inspector` title/actions). A `toolbar` escape hatch must contain a complete `<Toolbar>`; never render `ToolbarContent`, `ToolbarTitle`, `ToolbarDescription`, or `ToolbarActions` outside it.
- Never set `Toolbar inset` manually inside `SplitView`.
- `ScrollArea.actions`, `Sidebar.actions`, `ButtonGroup`, and `NavigationButtonGroup` size their own button children.
- Set content-toolbar icons to `size-4.5`; set `ToolbarSearchButton` and `Tabs` to `large` in content areas.
- Use `ToolbarTitle` only when the active context needs a title.
- Keep one visible `variant="accent"` action per screen or dialog.

## Forms

- Use `<FieldSet><Field label="…" description="…">{control}</Field></FieldSet>` for native settings rows.
- An action-only row is `<Field><Button /></Field>` with no label.
- Do not wrap a button in `Field orientation="vertical"`; vertical fields stretch their children.
- Put long-form text in a dialog with a sized `Textarea`. Keep short single-line values in an inline `Input` and commit on blur.
- Keep field labels and descriptions stable when a control changes; put dynamic values in the control slot to avoid layout shift.
