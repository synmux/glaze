# CustomSelect

A composable dropdown select built on Radix. Choose one value from a list, with keyboard navigation, checkmark indicators, grouping, and trigger styling. Use it only when items need rich React content (icons, colored status dots, multi-line layouts) or custom styling — for plain text selects, prefer `Select`, which renders native macOS menus.

## When to Use

- Choosing one option from a list when items need custom React children — colored status dots, badges, multi-line layouts.
- Prefer `Select` (native menu) for simple text-only options with optional SF Symbol icons.
- Prefer **RadioGroup** for a small set (under ~4) of single-choice options, and **Switch** for an immediate-effect binary toggle.

## Usage Patterns

All parts import from `@glaze/core/components`:

```tsx
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectGroup,
  CustomSelectItem,
  CustomSelectLabel,
  CustomSelectSeparator,
  CustomSelectTrigger,
  CustomSelectValue,
} from "@glaze/core/components";
```

### Basic

```tsx
<CustomSelect defaultValue="banana">
  <CustomSelectTrigger>
    <CustomSelectValue placeholder="Select a fruit" />
  </CustomSelectTrigger>
  <CustomSelectContent>
    <CustomSelectItem value="apple">Apple</CustomSelectItem>
    <CustomSelectItem value="banana">Banana</CustomSelectItem>
    <CustomSelectItem value="orange" disabled>
      Orange (out of stock)
    </CustomSelectItem>
  </CustomSelectContent>
</CustomSelect>
```

Use `defaultValue` for uncontrolled, or `value` + `onValueChange` for controlled state. Set `disabled` on the root to disable the whole select, or on an item to disable that option.

### Trigger variants and sizes

`variant`: `default` (bordered), `transparent` (no background, inline — renders a pill chevron, good for settings rows), `glass`. `size`: `small`, `medium`, `large`.

```tsx
<CustomSelectTrigger variant="transparent" size="small">
  <CustomSelectValue placeholder="Inline" />
</CustomSelectTrigger>
```

### Grouped options

```tsx
<CustomSelect>
  <CustomSelectTrigger>
    <CustomSelectValue placeholder="Select a timezone" />
  </CustomSelectTrigger>
  <CustomSelectContent>
    <CustomSelectGroup>
      <CustomSelectLabel>North America</CustomSelectLabel>
      <CustomSelectItem value="est">Eastern Standard Time</CustomSelectItem>
      <CustomSelectItem value="pst">Pacific Standard Time</CustomSelectItem>
    </CustomSelectGroup>
    <CustomSelectSeparator />
    <CustomSelectGroup>
      <CustomSelectLabel>Europe</CustomSelectLabel>
      <CustomSelectItem value="gmt">Greenwich Mean Time</CustomSelectItem>
      <CustomSelectItem value="cet">Central European Time</CustomSelectItem>
    </CustomSelectGroup>
  </CustomSelectContent>
</CustomSelect>
```

### Items with custom content

The reason to reach for `CustomSelect` over `Select` — items render arbitrary React children:

```tsx
<CustomSelect>
  <CustomSelectTrigger>
    <CustomSelectValue placeholder="Select status" />
  </CustomSelectTrigger>
  <CustomSelectContent>
    <CustomSelectItem value="active">
      <CircleIcon className="size-3 fill-support-green text-support-green" />
      Active
    </CustomSelectItem>
    <CustomSelectItem value="pending">
      <CircleIcon className="size-3 fill-support-yellow text-support-yellow" />
      Pending
    </CustomSelectItem>
  </CustomSelectContent>
</CustomSelect>
```

### In a settings row

Pair a `transparent` `small` trigger with a horizontal `Field`:

```tsx
<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel>Language</FieldLabel>
    <FieldDescription>Choose your preferred language.</FieldDescription>
  </FieldContent>
  <CustomSelect defaultValue="en">
    <CustomSelectTrigger size="small" variant="transparent">
      <CustomSelectValue />
    </CustomSelectTrigger>
    <CustomSelectContent>
      <CustomSelectItem value="en">English</CustomSelectItem>
      <CustomSelectItem value="es">Spanish</CustomSelectItem>
      <CustomSelectItem value="fr">French</CustomSelectItem>
    </CustomSelectContent>
  </CustomSelect>
</Field>
```

## Component API

All parts wrap the corresponding Radix `Select` primitive and forward its props (including `className`).

### CustomSelect

Root; manages select state.

| Prop            | Type                      | Default | Description                    |
| --------------- | ------------------------- | ------- | ------------------------------ |
| `value`         | `string`                  | -       | Controlled value               |
| `defaultValue`  | `string`                  | -       | Uncontrolled initial value     |
| `onValueChange` | `(value: string) => void` | -       | Called when the value changes  |
| `disabled`      | `boolean`                 | `false` | Disable the entire select      |
| `open`          | `boolean`                 | -       | Controlled open state          |
| `onOpenChange`  | `(open: boolean) => void` | -       | Called when open state changes |

### CustomSelectTrigger

Button that opens the dropdown. Always renders a chevron indicator.

| Prop      | Type                                    | Default     | Description                      |
| --------- | --------------------------------------- | ----------- | -------------------------------- |
| `variant` | `"default" \| "transparent" \| "glass"` | `"default"` | Visual style                     |
| `size`    | `"small" \| "medium" \| "large"`        | `"medium"`  | Trigger height (h-7 / h-8 / h-9) |

### CustomSelectValue

Displays the selected value or placeholder.

| Prop          | Type     | Default | Description                       |
| ------------- | -------- | ------- | --------------------------------- |
| `placeholder` | `string` | -       | Text shown when no value selected |

### CustomSelectContent

Dropdown container (rendered in a portal). Includes scroll up/down buttons automatically.

| Prop       | Type                           | Default          | Description                   |
| ---------- | ------------------------------ | ---------------- | ----------------------------- |
| `position` | `"item-aligned" \| "popper"`   | `"item-aligned"` | Positioning strategy          |
| `align`    | `"start" \| "center" \| "end"` | `"center"`       | Alignment relative to trigger |

### CustomSelectItem

Selectable option. Shows a checkmark when selected.

| Prop       | Type      | Default | Description              |
| ---------- | --------- | ------- | ------------------------ |
| `value`    | `string`  | -       | **Required.** Item value |
| `disabled` | `boolean` | `false` | Disable the item         |

### CustomSelectGroup / CustomSelectLabel / CustomSelectSeparator

`CustomSelectGroup` wraps related items; `CustomSelectLabel` titles a group; `CustomSelectSeparator` draws a divider. Each takes only standard props (`className`, children).

### CustomSelectScrollUpButton / CustomSelectScrollDownButton

Scroll indicators shown when content overflows. Already included inside `CustomSelectContent` — you rarely render these directly.

## Design System Rules

### ✅ Do

- Reach for `CustomSelect` only when items need custom React content or styling; otherwise use `Select`.
- Provide a meaningful placeholder.
- Group related options with `CustomSelectGroup` + `CustomSelectLabel`.
- Use `variant="transparent"` and `size="small"` for inline selects in settings rows.

### ❌ Don't

- Use for a single choice among few options (use RadioGroup) or a binary toggle (use Switch).
- Use overly long option labels that truncate.
- Nest selects inside each other.
