# ButtonGroup

A container that visually joins related buttons into a single segmented control with shared sizing, spacing, and background. Set `size` and `variant` once on the group — child `Button`s inherit transparent styling and the group's sizing automatically. Reach for it when two or more actions belong together (view toggles, navigation, formatting tools); for a single action use a standalone [Button](./button.md).

## When to Use

- Joining 2+ related actions into one control: view switchers, back/forward, text-formatting toolbars.
- Grouping toolbar chrome so it reads as one unit against a [Toolbar](./toolbar.md) background.
- Use a standalone [Button](./button.md) for an isolated action, and `NavigationButtonGroup` (below) for the common back/forward pair.

## Required Structure

- Child `<Button>` elements inherit `variant="transparent"` and the group's `size` via context — do **not** set `size` on them, and only set `variant` to override the transparent default.
- Wrappers around buttons (`Tooltip`, `DropdownMenuTrigger asChild`) work without extra config since the styling flows through context.
- Use `ButtonGroupSeparator` between buttons to add a vertical divider. It auto-hides when an adjacent enabled button is hovered.

## Usage Patterns

### Basic

```tsx
<ButtonGroup variant="glass">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</ButtonGroup>
```

### Variants

- **glass** — semi-transparent background with backdrop blur and inner padding. Default for toolbar chrome.
- **transparent** — no background, just `gap-1.5` spacing; buttons keep their own sizing.
- **filled** — solid `bg-control-subtle` background.

### Icon buttons with separators

```tsx
<ButtonGroup variant="glass">
  <Button iconOnly>
    <BoldIcon className="size-4" />
  </Button>
  <Button iconOnly>
    <ItalicIcon className="size-4" />
  </Button>
  <ButtonGroupSeparator />
  <Button iconOnly>
    <AlignLeftIcon className="size-4" />
  </Button>
  <Button disabled iconOnly>
    <AlignRightIcon className="size-4" />
  </Button>
</ButtonGroup>
```

### Aligning with a standalone button in a toolbar

Match `size` and `variant` across the group and adjacent standalone buttons so they line up:

```tsx
<div className="flex items-center gap-2">
  <ButtonGroup variant="glass" size="large">
    <Button>Day</Button>
    <ButtonGroupSeparator />
    <Button>Week</Button>
  </ButtonGroup>
  <Button variant="glass" size="large" iconOnly>
    <SettingsIcon className="size-4.5" />
  </Button>
</div>
```

## Sizing

The group height matches a standalone [Button](./button.md) of the same `size`; child buttons are forced smaller to create inner padding.

| `size`             | Group height | Inner button height |
| ------------------ | ------------ | ------------------- |
| `small`            | 28px (h-7)   | 24px                |
| `medium` (default) | 32px (h-8)   | 28px                |
| `large`            | 36px (h-9)   | 28px                |

## Component API

### ButtonGroup

Extends `React.ComponentProps<"div">`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"glass" \| "transparent" \| "filled"` | `"transparent"` | Visual style of the group container |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Group height and inner button sizing |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | `Button` elements and optional `ButtonGroupSeparator` |

### ButtonGroupSeparator

No props. Renders a vertical divider that hides when an adjacent enabled button is hovered.

### NavigationButtonGroup

A pre-composed back/forward pair (chevron buttons with a separator). Defaults to content-area chrome (`size="large"`, `variant="glass"`); pass `size="small"` / `variant="transparent"` for sidebar toolbars.

```tsx
import { NavigationButtonGroup } from "@glaze/core/components";

<NavigationButtonGroup canGoBack={canGoBack} canGoForward={canGoForward} onGoBack={goBack} onGoForward={goForward} />;
```

| Prop           | Type                                   | Default   | Description                     |
| -------------- | -------------------------------------- | --------- | ------------------------------- |
| `canGoBack`    | `boolean`                              | —         | Enables the back button         |
| `canGoForward` | `boolean`                              | —         | Enables the forward button      |
| `onGoBack`     | `() => void`                           | —         | Back button click handler       |
| `onGoForward`  | `() => void`                           | —         | Forward button click handler    |
| `size`         | `"small" \| "medium" \| "large"`       | `"large"` | Passed through to `ButtonGroup` |
| `variant`      | `"glass" \| "transparent" \| "filled"` | `"glass"` | Passed through to `ButtonGroup` |

## Design System Rules

### ✅ Do

- Set `size` and `variant` once on the group; let child buttons inherit.
- Use `variant="glass"` for grouped chrome floating over a toolbar or content area.
- Insert `ButtonGroupSeparator` between logically distinct sub-groups of actions.
- Reach for `NavigationButtonGroup` instead of hand-building back/forward.

### ❌ Don't

- Set `size` on child `<Button>` elements — the group overrides it.
- Override child `variant` unless you genuinely need a non-transparent button.
- Use a ButtonGroup for a single action — use a standalone `Button`.
