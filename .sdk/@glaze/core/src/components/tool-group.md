# AI Chat Tool Group

A collapsible summary for several related AI tool calls. It provides group anatomy while each child remains a normal `AIChat.Tool`, `AIChat.Reasoning`, or application-specific detail.

## When to Use

- Use `AIChat.ToolGroup` when repeated calls would otherwise overwhelm the transcript.
- Use `AIChat.Tool` directly for a single important invocation.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.ToolGroup.Root>
  <AIChat.ToolGroup.Trigger>3 file operations</AIChat.ToolGroup.Trigger>
  <AIChat.ToolGroup.Content>{tools}</AIChat.ToolGroup.Content>
</AIChat.ToolGroup.Root>;
```

## Component API

### AIChat.ToolGroup.Root

Extends `CollapsibleRoot`.

### AIChat.ToolGroup.Trigger

Extends `CollapsibleTrigger` with a compact text-row treatment and disclosure chevron.

### AIChat.ToolGroup.Content

Extends `CollapsibleContent` with the same compact indentation and even 8px disclosure rhythm as `AIChat.Tool.Content`.

## Design System Rules

### ✅ Do

- Summarize the count or outcome in the trigger.
- Preserve useful errors when grouping completed work.

### ❌ Don't

- Group unrelated calls solely to reduce vertical space.
- Put provider-specific grouping logic in the component.
