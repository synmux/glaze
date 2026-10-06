# AI Chat Composer

A polished, composable prompt form for AI chat and other conversational interfaces. `AIChat.Composer.Surface` provides the default glass treatment while every control and layout decision remains at the call site.

## When to Use

- Use `AIChat.Composer` for message and prompt entry with configurable actions.
- Use `AIChat.Composer.Input` for a native textarea; use `AIChat.Composer.Control asChild` for Tiptap or another editor.
- Use a normal form and `Textarea` when chat-specific layout and submit behavior are unnecessary.

## Usage Patterns

### Basic

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    <AIChat.Composer.Row>
      <AIChat.Composer.Input placeholder="Ask anything…" />
      <AIChat.Composer.Actions>
        <AIChat.Composer.Submit />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
</AIChat.Composer.Root>;
```

### Trailing controls and attachments

Put the input first when every control belongs on the trailing edge. `Composer.Row` keeps the controls beside a single-line input and gives a multiline input the available width. Standard trailing controls should use transparent buttons; `Composer.Submit` supplies its own accent treatment.

```tsx
import { PaperclipIcon } from "lucide-react";
import { AIChat, Button } from "@glaze/core/components";

<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    {attachment ? (
      <AIChat.Attachments.Root>
        <AIChat.Attachments.Item attachment={attachment}>
          <AIChat.Attachments.Preview disabled />
          <AIChat.Attachments.Info />
          <AIChat.Attachments.Remove onClick={removeAttachment} />
        </AIChat.Attachments.Item>
      </AIChat.Attachments.Root>
    ) : null}

    <AIChat.Composer.Row>
      <AIChat.Composer.Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
      <AIChat.Composer.Actions>
        <Button
          type="button"
          variant="transparent"
          size="small"
          iconOnly
          aria-label="Attach file"
          onClick={chooseAttachment}
        >
          <PaperclipIcon aria-hidden />
        </Button>
        <AIChat.Composer.Submit disabled={!prompt.trim() && !attachment} />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
</AIChat.Composer.Root>;
```

### Stacked editor and action row

Use two rows when the editor should always occupy the full width. The second row automatically keeps its final action group on the trailing edge. Use muted buttons for visible secondary actions on this row.

```tsx
import { PaperclipIcon } from "lucide-react";
import { AIChat, Button } from "@glaze/core/components";

<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    <AIChat.Composer.Row>
      <AIChat.Composer.Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
    </AIChat.Composer.Row>
    <AIChat.Composer.Row>
      <AIChat.Composer.Actions>
        <Button type="button" variant="muted" size="small" iconOnly aria-label="Attach file">
          <PaperclipIcon aria-hidden />
        </Button>
      </AIChat.Composer.Actions>
      <AIChat.Composer.Actions>
        <AIChat.Composer.Submit disabled={!prompt.trim()} />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
