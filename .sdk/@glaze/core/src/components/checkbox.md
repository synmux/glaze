# Checkbox

A checkbox for selecting zero, one, or many options from a set, or for an optional binary state that is committed later (not applied immediately).

## When to Use

- **Multiple selection**: users can pick any number of options from a list (filters, feature sets, bulk selection).
- **Optional binary state**: an on/off choice that is part of a form and saved on submit.
- Use **RadioGroup** instead for a single choice among several, and **Switch** instead for a setting that takes effect immediately.

## Usage Patterns

### Basic

```tsx
<Checkbox />
```

### With a label

Wrap the checkbox in `Label` (simplest), or associate via `htmlFor`/`id`:

```tsx
<Label>
  <Checkbox />
  I agree to the terms and conditions
</Label>

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to the terms and conditions</Label>
</div>
```

### Controlled, default, and disabled

```tsx
const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked} />
<Checkbox defaultChecked />
<Checkbox disabled />
<Checkbox checked disabled />
```

### Grouped options with helper text

Group related checkboxes under a strong label; add secondary text for an option that needs explanation:

```tsx
<div className="flex flex-col gap-2">
  <Label className="text-strong">Notifications</Label>
  <Label>
    <Checkbox checked={email} onCheckedChange={setEmail} />
    Email
  </Label>
  <div className="flex items-start gap-2">
    <Checkbox checked={analytics} onCheckedChange={setAnalytics} className="mt-0.5" />
    <div className="flex-1">
      <Label className="mb-1 block">Anonymous analytics</Label>
      <Text as="p" variant="small" color="secondary">
        Help us improve by sharing anonymous usage data
      </Text>
    </div>
  </div>
</div>
```

### Select-all (indeterminate)

Express the mixed state with `checked="indeterminate"` — the checkbox shows its checkmark for this state (there is no distinct dash/minus glyph). Do **not** set the DOM `indeterminate` property via a ref.

```tsx
const allChecked = items.every((i) => i.checked);
const someChecked = items.some((i) => i.checked);

let parentState: boolean | "indeterminate" = false;
if (allChecked) parentState = true;
else if (someChecked) parentState = "indeterminate";

<Label className="border-b border-secondary pb-2">
  <Checkbox
    checked={parentState}
    onCheckedChange={(checked) => setItems(items.map((i) => ({ ...i, checked: checked === true })))}
  />
  Select all
</Label>;
```

## Component API

### Checkbox

Wraps Radix `Checkbox.Root` — all Radix Checkbox props are supported.

| Prop              | Type                                            | Default | Description                       |
| ----------------- | ----------------------------------------------- | ------- | --------------------------------- |
| `checked`         | `boolean \| "indeterminate"`                    | -       | Controlled checked state          |
| `defaultChecked`  | `boolean \| "indeterminate"`                    | `false` | Uncontrolled initial state        |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | -       | Called when the state changes     |
| `disabled`        | `boolean`                                       | `false` | Disable the checkbox              |
| `required`        | `boolean`                                       | `false` | Mark required for form validation |
| `name`            | `string`                                        | -       | Form field name                   |
| `value`           | `string`                                        | `"on"`  | Form field value when checked     |
| `className`       | `string`                                        | -       | Additional classes                |

## Design System Rules

### ✅ Do

- Use for multiple selection, or for optional binary states committed on submit.
- Always pair with a label (wrap in `Label` or use `htmlFor`).
- Group related checkboxes under a strong group label.
- Use `checked="indeterminate"` for select-all parents.

### ❌ Don't

- Use for a single choice (use RadioGroup) or for immediate-effect settings (use Switch).
- Leave a checkbox without a label or clear context.
- Disable without explaining why (add helper text).
- Set background-color styling on the box via `className`.
