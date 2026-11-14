---
name: glaze-ai
description: Add AI features to a Glaze app — text generation, summarization, drafting, classification, or any LLM-powered behavior. Use when the user asks for AI, "smart"/"auto"-anything, chat, or generating/summarizing/rewriting text with a model. Covers the mandatory `glaze.capabilities.ai` package.json declaration, backend `generateText`, the `useGlazeAI` renderer hook, and handling every blocked state.
---

# Glaze AI

Glaze owns AI access end to end through the user's Glaze account: consent, subscription, credits, limits, and recovery UI. Apps never collect API keys or recreate those platform flows. There are two ways to call AI; use both if the app has both a backend job and a UI-triggered action.

## Product Flow and Consent

For AI behind a button, form submission, or other explicit action, call AI directly from that action. If access is not ready, Glaze presents the appropriate consent, sign-in, upgrade, or credits UI and returns the result to the app when access is granted.

- Do not add a custom pre-consent screen, confirmation dialog, disclaimer, onboarding step, or disabled "enable AI" state unless the user explicitly asks for that product experience. The user's action is the trigger for Glaze's consent flow.
- Never tell the user to open Glaze manually. If a user-initiated call returns `host-unavailable`, call `enableInHost()` from that same flow; it launches Glaze and requests access for this app. Do not render instructions such as "Open Glaze" or "Open the main app."
- Do not add generic billing copy such as "Uses your Glaze AI credits" near AI controls or in the capability `purpose`. It is persistent UI noise, and Glaze's consent and account surfaces already explain access and credits. Keep `purpose` focused on what data the feature uses and what it produces. State-specific messages such as "You're out of Glaze AI credits" are still appropriate after a request is actually blocked.
- `useGlazeAI()` owns token readiness and safe resumption. Never subscribe to `glaze:ai:tokenReady`, call `retry()` from a token-ready listener, or recreate the consent lifecycle in app code. Duplicate retry wiring can issue overlapping requests and strand the UI in a loading state.

If AI runs automatically on launch or in the background, merely opening the app may trigger Glaze's consent UI. Use automatic AI only when the requested product behavior requires it; do not invent a separate consent experience to mask that behavior.

## Verification Without AI Calls

Do not trigger AI during normal verification, even in development: do not exercise AI controls, call `generate`/`streamText`/`generateImage` from diagnostic snippets or throwaway scripts, or launch an app whose startup automatically calls AI. A general request to build, run, or verify the app is not approval to spend credits or exercise the AI feature.

Verify statically instead: build cleanly, confirm the declared `grades` exactly match the code, exercise only non-AI paths, and inspect existing logs without causing a new request. Run a live AI round-trip only when the user explicitly asks to test the AI behavior or explicitly approves that request.

## Mandatory: Declare the Capability

Every app that imports `@glaze/core/ai` (Way A) or calls `useGlazeAI()` (Way B) **must** declare AI usage in `package.json`, or **publish will reject the app**:

```jsonc
// package.json
{
  "glaze": {
    "capabilities": {
      "ai": {
        "grades": ["fast"],
        "purpose": "Summarizes your pasted meeting notes into action items.",
        "mode": "optional",
      },
    },
  },
}
```

- `grades`: non-empty subset of `"fast" | "smart" | "powerful" | "image-fast" | "image-powerful"` — list only grades the app actually calls.
- `purpose`: honest, user-facing, one sentence. This is shown to the user in the consent dialog — do not write vague copy like "AI features."
- `mode`: `"required"` if the app is unusable without AI, otherwise `"optional"`. Not launch-gated in v1, but must still reflect reality.

**Keep `grades` in sync with the code — this is not auto-derived.** The declaration is read at runtime to gate the consent dialog and is cross-checked at publish. Whenever you change which grades the app calls — adding a model picker, swapping `glaze("fast")` for `glaze("smart")`, adding `glaze.image("image-powerful")`, etc. — update `grades` in the **same** change so it exactly covers every grade the code passes to `glaze(<grade>)` / `glaze.image(<grade>)`. A grade the code calls but the manifest omits fails at runtime: the host rejects the token and shows **no dialog** (the app just sees a stuck "ask again" state), so it looks broken with no error. Never leave a stale grade the code no longer uses, either — an unknown grade (e.g. a removed one) invalidates the whole capability the same way.

