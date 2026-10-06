# AI Chat Tool

A provider-agnostic compound presentation for one AI tool invocation. The trigger summarizes activity while optional input, output, and error regions disclose details.

## When to Use

- Use `AIChat.Tool` for one concrete tool call.
- Use `AIChat.ToolGroup` to summarize several related calls.
- Use `AIChat.Reasoning` for non-tool thinking or work summaries.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Tool.Root status="running" defaultOpen>
  <AIChat.Tool.Trigger>
    <AIChat.Tool.Name>Search files</AIChat.Tool.Name>
    <AIChat.Tool.Summary>packages/glaze-core</AIChat.Tool.Summary>
  </AIChat.Tool.Trigger>
  <AIChat.Tool.Content>
    <AIChat.Tool.Input>Query: composer</AIChat.Tool.Input>
    <AIChat.Tool.Output>12 files</AIChat.Tool.Output>
  </AIChat.Tool.Content>
</AIChat.Tool.Root>;
```

### Error

```tsx
<AIChat.Tool.Root status="error">
  <AIChat.Tool.Trigger>
    <AIChat.Tool.Name>Run build</AIChat.Tool.Name>
  </AIChat.Tool.Trigger>
  <AIChat.Tool.Content>
    <AIChat.Tool.Error>Build failed</AIChat.Tool.Error>
  </AIChat.Tool.Content>
</AIChat.Tool.Root>
```

### Summary-only tool

Omit `AIChat.Tool.Content` for a non-interactive status row. The trigger automatically hides its disclosure chevron.

```tsx
<AIChat.Tool.Root status="success">
  <AIChat.Tool.Trigger>
    <AIChat.Tool.Name>Read file</AIChat.Tool.Name>
    <AIChat.Tool.Summary>composer.tsx</AIChat.Tool.Summary>
  </AIChat.Tool.Trigger>
</AIChat.Tool.Root>
```

## Component API

### AIChat.Tool.Root

Extends `CollapsibleRoot`.

The root detects a directly composed `AIChat.Tool.Content`, including content inside a fragment, and makes the trigger expandable only when details exist.

| Prop     | Type                                             | Default  | Description |
| -------- | ------------------------------------------------ | -------- | ----------- |
| `status` | `"pending" \| "running" \| "success" \| "error"` | required | Tool state. |

### AIChat.Tool.Trigger

Extends `CollapsibleTrigger` with a compact text-row treatment. The disclosure chevron appears immediately after the summary only when the root contains `AIChat.Tool.Content`; otherwise the trigger is a non-interactive status row.

### AIChat.Tool.Name

Extends native span props. Pending and running names receive the shimmer treatment.

### AIChat.Tool.Summary

Extends native span props and truncates secondary detail.

### AIChat.Tool.Content

Extends `CollapsibleContent` with the shared compact indentation and an even 8px disclosure rhythm used by tool groups.

### AIChat.Tool.Input, AIChat.Tool.Output, AIChat.Tool.Error

Extend native div props. `AIChat.Tool.Error` uses `role="alert"`.

## Design System Rules

### ✅ Do

- Convert provider data into the shared status and presentational children at the call site.
- Keep the trigger useful when details are collapsed.
- Render tool activity inside the assistant message where it occurred. Keep tool display state with persisted chat history when the transcript itself is persisted.
- Update one display item by its stable tool-call ID as it moves from `running` to `success` or `error`; do not append a second item for the result event.
- When several related invocations would produce indistinguishable summary-only rows, aggregate them into one display status or use `AIChat.ToolGroup` rather than repeating the same label.

### ❌ Don't

- Add provider-specific tool-part props.
- Hide actionable errors solely inside collapsed content.
- Render normal tool progress as a `Callout` or place it in the composer footer. Those locations are for alerts and prompt controls, not transcript activity.
