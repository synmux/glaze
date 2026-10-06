# CustomContextMenu

A Radix-based context menu that renders on right-click with fully custom, glass-styled content. Use it when you need React children, custom colors, or layout inside menu items that the native menu can't express.

## When to Use

- Prefer [`ContextMenu`](./context-menu.md) for most cases — native macOS look, simple text labels with SF Symbol icons, native keyboard accelerators and accessibility.
- Use `CustomContextMenu` when items need **custom React children** (status dots, badges, component icons), **custom colors** (e.g. a destructive red action), or **custom layout** beyond plain text.
- Both support checkbox items, radio groups, and submenus — the styling and `children` flexibility is the differentiator.

## Usage Patterns

```tsx
import {
  CustomContextMenu,
  CustomContextMenuTrigger,
  CustomContextMenuContent,
  CustomContextMenuItem,
  CustomContextMenuCheckboxItem,
  CustomContextMenuRadioGroup,
  CustomContextMenuRadioItem,
  CustomContextMenuSeparator,
  CustomContextMenuLabel,
  CustomContextMenuShortcut,
  CustomContextMenuSub,
  CustomContextMenuSubTrigger,
  CustomContextMenuSubContent,
} from "@glaze/core/components";
```

### Basic

```tsx
<CustomContextMenu>
  <CustomContextMenuTrigger asChild>
    <div className="p-4 border rounded-lg">Right-click me</div>
  </CustomContextMenuTrigger>
  <CustomContextMenuContent>
    <CustomContextMenuItem>
      <PencilIcon className="w-4 h-4" />
      Edit
      <CustomContextMenuShortcut>⌘E</CustomContextMenuShortcut>
    </CustomContextMenuItem>
    <CustomContextMenuItem>
      <CopyIcon className="w-4 h-4" />
      Duplicate
    </CustomContextMenuItem>
    <CustomContextMenuSeparator />
    <CustomContextMenuItem className="text-support-red">
      <TrashIcon className="w-4 h-4" />
      Delete
    </CustomContextMenuItem>
  </CustomContextMenuContent>
</CustomContextMenu>
```

`inset` left-pads an item to align with icon-bearing siblings:

```tsx
<CustomContextMenuItem inset>No icon, still aligned</CustomContextMenuItem>
```

### Custom React children

The reason to reach for this component — render any component inside an item:

```tsx
<CustomContextMenuContent>
  <CustomContextMenuItem>
    <StatusIndicator color="green" />
    Active
  </CustomContextMenuItem>
  <CustomContextMenuItem>
    <StatusIndicator color="yellow" />
    Pending
  </CustomContextMenuItem>
</CustomContextMenuContent>
```

### Checkbox and radio items

```tsx
<CustomContextMenuContent>
  <CustomContextMenuLabel>View</CustomContextMenuLabel>
  <CustomContextMenuCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
    Show Toolbar
  </CustomContextMenuCheckboxItem>

  <CustomContextMenuSeparator />

  <CustomContextMenuLabel>Sort By</CustomContextMenuLabel>
  <CustomContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
    <CustomContextMenuRadioItem value="name">Name</CustomContextMenuRadioItem>
    <CustomContextMenuRadioItem value="date">Date</CustomContextMenuRadioItem>
  </CustomContextMenuRadioGroup>
</CustomContextMenuContent>
```

### Submenus

`CustomContextMenuSubTrigger` accepts an optional `value` that renders right-aligned next to the chevron (e.g. the current selection):

```tsx
<CustomContextMenuContent>
  <CustomContextMenuItem>Edit</CustomContextMenuItem>
  <CustomContextMenuSub>
    <CustomContextMenuSubTrigger value="Email">
      <ShareIcon className="w-4 h-4" />
      Share
    </CustomContextMenuSubTrigger>
    <CustomContextMenuSubContent>
      <CustomContextMenuItem>Email</CustomContextMenuItem>
      <CustomContextMenuItem>Copy Link</CustomContextMenuItem>
    </CustomContextMenuSubContent>
  </CustomContextMenuSub>
</CustomContextMenuContent>
```

## Component API

All parts wrap Radix `ContextMenu` primitives and forward their full prop set. Tables below list only the props added or commonly used on top of the primitive.

### CustomContextMenu

Root. Alias of Radix `ContextMenu.Root` — no styling.

### CustomContextMenuTrigger

The right-click target. Alias of Radix `ContextMenu.Trigger`.

| Prop      | Type      | Default | Description                    |
| --------- | --------- | ------- | ------------------------------ |
| `asChild` | `boolean` | `false` | Merge props onto child element |

### CustomContextMenuContent

Glass-styled menu container, portaled.

| Prop        | Type     | Default | Description        |
| ----------- | -------- | ------- | ------------------ |
| `className` | `string` | -       | Additional classes |

### CustomContextMenuItem

Standard menu item.

| Prop        | Type      | Default | Description                                  |
| ----------- | --------- | ------- | -------------------------------------------- |
| `inset`     | `boolean` | `false` | Left-pad to align with icon-bearing items    |
| `className` | `string`  | -       | Additional classes (e.g. `text-support-red`) |

### CustomContextMenuCheckboxItem

| Prop              | Type                         | Default | Description               |
| ----------------- | ---------------------------- | ------- | ------------------------- |
| `checked`         | `boolean \| "indeterminate"` | -       | Checkbox state            |
| `onCheckedChange` | `(checked: boolean) => void` | -       | Called when state changes |

### CustomContextMenuRadioGroup

| Prop            | Type                      | Default | Description               |
| --------------- | ------------------------- | ------- | ------------------------- |
| `value`         | `string`                  | -       | Selected value            |
| `onValueChange` | `(value: string) => void` | -       | Called when value changes |

### CustomContextMenuRadioItem

| Prop    | Type     | Default | Description              |
| ------- | -------- | ------- | ------------------------ |
| `value` | `string` | -       | **Required.** Item value |

### CustomContextMenuSubTrigger

Opens a submenu; renders a trailing chevron.

| Prop    | Type      | Default | Description                                                |
| ------- | --------- | ------- | ---------------------------------------------------------- |
| `inset` | `boolean` | `false` | Left-pad to align with icon-bearing items                  |
| `value` | `string`  | -       | Right-aligned text before the chevron (e.g. current value) |

### Other parts

- `CustomContextMenuSub` / `CustomContextMenuSubContent` — submenu container and its (portaled, glass) content.
- `CustomContextMenuLabel` — non-interactive header text; accepts `inset`.
- `CustomContextMenuSeparator` — visual divider.
- `CustomContextMenuShortcut` — right-aligned shortcut text inside an item.
- `CustomContextMenuGroup`, `CustomContextMenuPortal`, `CustomContextMenuRadioGroup` — Radix primitive aliases.

## Design System Rules

### ✅ Do

- Reach for this only when an item needs custom React children, color, or layout; otherwise use [`ContextMenu`](./context-menu.md).
- Lead items with an icon for quick visual scanning.
- Group related items with `CustomContextMenuSeparator` and `CustomContextMenuLabel`.
- Reserve `text-support-red` (and other colors) for destructive or important actions.

### ❌ Don't

- Use it for plain text menus — that is `ContextMenu`'s job.
- Nest submenus more than one level deep.
- Overload a single menu with too many items.
