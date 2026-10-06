# SplitView

Mac-style app shell with up to four columns (sidebar, list, primary, inspector). Wraps `PanelGroup` / `Panel` with semantic slots, preset sizing, and a column context that `Toolbar` and `ScrollArea` read to auto-apply the window-control inset and Tahoe scrollbar clearance. Reach for it when your columns play the sidebar / list / primary / inspector roles (Mail, Notes, Pages, Xcode); for any other shape, stay on raw `PanelGroup` + `Panel`.

## When to Use

- **Mac app-shell layouts** where columns play sidebar / list / primary / inspector roles — any subset is fine: sidebar + primary, list + primary, sidebar + list + primary, sidebar + primary + inspector, all four.
- Stay on raw `PanelGroup` + `Panel` for any other shape: peer columns of any count (kanban boards, side-by-side editors, diff views), vertical splits, or a fixed-size primary with another column flexing. Column count alone doesn't decide it — the question is whether the columns play those four roles.

## Mental Model

Two rules:

1. **`children` is always the primary column and always flex.** That's where your main content or a TanStack Router `<Outlet/>` goes.
2. **`sidebar`, `list`, and `inspector` are optional bounded columns.** Presence determines which show up; column count is 1–4.

Slots render left-to-right in this order:

- **`sidebar`** — leftmost navigation column. Typically a `<Sidebar>`.
- **`list`** — middle browsing / selection column. Accepts any selection surface: `<List.Root>`, `<Grid.Root>`, a custom table, a thumbnail strip.
- **`children`** — primary column, always flex, between the leading columns and any `inspector`.
- **`inspector`** — trailing column for metadata, properties, preview, or format controls (Apple's term: Xcode, Photos info, Pages format panel). Typically an `<Inspector>` (bakes in `ScrollArea` + toolbar + standard padding).

## Usage Patterns

### Basic

`children` is the only required slot; add bounded columns as props.

```tsx
<SplitView sidebar={<Sidebar>...</Sidebar>}>
  <ScrollArea title="All Notes">
    <NotesList />
  </ScrollArea>
</SplitView>
```

### Mail (sidebar + list + primary)

The full three-column browse shape. `storageKey` persists resize and collapse state.

```tsx
<SplitView
  sidebar={<MailSidebar activeFolder={folderId} />}
  list={
    <ScrollArea title={folder.title}>
      <MessageList folderId={folderId} />
    </ScrollArea>
  }
  storageKey="mail"
>
  <Outlet /> {/* message detail renders here */}
</SplitView>
```

### Pages / Xcode (sidebar + primary + inspector)

The inspector is always to the right of the primary. Pass `<Inspector>` so you only write rows / sections. Hide it two ways: collapsed in place (`defaultInspectorCollapsed` / `inspectorCollapsed` — subtree stays mounted, state preserved, use for user-toggleable inspectors) or unmounted (pass `undefined` to `inspector` — use when the slot doesn't apply at all).

```tsx
<SplitView
  sidebar={<PagesSidebar actions={<SplitView.SidebarToggle />} />}
  inspector={
    <Inspector title="Format" actions={<SplitView.InspectorToggle />}>
      <InspectorSection title="Font">…</InspectorSection>
    </Inspector>
  }
  inspectorSize={{ default: 280, min: 240, max: 360 }}
  defaultInspectorCollapsed
  storageKey="pages"
>
  <ScrollArea title={page.title}>
    <DocumentEditor />
  </ScrollArea>
</SplitView>
```

### Collapsible toggles

`<SplitView.SidebarToggle />` and `<SplitView.InspectorToggle />` are prebuilt icon buttons wired to the current state, rendered only when the matching slot is present. They default to `variant="glass"` + `size="large"`; inside a `<Sidebar>` (or when pinned) they auto-switch to `variant="transparent"` + `size="small"`. They accept any `Button` prop.

Both are **`pinned` by default**: the button portals to a fixed anchor at the SplitView frame's leading / trailing edge, so it stays in the same pixel position whether the panel is open or collapsed (Xcode / Mail / Pages). Write the toggle where it's semantically discoverable — `SidebarToggle` in `Sidebar.actions`, `InspectorToggle` in `Inspector.actions` — and the portal moves it to the right spot. Pass `pinned={false}` to render inline at the JSX location (e.g. an inspector toggle grouped with other toolbar actions); don't do this for a `SidebarToggle` inside `Sidebar.actions` — it vanishes when the sidebar collapses, leaving only the keyboard shortcut.

### Controlled collapse

Use controlled mode when collapse state is driven by routing, settings, or external signals.

```tsx
const [inspectorCollapsed, setInspectorCollapsed] = useState(false);

<SplitView
  inspector={
    <Inspector title="Format" actions={<SplitView.InspectorToggle />}>
      <FormatControls />
    </Inspector>
  }
  inspectorCollapsed={inspectorCollapsed}
  onInspectorCollapsedChange={setInspectorCollapsed}
>
  <DocumentEditor />
</SplitView>;
```

### Toggling from anywhere in the tree

`useSplitView()` exposes collapse state + toggles for any descendant:

```tsx
import { useSplitView } from "@glaze/core/components";

function MyToolbarButton() {
  const { inspectorCollapsed, toggleInspector } = useSplitView();
  return <Button onClick={toggleInspector}>{inspectorCollapsed ? "Show" : "Hide"} Info</Button>;
}
```

### Per-slot sizing

Override the defaults when they don't fit your app. Primary (`children`) is always flex.

```tsx
<SplitView
  sidebar={<Sidebar />}
  sidebarSize={{ default: 240, min: 200, max: 320 }}
  list={<MessageList />}
  listSize={{ default: 280, min: 220, max: 420 }}
  primarySize={{ min: 360 }}
>
  <Outlet />
</SplitView>
```

Defaults: **Sidebar** `{ default: 200, min: 180, max: 300 }`, **List** `{ default: 300, min: 240 }` (no max), **Primary** flex (optional `min`), **Inspector** `{ default: 280, min: 240 }` (no max).

### Routing with TanStack Router

Prefer a single `SplitView` on the parent route: it renders the full layout, sidebar and list come from URL params, and `<Outlet/>` populates the varying detail — one resize context, one `localStorage` entry.

```tsx
// /mail/$folderId — parent route renders the whole layout
function MailLayout() {
  const { folderId } = useParams();
  return (
    <SplitView
      sidebar={<MailSidebar activeFolder={folderId} />}
      list={<MessageList folderId={folderId} />}
      storageKey="mail"
    >
      <Outlet />
    </SplitView>
  );
}
```

Nest a second `SplitView` only when a route genuinely has its own multi-column shape (a sub-workspace, embedded editor, settings panel inside a bigger shell). Nested views compose: the overall leftmost column still gets the window-control inset, the overall rightmost still gets the Tahoe scrollbar offset, regardless of nesting depth. **Pass distinct `storageKey`s to each nested `SplitView`** — without them the fallback persistence key (`panel-sizes-{count}`) collides.

## Component API

### SplitView

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — (required) | Primary column, always flex |
| `primarySize` | `{ min?: number }` | — | Primary column minimum width |
| `sidebar` | `React.ReactNode` | — | Leftmost column (typically `<Sidebar>`) |
| `sidebarSize` | `{ default?: number; min?: number; max?: number }` | `{ 200, 180, 300 }` | Sidebar size override |
| `sidebarCollapsed` | `boolean` | — | Controlled collapse state (pair with `onSidebarCollapsedChange`) |
| `defaultSidebarCollapsed` | `boolean` | `false` | Uncontrolled initial state; persisted with `storageKey` |
| `onSidebarCollapsedChange` | `(collapsed: boolean) => void` | — | Fires on collapse change |
| `list` | `React.ReactNode` | — | Middle browsing / selection column |
| `listSize` | `{ default?: number; min?: number; max?: number }` | `{ 300, 240 }` | List size override |
| `inspector` | `React.ReactNode` | — | Trailing metadata / preview column; pass `undefined` to unmount |
| `inspectorSize` | `{ default?: number; min?: number; max?: number }` | `{ 280, 240 }` | Inspector size override |
| `inspectorCollapsed` | `boolean` | — | Controlled collapse state (pair with `onInspectorCollapsedChange`) |
| `defaultInspectorCollapsed` | `boolean` | `false` | Uncontrolled initial state; persisted with `storageKey` |
| `onInspectorCollapsedChange` | `(collapsed: boolean) => void` | — | Fires on collapse change |
| `storageKey` | `string` | — | Scoped key for resize + collapse persistence; must be unique when nesting |
| `className` | `string` | — | Applied to the inner `PanelGroup` |

### SplitView.SidebarToggle / SplitView.InspectorToggle

Both accept any `Button` prop (`Omit`-ing `aria-pressed`, `aria-label`, `onClick`, `children` from the public surface) plus `pinned`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pinned` | `boolean` | `true` | Portal to a fixed frame-edge anchor (stays put across open/collapsed). `false` renders inline at the JSX location |
| `aria-label` | `string` | auto ("Show/Hide …") | Override the accessible label |
| `children` | `React.ReactNode` | default icon | Override the icon |

`SidebarToggle` renders only when `sidebar` is set (`⌃⌘S` tooltip); `InspectorToggle` only when `inspector` is set (`⌃⌘I` tooltip).

### useSplitView()

Returns `{ hasSidebar, sidebarCollapsed, toggleSidebar, setSidebarCollapsed, hasInspector, inspectorCollapsed, toggleInspector, setInspectorCollapsed, … }`. Throws if used outside a `<SplitView>`.

### useSplitViewColumnContext()

Returns `{ isFirst, isLast }` for the column subtree, or `null` outside a `SplitView`. `isFirst` is the overall leftmost column (true in exactly one slot per window); `isLast` the overall rightmost. `Toolbar` reads `isFirst` to apply `inset="windowControls"`; `ScrollArea` reads `isLast` to add bottom scrollbar clearance.

## Design System Rules

### ✅ Do

- Use only when columns play sidebar / list / primary / inspector roles; otherwise use raw `PanelGroup` + `Panel`.
- Put main content or an `<Outlet/>` in `children` — it's the flex column.
- Render a column's `EmptyState` inside that column — each column is a positioning context, so a default (centered) empty state centers within its own pane instead of across the window.
- Pass a unique `storageKey` per `SplitView`, especially when nesting.
- Keep `SidebarToggle` / `InspectorToggle` pinned (the default) and place them in `Sidebar.actions` / `Inspector.actions`.

### ❌ Don't

- Set `Toolbar inset` manually inside a `SplitView` — the column context applies it; manual values cause redundant or wrong insets.
- Drop a bare `<PanelGroup>` inside a `SplitView` column — it won't join the column context, so inset / edge behavior breaks silently. Nest another `<SplitView>` or drop the outer one.
- Use `pinned={false}` for a `SidebarToggle` in `Sidebar.actions` — it disappears on collapse.
- Reach for `SplitView` for kanban boards, diff views, vertical splits, or a fixed-size primary — use raw `Panel`.
