# Callout

A short, non-modal message that needs attention inside the current view. Callout uses the same color vocabulary and soft tinted treatment as Badge, but gives the message enough space for sentences, optional icons, actions, and dismissal.

## When to Use

- **Inline notices**: explain a temporary state without opening a dialog
- **Settings banners**: point to missing setup, trial status, or account state
- **Recoverable warnings**: show what happened and offer the next action
- **Contextual errors**: surface an error near the place it matters

Use `Toast` for transient feedback after an action. Use `AlertDialog` when the user must make a blocking decision. Use `Badge` for compact labels, counts, and tags.

## Usage Patterns

### Basic

For a plain child message, Callout centers the content automatically.

```tsx
<Callout color="orange">
  Team trial ends in 2 days. Add a payment method to keep team features, including Team Store and private sharing.
</Callout>
```

### Colors

`color` matches Badge: `primary`, `secondary` (default), `blue`, `green`, `yellow`, `orange`, `red`, `purple`, `magenta`. Support colors use a same-hue tint with matching text.

```tsx
<Callout color="blue">Cloud Sync is ready to configure.</Callout>
<Callout color="green">Your app is now available in the team store.</Callout>
<Callout color="red">Publishing failed. Review the errors and try again.</Callout>
```

### Props API

Set `icon`, `actions`, or `onDismiss` for the structured layout. The message stays in `children`.

```tsx
<Callout
  color="red"
  icon={<XCircleIcon />}
  actions={<Button size="small">Team Settings</Button>}
  onDismiss={dismissTrialNotice}
>
  Team trial ended. Add a payment method to restore team features, including Team Store and private sharing.
</Callout>
```

### Composition

Use the compound parts when you need custom ordering or extra layout.

```tsx
<Callout color="orange">
  <Callout.Icon>
    <TriangleAlertIcon />
  </Callout.Icon>
  <Callout.Text>
    Team trial ends in 2 days. Add a payment method to keep team features, including Team Store and private sharing.
  </Callout.Text>
  <Callout.Actions>
    <Button size="small">Team Settings</Button>
  </Callout.Actions>
</Callout>
```

### As alert

Add `role="alert"` only when newly inserted content requires immediate screen-reader announcement, such as an inline error.

```tsx
<Callout color="red" role="alert">
  <Callout.Icon>
    <TriangleAlertIcon />
  </Callout.Icon>
  <Callout.Text>Access denied. Contact the network administrator to view this page.</Callout.Text>
</Callout>
```

## Component API

### Callout

Extends `React.ComponentProps<"div">`, except `color` is reserved for Callout props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `"primary" \| "secondary" \| "blue" \| "green" \| "yellow" \| "orange" \| "red" \| "purple" \| "magenta"` | `"secondary"` | Color treatment matching Badge |
| `icon` | `ReactNode` | - | Leading icon for the props API |
| `actions` | `ReactNode` | - | Trailing actions, usually one small Button |
| `onDismiss` | `() => void` | - | Adds a trailing dismiss button |
| `dismissLabel` | `string` | `"Dismiss"` | Accessible label for the dismiss button |
| `children` | `ReactNode` | - | Plain centered content, structured message in props mode, or compound parts |
| `className` | `string` | - | Additional CSS classes |

### Callout.Icon

Extends `React.ComponentProps<"div">`. Provides the leading icon slot and sizes direct SVG children to `size-4`.

### Callout.Text

Extends `React.ComponentProps<"p">`. Flexible message text for compound composition.

### Callout.Actions

Extends `React.ComponentProps<"div">`. Trailing action row, centered against the callout.

### Callout.Close

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`, except `children` is reserved.

| Prop         | Type     | Default     | Description                                        |
| ------------ | -------- | ----------- | -------------------------------------------------- |
| `label`      | `string` | `"Dismiss"` | Accessible label when `aria-label` is not provided |
| `aria-label` | `string` | -           | Explicit accessible label                          |
| `className`  | `string` | -           | Additional CSS classes                             |

## Design System Rules

### ✅ Do

- Use the same color meanings as Badge (`green` success, `orange` warning, `red` error)
- Keep simple child-only callouts to one short message
- Use `children` for standard message copy and `Callout.Text` for compound composition
- Use `role="alert"` only for newly appearing urgent errors

### ❌ Don't

- Don't add borders, shadows, or variant-specific treatments; Callout intentionally matches Badge's soft color style
- Don't split callout copy into separate title and description treatments
- Don't use Callout for compact labels — use `Badge`
- Don't put more than one primary action in a callout
- Don't use Callout for blocking confirmations — use `AlertDialog`
