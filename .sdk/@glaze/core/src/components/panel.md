# Panel

A resizable panel system for native macOS-style multi-column and split layouts. `PanelGroup` lays out `Panel` children with drag-to-resize handles, smooth collapse/expand animations, and per-group size persistence to `localStorage`.

Prefer [`SplitView`](./split-view.md) for standard app shells — it wraps `PanelGroup`/`Panel` with semantic slots (sidebar / list / primary / inspector), preset sizing, and a column context that [`Toolbar`](./toolbar.md) and [`ScrollArea`](./scroll-area.md) read to auto-apply window-control inset and scrollbar clearance. Reach for raw `PanelGroup` + `Panel` only for bespoke layouts `SplitView` can't express — 4+ columns, vertical splits, fixed-size primary.

## When to Use

- Multi-column interfaces where the user resizes columns: sidebar + list + detail, file browsers, code editors, dashboards.
- Vertical splits (editor + terminal, content + status bar) via `orientation="vertical"`.
- Not for simple static layouts that never need resizing — use flexbox/grid directly.
- For a conventional app shell, use [`SplitView`](./split-view.md) instead.

## Required Structure

Direct children of `PanelGroup` MUST be `<Panel>` elements — it throws at render time otherwise. Set `defaultSize` on every panel except the one that should fill the remaining space (a flex panel; omit `defaultSize`).

```tsx
<PanelGroup>
  <Panel defaultSize={200}>{/* fixed first column */}</Panel>
  <Panel defaultSize={300}>{/* fixed middle column */}</Panel>
  <Panel>{/* flex — fills remaining space, no defaultSize */}</Panel>
</PanelGroup>
```

Move portals and non-panel siblings (`Dialog`, `Popover`, `DropdownMenu`, `Tooltip`, toast containers, context providers, stray fragments/`div`s) outside `PanelGroup`, or render them inside a `Panel`'s children:

```tsx
<>
  <PanelGroup>
    <Panel defaultSize={200}>...</Panel>
    <Panel>...</Panel>
  </PanelGroup>
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>...</DialogContent>
  </Dialog>
</>
```

## Usage Patterns

### Basic two-panel layout

```tsx
<PanelGroup>
  <Panel defaultSize={250} minSize={200} maxSize={400}>
    <Sidebar>Sidebar content</Sidebar>
  </Panel>
  <Panel>
    <MainContent>Main content area</MainContent>
  </Panel>
</PanelGroup>
```

### Three-column layout

```tsx
<PanelGroup>
  <Panel defaultSize={200} minSize={150} maxSize={300}>
    <Sidebar>Navigation</Sidebar>
  </Panel>
  <Panel defaultSize={400} minSize={300}>
    <List>Content list</List>
  </Panel>
  <Panel>
    <DetailView>Detail panel</DetailView>
  </Panel>
</PanelGroup>
```

### Vertical split

```tsx
<PanelGroup orientation="vertical">
  <Panel defaultSize={400} minSize={200}>
    <CodeEditor>Main editing area</CodeEditor>
  </Panel>
  <Panel minSize={100}>
    <Terminal>Terminal — fills remaining space</Terminal>
  </Panel>
</PanelGroup>
```

### Collapsible panels

Toggle `hidden` for an animated collapse/expand. Use `anchor="end"` on a leading panel (e.g. a sidebar) so its content slides off the leading edge instead of squishing.

```tsx
const [sidebarHidden, setSidebarHidden] = useState(false);

<PanelGroup>
  <Panel defaultSize={250} minSize={200} hidden={sidebarHidden} anchor="end">
    <Sidebar />
  </Panel>
  <Panel>
    <MainContent>
      <Button onClick={() => setSidebarHidden((h) => !h)}>Toggle Sidebar</Button>
    </MainContent>
  </Panel>
</PanelGroup>;
```

### Multiple PanelGroups

Sizes persist to `localStorage` automatically; the storage key is derived from panel count. With more than one `PanelGroup` in the app, give each a distinct `storageKey` so they don't collide. A single group needs no `storageKey`.

```tsx
<PanelGroup storageKey="main-layout">
  <Panel defaultSize={200} minSize={150}>
    <Sidebar />
  </Panel>
  <Panel>
    <MainContent />
  </Panel>
</PanelGroup>

<PanelGroup storageKey="settings-layout">
  <Panel defaultSize={250} minSize={200}>
    <SettingsSidebar />
  </Panel>
  <Panel>
    <SettingsContent />
  </Panel>
</PanelGroup>
```

## Component API

### PanelGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Must be `<Panel>` elements only; throws otherwise. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction. |
| `onChange` | `(sizes: number[]) => void` | - | Called on resize end with the pixel size of every panel (hidden = `0`). |
| `onResizeStateChange` | `(isDragging: boolean) => void` | - | Called when a drag-resize starts (`true`) and ends (`false`). |
| `storageKey` | `string` | - | localStorage key prefix; only needed with multiple groups in one app. |
| `className` | `string` | - | Additional classes on the flex container. |

### Panel

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | - | Panel content (fills `h-full w-full`). The panel is a positioning context, so absolutely-centered content (e.g. a default `EmptyState`) centers within the panel. |
| `defaultSize` | `number` | - | Initial size in px. Omit on the flex panel that fills remaining space. |
| `minSize` | `number` | `50` | Minimum size in px. |
| `maxSize` | `number` | unlimited | Maximum size in px. |
| `hidden` | `boolean` | `false` | Collapse the panel with an animated transition. |
| `anchor` | `"start" \| "end"` | `"start"` | Edge content stays pinned to while collapsing. `"end"` for leading panels like sidebars. |
| `className` | `string` | - | Additional classes. |
| `style` | `CSSProperties` | - | Inline styles on the panel element. |

## Design System Rules

### ✅ Do

- Set `minSize` on resizable panels so they can't shrink to an unusable width.
- Leave `defaultSize` off exactly one panel — the flex panel that fills remaining space.
- Use `hidden` for collapse/expand, with `anchor="end"` on leading panels.
- Give each group a distinct `storageKey` when an app has more than one `PanelGroup`.
- Prefer [`SplitView`](./split-view.md) for standard sidebar/list/detail shells.

### ❌ Don't

- Put non-`Panel` elements as direct children of `PanelGroup` — it throws.
- Set `defaultSize` on the flex panel; it auto-fills remaining space.
- Add a `storageKey` when there's only one group (it isn't needed).
- Mix orientations within one group.
- Hide critical UI in a collapsible panel with no other way to reach it.
