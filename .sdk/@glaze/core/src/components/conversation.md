# AI Chat Conversation

Styled transcript layout primitives for chat messages. Scrolling belongs to the general Glaze `ScrollArea`, so an existing scrollable view can become a chat without replacing its scroll owner.

## When to Use

- Put `AIChat.Conversation.Content` directly inside the view's existing `ScrollArea`.
- Use `ScrollArea`'s `autoScrollToBottom`, `toolbar`, `footer`, and `showScrollToBottomButton` props for ordinary chats.
- Use controlled `AIChat.Conversation.Root` only when an app-owned virtualizer already owns scrolling.

## Usage Patterns

### Managed transcript

```tsx
import { AIChat, ScrollArea } from "@glaze/core/components";

<ScrollArea autoScrollToBottom showScrollToBottomButton>
  <AIChat.Conversation.Content>
    {messages}
    <AIChat.Conversation.Anchor />
  </AIChat.Conversation.Content>
</ScrollArea>;
```

`autoScrollToBottom` follows new output only while the reader remains at the bottom. Set `autoScrollBehavior="smooth"` when animated following is appropriate.

### Empty conversation

Use the general `EmptyState` component with `placement="viewport"` when the transcript has no messages. This centers between the enclosing `ScrollArea`'s measured toolbar and footer, and keeps adjusting when a composer grows. The ordinary `placement="center"` remains appropriate for smaller positioned sections.

```tsx
import { AIChat, EmptyState, ScrollArea } from "@glaze/core/components";

<ScrollArea autoScrollToBottom footer={composer} showScrollToBottomButton>
  <AIChat.Conversation.Content>
    {messages.length === 0 ? (
      <EmptyState placement="viewport" title="New conversation" description="Ask anything to get started." />
    ) : (
      messages
    )}
    <AIChat.Conversation.Anchor />
  </AIChat.Conversation.Content>
</ScrollArea>;
```

### Transcript with page chrome

Pass both page chrome elements through the same `ScrollArea`'s measured slots. Messages then scroll beneath the toolbar and composer's progressive blur instead of being hard-clipped at sibling boundaries, and the built-in scroll button stays above a growing composer.

```tsx
import { AIChat, Button, ScrollArea, Toolbar, ToolbarActions, ToolbarRow } from "@glaze/core/components";

const header = (
  <Toolbar>
    <ToolbarActions>
      <Button onClick={startNewChat}>New Chat</Button>
    </ToolbarActions>
  </Toolbar>
);

const composer = (
  <Toolbar position="bottom" disableLayoutTransition className="min-h-0 px-2 pb-2 no-drag">
    <ToolbarRow className="h-auto">
      <AIChat.Composer.Root onSubmit={handleSubmit}>
        <AIChat.Composer.Surface>
          <AIChat.Composer.Row>
            <AIChat.Composer.Input value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <AIChat.Composer.Actions>
              <AIChat.Composer.Submit disabled={!prompt.trim()} />
            </AIChat.Composer.Actions>
          </AIChat.Composer.Row>
        </AIChat.Composer.Surface>
      </AIChat.Composer.Root>
    </ToolbarRow>
  </Toolbar>
);

<ScrollArea className="h-full" autoScrollToBottom toolbar={header} footer={composer} showScrollToBottomButton>
  <AIChat.Conversation.Content>
    {messages}
    <AIChat.Conversation.Anchor />
  </AIChat.Conversation.Content>
</ScrollArea>;
```

For an edge-to-edge chat, keep the bottom toolbar at the standard `px-2 pb-2` inset. The transcript can use wider content padding for readability, but copying that padding onto the composer makes the bottom chrome look detached from the window edges.

### Add chat to an existing scrollable view

Keep the existing scroll owner and add the chat behavior it needs:

```tsx
<ScrollArea {...existingScrollAreaProps} autoScrollToBottom footer={composer} showScrollToBottomButton>
  {existingContent}
  <AIChat.Conversation.Content>{messages}</AIChat.Conversation.Content>
</ScrollArea>
```

### Controlled virtualized transcript

`Conversation.Root` and `Conversation.ScrollToBottom` are an escape hatch for a virtualizer that owns its own viewport and bottom detection:

```tsx
<AIChat.Conversation.Root isAtBottom={isAtBottom} onScrollToBottom={scrollToBottom}>
  <VirtualizedMessages />
  <AIChat.Conversation.ScrollToBottom />
</AIChat.Conversation.Root>
```

## Component API

### AIChat.Conversation.Content

Extends native div props and supplies the default transcript width, spacing, and padding. It does not create a scroll container.

### AIChat.Conversation.Anchor

Extends native div props and marks the end of the transcript. Inside a controlled `Conversation.Root`, it also provides the non-virtualized fallback target for `Conversation.ScrollToBottom`.

### AIChat.Conversation.Root

An optional state boundary for an externally controlled or virtualized feed. It does not create a scroll container.

| Prop               | Type         | Default | Description                 |
| ------------------ | ------------ | ------- | --------------------------- |
| `isAtBottom`       | `boolean`    | `true`  | Controlled bottom state.    |
| `onScrollToBottom` | `() => void` | -       | Controlled scroll action.   |
| `className`        | `string`     | -       | Additional wrapper classes. |

### AIChat.Conversation.ScrollToBottom

Extends `Button` props. Use it inside controlled `Conversation.Root`; ordinary chats should use `ScrollArea`'s `showScrollToBottomButton` prop.

## Design System Rules

### ✅ Do

- Reuse the view's existing `ScrollArea` when adding a chat transcript.
- Enable `autoScrollToBottom` to preserve manual scroll position while following new output at the bottom.
- Pass a docked composer as the `ScrollArea`'s `footer` so underlap, progressive blur, and live composer height are coordinated.
- Pass the page toolbar as the same `ScrollArea`'s `toolbar` so messages scroll beneath its progressive blur.
- Render `<EmptyState placement="viewport" />` inside `AIChat.Conversation.Content` when the transcript is empty.
- Use controlled `Conversation.Root` only for virtualized or otherwise app-owned scrolling.

### ❌ Don't

- Add a second scroll area just because a view gains chat messages.
- Render the page toolbar or docked composer as siblings of the transcript's `ScrollArea`; that creates a hard clipping boundary.
- Force-scroll on every streamed token after the user has scrolled upward.
- Position a composer over the transcript manually when the `ScrollArea`'s measured footer can own it.
- Center empty copy with arbitrary padding, margins, or transforms.
