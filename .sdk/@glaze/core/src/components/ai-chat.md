# AI Chat

The styled, provider-agnostic component family for conversational and agentic interfaces. `AIChat` groups the complete chat anatomy under one explicit namespace while keeping Markdown and code rendering available as general design-system primitives.

## When to Use

- Use `AIChat` when building a prompt composer, conversation transcript, messages, reasoning, tool calls, or task progress.
- Compose `Markdown`, `CodeBlock`, and `InlineCode` inside chat content when needed.
- Use general layout and form primitives when the interface is not conversational.

## Usage Patterns

### Complete streaming text chat

`AIChat` owns presentation only. Use `useGlazeAI()` for the Glaze runtime, keep the transcript in application state, and translate that state into the provider-agnostic message components. An AI-first chat app must also declare the grade it calls:

```json
{
  "glaze": {
    "capabilities": {
      "ai": {
        "grades": ["fast", "smart", "powerful"],
        "purpose": "Answers the user's questions in a conversational interface.",
        "mode": "required"
      }
    }
  }
}
```

The following example includes a correctly centered empty state, conversation history, streaming Markdown, cancellation, blocked-state feedback, message actions, output following, an in-composer model picker, and a measured glass composer footer:

```tsx
import * as React from "react";
import { ChevronDownIcon, CopyIcon } from "lucide-react";
import {
  AIChat,
  Button,
  EmptyState,
  Markdown,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toolbar,
  ToolbarActions,
  ToolbarRow,
} from "@glaze/core/components";
import { useGlazeAI } from "@glaze/core/hooks";

type ChatMessage = {
  id: string;
  from: "user" | "assistant";
  content: string;
};

const BLOCKED_MESSAGE: Record<string, string> = {
  "needs-consent": "AI access wasn't allowed. Try again when you're ready.",
  "signed-out": "Sign in to Glaze to use AI.",
  "needs-subscription": "This chat requires an upgraded Glaze plan.",
  "insufficient-credits": "You're out of Glaze AI credits for now.",
  "daily-limit-reached": "You've reached today's AI limit for this app.",
  "host-unavailable": "Glaze couldn't be reached. Try again.",
  disabled: "AI is currently unavailable for this account.",
};

function getErrorState(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("state" in error)) return undefined;
  return typeof error.state === "string" ? error.state : undefined;
}

export function Chat() {
  const { streamText, state, enableInHost } = useGlazeAI();
  const [prompt, setPrompt] = React.useState("");
  const [model, setModel] = React.useState("fast");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const isStreaming = state === "loading";

  React.useEffect(() => () => abortControllerRef.current?.abort(), []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || isStreaming) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), from: "user", content };
    const responseId = crypto.randomUUID();
    const history = [...messages, userMessage];
    const controller = new AbortController();

    abortControllerRef.current?.abort();
    abortControllerRef.current = controller;
    setPrompt("");
    setMessages([...history, { id: responseId, from: "assistant", content: "" }]);

    try {
      await streamText({
        model,
        messages: history.map((message) => ({ role: message.from, content: message.content })),
        abortSignal: controller.signal,
        onTextDelta: (delta) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === responseId ? { ...message, content: message.content + delta } : message,
            ),
          );
        },
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      if (getErrorState(error) === "host-unavailable") {
        // The hook resumes this stream, using the same onTextDelta, after Glaze grants access.
        await enableInHost();
        return;
      }
      if (!getErrorState(error)) throw error;
      // Other Glaze blocked states are reflected by `state` below.
    }
  }

  function stop() {
    abortControllerRef.current?.abort();
  }

  function startNewChat() {
    stop();
    setMessages([]);
    setPrompt("");
  }

  const header = (
    <Toolbar>
      <ToolbarActions>
        <Button onClick={startNewChat} disabled={messages.length === 0 && !prompt}>
          New Chat
        </Button>
      </ToolbarActions>
    </Toolbar>
  );

  const composer = (
    <Toolbar position="bottom" disableLayoutTransition className="min-h-0 px-2 pb-2 no-drag">
      <ToolbarRow className="h-auto">
        <AIChat.Composer.Root
          onSubmit={(event) => {
            event.preventDefault();
            void send(prompt);
          }}
        >
          <AIChat.Composer.Surface>
            <AIChat.Composer.Row>
              <AIChat.Composer.Input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask anything…"
                disabled={isStreaming}
              />
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
                <AIChat.Composer.Submit
                  action={isStreaming ? "stop" : "send"}
                  onClick={isStreaming ? stop : undefined}
                  disabled={!isStreaming && !prompt.trim()}
                />
              </AIChat.Composer.Actions>
            </AIChat.Composer.Row>
          </AIChat.Composer.Surface>
        </AIChat.Composer.Root>
      </ToolbarRow>
    </Toolbar>
  );

  return (
    <ScrollArea className="h-full" autoScrollToBottom toolbar={header} footer={composer} showScrollToBottomButton>
      <AIChat.Conversation.Content>
        {messages.length === 0 ? (
          <EmptyState placement="viewport" title="New conversation" description="Ask anything to get started." />
        ) : null}
        {messages.map((message, index) => (
          <AIChat.Message.Root key={message.id} from={message.from}>
            <AIChat.Message.Content>
              {message.from === "assistant" ? (
                message.content ? (
                  <Markdown isStreaming={isStreaming && index === messages.length - 1}>{message.content}</Markdown>
                ) : isStreaming && index === messages.length - 1 ? (
                  <AIChat.Reasoning.Root status="streaming">
                    <AIChat.Reasoning.Trigger>Thinking…</AIChat.Reasoning.Trigger>
                  </AIChat.Reasoning.Root>
                ) : null
              ) : (
                message.content
              )}
            </AIChat.Message.Content>
            {message.from === "assistant" && message.content ? (
              <AIChat.Message.Actions>
                <AIChat.Message.Action tooltip="Copy" asChild>
                  <Button
                    type="button"
                    variant="transparent"
                    size="small"
                    iconOnly
                    aria-label="Copy response"
                    onClick={() => void navigator.clipboard.writeText(message.content)}
                  >
                    <CopyIcon aria-hidden />
                  </Button>
                </AIChat.Message.Action>
              </AIChat.Message.Actions>
            ) : null}
          </AIChat.Message.Root>
        ))}

        {BLOCKED_MESSAGE[state] ? (
          <AIChat.Message.Root from="system">
            <AIChat.Message.Content>{BLOCKED_MESSAGE[state]}</AIChat.Message.Content>
          </AIChat.Message.Root>
        ) : null}
        <AIChat.Conversation.Anchor />
      </AIChat.Conversation.Content>
    </ScrollArea>
  );
}
```

