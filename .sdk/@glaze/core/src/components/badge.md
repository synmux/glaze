# Badge

A small, non-interactive label for statuses, counts, tags, and categories. Renders as an inline-flex pill; the `color` prop carries the meaning as a same-hue background tint with matching text, using the design system's support-color tokens so badges stay legible in both light and dark appearance.

## When to Use

- **Status**: surface a record's state next to its title (`Active`, `Draft`, `Archived`)
- **Counts**: a compact count or quantity (`3 new`, `12`)
- **Tags / categories**: label an item with a topic, plan tier, or type
- **Emphasis**: call out something new or noteworthy (`New`, `Beta`)

For a status indicator with a leading colored dot (loading / success / error), use `Status` instead — it is purpose-built for live state. Badge is for static labels.

## Usage Patterns

### Basic

```tsx
<Badge>Draft</Badge>
```

The default is a soft neutral `secondary` badge.

### Colors

Set `color` to convey meaning. The two neutrals are `primary` (high-contrast solid — dark fill with light text in light mode, inverted in dark) and `secondary` (soft, default); the support colors apply a same-hue background tint with matching text. Available: `primary`, `secondary` (default), `blue`, `green`, `yellow`, `orange`, `red`, `purple`, `magenta`.

```tsx
<Badge color="green">Active</Badge>
<Badge color="yellow">Pending</Badge>
<Badge color="red">Failed</Badge>
```

Map state to color from a lookup rather than branching inline:

```tsx
const STATUS_COLOR = {
  active: "green",
  pending: "yellow",
  failed: "red",
  archived: "secondary",
} as const;

<Badge color={STATUS_COLOR[record.status]}>{record.status}</Badge>;
```

### Sizes

`size` is `small` (default) or `medium`.

```tsx
<Badge size="small">Small</Badge>
<Badge size="medium">Medium</Badge>
```

### With an icon

Pass a leading icon as a child; it is sized automatically to match the badge size.

```tsx
import { CheckIcon } from "lucide-react";

<Badge color="green">
  <CheckIcon />
  Verified
</Badge>;
```

### As a link

Use `asChild` to render a different element (e.g. an anchor) while keeping the badge styling. The child owns its own focus/hover state.

```tsx
<Badge asChild color="blue">
  <a href="/changelog">What's new</a>
</Badge>
```

## Component API

### Badge

Extends `React.ComponentProps<"span">`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `"primary" \| "secondary" \| "blue" \| "green" \| "yellow" \| "orange" \| "red" \| "purple" \| "magenta"` | `"secondary"` | Color treatment (`primary` = high-contrast neutral, `secondary` = soft neutral, support colors = same-hue tint) |
| `size` | `"small" \| "medium"` | `"small"` | Badge size; the leading icon scales with it |
| `asChild` | `boolean` | `false` | Render the single child element instead of a `<span>` |
| `className` | `string` | - | Additional CSS classes |

## Design System Rules

### ✅ Do

- Use `color` to carry meaning (green = success, red = error/destructive, yellow = warning/pending)
- Keep the label short — one or two words, or a count
- Pair a leading icon with the label when it adds clarity, sized via the `size` prop

### ❌ Don't

- Don't put interactive controls inside a Badge — it is a label, not a button. To make the whole badge a link, use `asChild`
- Don't use a Badge as a live status dot — use `Status` for loading/success/error indicators
- Don't override the token colors with arbitrary hex backgrounds; pick the closest support `color`
- Don't stack long sentences in a badge; it is meant to stay compact on one line
