# DropdownMenu

A native macOS dropdown menu rendered by the system popup menu — system styling, animations, and accessibility for free. This is the default choice for action menus; reach for it unless you need capabilities only the renderer-drawn `CustomDropdownMenu` provides.

## When to Use

- Action menus and "more actions" buttons with text labels and optional SF Symbol icons.
- Context menus, checkbox (toggle) items, and one level of submenus.
- When you want the native macOS look and feel.
- Use [`CustomDropdownMenu`](./custom-dropdown-menu.md) instead when items need custom React children (badges, React-component icons) or styling beyond what native menus support.

## Usage Patterns

Items are declared as JSX children of `DropdownMenuContent`, but they are **marker components** — they render nothing. The parent extracts their props (in JSX order) and builds a native menu. So children must be plain text and the item set is read once when the menu opens.

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuGroup,
} from "@glaze/core/components";
```

### Basic

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button iconOnly variant="glass">
      <MoreHorizontalIcon className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem icon="pencil" onSelect={handleEdit}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem icon="doc.on.doc" accelerator="⌘D" onSelect={handleDuplicate}>
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem icon="trash" color="red" onSelect={handleDelete}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

`asChild` merges trigger behavior onto your own button. Without it, `DropdownMenuTrigger` renders a plain `<button>`: `<DropdownMenuTrigger>Click me</DropdownMenuTrigger>`.

### Separate anchor and trigger

Pass `anchorRef` when the element that opens the menu is only one part of a larger control, such as a split button. The trigger still owns interaction and accessibility, while the referenced element supplies the bounds used for menu placement and minimum width.

```tsx
const splitButtonRef = useRef<HTMLSpanElement>(null);

<span ref={splitButtonRef} className="inline-flex">
  <ButtonGroup variant="glass">
    <Button onClick={handleOpen}>Open</Button>
    <ButtonGroupSeparator />
    <DropdownMenu anchorRef={splitButtonRef}>
      <DropdownMenuTrigger asChild>
        <Button iconOnly aria-label="Open With">
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleOpenInFinder}>Finder</DropdownMenuItem>
        <DropdownMenuItem onSelect={handleOpenInEditor}>Editor</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</span>;
```

### Checkbox items (toggleable filters)

`DropdownMenuCheckboxItem` is for independent on/off toggles. For a single-select group, use `CustomDropdownMenu` with a RadioGroup instead.

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel>Show</DropdownMenuLabel>
  <DropdownMenuCheckboxItem checked={showImages} onCheckedChange={setShowImages} icon="photo">
    Images
  </DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem checked={showDocuments} onCheckedChange={setShowDocuments} icon="doc">
    Documents
  </DropdownMenuCheckboxItem>
</DropdownMenuContent>
```

### Submenus and groups

