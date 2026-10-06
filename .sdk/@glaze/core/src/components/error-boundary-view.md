# ErrorBoundaryView

A full-screen fallback that renders when an uncaught error reaches the router's error boundary. It shows a friendly "Something went wrong" screen, surfaces the error, and offers recovery actions (Reload, plus "Fix with Agent" in dev builds).

**You usually don't use this component directly.** The scaffolded template already wires it as the root route's `errorComponent` (see `renderer/main/router.tsx`), so any uncaught render error in the app falls back to it automatically. Reach for it manually only in the rare case below.

## When to Use

- **Already installed** — the template sets `errorComponent: ErrorBoundaryView` on the root route, so you get the crash screen for free. Don't add it again at the root.
- **Manual use is rare**: only to scope a _separate_ error boundary to a specific sub-route (so a crash in one section shows the fallback without taking down the whole app), via that route's `errorComponent`.
- Not for inline/recoverable errors (a failed fetch, empty state, validation message) — handle those in place. This is for unexpected, app-breaking render errors only.

## Usage Patterns

### Already wired (default — nothing to do)

The template's router already registers it on the root route. This is shown for reference; you don't need to write it:

```tsx
const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootView,
  errorComponent: ErrorBoundaryView, // ← already here in scaffolded apps
});
```

### Scoping to a sub-route (the rare manual case)

Set it as `errorComponent` on a child route to contain crashes to that section:

```tsx
const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsView,
  errorComponent: ErrorBoundaryView,
});
```

TanStack Router passes the caught `error` to the component — you never pass it yourself.

### Behavior by runtime context

The view adapts automatically based on where the app is running — you don't configure this:

- **Published apps**: a generic "Try reloading or contact the app developer" message with a single **Reload** button.
- **Editable local apps**: the raw `error.message` plus a **Fix with Agent** button that deep-links into the Glaze agent with the error (and current project path) prefilled, alongside **Reload**.

## Component API

### ErrorBoundaryView

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `error` | `unknown` | - | The caught error, supplied by the router's `errorComponent` contract. `Error` instances render their `message`/`stack`; other values are stringified. |

## Design System Rules

### ✅ Do

- Rely on the template's existing root wiring; only add it manually as a sub-route `errorComponent`.
- Let the router supply `error` — don't construct or pass it yourself.

### ❌ Don't

- Re-register it at the root — the scaffolded router already does.
- Use it for expected, in-flow errors (failed requests, empty states) — handle those inline.
- Wrap it in extra chrome or layout; it owns the full screen (`h-screen`) and includes its own draggable region.
- Add custom messaging by branching on runtime context yourself — the component already handles published vs. editable apps.
