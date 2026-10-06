# Field

A composable system for building accessible form rows. Combine labels, controls, descriptions, and error messages into consistent settings-style layouts with semantic grouping. The top-level props on `Field` and `FieldSet` collapse the deep primitive nesting into one component per row; drop to the primitives only for custom layouts.

## When to Use

- Building settings-style forms — large, roomy, one-topic-per-row, often with descriptions and validation.
- Creating accessible field groups with proper labeling and semantic grouping.
- Displaying validation errors alongside inputs.
- For **dense property panels** (many small labeled controls aligned in a column, like an Xcode/Pages inspector), use [`Inspector`](./inspector.md) instead.

## Usage Patterns

### Basic

`Field.label` / `Field.description` / `Field.error` auto-build the `FieldContent` + `FieldLabel` + `FieldDescription` + `FieldError` stack. Children become the right-aligned control slot. Default orientation is `horizontal` when `label` is set, laying out as `[label + description] ← [control]`.

```tsx
<Field label="Email" description="We'll never share your email." error={emailError}>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</Field>
```

`FieldSet.title` / `FieldSet.description` auto-render `<FieldLegend>` and wrap rows in a `<FieldGroup>` (the rounded gray container) when none is provided. `FieldGroup` auto-inserts `<FieldSeparator />` between adjacent content rows — no manual separators needed.

```tsx
<FieldSet title="Appearance" description="Customize how the app looks.">
  <Field label="Theme" description="Pick a theme or follow the system.">
    <RadioGroup value={theme} onValueChange={setTheme} orientation="horizontal">
      <Label>
        <RadioGroupItem value="system" />
        Auto
      </Label>
      <Label>
        <RadioGroupItem value="light" />
        Light
      </Label>
    </RadioGroup>
  </Field>
  <Field label="Sidebar icon size">
    <Select defaultValue="medium">
      <SelectTrigger size="small" variant="transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="small">Small</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="large">Large</SelectItem>
      </SelectContent>
    </Select>
  </Field>
</FieldSet>
```

### Orientation

- `horizontal` (default with `label`) — label and control side-by-side.
- `vertical` — stacks label above a full-width control. Use **inside a Dialog body** or wizard step where there's room for a tall input.
- `responsive` — container query switches vertical → horizontal at the `@md` breakpoint.

```tsx
<Dialog title="Create Project" …>
  <Field label="Prompt" description="What do you want to build?" orientation="vertical">
    <Textarea value={prompt} onChange={…} rows={4} />
  </Field>
</Dialog>
```

### Action rows

Without a `label`, a Field with only `<Button>` children renders the buttons as a right-aligned row. Buttons stay intrinsic-width and wrap if they don't fit — never full-width. `FieldGroup` draws no separator above an action-only row, so a Save button visually belongs to the preceding input.

```tsx
<Field>
  <Button size="small" onClick={() => simulate("checking")}>
    Check
  </Button>
  <Button size="small" onClick={() => simulate("downloading")}>
    Download
  </Button>
  <Button variant="filled" size="small" onClick={save}>
    Save
  </Button>
</Field>
```

### Long-form content — disclosure row → Dialog

For multi-line / long text (custom instructions, bios, prompts), **don't inline a `<Textarea>`** in a settings row. Make the Field itself the disclosure row via `Dialog`'s `trigger` prop. Field picks up the `onClick` that `DialogTrigger asChild` injects, flips into button mode (whole-row hover/active/focus), and `FieldGroup`'s auto-divider treats it as a content row.

```tsx
<Dialog
  open={open}
  onOpenChange={handleOpen}
  trigger={
    <Field label="Custom Instructions" description="Included in every AI request." disabled={isLoading}>
      <ChevronRightIcon className="size-4 shrink-0 text-quaternary" />
    </Field>
  }
  title="Custom Instructions"
  size="large"
  confirmLabel="Save"
  confirmDisabled={text === savedText}
  onConfirm={save}
>
  <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} autoFocus />
</Dialog>
```

Do **not** mix `onClick`/button mode with interactive children (Input, Switch, Select) — a `<button>` nesting an interactive element is invalid HTML.

### Composition with primitives

Drop to the primitives when the top-level props can't express the layout (choice cards where the whole row is clickable, custom alignment). Use `FieldContent` to keep label + description together in horizontal layouts.

```tsx
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@glaze/core/components";

<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldGroup>
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor="email">Email notifications</FieldLabel>
        {isInvalid ? (
          <FieldError>This address is invalid.</FieldError>
        ) : (
          <FieldDescription>Receive updates about your account.</FieldDescription>
        )}
      </FieldContent>
      <Switch id="email" aria-invalid={isInvalid} defaultChecked />
    </Field>
    <FieldSeparator />
    <Field orientation="horizontal">
      <FieldLabel htmlFor="brightness">Brightness</FieldLabel>
      <Slider id="brightness" defaultValue={[70]} max={100} />
    </Field>
  </FieldGroup>
</FieldSet>;
```

