# ScrollArea

A scrollable viewport with custom macOS-style scrollbars and slots for a sticky toolbar (top) and footer (bottom). It measures the toolbar/footer with a ResizeObserver and automatically pads the content and insets the scrollbar so nothing overlaps. Reach for it as the standard container for any scrollable view — lists, grids, detail panels, dialog bodies, chat transcripts.

## When to Use

- **Scrollable content with chrome**: long content that needs a sticky header (title, filters, search) or footer (pagination, composer).
- **Lists and grids**: wrap `List.Root` / `Grid.Root` so headers stay pinned while rows scroll.
- **Chat / streaming output**: with `autoScrollToBottom` to follow new content and an optional scroll-to-bottom button.
- **Dialog or sheet bodies** that may overflow.
- Inside a `SplitView` column or `Panel` — scrollbar insets are handled for you (see Required Structure).

## Usage Patterns

### Basic

Set a height constraint (`h-full`, `h-96`, `max-h-96`) — a ScrollArea needs defined dimensions to scroll. It defaults to `h-full max-h-screen` when a vertical scrollbar is shown.

```tsx
<ScrollArea className="h-96">
  <div className="space-y-2 p-4">
    {items.map((item) => (
      <div key={item.id} className="rounded-lg bg-well p-3">
        {item.content}
      </div>
    ))}
  </div>
</ScrollArea>
```

### Toolbar via props (common case)

For the "title + maybe a subtitle + maybe action buttons" case, skip the manual `<Toolbar>` and pass `title` / `subtitle` / `actions`. Buttons in `actions` are auto-styled with content-area defaults (`variant="glass"`, `size="large"`) and SVG icon children auto-size to `size-5` (20px) — even through wrappers like `Tooltip`, `DropdownMenuTrigger asChild`, or `Popover.Trigger asChild`. Explicit `variant` / `size` on a Button still wins.

```tsx
<ScrollArea
  title="Inbox"
  subtitle="12 unread"
  actions={
    <Button iconOnly>
      <ComposeIcon className="size-4.5" />
    </Button>
  }
>
  <List.Root items={messages} getItemKey={(m) => m.id}>
    {messages.map((m) => (
      <List.Item key={m.id} item={m}>
        <List.ItemContent>
          <List.ItemTitle>{m.subject}</List.ItemTitle>
        </List.ItemContent>
      </List.Item>
    ))}
  </List.Root>
</ScrollArea>
```

`title` describes **what the user is viewing** (filename, message subject, selected section), not the app name — macOS already shows the app in the Dock and menu bar. For single-view apps with no active context (calculators, clocks), omit `title`; the empty toolbar still drags the window and reserves space for window controls. Don't duplicate the title in both the toolbar and an in-content `<h1>` — pick one.

For a back affordance on detail pages, pass `leading` — content rendered on the toolbar's leading edge, before the title. Button children are auto-styled like `actions`. The paved path is [`ToolbarBackButton`](./toolbar.md):

```tsx
<ScrollArea title={pokemon.name} leading={<ToolbarBackButton onClick={() => router.history.back()} />}>
  {detail}
</ScrollArea>
```

### Custom toolbar (escape hatch)

For multi-row toolbars, a search bar, or any custom structure, include a complete `<Toolbar>` in `toolbar`. It takes precedence over `title` / `subtitle` / `actions` (a dev warning fires if you set both). The value may also contain related sibling chrome, such as a dialog. Never pass bare `ToolbarContent`, `ToolbarTitle`, `ToolbarDescription`, or `ToolbarActions` slots: without a `<Toolbar>` there is no window-control inset or progressive blur.

```tsx
<ScrollArea
  toolbar={
    <Toolbar>
      <ToolbarRow>
        <ToolbarTitle>Documents</ToolbarTitle>
      </ToolbarRow>
      <ToolbarRow>
        <ToolbarSearchInput value={query} onChange={setQuery} />
      </ToolbarRow>
    </Toolbar>
  }
>
  {children}
</ScrollArea>
```

### Chat with auto-scroll

Follow streaming output and show a floating scroll-to-bottom button when the user scrolls away. Auto-scroll only fires when the user is already at the bottom, so it never fights manual scrolling. Pass `autoScrollDeps` (e.g. `[messages]`) to also scroll on dependency changes; for an imperative jump (e.g. on a new request) use `scrollControlRef.current.forceScrollToBottom()`.

```tsx
const scrollControlRef = useRef<ScrollAreaControl>(null);

<ScrollArea
  title="Chat"
  footer={<ChatInput onSend={handleSend} />}
  autoScrollToBottom
  autoScrollDeps={[messages]}
  showScrollToBottomButton
  scrollControlRef={scrollControlRef}
>
  {messages.map((message) => (
    <Message key={message.id} message={message} />
  ))}
</ScrollArea>;
```

### Fade edges

Set `fadeEdges` to mask the top/bottom with a 32px gradient when content overflows in that direction (the fade clears once you scroll to an edge).

