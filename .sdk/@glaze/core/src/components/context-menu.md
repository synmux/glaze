# ContextMenu

A right-click context menu that renders through the system's native macOS popup menu — system styling, animations, and accessibility for free. It is the default choice for context menus on in-app elements (list rows, sidebar items, cards, table cells).

## When to Use

- Right-click action menus on in-app items with text labels and optional SF Symbol icons, checkbox items, or one level of submenu.
- Use **CustomContextMenu** instead when items need custom React children (badges, React-component icons), custom styling, or radio groups.
- Use **DropdownMenu** instead for menus opened by clicking a button rather than right-clicking.
- For right-click → confirm-destructive flows (e.g. "Delete" on a sidebar row), compose with a controlled `AlertDialog` — see the "Row actions" section of [sidebar.md](./sidebar.md). Don't reach for native `Menu.popup` + `dialog.showMessageBox`; those are for the app menu bar / tray / file pickers, not in-app rows.

## Required Structure

`ContextMenuContent` and all item components are markers that render nothing — the actual menu is native. Items are extracted from JSX in order, so the children must be these components directly (fragments and `ContextMenuGroup` are flattened). Wrap the right-click target in `ContextMenuTrigger`.

```tsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuSub,
  ContextMenuGroup,
} from "@glaze/core/components";
```

## Usage Patterns

### Basic

```tsx
<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="p-4 border rounded-lg">Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem icon="pencil" onSelect={handleEdit}>
      Edit
    </ContextMenuItem>
    <ContextMenuItem icon="doc.on.doc" accelerator="⌘D" onSelect={handleDuplicate}>
      Duplicate
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem icon="trash" color="red" onSelect={handleDelete}>
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

Items accept `accelerator` (shortcut text like `"⌘C"`), `sublabel` (secondary text below the label), and `disabled`.

### Checkbox items

```tsx
<ContextMenuContent>
  <ContextMenuLabel>View Options</ContextMenuLabel>
  <ContextMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden} icon="eye.slash">
    Show Hidden Files
  </ContextMenuCheckboxItem>
  <ContextMenuCheckboxItem checked={showExtensions} onCheckedChange={setShowExtensions}>
    Show Extensions
  </ContextMenuCheckboxItem>
</ContextMenuContent>
```

### Submenus and groups

`ContextMenuSub` nests one level deep (its `label` is required). `ContextMenuGroup` is flattened into the parent — use it with a `ContextMenuLabel` and `ContextMenuSeparator` to visually section items.

```tsx
<ContextMenuContent>
  <ContextMenuGroup>
    <ContextMenuLabel>Actions</ContextMenuLabel>
    <ContextMenuItem icon="play" onSelect={handleRun}>
      Run
    </ContextMenuItem>
    <ContextMenuSub label="Share" icon="square.and.arrow.up">
      <ContextMenuItem icon="envelope" onSelect={handleEmailShare}>
        Email
      </ContextMenuItem>
      <ContextMenuItem icon="doc.on.clipboard" onSelect={handleCopyLink}>
        Copy Link
      </ContextMenuItem>
    </ContextMenuSub>
  </ContextMenuGroup>
  <ContextMenuSeparator />
  <ContextMenuItem icon="trash" color="red" onSelect={handleDelete}>
    Delete
  </ContextMenuItem>
</ContextMenuContent>
```

### Colored items

Tint label + icon with `color`, or color just the icon with `iconColor` (which overrides `color` for the icon). Available on `ContextMenuItem`, `ContextMenuCheckboxItem`, and `ContextMenuSub`.

```tsx
<ContextMenuContent>
  <ContextMenuItem icon="checkmark.circle.fill" iconColor="green" onSelect={handleApprove}>
    Approve
  </ContextMenuItem>
  <ContextMenuSub label="Danger Zone" icon="exclamationmark.triangle.fill" color="red">
    <ContextMenuItem icon="archivebox" onSelect={handleArchive}>
      Archive
    </ContextMenuItem>
    <ContextMenuItem icon="trash" color="red" onSelect={handleDelete}>
      Delete Permanently
    </ContextMenuItem>
  </ContextMenuSub>
