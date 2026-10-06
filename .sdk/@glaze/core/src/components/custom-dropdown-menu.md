# CustomDropdownMenu

A composable dropdown menu built on Radix UI. Unlike `DropdownMenu` (which renders a native macOS menu), this renders custom HTML so items can hold arbitrary React children, colored indicators, radio groups, and submenus.

## When to Use

- You need **custom React children** in items: badges, colored status dots, React icon components, multi-line layouts.
- You need **radio-group selection** (single choice from a group) via `CustomDropdownMenuRadioGroup`.
- You need **nested submenus**, custom colors, or styling beyond what a native menu supports.
- Prefer `DropdownMenu` (native macOS menu) for simple action menus with text labels, checkboxes, and SF Symbol icons — it's the default choice. Reach for `CustomDropdownMenu` only when the above apply.

## Required Structure

Always: a `CustomDropdownMenu` root wrapping a `CustomDropdownMenuTrigger` and a `CustomDropdownMenuContent`. Items live inside the content.

```tsx
<CustomDropdownMenu>
  <CustomDropdownMenuTrigger asChild>
    <Button iconOnly>
      <MoreIcon className="size-4" />
    </Button>
  </CustomDropdownMenuTrigger>
  <CustomDropdownMenuContent>
    <CustomDropdownMenuItem>
      <EditIcon className="size-4" />
      Edit
    </CustomDropdownMenuItem>
    <CustomDropdownMenuSeparator />
    <CustomDropdownMenuItem>
      <TrashIcon className="size-4" />
      Delete
    </CustomDropdownMenuItem>
  </CustomDropdownMenuContent>
</CustomDropdownMenu>
```

Use `asChild` on the trigger to render your own `Button` as the trigger element. Items already apply `gap-2`, so an icon and label as siblings space themselves automatically.

## Usage Patterns

### Items with keyboard shortcuts

`CustomDropdownMenuShortcut` is right-aligned (`ml-auto`). Use macOS symbols (⌘ ⌥ ⌃ ⇧ ⌫ ⏎ ⎋).

```tsx
<CustomDropdownMenuItem>
  <EditIcon className="size-4" />
  Edit
  <CustomDropdownMenuShortcut>⌘E</CustomDropdownMenuShortcut>
</CustomDropdownMenuItem>
```

### Checkbox items (multi-select filter)

```tsx
<CustomDropdownMenuContent>
  <CustomDropdownMenuLabel>File Types</CustomDropdownMenuLabel>
  <CustomDropdownMenuCheckboxItem checked={filters.images} onCheckedChange={(c) => updateFilter("images", c)}>
    Images
  </CustomDropdownMenuCheckboxItem>
  <CustomDropdownMenuCheckboxItem checked={filters.docs} onCheckedChange={(c) => updateFilter("docs", c)}>
    Documents
  </CustomDropdownMenuCheckboxItem>
  <CustomDropdownMenuSeparator />
  <CustomDropdownMenuItem onSelect={clearAllFilters}>Clear Filters</CustomDropdownMenuItem>
</CustomDropdownMenuContent>
```

### Radio group (single-select sort)

Wrap `CustomDropdownMenuRadioItem`s in a `CustomDropdownMenuRadioGroup` with `value` / `onValueChange`.

```tsx
<CustomDropdownMenuContent>
  <CustomDropdownMenuLabel>Sort by</CustomDropdownMenuLabel>
  <CustomDropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
    <CustomDropdownMenuRadioItem value="name">Name</CustomDropdownMenuRadioItem>
    <CustomDropdownMenuRadioItem value="date">Date Modified</CustomDropdownMenuRadioItem>
    <CustomDropdownMenuRadioItem value="size">Size</CustomDropdownMenuRadioItem>
  </CustomDropdownMenuRadioGroup>
</CustomDropdownMenuContent>
```

### Nested submenu

```tsx
<CustomDropdownMenuContent>
  <CustomDropdownMenuItem>Edit</CustomDropdownMenuItem>
  <CustomDropdownMenuSub>
    <CustomDropdownMenuSubTrigger>
      <ShareIcon className="size-4" />
      Share
    </CustomDropdownMenuSubTrigger>
    <CustomDropdownMenuSubContent>
      <CustomDropdownMenuItem>Email Link</CustomDropdownMenuItem>
      <CustomDropdownMenuItem>Copy Link</CustomDropdownMenuItem>
    </CustomDropdownMenuSubContent>
  </CustomDropdownMenuSub>
</CustomDropdownMenuContent>
```

### Grouping with labels and separators

