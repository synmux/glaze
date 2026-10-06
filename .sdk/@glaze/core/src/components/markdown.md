# Markdown

A complete Markdown renderer for general rich application content and streaming AI responses. It bundles GFM, design-system tables, KaTeX math, syntax highlighting, incomplete-stream repair, and block-level memoization.

## When to Use

- Use `Markdown` when application data or an AI response is stored as a Markdown string.
- Use `AIChat.Response` for already-rendered React content.
- Use `CodeBlock` and `InlineCode` directly when the source is already structured React content.
- Override `components` only when a product needs a distinct renderer for a Markdown element.

## Usage Patterns

### Basic

```tsx
import { Markdown } from "@glaze/core/components";

<Markdown>{message}</Markdown>;
```

### Streaming and premeasurement

```tsx
import { Markdown } from "@glaze/core/components";

<Markdown isStreaming={isStreaming} syntaxHighlighting={!isPremeasuring} onCopyCode={copyCode}>
  {message}
</Markdown>;
```

`onCopyCode` receives plain code text. The surrounding application owns clipboard, toast, analytics, and IPC behavior.

### GFM, tables, math, and code

```tsx
const source = `| Capability | Included |
| --- | --- |
| Tables | Yes |

$$
E = mc^2
$$

\`\`\`tsx
<Markdown>{source}</Markdown>
\`\`\``;

<Markdown onCopyCode={copyCode}>{source}</Markdown>;
```

### Custom renderer

```tsx
<Markdown components={{ a: ({ children, ...props }) => <CustomLink {...props}>{children}</CustomLink> }}>
  {message}
</Markdown>
```

## Component API

### Markdown

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | required | Markdown source. |
| `isStreaming` | `boolean` | `false` | Repairs incomplete syntax in the final block. |
| `syntaxHighlighting` | `boolean` | `true` | Disable during hidden premeasurement to avoid duplicate highlighting work. |
| `onCopyCode` | `(code: string) => void \| Promise<void>` | - | Enables copy controls on fenced code. |
| `components` | `MarkdownComponents` | - | React Markdown renderer overrides. |
| `className` | `string` | - | Additional classes on the response container. |

Raw HTML is not rendered. KaTeX remains active when syntax highlighting is disabled because math layout affects measured height.

## Design System Rules

### ✅ Do

- Pass `isStreaming` while a response is incomplete.
- Disable syntax highlighting only for hidden measurement passes.
- Clean provider-specific protocol tags before rendering.
- Keep the Markdown source in application state; the renderer owns no transport or loading state.

### ❌ Don't

- Enable raw HTML rendering.
- Perform clipboard or IPC work inside a custom presentation component; pass `onCopyCode`.
- Use `Markdown` when content is already structured React UI; use `AIChat.Response` or ordinary layout components.
