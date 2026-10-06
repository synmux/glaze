# Toggle Button

A single button that holds a pressed / unpressed state — the missing primitive between `Button` (no state) and `SegmentedControl` (group with a value). Use it for isolated on/off toggles: flip, lock/unlock, show/hide, mute/unmute, link-proportions. Wraps Radix `Toggle.Root`, so it ships `aria-pressed`, Space/Enter handling, and both controlled and uncontrolled modes.

## When to Use

- **One toggleable action** on its own (flip horizontal, lock aspect ratio).
- **Inline next to other filled controls** in an inspector — the unpressed `filled` variant's `bg-control-subtle` matches `Input` / `NumberInput` / `Select` / `SegmentedControl` `variant="filled"`, so the whole row reads as one family.
- For mutually exclusive options from a small set use `SegmentedControl` (single); for zero-or-more toggles from a set (B/I/U/S) use `SegmentedControl type="multiple"`. Reach for `ToggleButton` only when the question is "is this one thing on or off?"

## Usage Patterns

### Basic

Controlled via `pressed` + `onPressedChange`, or uncontrolled via `defaultPressed`:

```tsx
const [muted, setMuted] = useState(false);

<ToggleButton pressed={muted} onPressedChange={setMuted}>
  Mute
</ToggleButton>
<ToggleButton defaultPressed>Pinned</ToggleButton>
```

### Variants and sizes

```tsx
<ToggleButton variant="filled">Filled</ToggleButton>
<ToggleButton variant="glass">Glass</ToggleButton>
<ToggleButton variant="transparent">Transparent</ToggleButton>

<ToggleButton size="small">Small</ToggleButton>
<ToggleButton size="medium">Medium</ToggleButton>
<ToggleButton size="large">Large</ToggleButton>
```

When pressed, every variant switches to `bg-accent` + `text-accent-contrast` — the same accent treatment as a selected `SegmentedControlItem`.

### Icon-only inspector toggle

`iconOnly` gives square chrome; `radius="rounded"` matches the rounded-square inspector family (Input/Select). Always pass `aria-label` when there's no text.

```tsx
import { ToggleButton } from "@glaze/core/components";
import { FlipHorizontal2Icon } from "lucide-react";

const [flipped, setFlipped] = useState(false);

<ToggleButton
  variant="filled"
  size="small"
  radius="rounded"
  iconOnly
  pressed={flipped}
  onPressedChange={setFlipped}
  aria-label="Flip horizontal"
>
  <FlipHorizontal2Icon />
</ToggleButton>;
```

## Component API

### ToggleButton

Extends Radix `Toggle.Root` props (minus `size`), plus the variant tokens below.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | - | Controlled pressed state |
| `defaultPressed` | `boolean` | - | Uncontrolled initial state |
| `onPressedChange` | `(pressed: boolean) => void` | - | Called when the pressed state changes |
| `variant` | `"filled" \| "glass" \| "transparent"` | `"filled"` | Visual style when unpressed |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Control height and icon size |
| `iconOnly` | `boolean` | `false` | Square chrome for icon-only buttons |
| `radius` | `"full" \| "rounded"` | `"full"` | Pill (`full`) or inspector-family rounded square |
| `disabled` | `boolean` | `false` | Disable the button |
| `className` | `string` | - | Additional classes |

## Design System Rules

### ✅ Do

- Use for a single isolated on/off action that needs pressed state.
- Use `variant="filled"` with `radius="rounded"` to sit flush in inspector rows alongside `Input` / `Select` / `SegmentedControl`.
- Pass `aria-label` on `iconOnly` toggles.

### ❌ Don't

- Use for mutually exclusive choices (use `SegmentedControl`) or for stateless actions (use `Button`).
- Override `bg-accent` on the pressed state — it intentionally matches selected segmented items.
- Use `iconOnly` without an `aria-label`.
