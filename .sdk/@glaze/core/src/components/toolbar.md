# Toolbar

A native macOS-style sticky header with progressive-blur background and window-focus adaptation. Holds a view title, description, and actions, and resolves window-control insets automatically based on its layout context. Supports multiple rows for title + search/tabs layouts.

Most apps don't write `<Toolbar>` directly. `<Sidebar>`, `<ScrollArea>`, and `<Inspector>` expose high-level chrome props and build the Toolbar internally. Reach for `<Toolbar>` only when you need a multi-row layout, a custom header structure, or a toolbar outside those wrappers.

## When to Use

- Page/panel/section headers showing a contextual title plus actions.
- Multi-row headers: title row + search row, or title row + tabs row.
- Otherwise prefer each wrapper's high-level chrome props — they render a Toolbar for you. The [title rules](#title-content) below apply equally to wrappers that accept `title`.

## Usage Patterns

### Basic: wrapper props (recommended)

For a standard title, subtitle, leading control, or actions, let `ScrollArea` build the Toolbar. This is the default path for list and detail views:

```tsx
<ScrollArea
  title="Documents"
  subtitle="23 files, 2.4 GB"
  actions={
    <>
      <Button iconOnly>
        <FilterIcon />
      </Button>
      <Button>New Document</Button>
    </>
  }
>
  <List>{/* items */}</List>
</ScrollArea>
```

### Custom toolbar on ScrollArea (escape hatch)

Use `toolbar` only when wrapper props cannot express the structure. Its value must be a complete `<Toolbar>`; `ToolbarContent`, `ToolbarTitle`, and `ToolbarActions` are slots inside that component, not standalone chrome. With no `ToolbarRow` children, content is auto-wrapped in one row that receives the window-control inset:

```tsx
<ScrollArea
  toolbar={
    <Toolbar>
      <ToolbarContent>
        <ToolbarTitle>Documents</ToolbarTitle>
        <ToolbarDescription>23 files, 2.4 GB</ToolbarDescription>
      </ToolbarContent>
      <ToolbarActions>
        <Button iconOnly>
          <FilterIcon />
        </Button>
        <Button>New Document</Button>
      </ToolbarActions>
    </Toolbar>
  }
>
  <List>{/* items */}</List>
</ScrollArea>
```

### Button sizing by location

`ToolbarActions` supplies the correct button variant and size for its location. Buttons default to glass/large in a content area and transparent/small in a sidebar (glass/large on macOS 27+). Explicit `variant` and `size` props still win. SVG icons inside `<Button>` auto-size from `size` — only pass `<Icon className="size-X" />` to override.

| Location     | Variant                 | Size                  | Auto icon size  |
| ------------ | ----------------------- | --------------------- | --------------- |
| Content area | `variant="glass"`       | `size="large"` (36px) | `size-5` (20px) |
| Sidebar      | `variant="transparent"` | `size="small"` (28px) | `size-4` (16px) |

This applies to `Button`, `ButtonGroup`, `Tabs`, and `ToolbarSearchButton`. Prefer icon-only or text-only buttons; avoid mixing icon and text in one toolbar button. See [Button](./button.md) and [Sidebar](./sidebar.md) for details.

### Multi-row: title + search

Use explicit `ToolbarRow`s. Only the first row receives the inset; subsequent rows are full-width with no inset.

```tsx
<Toolbar>
  <ToolbarRow>
    <ToolbarContent>
      <ToolbarTitle>Repositories</ToolbarTitle>
    </ToolbarContent>
    <ToolbarActions>
      <Button iconOnly>
        <PlusIcon />
      </Button>
    </ToolbarActions>
  </ToolbarRow>
  <ToolbarRow>
    <ToolbarSearchButton value={query} onChange={setQuery} size="large" />
  </ToolbarRow>
</Toolbar>
```

### Multi-row: title + tabs

```tsx
<Toolbar>
  <ToolbarRow>
    <ToolbarContent>
      <ToolbarTitle>Settings</ToolbarTitle>
    </ToolbarContent>
    <Button variant="glass" size="large" iconOnly>
      <HelpIcon />
    </Button>
  </ToolbarRow>
  <ToolbarRow>
    <Tabs size="large">
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="privacy">Privacy</TabsTrigger>
    </Tabs>
  </ToolbarRow>
</Toolbar>
```

### Selection-aware actions

Swap the description and actions based on selection state:

```tsx
<Toolbar>
  <ToolbarContent>
    <ToolbarTitle>Documents</ToolbarTitle>
    <ToolbarDescription>{selectedCount > 0 ? `${selectedCount} selected` : `${totalFiles} files`}</ToolbarDescription>
  </ToolbarContent>
  <ToolbarActions>
    {selectedCount > 0 ? (
      <>
        <Button>Share</Button>
        <Button>Delete</Button>
      </>
    ) : (
      <Button>New Folder</Button>
    )}
  </ToolbarActions>
</Toolbar>
```

