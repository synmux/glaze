# Textarea

A multi-line text input that auto-grows to fit its content. Uses the native CSS `field-sizing-content` property for resizing (no JavaScript), so it expands as the user types and stops growing at a built-in `max-h-32` cap. Reach for it whenever a single-line input isn't enough.

## When to Use

- **Multi-line input**: descriptions, comments, feedback, or any free-form longer text in a form.
- **Message composition**: chat or messaging input areas.
- Use a single-line `Input` instead when the value is short and known to fit on one line.

## Usage Patterns

### Basic

Auto-grows by default — no configuration needed.

```tsx
<Textarea placeholder="Type something…" />
```

### Sizes

```tsx
<Textarea size="small" placeholder="Small" />
<Textarea size="medium" placeholder="Medium" />
<Textarea size="large" placeholder="Large" />
```

### Controlled

```tsx
const [text, setText] = useState("");

<Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your application…" />;
```

### Submit on Enter

Submit on Enter, allow Shift+Enter for a newline. Guard against IME composition so CJK users don't submit while composing.

```tsx
import { isUsingInputMethodEditor } from "@renderer/utils/keyboard-events";

<Textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (isUsingInputMethodEditor(e.nativeEvent)) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }}
  placeholder="Press Enter to send, Shift+Enter for a new line"
/>;
```

### Chat input with overlaid actions

Position send/attach buttons over the textarea with absolute positioning; pad the textarea to clear them.

```tsx
<form className="relative">
  <Textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type a message…"
    className="pr-20"
  />
  <div className="absolute bottom-1 right-1 flex gap-1">
    <Button iconOnly variant="transparent" size="small" type="submit">
      <ArrowUpIcon className="w-4 h-4" />
    </Button>
  </div>
</form>
```

## Component API

### Textarea

Extends all native `<textarea>` attributes (`value`, `defaultValue`, `onChange`, `placeholder`, `disabled`, `rows`, …) plus:

| Prop        | Type                             | Default    | Description                       |
| ----------- | -------------------------------- | ---------- | --------------------------------- |
| `size`      | `"small" \| "medium" \| "large"` | `"medium"` | Min-height and horizontal padding |
| `className` | `string`                         | -          | Additional CSS classes            |

### Sizes

| Size     | Min height | Padding |
| -------- | ---------- | ------- |
| `small`  | `min-h-14` | `px-2`  |
| `medium` | `min-h-14` | `px-3`  |
| `large`  | `min-h-18` | `px-3`  |

The base styles also apply `w-full`, `resize-none`, `field-sizing-content`, `max-h-32`, `rounded-control`, and `border-field` (focus `border-foreground-40`, invalid `border-support-red/40`). Override any of these via `className`.

## Design System Rules

### ✅ Do

- Rely on the default auto-grow behavior for most cases.
- Use the `size` prop to control min-height and padding.
- Handle Shift+Enter and IME composition when implementing submit-on-Enter.

### ❌ Don't

- Apply the `resize` CSS property — it conflicts with auto-grow (`resize-none` is set by default).
- Set background-color via `className` to fake a different field style; keep the field token styling.
