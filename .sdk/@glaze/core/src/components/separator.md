# Separator

A thin dividing line that visually groups or separates content. Wraps Radix `Separator.Root` and renders a 1px line that fills its cross-axis. Reach for it to divide sections of a list, menu, toolbar, or settings page.

## When to Use

- **Group sections**: split a settings page, list, or menu into distinct blocks.
- **Divide inline items**: place a vertical separator between toolbar buttons or breadcrumb segments.
- Prefer spacing (gaps/margins) for light grouping; use a separator only when a visible line clarifies structure. Don't separate every single row.

## Usage Patterns

### Basic

```tsx
<Separator />
```

### Orientation

Horizontal (default) draws a full-width line; vertical draws a full-height line and needs a parent with a defined height (e.g. a flex row).

```tsx
<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

### Vertical between toolbar items

A vertical separator needs height from its parent — give the flex row a height or let its content define one.

```tsx
<div className="flex h-8 items-center gap-2">
  <Button variant="transparent">Bold</Button>
  <Button variant="transparent">Italic</Button>
  <Separator orientation="vertical" />
  <Button variant="transparent">Link</Button>
</div>
```

### Dividing stacked sections

```tsx
<div className="flex flex-col gap-4">
  <section>
    <Text variant="strong">Profile</Text>
    {/* fields */}
  </section>
  <Separator />
  <section>
    <Text variant="strong">Notifications</Text>
    {/* fields */}
  </section>
</div>
```

## Component API

### Separator

Wraps Radix `Separator.Root` — all Radix Separator props are supported.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the line |
| `decorative` | `boolean` | `true` | When `true`, treated as purely visual (no semantic role announced) |
| `className` | `string` | - | Additional classes |

## Design System Rules

### ✅ Do

- Use to clarify the boundary between meaningful sections.
- Give a vertical separator a parent with defined height.
- Rely on the built-in color (`bg-foreground-5`) so it adapts across themes.

### ❌ Don't

- Place a separator between every row — use spacing instead.
- Override the color or thickness via `className`.
- Set `decorative={false}` unless the line conveys real structural meaning to assistive tech.