### Layout helpers

`ToolbarRow` is `flex` with `justify-between`. `ToolbarActions` adds `ml-auto`, so it always aligns right — use it to group buttons. Only add `justify-end` on `ToolbarRow` when placing a single button directly without `ToolbarActions`:

```tsx
<Toolbar>
  <ToolbarRow className="justify-end">
    <Button variant="glass" size="large" iconOnly>
      <TrashIcon />
    </Button>
  </ToolbarRow>
</Toolbar>
```

## Component API

### Toolbar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Auto-wrapped in a single `ToolbarRow` if no `ToolbarRow` children are present |
| `position` | `"top" \| "bottom"` | `"top"` | `top` adds a drag region; `bottom` (footer) never gets a window-control inset |
| `inset` | `"none" \| "windowControls" \| "windowControlsAndButton"` | auto | Escape hatch; normally resolved from layout context (see [Inset resolution](#inset-resolution)) |
| `background` | `"progressive-blur" \| "full-blur"` | `"progressive-blur"` | `progressive-blur` fades content as it scrolls behind; `full-blur` is a uniform backdrop blur with a bottom border |
| `disableLayoutTransition` | `boolean` | `false` | Skip the height/layout transition on the content wrapper (e.g. a docked composer) |
| `className` | `string` | - | Additional classes |

Inside a `<Sidebar>`, padding tightens to `pl-2 pr-[5px]` (vs `px-2`) and rows use `min-h-9` (36px, content-driven) instead of the fixed `h-13` (52px). Override row height with `className` on `ToolbarRow` (e.g. `h-16`).

### ToolbarRow

| Prop        | Type              | Default | Description                                 |
| ----------- | ----------------- | ------- | ------------------------------------------- |
| `children`  | `React.ReactNode` | -       | Row content                                 |
| `className` | `string`          | -       | Additional classes (use to override height) |

Only the first row receives the resolved inset; subsequent rows have none.

### ToolbarContent

| Prop        | Type              | Default | Description                                                             |
| ----------- | ----------------- | ------- | ----------------------------------------------------------------------- |
| `children`  | `React.ReactNode` | -       | Typically `ToolbarTitle` + `ToolbarDescription`; stacks them vertically |
| `className` | `string`          | -       | Additional classes                                                      |

Use the wrapper when you have both a title and a description. With a title only, render `ToolbarTitle` directly.

### ToolbarTitle / ToolbarDescription

Both take `children` and `className`. `ToolbarTitle` renders an `<h2>` at 15px medium (matching native unified-toolbar titles); `ToolbarDescription` renders a secondary-color `<p>`. Both truncate with ellipsis.

### ToolbarActions

`children` + `className`. Adds `ml-auto` to right-align grouped action buttons and applies the contextual toolbar button defaults through common wrappers such as tooltips and dropdown triggers. Do not add `variant` or `size` to ordinary toolbar buttons unless intentionally overriding the default.

### ToolbarBackButton

A pre-composed icon-only back button (chevron in a glass button) matching the native macOS back affordance, for detail-page navigation. Wire navigation through `onClick` (e.g. `router.history.back()`). For paired back/**forward** navigation (settings, history), use [`NavigationButtonGroup`](./button-group.md) instead. Extends `Button` props (minus `children` / `iconOnly`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Back"` | Accessible label + tooltip |
| `onClick` | `() => void` | - | Navigation handler |
| `variant` | `"glass" \| "transparent" \| "filled"` | `"glass"` | Content-area default; use `"transparent"` in sidebars |
| `size` | `"small" \| "medium" \| "large"` | `"large"` | Content-area default; use `"small"` in sidebars |

The easiest path is `ScrollArea`'s `leading` prop, which renders it on the toolbar's leading edge before the title. Or compose it directly:

```tsx
// ScrollArea sugar (recommended for detail pages)
<ScrollArea title={pokemon.name} leading={<ToolbarBackButton onClick={() => router.history.back()} />}>
  {detail}
</ScrollArea>

// Composed directly in a Toolbar
<Toolbar>
  <ToolbarBackButton onClick={goBack} />
  <ToolbarTitle>{pokemon.name}</ToolbarTitle>
  <ToolbarActions>
    <Button iconOnly>
      <ShareIcon />
    </Button>
  </ToolbarActions>
</Toolbar>

// In a sidebar toolbar
<ToolbarBackButton size="small" variant="transparent" onClick={goBack} />
```

### ToolbarSearchButton

A collapsible search control: a circular icon button that expands to a 200px input on click. Collapses on blur when empty; stays expanded while it has a value. Escape clears the value, then collapses on a second press. Use this instead of adding a raw `<input>` to the toolbar.

| Prop       | Type                                | Default    | Description                             |
| ---------- | ----------------------------------- | ---------- | --------------------------------------- |
| `value`    | `string`                            | -          | Controlled search value                 |
| `onChange` | `(value: string) => void`           | -          | Called when the value changes           |
| `size`     | `"small" \| "medium" \| "large"`    | `"medium"` | Collapsed size: 28px / 32px / 36px      |
| `ref`      | `React.Ref<ToolbarSearchButtonRef>` | -          | Imperative `{ focus(), blur() }` handle |

```tsx
const ref = React.useRef<ToolbarSearchButtonRef>(null);
const [query, setQuery] = React.useState("");

// e.g. focus on Cmd+F via ref.current?.focus()
<Toolbar>
  <ToolbarContent>
    <ToolbarTitle>Store</ToolbarTitle>
  </ToolbarContent>
  <ToolbarSearchButton ref={ref} value={query} onChange={setQuery} />
</Toolbar>;
```

To combine it with other actions, place it inside `ToolbarActions` alongside the buttons — the native Finder/Mail trailing-search pattern. `ToolbarActions` already right-aligns and gaps its children, so no wrapper of your own is needed:

```tsx
<ToolbarActions>
  <ToolbarSearchButton value={query} onChange={setQuery} />
  <Button iconOnly>
    <FilterIcon />
  </Button>
</ToolbarActions>
```

## Inset Resolution

The window-control inset is resolved automatically — do not set `inset` manually except as an escape hatch. Resolution order:

1. Explicit `inset` prop.
2. `position="bottom"` → `none` (footers never inset).
3. Inside a `<SplitView>`: the column's `insetHint`, else `windowControls` for the first column, else `none`. Deterministic across nested SplitViews and through wrapper components.
4. Raw `PanelGroup`, first panel + horizontal orientation → `windowControls`.
5. Not in any panel/layout context → `windowControls` (safe standalone default).
6. Otherwise → `none`.

Inset values: `windowControls` offsets content clear of the traffic-light controls; `windowControlsAndButton` additionally clears a pinned sidebar-toggle button.

## Design System Rules

### ✅ Do

- Prefer each wrapper's high-level chrome props for standard structure: `ScrollArea` has `title` / `subtitle` / `actions` / `leading`, `Sidebar` has `actions` / `searchable`, and `Inspector` has `title` / `actions`.
- For a multi-row or structurally custom header, pass a complete `<Toolbar>` through the wrapper's `toolbar` prop.
- Put buttons in `ToolbarActions` so content-area and sidebar defaults are applied automatically.
- Prefer icon-only or text-only buttons.
- Use `ToolbarContent` to stack title + description, `ToolbarActions` to right-align buttons, `ToolbarRow` for multi-row layouts.
- Use `ToolbarSearchButton` for search rather than a raw input.
- Keep actions to ~5–6; place primary actions on the right.

### ❌ Don't

- Nest a Toolbar inside `ScrollArea` children (use the `toolbar` prop).
- Pass `ToolbarContent`, `ToolbarTitle`, `ToolbarDescription`, or `ToolbarActions` to `toolbar` without a wrapping `<Toolbar>`.
- Use `toolbar` when the wrapper's high-level chrome props are sufficient.
- Use `variant="filled"` / `variant="accent"`, or `glass`/`large` buttons inside a sidebar toolbar.
- Add raw `<input>` search fields.
- Set `inset` manually or set inset on non-first rows (both are automatic).
- Duplicate the title between the toolbar and the content body (see below).

## Title Content

The title describes **what the user is viewing**, not the app itself — the app name already lives in the menu bar and Dock.

| App type     | Title shows      | Example                      |
| ------------ | ---------------- | ---------------------------- |
| Image viewer | Active filename  | `"bernoulli-numbers.png"`    |
| Mail detail  | Message subject  | `"Analytical Engine update"` |
| Notes        | Note title       | `"Meeting notes — Apr 17"`   |
| Settings     | Selected section | `"General"`                  |
| Folder view  | Folder name      | `"Documents"`                |

For single-view apps with no meaningful "active thing" (calculators, clocks), omit the title — the empty toolbar still drags and reserves room for the window controls. Never use the app name as the title.

Don't show the same title in both the toolbar and the content body. Either keep it in the toolbar (best for detail panels with simple titles) or render it in the content (best when it needs heading styling in a rich layout) — not both.