```tsx
<ScrollArea fadeEdges className="h-64">
  {longContent}
</ScrollArea>
```

## Required Structure

- **Pass toolbar/footer as props, not as siblings of the content.** They render in absolutely-positioned, measured containers; the viewport pads itself to match. Nesting a `<Toolbar>` inside `children` will not pin or inset correctly.
- **`toolbar` must contain a complete `<Toolbar>`.** Wrappers and related siblings are allowed; content/title/action slot components remain valid only inside the Toolbar. Prefer `title` / `subtitle` / `actions` / `leading` whenever they can express the header.
- **Set a height constraint** on the ScrollArea (or rely on the `h-full` default inside a sized parent).
- **Inside `SplitView` / `PanelGroup`**: do not set `Toolbar inset="none"` yourself — the column context applies the correct inset. When the ScrollArea is the last column, an extra 18px is added to the scrollbar's bottom offset so its endpoint clears the macOS window's rounded corner; any `scrollbarBottomOffset` you pass is added on top.

## Component API

### ScrollArea

Forwards a ref to the scroll viewport element. Also accepts all Radix `ScrollArea.Root` props except `title` (e.g. `type`, `scrollHideDelay`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Scrollable content |
| `toolbar` | `React.ReactNode` | — | Custom chrome containing a complete `<Toolbar>`. Overrides `title`/`subtitle`/`actions`/`leading` |
| `title` | `React.ReactNode` | — | Builds a `<ToolbarTitle>` in an auto Toolbar. The active view, not the app name |
| `subtitle` | `React.ReactNode` | — | Builds a `<ToolbarDescription>` under the title |
| `actions` | `React.ReactNode` | — | Action buttons in a `<ToolbarActions>` slot, auto-styled with content-area defaults |
| `leading` | `React.ReactNode` | — | Leading-edge chrome before the title (e.g. `<ToolbarBackButton>`), auto-styled like `actions` |
| `footer` | `React.ReactNode` | — | Sticky bottom chrome (pagination, composer) |
| `className` | `string` | — | Classes for the root element (set height here) |
| `viewportClassName` | `string` | — | Classes for the inner scroll viewport |
| `fadeEdges` | `boolean` | `false` | Mask overflowing top/bottom edges with a gradient |
| `autoScrollToBottom` | `boolean` | `false` | Follow content to the bottom when the user is already at the bottom |
| `autoScrollDeps` | `React.DependencyList` | — | Deps that also trigger an auto-scroll when they change |
| `showScrollToBottomButton` | `boolean` | `false` | Floating button that appears when scrolled away from the bottom |
| `scrollbars` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Which scrollbars to render |
| `scrollbarBottomOffset` | `number` | `0` | Extra px inset for the scrollbar's bottom endpoint |
| `scrollbarTopOffset` | `number` | `0` | Extra px inset for the scrollbar's top endpoint |
| `scrollControlRef` | `React.MutableRefObject<ScrollAreaControl \| null>` | — | Exposes imperative scroll controls |

### ScrollAreaControl

The object assigned to `scrollControlRef.current`:

| Method | Type | Description |
| --- | --- | --- |
| `forceScrollToBottom` | `() => void` | Jump to the bottom unconditionally and resume auto-scroll tracking |
| `suspendAutoFollow` | `() => void` | (internal — pagination scroll corrections) Freeze auto-follow-bottom while the viewport is driven programmatically. Reference-counted; pair with `resumeAutoFollow` |
| `resumeAutoFollow` | `() => void` | (internal — pagination scroll corrections) Resume auto-follow-bottom; on the final resume the at-bottom belief is recomputed from live geometry |

Behavior notes: toolbar/footer heights are measured with a ResizeObserver, so the viewport padding and scrollbar inset update as their content grows or shrinks. Scrollbars are custom-styled and expand on hover (8px → 12px). The scroll `type` follows the macOS "Show scroll bars" preference unless you pass `type` explicitly.

## Design System Rules

### ✅ Do

- Pass toolbar/footer as props so they're measured and positioned automatically.
- Prefer `title` / `subtitle` / `actions` / `leading` for standard single-row chrome.
- Set a height constraint on the ScrollArea.
- Use `title` for the active context (filename, subject, section), or omit it for single-view apps.
- Use `autoScrollToBottom` + `showScrollToBottomButton` for chat/streaming output.
- Virtualize large datasets for scroll performance.

### ❌ Don't

- Nest a `Toolbar`/footer inside `children` instead of passing the props.
- Pass bare `ToolbarContent`, `ToolbarTitle`, `ToolbarDescription`, or `ToolbarActions` slots to `toolbar`; wrap them in `<Toolbar>`.
- Use `toolbar` when the standard header props are sufficient.
- Manually compute scrollbar offsets or content padding — the component handles it.
- Set `Toolbar inset="none"` inside a `SplitView`/`PanelGroup`.
- Nest scroll areas unnecessarily (causes scroll conflicts).
- Duplicate the title in both the toolbar and the content.
