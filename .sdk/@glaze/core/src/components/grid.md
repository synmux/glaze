# Grid

A compound component for displaying a collection of items in a 2D grid with built-in keyboard navigation, single-item selection, and infinite-scroll support. Reach for it for visual collections — file browsers, photo/media galleries, app launchers, icon pickers — where items are shown as thumbnails or icons rather than rows.

## When to Use

- Visual collections where each item is primarily an icon, thumbnail, or image (photo galleries, app launchers, file browsers, icon pickers).
- You need 2D arrow-key navigation and a single selected item.
- Use `List` instead for text-heavy, single-column rows. For a fixed/responsive CSS grid with no selection or keyboard model, plain Tailwind grid classes are simpler.

## Usage Patterns

### Basic

`Grid.Root` is controlled: you own `selectedItem` and update it via `onSelectedItemChange`. `getItemKey` must return a stable unique key per item. Arrow keys move the selection in 2D, Home/End jump to the first/last item, and Enter (or double-click) fires `onAction` — all built in.

```tsx
const [selected, setSelected] = useState<File | null>(null);

<Grid.Root
  items={files}
  selectedItem={selected}
  onSelectedItemChange={setSelected}
  getItemKey={(file) => file.id}
  columns={4}
>
  {files.map((file) => (
    <Grid.Item key={file.id} item={file} onAction={(file) => openFile(file)}>
      <Grid.ItemContent>
        <FileIcon className="size-8" />
      </Grid.ItemContent>
      <Grid.ItemTitle>{file.name}</Grid.ItemTitle>
      <Grid.ItemDescription>{file.size}</Grid.ItemDescription>
      <Grid.ItemAccessory>
        <StarIcon className="size-3" />
      </Grid.ItemAccessory>
    </Grid.Item>
  ))}
</Grid.Root>;
```

### Fixed vs responsive columns

Pass `columns` for a fixed count, or `minColumnWidth` for a responsive grid that fills as many columns as fit (CSS `auto-fill`). When `minColumnWidth` is set, `columns` is ignored and the rendered column count is measured so arrow-key navigation jumps the correct number of cells.

```tsx
<Grid.Root
  minColumnWidth={120}
  items={items}
  selectedItem={selected}
  onSelectedItemChange={setSelected}
  getItemKey={(i) => i.id}
>
  {/* items */}
</Grid.Root>
```

### Photo gallery with infinite scroll

`onEndReached` fires when a sentinel near the bottom scrolls into view; tune the trigger distance with `endThreshold` (px). `Grid.ItemAccessory` sits in the top-right corner for status indicators.

```tsx
<Grid.Root
  items={photos}
  selectedItem={selectedPhoto}
  onSelectedItemChange={setSelectedPhoto}
  getItemKey={(photo) => photo.id}
  columns={6}
  onEndReached={loadMorePhotos}
  endThreshold={200}
>
  {photos.map((photo) => (
    <Grid.Item key={photo.id} item={photo} onAction={(photo) => viewFullSize(photo)}>
      <Grid.ItemContent>
        <img src={photo.thumbnail} alt={photo.title} className="size-full object-cover rounded-lg" draggable={false} />
      </Grid.ItemContent>
      <Grid.ItemTitle>{photo.title}</Grid.ItemTitle>
      <Grid.ItemAccessory>{photo.isLiked && <HeartIcon className="size-3 text-support-red" />}</Grid.ItemAccessory>
    </Grid.Item>
  ))}
</Grid.Root>
```

### App launcher with autofocus

`autoFocus` focuses the grid on mount (unless an input is already focused) so arrow keys work immediately.

```tsx
<Grid.Root
  items={apps}
  selectedItem={selectedApp}
  onSelectedItemChange={setSelectedApp}
  getItemKey={(app) => app.id}
  columns={5}
  autoFocus
>
  {apps.map((app) => (
    <Grid.Item key={app.id} item={app} onAction={(app) => launchApp(app)}>
      <Grid.ItemContent>
        <img src={app.icon} alt={app.name} className="size-12" draggable={false} />
      </Grid.ItemContent>
      <Grid.ItemTitle>{app.name}</Grid.ItemTitle>
    </Grid.Item>
  ))}
</Grid.Root>
```

