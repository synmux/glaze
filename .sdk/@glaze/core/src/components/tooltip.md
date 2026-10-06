# Tooltip

A native tooltip rendered in a separate glass-morphism window that shows a short label (and optionally a keyboard shortcut) when the user hovers a trigger. It auto-flips and clamps to stay on screen. Reach for it to clarify icon-only controls or truncated content — not for rich or interactive popovers.

## When to Use

- **Icon-only or ambiguous controls**: name a button whose meaning isn't obvious from its icon.
- **Surface a shortcut**: show the keyboard shortcut bound to an action.
- Use a popover/dialog instead when the content is interactive or longer than a phrase — tooltip content is hover-only and not focusable.

## Required Structure

`TooltipProvider` must wrap the app once at the root. It manages the instant-open grace period so moving between adjacent tooltips feels instant.

```tsx
import { TooltipProvider } from "@glaze/core/components";

function App() {
  return <TooltipProvider>{/* app content */}</TooltipProvider>;
}
```

Each tooltip is composed of `Tooltip` > `TooltipTrigger` + `TooltipContent`.

## Usage Patterns

### Basic

Use `asChild` so the trigger merges onto your own element rather than adding a wrapper `<span>`.

```tsx
import { Tooltip, TooltipContent, TooltipTrigger } from "@glaze/core/components";

<Tooltip>
  <TooltipTrigger asChild>
    <Button iconOnly>
      <SettingsIcon className="w-4 h-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>;
```

### Positioning

`side` is the preferred side; the tooltip auto-flips when it would be clipped.

```tsx
<TooltipContent side="top">Top (default)</TooltipContent>
<TooltipContent side="bottom">Bottom</TooltipContent>
<TooltipContent side="left">Left</TooltipContent>
<TooltipContent side="right">Right</TooltipContent>
```

### Longer descriptions

Content stays on one line by default. For a longer plain-text description, cap the width. The tooltip automatically balances wrapped text and tightens the bubble to the smallest width that preserves that line count. Pair with `leading-snug` so wrapped lines aren't cramped by the default tight leading.

```tsx
<TooltipContent className="max-w-[220px] leading-snug">
  Built-in AI from @glaze/core/ai. Draws from the user's credits.
</TooltipContent>
```

### With a keyboard shortcut

`shortcut` renders each key as a filled key glyph. It can accompany a label, or stand alone as the only content.

```tsx
<TooltipContent shortcut={["⌘", "S"]}>Save</TooltipContent>
<TooltipContent shortcut={["⌘", "K"]} />
```

### Controlled open state

Pass `open` to force the state: `true` forces open, `false` forces closed, `undefined` (default) restores hover behavior. Useful to suppress a tooltip while its trigger is being edited.

```tsx
<Tooltip open={isEditing ? false : undefined}>
  <TooltipTrigger asChild>
    <input ... />
  </TooltipTrigger>
  <TooltipContent>Edit name</TooltipContent>
</Tooltip>
```

### Disabled trigger

Disabled elements don't emit pointer events, so wrap them in a `<span>` to keep the tooltip working.

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span>
      <Button disabled iconOnly>
        <DeleteIcon className="w-4 h-4" />
      </Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>Sign in to delete items</TooltipContent>
</Tooltip>
```

## Component API

### TooltipProvider

Wraps the app root. Manages the instant-open grace period between tooltips. Takes only `children`.

### Tooltip

| Prop   | Type      | Default | Description                                                                       |
| ------ | --------- | ------- | --------------------------------------------------------------------------------- |
| `open` | `boolean` | -       | Controlled open state. `true` forces open, `false` forces closed; omit for hover. |

### TooltipTrigger

Accepts standard `HTMLAttributes`. Wires pointer handlers onto the trigger element.

| Prop      | Type      | Default | Description                                                                    |
| --------- | --------- | ------- | ------------------------------------------------------------------------------ |
| `asChild` | `boolean` | `false` | Merge trigger props onto the child element instead of a `<span>`. Recommended. |

### TooltipContent

Either `children` or `shortcut` is required (one may be omitted).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | - | The tooltip label. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred side; auto-flips if clipped. |
| `shortcut` | `string[]` | - | Keyboard shortcut keys, rendered as filled glyphs. |
| `className` | `string` | - | Additional classes on the content container. |

## Design System Rules

### ✅ Do

- Use tooltips to label icon-only controls and surface shortcuts.
- Keep content to a short phrase.
- Use `asChild` to attach the trigger directly to an existing element.
- Wrap a disabled trigger in a `<span>` so it still shows the tooltip.

### ❌ Don't

- Put interactive or focusable content inside `TooltipContent` — it's hover-only.
- Use a tooltip to convey essential information not available elsewhere.
- Add a wrapper element when `asChild` would do.
