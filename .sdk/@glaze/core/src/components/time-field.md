# TimeField

A segmented, typable time input with stepper arrows, modeled on the time field in Apple's Reminders and Calendar. Each segment — hour, minute, and AM/PM — is separately focusable, accepts typed digits, and responds to the arrow keys. Use it for any time-of-day input.

## When to Use

- **Any time-only input**: reminders, alarms, opening hours, meeting start/end times.
- Prefer this over [`NativeDatePicker`](./date-picker.md) with `type="time"`. That renders the native graphical clock face, which cannot be typed into — reach for it only when you specifically want the OS clock affordance.
- For a date, or a date and time together, use [`NativeDatePicker`](./date-picker.md). Pair a `NativeDatePicker` (`type="date"`) with a `TimeField` when you want both to be independently editable.

## Value Format

`value` is always a 24-hour `HH:mm` string (`"09:00"`, `"14:30"`), regardless of how it is displayed. An incomplete time — a segment the user cleared — emits `""`.

Whether an AM/PM segment is shown follows the user's macOS 24-hour-time setting, read from the bridged system locale. Override with `hour12` only when a design calls for a fixed clock.

## Usage Patterns

### Basic

```tsx
import { TimeField } from "@glaze/core/components";

const [time, setTime] = useState("09:00");

<TimeField value={time} onValueChange={setTime} />;
```

### Variants and sizes

```tsx
<TimeField defaultValue="09:00" variant="default" size="small" />
<TimeField defaultValue="09:00" variant="filled" size="medium" />
<TimeField defaultValue="09:00" size="large" steppers={false} />
```

### Labeled row with a coarse minute step

Associate a visible label with `aria-labelledby`, **not** `htmlFor`: the field is a `role="group"` of spinbutton segments, and neither is a labelable element, so `htmlFor` silently associates with nothing.

`minuteStep` controls the arrow-key and stepper increment; typed digits are unaffected, so a user can still enter `09:07`.

```tsx
<Field>
  <Label id="reminder-time-label">Time</Label>
  <TimeField aria-labelledby="reminder-time-label" value={time} onValueChange={setTime} minuteStep={15} />
</Field>
```

### Start and end range

Validate across the pair at the call site — the component bounds each segment, not the relationship between two fields.

```tsx
<div className="flex items-center gap-2">
  <TimeField value={start} onValueChange={setStart} aria-label="Start time" />
  <span className="text-secondary">to</span>
  <TimeField value={end} onValueChange={setEnd} aria-invalid={end < start} aria-label="End time" />
</div>
```

## Keyboard Navigation

| Key                 | Behavior                                                                    |
| ------------------- | --------------------------------------------------------------------------- |
| `0`–`9`             | Types into the focused segment; advances once it can take no more           |
| `↑` / `↓`           | Steps the focused segment (hour wraps across AM/PM, minute by `minuteStep`) |
| `←` / `→`           | Moves between segments                                                      |
| `Backspace` / `Del` | Clears the focused segment                                                  |
| `A` / `P`           | Sets AM / PM when the meridiem segment is focused                           |

## Component API

### TimeField

Extends `div` attributes (minus `size`, `value`, `defaultValue`, `onChange`). Controlled when `value` is passed, otherwise uncontrolled via `defaultValue`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Controlled time as 24-hour `HH:mm` |
| `defaultValue` | `string` | `""` | Initial time (uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Called with the new `HH:mm`, or `""` while a segment is empty |
| `hour12` | `boolean` | system | Force a 12-hour (AM/PM) or 24-hour clock |
| `minuteStep` | `number` | `1` | Minute increment for the arrow keys and steppers |
| `steppers` | `boolean` | `true` | Show the stepper arrows |
| `disabled` | `boolean` | `false` | Disable the field |
| `variant` | `"default" \| "filled"` | `"default"` | Visual style |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Field height and radius |
| `aria-invalid` | `boolean` | - | Surfaces the invalid border/ring |
| `aria-label` | `string` | `"Time"` | Labels the field; set it when there is no visible `Label` |
| `aria-labelledby` | `string` | - | Id of a visible `Label`; use instead of `htmlFor`. Suppresses the `aria-label` default |
| `className` | `string` | - | Additional classes |

## Design System Rules

### ✅ Do

- Keep `value` in the 24-hour `HH:mm` format and let the field handle 12-hour display.
- Handle `""` from `onValueChange` as "no time set" — it means a segment is empty, not that the input is invalid.
- Use `size="small"` inside `InspectorRow` / dense panels, matching `Input` and `NumberInput`.
- Pair with a `Label` via `aria-labelledby`, or pass `aria-label` when there is no visible label.

### ❌ Don't

- Don't label it with `<Label htmlFor>` — the group and its segments are not labelable elements, so the association is silently dropped. Use `aria-labelledby`.
- Don't pass a 12-hour string (`"2:30 PM"`) as `value` — it will not parse and the field renders empty.
- Don't hardcode `hour12` to make the UI look a certain way; the default already follows the user's system setting.
- Don't use `NativeDatePicker` with `type="time"` for new time inputs — its clock face cannot be typed into.
