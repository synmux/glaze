# Collapsible

A disclosure control for progressively showing and hiding content, modeled on native macOS disclosure patterns (Finder sidebar sections, Mail folders, Xcode navigators). Powered by Radix `Collapsible` with smooth height animation. Reach for the raw primitives only outside a sidebar (cards, settings panels, forms).

## When to Use

- **Inline disclosure**: hide secondary details inside a card or settings row until requested.
- **Progressive disclosure in forms**: optional / advanced fields collapsed by default.
- **Nested groupings** outside a sidebar.
- Inside a sidebar, use `SidebarListGroup` (with `collapsible`) or `SidebarListItem` (with `collapsible`) instead — they handle chevron placement, alignment, and toggle plumbing automatically.
- Collapsibles allow any number of siblings open at once. macOS does not use exclusive "accordion" (one-open-at-a-time) patterns — don't build one.

## Parts

Compose four primitives. `CollapsibleChevron` must always be placed explicitly — there is no auto-injection.

- `CollapsibleRoot` — owns open/closed state.
- `CollapsibleTrigger` — a `<button>` that toggles the parent Root. Publishes its `data-state` via a scoped Tailwind group so a nested chevron rotates from the **nearest** trigger.
- `CollapsibleContent` — animated height container using Radix's `--radix-collapsible-content-height` var (200ms ease-out down, 150ms up).
- `CollapsibleChevron` — a `ChevronRightIcon` that rotates 90° on open. Reads the nearest trigger's state via the scoped group; pass `open` explicitly when rendered outside a trigger.

## Usage Patterns

### Basic

```tsx
<CollapsibleRoot defaultOpen>
  <CollapsibleTrigger>
    <CollapsibleChevron /> Project details
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="pt-1 pl-5">
      <Text as="p" color="secondary">
        More information about this item.
      </Text>
    </div>
  </CollapsibleContent>
</CollapsibleRoot>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<CollapsibleRoot open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>
    <CollapsibleChevron /> Advanced options
  </CollapsibleTrigger>
  <CollapsibleContent>{/* ... */}</CollapsibleContent>
</CollapsibleRoot>;
```

### Right-aligned chevron

The chevron is a slot — put it where you want.

```tsx
<CollapsibleTrigger>
  <span className="flex-1">Show more details</span>
  <CollapsibleChevron />
</CollapsibleTrigger>
```

### Chevron inside a clickable row (`onToggle`)

When the whole row is clickable for **one** purpose (select, navigate) and the chevron should do a **different** thing (toggle expand/collapse), you can't nest a `CollapsibleTrigger` inside the row — it renders a `<button>`, and HTML forbids nesting `<button>` inside `<button>`.

Skip `CollapsibleTrigger`: use a plain `<button>` for the row and pass `onToggle` to `CollapsibleChevron`. The chevron becomes the toggle without being a `<button>` itself — it stops mouse-down/click propagation (so the row's `onClick` doesn't fire) and flips the parent state. Because it sits outside a trigger, pass `open={open}` explicitly so it rotates. This is the mechanism `SidebarListItem collapsible` uses internally.

```tsx
const [open, setOpen] = useState(false);

<CollapsibleRoot open={open} onOpenChange={setOpen}>
  <button type="button" onClick={selectItem}>
    <CollapsibleChevron open={open} onToggle={() => setOpen((p) => !p)} />
    <Icon /> Row that selects on click
  </button>
  <CollapsibleContent>{/* children */}</CollapsibleContent>
</CollapsibleRoot>;
```

## Component API

### CollapsibleRoot

Extends Radix `Collapsible.Root` — all its props are supported.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state |
| `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes |
| `disabled` | `boolean` | `false` | Disable the control |
| `animated` | `boolean` | `true` | When `false`, descendant content/chevron render at 0ms duration. Use for distraction-free programmatic state changes. |
| `className` | `string` | - | Additional classes |

### CollapsibleTrigger

Extends Radix `Collapsible.Trigger`.

| Prop        | Type                 | Default | Description                               |
| ----------- | -------------------- | ------- | ----------------------------------------- |
| `variant`   | `"row" \| "section"` | `"row"` | Visual style; `section` is small/tertiary |
| `asChild`   | `boolean`            | `false` | Merge props onto the child element        |
| `className` | `string`             | -       | Additional classes                        |
| `children`  | `React.ReactNode`    | -       | Trigger content                           |

### CollapsibleChevron

Extends lucide-react `ChevronRightIcon` props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onToggle` | `() => void` | - | When set, the chevron becomes an inline toggle: stops `mouseDown`/`click` propagation, calls `onToggle`, and adds `role="button"`, `tabIndex={-1}`, `aria-label="Toggle"`. |
| `open` | `boolean` | - | Explicit rotation state. Pass when the chevron is rendered **outside** a `CollapsibleTrigger`. |
| `className` | `string` | - | Override size/color/margin (default `size-3.5 shrink-0 text-tertiary`) |

### CollapsibleContent

Extends Radix `Collapsible.Content`.

| Prop         | Type              | Default | Description                      |
| ------------ | ----------------- | ------- | -------------------------------- |
| `forceMount` | `boolean`         | `false` | Keep content mounted when closed |
| `className`  | `string`          | -       | Additional classes               |
| `children`   | `React.ReactNode` | -       | Disclosed content                |

## Design System Rules

### ✅ Do

- Always explicitly place `<CollapsibleChevron />` inside a trigger — there is no auto-injection.
- Inside sidebars, prefer `SidebarListGroup collapsible` / `SidebarListItem collapsible`.
- Keep the chevron on the **left** of content by default — macOS convention.
- Pair `onToggle` with `CollapsibleChevron` whenever the chevron sits inside a larger clickable area.
- Put padding on an inner wrapper inside `CollapsibleContent`, not on the element itself.

### ❌ Don't

- Don't build exclusive accordions — macOS doesn't use them.
- Don't omit the chevron unless you supply your own open/closed indicator.
- Don't animate custom content in ways that conflict with `CollapsibleContent`'s height animation.
- Don't apply `padding` directly on `CollapsibleContent` via `className`. Radix measures `scrollHeight` to animate `height`; padding on the animated element causes a visible jump at the end of the close animation.

```tsx
// ✅ padding on inner wrapper
<CollapsibleContent>
  <div className="pt-1 pl-5">…</div>
</CollapsibleContent>

// ❌ padding on the animated element
<CollapsibleContent className="pt-1 pl-5">…</CollapsibleContent>
```