Use `CustomDropdownMenuGroup` + `CustomDropdownMenuLabel` for section headers, `CustomDropdownMenuSeparator` between sections, and `align="end"` on content to right-align (e.g. an account menu).

```tsx
<CustomDropdownMenuContent align="end">
  <CustomDropdownMenuGroup>
    <CustomDropdownMenuLabel>Layout</CustomDropdownMenuLabel>
    <CustomDropdownMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
      <CustomDropdownMenuRadioItem value="grid">Grid View</CustomDropdownMenuRadioItem>
      <CustomDropdownMenuRadioItem value="list">List View</CustomDropdownMenuRadioItem>
    </CustomDropdownMenuRadioGroup>
  </CustomDropdownMenuGroup>
  <CustomDropdownMenuSeparator />
  <CustomDropdownMenuGroup>
    <CustomDropdownMenuLabel>Display</CustomDropdownMenuLabel>
    <CustomDropdownMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
      Show Hidden Files
    </CustomDropdownMenuCheckboxItem>
  </CustomDropdownMenuGroup>
</CustomDropdownMenuContent>
```

## Component API

All parts wrap the matching Radix `DropdownMenu` primitive and accept its full prop set. Only the additions/overrides are listed below.

### CustomDropdownMenu

Root. Renders with Radix's `modal={false}` so the page stays interactive while the menu is open. Accepts all Radix `Root` props (`open`, `onOpenChange`, `defaultOpen`, …).

### CustomDropdownMenuTrigger

Radix `Trigger`. Use `asChild` to render your own element (typically a `Button`).

### CustomDropdownMenuContent

| Prop         | Type                           | Default    | Description                     |
| ------------ | ------------------------------ | ---------- | ------------------------------- |
| `sideOffset` | `number`                       | `4`        | Distance in px from the trigger |
| `align`      | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger   |

Portals itself automatically; positions relative to the trigger.

### CustomDropdownMenuItem

| Prop       | Type          | Default | Description                                        |
| ---------- | ------------- | ------- | -------------------------------------------------- |
| `inset`    | `boolean`     | `false` | Indent (`pl-8`) to align with checkbox/radio items |
| `onSelect` | `(e) => void` | -       | Called when the item is chosen                     |
| `disabled` | `boolean`     | `false` | Dims and disables the item                         |

### CustomDropdownMenuCheckboxItem

| Prop              | Type                         | Default | Description    |
| ----------------- | ---------------------------- | ------- | -------------- |
| `checked`         | `boolean \| "indeterminate"` | -       | Checked state  |
| `onCheckedChange` | `(checked: boolean) => void` | -       | Change handler |

Renders a checkmark indicator on the right when checked.

### CustomDropdownMenuRadioGroup / CustomDropdownMenuRadioItem

`RadioGroup` takes `value` and `onValueChange`. Each `RadioItem` takes a `value: string` and shows a checkmark when selected.

### CustomDropdownMenuSub / CustomDropdownMenuSubTrigger / CustomDropdownMenuSubContent

`Sub` wraps a submenu. `SubTrigger` renders a trailing chevron and accepts `inset?: boolean` and an optional `value?: string` (shown as muted trailing text before the chevron). `SubContent` is auto-portaled.

### CustomDropdownMenuLabel

| Prop    | Type      | Default | Description                      |
| ------- | --------- | ------- | -------------------------------- |
| `inset` | `boolean` | `false` | Indent to align with other items |

Small muted section header. Not interactive.

### CustomDropdownMenuSeparator

Thin divider line between sections.

### CustomDropdownMenuShortcut

A `<span>` (`React.HTMLAttributes<HTMLSpanElement>`) right-aligned via `ml-auto`. Place inside an item to show its keyboard shortcut.

### CustomDropdownMenuGroup / CustomDropdownMenuPortal

`Group` groups items for semantics. `Portal` is the raw Radix portal, exported for advanced custom rendering.

## Design System Rules

### ✅ Do

- Use `asChild` on the trigger to render your own `Button`.
- Give icons consistent sizing (`size-4`); items already provide `gap-2` spacing.
- Group related items with `CustomDropdownMenuGroup` + `CustomDropdownMenuLabel`, and separate sections with `CustomDropdownMenuSeparator`.
- Pick the right item type: `Item` for actions, `CheckboxItem` for multi-select, `RadioItem` for single-select.
- Reach for native `DropdownMenu` first; only use this when you need custom children, radio groups, or submenus.

### ❌ Don't

- Pack many items into one flat menu without grouping (group past ~8-10).
- Add manual margins like `mr-2` on icons — `gap-2` already spaces them.
- Override styling in ways that break the popover surface.
- Use a dropdown menu as primary navigation.