For optional AI features, use `"mode": "optional"` instead. Follow the `glaze-ai` skill for the full capability, consent, model-grade, multimodal-input, and blocked-state rules. Do not import `@glaze/core/ai` in renderer code.

### Basic conversation

```tsx
import { AIChat, EmptyState, Markdown, ScrollArea } from "@glaze/core/components";

<ScrollArea autoScrollToBottom showScrollToBottomButton>
  <AIChat.Conversation.Content>
    {messages.length === 0 ? (
      <EmptyState placement="viewport" title="New conversation" description="Ask anything to get started." />
    ) : (
      messages.map((message) => (
        <AIChat.Message.Root key={message.id} from={message.from}>
          <AIChat.Message.Content>
            {message.from === "assistant" ? <Markdown>{message.content}</Markdown> : message.content}
          </AIChat.Message.Content>
        </AIChat.Message.Root>
      ))
    )}
    <AIChat.Conversation.Anchor />
  </AIChat.Conversation.Content>
</ScrollArea>;
```

### Agentic content

```tsx
<AIChat.Reasoning.Root status="streaming">
  <AIChat.Reasoning.Trigger>Thinking</AIChat.Reasoning.Trigger>
  <AIChat.Reasoning.Content>...</AIChat.Reasoning.Content>
</AIChat.Reasoning.Root>

<AIChat.Tool.Root status="running">
  <AIChat.Tool.Trigger>
    <AIChat.Tool.Name>Search files</AIChat.Tool.Name>
  </AIChat.Tool.Trigger>
</AIChat.Tool.Root>
```

Translate runtime `tool-start`, `tool-result`, and error events into provider-agnostic display state, then compose `AIChat.Tool` directly inside the corresponding assistant `AIChat.Message.Root`. Tool activity is part of the transcript; do not render it as a full-width `Callout` above the composer or inside the composer footer. When chat history persists, persist the tool display state with the assistant message so completed calls remain visible after streaming and reloads.

## Component API

| Member                | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `AIChat.Composer`     | Prompt entry, actions, and submit controls.  |
| `AIChat.Attachments`  | Files and images attached to chat content.   |
| `AIChat.Conversation` | Transcript layout; compose in `ScrollArea`.  |
| `AIChat.Message`      | User, assistant, and system message anatomy. |
| `AIChat.Response`     | Long-form assistant typography.              |
| `AIChat.Reasoning`    | Collapsible reasoning and work summaries.    |
| `AIChat.Tool`         | One provider-independent tool invocation.    |
| `AIChat.ToolGroup`    | A collapsible group of related tool calls.   |
| `AIChat.TaskList`     | Status-bearing plan and task items.          |

See each member's companion document for its detailed props and required structure.

## Design System Rules

### ✅ Do

- Import `AIChat` from the general components entrypoint so chat-specific names stay contextual.
- Convert provider events into display state before rendering shared components.
- Compose application behavior around the provided anatomy.
- Use `useGlazeAI()` from `@glaze/core/hooks` for renderer-triggered Glaze AI; `AIChat` itself does not send requests.
- Put a docked composer in the enclosing `ScrollArea`'s measured `footer` rather than manually overlaying it.
- Put a prompt-scoped model picker in a dedicated `AIChat.Composer.Actions` row below the editor, not in the page toolbar, and declare every selectable grade in `glaze.capabilities.ai.grades`.
- Use the standard `px-2 pb-2` bottom-toolbar inset for an edge-to-edge chat; do not mirror the transcript's wider content padding around the composer.

### ❌ Don't

- Import bare chat compounds such as `Message` or `Tool` from the general components entrypoint.
- Put provider objects, transport state, or application orchestration into shared components.
- Treat `AIChat` as a runtime, store, or state-management API.
- Assume visual `AttachmentData` is automatically included in an AI request.
