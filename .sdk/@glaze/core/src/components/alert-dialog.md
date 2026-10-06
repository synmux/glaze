# AlertDialog

A modal dialog that interrupts the user with important content and expects a single explicit decision. Unlike `Dialog`, AlertDialog cannot be dismissed by clicking outside or pressing Escape — the user must choose Cancel or Confirm. Reach for it whenever accidental dismissal would have consequences.

## When to Use

- A confirmation where dismissing by mistake loses work or triggers an irreversible action — delete, unpublish, reset API key, remove member, sign out, discard draft, leave with unsaved changes.
- Use `confirmVariant="destructive"` for irreversible/destructive actions; leave the default `"accent"` for consequential-but-safe ones (sign out, leave-with-unsaved).
- Use `Dialog` instead when Escape-dismissal is a safe no-op (forms, settings sheets, info modals), or when you need more than Cancel + Confirm — `Dialog` supports `destructiveAction` / `secondaryAction`.

## Usage Patterns

When `onConfirm` plus any other top-level prop is set, AlertDialog auto-builds the trigger/header/footer tree, so a confirmation collapses into one component. Without `onConfirm` it falls back to composition (so it never creates an un-dismissible alert).

### Basic — destructive confirm

```tsx
<AlertDialog
  trigger={<Button variant="destructive">Delete Project</Button>}
  title="Delete this project?"
  description="The project and all its generated files will be permanently deleted. This can't be undone."
  onConfirm={() => deleteProject(id)}
  confirmLabel="Delete"
  confirmVariant="destructive"
/>
```

`onConfirm` may return a Promise: the confirm button disables (no spinner — avoids width jitter) until it resolves; on success the dialog closes, on throw it stays open so you can surface an error from inside the handler.

### Non-destructive confirm

Accent confirm (the default). AlertDialog rather than `Dialog` because Escape-dismissal would lose the user's work.

```tsx
<AlertDialog
  trigger={<Button>Leave Project</Button>}
  title="You have unsaved changes"
  description="If you leave now, your latest edits to this project will be lost."
  onConfirm={leave}
  confirmLabel="Leave"
/>
```

### Controlled (open programmatically)

Omit `trigger` and drive `open` / `onOpenChange` yourself.

```tsx
<AlertDialog
  open={signOutOpen}
  onOpenChange={setSignOutOpen}
  title="Sign out of Glaze?"
  description="You'll need to sign back in to continue using Glaze and your organizations."
  onConfirm={signOut}
  confirmLabel="Sign Out"
/>
```

### Composition (custom body)

Drop to primitives when the body needs custom structure — a list of consequences, a "type DELETE to confirm" input, etc. All text-ish props (`title`, `description`, `confirmLabel`, `trigger`) accept `ReactNode`, so inline icons/`<code>`/emphasis work without composing.

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Sign Out</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Sign out of Glaze?</AlertDialogTitle>
      <AlertDialogDescription>Signing out will:</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogBody>
      <ul className="list-disc list-inside text-regular text-secondary space-y-1">
        <li>Pause any running agent sessions</li>
        <li>Clear the local cache</li>
        <li>Disconnect your organizations until you sign back in</li>
      </ul>
    </AlertDialogBody>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="accent">Sign Out</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Component API

### AlertDialog

Root. When `onConfirm` plus any other top-level prop is set, it owns open state internally (overridable via `open` / `onOpenChange`) and builds the content tree; `children` become the body. Also forwards all `AlertDialogPrimitive.Root` props (`open`, `defaultOpen`, `onOpenChange`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | - | Wrapped in `AlertDialogTrigger asChild`. Omit to open programmatically. |
| `title` | `ReactNode` | - | Auto-renders an `AlertDialogTitle`. Always set one. |
| `hideTitle` | `boolean` | `false` | Keep the title in the DOM (Radix requires it) but hide it visually (`sr-only`). |
| `description` | `ReactNode` | - | Auto-renders an `AlertDialogDescription`. |
| `hideDescription` | `boolean` | `false` | Same as `hideTitle`, for the description. |
| `onConfirm` | `() => void \| Promise<void>` | - | Confirm handler. Required to enter props mode; auto-renders the Cancel + Confirm footer. |
| `confirmLabel` | `ReactNode` | `"Confirm"` | Confirm button label. Prefer a verb that names the action ("Delete", "Sign Out"). |
| `confirmVariant` | `"accent" \| "destructive"` | `"accent"` | Confirm button variant. |
| `confirmDisabled` | `boolean` | - | Disable confirm (e.g. typed-name confirmation doesn't match). |
| `size` | `"small" \| "medium" \| "large" \| "xl" \| "2xl"` | `"small"` | Forwarded to `AlertDialogContent`. Alerts are narrow by convention. |

### AlertDialogContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `"small" \| "medium" \| "large" \| "xl" \| "2xl"` | `"small"` | Dialog width (`small` ≈ `w-3xs`, up to `900px` at `2xl`). |
| `className` | `string` | - | Additional classes. |

### AlertDialogAction

Confirm action. Without `asChild` it renders its own `Button` (accepts `ButtonProps`), defaults to `flex-1`, registers the confirm keyboard shortcut, and renders the key hint inline — use this for new call sites. With `asChild` it's a Radix passthrough: the inner element still receives the confirm ref, but `flex-1` and the key hint are not auto-applied.

### AlertDialogCancel

Cancel action; closes the dialog. Same two modes as `AlertDialogAction`. Without `asChild`, defaults to `variant="filled"` and `flex-1`.

### Other parts

| Part | Description |
| --- | --- |
| `AlertDialogTrigger` | Opens the dialog; use `asChild` to wrap a `Button`. |
| `AlertDialogHeader` | Container for title + description. |
| `AlertDialogTitle` | Required for accessibility. |
| `AlertDialogDescription` | States the consequence of the action. |
| `AlertDialogBody` | Scrollable body wrapper (`ScrollArea`, faded edges, `max-h-[50vh]`). |
| `AlertDialogFooter` | Lays out buttons horizontally, each `flex-1` (50/50 split — native macOS two-button pattern). |
| `AlertDialogOverlay`, `AlertDialogPortal` | Backdrop and portal primitives (rendered automatically by `AlertDialogContent`). |

## Design System Rules

### ✅ Do

- Always set a `title` and a `description` — name the action and its consequence ("Delete this project?" / "This can't be undone").
- Use `confirmVariant="destructive"` for irreversible destructive actions; keep `"accent"` otherwise.
- Use the top-level props OR primitives, not both.
- For longer explanatory content, wrap the body in `AlertDialogBody` so it scrolls.

### ❌ Don't

- Don't use AlertDialog when Escape-dismissal is harmless — use `Dialog`.
- Don't need more than Cancel + Confirm — use `Dialog` with `destructiveAction` / `secondaryAction`.
- Don't mix `trigger` with an explicit `<AlertDialogTrigger>` child (dev builds warn; `trigger` wins).
- Don't set top-level props without `onConfirm` and expect props mode — it falls back to composition (dev builds warn).
