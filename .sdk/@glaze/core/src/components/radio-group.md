# Radio Group

A radio group for choosing exactly one option from a small set of mutually exclusive choices. Each option is a `RadioGroupItem` wrapped in a `Label`.

## When to Use

- **Single choice** among several visible options (theme, display mode, notification frequency).
- When all options should stay visible for easy comparison.
- Use **Checkbox** instead for multiple selection, **Switch** for an immediate-effect on/off setting, and a **Select** dropdown when there are more than 5-7 options.

## Usage Patterns

### Basic

Wrap each `RadioGroupItem` in a `Label` so clicking the text selects the option:

```tsx
<RadioGroup defaultValue="option1">
  <Label>
    <RadioGroupItem value="option1" />
    Option 1
  </Label>
  <Label>
    <RadioGroupItem value="option2" />
    Option 2
  </Label>
</RadioGroup>
```

### Controlled, default, and disabled

```tsx
const [value, setValue] = useState("option1");

<RadioGroup value={value} onValueChange={setValue}>
  <Label>
    <RadioGroupItem value="option1" />
    Option 1
  </Label>
  <Label>
    <RadioGroupItem value="option2" disabled />
    Option 2 (unavailable)
  </Label>
</RadioGroup>;
```

### Horizontal layout

`orientation="horizontal"` lays the items out in a row instead of a grid:

```tsx
<RadioGroup defaultValue="option1" orientation="horizontal">
  <Label>
    <RadioGroupItem value="option1" />
    Option 1
  </Label>
  <Label>
    <RadioGroupItem value="option2" />
    Option 2
  </Label>
</RadioGroup>
```

### Labeled setting with helper text

Give the group a strong label, and add secondary `Text` for an option that needs explanation. A disabled option should explain why:

```tsx
<div className="flex flex-col gap-2">
  <div>
    <Label className="text-strong mb-1 block">Export format</Label>
    <Text as="p" variant="small" color="secondary">
      PDF export requires a Pro subscription
    </Text>
  </div>
  <RadioGroup defaultValue="json">
    <Label>
      <RadioGroupItem value="json" />
      JSON
    </Label>
    <Label>
      <RadioGroupItem value="csv" />
      CSV
    </Label>
    <Label>
      <RadioGroupItem value="pdf" disabled />
      PDF (Pro only)
    </Label>
  </RadioGroup>
</div>
```

## Component API

### RadioGroup

Wraps Radix `RadioGroup.Root` — all Radix props are supported.

| Prop            | Type                         | Default      | Description                       |
| --------------- | ---------------------------- | ------------ | --------------------------------- |
| `value`         | `string`                     | -            | Controlled selected value         |
| `defaultValue`  | `string`                     | -            | Uncontrolled initial value        |
| `onValueChange` | `(value: string) => void`    | -            | Called when the selection changes |
| `orientation`   | `"horizontal" \| "vertical"` | `"vertical"` | Row (flex) vs grid layout         |
| `disabled`      | `boolean`                    | `false`      | Disable all items                 |
| `required`      | `boolean`                    | `false`      | Mark required for form validation |
| `name`          | `string`                     | -            | Form field name                   |
| `className`     | `string`                     | -            | Additional classes                |

### RadioGroupItem

Wraps Radix `RadioGroup.Item`.

| Prop        | Type      | Default | Description                  |
| ----------- | --------- | ------- | ---------------------------- |
| `value`     | `string`  | -       | Unique value for this option |
| `disabled`  | `boolean` | `false` | Disable this item            |
| `className` | `string`  | -       | Additional classes           |

## Design System Rules

### ✅ Do

- Use for mutually exclusive single selections, with clear descriptive labels.
- Wrap each item in a `Label` so the text is clickable and announced.
- Add a strong group label when the purpose isn't obvious from context.
- Apply the change immediately on `onValueChange` — no separate Save button.

### ❌ Don't

- Use for binary toggles (use Switch) or multiple selection (use Checkbox).
- Use more than 5-7 options (use a Select dropdown instead).
- Leave items without labels, or disable an option without explaining why.
- Set background-color styling on the item via `className`.
