# AI Chat Attachments

Composable attachment tiles for prompt composers, messages, and tool artifacts. Each item provides its data to preview, metadata, and removal parts.

## When to Use

- Use `AIChat.Attachments` for files or images associated with chat content.
- Use `List` for general file browsing rather than compact attachment tiles.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Attachments.Root>
  {files.map((file) => (
    <AIChat.Attachments.Item key={file.id} attachment={file}>
      <AIChat.Attachments.Preview onClick={() => open(file)} />
      <AIChat.Attachments.Info />
      <AIChat.Attachments.Remove onClick={() => remove(file)} />
    </AIChat.Attachments.Item>
  ))}
</AIChat.Attachments.Root>;
```

### Read-only attachments

```tsx
<AIChat.Attachments.Item attachment={file}>
  <AIChat.Attachments.Preview />
  <AIChat.Attachments.Info>{file.name}</AIChat.Attachments.Info>
</AIChat.Attachments.Item>
```

### Application-owned attachment state

`AIChat.Attachments` renders attachment metadata; it does not open a file picker, read bytes, upload files, or add them to an AI request. Keep the selected data in application state and render the same anatomy in the composer and the submitted user message:

```tsx
import * as React from "react";
import { AIChat, type AttachmentData } from "@glaze/core/components";

const [attachments, setAttachments] = React.useState<AttachmentData[]>([]);

<AIChat.Attachments.Root>
  {attachments.map((attachment) => (
    <AIChat.Attachments.Item key={attachment.id ?? attachment.name} attachment={attachment}>
      <AIChat.Attachments.Preview disabled />
      <AIChat.Attachments.Info />
      <AIChat.Attachments.Remove
        onClick={() => setAttachments((current) => current.filter((item) => item !== attachment))}
      />
    </AIChat.Attachments.Item>
  ))}
</AIChat.Attachments.Root>;
```

When sending images to Glaze AI, separately convert the selected file into a standard AI SDK image content part and pass it in the `messages` array. `AttachmentData.src` is a display URL and is not sent automatically.

## Component API

### AIChat.Attachments.Root

Extends native div props and lays out wrapping tiles.

### AIChat.Attachments.Item

| Prop         | Type             | Default  | Description                                       |
| ------------ | ---------------- | -------- | ------------------------------------------------- |
| `attachment` | `AttachmentData` | required | File/image metadata supplied to descendant parts. |
| `className`  | `string`         | -        | Additional classes.                               |

`AttachmentData` supports `id`, `name`, `src`, `thumbnailSrc`, `width`, `height`, `kind`, and `mimeType`.

### AIChat.Attachments.Preview

Extends native button props. Uses `src`, a larger native-thumbnail slot, or a compact file-icon fallback in that order.

### AIChat.Attachments.Info

Extends native span props. Defaults to the attachment name and may be replaced with custom children.

### AIChat.Attachments.Remove

Extends `Button` props. Defaults to an accessible remove control revealed on hover or focus.

## Design System Rules

### ✅ Do

- Give every attachment a meaningful `name`.
- Keep remove actions reachable by keyboard.
- Supply image dimensions when available so the preview uses an appropriate aspect.

### ❌ Don't

- Store upload or transport state inside these presentation components.
- Use attachment tiles as a general file manager.
- Assume rendering an attachment also includes it in the AI request.