## Pick a Grade, Not a Model

Call `glaze("fast")`, `glaze("smart")`, or `glaze("powerful")` — never a raw Claude model id. Grades let Glaze remap the underlying model without an app update.

- Default to `"fast"` for most features (chat replies, summarization, extraction, classification).
- Use `"smart"` only for tasks that need stronger reasoning (multi-step analysis, nuanced writing).
- Use `"powerful"` sparingly — it is the most expensive against the user's caps/credits.
- `"image-fast"` and `"image-powerful"` are the grades for image generation via `glaze.image(<grade>)` (see Way C below). Include one only if the app actually calls `glaze.image()` with it. Default to `"image-fast"`; use `"image-powerful"` only when output quality is the point of the feature (wallpapers, printable art) — it is ~4× more expensive against the user's credits.

## Way A: Backend (`generateText`)

Use this for AI work that starts from backend logic (scheduled jobs, IPC handlers, processing pipelines) with no UI-driven trigger.

```typescript
// main/services/summarize.ts
import { generateText, glaze, GlazeAIError } from "@glaze/core/ai";

export async function summarizeNotes(notes: string): Promise<{ text: string } | { blocked: string }> {
  try {
    const { text } = await generateText({
      model: glaze("fast"),
      prompt: `Summarize these meeting notes into action items:\n\n${notes}`,
    });
    return { text };
  } catch (error) {
    if (error instanceof GlazeAIError) {
      // error.state: "needs-consent" | "signed-out" | "needs-subscription" | "insufficient-credits"
      //            | "daily-limit-reached" | "host-unavailable" | "disabled"
      return { blocked: error.state };
    }
    throw error;
  }
}
```

`generateText`, `streamText`, `generateObject`, `streamObject`, `tool`, `stepCountIs`, and `z`/`zod` are all re-exported from `@glaze/core/ai` (pinned Vercel AI SDK) — use them the same way you would with any AI-SDK-compatible provider, just pass `glaze(<grade>)` as `model`.

### Vision / Image Input (Multimodal)

`glaze(<grade>)` is a full AI-SDK model provider — Glaze owns account, consent, credits, grade routing, and recovery on top of it, but it implements the standard `@ai-sdk/anthropic` model interface, so **standard AI-SDK multimodal content parts pass straight through to Claude — vision works out of the box.** Do not implement a text-only workaround (OCR, describing the image separately, a "paste text instead" fallback) for image understanding; use the `messages` array with mixed `text` and `image` parts instead of a plain `prompt` string:

```typescript
import { generateText, glaze } from "@glaze/core/ai";

const { text } = await generateText({
  model: glaze("fast"),
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this screenshot? List any error messages." },
        { type: "image", image: screenshotBytes }, // Uint8Array, base64 string, data: URL, or ArrayBuffer
      ],
    },
  ],
});
```

- `image` accepts a `Uint8Array`/`ArrayBuffer`, a base64 string, or a `data:` URL — same as any AI-SDK image part. Read local files into bytes in backend code; a plain `https://` URL is passed to the model as a URL, so download it yourself if the proxy can't reach it.
- This works everywhere a `messages` array does: Way A (`generateText`/`streamText`) and Way B's `useGlazeAI().generate`/`streamText` (both accept `messages`).
- **Vision uses the same `fast`/`smart`/`powerful` grades — there is no separate "vision" grade.** Keep `grades: ["fast"]` (or whichever text grade you already call); do not add a new grade to the capability manifest just because the app sends images.

Note this is image **input** (understanding an existing image). Generating a **new** image is Way C below (`glaze.image()`), which is a different grade family.

Surface the blocked result to the renderer over IPC (see `glaze-ipc-communication`) and render a short per-state message there, same as Way B — do not show a raw error string or throw an unhandled exception across the IPC boundary.

## Way B: UI-Triggered (`useGlazeAI`)

