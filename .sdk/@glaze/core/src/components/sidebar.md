# Sidebar

A native macOS-style navigation panel with glass morphism, an optional toolbar (actions + search), grouped/collapsible lists, and a footer. Use it for the primary navigation column of an app — sections, filters, folders, or record lists that drive what the main content area shows.

## When to Use

- App/section navigation, file or folder hierarchies, filter panels, settings categories.
- `SidebarList` for navigation and categorical selection (icon + label + optional accessory). Use `List` (`./list.md`) instead inside the sidebar when rows need rich display — title + description + multiple accessories.
- Never render two sidebars in the same app. Inside a `SplitView` (`./split-view.md`), the sidebar is the collapsible leading column.

## Required Structure

`Sidebar` owns the chrome (glass background, toolbar, footer, scroll). Pass toolbar/footer via **props**, not children:

- Actions and search → `actions` / `searchable` props (not a `Toolbar` child).
- Footer → `footer` prop with `SidebarFooter` (not a `SidebarFooter` child).
- List content → `SidebarList` as children, holding `SidebarListItem` / `SidebarListGroup`.

Don't put a `ToolbarTitle` in a sidebar — sidebars don't carry the active-view title; it belongs on the content area. Section labels (`SidebarListGroup title`) do the labeling.

## Usage Patterns

### Basic — actions + search + managed selection

`actions` buttons are auto-styled `variant="transparent" size="small"`; SVG icons auto-size to `size-4`. Search renders on its own row below actions. With `items`/`selectedItem`/`onSelectedItemChange`/`getItemKey`, selection is managed centrally (no `selected`/`onClick` per item), arrow-key nav and ARIA `listbox`/`option` roles are wired automatically.

```tsx
const [searchValue, setSearchValue] = useState("");
const [selectedNote, setSelectedNote] = useState<Note | null>(null);
const filtered = notes.filter((n) => n.title.toLowerCase().includes(searchValue.toLowerCase()));

<Sidebar
  searchable
  searchPlaceholder="Search notes..."
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  actions={
    <Button iconOnly onClick={createNote}>
      <PlusIcon className="size-4" />
    </Button>
  }
>
  <SidebarList
    items={filtered}
    selectedItem={selectedNote}
    onSelectedItemChange={setSelectedNote}
    getItemKey={(n) => n.id}
    emptyState={<EmptyState icon={<SearchIcon />} title="No results" />}
  >
    {filtered.map((note) => (
      <SidebarListItem key={note.id} item={note} icon={<NoteIcon className="size-4" />} title={note.title} />
    ))}
  </SidebarList>
</Sidebar>;
```

Omit `searchValue`/`onSearchChange` for uncontrolled search. Auto-styling descends through wrappers (`Tooltip`, `DropdownMenuTrigger asChild`, `Popover.Trigger asChild`), but not function-as-children — set `variant`/`size` on the inner Button yourself there. Explicit `variant`/`size` always wins. Keep to 2–3 buttons. When inside a `SplitView`, drop `<SplitView.SidebarToggle />` into `actions` for a (pinned, portal-anchored) collapse toggle — see `./split-view.md`.

### Manual selection (route-based navigation)

When managed selection doesn't fit, drive `selected` + `onClick` per item:

```tsx
<SidebarList>
  <SidebarListItem
    icon={<HomeIcon className="size-4" />}
    title="Home"
    selected={page === "home"}
    onClick={() => navigate("/")}
  />
  <SidebarListItem
    icon={<SettingsIcon className="size-4" />}
    title="Settings"
    selected={page === "settings"}
    onClick={() => navigate("/settings")}
  />
</SidebarList>
```

### Grouped navigation

`SidebarListGroup title` renders a styled section header. Accessory strings auto-style as muted tabular-num callouts.

```tsx
<SidebarList>
  <SidebarListItem icon={<InboxIcon className="size-4" />} title="Inbox" accessory="12" selected={view === "inbox"} />
  <SidebarListItem icon={<StarIcon className="size-4" />} title="Starred" selected={view === "starred"} />

  <SidebarListGroup title="Projects">
    <SidebarListItem icon={<FolderIcon className="size-4" />} title="Website Redesign" selected={view === "project1"} />
    <SidebarListItem icon={<FolderIcon className="size-4" />} title="Mobile App" selected={view === "project2"} />
  </SidebarListGroup>
</SidebarList>
```

### Collapsible sections and rows (Apple Mail-style)

