# NativeDatePicker

A native macOS date/time picker that opens an `NSDatePicker` inside an `NSPopover` anchored to a trigger button. Use it whenever a user needs to pick a date, a time, or both with the system calendar/clock UI rather than a custom in-app calendar. It is composed from a `Root`, a `Trigger`, and a `Value` part.

## When to Use

- **Date or date+time selection** with the native macOS calendar affordance.
- Anywhere you want OS-consistent picking, locale-aware formatting, and optional min/max bounds.
- **For time-only input, use [`TimeField`](./time-field.md) instead.** `type="time"` here renders the native graphical clock face, which the user cannot type into — it remains supported for existing apps, but is the wrong default for a new time input.
- For a fully custom in-app calendar (inline grid, range selection, custom styling), build a dedicated component instead — this one renders the native popover and cannot be restyled internally.

## Usage Patterns

### Basic

```tsx
import { NativeDatePickerRoot, NativeDatePickerTrigger, NativeDatePickerValue } from "@glaze/core/components";

const [date, setDate] = useState("");

<NativeDatePickerRoot value={date} onValueChange={setDate}>
  <NativeDatePickerTrigger>
    <CalendarIcon className="size-4 text-tertiary" />
    <NativeDatePickerValue placeholder="Pick a date" />
  </NativeDatePickerTrigger>
</NativeDatePickerRoot>;
```

### Types

Set `type` on the `Root`. Each type changes both the native UI and the value format (see Value Formats).

```tsx
<NativeDatePickerRoot value={time} onValueChange={setTime} type="time">...</NativeDatePickerRoot>
<NativeDatePickerRoot value={dateTime} onValueChange={setDateTime} type="dateAndTime">...</NativeDatePickerRoot>
```

### Trigger variants and sizes

```tsx
<NativeDatePickerTrigger variant="default" size="small">...</NativeDatePickerTrigger>
<NativeDatePickerTrigger variant="transparent" size="medium">...</NativeDatePickerTrigger>
<NativeDatePickerTrigger variant="glass" size="large">...</NativeDatePickerTrigger>
```

### Bounded date+time field with custom trigger

Combine `min`/`max` constraints with `asChild` to render any element (e.g. a `Button`) as the trigger:

```tsx
<NativeDatePickerRoot
  value={dateTime}
  onValueChange={setDateTime}
  type="dateAndTime"
  min="2024-01-01T00:00:00"
  max="2025-12-31T23:59:59"
>
  <NativeDatePickerTrigger asChild>
    <Button variant="accent">
      <CalendarIcon className="size-4" />
      <NativeDatePickerValue placeholder="Pick date & time" />
    </Button>
  </NativeDatePickerTrigger>
</NativeDatePickerRoot>
```

### Disabled and custom formatting

`disabled` blocks opening the popover. `format` on `Value` overrides the default locale-aware display:

```tsx
<NativeDatePickerRoot value="2024-07-18" disabled>
  <NativeDatePickerTrigger>
    <NativeDatePickerValue format={(v) => v} />
  </NativeDatePickerTrigger>
</NativeDatePickerRoot>
```

## Value Formats

The string value is parsed and emitted in these formats per `type`:

| Type          | Format                  | Example                 |
| ------------- | ----------------------- | ----------------------- |
| `date`        | `yyyy-MM-dd`            | `"2024-07-18"`          |
| `time`        | `HH:mm`                 | `"14:30"`               |
| `dateAndTime` | `yyyy-MM-dd'T'HH:mm:ss` | `"2024-07-18T14:30:00"` |

## Component API

### NativeDatePickerRoot

Manages value state and opens the native popover. Controlled when `value` is passed, otherwise uncontrolled via `defaultValue`.

| Prop            | Type                                | Default  | Description                  |
| --------------- | ----------------------------------- | -------- | ---------------------------- |
| `value`         | `string`                            | -        | Controlled value             |
| `defaultValue`  | `string`                            | `""`     | Initial value (uncontrolled) |
| `onValueChange` | `(value: string) => void`           | -        | Called when value changes    |
| `type`          | `"date" \| "time" \| "dateAndTime"` | `"date"` | Picker mode                  |
| `disabled`      | `boolean`                           | `false`  | Disable the picker           |
| `min`           | `string`                            | -        | Minimum selectable value     |
| `max`           | `string`                            | -        | Maximum selectable value     |
| `children`      | `React.ReactNode`                   | -        | Trigger/value composition    |

### NativeDatePickerTrigger

Button that opens the picker. Extends `button` attributes (minus `size`).

| Prop        | Type                                    | Default     | Description                     |
| ----------- | --------------------------------------- | ----------- | ------------------------------- |
| `variant`   | `"default" \| "transparent" \| "glass"` | `"default"` | Visual style                    |
| `size`      | `"small" \| "medium" \| "large"`        | `"medium"`  | Trigger height/padding          |
| `asChild`   | `boolean`                               | `false`     | Render child element as trigger |
| `className` | `string`                                | -           | Additional classes              |

### NativeDatePickerValue

Displays the formatted value, or the placeholder when empty. Extends `span` attributes.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | - | Text shown when no value selected |
| `format` | `(value: string, type: NativeDatePickerType) => string` | - | Override default display format |
| `className` | `string` | - | Additional classes |

## Design System Rules

### ✅ Do

- Compose `Root` > `Trigger` > `Value`; put an icon and the `Value` inside the trigger.
- Use `min`/`max` to bound selectable values, matching the value format for the chosen `type`.
- Use `asChild` to reuse an existing button style as the trigger.

### ❌ Don't

- Reach for `type="time"` on a new time-only input — use [`TimeField`](./time-field.md), which is typable.
- Try to restyle the calendar/clock itself — it is the native `NSDatePicker` and is not customizable from React.
- Set a `value` whose format does not match `type` (it will fail to parse).
