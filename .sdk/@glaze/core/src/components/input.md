# Input

A single-line text input — the standard control for short freeform values like names, emails, URLs, and search terms. It is a thin styled wrapper over the native `<input>`, so every standard input attribute and event works unchanged.

## When to Use

- **Short text entry**: names, emails, passwords, URLs, search queries, any single-line value.
- Use **Textarea** instead for multi-line text, and **NumberInput** instead for numeric values that need stepping/formatting.
- Wrap in **Field** (see ./field.md) when you need a label, helper text, or validation messaging around the input.

## Usage Patterns

### Basic

```tsx
<Input placeholder="Search" />
```

### Variants

`default` is bordered with a transparent fill (the standalone form-field look). `filled` has a subtle filled chrome — use it when stacking inputs alongside `SegmentedControl` in a dense inspector-style panel.

```tsx
<Input variant="default" placeholder="Name" />
<Input variant="filled" placeholder="Name" />
```

### Sizes

```tsx
<Input size="small" placeholder="Inspector field" />
<Input size="medium" placeholder="Default" />
<Input size="large" placeholder="Prominent" />
```

### States

Pass `aria-invalid` to render the error treatment; `disabled` dims and blocks interaction.

```tsx
<Input disabled placeholder="Disabled" />
<Input aria-invalid placeholder="Invalid" />
```

### Controlled with a typed value

Standard React controlled input — the component adds no state of its own.

```tsx
<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
```

### Labeled field

Compose with `Field` for a label and validation message:

```tsx
<Field label="Email" error={error}>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</Field>
```

## Component API

### Input

Accepts every native `<input>` prop and event (`type`, `value`, `onChange`, `placeholder`, `disabled`, `aria-invalid`, …) except `size`, which is overridden by the variant prop below.

| Prop        | Type                             | Default     | Description                                        |
| ----------- | -------------------------------- | ----------- | -------------------------------------------------- |
| `variant`   | `"default" \| "filled"`          | `"default"` | Bordered transparent fill, or subtle filled chrome |
| `size`      | `"small" \| "medium" \| "large"` | `"medium"`  | Control height (28 / 32 / 36px) and corner radius  |
| `type`      | `string`                         | `"text"`    | Native input type (`text`, `email`, `password`, …) |
| `className` | `string`                         | -           | Additional classes                                 |

## Design System Rules

### ✅ Do

- Use `filled` only in dense panels alongside segmented controls; keep `default` for standalone forms.
- Match `size` to the surrounding controls (`small` for inspectors, `medium` elsewhere).
- Set `aria-invalid` to surface validation errors so the error styling and screen readers stay in sync.
- Use the correct `type` (`email`, `password`, `url`) for keyboard and autofill hints.

### ❌ Don't

- Use for multi-line input (use Textarea) or numeric stepping (use NumberInput).
- Pass a numeric `size` attribute — it is overridden by the size variant.
- Restyle the border/background via `className`; pick the appropriate `variant` instead.
