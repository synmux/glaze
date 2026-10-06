# List

A native macOS-style vertical list for collections of items, with optional single-selection, built-in keyboard navigation, auto-scroll-into-view, and infinite-scroll support. Reach for it when you have a flat or sectioned list of records (files, search results, settings rows) where a row is the unit of interaction.

## When to Use

- Lists of records where each row is selectable or clickable: file browsers, search results, settings rows, mailbox/inbox lists.
- Enable single selection by passing both `selectedItem` and `onSelectedItemChange`; omit them for a plain, non-interactive list.
- Group rows under headings with `List.Section` + `List.SectionTitle`.
- For tabular data with aligned columns, a real table layout is a better fit; List rows are flexbox, not a grid.

## Required Structure

`List.Item` must live inside `List.Root` (it reads selection state from context and throws otherwise). A typical row composes the part components:

```tsx
<List.Item item={dataItem}>
  <List.ItemIcon>{/* icon or <img> */}</List.ItemIcon>
  <List.ItemContent>
    <List.ItemTitle>{/* primary text */}</List.ItemTitle>
    <List.ItemDescription>{/* secondary text */}</List.ItemDescription>
  </List.ItemContent>
  <List.ItemAccessory>{/* optional right-side content */}</List.ItemAccessory>
</List.Item>
```

## Usage Patterns

### Basic (with selection)

Passing both `selectedItem` and `onSelectedItemChange` turns on selection, keyboard navigation, and the `listbox`/`option` ARIA roles.

```tsx
const [selectedFile, setSelectedFile] = useState<File | null>(null);

<List.Root
  items={files}
  selectedItem={selectedFile}
  onSelectedItemChange={setSelectedFile}
  getItemKey={(file) => file.id}
>
  {files.map((file) => (
    <List.Item key={file.id} item={file}>
      <List.ItemIcon>
        <FileIcon />
      </List.ItemIcon>
      <List.ItemContent>
        <List.ItemTitle>{file.name}</List.ItemTitle>
        <List.ItemDescription>{file.description}</List.ItemDescription>
      </List.ItemContent>
      <List.ItemAccessory>{formatDate(file.modifiedAt)}</List.ItemAccessory>
    </List.Item>
  ))}
</List.Root>;
```

### Plain list (no selection)

Omit selection props for a static list. Use `onClick` on individual items for activation, and an image icon via `src`/`alt`:

```tsx
<List.Root items={settings} getItemKey={(s) => s.id}>
  {settings.map((setting) => (
    <List.Item key={setting.id} item={setting} onClick={(s) => openSetting(s)}>
      <List.ItemIcon src={setting.iconUrl} alt={setting.title} />
      <List.ItemContent>
        <List.ItemTitle>{setting.title}</List.ItemTitle>
        <List.ItemDescription>{setting.description}</List.ItemDescription>
      </List.ItemContent>
      <List.ItemAccessory>
        <ChevronRightIcon />
      </List.ItemAccessory>
    </List.Item>
  ))}
</List.Root>
```

### Sections

```tsx
<List.Root items={allItems} selectedItem={selected} onSelectedItemChange={setSelected} getItemKey={(i) => i.id}>
  <List.Section>
    <List.SectionTitle>Recent</List.SectionTitle>
    {recent.map((item) => (
      <List.Item key={item.id} item={item}>
        <List.ItemContent>
          <List.ItemTitle>{item.name}</List.ItemTitle>
        </List.ItemContent>
      </List.Item>
    ))}
  </List.Section>
  <List.Section>
    <List.SectionTitle>Older</List.SectionTitle>
    {/* items */}
  </List.Section>
</List.Root>
```

Keyboard navigation walks the flat `items` array, so include every item shown across sections in `items` and keep `items` order matching render order.

### Infinite scroll

Pass `onEndReached`; an `IntersectionObserver` fires it when the end marker scrolls into view. `endThreshold` widens the trigger zone (pixels before the bottom).