`FieldSeparator` accepts optional inline content for an "or" divider:

```tsx
<FieldSeparator>Or continue with</FieldSeparator>
```

## Component API

### Field

Single form row. Renders a `<div role="group">`, or a `<button>` when `onClick` is set.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | - | Row label. Auto-rendered as a `<FieldLabel>`. |
| `description` | `React.ReactNode` | - | Row subtext. Auto-rendered as a `<FieldDescription>`. |
| `error` | `React.ReactNode` | - | Validation message. Auto-rendered as a `<FieldError>`. |
| `orientation` | `"vertical" \| "horizontal" \| "responsive"` | `horizontal` in props/action mode, else `vertical` | Layout direction. |
| `onClick` | `MouseEventHandler<HTMLElement>` | - | Makes the row an interactive `<button>` (disclosure pattern). |
| `disabled` | `boolean` | - | Fades label/description; suppresses clicks in button mode. |
| `data-invalid` | `boolean` (attribute) | - | Applies destructive/error styling to the row. |
| `className` | `string` | - | Additional classes. |

### FieldSet

Semantic `<fieldset>` wrapper. Auto-adjusts gap for checkbox/radio groups.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | - | Section header. Auto-rendered as a `<FieldLegend>`; wraps rows in a `<FieldGroup>` if none present. |
| `description` | `React.ReactNode` | - | Section subtext. Auto-rendered as a `<FieldDescription>`. |
| `className` | `string` | - | Additional classes. |

### FieldLegend

Legend element for a `FieldSet`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"legend" \| "label"` | `"legend"` | `legend` adds horizontal margin; `label` aligns with other labels (use for nested fieldsets). |
| `className` | `string` | - | Additional classes. |

### FieldGroup

Card-like wrapper (`bg-well`, rounded) that stacks `Field` rows and auto-inserts separators between content rows. Use in settings forms; do not use in regular inline forms. Do not nest.

| Prop        | Type     | Default | Description         |
| ----------- | -------- | ------- | ------------------- |
| `className` | `string` | -       | Additional classes. |

### FieldContent

Flex column grouping the label and description so the control sits beside them in horizontal layouts.

| Prop        | Type     | Default | Description         |
| ----------- | -------- | ------- | ------------------- |
| `className` | `string` | -       | Additional classes. |

### FieldLabel

Label for a control. Wraps the `Label` component. When wrapping a nested `Field` (choice cards), applies border/background and styles when containing a checked radio/checkbox.

| Prop        | Type     | Default | Description          |
| ----------- | -------- | ------- | -------------------- |
| `htmlFor`   | `string` | -       | Associated input ID. |
| `className` | `string` | -       | Additional classes.  |

### FieldTitle

Title with label styling inside `FieldContent` (not associated with an input).

| Prop        | Type     | Default | Description         |
| ----------- | -------- | ------- | ------------------- |
| `className` | `string` | -       | Additional classes. |

### FieldDescription

Helper text (`max-w-[350px]`, text-balances in horizontal layouts, underlines child links).

| Prop        | Type     | Default | Description         |
| ----------- | -------- | ------- | ------------------- |
| `className` | `string` | -       | Additional classes. |

### FieldSeparator

Visual divider between fields in a `FieldGroup`. With `children`, renders an inline "or"-style label.

| Prop        | Type              | Default | Description           |
| ----------- | ----------------- | ------- | --------------------- |
| `children`  | `React.ReactNode` | -       | Optional inline text. |
| `className` | `string`          | -       | Additional classes.   |

### FieldError

Accessible error container (`role="alert"`). Renders `children`, or dedupes and lists the `errors` array (e.g. from react-hook-form).

| Prop        | Type                                       | Default | Description                               |
| ----------- | ------------------------------------------ | ------- | ----------------------------------------- |
| `children`  | `React.ReactNode`                          | -       | Error message content.                    |
| `errors`    | `Array<{ message?: string } \| undefined>` | -       | Error objects; multiple render as a list. |
| `className` | `string`                                   | -       | Additional classes.                       |

## Design System Rules

### ✅ Do

- Prefer the top-level `Field`/`FieldSet` props (`label`, `description`, `error`, `title`) over hand-building the primitive stack.
- Use `FieldGroup` to create visually grouped settings sections; use `FieldContent` in horizontal layouts when there's a description.
- Add `data-invalid` to `Field` and `aria-invalid` to the input for error states.
- Use `FieldSet` + `FieldLegend` for semantic grouping.
- Keep label and description copy static across control states — pick wording that reads in both, render changing values in the control slot, not by rewriting the description.

### ❌ Don't

- Nest `FieldGroup` inside another `FieldGroup`, or use `FieldSeparator` outside a `FieldGroup`.
- Show `FieldDescription` and `FieldError` simultaneously — swap between them based on state.
- Inline a `<Textarea>` in a settings row — use the disclosure → Dialog pattern.
- Mix Field button mode (`onClick`) with interactive children (invalid HTML).
- Forget `htmlFor` on `FieldLabel`, or add excessive separators.
