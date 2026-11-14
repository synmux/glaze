---
name: ollama-api
description: >-
  Build against, query, or operate an Ollama server — the local/self-hosted LLM runtime on
  localhost:11434 and its hosted twin at ollama.com. Covers the native /api/* endpoints (chat,
  generate, embed, tool calling, thinking, structured JSON output, vision, model management),
  the official JavaScript (`ollama`, `ollama/browser`) and Python (`ollama`) SDKs, the OpenAI
  /v1 and Anthropic /v1/messages compatibility layers, cloud models, web search, and server
  configuration (env vars, context length, keep_alive, concurrency, exposing over a network).
  Use this whenever a task mentions Ollama, a local or self-hosted LLM, localhost:11434,
  `ollama run/pull/serve`, models such as gemma/llama/qwen/gpt-oss/deepseek/mistral running
  locally, local embeddings or RAG with a local model, pointing an OpenAI- or Anthropic-SDK app
  at a local model, or Claude Code / Codex / Cline using a local backend — even when the user
  never says "API".
---

# Ollama API

Ollama is a single binary that serves models over plain HTTP. Everything — inference, model
management, the CLI itself — goes through one REST API, so once you know the shape of a request
you can drive it from curl, a Worker, a Python script or an existing OpenAI-SDK app. Build
against the user's *actual* host, model and API dialect; don't assume a config from an example.

Research baseline: **2026-09-08**. The API is not strictly versioned — the running server and
installed SDK can be ahead of or behind what's documented, and current docs/GitHub `main` can
describe behaviour beyond an installed release. Start fresh discovery at
[the documentation index](https://docs.ollama.com/llms.txt) when something here looks stale;
[API introduction](https://docs.ollama.com/api/introduction).

## Orientation: three base URLs, three API surfaces

| You want to… | Base URL | Auth |
|---|---|---|
| Talk to a local/self-hosted server | `http://localhost:11434` (override with `OLLAMA_HOST`) | none |
| Run a cloud model *through* the local server | same, model name ends in `-cloud` or `:cloud` | `ollama signin` once |
| Call ollama.com directly (no local install) | `https://ollama.com` | `Authorization: Bearer $OLLAMA_API_KEY` |

| API surface | Path prefix | Use it when |
|---|---|---|
| **Native** (default choice) | `/api/…` | You control the client. Full feature set: thinking, `options.num_ctx`, `keep_alive`, model management, logprobs. |
| OpenAI-compatible | `/v1/chat/completions`, `/v1/embeddings`, `/v1/responses`… | Dropping Ollama under an app that already speaks OpenAI. Missing: `tool_choice`, `n`, logprobs, image URLs, any way to set context length. |
| Anthropic-compatible | `/v1/messages` | Claude Code or Anthropic-SDK apps. Missing: prompt caching, `tool_choice`, `count_tokens`, PDFs. |

Reach for the native API unless the user is explicitly integrating existing OpenAI/Anthropic
client code; the compatibility layers are deliberately partial and you will hit a wall on
context length or tool control. Details in `references/compat-openai-anthropic.md`.

`localhost` means the environment actually *executing* the request — in an agent/container/
remote-sandbox context that is not necessarily the user's own computer. A localhost request can
still invoke a cloud model (via a `-cloud` tag), so "it's on localhost" is not by itself a data-
residency guarantee. Resolve this before assuming private content stays local.

## Guardrails

- **Ollama's local API has no built-in authentication.** That's fine on loopback; it means never
  exposing an unauthenticated `OLLAMA_HOST=0.0.0.0` server to an untrusted network, and never
  treating the compatibility layers' placeholder SDK key (`api_key='ollama'`) as real access
  control — it isn't validated. See `references/operations.md` and `references/server-config.md`.
- **Mutating endpoints have a blast radius beyond the current request.** `pull` downloads
  (potentially large), `create`/`copy` change the local model catalogue, `push` publishes under
  the user's account, `delete` removes a model. Confirm the exact target and that the action is
  actually wanted before running one — don't auto-pull, auto-publish, or blindly replay a
  mutating call after a transport failure just because a request failed.
- **Treat a model's tool calls, and anything a tool then fetches, as untrusted data.** Validate
  arguments against their schema, dispatch through an explicit allowlist (never `eval`/`exec` a
  model-supplied name), and bound rounds/calls/execution time. See `references/tool-calling.md`.
- **Keep credentials scoped.** The two official SDKs auto-inject `OLLAMA_API_KEY` on different
  terms (JS: only for `https://ollama.com`; Python: for *any* host with no explicit auth header)
  — see `references/cloud-and-web-search.md` before pointing a `Client` at a third-party host.
- **Refresh fragile claims.** This skill's reference files record known documentation gaps and
  self-contradictions (see `references/imports-and-drift.md`); when something here conflicts
  with what the running server actually does, trust the server and say so.

## Workflow

1. **Establish the target.** Host, execution environment, model tag, language/client in use, and
   whether this request's content is allowed to leave the machine. For a code-only request with
   no reachable server, say so, use configurable placeholders, and don't require credentials or a
   running daemon just to produce the code.
2. **Probe before changing anything.** When a server is reachable, run
   `python3 scripts/ollama_probe.py [host] [model]` — it reports version, installed models, what's
   currently loaded, and (for a named model) its `capabilities` array and context length in about
   thirty seconds. Most bugs reported against Ollama turn out to be "the model doesn't support
   tools" or "the context window is 4k and the prompt is 9k," and both are visible here before you
   write a line of integration code. If nothing is reachable, say so plainly and write code that
   fails loudly on connection errors rather than inventing a working demo.
3. **Pick the endpoint and read the one reference file the task needs** — table below. Don't load
   everything at once.
4. **Build the request correctly** — sampling parameters go inside `options`, decide `stream`
   on purpose, and check the model's actual capabilities before sending `tools`/`images`/`think`/
   `suffix`. See "The things that bite" below before writing streaming or tool-calling code.
5. **Handle the stream and the errors** — NDJSON lines, `done: true` (or `status: "success"`) on
   the last one, and `{"error": …}` lines that can arrive *after* a 200 status.
6. **Verify against the live server** if there is one: a small `stream: false` request, its error
   path, and whatever streaming/tool/schema behaviour actually changed. With no server to test
   against, say so plainly rather than implying the code ran, and keep configuration advice to
   variables/fields that actually appear in these reference files — Ollama's config surface is
   small, and a plausible-sounding invented `OLLAMA_*` variable in a systemd unit does nothing
   while looking like a fix, which is worse than an admitted gap.
7. **Report the result.** State the endpoint/dialect and model used, what ran successfully, and
   any behaviour that remains untested. Recheck the official docs when runtime evidence conflicts
   with this skill's research baseline.

## Which endpoint

| Task | Endpoint | Notes |
|---|---|---|
| Conversation, tools, images, thinking, JSON output | `POST /api/chat` | `messages[]` with roles `system/user/assistant/tool` |
| One-shot prompt, fill-in-the-middle, raw templated prompt | `POST /api/generate` | `prompt`, `suffix`, `raw`, `system` |
| Preload / unload a model | `POST /api/generate` or `/api/chat` with only `model` (+ `keep_alive`) | `keep_alive: 0` unloads, `-1` pins |
| Embeddings | `POST /api/embed` | `input` string **or array**; vectors come back L2-normalised. `/api/embeddings` (singular) is the legacy one |
| What models exist / are loaded | `GET /api/tags`, `GET /api/ps` | `ps` shows VRAM split, `context_length`, `expires_at` |
| Model details and capabilities | `POST /api/show` | `capabilities[]` — `completion` and `vision` are documented; `tools`, `thinking`, `embedding`, `insert` are also reported in practice |
| Pull / push / copy / delete / create | `POST /api/pull`, `/api/push`, `/api/copy`, `DELETE /api/delete`, `POST /api/create` | pull/push/create stream `{status, completed, total}` progress. Delete takes a JSON body. See Guardrails above. |
| Server version | `GET /api/version` | |
| Web search / fetch (cloud only) | `POST https://ollama.com/api/web_search`, `/api/web_fetch` | API key required; see `references/cloud-and-web-search.md` |

## Request anatomy (native chat)

```json
{
  "model": "gemma4",
  "messages": [
    {"role": "system", "content": "Answer tersely."},
    {"role": "user", "content": "Why is the sky blue?", "images": ["<base64, no data: prefix>"]}
  ],
  "stream": false,
  "think": true,
  "format": {"type": "object", "properties": {"answer": {"type": "string"}}, "required": ["answer"]},
  "tools": [{"type": "function", "function": {"name": "…", "description": "…", "parameters": {"type": "object", "properties": {}}}}],
  "keep_alive": "10m",
  "options": {"temperature": 0.2, "num_ctx": 32768, "num_predict": 1024, "seed": 42, "stop": ["\n\n"]}
}
```

Response (non-streaming) puts the text in `message.content`, reasoning in `message.thinking`,
tool requests in `message.tool_calls[]`, and usage on the same object: `prompt_eval_count`,
`eval_count`, `total_duration` (all durations are **nanoseconds**). Documented `done_reason`
values are `stop` and `load`/`unload` (the latter for the empty-prompt calls); a reply cut off
at the generation limit reports `length` in practice, so test for "not `stop`" rather than
matching `length`.

`/api/generate` is the same idea with `prompt` instead of `messages` and `response`/`thinking`
instead of `message.*`.

## Streaming

The REST API streams **NDJSON** (`application/x-ndjson`) by default: one JSON object per line,
partial `message.content` / `message.thinking` / `message.tool_calls` per chunk, and a final
line with `"done": true` carrying the usage metrics. Send `"stream": false` for a single JSON
body — do this for structured outputs and tool calls unless you genuinely need tokens live.
Official SDKs default the other way (`stream: false`), so set it explicitly either way rather
than relying on either default.

Two rules that follow from the format:

- **Accumulate every field, not just content.** To continue the conversation you must append an
  assistant message containing the concatenated `thinking`, `content` and every `tool_calls`
  entry you saw, then the tool results. Dropping the thinking or the tool_calls confuses the
  model on the next turn.
- **Errors mid-stream arrive as a line `{"error": "…"}` after HTTP 200 has already been sent.**
  Check each parsed line for an `error` key; a status-code check alone will miss it.

Plain `fetch` parser (works in Node, Workers, browsers):

```js
const res = await fetch(`${host}/api/chat`, { method: 'POST', body: JSON.stringify(body) });
if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
const reader = res.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
while (true) {
  const { value, done } = await reader.read(); if (done) break;
  buffer += decoder.decode(value, { stream: true });
  let newline; while ((newline = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, newline).trim(); buffer = buffer.slice(newline + 1);
    if (!line) continue; const chunk = JSON.parse(line);
    if (chunk.error) throw new Error(chunk.error);
    yieldChunk(chunk); // chunk.message.content / .thinking / .tool_calls; chunk.done on the last
  }
}
```

For a captured or piped stream, `scripts/read_ndjson.py` does this accumulation-and-validation
for you — see "Scripts" below.

## The things that bite

Read these before writing code; each one is a bug that looks like "Ollama is broken."

- **Sampling knobs live under `options`.** `temperature`, `top_p`, `top_k`, `min_p`, `seed`,
  `stop`, `num_ctx`, `num_predict`, `repeat_penalty` … are ignored at the top level. (The OpenAI
  layer is the exception — it maps its own top-level fields.)
- **Context length defaults small and silently truncates.** The server picks 4k / 32k / 256k
  depending on VRAM (<24 GiB / 24–48 / ≥48), so the same code behaves differently on a 16 GB
  laptop and a dual-A100 box — never assume a number, read it from `/api/ps`. Tool loops, web
  search and RAG want ≥32k; set `options.num_ctx` per request or `OLLAMA_CONTEXT_LENGTH` on the
  server. The `/v1` layer has no field for it — create a derived model with `PARAMETER num_ctx`.
  Raising it multiplies memory by `OLLAMA_NUM_PARALLEL`. Truncation is silent at the *prompt*
  end (oldest turns dropped, HTTP 200, no flag) but flagged at the *reply* end as
  `done_reason: "length"` — surface that field instead of discarding it.
- **Tool results are keyed by name, not id.** Send back
  `{"role": "tool", "tool_name": "get_weather", "content": "22°C"}` — there is no documented
  `tool_call_id`. `tool_calls[].function.arguments` is already a JSON **object**, not a string
  to parse. Full loop patterns and safety notes in `references/tool-calling.md`.
- **Not every model does tools/vision/thinking.** `/api/show` → `capabilities` is the source of
  truth — check it before sending `tools`, `images`, `think` or `suffix` rather than discovering
  it from a 4xx. (The docs only spell out `completion` and `vision`; `tools`, `thinking`,
  `embedding` and `insert` show up on real models but aren't enumerated anywhere official.)
- **`think` is a boolean *or* a level.** `true/false` or `"low"|"medium"|"high"|"max"`.
  gpt-oss only accepts levels and cannot switch thinking off; IBM Granite 4.2 uses its own
  `enable_thinking`/`reasoning_effort` pair instead of `think`. The SDKs' type hints lag the
  server (no `"max"` in their unions) — cast if needed. Details in `references/capabilities.md`.
- **Structured output = `format`, and it wants help.** `"format": "json"` or a JSON-schema
  object. Also *tell the model in the prompt* to emit JSON (otherwise expect whitespace), set
  `temperature` to 0, and validate the result (Pydantic / Zod). **Ollama Cloud does not
  support structured outputs.**
- **Images are bare base64 over REST.** No `data:image/png;base64,` prefix in `images[]`. The
  SDKs accept file paths and bytes and encode for you — except the JS `ollama/browser` build,
  which cannot read paths, and despite some docs claiming SDK URL support, the actual client code
  does not fetch HTTP URLs. The OpenAI layer accepts base64 data URLs only, never http URLs.
- **`keep_alive` semantics:** duration string (`"10m"`, `"24h"`), seconds as a number, `0` to
  unload immediately after the response, negative to keep loaded indefinitely. Overrides
  `OLLAMA_KEEP_ALIVE` (server default 5 minutes).
- **Embedding `dimensions` only ever shrinks.** On the server implementations inspected, a
  requested dimension smaller than the native length slices and renormalises the vector; a
  larger one does not enlarge it — verify the actual returned length rather than trusting the
  request field, and treat this as version-dependent.
- **Model names:** `name:tag`, tag defaults to `latest`; namespaced as `user/model`. Cloud
  models are `gpt-oss:120b-cloud` via a signed-in local server but `gpt-oss:120b` when you hit
  `https://ollama.com/api` directly.
- **Status codes worth handling:** 404 model missing (confirm before pulling — see Guardrails),
  400 bad request or unsupported capability, 429 cloud rate limit, 502 cloud model unreachable,
  503 request queue full (`OLLAMA_MAX_QUEUE`, default 512 — don't just raise this, see
  "Diagnosing a 503 properly" in `references/server-config.md`). Body is always `{"error": "…"}`.
- **CORS is locked down.** Browser clients on any origin other than localhost need
  `OLLAMA_ORIGINS` set on the server.
- **SDK defaults differ from REST.** Both SDKs default to `stream: false`. The JS default
  import needs Node (`node:fs`) — Workers and browsers must import `ollama/browser`. The JS
  client does *not* read `OLLAMA_HOST`; the Python one does, and also auto-injects
  `OLLAMA_API_KEY` more broadly than the JS client does (see Guardrails above).
  `ollama.abort()` in JS cancels every in-flight stream on that instance. Python raises a plain
  `ConnectionError` (not `ResponseError`) when the server is down on a non-streaming call, but
  leaks the raw `httpx` exception on a streaming one — catch both.

## Shell notes (fish vs bash)

The docs' curl examples are bash. Under fish: `set -x OLLAMA_API_KEY …` instead of `export`,
command substitution is `(…)` not `$(…)`, and a base64'd image goes in with
`set IMG (base64 < photo.jpg | string join '')`. Single-quoted JSON bodies with an inner
`'"$VAR"'` splice work identically in both shells. A heredoc-based Modelfile is one place bash
and fish diverge in a way that bites — fish doesn't do heredocs the same way — so prefer
`printf 'FROM gemma4\nPARAMETER num_ctx 65536\n' > Modelfile` (shown in
`references/compat-openai-anthropic.md`) over a `<<EOF` block when scripting this for fish.

## Reference files

Load the one that matches the task; each has a table of contents. Don't load them all at once.

- `references/endpoints.md` — every native endpoint: fields, types, defaults, response shapes, curl, status codes, and where the published OpenAPI schema disagrees with the actual server. **Read when writing raw HTTP or checking a field name.**
- `references/sdk-python.md` — `Client` / `AsyncClient`, function-as-tool, Pydantic structured outputs, error classes, gotchas. **Read for any Python.**
- `references/sdk-javascript.md` — `ollama` / `ollama/browser`: constructor, streaming, abort, errors, Cloudflare Workers, tool and image types, gotchas. **Read for any JS/TS.**
- `references/tool-calling.md` — single, parallel, agent-loop and streaming tool patterns with exact message shapes, plus the safety/sandboxing rules for executing model-requested calls. **Read when `tools` appears anywhere.**
- `references/capabilities.md` — structured outputs (JSON Schema via `format`), vision (base64 image input), and thinking (`think` levels, per-model exceptions).
- `references/compat-openai-anthropic.md` — feature-support matrices for both compatibility layers, model-name aliasing with `ollama cp`, Claude Code / other coding-agent setup. **Read when an OpenAI/Anthropic SDK or a drop-in swap is involved.**
- `references/cloud-and-web-search.md` — ollama.com API keys (and the SDK auth-injection footgun), cloud model naming/retirements, `web_search`/`web_fetch`, the search-agent pattern.
- `references/server-config.md` — environment variables, keep_alive, concurrency/queueing (including a real "diagnosing a 503" walkthrough), context length, exposing over the network/tunnels, CORS, model storage, K/V cache quantisation. **Read for "why is it slow / out of memory / unreachable."**
- `references/operations.md` — auth/credential boundaries, guardrails for mutating calls, and a request-diagnosis symptom table. **Read before a mutating call, or when a request is failing and you're not sure why.**
- `references/imports-and-drift.md` — GGUF/Safetensors/LoRA adapter uploads via `/api/blobs`, legacy-endpoint migration traps, and known documentation self-contradictions.
- `references/examples.md` — copy-paste curl/Python/JS snippets for every endpoint and capability, for when you just need something to adapt rather than the full field reference.
- `references/testing.md` — what each bundled script does and doesn't do, and how to run the offline test suite. **Read before using any script below.**

## Scripts

Three standard-library-only Python scripts, each for a different job — see
`references/testing.md` for the full detail on each, including limitations.

- `python3 scripts/ollama_probe.py [HOST] [MODEL] [--json]` — read-only discovery. Run this
  **first** against any reachable server: version, installed/loaded models, and (with a model
  name) its capabilities, context length and Modelfile parameters, with an explicit note for
  each of tools/vision/thinking it lacks. Exit code 2 = unreachable, 3 = auth rejected.
- `python3 scripts/ollama_request.py {chat,generate,embed,tags,show,pull,…} --data FILE` —
  make one raw native request and get validated JSON/NDJSON back, with correct terminal-state
  checking. No retries, no implicit credential reading (`--api-key-env` is opt-in).
- `python3 scripts/read_ndjson.py --kind {chat,generate,status}` — validate and aggregate a
  captured or piped native stream into one complete object; rejects malformed/incomplete
  streams rather than silently returning partial data. Has an offline test suite:
  `python -m unittest discover -s tests -v`.

## Verify the result

Exercise the behaviour that changed: a small successful request, its error path, and any
relevant streaming, tool or schema behaviour. For a stream parser, cover split records, split
UTF-8, an error after HTTP 200, and EOF without the completion marker (or just point
`read_ndjson.py` at it). For tools, verify all results are returned and a retry does not
duplicate side effects. For embeddings, check batch count and actual vector length rather than
trusting the requested `dimensions`.

Report the endpoint/dialect and model used, what ran successfully, and any untested live
behaviour. Recheck the official docs when runtime evidence conflicts with this research baseline.