Use this when a renderer action (button click, form submit) should call AI directly without a bespoke backend handler.

For a conversational interface, also invoke `glaze-component-patterns` and use the `AIChat` family instead of hand-rolling the transcript or composer. Start with `ai-chat.md` for the complete `useGlazeAI` streaming-chat recipe, then read the task-relevant companion docs such as `composer.md`, `conversation.md`, `message.md`, `attachments.md`, and `markdown.md` through `GetComponentDocs` when available; otherwise read them directly from `../../.sdk/@glaze/core/src/components/`. The chat components own presentation only; this skill's capability, streaming, cancellation, consent, and blocked-state rules still apply.

When the transcript has no messages, render the general `<EmptyState placement="viewport" />` inside `AIChat.Conversation.Content`. This placement accounts for the enclosing `ScrollArea`'s measured toolbar and composer footer; do not recreate chat empty states with padded flex containers, arbitrary vertical spacing, or custom transforms. Keep the default `placement="center"` for smaller positioned sections that should center within their own bounds.

Reuse the view's existing `ScrollArea` as the conversation's single scroll owner. Render `AIChat.Conversation.Content` inside it, enable `autoScrollToBottom`, pass the top `<Toolbar>` through `toolbar={...}`, and pass the docked composer toolbar through `footer={...}`. Use `showScrollToBottomButton` for the standard affordance. Do not add a conversation-specific or nested scroll area, and never render the toolbar or composer as siblings of the scroll owner; sibling chrome hard-clips messages instead of letting them scroll beneath progressive blur. `AIChat.Conversation.Root` is only for app-owned virtualized feeds with controlled `isAtBottom` and `onScrollToBottom` behavior.

When a chat lets the user choose a grade, give the editor a full-width `AIChat.Composer.Row`, then put a small filled `Select` with `shape="pill"` in a second `AIChat.Composer.Actions` row alongside submit. The filled pill trigger provides the compact rounded subtle-control treatment; use a single down chevron and compact one-line options, not the settings-style up/down indicator or explanatory sublabels. Adjacent icon buttons that should share its tint use `variant="muted"`. The choice affects the current prompt and does not belong in the page toolbar. Declare every selectable grade in `glaze.capabilities.ai.grades`. For an edge-to-edge chat footer, follow `conversation.md` and use the standard `px-2 pb-2` bottom-toolbar inset rather than copying the transcript's wider content padding.

For tool-enabled chats, request `tool.md` and translate runtime tool events into provider-agnostic display state rendered with `AIChat.Tool` inside the corresponding assistant message. Upsert start and result events by stable tool-call ID so one row moves from `running` to `success` or `error`; never append a second result row. If several related invocations would otherwise render as indistinguishable summary-only rows, aggregate their display state or use `AIChat.ToolGroup`. Tool progress belongs to the transcript, not in a composer-footer `Callout`. If the app persists messages, persist each tool's display name and status with its assistant message so completed tool calls do not disappear after streaming or reloads. Reserve footer callouts for actionable blocked or error states.

While an assistant message is waiting for its first visible text, render a summary-only `<AIChat.Reasoning.Root status="streaming">` with an `AIChat.Reasoning.Trigger` instead of plain `Text`. The shared trigger supplies the shimmer and hides the disclosure affordance when there is no reasoning content. For concrete tool calls, put the activity label in `AIChat.Tool.Name` and set the root to `pending` or `running`; the shared name supplies the corresponding shimmer.

Drive the visible output through `streamText`'s `onTextDelta`, not the return value of a one-shot `generate()`. When a first attempt is blocked (e.g. `host-unavailable`) and Glaze later mints a token, the hook automatically resumes the request — and that resume replays deltas through the same `onTextDelta`, so the UI fills in. A one-shot `generate()`'s auto-resumed result is not redelivered to the promise you originally awaited, so a `setSummary(await generate(...))` pattern would finish successfully yet leave the UI empty after a recovery.

