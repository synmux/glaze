# Code Block

Code presentation primitives used by `Markdown` and available for custom renderers. `CodeBlock` provides a wrapping fenced-code surface and optional copy action; `InlineCode` styles code within prose.

## When to Use

- Use `CodeBlock` for multiline code or logs.
- Use `InlineCode` for identifiers and short snippets in prose.
- Prefer `Markdown` when starting from a Markdown string.

## Usage Patterns

### Basic

```tsx
import { CodeBlock, InlineCode } from "@glaze/core/components";

<CodeBlock onCopy={copyCode}>
  <code>{`const ready = true;\nstart(ready);`}</code>
</CodeBlock>;

<p>
  Run <InlineCode>pnpm test</InlineCode>.
</p>;
```

`CodeBlock` does not perform syntax highlighting itself. Pass highlighted React children from a custom renderer, or use `Markdown` for bundled fenced-code highlighting.

### Copy behavior

```tsx
async function copyCode(code: string) {
  await navigator.clipboard.writeText(code);
}

<CodeBlock onCopy={copyCode}>
  <code>{source}</code>
</CodeBlock>;
```

The copy button is rendered only when `onCopy` is provided. `onCopy` receives the plain text extracted from the block's children.

## Component API

### CodeBlock

Extends native preformatted-text props except the native `onCopy` event.

| Prop     | Type                                      | Default | Description                                       |
| -------- | ----------------------------------------- | ------- | ------------------------------------------------- |
| `onCopy` | `(code: string) => void \| Promise<void>` | -       | Shows a copy action and receives plain code text. |

### InlineCode

Extends native code-element props, forwards its ref, and safely wraps long values in constrained layouts.

## Design System Rules

### ✅ Do

- Supply `onCopy` when the surrounding application supports clipboard access.
- Allow long code to wrap within constrained chat layouts.
- Put code text inside a semantic `<code>` child of `CodeBlock`.

### ❌ Don't

- Call application IPC directly from these components.
- Use `CodeBlock` for ordinary prose.
- Expect direct `CodeBlock` usage to add syntax highlighting; use `Markdown` or pass highlighted children.