Use the `collapsible` prop on `SidebarListGroup` (hide/show a whole section) or `SidebarListItem` (a row that both selects and expands nested children). Both handle chevron placement, hover-reveal, indentation, and selection-vs-toggle internally — describe the data, not the layout. Don't compose raw `CollapsibleRoot` (`./collapsible.md`) inside a sidebar; that primitive is for collapsible UI **outside** a sidebar.

Section-level: title is plain text; chevron + actions reveal together on hover/focus.

```tsx
<SidebarListGroup
  collapsible
  defaultOpen
  title="Favorites"
  actions={
    <Button iconOnly aria-label="New folder" onClick={createFolder}>
      <FolderPlusIcon className="size-3.5" />
    </Button>
  }
>
  <SidebarListItem icon={<InboxIcon className="size-4" />} title="Inbox" />
  <SidebarListItem icon={<FlagIcon className="size-4" />} title="Flagged" />
</SidebarListGroup>
```

Row-level: clicking the row fires `onClick` (selection); clicking the chevron toggles children without selecting. Nested `SidebarListItem` children become the collapsible content. Leaf siblings auto-reserve a chevron-width spacer so icons stay column-aligned.

```tsx
<SidebarListItem
  icon={<InboxIcon className="size-4" />}
  title="All Inboxes"
  collapsible
  defaultOpen
  selected={selected === "all"}
  onClick={() => setSelected("all")}
>
  <SidebarListItem
    icon={<InboxIcon className="size-4" />}
    title="iCloud"
    accessory="1"
    selected={selected === "icloud"}
    onClick={() => setSelected("icloud")}
  />
  <SidebarListItem
    icon={<InboxIcon className="size-4" />}
    title="samuel@raycast.com"
    selected={selected === "samuel"}
    onClick={() => setSelected("samuel")}
  />
</SidebarListItem>
```

### Searching collapsibles with `forceOpen`

To filter a collapsible sidebar: (1) filter items by matching title; (2) force-open every collapsible containing a match so results aren't hidden. Pass `forceOpen` down to **every** collapsible level. While `forceOpen` is true the collapsible stays open and the user's manual open state is preserved, so clearing the query reverts to what the user had.

```tsx
const [search, setSearch] = useState("");
const forceOpen = search.trim().length > 0;

<SidebarListGroup collapsible title="Favorites" defaultOpen forceOpen={forceOpen}>
  {filteredItems.map((item) => (
    <SidebarListItem
      key={item.id}
      icon={item.icon}
      title={item.label}
      collapsible={!!item.children}
      forceOpen={forceOpen}
      selected={selected === item.id}
      onClick={() => setSelected(item.id)}
    >
      {item.children?.map(/* recurse */)}
    </SidebarListItem>
  ))}
</SidebarListGroup>;
```

### Subtitle and custom row content

A `subtitle` renders below the title in `text-small text-tertiary`; the row grows to fit both lines:

```tsx
<SidebarListItem icon={<UserAvatar />} title="Samuel Kraft" subtitle="Apple Account" selected />
```

The props API (`icon`/`title`/`subtitle`/`accessory`, all `ReactNode`) covers most layouts. Drop to children mode (omit `title`) only when the **structural** layout differs — and still reuse the primitives (`SidebarListItemContent`, `SidebarListItemTitle`, `SidebarListItemSubtitle`, `SidebarListItemAccessory`) with `className` overrides rather than raw HTML. Example: a chat preview whose timestamp must top-align instead of center.

```tsx
<SidebarListItem selected={selected} onClick={onClick}>
  <Avatar />
  <SidebarListItemContent>
    <SidebarListItemTitle className="text-strong">{name}</SidebarListItemTitle>
    <SidebarListItemSubtitle>{lastMessage}</SidebarListItemSubtitle>
  </SidebarListItemContent>
  <SidebarListItemAccessory className="self-start">2:34 PM</SidebarListItemAccessory>
</SidebarListItem>
```

### Rich rows — `List` inside the sidebar

When rows need more than icon + label (title + description + multiple accessories), drop a full `List` (`./list.md`) directly as the sidebar's children instead of `SidebarList` — `Sidebar` only owns the chrome, so any scrollable content works as children.