Never import `@glaze/core/ai` in renderer code — it is a backend-only entrypoint: the renderer import map does not expose it, and the hook throws its own bundled `GlazeAIError`, so an `instanceof` check against that import never matches. In renderer catch blocks, match blocked states on the error's `state` field instead:

```tsx
// renderer/components/summarize-button.tsx
import { useEffect, useRef, useState } from "react";
import { useGlazeAI } from "@glaze/core/hooks";
import { Button, Text } from "@glaze/core/components";

const BLOCKED_MESSAGE: Record<string, string> = {
  "needs-consent": "AI access wasn't allowed. Try again when you're ready.",
  "signed-out": "Sign in to Glaze to use AI.",
  "needs-subscription": "This needs an upgraded Glaze plan. Try again to see options.",
  "insufficient-credits": "You're out of Glaze AI credits for now.",
  "daily-limit-reached": "You've reached today's AI limit for this app.",
  "host-unavailable": "Glaze couldn't be reached. Try again.",
  disabled: "AI is currently unavailable for this account.",
};

export function SummarizeButton({ notes }: { notes: string }) {
  const { streamText, state, enableInHost } = useGlazeAI();
  const [summary, setSummary] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop spending credits if this component unmounts mid-stream.
  useEffect(() => () => abortControllerRef.current?.abort(), []);

  async function handleClick() {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setSummary("");

    try {
      await streamText({
        model: "fast",
        prompt: `Summarize:\n\n${notes}`,
        abortSignal: controller.signal,
        // Runs on the first attempt and on the hook's automatic post-consent
        // resume, so the summary appears even after a blocked first attempt.
        onTextDelta: (delta) => setSummary((current) => current + delta),
      });
    } catch (error) {
      if (error instanceof Error && "state" in error && error.state === "host-unavailable") {
        // Continue the user's request without asking them to open Glaze manually.
        // The hook resumes the stream once Glaze mints a token.
        await enableInHost();
      }
      // Other blocked states are already reflected in `state`/`error` by the hook.
    }
  }

  return (
    <>
      <Button onClick={handleClick} disabled={state === "loading"}>
        {state === "loading" ? "Summarizing…" : "Summarize"}
      </Button>
      {BLOCKED_MESSAGE[state] && (
        <Text variant="small" color="secondary">
          {BLOCKED_MESSAGE[state]}
        </Text>
      )}
      {summary && <p>{summary}</p>}
    </>
  );
}
```

Give longer-running generations a visible Stop action, pass an `AbortSignal`, and set a fit-for-purpose `maxOutputTokens` bound when the output has a natural limit. Cancellation is forwarded to the model immediately, although already-generated in-flight tokens may still be billed:

```tsx
const { streamText, state } = useGlazeAI();
const [answer, setAnswer] = useState("");
const abortControllerRef = useRef<AbortController | null>(null);

async function handleAsk(prompt: string) {
  abortControllerRef.current?.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;
  setAnswer("");

  try {
    await streamText({
      model: "fast",
      prompt,
      maxOutputTokens: 500,
      abortSignal: controller.signal,
      onTextDelta: (delta) => setAnswer((current) => current + delta),
    });
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
  }
}

function handleStop() {
  abortControllerRef.current?.abort();
}

// Render beside the streaming output:
<Button onClick={handleStop} disabled={state !== "loading"}>
  Stop
</Button>;
```

Abort the in-flight request when its component unmounts (e.g. `useEffect(() => () => abortControllerRef.current?.abort(), [])`) — an abandoned stream keeps spending the user's credits until it finishes on its own.

**Existing apps: check the preload first.** `streamText` needs the cancellable `glaze.ipc.stream` bridge in `renderer/preload.ts`. Apps scaffolded before streaming may have no `stream`; an older wrapper may lack clone-safe cancellation. Never pass an `AbortSignal` through the exposed preload API — it cannot cross that boundary. Ensure the `glaze.ipc` object exposes these string-only cancellation wrappers next to `invoke`:

```ts
stream: <TChunk = unknown, TResult = unknown>(
  channel: string,
  args: unknown,
  onChunk: (chunk: TChunk) => void,
  options?: { cancellationId?: string },
): Promise<TResult> => ipcRenderer.stream(channel, args, onChunk, options),
cancelStream: (cancellationId: string): void => ipcRenderer.cancelStream(cancellationId),
```

