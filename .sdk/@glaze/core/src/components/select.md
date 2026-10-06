# Select

A dropdown built on the system's native popup menu, with macOS styling, animations, and accessibility. This is the default choice for single-selection dropdowns; reach for [CustomSelect](./custom-select.md) only when an item needs React children, custom colors, or styling the native menu can't express.

## When to Use

- Standard single-selection dropdowns — settings, configuration, filters.
- Items are plain text with optional SF Symbol or image icons and an optional sublabel.
- Use [CustomSelect](./custom-select.md) instead when items need React children (badges, component icons), custom colors (e.g. status dots), or custom styling.
- Use RadioGroup for fewer than ~4 options (unless space-constrained, e.g. a toolbar) and Switch for binary choices.

## Usage Patterns

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@glaze/core/components";
```

### Basic

Controlled via `value`/`onValueChange`, or uncontrolled via `defaultValue`.

```tsx
<Select value={theme} onValueChange={setTheme}>
  <SelectTrigger>
    <SelectValue placeholder="Select theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

### Trigger variants, sizes, and shapes

`variant`: `default` (bordered), `filled` (subtle control chrome matching Input and SegmentedControl), `transparent` (inline settings rows), `glass` (toolbar buttons). `size`: `small | medium | large`. Use `shape="pill"` for compact standalone controls such as an in-composer model picker.

```tsx
<SelectTrigger variant="filled" size="small" shape="pill">
  <SelectValue />
</SelectTrigger>
```

### Items with icons and sublabels

`icon` takes an SF Symbol name or image path; `sublabel` renders secondary text below the label.

```tsx
<Select value={model} onValueChange={setModel}>
  <SelectTrigger>
    <SelectValue placeholder="Select model" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="grid" icon="square.grid.2x2" sublabel="Best for complex tasks">
      Grid View
    </SelectItem>
    <SelectItem value="list" icon="list.bullet">
      List View
    </SelectItem>
  </SelectContent>
</Select>
```

### Groups, separators, and disabled items

```tsx
<Select value={timezone} onValueChange={setTimezone}>
  <SelectTrigger>
    <SelectValue placeholder="Select timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern (EST)</SelectItem>
      <SelectItem value="pst">Pacific (PST)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
      <SelectItem value="cet" disabled>
        Central European (coming soon)
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Inline in a settings row

Pair a `transparent`, `small` trigger with `Field` for inline settings.

```tsx
<Field orientation="horizontal">
  <FieldLabel>Theme</FieldLabel>
  <Select value={theme} onValueChange={setTheme}>
    <SelectTrigger size="small" variant="transparent">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

Disable the whole control with `<Select disabled>`.

## Component API

### Select

Root component that manages state. `SelectContent` renders nothing itself — its items are extracted and shown in the native menu.

| Prop            | Type                      | Default | Description                       |
| --------------- | ------------------------- | ------- | --------------------------------- |
| `value`         | `string`                  | -       | Controlled value                  |
| `defaultValue`  | `string`                  | -       | Default value (uncontrolled)      |
| `onValueChange` | `(value: string) => void` | -       | Callback when value changes       |
| `disabled`      | `boolean`                 | `false` | Disable the entire select         |
| `children`      | `ReactNode`               | -       | `SelectTrigger` + `SelectContent` |

### SelectTrigger

Button that opens the native menu. Forwards remaining `<button>` attributes except `onClick`, `onKeyDown`, `size`.

| Prop          | Type                                                | Default     | Description               |
| ------------- | --------------------------------------------------- | ----------- | ------------------------- |
| `variant`     | `"default" \| "filled" \| "transparent" \| "glass"` | `"default"` | Visual style variant      |
| `size`        | `"small" \| "medium" \| "large"`                    | `"medium"`  | Trigger size              |
| `shape`       | `"default" \| "pill"`                               | `"default"` | Trigger corner treatment  |
| `hideChevron` | `boolean`                                           | `false`     | Hide the built-in chevron |
| `className`   | `string`                                            | -           | Additional CSS classes    |

### SelectValue

Displays the selected item's label (and icon) or the placeholder.

| Prop          | Type     | Default | Description                       |
| ------------- | -------- | ------- | --------------------------------- |
| `placeholder` | `string` | -       | Text shown when no value selected |
| `className`   | `string` | -       | Additional CSS classes            |

### SelectItem

Selectable option. Marker component — renders nothing; props are extracted by the root.

| Prop       | Type             | Default | Description                                         |
| ---------- | ---------------- | ------- | --------------------------------------------------- |
| `value`    | `string`         | -       | **Required.** Item value                            |
| `sublabel` | `string`         | -       | Secondary text below the label                      |
| `icon`     | `NativeMenuIcon` | -       | SF Symbol name (e.g. `"folder.fill"`) or image path |
| `disabled` | `boolean`        | `false` | Disable the item                                    |
| `children` | `ReactNode`      | -       | Display text (text content only)                    |

### SelectContent / SelectGroup / SelectLabel / SelectSeparator

`SelectContent` wraps the items. `SelectGroup` clusters items under an optional `SelectLabel`. `SelectSeparator` draws a divider. All take only `children` (none for `SelectSeparator`) and render nothing directly.

## Design System Rules

### ✅ Do

- Use clear, concise option labels and a meaningful placeholder.
- Group related options with `SelectGroup` + `SelectLabel`.
- Use `variant="transparent"` and `size="small"` for inline settings rows.
- Use SF Symbol icons to aid visual scanning.

### ❌ Don't

- Use for fewer than ~4 options (use RadioGroup) or for binary choices (use Switch).
- Put React components in `SelectItem` children — use [CustomSelect](./custom-select.md).
- Apply custom colors to items — use [CustomSelect](./custom-select.md).
