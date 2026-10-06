# Color Well

A small swatch button that opens the browser's native color picker. Modeled on Apple's `NSColorWell`. Compact enough to sit inside an `InspectorRow` next to a `Switch`, `Input`, or other inline controls. Reach for it whenever a single color value needs editing with a small persistent indicator.

## When to Use

- **Inspector color rows**: text color, fill, stroke, background.
- **Theme editors**: accent, surface, and text tokens.
- For a color _display_ with no editing, omit `onChange` and pass `readOnly` for a non-focusable indicator.
- For picking from a fixed palette, use a `SegmentedControl` or `RadioGroup` with colored swatch children instead — not a `ColorWell`.

## Usage Patterns

### Basic

Clicking anywhere on the swatch opens the native picker. Always pass an `aria-label` — the swatch has no visible text.

```tsx
import { ColorWell } from "@glaze/core/components";

function FillPicker() {
  const [color, setColor] = useState("#FF5A1F");
  return <ColorWell value={color} onChange={setColor} aria-label="Fill color" />;
}
```

### Sizes

`small` / `medium` / `large` match `h-7` / `h-8` / `h-9`, so a well sits flush with `Button`, `Input`, and `NumberInput` in a row. Use `small` inside `InspectorRow`.

```tsx
<ColorWell value="#0A84FF" size="small" onChange={setColor} aria-label="Stroke" />
```

### Read-only and empty state

Pass `readOnly` for a display-only swatch (no picker, not focusable). Omit `value` (or pass `null`) to render just the alpha checkerboard for an empty state.

```tsx
<ColorWell value="#0A84FF" readOnly aria-label="Brand color" />
<ColorWell value={null} onChange={setColor} aria-label="Fill color" />
```

## Component API

### ColorWell

Extends native `<input>` props (except `onChange`, `value`, `type`, `size`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | - | CSS color — hex (`#RRGGBB` / `#RRGGBBAA`) or any CSS color. Omit/`null` for the empty checkerboard state. |
| `onChange` | `(value: string) => void` | - | Fires when the user picks a color. Omit to render a read-only swatch. |
| `readOnly` | `boolean` | `-` | Display-only swatch; no picker, not focusable. |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Swatch dimensions; align with adjacent controls. |
| `aria-label` | `string` | - | Accessible label for the swatch. Recommended. |

## Design System Rules

### ✅ Do

- Label the well with `aria-label` (e.g. "Fill color") — the swatch has no visible text.
- Use hex values (`#RRGGBB` or `#RRGGBBAA`) for consistency; the native picker reads/writes hex.
- Use `size="small"` inside `InspectorRow`.

### ❌ Don't

- Don't use a `ColorWell` for picking from a fixed palette — use a `SegmentedControl` or `RadioGroup` with colored swatch children.