```tsx
<Sidebar>
  <List.Root items={chats} selectedItem={selected} onSelectedItemChange={setSelected} getItemKey={(c) => c.id}>
    {chats.map((c) => (
      <List.Item key={c.id} item={c}>
        <List.ItemIcon src={c.avatar} />
        <List.ItemContent>
          <List.ItemTitle>{c.name}</List.ItemTitle>
          <List.ItemDescription>{c.lastMessage}</List.ItemDescription>
        </List.ItemContent>
        <List.ItemAccessory>{c.unread > 0 && <Badge>{c.unread}</Badge>}</List.ItemAccessory>
      </List.Item>
    ))}
  </List.Root>
</Sidebar>
```

### Footer

```tsx
<Sidebar
  footer={
    <SidebarFooter>
      <SidebarListItem icon={<SettingsIcon className="size-4" />} title="Settings" />
      <SidebarListItem icon={<UserIcon className="size-4" />} title="Account" />
    </SidebarFooter>
  }
>
  <SidebarList>{/* navigation items */}</SidebarList>
</Sidebar>
```

### Row context menu with destructive confirm

Wrap a row in `ContextMenu` (`./context-menu.md`) — not native `Menu.popup` — for in-app right-click menus. Destructive items set state read by a controlled `AlertDialog` (`./alert-dialog.md`) rather than deleting immediately.

```tsx
const [confirmDelete, setConfirmDelete] = useState<Note | null>(null);

<>
  <SidebarList>
    {notes.map((note) => (
      <ContextMenu key={note.id}>
        <ContextMenuTrigger asChild>
          <SidebarListItem item={note} icon={<FileTextIcon className="size-4" />} title={note.title} />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem icon="pencil" onSelect={() => rename(note.id)}>
            Rename
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem icon="trash" onSelect={() => setConfirmDelete(note)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ))}
  </SidebarList>

  <AlertDialog
    open={confirmDelete !== null}
    onOpenChange={(open) => !open && setConfirmDelete(null)}
    title={confirmDelete ? `Delete "${confirmDelete.title}"?` : ""}
    description="This note will be permanently deleted. This can't be undone."
    confirmLabel="Delete"
    confirmVariant="destructive"
    onConfirm={async () => {
      if (!confirmDelete) return;
      await deleteNote(confirmDelete.id); // throw to keep the dialog open for retry
    }}
  />
</>;
```

Use `AlertDialog` for any in-app confirm flow, not native `dialog.showMessageBox`. Native dialog APIs stay appropriate for OS-level flows (open/save dialogs, tray/menu-bar).

### Custom toolbar (escape hatch)

`actions` accepts any component (tabs, segmented controls, widgets). Reach for the `toolbar` prop only when you need a custom toolbar **layout** (multi-row, centered content). `toolbar` overrides `actions`/`searchable`. Toolbar buttons should be `variant="transparent" size="small"` with `size-4` icons.

```tsx
<Sidebar
  toolbar={
    <Toolbar className="pt-1">
      <ToolbarRow>
        <Tabs size="small" value={activeTab} onValueChange={setActiveTab}>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </Tabs>
      </ToolbarRow>
    </Toolbar>
  }
>
  <SidebarList>{/* content based on activeTab */}</SidebarList>
</Sidebar>
```

## Component API

### Sidebar

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | Sidebar content (typically a `SidebarList`) |
| `actions` | `React.ReactNode` | - | Toolbar action buttons; auto-styled `transparent`/`small`, right-aligned |
| `searchable` | `boolean` | - | Adds a full-width `ToolbarSearchInput` row to the toolbar |
| `searchPlaceholder` | `string` | `"Search"` | Search input placeholder |
| `searchValue` | `string` | - | Controlled search value; omit for uncontrolled |
| `onSearchChange` | `(value: string) => void` | - | Search change callback |
| `toolbar` | `React.ReactNode` | - | Escape hatch: custom `Toolbar`. Overrides `actions`/`searchable` |
| `footer` | `React.ReactNode` | - | Footer content (typically `SidebarFooter`) |
| `scrollEnabled` | `boolean` | `true` | Built-in scrolling; disable only to manage scroll manually |
| `className` | `string` | - | Additional classes |

### SidebarList\<T>

| Prop                   | Type                  | Default | Description                                      |
| ---------------------- | --------------------- | ------- | ------------------------------------------------ |
| `children`             | `React.ReactNode`     | -       | List items                                       |
| `items`                | `T[]`                 | -       | Items for managed selection                      |
| `selectedItem`         | `T \| null`           | -       | Currently selected item                          |
| `onSelectedItemChange` | `(item: T) => void`   | -       | Selection change callback                        |
| `getItemKey`           | `(item: T) => string` | -       | Key extractor; required when `items` is provided |
| `emptyState`           | `React.ReactNode`     | -       | Shown when `items` is an empty array             |
| `className`            | `string`              | -       | Additional classes                               |

