# AI Chat Task List

A compact status list for AI plans, tool progress, and background work. Each item receives an explicit provider-independent status.

## When to Use

- Use `AIChat.TaskList` for a small set of work items whose progress matters to the user.
- Use `List` for selectable application data.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.TaskList.Root>
  <AIChat.TaskList.Item status="success">Inspect components</AIChat.TaskList.Item>
  <AIChat.TaskList.Item status="running">Implement composer</AIChat.TaskList.Item>
  <AIChat.TaskList.Item status="pending">Run verification</AIChat.TaskList.Item>
</AIChat.TaskList.Root>;
```

## Component API

### AIChat.TaskList.Root

Extends native div props.

### AIChat.TaskList.Item

| Prop     | Type                                             | Default  | Description                                 |
| -------- | ------------------------------------------------ | -------- | ------------------------------------------- |
| `status` | `"pending" \| "running" \| "success" \| "error"` | required | Status icon, animation, and semantic color. |

Extends native div props.

## Design System Rules

### ✅ Do

- Use concise, action-oriented labels.
- Map provider-specific states before rendering.

### ❌ Don't

- Use task items as selectable navigation rows.
- Animate historical completed task lists.
