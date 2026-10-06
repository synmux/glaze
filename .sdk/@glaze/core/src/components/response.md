# AI Chat Response

A long-form assistant-content typography container. It can host Markdown, structured React content, or application-specific renderers with consistent readable spacing.

## When to Use

- Use `AIChat.Response` for long-form assistant prose rendered by custom components.
- Use `Markdown` when the source is a Markdown string.
- Use `Text` for short labels and interface copy.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Response>
  <h2>Summary</h2>
  <p>The application is ready.</p>
</AIChat.Response>;
```

## Component API

### AIChat.Response

Extends native div props and forwards its ref. Typography scales with `--agent-zoom` when a consumer supplies that variable.

## Design System Rules

### ✅ Do

- Use it for readable long-form content.
- Keep interactive controls outside prose unless they are part of the content.

### ❌ Don't

- Use it for compact toolbar labels or form metadata.
- Override every descendant margin at the call site.
