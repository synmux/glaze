# Status

A small pill that communicates the current state of an item — loading, success, error, warning, or neutral. It renders a colored status dot (auto-derived from the variant) followed by a short label, making it the right choice for inline state indicators in lists, tables, and detail headers.

## When to Use

- **State at a glance**: show whether something is running, succeeded, failed, or idle (jobs, deployments, connections, sync state).
- **Inline in dense UI**: table cells, list rows, and headers where a labeled dot reads faster than prose.
- Use a plain **Badge** or text label instead when the value is a category/count rather than a state, and there's no success/error/loading meaning.

## Usage Patterns

### Basic

The variant drives both the dot color and (for `loading`) the pulse animation. Provide the label as children:

```tsx
<Status variant="success">Active</Status>
```

### Variants

```tsx
<Status variant="loading">Loading</Status>
<Status variant="success">Success</Status>
<Status variant="error">Error</Status>
<Status variant="warning">Warning</Status>
<Status variant="neutral">Idle</Status>
```

`loading` is the default variant and its dot pulses. The dot color is fixed per variant (green / red / orange / gray) — do not override it.

### Driven by data

Map a domain state onto a variant; keep the label short:

```tsx
const STATUS_VARIANT = {
  running: "loading",
  done: "success",
  failed: "error",
} as const;

<Status variant={STATUS_VARIANT[job.state] ?? "neutral"}>{job.stateLabel}</Status>;
```

### As a link or button (asChild)

Use `asChild` to render the pill as a different element while keeping the styling, e.g. a clickable status that opens details:

```tsx
<Status variant="error" asChild>
  <a href={`/jobs/${job.id}`}>Failed</a>
</Status>
```

## Component API

### Status

Renders a `<span>` (or the child element when `asChild`). Extends all native `<span>` props.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"neutral" \| "loading" \| "error" \| "warning" \| "success"` | `"loading"` | State to display; sets the dot color and animation. |
| `asChild` | `boolean` | `false` | Merge props onto the single child instead of a span. |
| `children` | `React.ReactNode` | - | The status label, rendered after the dot. |
| `className` | `string` | - | Additional classes. |

## Design System Rules

### ✅ Do

- Pick the variant that matches the real state (`error` for failures, `success` for completion).
- Keep the label to one or two words.
- Use `asChild` when the status itself should be interactive.

### ❌ Don't

- Try to recolor the dot — it's fixed per variant and is the state's signal (`className` only reaches the outer pill, not the dot).
- Use `error`/`success` variants for non-state categories; use a neutral label instead.
- Pack long sentences into the pill — it's a label, not a description.
