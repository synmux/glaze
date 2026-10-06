# NotificationDot

A tiny accent-colored dot that marks new or unseen content — the "there is something here you haven't looked at yet" indicator on menu items, sidebar rows, tabs, or buttons. It carries no text; pair it with the label of the thing it marks and clear it once the user visits that content.

## When to Use

- Flag a menu item, sidebar row, or tab that leads to content the user hasn't seen yet (a new feature, unread section, pending change).
- Use [`AvatarBadge`](./avatar.md) instead for a dot anchored to an avatar corner (presence, profile-level attention).
- Use [`Badge`](./badge.md) instead when the indicator needs content (counts, labels, tags).
- Use [`Status`](./status.md) instead for live operational state (loading, error, success).

## Usage Patterns

### Basic

```tsx
import { NotificationDot } from "@glaze/core/components";

<div className="flex items-center gap-2">
  <span className="text-regular text-primary">Changelog</span>
  <NotificationDot />
</div>;
```

### Sidebar row

Pass it as the `accessory` of a `SidebarListItem` so it right-aligns like other trailing content:

```tsx
<SidebarListItem icon={<GiftIcon />} title="Invite Friends" accessory={hasUnseen ? <NotificationDot /> : undefined} />
```

### On accent surfaces

The dot is accent-colored, so it disappears against accent backgrounds (e.g. a focused menu item). Flip it to the contrast color for that state:

```tsx
<CustomDropdownMenuItem>
  <GiftIcon className="size-4" />
  Invite Friends
  <NotificationDot className="ml-auto group-focus:bg-accent-contrast" />
</CustomDropdownMenuItem>
```

## Component API

### NotificationDot

Renders a `<span>` and accepts all span props.

| Prop        | Type     | Default | Description                                                                |
| ----------- | -------- | ------- | -------------------------------------------------------------------------- |
| `className` | `string` | —       | Merge overrides: size (`size-1.5`), color (`bg-support-red`), positioning. |

## Design System Rules

### ✅ Do

- Clear the dot once the user has seen the content it points to — a permanent dot is noise.
- Keep it the default 8px (`size-2`) next to regular text; resize via `className` only for a deliberately subtler indicator.

### ❌ Don't

- Don't put text or counts inside it — use `Badge`.
- Don't scatter dots across many sibling items at once; mark the entry point, not every row.
