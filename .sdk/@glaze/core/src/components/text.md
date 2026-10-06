# Text

The canonical way to render text in Glaze apps. `Text` pairs a typography variant (size + weight + line-height) with a semantic color, so styling is expressed in roles instead of raw `text-sm` / `font-medium` / `text-gray-*` utilities. Prefer it over raw typography utilities — the Tailwind defaults and the older `text-body`/`text-headline` styles are legacy.

## When to Use

- Any visible text: labels, titles, descriptions, captions, metadata, code.
- When you'd otherwise reach for `text-sm`, `font-medium`, or a text color utility.
- Not for text inside components that already style their own text (e.g. `Button` labels) — those handle typography internally.

## Usage Patterns

Body copy is `regular` (13px) — start there and step up/down deliberately. `-strong` variants replace ad-hoc `font-medium` emphasis. Secondary information uses `color="secondary"`, hints/metadata `tertiary`.

### Basic

```tsx
import { Text } from "@glaze/core/components";

<Text>Default body text (13px)</Text>
<Text variant="strong">Emphasized body text</Text>
<Text variant="small" color="secondary">Supporting description</Text>
```

### Variants

```tsx
<Text as="h1" variant="heading1">Page title (24px)</Text>
<Text as="h2" variant="heading2">Section title (18px)</Text>
<Text variant="extra-large">18px regular</Text>
<Text variant="large-strong">16px medium</Text>
<Text variant="small">11px — captions, metadata</Text>
<Text variant="mini-strong">8px — tiny indicators</Text>
<Text variant="mono">npm run build</Text>
<Text variant="small-mono" color="tertiary">v1.0.4</Text>
```

### Status colors

```tsx
<Text variant="small" color="red">Build failed</Text>
<Text variant="small" color="green">Published</Text>
<Text variant="small" color="link">Learn more</Text>
```

### Real-world composition

```tsx
<div className="flex flex-col gap-1">
  <Text variant="strong">Stockholm Weather</Text>
  <Text variant="small" color="secondary" truncate>
    Last updated 5 minutes ago from SMHI
  </Text>
</div>
```

### Variant as a utility class

Every variant is also a single Tailwind utility (size + weight + line-height bundled) for places where a `Text` element doesn't fit — e.g. setting inherited typography on a container or interactive element. **The class is the variant name with a `text-` prefix**: `variant="small"` ↔ `text-small`, `variant="large-strong"` ↔ `text-large-strong`. The `color` prop follows the same shape: `color="secondary"` ↔ `text-secondary`; support colors map to a `support-` prefix — `color="red"` ↔ `text-support-red`. Mono variants additionally need `font-mono` alongside the class, since a font-size utility can't carry the font family.

```tsx
<button className="text-strong rounded-full px-3 …">Save</button>
```

## Component API

### Text

Extends `React.ComponentProps<"span">` (minus `color`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `heading1` \| `heading2` \| `extra-large(-strong)` \| `large(-strong)` \| `regular` \| `strong` \| `small(-strong)` \| `mini(-strong)` \| `mono(-strong)` \| `small-mono` | `regular` | Size + weight pairing. Headings are weight 600, `-strong` is 500, `mono-strong` is 600. Sizes: heading1 24, heading2/extra-large 18, large 16, regular/mono 13, small 11, mini 8. |
| `color` | `primary` \| `secondary` \| `tertiary` \| `quaternary` \| `disabled` \| `link` \| `inherit` \| `accent` \| `red` \| `orange` \| `yellow` \| `green` \| `blue` \| `purple` \| `magenta` | `primary` | Semantic text color (theme-derived) or a support color. |
| `align` | `left` \| `center` \| `right` | — | Text alignment. No default — inherits from parent. |
| `truncate` | `boolean` | `false` | Single-line ellipsis truncation (needs a constrained width). |
| `as` | HTML tag name | `span` | Render as a different semantic element (`p`, `h1`–`h4`, `label`, `pre`, …). |
| `asChild` | `boolean` | `false` | Compose with an existing element/primitive instead of rendering one (takes precedence over `as`). |

## Design System Rules

### ✅ Do

- Use a `variant` for every size/weight need — the scale (8/11/13/16/18/24) is intentional.
- Use semantic `color` values so text adapts to themes (light/dark and custom app themes).
- Use `as` to keep heading semantics (`h1`–`h3`) and paragraph flow without raw tags.
- Use the variant utilities (`text-regular`, `text-strong`, …) when typography must live on a container or interactive element.
- Use `truncate` with a width-constrained container.

### ❌ Don't

- Don't use raw `text-sm` / `text-lg` / `font-medium` Tailwind utilities — they bypass the type scale.
- Don't use `text-gray-*` for text color — gray utilities don't follow themes; semantic colors do.
- Don't override `font-size`/`font-weight` via `className` — pick the closest variant instead (the variant utilities also carry a non-retina rendering adjustment for 8px/13px sizes).
- Don't nest `Text` inside `Text` just to mix colors — use one `Text` per styled run.
