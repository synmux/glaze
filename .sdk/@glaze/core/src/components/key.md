# Key

A keyboard key cap (`<kbd>`) for displaying a single key or symbol in UI — shortcut hints, command lists, help text. Use `KeyGroup` to render a multi-key combination as a tight cluster.

## When to Use

- **Shortcut hints**: show the key(s) that trigger an action (next to a menu item, button, or in a tooltip).
- **Documentation / help**: render keys inline within instructional text.
- Use a single `Key` for one key; wrap multiple `Key`s in `KeyGroup` for a combination like `⌘ S`.
- Keys are display-only (`pointer-events-none`) — they are not interactive controls. For a clickable action, use a `Button`.

## Usage Patterns

### Basic

```tsx
<Key>S</Key>
<Key>Esc</Key>
<Key>⌘</Key>
```

The `↵` (return) glyph is nudged up one pixel automatically for optical alignment.

### Variants

```tsx
<Key variant="outline">S</Key>
<Key variant="filled">S</Key>
```

`outline` (default) is a bordered, tertiary-text cap that adapts to a focused parent (`group-focus`). `filled` is a solid `bg-control` cap with primary text — use it on darker or busier surfaces where the outline reads as low contrast.

### Key combinations

Wrap keys in `KeyGroup` to cluster them with consistent spacing:

```tsx
<KeyGroup>
  <Key>⇧</Key>
  <Key>⌘</Key>
  <Key>A</Key>
</KeyGroup>
```

### Shortcut hint beside an action

```tsx
<div className="flex items-center justify-between">
  <Text>Save</Text>
  <KeyGroup>
    <Key>⌘</Key>
    <Key>S</Key>
  </KeyGroup>
</div>
```

## Component API

### Key

Renders a `<kbd>`. Accepts all native `<kbd>` props plus `variant`.

| Prop        | Type                    | Default     | Description                 |
| ----------- | ----------------------- | ----------- | --------------------------- |
| `variant`   | `"outline" \| "filled"` | `"outline"` | Visual style of the key cap |
| `children`  | `React.ReactNode`       | -           | The key label or symbol     |
| `className` | `string`                | -           | Additional classes          |

### KeyGroup

Renders a `<kbd>` wrapper that lays out child `Key`s in a horizontal row (`inline-flex items-center gap-0.5`). Accepts all native `<kbd>` props.

| Prop        | Type              | Default | Description                |
| ----------- | ----------------- | ------- | -------------------------- |
| `children`  | `React.ReactNode` | -       | One or more `Key` elements |
| `className` | `string`          | -       | Additional classes         |

## Design System Rules

### ✅ Do

- Use `Key` for single keys and `KeyGroup` to cluster a combination.
- Keep `variant` consistent within a single combination (all `outline` or all `filled`).
- Use the native glyphs (`⌘`, `⇧`, `⌥`, `⌃`, `↵`, `Esc`) for modifiers and special keys.

### ❌ Don't

- Use `Key` as a clickable control — it is display-only; use `Button` to trigger an action.
- Mix `outline` and `filled` keys within the same `KeyGroup`.
- Override the cap background/border via `className` to fake a new variant.
