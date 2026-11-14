# JavaScript / TypeScript SDK (`ollama` on npm)

Repo: `github.com/ollama/ollama-js`. Facts below were checked against `src/interfaces.ts`, `src/browser.ts`, `src/index.ts`, `src/utils.ts` at v0.6.x — trust the `.ts` source over the README when they disagree.

## Contents

- [Install and entry points](#install-and-entry-points)
- [Constructor](#constructor)
- [Methods](#methods)
- [Streaming and abort](#streaming-and-abort)
- [Errors](#errors)
- [Types you will actually touch](#types-you-will-actually-touch)
- [Cloudflare Workers / edge runtimes](#cloudflare-workers--edge-runtimes)
- [Structured output with Zod](#structured-output-with-zod)
- [Gotchas](#gotchas)

## Install and entry points

```bash
npm i ollama      # or: bun i ollama
```

| Import | Runtime | Difference |
|---|---|---|
| `import ollama, { Ollama } from 'ollama'` | Node (uses `node:fs`, `node:path`) | `images` may be file paths; `create()` refuses local paths |
| `import ollama, { Ollama } from 'ollama/browser'` | Browsers, Cloudflare Workers, Deno/edge | No filesystem: `images` must be `Uint8Array` or base64 strings |

The default export is a pre-built client pointed at `http://127.0.0.1:11434`. The `Ollama` class is for custom hosts/headers/fetch.

## Constructor

```ts
const client = new Ollama({
  host: 'http://127.0.0.1:11434',   // default; NOT read from OLLAMA_HOST — wire it yourself
  headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },  // merged into every request
  fetch: customFetch,                // any fetch-compatible function
  // proxy: true,                    // see below — this DISCARDS host, it does not "use it verbatim"
})
```

- **Host normalisation**: a host with no scheme gets `http://`; a host with no port gets `:11434` — *but only when you gave no scheme*. With an explicit scheme the usual web defaults apply, so `https://ollama.example.com` becomes `https://ollama.example.com:443`, not `:11434`. Pass the port yourself if you mean something else.
- **`proxy: true` ignores `host` entirely.** The constructor skips normalisation by leaving the host as the empty string, so every request goes to a *same-origin relative* path (`/api/chat`). It exists for pages served from the same origin as a proxy that forwards to Ollama. For a tunnel or reverse-proxy URL you want the opposite: pass the URL as `host` and leave `proxy` unset — setting it silently sends your requests to the wrong origin.
- `OLLAMA_API_KEY` in `process.env` is injected as a Bearer header **only** when the request is `https://ollama.com`; for a self-hosted server behind auth, pass `headers` explicitly. (The Python SDK differs — see `sdk-python.md`.)

## Methods

All return Promises. Request/response type names are exported from the package.

| Method | Request type | Response | Streams? |
|---|---|---|---|
| `chat(req)` | `ChatRequest` | `ChatResponse` | yes |
| `generate(req)` | `GenerateRequest` | `GenerateResponse` | yes |
| `embed(req)` | `EmbedRequest` (`input: string \| string[]`) | `EmbedResponse` (`embeddings: number[][]`) | no |
| `embeddings(req)` | `EmbeddingsRequest` (`prompt`) — legacy | `EmbeddingsResponse` (`embedding: number[]`) | no |
| `pull(req)` / `push(req)` / `create(req)` | `PullRequest` / `PushRequest` / `CreateRequest` | `ProgressResponse` | yes |
| `list()` / `ps()` | — | `ListResponse` (`models: ModelResponse[]`) | no |
| `show(req)` | `ShowRequest` | `ShowResponse` (has `capabilities`) | no |
| `copy(req)` / `delete(req)` | `CopyRequest` / `DeleteRequest` | `StatusResponse` | no |
| `version()` | — | `VersionResponse` | no |
| `webSearch(req)` / `webFetch(req)` | `WebSearchRequest` (`query`, `maxResults`) / `WebFetchRequest` (`url`) | `WebSearchResponse` / `WebFetchResponse` | no |
| `abort()` | — | void | aborts **all** streams on this instance |

`webSearch`/`webFetch` always call `https://ollama.com` regardless of `host`, and need an API key.

## Streaming and abort

`stream` defaults to **false** (unlike REST). With `stream: true` the method resolves to an `AbortableAsyncIterator<T>` — iterate with `for await`, and call `.abort()` on the iterator (or `client.abort()`) to cancel.

```ts
const stream = await ollama.chat({ model: 'qwen3', messages, stream: true, think: true })
let thinking = '', content = ''
const toolCalls: ToolCall[] = []
for await (const chunk of stream) {
  if (chunk.message.thinking) { thinking += chunk.message.thinking }
  if (chunk.message.content)  { content  += chunk.message.content; process.stdout.write(chunk.message.content) }
  if (chunk.message.tool_calls?.length) toolCalls.push(...chunk.message.tool_calls)
  if (chunk.done) console.log('\n', chunk.eval_count, 'tokens in', chunk.eval_duration / 1e6, 'ms')
}
messages.push({ role: 'assistant', thinking, content, tool_calls: toolCalls })
```

Timeouts: the SDK has none built in. Wrap with `AbortSignal.timeout()` via a custom `fetch`, or use one `Ollama` instance per concurrent stream so `abort()` is targeted (the README recommends exactly this).

## Errors

- Non-2xx → `ResponseError` (`name === 'ResponseError'`, fields `error: string`, `status_code: number`). Message is the server's `error` field.
- A mid-stream `{"error"}` line is thrown as a **plain `Error`** from the iterator — no `status_code`. Catch both.
- Network failure (server down, DNS) is the raw `fetch` rejection (`TypeError: fetch failed` in Node), not a `ResponseError`.

```ts
import { ResponseError } from 'ollama'
try { … } catch (err) {
  if (err instanceof ResponseError && err.status_code === 404) { await ollama.pull({ model }) ; retry() }
  else throw err
}
```

## Types you will actually touch

```ts
interface Message {
  role: string                       // 'system' | 'user' | 'assistant' | 'tool' — typed loosely as string
  content: string
  thinking?: string
  images?: Uint8Array[] | string[]   // Node: paths or base64; browser: Uint8Array or base64
  tool_calls?: ToolCall[]
  tool_name?: string                 // on role:'tool' result messages
}
interface ToolCall { function: { name: string; arguments: { [key: string]: any } } }  // object, not string
interface Tool {
  type: string                       // 'function'
  function: { name?: string; description?: string; parameters?: { type?: string; required?: string[]; properties?: Record<string, { type?: string | string[]; description?: string; enum?: any[]; items?: any }>; $defs?: any } }
}
interface ChatRequest {
  model: string; messages?: Message[]; stream?: boolean; format?: string | object
  keep_alive?: string | number; tools?: Tool[]; think?: boolean | 'high' | 'medium' | 'low'   // server also accepts 'max' — cast
  options?: Partial<Options>
}
interface Options {  // all optional in practice
  num_ctx: number; num_predict: number; temperature: number; top_k: number; top_p: number; min_p: number
  seed: number; stop: string[]; repeat_penalty: number; repeat_last_n: number
  presence_penalty: number; frequency_penalty: number; mirostat: number; mirostat_tau: number; mirostat_eta: number
  num_gpu: number; num_thread: number; num_batch: number; use_mmap: boolean; use_mlock: boolean; low_vram: boolean; /* … */
}
```

`ChatResponse` = `{ model, created_at, message: Message, done, done_reason, total_duration, load_duration, prompt_eval_count, prompt_eval_duration, eval_count, eval_duration }`. `ModelResponse` (from `list`/`ps`) includes `name, model, modified_at, size, digest, details, expires_at, size_vram`.

## Cloudflare Workers / edge runtimes

Use the browser build; the default entry imports `node:fs` and will not bundle.

```ts
import { Ollama } from 'ollama/browser'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ollama = new Ollama({
      host: env.OLLAMA_HOST,                                  // e.g. https://ollama.example.com (a Cloudflare Tunnel in front of :11434)
      headers: env.OLLAMA_API_KEY ? { Authorization: `Bearer ${env.OLLAMA_API_KEY}` } : undefined,
    })
    const { message } = await ollama.chat({
      model: 'gemma4',
      messages: [{ role: 'user', content: await request.text() }],
      options: { num_ctx: 16384 },
    })
    return Response.json(message)
  },
}
```

To stream through a Worker, read `res.body` from a raw `fetch` to `/api/chat` and pipe it straight back (`return new Response(res.body, { headers: { 'content-type': 'application/x-ndjson' } })`) — no need to re-parse. Re-parse only when you want to reshape chunks (into SSE, say) or inspect them; if you do, buffer partial lines, because a JSON object is regularly split across two network chunks and a naive `chunk.split('\n')` per read blows up mid-stream on real output. Never `await res.text()` before responding: that buffers the whole reply and silently turns a streaming endpoint into a slow non-streaming one that still looks correct in tests.

When a tunnel fronts the server, run it with `--http-host-header="localhost:11434"` (see `server-config.md`) or the server may reject the Host.

Two things worth getting right in any browser-facing proxy:

- **Whitelist the fields you forward.** A Worker that spreads the client's body (`{ ...body, model }`) lets any visitor set `options.num_ctx`, `keep_alive: -1`, `format`, or a different `model` — on a GPU you are paying for. Pull out `messages` (and validate roles) and build the upstream body yourself.
- **Propagate disconnects.** Pass the incoming `request.signal` to the upstream `fetch` and cancel the upstream body when the client's stream is cancelled. Otherwise a closed browser tab leaves the model generating to nobody, holding the one parallel slot the server has by default.

Truncation has two sides and they need different fixes: a prompt too long for `num_ctx` is dropped silently at the *start* of the conversation (raise `num_ctx`), while a reply that hits the generation limit is reported through `done_reason` (raise `num_predict`, or tell the user). The documented `done_reason` values are `stop`, `load` and `unload`; `length` is what a truncated reply reports in practice but is not in the docs, so treat "not `stop`" as the signal rather than matching `length` exactly. Either way, surface `done_reason` to the client rather than discarding it — it is the only indication the answer was cut off.

## Structured output with Zod

```ts
import * as z from 'zod'
const Country = z.object({ name: z.string(), capital: z.string(), languages: z.array(z.string()) })
const res = await ollama.chat({
  model: 'gemma4',
  messages: [{ role: 'user', content: 'Tell me about Canada. Reply in JSON.' }],
  format: z.toJSONSchema(Country),            // zod ≥4; for zod 3 use zod-to-json-schema
  options: { temperature: 0 },
})
const country = Country.parse(JSON.parse(res.message.content))
```

## Gotchas

- `stream` is off by default; the REST API streams by default. Don't be surprised when a `for await` over a non-stream response fails.
- `abort()` on the client cancels **every** in-flight stream on that instance.
- `OLLAMA_HOST` is ignored; read it yourself: `new Ollama({ host: process.env.OLLAMA_HOST })`.
- `create()` does not support `files`/blob upload; do that with curl or Python.
- `role` and `Tool.type` are plain `string` in the types — typos compile.
- `think` union lacks `'max'`; `think: 'max' as any` works against the server.
- `webSearch` takes `maxResults` (camelCase) while the REST body documents `max_results`. The SDK spreads the request object onto the wire unchanged — it does **not** translate the key — so what the server receives is `maxResults`. If the result count looks wrong, send the raw REST call instead.
- Legacy `embeddings()` returns one vector; `embed()` always returns an array of vectors.
