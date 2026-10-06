# AI Chat Reasoning

A collapsible presentation for AI reasoning and work summaries. It is provider-agnostic and accepts application-rendered children.

## When to Use

- Use `AIChat.Reasoning` for thinking, messages, or work summaries that can be progressively disclosed.
- Use `AIChat.Tool` for a concrete tool invocation.
- Use `AIChat.TaskList` for status-bearing plans and checklists.

## Usage Patterns

### Pending without details

Use a summary-only streaming row while the model has not produced visible text. It shimmers and does not render an empty disclosure chevron.

```tsx
<AIChat.Reasoning.Root status="streaming">
  <AIChat.Reasoning.Trigger>Thinking…</AIChat.Reasoning.Trigger>
</AIChat.Reasoning.Root>
```

### Basic

```tsx
import { AIChat, Markdown } from "@glaze/core/components";

<AIChat.Reasoning.Root status="streaming" defaultOpen>
  <AIChat.Reasoning.Trigger>Thinking…</AIChat.Reasoning.Trigger>
  <AIChat.Reasoning.Content>
    <Markdown isStreaming className="italic text-secondary">
      {"I'm comparing the existing component anatomy with the requested interaction."}
    </Markdown>
  </AIChat.Reasoning.Content>
</AIChat.Reasoning.Root>;
```

## Component API

### AIChat.Reasoning.Root

Extends `CollapsibleRoot`.

The root detects a directly composed `AIChat.Reasoning.Content`, including content inside a fragment, and makes the trigger expandable only when details exist.

| Prop     | Type                                                            | Default     | Description              |
| -------- | --------------------------------------------------------------- | ----------- | ------------------------ |
| `status` | `"pending" \| "running" \| "success" \| "error" \| "streaming"` | `"success"` | Current reasoning state. |

### AIChat.Reasoning.Trigger

Extends `CollapsibleTrigger` with a compact text-row treatment. Streaming labels shimmer. The disclosure chevron appears only when the root contains `AIChat.Reasoning.Content`.

### AIChat.Reasoning.Content

Extends `CollapsibleContent` and supplies compact top spacing for disclosed content.

## Design System Rules

### ✅ Do

- Keep detailed reasoning collapsed unless it is actively useful.
- Provide a concise trigger label.
- Use a summary-only streaming row for pending model output instead of plain loading text.
- Compose prose, messages, or tool groups inside the disclosed content.

### ❌ Don't

- Pass provider event objects directly.
- Use reasoning disclosure for required error information.
- Represent task progress as reasoning content; use `AIChat.TaskList` instead.