### Loading and empty rows (full-width children)

`Grid.Root` is a CSS grid, so any direct child that isn't a `Grid.Item` — a loading spinner, empty state, or footer — lands in a single cell unless you span it. Add `col-span-full`, and guard `onEndReached` so it doesn't re-fire mid-load.

```tsx
<Grid.Root
  items={items}
  selectedItem={selected}
  onSelectedItemChange={setSelected}
  getItemKey={(i) => i.id}
  onEndReached={isLoading ? undefined : loadMore}
>
  {items.map((item) => (
    <Grid.Item key={item.id} item={item}>
      {/* … */}
    </Grid.Item>
  ))}
  {isLoading && (
    <div className="col-span-full p-8 text-center">
      <Spinner />
    </div>
  )}
</Grid.Root>
```

## Required Structure

A grid item composes these parts (all optional except the item itself):

```tsx
<Grid.Item item={dataItem} onAction={handleAction}>
  <Grid.ItemContent>{/* main visual — icon, image, or graphic */}</Grid.ItemContent>
  <Grid.ItemTitle>{/* primary label */}</Grid.ItemTitle>
  <Grid.ItemDescription>{/* optional secondary text */}</Grid.ItemDescription>
  <Grid.ItemAccessory>{/* optional status indicator, top-right */}</Grid.ItemAccessory>
</Grid.Item>
```

## Component API

### Grid.Root

Extends `div` props. Renders a `role="grid"` container. Accepts a `GridRef` via `ref` (`{ focus(), handleKeyDown(event) }`) for programmatic control.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | — | Data items to render (required). |
| `selectedItem` | `T \| null` | — | Currently selected item (required, controlled). |
| `onSelectedItemChange` | `(item: T \| null) => void` | — | Selection change handler (required). |
| `getItemKey` | `(item: T) => string` | — | Stable unique key per item (required). |
| `columns` | `number` | `4` | Fixed column count. Ignored when `minColumnWidth` is set. |
| `minColumnWidth` | `number` | — | Min cell width (px); switches to responsive CSS `auto-fill`. |
| `onEndReached` | `() => void` | — | Fired when the bottom sentinel enters view (infinite scroll). |
| `endThreshold` | `number` | `0` | Px before the bottom to trigger `onEndReached`. |
| `autoFocus` | `boolean` | `false` | Focus the grid on mount for keyboard nav. |
| `onNavigationKeyDown` | `(event: React.KeyboardEvent) => void` | — | Called after built-in key handling. |

### Grid.Item

Extends `button` props (minus `onClick`/`onDoubleClick`). Renders `role="gridcell"`.

| Prop       | Type                | Default | Description                                        |
| ---------- | ------------------- | ------- | -------------------------------------------------- |
| `item`     | `T`                 | —       | The data item this cell represents (required).     |
| `onAction` | `(item: T) => void` | —       | Fired on double-click and on Enter while selected. |

### Grid.ItemContent

Extends `div` props. Main visual area: square aspect ratio with a subtle background; shows an inset ring when selected.

### Grid.ItemTitle

Extends `h3` props (minus `color`). Primary label, rendered as strong `Text`, clamped to 2 lines.

### Grid.ItemDescription

Extends `p` props (minus `color`). Secondary text, rendered as small secondary `Text`, clamped to 2 lines.

### Grid.ItemAccessory

Extends `div` props. Absolutely positioned in the top-right corner for badges/status icons.

## Design System Rules

### ✅ Do

- Keep `Grid.ItemContent` on a consistent (square) aspect ratio across items.
- Use `onAction` for the primary open/launch interaction (double-click and Enter).
- Put thumbnails or icons in `Grid.ItemContent`; use `Grid.ItemAccessory` for small status indicators.
- Choose a column count (or `minColumnWidth`) that keeps items large enough to be readable.

### ❌ Don't

- Put interactive controls inside `Grid.Item` — the cell itself is the button and owns interaction.
- Use a grid for plain text rows — use `List`.
- Pack in so many columns that items become unusably small.