Managed selection activates only when both `selectedItem` and `onSelectedItemChange` are set; it then wires click handling, Arrow/Home/End navigation, scroll-into-view, and ARIA roles.

### SidebarListItem\<T>

Extends `React.ComponentProps<"button">` (minus `onClick`, `title`). Setting `title` switches to **props mode** (component owns layout); otherwise children render as custom row content.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `T` | - | Data item for managed selection |
| `selected` | `boolean` | - | Explicit selection; overridden by context when `item` is provided |
| `onClick` | `() => void` | - | Click handler (also fires alongside managed selection) |
| `icon` | `React.ReactNode` | - | Leading icon; SVG auto-sizes to `size-4`, `shrink-0` |
| `title` | `React.ReactNode` | - | Row label, auto-truncated. **Presence enables props mode.** |
| `subtitle` | `React.ReactNode` | - | Secondary line, styled `text-small text-tertiary` |
| `accessory` | `React.ReactNode` | - | Trailing slot (`ml-auto`); string/number auto-wrap in muted tabular-num styling |
| `collapsible` | `boolean` | - | Wrap in a Collapsible; children become nested items. Requires `title` |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled collapsible) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Controlled open callback |
| `forceOpen` | `boolean` | - | Force open regardless of user state (search); user state preserved |
| `children` | `React.ReactNode` | - | Custom row content (no `title`), or nested items (with `title` + `collapsible`) |
| `className` | `string` | - | Additional classes |

### SidebarListGroup

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | - | Section label; renders a styled `<h2>` header |
| `actions` | `React.ReactNode` | - | Trailing actions; auto-styled `transparent`. In collapsible mode reveal with chevron |
| `collapsible` | `boolean` | - | Wrap in a Collapsible with a Mail-style hover-reveal header |
| `defaultOpen` | `boolean` | `true` | Initial open state (uncontrolled) |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Controlled open callback |
| `forceOpen` | `boolean` | - | Force open regardless of user state (search) |
| `children` | `React.ReactNode` | - | Group items |
| `className` | `string` | - | Additional classes |

### Subcomponents

- **`SidebarListGroupTitle`** — `{ children; asChild?: boolean; className? }`. The styled section header; `asChild` renders the styling onto a child (e.g. to compose a clickable trigger). Used internally by `SidebarListGroup title`.
- **`SidebarListItemContent`** — `<span>` flex-col container (`min-w-0 flex-1`) for title + subtitle in children mode.
- **`SidebarListItemTitle`** — `TextProps`; the truncating row title.
- **`SidebarListItemSubtitle`** — `<span>` props; the muted secondary line.
- **`SidebarListItemAccessory`** — `<span>` props. Styled trailing slot (`ml-auto shrink-0 flex items-center gap-1 text-small text-tertiary tabular-nums`). `accessory="12"` auto-wraps in this; use directly only for multi-piece accessories.
- **`SidebarFooter`** — `<div>` props. Footer wrapper with a progressive-blur fade from scrollable content.
- **`ToolbarSearchInput`** — `{ placeholder?; value?; onChange?; onKeyDown?; onFocus?; onBlur?; className?; ref? }`. The search input used by `searchable`; controlled via `value`, otherwise self-managed.

## Design System Rules

### ✅ Do

- Pass toolbar buttons via `actions` and search via `searchable` (auto-styled to blend with the glass).
- Prefer the props API (`icon` + `title` + `accessory`) for standard rows; use `title` on `SidebarListGroup` for section labels.
- Use managed selection (`items` + `selectedItem` + `item`) for data-driven lists; manual selection (`selected` + `onClick`) for route-based nav.
- Use `collapsible` on `SidebarListGroup`/`SidebarListItem` for hide/show — not raw `CollapsibleRoot` inside a sidebar.
- Pass `forceOpen` to every collapsible level during search.
- Use `size-4` icons for rows, `size-3.5` for header actions. Pass `SidebarFooter` via the `footer` prop.

### ❌ Don't

- Pass `Toolbar`, `ToolbarTitle`, or `SidebarFooter` as children — use the corresponding props.
- Put add/create actions inline with list labels or section titles — keep them in `actions`.
- Mix icon sizes within the same sidebar, or exceed 2–3 toolbar actions.
- Break the glass morphism with custom backgrounds, or set `scrollEnabled={false}` without a concrete reason.
- Use `SidebarFooter` for regular navigation items.
