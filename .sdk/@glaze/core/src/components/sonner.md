# Toast (Sonner)

A native macOS-style toast notification system for brief, non-blocking feedback. Built on Sonner with glass styling, automatic light/dark theme detection, and typed variants (success, error, warning, info, loading). Reach for it to confirm an action or report a non-critical result without interrupting the user.

## When to Use

- **Success / error feedback** for actions that completed or failed but don't need a blocking response (saves, copies, deletes).
- **Async progress** via `toast.loading` or `toast.promise` — show a spinner, then resolve to success/error.
- **Warnings and info** for low-stakes notices.
- Use a **dialog** instead when an error is critical or requires a decision; don't put navigation or primary actions in a toast.

## Required Structure

Render exactly one `<Toaster />` at the app root. It is already mounted in the Glaze main app — never add a second one. The `toast` function works anywhere once a `Toaster` exists.

```tsx
import { Toaster } from "@glaze/core/components";

function App() {
  return (
    <>
      {/* app content */}
      <Toaster />
    </>
  );
}
```

## Usage Patterns

### Basic

Import `toast` from `@glaze/core/components` (not from `"sonner"`). Calling `toast(...)` directly shows an info toast; the variant methods set the icon and color.

```tsx
import { toast } from "@glaze/core/components";

toast.success("Changes saved");
toast.error("Failed to save changes");
toast.warning("Unsaved changes will be lost");
toast.info("New update available");
toast("Plain info message");
```

### Description and action

A second line of context, plus an action button. The button auto-dismisses the toast after `onClick`. `cancel` renders a second button the same way.

```tsx
toast.success("Published to the Team Store", {
  description: "All 3 apps updated successfully",
  action: { label: "Copy Link", onClick: () => copyShareLink(link) },
});
```

### Loading, then resolve

`toast.loading` defaults to `duration: Infinity` (it stays until you update or dismiss it). Pass the same `id` to swap it to a final state.

```tsx
const id = toast.loading("Uploading file...");
await uploadFile(file);
toast.success("File uploaded", { id });
```

### Async with `toast.promise`

Tracks a promise (or a `() => Promise` thunk) and transitions loading → success/error automatically. `success`/`error` accept a string/ReactNode, an object `{ message, description }`, or a function of the resolved value/error returning either.

```tsx
toast.promise(publishApp(appId), {
  loading: `Publishing "${name}"...`,
  success: (res) => ({ message: `Published "${name}"`, description: res.url }),
  error: (err) => `Failed to publish: ${err.message}`,
  finally: () => refetch(),
});
```

### Persistent until dismissed

```tsx
toast.warning("Connection lost", {
  duration: Infinity,
  action: { label: "Retry", onClick: reconnect },
});
```

### Dismissing

```tsx
toast.dismiss(id); // a specific toast
toast.dismiss(); // all toasts
```

## Component API

### `toast(message, options?)` and variants

`toast.success | error | warning | info | loading` share the same signature; the bare `toast(...)` call is equivalent to `toast.info(...)`. All return the toast id (`string | number`).

| Method                      | Icon / color                          | Default duration |
| --------------------------- | ------------------------------------- | ---------------- |
| `toast(msg)` / `toast.info` | info, `text-secondary`                | 4000ms           |
| `toast.success`             | check, `text-support-green`           | 4000ms           |
| `toast.error`               | octagon-x, `text-support-red`         | 4000ms           |
| `toast.warning`             | triangle-alert, `text-support-yellow` | 4000ms           |
| `toast.loading`             | spinner, `text-secondary`             | `Infinity`       |

`message: ReactNode` · `options?: ExternalToast` (Sonner options; relevant fields below).

### `options` (ExternalToast)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| number` | auto | Reuse to update an existing toast |
| `duration` | `number` | `4000` (`Infinity` for loading) | Auto-dismiss delay in ms |
| `description` | `ReactNode` | - | Secondary line under the title |
| `action` | `{ label: string; onClick?: () => void }` | - | Primary button; dismisses on click |
| `cancel` | `{ label: string; onClick?: () => void }` | - | Secondary button; dismisses on click |

### `toast.promise(promise, options)`

`promise: Promise<T> | (() => Promise<T>)`. Returns the toast id.

| Option    | Type                                                   | Description                                  |
| --------- | ------------------------------------------------------ | -------------------------------------------- |
| `loading` | `ReactNode`                                            | Shown while pending (default `"Loading..."`) |
| `success` | `ReactNode \| { message, description } \| (data) => …` | Resolved state                               |
| `error`   | `ReactNode \| { message, description } \| (err) => …`  | Rejected state                               |
| `finally` | `() => void \| Promise<void>`                          | Runs after settle                            |

Also accepts the other `ExternalToast` fields except `description`.

### `toast.dismiss(id?)`, `toast.custom(jsx)`, `toast.message(...)`

`dismiss` closes one toast or all if `id` is omitted. `custom((id) => ReactNode)` renders fully custom JSX. `message` is the raw Sonner passthrough.

### `<Toaster />`

Mounted once at the app root. Accepts all Sonner `ToasterProps`. Pre-configured for `bottom-center`, expanded stacking, glass surface, theme sync, and a hover dismiss button — override only when you have a reason.

### `<Toast />`

Low-level toast renderer used internally by the `toast` factory (rendered via Sonner's `custom`). You almost never render this directly — call `toast(...)` instead. Exported for advanced custom-render cases.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| number` | - | Toast id (required); used by the dismiss button |
| `type` | `"success" \| "error" \| "warning" \| "info" \| "loading"` | - | Icon + color set (required) |
| `title` | `ReactNode` | - | Main line (required) |
| `description` | `ReactNode` | - | Secondary line |
| `actions` | `{ label: string; onClick?: () => void }[]` | - | Buttons; each dismisses on click |

## Design System Rules

### ✅ Do

- Import `toast` / `Toaster` from `@glaze/core/components`.
- Keep messages to one sentence; reference the item ("Saved 'My App'").
- Use `toast.loading` + matching `id`, or `toast.promise`, for async work.
- Provide an `action` only when there's an immediate next step.

### ❌ Don't

- Import `toast` from `"sonner"` directly.
- Render more than one `<Toaster />`.
- Use toasts for critical errors or required decisions — use a dialog.
- Stack multiple toasts for the same action, or use them for obvious UI feedback.
