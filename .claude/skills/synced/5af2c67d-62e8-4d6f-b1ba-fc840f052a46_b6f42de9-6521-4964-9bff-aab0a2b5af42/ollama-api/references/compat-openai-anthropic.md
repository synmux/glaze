# OpenAI and Anthropic compatibility layers

Both layers exist so that *existing* client code can point at Ollama with a base-URL change. They are subsets. When you control the client, prefer the native `/api/*` endpoints (see `endpoints.md`); when you don't, this file tells you what will and won't work.

## Contents

- [OpenAI: setup](#openai-setup)
- [OpenAI: what works](#openai-what-works)
- [OpenAI: workarounds](#openai-workarounds)
- [Anthropic: setup](#anthropic-setup)
- [Anthropic: what works](#anthropic-what-works)
- [Claude Code on Ollama](#claude-code-on-ollama)
- [Other coding agents](#other-coding-agents)
- [Reading the support tables accurately](#reading-the-support-tables-accurately)

## OpenAI: setup

Base URL `http://localhost:11434/v1`. An API key is required by the SDKs but ignored by Ollama — any non-empty string.

```python
from openai import OpenAI
client = OpenAI(base_url='http://localhost:11434/v1/', api_key='ollama')
r = client.chat.completions.create(model='gpt-oss:20b', messages=[{'role': 'user', 'content': 'Say this is a test'}])
```

```ts
import OpenAI from 'openai'
const openai = new OpenAI({ baseURL: 'http://localhost:11434/v1/', apiKey: 'ollama' })
```

```bash
curl http://localhost:11434/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model": "gpt-oss:20b", "messages": [{"role": "user", "content": "Say this is a test"}]}'
```

For ollama.com cloud models use `https://ollama.com/v1` with your real `OLLAMA_API_KEY` as the `api_key`. A placeholder key like `'ollama'` is not an access-control mechanism and is not a cloud credential — don't reuse it as if it were.

## OpenAI: what works

| Endpoint | Supported | Not supported |
|---|---|---|
| `/v1/chat/completions` | streaming, `stream_options.include_usage`, JSON mode & `response_format` (json_schema), `seed`, `stop`, `temperature`, `top_p`, `max_tokens`, `frequency_penalty`, `presence_penalty`, `tools`, vision via base64 data URLs, `reasoning_effort` / `reasoning.effort` (`low`/`medium`/`high`/`max`/`none`) | `tool_choice`, `logprobs`, `logit_bias`, `n`, `user`, **image URLs** (http), image `detail` |
| `/v1/completions` | streaming, `suffix`, `seed`, `stop`, penalties, `max_tokens` | `prompt` as array/token-ID array, `best_of`, `echo`, `logprobs`, `n` |
| `/v1/embeddings` | string or array `input`, `encoding_format`, `dimensions` | token-array input, `user` |
| `/v1/models`, `/v1/models/{model}` | list/show local models (`created` = modified time, `owned_by` = username or `library`) | — |
| `/v1/responses` (Ollama ≥ 0.13.3) | non-stateful: `input`, `instructions`, `tools`, `stream`, `temperature`, `top_p`, `max_output_tokens`, reasoning summaries | `previous_response_id`, `conversation`, `truncation` — no server-side state |

Tool calls come back in OpenAI shape (`tool_calls[].id`, `function.arguments` as a JSON **string**, results via `role: "tool"` + `tool_call_id`) — this is the one place native and compat genuinely disagree on wire format; don't reuse native tool-loop code here unchanged.

## OpenAI: workarounds

- **Context length** — there is no OpenAI field for it, and the default is small. Create a derived model (the heredoc terminator must be at column 0, so paste this unindented):

```bash
printf 'FROM gemma4\nPARAMETER num_ctx 65536\n' > Modelfile
ollama create gemma4-64k -f Modelfile      # or POST /api/create with "parameters": {"num_ctx": 65536}
```

  then use `model: "gemma4-64k"`. (`printf` avoids the heredoc-indentation trap entirely and works the same in bash and fish.)
- **Hard-coded model names** in the client (`gpt-4o`, `gpt-3.5-turbo`) — alias with `ollama cp gemma4 gpt-4o` (or `POST /api/copy`). This changes the local name only, not the underlying model's identity or capabilities.
- **Thinking models** — use `reasoning_effort` to set a level; `"none"` disables it where the model allows.
- **Anything else missing** (`tool_choice`, logprobs, `num_predict` beyond `max_tokens`, `keep_alive`) — switch that call to the native API. Mixing native and `/v1` calls against the same server is fine.

## Anthropic: setup

Base URL `http://localhost:11434` (no `/v1` suffix — the SDKs append `/v1/messages`). Key required-but-ignored; `anthropic-version` header accepted and ignored.

```python
import anthropic
client = anthropic.Anthropic(base_url='http://localhost:11434', api_key='ollama')
msg = client.messages.create(model='qwen3-coder', max_tokens=1024,
                             messages=[{'role': 'user', 'content': 'Hello'}])
print(msg.content[0].text)
```

```bash
curl http://localhost:11434/v1/messages -H 'Content-Type: application/json' -H 'x-api-key: ollama' \
  -H 'anthropic-version: 2023-06-01' \
  -d '{"model": "qwen3-coder", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello"}]}'
```

Treat response content as typed blocks, not guaranteed text at index zero — tools appear as `tool_use` blocks and can produce `stop_reason: "tool_use"`.

## Anthropic: what works

Supported on `/v1/messages`: messages, streaming (`message_start`, `content_block_start/delta/stop`, `message_delta`, `message_stop`, `ping`), `system` (string or blocks), multi-turn, base64 images, `tools` + `tool_use`/`tool_result` blocks, `thinking` blocks and the `thinking` request field, `temperature`, `top_p`, `top_k`, `stop_sequences`, `stop_reason` (`end_turn`/`max_tokens`/`tool_use`), `usage`.

The `error` SSE event is contradictory in the docs — listed as supported in the event table, then listed under "not supported" as "errors return HTTP status" — so don't build your client around receiving one mid-stream; handle a stream that simply ends, and treat both an HTTP failure and any observed `error` event as real errors rather than depending on exactly one of them showing up.

Not supported: `tool_choice`, `metadata`, prompt caching (`cache_control`), `/v1/messages/count_tokens`, Batches API, citations, PDF `document` blocks, image URLs (base64 only). `budget_tokens` is accepted but not enforced. Token counts are approximate, based on the underlying model's own tokenizer rather than Anthropic's.

## Claude Code on Ollama

```bash
ollama pull qwen3-coder          # ~30B, wants ≥24 GB VRAM; or a cloud model such as glm-5.2:cloud
ollama launch claude             # interactive: pick model, writes config, starts Claude Code
ollama launch claude --config    # configure only
```

Model names age fast here: the Anthropic-compat page still recommends `glm-4.7` and `minimax-m2.1`, both of which the retirement table in `cloud.md` lists as retired (July 2026) in favour of `glm-5.2` and `minimax-m3`. Check `GET https://ollama.com/api/tags` for what actually exists before pinning one — don't mechanically carry forward a model name from an older example.

Manual equivalent:

```bash
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_BASE_URL=http://localhost:11434
claude --model qwen3-coder
```

(fish: `set -x ANTHROPIC_AUTH_TOKEN ollama; set -x ANTHROPIC_BASE_URL http://localhost:11434`.)

Coding agents burn context fast — set `OLLAMA_CONTEXT_LENGTH=64000` (or higher) on the server, or use a cloud model, which runs at full context. The docs' coding recommendations are `qwen3-coder` locally and, for cloud, the current successors to `glm-4.7` / `minimax-m2.1` (namely `glm-5.2` / `minimax-m3` — see the note above). Tools that expect Anthropic model IDs can be satisfied with `ollama cp qwen3-coder claude-3-5-sonnet`.

## Other coding agents

The docs have per-tool pages under `https://docs.ollama.com/integrations/<tool>.md` for Codex (CLI and app), OpenCode, Cline, Roo Code, Goose, Droid, Copilot CLI, Zed, JetBrains, VS Code, Xcode, n8n, marimo, Onyx, Hermes, OpenClaw, Pi and more. The recipe is always one of: set the OpenAI base URL to `http://localhost:11434/v1`, set the Anthropic base URL to `http://localhost:11434`, or pick "Ollama" as a provider in the tool. `ollama launch <tool>` exists for several of them.

## Reading the support tables accurately

The official compatibility pages render as checklists, and text extraction (copy-paste, a scraper, a model reading the page) can lose the distinction between a checked and unchecked box — this genuinely happened during research for both the OpenAI and Anthropic pages above. If a "supported" claim in this file or the official docs looks surprising for a specific field, open the actual rendered page (or the raw Markdown) rather than trusting a re-derived summary, including this one.
