# Segmented Control

A pill-style selection control modeled on Apple's `NSSegmentedControl`. It shares the chrome and size tokens of `Tabs` and `ButtonGroup` so a toolbar mixing them reads as one family, but semantically it is a form control that holds a `value`. Use it when every choice should be visible and one (or, in multi-select mode, several) is selected.

## When to Use

- **Mutually exclusive toggles**: left / center / right alignment, size presets.
- **Multi-select toggle strips**: B / I / U / S character styles, via `type="multiple"`.
- **Small option sets** (2–4 values) that share a common dimension.
- **Inspector controls** where a dropdown would hide the available options.
- Use `Tabs` instead if selecting a value should switch visible content panels. Use `ButtonGroup` if the items are independent actions with no shared selection.

## Usage Patterns

### Basic

```tsx
import { SegmentedControl, SegmentedControlItem } from "@glaze/core/components";

const [value, setValue] = useState("left");

<SegmentedControl value={value} onValueChange={setValue} aria-label="Alignment">
  <SegmentedControlItem value="left" iconOnly>
    <AlignLeftIcon />
  </SegmentedControlItem>
  <SegmentedControlItem value="center" iconOnly>
    <AlignCenterIcon />
  </SegmentedControlItem>
  <SegmentedControlItem value="right" iconOnly>
    <AlignRightIcon />
  </SegmentedControlItem>
</SegmentedControl>;
```

### Variants and sizes

`variant` is `filled` (default), `glass`, or `transparent`. `size` is `small`, `medium` (default), or `large`. `small` renders a rounded-square track for inspector density; `medium`/`large` keep the classic pill shape.

```tsx
<SegmentedControl variant="glass" size="small" value={value} onValueChange={setValue} aria-label="View">
  <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
  <SegmentedControlItem value="list">List</SegmentedControlItem>
</SegmentedControl>
```

### Multi-select toggle strip

Pass `type="multiple"` for a B/I/U/S-style strip where zero or more items can be active. `value`/`onValueChange` become `string[]`.

```tsx
const [styles, setStyles] = useState<string[]>([]);

<SegmentedControl type="multiple" value={styles} onValueChange={setStyles} aria-label="Text style">
  <SegmentedControlItem value="bold" iconOnly aria-label="Bold">
    <BoldIcon />
  </SegmentedControlItem>
  <SegmentedControlItem value="italic" iconOnly aria-label="Italic">
    <ItalicIcon />
  </SegmentedControlItem>
  <SegmentedControlItem value="underline" iconOnly aria-label="Underline">
    <UnderlineIcon />
  </SegmentedControlItem>
</SegmentedControl>;
```

### With separators

Insert `SegmentedControlSeparator` between items for the classic Apple creative-tool divider look. Each separator auto-hides when adjacent to an active (pressed) or selected item. Omit separators entirely for the simpler chip-row look — the root falls back to a small gap between items.

```tsx
<SegmentedControl value={align} onValueChange={setAlign} aria-label="Alignment">
  <SegmentedControlItem value="left" iconOnly>
    <AlignLeftIcon />
  </SegmentedControlItem>
  <SegmentedControlSeparator />
  <SegmentedControlItem value="center" iconOnly>
    <AlignCenterIcon />
  </SegmentedControlItem>
  <SegmentedControlSeparator />
  <SegmentedControlItem value="right" iconOnly>
    <AlignRightIcon />
  </SegmentedControlItem>
</SegmentedControl>
```

## Component API

### SegmentedControl

Wraps Radix `ToggleGroup.Root`; all of its props pass through. `value`/`defaultValue`/`onValueChange` are typed `string` when `type="single"` (default) and `string[]` when `type="multiple"`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Single-select (radio-like) or multi-select toggle strip |
| `allowEmpty` | `boolean` | `false` | In single-select mode, pressing the selected item again clears the value |
| `value` | `string \| string[]` | - | Controlled value (`string[]` when `type="multiple"`) |
| `defaultValue` | `string \| string[]` | - | Uncontrolled initial value |
| `onValueChange` | `((value: string) => void) \| ((value: string[]) => void)` | - | Called when the selection changes (`string[]` when `type="multiple"`) |
| `variant` | `"filled" \| "glass" \| "transparent"` | `"filled"` | Track chrome; matches `Tabs` / `ButtonGroup` tokens |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Control height and item radius |
| `disabled` | `boolean` | `false` | Disable the whole control |
| `className` | `string` | - | Additional classes |

### SegmentedControlItem

Wraps Radix `ToggleGroup.Item`; all of its props pass through. Children render the item content — icon, text, or both.

| Prop        | Type      | Default | Description                                                          |
| ----------- | --------- | ------- | -------------------------------------------------------------------- |
| `value`     | `string`  | -       | Required item value                                                  |
| `iconOnly`  | `boolean` | `false` | Square the item to track-matched proportions for a single icon child |
| `disabled`  | `boolean` | `false` | Disable this item                                                    |
| `className` | `string`  | -       | Additional classes                                                   |

### SegmentedControlSeparator

Thin vertical divider rendered between adjacent items. Takes no props. Auto-hides when adjacent to an active (pressed) or selected item.

## Design System Rules

### ✅ Do

- Use for small sets (2–4) of mutually exclusive options where every choice should stay visible.
- Set `iconOnly` on items whose only child is an icon, so the active fill reads as a balanced square.
- Provide an `aria-label` on the control, and on icon-only items.
- Reach for `type="multiple"` for character-style or filter toggle strips.

### ❌ Don't

- Use it to switch content panels (use `Tabs`) or for independent actions (use `ButtonGroup`).
- Crowd it with more than ~4 options — prefer a dropdown.
- Override the per-icon size unless you genuinely need to (use Tailwind's `!size-X` on the icon).