`useGlazeAI()` returns:

- `generate(opts)` — `opts.model` is `"fast" | "smart" | "powerful"`, plus `prompt`, `system`, `messages`, `maxOutputTokens`. Exact model ids remain API-compatible, but app code should use grades. Runs in the app's main process over IPC and returns `{ text, usage? }`.
- `streamText(opts)` — streams text through `opts.onTextDelta` and resolves with the same `{ text, usage? }` result. Pass `opts.abortSignal` and abort it when the user cancels or replaces the request.
- `permissionState` — `"checking" | "granted" | "not-granted" | "unknown"`. The hook checks once on mount without generating content, spending credits, launching Glaze, or showing consent/account UI. `"granted"` means active consent covers every grade currently declared by the app; it does not guarantee that sign-in, credits, subscription, or daily limits will allow the next request.
- `refreshPermissionState()` — re-checks the same passive consent state, e.g. when revisiting an explicitly requested onboarding permission step. It never prompts; the actual AI action still owns consent and account recovery UI.
- `state` — `"idle" | "loading" | "ready"` or a `GlazeAIErrorState` when blocked.
- `error` — the `GlazeAIError` (or raw `Error` for non-Glaze failures) backing a blocked/failed state.
- `reset()` — clears a blocked/failed state back to idle, e.g. before a manual retry.
- `retry()` — manually re-runs the most recent generation request. Call it only from an explicit user action; never wire it to `tokenReady` or an automatic blocked-state effect.
- `openLimits()` — opens this app's AI Permissions settings; useful after `daily-limit-reached`.
- `enableInHost()` — deep-links into Glaze's consent flow; call it after `host-unavailable` from the same user-initiated handler (it cold-launches Glaze when needed).
- `upgradeInHost()` — deep-links into Glaze's upgrade flow; rarely needed (see below).

When the product explicitly includes an onboarding permission row, drive it from `permissionState` instead of spending credits on a probe generation:

```tsx
const { permissionState } = useGlazeAI();

const aiEnabled = permissionState === "granted";

<Button disabled={permissionState === "checking"} onClick={handleEnableAI}>
  {permissionState === "checking" ? "Checking…" : aiEnabled ? "Enabled" : "Enable"}
</Button>;
```

Call `refreshPermissionState()` when the user returns to a step that may have remained mounted while consent changed elsewhere; the initial mount is already checked automatically.

`"unknown"` means the host could not answer authoritatively (for example it is closed, signed out, or temporarily unreachable). Do not treat it as granted. Keep the Enable action available so its real AI request can run the normal Glaze-owned recovery flow.

**Blocked states need no custom consent UI or lifecycle wiring.** Glaze shows its own consent/upsell dialog whenever the user's action needs it, and re-shows it on every fresh attempt — including after a decline. When Glaze later issues a token, the hook clears the blocked state and automatically re-runs the most recent request when possible. Never subscribe to `glaze:ai:tokenReady` and never retry the request yourself from a token event — the hook already auto-resumes, and a second caller-side retry double-fires the request and interleaves stream output into the UI. For a `streamText` call this resume replays deltas through your original `onTextDelta`, so drive any UI-visible output through `onTextDelta` (as in the example above) and it fills in automatically once access is granted. A one-shot `generate()`'s auto-resumed result is **not** redelivered to the promise you awaited — so a UI feature that must show its output after a recovery should stream rather than assign `await generate(...)` straight to state. Render a short inline message per state (as in the example above) only when the request remains blocked, so the user knows why it produced no output; never show a raw error string. For `host-unavailable`, call `enableInHost()` from the original user action rather than asking the user to open Glaze or adding a separate pre-consent step.

## Way C: Image Generation (`generateImage` + `glaze.image()`)

Use this for backend image generation (icons, illustrations, generated art). There is no renderer-facing hook yet — call it from backend code (a handler, a scheduled job) and return the result to the renderer over IPC, same as Way A.