```tsx
<List.Root
  items={items}
  selectedItem={selectedItem}
  onSelectedItemChange={setSelectedItem}
  getItemKey={(item) => item.id}
  onEndReached={isLoading ? undefined : loadMore}
  endThreshold={200}
>
  {/* items */}
  {isLoading && (
    <Text as="div" color="secondary" className="p-4 text-center">
      Loading more…
    </Text>
  )}
</List.Root>
```

### Programmatic focus / key forwarding

`List.Root` forwards a `ListRef` exposing `focus()` and `handleKeyDown(event)` — useful to focus the list from a parent (e.g. on a search field's ArrowDown) or to forward keys captured elsewhere.

```tsx
const listRef = useRef<ListRef>(null);

<List.Root ref={listRef} items={items} selectedItem={sel} onSelectedItemChange={setSel} getItemKey={(i) => i.id}>
  {/* items */}
</List.Root>;

// elsewhere
listRef.current?.focus();
```

## Component API

### List.Root

Extends `div` props. Selection is enabled only when both `selectedItem` and `onSelectedItemChange` are provided.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | — | Required. Data items; drives keyboard navigation order. |
| `getItemKey` | `(item: T) => string` | — | Required. Stable unique key per item. |
| `selectedItem` | `T \| null` | — | Currently selected item; provide with `onSelectedItemChange` to enable selection. |
| `onSelectedItemChange` | `(item: T \| null) => void` | — | Selection change handler. |
| `onEndReached` | `() => void` | — | Called when the bottom end marker enters the viewport (infinite scroll). |
| `endThreshold` | `number` | `0` | Pixels before the bottom that triggers `onEndReached`. |
| `autoFocus` | `boolean` | `false` | Focus the list on mount (skipped if an input/textarea/contenteditable is focused). |
| `onNavigationKeyDown` | `(event: React.KeyboardEvent) => void` | — | Extra key handler, called after built-in navigation. |

Ref type `ListRef`: `{ focus(): void; handleKeyDown(event): void }`.

### List.Item

Extends `div` props (except `onClick`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `T` | — | Required. The data item this row represents. |
| `onClick` | `(item: T) => void` | — | Activation handler; suppressed when the click originates from an interactive child (button, input, link, or element with an interactive ARIA role). |

Selection happens on `pointerdown` (primary button only) for Finder-like immediacy; right-click does not move selection. The selected item auto-scrolls into view (`block: "nearest"`).

### List.ItemIcon

Two mutually exclusive shapes; both render at `w-8 h-8` and `shrink-0`.

| Variant | Props                        | Description                                        |
| ------- | ---------------------------- | -------------------------------------------------- |
| Element | `children` (+ `div` props)   | Centers any node (an icon component, emoji, etc.). |
| Image   | `src`, `alt` (+ `img` props) | Renders an `<img>` directly.                       |

### Other parts

| Part | Element | Notes |
| --- | --- | --- |
| `List.ItemContent` | `div` | Vertical stack for title/description; `flex-1 min-w-0`. |
| `List.ItemTitle` | `Text as="h2" variant="strong"` | Primary text, `line-clamp-1`. |
| `List.ItemDescription` | `Text as="p" color="secondary"` | Secondary text, `line-clamp-2`. |
| `List.ItemAccessory` | `div` | Right-aligned secondary content (dates, counts, chevrons); tertiary color. |
| `List.Section` | `div` | Groups items; adds top spacing (none on first). |
| `List.SectionTitle` | `Text as="h3"` | Section heading, tertiary/small-strong. |

## Design System Rules

### ✅ Do

- Always provide a stable, unique `getItemKey`.
- Use `List.ItemContent` to wrap title/description, and `List.ItemAccessory` for right-side info.
- Keep all rows in a list structurally similar for a consistent rhythm.
- Use `onClick` on `List.Item` (not a nested button) for row activation.

### ❌ Don't

- Don't render `List.Item` outside `List.Root` — it throws.
- Don't wrap the whole row in a button/link; the row handles its own click. Interactive children (buttons, inputs, links) are fine — their clicks are excluded from the item click.
- Don't add background styling that fights the `bg-list-selection` selected state.
- Don't omit items from `items` that are rendered — keyboard navigation iterates that array.