</AIChat.Composer.Root>;
```

### Model picker inside the composer

A model or grade changes how the current prompt is sent, so keep its picker inside `Composer.Actions` instead of the page toolbar. Give the editor its own full-width row, then place the compact model picker and submit button in an action row below it. Use the small filled trigger so the picker reads as a rounded subtle control on the composer surface. A single down chevron keeps the menu affordance lightweight. Adjacent icon buttons should use `variant="muted"` when they need the same tint.

```tsx
import { ChevronDownIcon } from "lucide-react";
import { AIChat, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@glaze/core/components";

<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    <AIChat.Composer.Row>
      <AIChat.Composer.Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
    </AIChat.Composer.Row>

    <AIChat.Composer.Row>
      <AIChat.Composer.Actions>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger variant="filled" size="small" shape="pill" hideChevron aria-label="Choose model">
            <SelectValue placeholder="Model" />
            <ChevronDownIcon aria-hidden className="size-3 text-tertiary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast" icon="hare.fill">
              Fast
            </SelectItem>
            <SelectItem value="smart" icon="sparkles">
              Smart
            </SelectItem>
            <SelectItem value="powerful" icon="bolt.fill">
              Powerful
            </SelectItem>
          </SelectContent>
        </Select>
      </AIChat.Composer.Actions>
      <AIChat.Composer.Actions>
        <AIChat.Composer.Submit disabled={!prompt.trim()} />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
</AIChat.Composer.Root>;
```

### Secondary footer

`Composer.Footer` is outside the glass surface. Use it for keyboard hints or passive secondary status. Controls that affect the current prompt, such as a model picker or context toggle, belong inside `Composer.Surface`.

```tsx
import { AIChat } from "@glaze/core/components";

<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    <AIChat.Composer.Row>
      <AIChat.Composer.Input
        submitOn="command-enter"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />
      <AIChat.Composer.Actions>
        <AIChat.Composer.Submit disabled={!prompt.trim()} />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
  <AIChat.Composer.Footer>
    <span className="text-small text-tertiary">⌘ Return to send</span>
  </AIChat.Composer.Footer>
</AIChat.Composer.Root>;
```

### Custom surface

```tsx
<AIChat.Composer.Surface className="bg-well [&>[data-slot=composer-surface-glass]]:hidden">...</AIChat.Composer.Surface>
```

### Custom editor and actions

```tsx
<AIChat.Composer.Root onSubmit={handleSubmit}>
  <AIChat.Composer.Surface>
    <AIChat.Composer.Row>
      <AIChat.Composer.Actions>
        <AttachButton />
      </AIChat.Composer.Actions>
      <AIChat.Composer.Control asChild>
        <CustomEditor />
      </AIChat.Composer.Control>
      <AIChat.Composer.Actions>
        <AIChat.Composer.Submit action={running ? "stop" : "send"} />
      </AIChat.Composer.Actions>
    </AIChat.Composer.Row>
  </AIChat.Composer.Surface>
  <AIChat.Composer.Footer>Optional status</AIChat.Composer.Footer>
</AIChat.Composer.Root>
```

## Component API

### AIChat.Composer.Root

Extends native form props and forwards its ref to the `<form>`.

### AIChat.Composer.Surface

The default glass surface isolates the native material in a non-interactive background layer. It supplies the standard inset and spacing between direct attachment, row, and custom-content children.

| Prop        | Type     | Default | Description                                  |
| ----------- | -------- | ------- | -------------------------------------------- |
| `className` | `string` | -       | Additional layout or custom surface classes. |

### AIChat.Composer.Row

Extends native div props. Provides a wrapping, bottom-aligned flex row. A final action group aligns to the trailing edge automatically. Multiline native inputs take a full row when leading controls are present and remain beside trailing-only controls.

### AIChat.Composer.Actions

Extends native div props. Groups leading or trailing controls.

### AIChat.Composer.Control

| Prop        | Type      | Default | Description                          |
| ----------- | --------- | ------- | ------------------------------------ |
| `asChild`   | `boolean` | `false` | Merge control layout onto one child. |
| `className` | `string`  | -       | Additional classes.                  |

### AIChat.Composer.Input

Extends `Textarea` props, starts at the small-button row height, grows with its content, and fills the available space when placed directly in `AIChat.Composer.Row`. The row owns horizontal spacing between the input and adjacent actions.

| Prop       | Type                                     | Default   | Description                            |
| ---------- | ---------------------------------------- | --------- | -------------------------------------- |
| `submitOn` | `"enter" \| "command-enter" \| "manual"` | `"enter"` | IME-safe keyboard submission behavior. |

### AIChat.Composer.Submit

Extends `Button` props except `children` remains optional.

| Prop       | Type               | Default             | Description                                        |
| ---------- | ------------------ | ------------------- | -------------------------------------------------- |
| `action`   | `"send" \| "stop"` | `"send"`            | Controls the default icon, label, and button type. |
| `children` | `ReactNode`        | default action icon | Custom button content.                             |

### AIChat.Composer.Footer

Extends native div props. Provides an optional secondary row below the surface and aligns a final action group to the trailing edge.

## Design System Rules

### ✅ Do

- Keep application state and submission decisions outside `AIChat.Composer`.
- Use the glass surface as the default chat treatment.
- Pass an explicit `action` when switching between send and stop.
- Put model selection and other prompt-scoped controls in a dedicated action row below the editor; reserve the page toolbar for conversation-wide actions such as starting a new chat, search, or export.
- Prefer the documented row arrangements before adding spacing, order, width, or alignment classes. The compound components provide their single-line, multiline, attachment, and trailing-action layout by default.

### ❌ Don't

- Assume a busy state always means the button should stop; queue and steer behaviors belong to the app.
- Nest another form inside `AIChat.Composer.Root`.
- Add feature-specific controls as Composer props; compose them as children.