`DropdownMenuSub` nests one level of items (don't go deeper). `DropdownMenuGroup` is flattened into the parent menu — use it with `DropdownMenuLabel` and separators to organize sections.

```tsx
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
    <DropdownMenuItem onSelect={() => setSortBy("name")}>Name</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => setSortBy("date")}>Date Modified</DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuSub label="Share" icon="square.and.arrow.up">
    <DropdownMenuItem icon="envelope" onSelect={handleEmailShare}>
      Email Link
    </DropdownMenuItem>
    <DropdownMenuItem icon="doc.on.clipboard" onSelect={handleCopyLink}>
      Copy Link
    </DropdownMenuItem>
  </DropdownMenuSub>
</DropdownMenuContent>
```

### Sublabels and colored items

`sublabel` renders secondary text below the label. `color` tints the label (and the icon, unless `iconColor` overrides it); `iconColor` tints the icon alone. Both accept a named token or a hex string (see Component API).

```tsx
<DropdownMenuContent>
  <DropdownMenuItem icon="checkmark.circle.fill" iconColor="green" onSelect={handleApprove}>
    Approve
  </DropdownMenuItem>
  <DropdownMenuItem icon="doc.richtext" sublabel="Preserves formatting" onSelect={handlePdf}>
    Export as PDF
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem icon="trash" color="red" onSelect={handleDelete}>
    Delete
  </DropdownMenuItem>
</DropdownMenuContent>
```

Icons are SF Symbols passed by name (e.g. `"folder.fill"`, `"trash"`, `"square.and.arrow.up"`). The `icon` prop is fully typed with autocomplete for all SF Symbols.

## Component API

### DropdownMenu

Root component; extracts items from `DropdownMenuContent` and manages native menu state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `anchorRef` | `React.RefObject<HTMLElement \| null>` | trigger | Element whose bounds determine menu placement and width |
| `disabled` | `boolean` | `false` | Disable the entire menu |
| `onOpen` | `() => void` | - | Callback when menu opens |
| `onClose` | `() => void` | - | Callback when menu closes |

### DropdownMenuTrigger

Button that opens the menu. Forwards remaining `<button>` attributes.

| Prop      | Type      | Default | Description                            |
| --------- | --------- | ------- | -------------------------------------- |
| `asChild` | `boolean` | `false` | Merge trigger props onto child element |

### DropdownMenuContent

Marker container — renders nothing; its props configure native menu placement.

| Prop          | Type                           | Default    | Description                  |
| ------------- | ------------------------------ | ---------- | ---------------------------- |
| `side`        | `"top" \| "bottom"`            | `"bottom"` | Side relative to the anchor  |
| `align`       | `"start" \| "center" \| "end"` | `"start"`  | Alignment against the anchor |
| `sideOffset`  | `number`                       | `8`        | Distance from the anchor     |
| `alignOffset` | `number`                       | `0`        | Alignment offset             |

### DropdownMenuItem

| Prop          | Type             | Default | Description                                             |
| ------------- | ---------------- | ------- | ------------------------------------------------------- |
| `icon`        | `NativeMenuIcon` | -       | SF Symbol name (e.g. `"folder.fill"`) or image          |
| `sublabel`    | `string`         | -       | Secondary text below the label                          |
| `accelerator` | `string`         | -       | Keyboard shortcut shown right-aligned (e.g. `"⌘C"`)     |
| `disabled`    | `boolean`        | `false` | Disable the item                                        |
| `color`       | `MenuItemColor`  | -       | Label color (also tints icon unless `iconColor` is set) |
| `iconColor`   | `MenuItemColor`  | -       | Icon color only; overrides `color` for the icon         |
| `onSelect`    | `() => void`     | -       | Callback when selected                                  |
| `children`    | `ReactNode`      | -       | Display text (text content only)                        |

### DropdownMenuCheckboxItem

Same props as `DropdownMenuItem` (minus `onSelect`), plus:

| Prop              | Type                         | Default | Description                 |
| ----------------- | ---------------------------- | ------- | --------------------------- |
| `checked`         | `boolean`                    | `false` | Checkbox state              |
| `onCheckedChange` | `(checked: boolean) => void` | -       | Callback when state changes |

### DropdownMenuSub

Submenu container.

| Prop        | Type             | Default | Description                                             |
| ----------- | ---------------- | ------- | ------------------------------------------------------- |
| `label`     | `string`         | -       | **Required.** Menu text                                 |
| `icon`      | `NativeMenuIcon` | -       | SF Symbol name or image                                 |
| `disabled`  | `boolean`        | `false` | Disable the submenu                                     |
| `color`     | `MenuItemColor`  | -       | Label color (also tints icon unless `iconColor` is set) |
| `iconColor` | `MenuItemColor`  | -       | Icon color only; overrides `color` for the icon         |
| `children`  | `ReactNode`      | -       | Submenu items                                           |

### Other parts

- **DropdownMenuSeparator** — visual divider; no props.
- **DropdownMenuLabel** — non-interactive header text; `children` only.
- **DropdownMenuGroup** — groups related items; flattened into the parent menu; `children` only.

`MenuItemColor` accepts a named palette token (`"red"`, `"orange"`, `"yellow"`, `"green"`, `"mint"`, `"teal"`, `"cyan"`, `"blue"`, `"indigo"`, `"purple"`, `"pink"`, `"brown"`, `"gray"`, `"primary"`, `"secondary"`) or any hex string (`"#FF8800"`). Named tokens adapt to light/dark mode and accessibility settings; use hex only for exact brand colors.

## Design System Rules

### ✅ Do

- Use clear, action-oriented labels and include icons for visual scanning.
- Group related items with `DropdownMenuLabel` and separators.
- Use checkbox items for independent toggles.
- Use `anchorRef` for split controls whose menu should align to the complete control.
- Tint destructive actions with `color="red"`.

### ❌ Don't

- Overfill a single menu (cap at ~8-10 items without grouping).
- Nest submenus more than one level deep.
- Put React components inside item `children` — use [`CustomDropdownMenu`](./custom-dropdown-menu.md).
- Use checkbox items for single-select groups — use `CustomDropdownMenu` with a RadioGroup.
- Use a hard-coded `alignOffset` to compensate for a trigger that is narrower than its visual control.