```typescript
// main/services/generate-icon.ts
import { generateImage, glaze, GlazeAIError } from "@glaze/core/ai";

export async function generateIcon(prompt: string): Promise<{ base64: string } | { blocked: string }> {
  try {
    const { image } = await generateImage({
      model: glaze.image("image-fast"),
      prompt,
    });
    return { base64: image.base64 };
  } catch (error) {
    if (error instanceof GlazeAIError) {
      return { blocked: error.state };
    }
    throw error;
  }
}
```

`glaze.image(<grade>)` requires a grade — `"image-fast"` (quick, cost-efficient; the right default) or `"image-powerful"` (highest quality, ~4× the cost) — and resolves it through the server's model catalog; apps never name a concrete image model. It is backed by Gemini (via the gemini-proxy's `:generateContent` endpoint), matching main-app's own icon generator — not OpenAI/Anthropic. It throws the same `GlazeAIError` states as `glaze(<grade>)`, so handle them the same way (surface `error.state` to the renderer and show the matching per-state message, as in Way B).

**Image inputs (editing / variations):** pass the object prompt form to edit or restyle an existing image — `images` accepts bytes (`Uint8Array`), base64 strings, or `data:` URLs:

```typescript
const { image } = await generateImage({
  model: glaze.image("image-fast"),
  prompt: { text: "Make the sky a warm sunset orange", images: [screenshotBytes] },
});
```

Input images count toward the request's input tokens (larger inputs = more credits per call). Plain `https://` URLs are not fetched on the app's behalf and **throw** — download the image in app code and pass its bytes. Passing a `mask` also throws (no inpainting support); describe the region to edit in the prompt text instead.

**Image editing apps: keep image bytes off IPC.** Returning `image.base64` over IPC is acceptable only for a single ephemeral preview. An editing app's loop (pick image → edit → iterate, with history) moves 1–2 MB per image, so pass **paths and URLs** over IPC instead — the bytes stay in the backend:

```typescript
// main/handlers/edit-image.ts — renderer sends { inputPath, prompt }, gets { resultUrl }
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { app } from "@glaze/core/backend";
import { generateImage, glaze, GlazeAIError } from "@glaze/core/ai";

export async function editImage(
  inputPath: string,
  prompt: string,
): Promise<{ resultUrl: string } | { blocked: string }> {
  try {
    const bytes = await fs.readFile(inputPath); // path from dialog.showOpenDialog / webUtils.getPathForFile
    const { image } = await generateImage({
      model: glaze.image("image-fast"),
      prompt: { text: prompt, images: [bytes] },
    });
    const editsDir = path.join(app.getPath("userData"), "edits");
    await fs.mkdir(editsDir, { recursive: true });
    const outPath = path.join(editsDir, `edit-${Date.now()}.png`);
    await fs.writeFile(outPath, image.uint8Array);
    return { resultUrl: `glaze-file://${path.basename(outPath)}` };
  } catch (error) {
    if (error instanceof GlazeAIError) return { blocked: error.state };
    throw error;
  }
}
```

The renderer renders `<img src={resultUrl}>`, served by the app's custom protocol handler (see `glaze-protocol-large-files` for registration and safe path handling — restrict the handler to the `edits` directory). Input paths come from the file picker or drag-and-drop, never from uploading bytes through IPC. Edit history and undo fall out as files on disk.

## Mandatory: Handle Every Blocked State

Never let an AI feature strand the user on a raw thrown error or an unhandled promise rejection. Every call site that can produce a `GlazeAIError` must render (or forward to a renderer that renders) a per-state message — the `BLOCKED_MESSAGE` map in Way B is the pattern — for all seven states: `needs-consent`, `signed-out`, `needs-subscription`, `insufficient-credits`, `daily-limit-reached`, `host-unavailable`, `disabled`. If Way A's backend call fails, propagate `error.state` to the renderer rather than swallowing it or logging-and-continuing.

Non-`GlazeAIError` failures (network errors, model timeouts) are ordinary AI SDK errors — handle them with normal loading/error UI, not a blocked-state message.