</ContextMenuContent>
```

`color` / `iconColor` accept a named token (`"red"`, `"orange"`, `"yellow"`, `"green"`, `"mint"`, `"teal"`, `"cyan"`, `"blue"`, `"indigo"`, `"purple"`, `"pink"`, `"brown"`, `"gray"`, `"primary"`, `"secondary"`) or any hex string (`"#FF8800"`). Named tokens adapt to light/dark mode and accessibility settings; use hex only for exact brand colors.

### On a table row

```tsx
{
  items.map((item) => (
    <ContextMenu key={item.id}>
      <ContextMenuTrigger asChild>
        <TableRow>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.status}</TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon="eye" onSelect={() => handleView(item)}>
          View Details
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon="trash" color="red" onSelect={() => handleDelete(item)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ));
}
```

## Component API

### ContextMenu

Root component that manages the menu and extracts items from `ContextMenuContent`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disable the context menu |
| `highlightTrigger` | `boolean` | `true` | Set `data-context-menu-open` on the trigger element while the menu is open. No-op when the trigger is a `<tr>` (table rows are excluded) — highlight a table-row trigger another way |
| `onOpen` | `() => void` | - | Called when the menu opens |
| `onClose` | `() => void` | - | Called when the menu closes |
| `children` | `ReactNode` | - | A `ContextMenuTrigger` and a `ContextMenuContent` |

### ContextMenuTrigger

Listens for right-click on its child.

| Prop       | Type        | Default | Description                                                                 |
| ---------- | ----------- | ------- | --------------------------------------------------------------------------- |
| `asChild`  | `boolean`   | `false` | Merge the right-click handler onto the child instead of a wrapping `<span>` |
| `children` | `ReactNode` | -       | The right-click target                                                      |

### ContextMenuContent

Marker holding the menu items. Renders nothing — items are read and shown natively.

### ContextMenuItem

| Prop          | Type             | Default | Description                                                        |
| ------------- | ---------------- | ------- | ------------------------------------------------------------------ |
| `icon`        | `NativeMenuIcon` | -       | SF Symbol name (e.g. `"folder.fill"`) or image                     |
| `sublabel`    | `string`         | -       | Secondary text below the label                                     |
| `accelerator` | `string`         | -       | Keyboard shortcut text (e.g. `"⌘C"`)                               |
| `disabled`    | `boolean`        | `false` | Disable the item                                                   |
| `color`       | `MenuItemColor`  | -       | Label color (also tints icon if `iconColor` omitted); token or hex |
| `iconColor`   | `MenuItemColor`  | -       | Icon color only; overrides `color` for the icon                    |
| `onSelect`    | `() => void`     | -       | Called when the item is selected                                   |
| `children`    | `ReactNode`      | -       | Display text (text content only)                                   |

### ContextMenuCheckboxItem

Same as `ContextMenuItem` plus:

| Prop              | Type                         | Default | Description                   |
| ----------------- | ---------------------------- | ------- | ----------------------------- |
| `checked`         | `boolean`                    | `false` | Checkbox state                |
| `onCheckedChange` | `(checked: boolean) => void` | -       | Called when the state changes |

### ContextMenuSub

Submenu container (one level deep).

| Prop        | Type             | Default | Description                                          |
| ----------- | ---------------- | ------- | ---------------------------------------------------- |
| `label`     | `string`         | -       | **Required.** Submenu item text                      |
| `icon`      | `NativeMenuIcon` | -       | SF Symbol name or image                              |
| `disabled`  | `boolean`        | `false` | Disable the submenu                                  |
| `color`     | `MenuItemColor`  | -       | Label color (also tints icon if `iconColor` omitted) |
| `iconColor` | `MenuItemColor`  | -       | Icon color only; overrides `color` for the icon      |
| `children`  | `ReactNode`      | -       | Submenu items                                        |

### ContextMenuLabel

Non-interactive header text (rendered as a disabled item). Takes `children`.

### ContextMenuSeparator

Visual divider. No props.

### ContextMenuGroup

Groups related items; flattened into the parent menu. Takes `children`.

## Design System Rules

### ✅ Do

- Use for right-click menus on items (table rows, list items, cards, sidebar items).
- Use clear, action-oriented labels and include icons for quick scanning.
- Section related items with `ContextMenuGroup` + `ContextMenuLabel` and separators.
- Limit submenus to one level deep.

### ❌ Don't

- Use for button-triggered menus (use `DropdownMenu`).
- Put React components inside item children (use `CustomContextMenu`).
- Cram more than ~8–10 items into one menu without grouping.
- Nest submenus more than one level.
