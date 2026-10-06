# Slider

A slider for selecting a numeric value (or range) within bounds by dragging, built on Radix. Use it when the relative position matters more than an exact number — volume, brightness, opacity, price ranges. For precise numeric entry where the exact value matters, use an Input instead.

## When to Use

- Adjusting a value within a known range where visual position is the point (volume, brightness, opacity).
- Selecting a range with two thumbs (price filters, min/max bounds).
- Photo/audio-style adjustments centered on a neutral point (use `variant="filled"` with `origin`).
- Use **Input** instead when the user needs to type or read an exact number.

## Variants

- `default` — slim 6px track with a visible white thumb. The form / inspector slider.
- `filled` — iOS volume-style pill: a tall pill track matching `Input variant="filled"` height and radius. Drag anywhere on the track; the thumb is a small pill that appears on hover/focus. Supports `size`, `startContent`/`endContent`, `origin`, and `ticks`.

## Usage Patterns

```tsx
import { Slider, Text } from "@glaze/core/components";
```

### Basic

```tsx
<Slider defaultValue={[50]} min={0} max={100} step={1} />
```

### Controlled

```tsx
const [value, setValue] = useState([70]);

<Slider value={value} onValueChange={setValue} min={0} max={100} />;
```

### Range (two thumbs)

Pass two values — the component renders one thumb per value:

```tsx
<Slider defaultValue={[25, 75]} min={0} max={100} />
```

### Vertical

Vertical sliders need a height on the container:

```tsx
<div className="flex items-end gap-4 h-48">
  <Slider defaultValue={[60]} orientation="vertical" />
  <Slider defaultValue={[80]} orientation="vertical" />
</div>
```

### Filled with live value

`startContent`/`endContent` render inside the track. Pass a `(value) => node` function to format the live value (single-thumb only):

```tsx
<Slider
  variant="filled"
  size="medium"
  defaultValue={[80]}
  min={0}
  max={100}
  startContent={<VolumeIcon className="size-4" />}
  endContent={(v) => `${v}%`}
/>
```

### Filled, origin-anchored with ticks

For symmetric adjustments (e.g. -100…100), `origin` makes the fill grow from a center point in either direction; `ticks` renders evenly-spaced marks that appear on hover/focus:

```tsx
<Slider variant="filled" defaultValue={[0]} min={-100} max={100} origin={0} ticks />
```

### Range filter with labels

```tsx
const [priceRange, setPriceRange] = useState([0, 500]);

<div className="space-y-2">
  <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={10} />
  <div className="flex justify-between text-regular text-secondary">
    <span>${priceRange[0]}</span>
    <span>${priceRange[1]}</span>
  </div>
</div>;
```

### Disabled

```tsx
<Slider defaultValue={[50]} disabled />
```

## Component API

Extends Radix `Slider.Root` (minus `size`) — `min` (default `0`), `max` (default `100`), `step` (default `1`), `orientation`, `disabled`, `name`, etc. are all supported.

### Slider

| Prop            | Type                         | Default        | Description                                 |
| --------------- | ---------------------------- | -------------- | ------------------------------------------- |
| `value`         | `number[]`                   | -              | Controlled value(s); one thumb per element. |
| `defaultValue`  | `number[]`                   | -              | Uncontrolled initial value(s).              |
| `onValueChange` | `(value: number[]) => void`  | -              | Called as the value changes.                |
| `variant`       | `"default" \| "filled"`      | `"default"`    | Track style.                                |
| `orientation`   | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction.                           |
| `disabled`      | `boolean`                    | `false`        | Disable the slider.                         |
| `className`     | `string`                     | -              | Additional classes.                         |

### `filled`-only props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Track height; matches `Input` / `Select` `size`. |
| `startContent` | `ReactNode \| ((value: number) => ReactNode)` | - | Content at the leading edge of the track. Function form formats the live value (single-thumb only). |
| `endContent` | `ReactNode \| ((value: number) => ReactNode)` | - | Trailing-edge counterpart, typically the current value. |
| `origin` | `number` | - | Anchor the fill at this value so it grows in either direction (single-thumb only). Photos / Lightroom style. |
| `ticks` | `boolean \| number` | - | Render evenly-spaced tick marks (horizontal only). `true` for an auto count, or a number to set it. |

## Design System Rules

### ✅ Do

- Set meaningful `min`/`max` for the context and use `step` to constrain to sensible increments.
- Pair the slider with an icon or value label so users know what it controls and its current value.
- Use `variant="filled"` with a matching `size` when placing a slider alongside `Input`/`Select` controls.
- Use `origin` for adjustments centered on a neutral point (brightness, exposure, balance).
- Give vertical sliders enough container height.

### ❌ Don't

- Use a slider for precise numeric input where the exact value matters — use Input.
- Omit `min`/`max` bounds.
- Use `startContent`/`endContent`/`origin` formatting functions with a range (two-thumb) slider — they apply to single-thumb only.
