# Avatar

An image element with a graceful fallback for representing a user or entity. Built on Radix UI's Avatar primitive: the image only renders once it has successfully loaded, and the fallback (initials or an icon) shows while loading or on error. Reach for it whenever you need a person/team/org marker that must never show a broken image.

## When to Use

- **User identity**: the signed-in user, a profile, or a presence indicator.
- **Lists and rows**: who authored, owns, or is assigned to an item.
- **Comments and activity**: attributing messages or events to a person.
- **Collaborators**: member lists, sharing dialogs (use `AvatarStack` for grouped/overlapping).
- **Entities**: teams, organizations, or apps with a logo plus initials fallback.

## Usage Patterns

### Basic

```tsx
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

With no image the fallback renders immediately. Delay it with `delayMs` to avoid a flash on fast connections:

```tsx
<Avatar>
  <AvatarFallback>SK</AvatarFallback>
</Avatar>

<Avatar>
  <AvatarImage src={url} alt={name} />
  <AvatarFallback delayMs={600}>{initials}</AvatarFallback>
</Avatar>
```

The fallback also accepts a solid icon instead of initials:

```tsx
import { UserIcon } from "lucide-react";

<AvatarFallback>
  <UserIcon className="size-4 text-tertiary" />
</AvatarFallback>;
```

### Sizes

Use the `size` prop (`small` / `medium` / `large`, matching Button's scale); default is `medium`. Fallback text scales automatically. For a one-off size outside the scale, override with utility classes on the root:

```tsx
<Avatar size="small">{/* … */}</Avatar>
<Avatar size="large">{/* … */}</Avatar>

<Avatar className="size-12">
  <AvatarImage src={url} alt={name} />
  <AvatarFallback className="text-regular">{initials}</AvatarFallback>
</Avatar>
```

### Status and count badges

`AvatarBadge` anchors to a corner of the avatar. With no children it renders a status dot sized relative to the avatar; set `color` for presence. Dot badges mask a real 2px transparent gap out of the avatar rather than ringing the dot in a surface color, so they read correctly over the translucent window background. Pass children to render a count pill — use `position="top-right"` for the notification-count convention.

```tsx
<Avatar size="large">
  <AvatarImage src={url} alt={name} />
  <AvatarFallback>{initials}</AvatarFallback>
  <AvatarBadge color="green" />
</Avatar>

<Avatar>
  <AvatarImage src={url} alt={name} />
  <AvatarFallback>{initials}</AvatarFallback>
  <AvatarBadge position="top-right">12</AvatarBadge>
</Avatar>
```

### Stacked group

`AvatarStack` overlaps avatars and masks a real transparent gap between them (no surface-colored rings, so it works over any background). The first avatar renders on top; children should be uniformly sized.

```tsx
<AvatarStack>
  {members.map((member) => (
    <Avatar key={member.id}>
      <AvatarImage src={member.avatarUrl} alt={member.name} />
      <AvatarFallback>{member.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarStack>
```

### With name and detail

In dense lists, pair the avatar with a name where space allows rather than relying on the image alone.

```tsx
<div className="flex items-center gap-2">
  <Avatar>
    <AvatarImage src={user.avatarUrl} alt={user.name} />
    <AvatarFallback>{user.initials}</AvatarFallback>
  </Avatar>
  <div className="flex flex-col">
    <Text>{user.name}</Text>
    <Text variant="small" color="tertiary">
      {user.email}
    </Text>
  </div>
</div>
```

## Component API

### Avatar (Root)

Extends `React.ComponentProps<typeof AvatarPrimitive.Root>`.

| Prop        | Type                             | Default    | Description                                  |
| ----------- | -------------------------------- | ---------- | -------------------------------------------- |
| `size`      | `"small" \| "medium" \| "large"` | `"medium"` | Avatar size, matching Button's sizing scale. |
| `className` | `string`                         | -          | Additional CSS classes.                      |

### AvatarImage

Extends `React.ComponentProps<typeof AvatarPrimitive.Image>` (all `<img>` attributes). `draggable={false}` and a suppressed native context menu are applied by default, matching Glaze's chrome-image convention.

| Prop                    | Type                                   | Default | Description                         |
| ----------------------- | -------------------------------------- | ------- | ----------------------------------- |
| `src`                   | `string`                               | -       | Image source URL.                   |
| `alt`                   | `string`                               | -       | Alternative text (always provide).  |
| `onLoadingStatusChange` | `(status: ImageLoadingStatus) => void` | -       | Fires as the image loads or errors. |
| `className`             | `string`                               | -       | Additional CSS classes.             |

### AvatarFallback

Extends `React.ComponentProps<typeof AvatarPrimitive.Fallback>`. Background is solid and theme-derived by default.

| Prop        | Type     | Default | Description                                          |
| ----------- | -------- | ------- | ---------------------------------------------------- |
| `delayMs`   | `number` | -       | Delay before showing the fallback, to avoid a flash. |
| `className` | `string` | -       | Additional CSS classes.                              |

### AvatarBadge

Extends `React.ComponentProps<"span">`. Render as a child of `Avatar`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `"gray" \| "blue" \| "green" \| "yellow" \| "orange" \| "red" \| "pink"` | `"green"` | Dot color when the badge has no children (ignored when it has any); other colors via `className`. |
| `position` | `"bottom-right" \| "top-right" \| "bottom-left" \| "top-left"` | `"bottom-right"` | Corner to anchor to; use `top-right` for notification counts. |
| `children` | `ReactNode` | - | Count/content; when present the badge renders a pill instead of a dot. |
| `className` | `string` | - | Additional CSS classes. |

### AvatarStack

Extends `React.ComponentProps<"div">`. Children should be uniformly sized `Avatar`s; the first renders on top, and each overlap shows a real transparent gap.

| Prop        | Type     | Default | Description             |
| ----------- | -------- | ------- | ----------------------- |
| `className` | `string` | -       | Additional CSS classes. |

## Design System Rules

### ✅ Do

- Always render `AvatarFallback` so there is content while loading or on error.
- Always provide a meaningful `alt` on `AvatarImage`.
- Use initials (1–2 characters) or a solid icon as the fallback.
- Keep avatars circular for people (the default `rounded-full`).
- Size with the `size` prop; only drop to utility classes for one-off sizes.
- Use `AvatarStack` for stacked/grouped avatars with uniformly sized children.

### ❌ Don't

- Omit the fallback — a broken image with no fallback looks unfinished.
- Put long text in the fallback; keep it to initials or an icon.
- Give the fallback a semi-transparent (alpha) background — keep it solid (the default is), or stacked avatars below will bleed through.
- Use semi-transparent alpha icons inside the fallback (see icon usage rules).
- Rely on the image alone for identity in dense lists; pair with a name where space allows.
