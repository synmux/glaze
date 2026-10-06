# AI Chat Message

Provider-agnostic message anatomy for user, assistant, and system content. It supplies role-aware layout while leaving avatars, rendering, and actions composable.

## When to Use

- Use `AIChat.Message` for individual entries in a conversation.
- Compose the existing `Avatar`, `Markdown`, and `Button` primitives instead of duplicating them.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Message.Root from="user">
  <AIChat.Message.Content>Make the composer more flexible.</AIChat.Message.Content>
</AIChat.Message.Root>;
```

### Assistant response with actions

```tsx
<AIChat.Message.Root from="assistant">
  <AIChat.Message.Content>
    <Markdown>{answer}</Markdown>
  </AIChat.Message.Content>
  <AIChat.Message.Actions>
    <AIChat.Message.Action tooltip="Copy" asChild>
      <Button iconOnly>...</Button>
    </AIChat.Message.Action>
  </AIChat.Message.Actions>
</AIChat.Message.Root>
```

## Component API

### AIChat.Message.Root

| Prop   | Type                                | Default  | Description                                  |
| ------ | ----------------------------------- | -------- | -------------------------------------------- |
| `from` | `"user" \| "assistant" \| "system"` | required | Controls role-aware alignment and treatment. |

Extends native article props. Assistant messages use the same 16px rhythm between response, reasoning, tool, task, and action blocks as Glaze Agent; user messages remain compact.

### AIChat.Message.Content

Extends native div props. User content receives the default bubble treatment through its parent role.

### AIChat.Message.Actions

Extends native div props and groups message-level actions.

### AIChat.Message.Action

| Prop      | Type                                     | Default | Description                   |
| --------- | ---------------------------------------- | ------- | ----------------------------- |
| `asChild` | `boolean`                                | `false` | Merge onto one child control. |
| `tooltip` | `ReactNode`                              | -       | Optional short action label.  |
| `side`    | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred tooltip side.       |

## Design System Rules

### ✅ Do

- Keep message data conversion outside the component.
- Use `AIChat.Message.Actions` for secondary controls such as copy or retry.

### ❌ Don't

- Pass provider-specific message objects directly to `AIChat.Message.Root`.
- Recreate avatar or button primitives inside the namespace.
