# Label

A caption for a form control. Built on Radix `Label`, it associates clickable text with an input so clicking the text focuses or toggles the control. Use it to name every interactive field.

## When to Use

- **Naming a form control**: pair with `Checkbox`, `Switch`, `RadioGroup`, `Input`, or any field so it has an accessible, clickable name.
- **Grouping related controls**: a strong group label above a set of checkboxes or radios.
- Use plain `Text` instead for non-interactive captions, descriptions, or helper text that isn't tied to a specific control.

## Usage Patterns

### Basic

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" />
```

### Wrapping a control

Wrapping the control inside `Label` associates them without an `id` — clicking the text toggles the control. The label is a flex row (`gap-2`), so the control and text align automatically.

```tsx
<Label>
  <Checkbox />I agree to the terms
</Label>
```

### Group label with helper text

Use a strong label to title a group; add secondary `Text` for explanation (helper text is not part of the label):

```tsx
<div className="flex flex-col gap-2">
  <Label className="text-strong">Notifications</Label>
  <Label>
    <Checkbox checked={email} onCheckedChange={setEmail} />
    Email
  </Label>
  <Label>
    <Checkbox checked={push} onCheckedChange={setPush} />
    Push
  </Label>
  <Text as="p" variant="small" color="secondary">
    Choose how you want to be notified.
  </Text>
</div>
```

## Component API

### Label

Wraps Radix `Label.Root` (renders a `<label>`) — all native label and Radix Label props are supported.

| Prop        | Type        | Default | Description                                  |
| ----------- | ----------- | ------- | -------------------------------------------- |
| `htmlFor`   | `string`    | -       | `id` of the control this labels              |
| `className` | `string`    | -       | Additional classes                           |
| `children`  | `ReactNode` | -       | Label text, and optionally a wrapped control |

The disabled appearance is automatic: a wrapped `peer-disabled` control dims the label, and a `group-data-[disabled=true]` ancestor disables pointer events and dims it.

## Design System Rules

### ✅ Do

- Give every interactive form control a label (wrap it, or use `htmlFor`/`id`).
- Use `text-strong` for a group title that sits above several controls.
- Put descriptions and helper text in a separate `Text`, not inside the label.

### ❌ Don't

- Use `Label` for static text unrelated to a control — use `Text`.
- Forget the `htmlFor`/`id` link when the control isn't wrapped inside the label.
- Set a manual disabled style; the wrapped/ancestor disabled states already dim it.
