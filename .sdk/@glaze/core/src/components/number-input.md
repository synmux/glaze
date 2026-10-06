# Number Input

Compact numeric input with an optional unit suffix and stepper arrows, built on a real `<input type="number">`. Modeled on Apple's `NSStepper` + `NSTextField` combo seen throughout Xcode and Pages inspectors (e.g. `11 pt` with tiny up/down chevrons).

## When to Use

- **Numeric inspector rows**: font size, margins, padding, line height.
- **Dimension inputs** where a unit like `pt`, `px`, `%`, or `°` disambiguates the value.
- **Small incremental controls** where stepping by 1 is the common case.
- For free-form numeric entry without a unit or stepper (a monetary amount, a phone number, a zip code), use `Input` instead.

## Usage Patterns

### Basic

Controlled value; `null` represents the empty state.

```tsx
import { NumberInput } from "@glaze/core/components";

const [size, setSize] = useState<number | null>(11);

<NumberInput value={size} onValueChange={setSize} unit="pt" min={6} max={200} />;
```

### Variants & Sizes

```tsx
<NumberInput variant="default" />
<NumberInput variant="filled" />

<NumberInput size="small" />
<NumberInput size="medium" />
<NumberInput size="large" />
```

### Inspector row

Use `size="small"` inside an `InspectorRow` for Pages-style density:

```tsx
<InspectorRow label="Line height">
  <NumberInput size="small" value={lineHeight} onValueChange={setLineHeight} unit="pt" min={1} step={0.5} />
</InspectorRow>
```

### Without steppers

Hide the chevrons for keyboard/scroll-only entry:

```tsx
<NumberInput steppers={false} value={count} onValueChange={setCount} />
```

## Component API

### NumberInput

Extends `<input>` props (except `size`, `value`, `onChange`, `type`). Browser number semantics — keyboard arrows, scroll wheel, min/max clamping — still apply; the stepper buttons are sugar on top.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| null` | - | Controlled value. `null` = empty. Omit for uncontrolled mode. |
| `onValueChange` | `(value: number \| null) => void` | - | Fires on every change; `null` when cleared. |
| `unit` | `ReactNode` | - | Suffix rendered inside the input, right of the value (e.g. `"pt"`). |
| `steppers` | `boolean` | `true` | Show the stepper arrows. |
| `variant` | `"default" \| "filled"` | `"default"` | Bordered vs. subtle-filled chrome. |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Control height (`h-7` / `h-8` / `h-9`). |
| `min` | `number` | - | Lower bound; clamps stepper and native input. |
| `max` | `number` | - | Upper bound; clamps stepper and native input. |
| `step` | `number` | `1` | Increment used by the stepper buttons and native arrows. |
| `disabled` | `boolean` | `false` | Disable the input and steppers. |

## Design System Rules

### ✅ Do

- Pass a `unit` when the number has a well-known unit — faster to read than a separate label.
- Provide `min` / `max` when the range is known.
- Use `size="small"` inside `InspectorRow` for native inspector density; `medium` in standalone forms.

### ❌ Don't

- Use `NumberInput` for free-form text with digits (phone numbers, zip codes). Use `Input`.
- Mix `unit` with a trailing icon — the suffix should be the unit, not an affordance.
