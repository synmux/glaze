# Switch

A toggle for a binary on/off setting that takes effect immediately, with no Save step. The thumb animates and supports drag-to-toggle with haptic feedback.

## When to Use

- **Immediate-effect settings**: enable/disable a feature, permission, or preference that applies the moment it's toggled.
- **Visibility/mode toggles**: show/hide content or flip a single two-state option.
- Use **Checkbox** instead for an optional binary state committed on form submit, and **RadioGroup** for a single choice among several options.

## Usage Patterns

### Basic

```tsx
<Switch />
<Switch defaultChecked />
<Switch disabled />
<Switch checked disabled />
```

### Controlled

```tsx
const [enabled, setEnabled] = useState(false);

<Switch checked={enabled} onCheckedChange={setEnabled} />;
```

### Labeled settings row

Place the switch on the right and associate the label via `htmlFor`/`id` so the label is clickable:

```tsx
<div className="flex items-center justify-between py-2">
  <label htmlFor="auto-save" className="text-regular">
    Auto-save drafts
  </label>
  <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
</div>
```

### Row with helper text

Add secondary text for a setting that needs explanation; use the same pattern for a disabled setting that isn't yet available:

```tsx
<div className="flex items-start justify-between gap-4">
  <div className="flex-1">
    <Text as="div" variant="strong">
      Anonymous analytics
    </Text>
    <Text as="p" variant="small" color="secondary">
      Help us improve by sharing anonymous usage data
    </Text>
  </div>
  <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
</div>
```

## Component API

### Switch

Wraps Radix `Switch.Root` — all Radix Switch props are supported.

| Prop              | Type                         | Default | Description                       |
| ----------------- | ---------------------------- | ------- | --------------------------------- |
| `checked`         | `boolean`                    | -       | Controlled checked state          |
| `defaultChecked`  | `boolean`                    | `false` | Uncontrolled initial state        |
| `onCheckedChange` | `(checked: boolean) => void` | -       | Called when the state changes     |
| `disabled`        | `boolean`                    | -       | Disable the switch                |
| `required`        | `boolean`                    | -       | Mark required for form validation |
| `name`            | `string`                     | -       | Form field name                   |
| `value`           | `string`                     | `"on"`  | Form field value when checked     |
| `className`       | `string`                     | -       | Additional classes                |

## Design System Rules

### ✅ Do

- Use for binary on/off settings that apply immediately, with no confirmation step.
- Always pair with a label and associate it via `htmlFor`/`id`.
- Right-align switches in settings lists and rows.
- Add helper text when disabling a switch so the reason is clear.

### ❌ Don't

- Use for actions that require confirmation, or for more than two states (use RadioGroup or Select).
- Require a separate Save button — the toggle should take effect on change.
- Leave a switch without a label or clear context.
