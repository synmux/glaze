# Native REST endpoints

Base URL `http://localhost:11434` (local, no auth) or `https://ollama.com` (cloud, `Authorization: Bearer $OLLAMA_API_KEY`).
Every request body is JSON; every error body is `{"error": "<message>"}`. Durations are nanoseconds.
Source of truth: `https://docs.ollama.com/openapi.yaml` and `https://docs.ollama.com/api/<endpoint>.md`.

## Contents

- [Conventions](#conventions)
- [Shared: `options` object](#shared-options-object)
- [POST /api/chat](#post-apichat)
- [POST /api/generate](#post-apigenerate)
- [POST /api/embed](#post-apiembed) (and legacy `/api/embeddings`)
- [GET /api/tags](#get-apitags)
- [GET /api/ps](#get-apips)
- [POST /api/show](#post-apishow)
- [POST /api/pull](#post-apipull)
- [POST /api/push](#post-apipush)
- [POST /api/create](#post-apicreate)
- [POST /api/copy](#post-apicopy)
- [DELETE /api/delete](#delete-apidelete)
- [HEAD / POST /api/blobs/:digest](#head--post-apiblobsdigest)
- [GET /api/version](#get-apiversion)
- [Cloud-only endpoints](#cloud-only-endpoints)
- [Status codes](#status-codes)
- [Where the docs disagree with themselves](#where-the-docs-disagree-with-themselves)

## Conventions

- **Model names** are `name:tag`; the tag defaults to `latest`. Namespaced models are `user/name:tag`.
- **Streaming** endpoints (`chat`, `generate`, `pull`, `push`, `create`) default to `"stream": true` and return `application/x-ndjson` — one JSON object per line. Send `"stream": false` for a single `application/json` body.
- **Mid-stream errors** are a line `{"error": "…"}`; the HTTP status has already been sent as 200.
- **Usage metrics** (`total_duration`, `load_duration`, `prompt_eval_count`, `prompt_eval_cached_count`, `prompt_eval_duration`, `eval_count`, `eval_duration`) appear on the final object (`"done": true`) or on the whole non-streamed response. Do not assume every endpoint/version emits every field.
- `keep_alive` accepts a duration string (`"5m"`, `"24h"`), a number of seconds, `0` (unload after this response) or a negative value (keep loaded until restart). Default is the server's `OLLAMA_KEEP_ALIVE`, itself defaulting to 5 minutes.
- **Mutating calls have a blast radius beyond the current request.** `pull` downloads data, `create`/`copy` change the model catalogue, `push` publishes to a registry, `delete` removes a model. Resolve the exact target name and confirm you have authorisation for that effect before running one — see the "Guardrails" section of `../SKILL.md`. Don't auto-pull a missing model or replay one of these just because a request failed; a transport failure after submission can leave completion genuinely uncertain.

## Shared: `options` object

Runtime/sampling parameters go **inside `options`**, never at the top level of the request (the OpenAI compatibility layer is the one exception — see `compat-openai-anthropic.md`). Defaults come from the model's Modelfile.

| Field | Type | Default | Meaning |
|---|---|---|---|
| `num_ctx` | int | VRAM-dependent: 4k/32k/256k tiers (the Modelfile reference still says 2048 and the FAQ says 4096 — the tiers in `context-length.md` are the current behaviour) | Context window in tokens. Memory scales with it (× `OLLAMA_NUM_PARALLEL`). |
| `num_predict` | int | -1 (unbounded) | Max tokens to generate. |
| `temperature` | float | 0.8 | Higher = more random. Use 0 for structured output/extraction. |
| `top_k` | int | 40 | Restrict next-token choice to K most likely. |
| `top_p` | float | 0.9 | Nucleus sampling threshold. |
| `min_p` | float | 0.0 | Minimum probability relative to the top token. |
| `seed` | int | 0 | Fixed seed for reproducible output (with `temperature` 0 it is effectively deterministic). Record it alongside model/runtime version — don't promise identical output across changed models, hardware or runtime versions. |
| `stop` | string \| string[] | — | Stop sequence(s). |
| `repeat_penalty` | float | 1.0 | >1 penalises repetition. |
| `repeat_last_n` | int | 64 | Look-back window for repeat penalty (0 off, -1 = num_ctx). |
| `presence_penalty`, `frequency_penalty` | float | — | OpenAI-style penalties. Accepted by the SDKs; not in the documented Modelfile parameter table. |
| `mirostat`, `mirostat_tau`, `mirostat_eta` | int/float | — | Mirostat sampling (0 off, 1 v1, 2 v2). In both SDKs' `Options`; defaults undocumented. |
| `num_gpu`, `num_thread`, `num_batch`, `use_mmap`, `main_gpu` | various | auto | Load-time hardware knobs; rarely needed. Changing them forces a reload. (`use_mlock`, `low_vram` also exist in the SDK types.) |
| `draft_num_predict` | int | 4 | Speculative-decoding draft tokens when a draft model exists; 0 disables. |

The schema is `additionalProperties: true`, so unknown keys are accepted silently — a typo (`temprature`) does nothing rather than erroring. That's a reason to sanity-check a request against this table rather than trust that an unrecognised field would have failed loudly.

## POST /api/chat

Next assistant message for a conversation. Supports tools, images, thinking, structured output.

**Request**

| Field | Type | Required | Notes |
|---|---|---|---|
| `model` | string | yes | |
| `messages` | Message[] | yes | See message shape below. Empty array with just `model` preloads the model. |
| `tools` | Tool[] | no | `{"type":"function","function":{"name","description","parameters":<JSON Schema>}}`. Model must have the `tools` capability. |
| `format` | `"json"` \| JSON Schema object | no | Structured output. Not on Ollama Cloud. |
| `think` | bool \| `"low"`\|`"medium"`\|`"high"`\|`"max"` | no | gpt-oss requires a level. |
| `stream` | bool | no (true) | |
| `keep_alive` | string \| number | no | |
| `options` | object | no | See above. |
| `logprobs` | bool | no | Return per-token log probabilities. |
| `top_logprobs` | int | no | Alternatives per position when `logprobs` is on. |

**Message shape**

```json
{"role": "system|user|assistant|tool",
 "content": "text",
 "thinking": "assistant reasoning (echo back on later turns)",
 "images": ["<base64>"],
 "tool_calls": [{"function": {"name": "fn", "arguments": {"k": "v"}}}],
 "tool_name": "fn"}
```

- `images` — base64 strings without a `data:` prefix; only meaningful on `user` messages to a vision model.
- `tool_calls` — on `assistant` messages the model produced. `arguments` is an object. Some responses also include `"index"` and `"type":"function"`; echo back what you received.
- `tool_name` — on `role: "tool"` messages, naming the function whose result is in `content`. There is no `tool_call_id` in the documented shape. Results are matched to calls by name and order. (Current `github.com/ollama/ollama/blob/main/api/types.go` also exposes a call `id` and result `tool_call_id` not yet in the OpenAPI spec — preserve a supplied call `id` and populate the matching result field when the installed server/client supports it, but don't invent one for the classic `tool_name`-only shape.)

**Response** (non-stream, or the `done: true` line)

```json
{"model": "gemma4", "created_at": "2025-10-17T23:14:07Z",
 "message": {"role": "assistant", "content": "…", "thinking": "…", "tool_calls": [ … ], "images": [ … ]},
 "done": true, "done_reason": "stop",
 "total_duration": 174560334, "load_duration": 101397084,
 "prompt_eval_count": 11, "prompt_eval_cached_count": 8, "prompt_eval_duration": 13074791,
 "eval_count": 18, "eval_duration": 52479709,
 "logprobs": [{"token": "…", "logprob": -0.1, "bytes": [..], "top_logprobs": [ … ]}]}
```

Streaming chunks carry partial `message.content` / `message.thinking` / `message.tool_calls` and `"done": false`; concatenate strings, append tool_calls.

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4",
  "messages": [{"role": "user", "content": "why is the sky blue?"}],
  "stream": false,
  "options": {"temperature": 0.2, "num_ctx": 16384}
}'
```

## POST /api/generate

Single-turn completion. Same engine as chat but with a `prompt` and no message history.

| Field | Type | Notes |
|---|---|---|
| `model` | string | required |
| `prompt` | string | Omit (with no other content) to preload the model. |
| `suffix` | string | Fill-in-the-middle: text that follows the completion. Only meaningful on models trained for it (code models); these report an `insert` capability. |
| `system` | string | Overrides the Modelfile SYSTEM. |
| `template` | string | Overrides the Modelfile TEMPLATE (Go template syntax). |
| `images` | string[] | base64, at request level (chat puts them on the message). |
| `format` | `"json"` \| schema | |
| `think` | bool \| level | |
| `raw` | bool | Skip prompt templating entirely; you supply the fully templated prompt. |
| `stream` | bool | default true |
| `keep_alive` | string \| number | `0` here is the idiomatic "unload now". |
| `options` | object | |
| `logprobs`, `top_logprobs` | bool, int | |
| `context` | int[] | **Deprecated** conversational memory token array from a previous response; use `/api/chat`'s `messages` history for any new code instead. |

**Response**: `{"model","created_at","response","thinking","done","done_reason", …usage…, "context": [...]}`. Streaming chunks carry partial `response` / `thinking`. `done_reason` values documented are `stop` and `load`/`unload` (the latter for the empty-prompt preload/unload calls); a reply cut off at the generation limit reports `length` in practice, so test for "not `stop`" rather than matching `length` specifically.

```bash
# Preload and pin in memory
curl http://localhost:11434/api/generate -d '{"model": "gemma4", "keep_alive": -1}'
# Unload
curl http://localhost:11434/api/generate -d '{"model": "gemma4", "keep_alive": 0}'
# Fill-in-the-middle
curl http://localhost:11434/api/generate -d '{"model": "qwen2.5-coder", "prompt": "def fib(n):", "suffix": "    return result", "stream": false}'
```

## POST /api/embed

| Field | Type | Notes |
|---|---|---|
| `model` | string | required — use an embedding model (`embeddinggemma`, `qwen3-embedding`, `all-minilm`, `nomic-embed-text`). |
| `input` | string \| string[] | required. Arrays are batched in one call; even one string still returns `embeddings` as an array of one vector. |
| `truncate` | bool | default true. `false` returns an error when input exceeds the context window instead of silently truncating. |
| `dimensions` | int | Requested output dimensionality where the model supports it (Matryoshka-style models). On the server implementations inspected, a requested dimension smaller than the native length slices and renormalises the vector; a larger requested dimension does not enlarge it — treat this as version-dependent and verify the actual returned length rather than trusting the request field. |
| `keep_alive` | string | |
| `options` | object | Rarely meaningful for embeddings. |

**Response**: `{"model", "embeddings": [[…],[…]], "total_duration", "load_duration", "prompt_eval_count"}`.
`embeddings` is always a list of vectors, even for a single string input. Vectors are described as L2-normalised, so cosine similarity is a plain dot product — but check finite values, vector count and consistent dimensions before indexing rather than assuming the doc description holds for every model. Keep model/tag and any truncation/dimension settings identical between indexing and querying, or rebuild the index.

**Legacy `POST /api/embeddings`** (singular): `{"model", "prompt"}` → `{"embedding": [...]}`. Superseded by `/api/embed` (plural `input`, plural `embeddings`); only use for old code, and re-verify vector shape when migrating rather than assuming identical output.

```bash
curl http://localhost:11434/api/embed -d '{"model": "embeddinggemma", "input": ["first", "second"]}'
```

## GET /api/tags

Lists locally available models (or the cloud catalogue when hitting `https://ollama.com/api/tags`).

```json
{"models": [{"name": "gemma4:latest", "model": "gemma4:latest", "modified_at": "…", "size": 9608350245,
             "digest": "c6eb…", "remote_model": "…", "remote_host": "…",
             "details": {"format": "gguf", "family": "gemma4", "families": ["gemma4"],
                         "parameter_size": "8.0B", "quantization_level": "Q4_K_M"}}]}
```

`remote_model` / `remote_host` are set on cloud models proxied by the local server. An empty `/api/ps` does not mean a model is unavailable — `tags` lists what *exists*, `ps` lists what's currently *loaded*.

## GET /api/ps

Currently loaded models.

```json
{"models": [{"name": "gemma4:latest", "model": "gemma4:latest", "size": 6591830464, "digest": "…",
             "details": {…}, "expires_at": "2025-10-17T16:47:07-07:00",
             "size_vram": 5333539264, "context_length": 4096}]}
```

`size_vram < size` means part of the model is on CPU (slow). `context_length` is the context the running instance was loaded with — the number that matters when debugging truncation, distinct from the model's documented maximum (that's `POST /api/show` → `model_info["<arch>.context_length"]`).

## POST /api/show

`{"model": "gemma4", "verbose": false}` →

```json
{"license": "…", "modelfile": "…", "parameters": "temperature 0.7\nnum_ctx 2048", "template": "…",
 "details": {"parent_model": "", "format": "gguf", "family": "gemma4", "families": ["gemma4"],
             "parameter_size": "8.0B", "quantization_level": "Q4_K_M"},
 "model_info": {"general.architecture": "gemma4", "gemma4.context_length": 131072, "gemma4.embedding_length": 2560, …},
 "capabilities": ["completion", "vision", "tools", "thinking"],
 "modified_at": "…"}
```

- `capabilities`: the docs only show `completion` and `vision`; `tools`, `thinking`, `embedding` and `insert` are returned by real models but are not enumerated in the documentation. Treat the array as the authority for a given model — check it before sending `tools`, `images`, `think` or `suffix`, since sending one to an unsupporting model fails (a 400 in practice) rather than being ignored — but don't assume the full vocabulary of possible values is fixed.
- `model_info["<arch>.context_length"]` is the model's *maximum* context; the *active* one is `ps.context_length` or the `options.num_ctx` you requested.
- `verbose: true` adds large fields (tokenizer vocab etc.) — only ask for it when you need them.

## POST /api/pull

`{"model": "gemma4", "insecure": false, "stream": true}`. Streams progress lines:

```json
{"status": "pulling manifest"}
{"status": "pulling c6eb…", "digest": "sha256:c6eb…", "total": 9608350245, "completed": 123456789}
{"status": "verifying sha256 digest"}
{"status": "success"}
```

Cancelled pulls resume; concurrent pulls of the same model share progress. `"stream": false` returns only `{"status": "success"}` when finished. Private models need the local server's public key registered on ollama.com (`ollama signin`). Observe every progress record — per-layer `digest`/`completed`/`total` don't by themselves signal completion, only the terminal `status: "success"` does. Don't set `insecure: true` as a generic fix for a failing pull.

## POST /api/push

`{"model": "user/name:tag", "insecure": false, "stream": true}` — same progress stream as pull. Requires an ollama.com account and the model to be namespaced under your username. This publishes to a registry — confirm that's actually wanted before running it.

## POST /api/create

Create a model from another model, a Modelfile-like set of fields, or uploaded blobs.

| Field | Type | Notes |
|---|---|---|
| `model` | string | required — new name |
| `from` | string | Existing model to derive from |
| `files` | object | `{"filename": "sha256:<digest>"}` of blobs pushed via `/api/blobs` (GGUF or safetensors) — see `imports-and-drift.md` |
| `adapters` | object | Same shape, for LoRA adapters |
| `template` | string | Go-template prompt template |
| `system` | string | System prompt baked in |
| `parameters` | object | Modelfile PARAMETERs, e.g. `{"num_ctx": 65536, "temperature": 0.2}`. This is how you give a model a permanently bigger context for clients (like the OpenAI-compat layer) that have no per-request field for it. |
| `messages` | Message[] | Seed conversation |
| `license` | string \| string[] | |
| `renderer`, `parser` | string | Named prompt renderer / output parser — use only documented/known names, don't invent one |
| `quantize` | string | `q4_K_M`, `q4_K_S`, `q8_0` — quantise a float16 source; this isn't a training endpoint and needs a suitable unquantised source model |
| `stream` | bool | Progress lines as with pull |

```bash
curl http://localhost:11434/api/create -d '{
  "model": "gemma4-64k", "from": "gemma4",
  "parameters": {"num_ctx": 65536}, "stream": false
}'
```

Create only the model actually requested by the task, under the name asked for — this adds a new entry to the local catalogue.

## POST /api/copy

`{"source": "gemma4", "destination": "gemma4-backup"}` → 200 on success, 404 if source missing, no JSON body either way. Also the way to alias a model to a name an external tool insists on (`gpt-3.5-turbo`, `claude-3-5-sonnet`) — this changes the local *name*, not the underlying model's identity or capabilities.

## DELETE /api/delete

`curl -X DELETE http://localhost:11434/api/delete -d '{"model": "gemma4:latest"}'` → 200 (no body) on success, or 404 if not found. Note the JSON body on a DELETE — some HTTP clients need coaxing to send one. Confirm the exact target before running this; it's irreversible without re-pulling.

## HEAD / POST /api/blobs/:digest

For importing GGUF/safetensors files before `/api/create`. Documented only in the GitHub `docs/api.md`, not on docs.ollama.com, and the published OpenAPI schema omits it — that's a documentation gap, not evidence the route doesn't exist. Full workflow and caveats in `imports-and-drift.md`.

- `HEAD /api/blobs/sha256:<hex>` → 200 if the blob exists on this server, 404 otherwise.
- `POST /api/blobs/sha256:<hex>` with the raw file as the body (`curl -T model.gguf -X POST …`) → 201 Created, or 400 if the digest doesn't match.

Digest is the SHA-256 of the file content: `shasum -a 256 model.gguf`.

## GET /api/version

`{"version": "0.12.6"}`. Cheapest liveness check there is — and note this identifies the *running daemon*, which is what matters; the OpenAPI document's own `info.version` field identifies the spec, not the server.

## Cloud-only endpoints

Only on `https://ollama.com` with a Bearer API key. The JS/Python SDKs hard-code this host for these two calls regardless of the client's configured `host`.

| Endpoint | Body | Response |
|---|---|---|
| `POST /api/web_search` | `{"query": "…", "max_results": 5}` (1–10) | `{"results": [{"title", "url", "content"}]}` |
| `POST /api/web_fetch` | `{"url": "https://…"}` | `{"title", "content", "links": ["…"]}` |

See `cloud-and-web-search.md` for the agent pattern, auth-injection footguns, and context-length advice.

## Status codes

| Code | Meaning | Typical fix |
|---|---|---|
| 200 | OK — but still scan NDJSON lines for `error` | |
| 400 | Bad request: invalid JSON, missing `model`/`messages`. Also what you get for asking a model for something it can't do (tools on a non-tool model) — the docs don't spell this case out, so check capabilities rather than relying on the code | Check `/api/show` capabilities |
| 401 / 403 | Cloud auth missing/invalid (not in the documented list, but what an unauthenticated ollama.com call returns) | Set `OLLAMA_API_KEY` / `ollama signin` |
| 404 | Model not found locally, or wrong route | `POST /api/pull` (with authorisation), or check the exact model name/tag |
| 429 | Rate limited (cloud) | Bounded backoff |
| 500 | Server error (often runner crash / OOM) | Check logs; reduce `num_ctx` or use a smaller quant |
| 502 | Cloud model unreachable | Retry / fall back to local |
| 503 | Request queue full (`OLLAMA_MAX_QUEUE`, default 512) | See "Diagnosing a 503 properly" in `server-config.md` before just raising the limit |

## Where the docs disagree with themselves

The published OpenAPI spec is not the full picture: it omits message fields present in current source (`thinking`, `tool_name`, and the newer `id`/`tool_call_id`), and it omits the blob-import routes and fields entirely. Treat a field's absence from the reduced schema as a documentation gap, not proof it doesn't exist — check `github.com/ollama/ollama/blob/main/api/types.go` at the installed release tag, and verify with the smallest affected request, rather than stripping a field you actually received back out of your code.
