# Server configuration and operations

Everything here is an environment variable on the **server** process (`ollama serve`), not the client. Where they are set depends on the install:

- macOS app: `launchctl setenv OLLAMA_HOST "0.0.0.0:11434"` then restart the app.
- Linux systemd: `systemctl edit ollama.service` → `[Service]\nEnvironment="OLLAMA_HOST=0.0.0.0:11434"` → `systemctl daemon-reload && systemctl restart ollama`.
- Windows: user environment variables, then restart Ollama from the Start menu.
- Docker: `-e OLLAMA_HOST=…` on `docker run`.
- Ad hoc: `OLLAMA_CONTEXT_LENGTH=65536 ollama serve` (fish: `env OLLAMA_CONTEXT_LENGTH=65536 ollama serve`).

## Contents

- [Environment variables](#environment-variables)
- [Context length](#context-length)
- [Keep-alive and preloading](#keep-alive-and-preloading)
- [Concurrency and queueing](#concurrency-and-queueing)
- [Memory tuning](#memory-tuning)
- [Exposing the server](#exposing-the-server)
- [Diagnostics](#diagnostics)

## Environment variables

| Variable | Default | Effect |
|---|---|---|
| `OLLAMA_HOST` | `127.0.0.1:11434` | Bind address (server) and target (CLI/Python SDK). `0.0.0.0:11434` exposes on all interfaces — pair with a firewall/Tailscale; there is no built-in auth. |
| `OLLAMA_ORIGINS` | `127.0.0.1`, `0.0.0.0` origins | Extra CORS origins, comma-separated. Browser extensions: `chrome-extension://*,moz-extension://*,safari-web-extension://*`. |
| `OLLAMA_MODELS` | `~/.ollama/models` (macOS), `/usr/share/ollama/.ollama/models` (Linux), `C:\Users\%username%\.ollama\models` | Model store. Linux: `chown -R ollama:ollama` the new dir. |
| `OLLAMA_KEEP_ALIVE` | `5m` | How long a model stays loaded after its last request. Same value grammar as the `keep_alive` request field. |
| `OLLAMA_CONTEXT_LENGTH` | VRAM-tiered (see below) | Default `num_ctx` for every model. |
| `OLLAMA_NUM_PARALLEL` | `1` | Parallel requests per loaded model. Memory ≈ × this × context. |
| `OLLAMA_MAX_LOADED_MODELS` | `3 × GPUs` (3 on CPU) | Models resident at once, if they fit. |
| `OLLAMA_MAX_QUEUE` | `512` | Requests queued before returning 503. |
| `OLLAMA_FLASH_ATTENTION` | auto | `1` force on, `0` off. Reduces memory growth with context. |
| `OLLAMA_KV_CACHE_TYPE` | `f16` | `q8_0` (~½ memory, negligible loss) or `q4_0` (~¼, noticeable at long context). Global; needs flash attention. |
| `OLLAMA_NO_CLOUD` | unset | `1` disables cloud models and web search. |
| `HTTPS_PROXY` | unset | Outbound proxy for pulls. **Do not set `HTTP_PROXY`** — it can break client connections. |
| `OLLAMA_API_KEY` | unset | Client-side: Bearer token for ollama.com (read by both SDKs and the CLI). |

Rarer, but real (mostly for diagnosing hardware problems — see `https://docs.ollama.com/troubleshooting.md` and `gpu.md`):

| Variable | Effect |
|---|---|
| `OLLAMA_DEBUG` | `1` adds verbose logging, notably during GPU discovery. First thing to set when a model won't load or lands on CPU. |
| `OLLAMA_LLM_LIBRARY` | Pin the compute backend, bypassing autodetection (e.g. `OLLAMA_LLM_LIBRARY="cpu_avx2" ollama serve`). |
| `OLLAMA_VULKAN` | `0` disables Vulkan GPUs (equivalently `GGML_VK_VISIBLE_DEVICES=-1`). |
| `OLLAMA_VERSION` | Install-script only: pins the version to install (`curl -fsSL https://ollama.com/install.sh \| OLLAMA_VERSION=0.5.7 sh`), not a server setting. |

**Those two tables are the documented set.** Ollama's configuration surface is small and plausible-sounding variables are easy to invent — `OLLAMA_MULTIUSER_CACHE`, `OLLAMA_GPU_LAYERS`, `OLLAMA_BATCH_SIZE` and friends get confidently recommended and do nothing. Before putting an `OLLAMA_*` variable in a config block someone will paste into a systemd unit, either find it above or verify it against `https://docs.ollama.com/faq.md`; if you cannot, say you are unsure rather than shipping it. A recommendation that silently does nothing is worse than an admitted gap, because the user will believe the problem is fixed.

## Context length

Defaults chosen by available VRAM: **< 24 GiB → 4k, 24–48 GiB → 32k, ≥ 48 GiB → 256k** (older docs say a flat 4096). Cloud models run at their maximum.

Ways to raise it, in order of blast radius:

1. Per request: `"options": {"num_ctx": 65536}` (native API only).
2. Per model: `PARAMETER num_ctx 65536` in a Modelfile / `parameters` in `POST /api/create` — the only way for `/v1` clients.
3. Server-wide: `OLLAMA_CONTEXT_LENGTH=65536`.
4. App: the slider in the desktop app settings.

Check what a *running* model actually got with `ollama ps` (CONTEXT column) or `GET /api/ps` → `context_length`. A model's maximum is in `POST /api/show` → `model_info["<arch>.context_length"]`. Agents, coding tools and web search want ≥ 32k–64k; memory grows with it and with `OLLAMA_NUM_PARALLEL`, so a big context can push layers off the GPU (see PROCESSOR column) and slow everything down. Changing `num_ctx` between requests forces a model reload.

## Keep-alive and preloading

- Preload: `curl localhost:11434/api/generate -d '{"model": "gemma4"}'` (or `/api/chat` with an empty `messages`, or `ollama run gemma4 ""`). Response has `done_reason: "load"`.
- Pin: `{"model": "gemma4", "keep_alive": -1}`. Unload now: `{"model": "gemma4", "keep_alive": 0}` or `ollama stop gemma4`.
- Per-request `keep_alive` overrides `OLLAMA_KEEP_ALIVE`.

## Concurrency and queueing

Two levels: several **models** loaded at once (bounded by `OLLAMA_MAX_LOADED_MODELS` and memory), and several **requests** per model (`OLLAMA_NUM_PARALLEL`, default 1 — so by default a second chat waits for the first). Requests that can't be served immediately queue up to `OLLAMA_MAX_QUEUE`, then get `503`. A new model that doesn't fit waits for idle ones to be evicted; on GPU a model must fit entirely in VRAM to load alongside others.

Multi-GPU: a model that fits on one GPU goes there; otherwise it's split across all of them.

**Diagnosing a 503 properly.** "Queue full" is the mechanism, rarely the cause. The default queue is **512 deep**, so a handful of people typing cannot fill it — if you are seeing 503s with a few users, something is multiplying or stalling requests, and raising `OLLAMA_MAX_QUEUE` will convert the errors into long waits instead of fixing anything. Work through:

1. **Is it even Ollama?** Ollama's 503 body is JSON (`{"error": …}`). An HTML 503 came from nginx/Cloudflare/Access in front of it — different problem entirely.
2. **Request multiplication.** Client retries (the OpenAI SDK retries twice by default), per-keystroke or per-message fan-out, or a health-check loop. A handful of users plus automatic retries reaches 512 much faster than it looks.
3. **The queue isn't draining.** With `OLLAMA_NUM_PARALLEL=1` everything serialises behind one slow request; a model spilled to CPU (check `ollama ps` PROCESSOR) makes each one minutes long. Model *reload* thrash is the classic version: two clients asking for different `num_ctx` values, or a chat model and an embedding model that don't co-fit, force an unload/reload between requests while the queue backs up.
4. **Then, and only then, tune.** Raise `OLLAMA_NUM_PARALLEL` (2–4), remembering memory is `num_ctx × parallel`; pin the model with `OLLAMA_KEEP_ALIVE=-1` to stop reload churn; bound concurrency in the *client* with a semaphore so overload becomes backpressure rather than errors.

## Memory tuning

- Quantisation of the *model* is chosen at pull time by tag (`:q4_K_M`, `:q8_0`, `:fp16`) or by `quantize` in `/api/create`.
- Quantisation of the *K/V cache* is `OLLAMA_KV_CACHE_TYPE` (needs flash attention) — the cheap win when long context OOMs.
- `ollama ps` PROCESSOR column: `100% GPU` is what you want; `48%/52% CPU/GPU` means it spilled and will be slow.
- Windows + Radeon defaults to one loaded model (ROCm VRAM reporting).

## Exposing the server

Ollama has **no authentication or TLS** of its own. Options:

- **Tailscale / private network**: `OLLAMA_HOST=0.0.0.0:11434` and rely on the overlay network's ACLs. Simplest for personal infra.
- **Reverse proxy** (nginx): forward to `localhost:11434` and set `proxy_set_header Host localhost:11434;` — Ollama checks the Host header. Add auth at the proxy.
- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:11434 --http-host-header="localhost:11434"`. Put Cloudflare Access in front; a Worker can then call it with a service token in headers.
- **ngrok**: `ngrok http 11434 --host-header="localhost:11434"`.
- **Browser clients** on any non-localhost origin need `OLLAMA_ORIGINS`.

Whatever fronts it, streaming responses are NDJSON — make sure the proxy doesn't buffer (`proxy_buffering off;` in nginx).

## Diagnostics

| Symptom | Look at |
|---|---|
| Connection refused | Is `ollama serve` running? `curl localhost:11434/api/version`. Wrong `OLLAMA_HOST` on the client? |
| 404 on a model | `ollama list` / `GET /api/tags`; pull it. Tag mismatch (`gemma4` vs `gemma4:8b`). |
| Answers truncated / forgets earlier turns | `GET /api/ps` → `context_length`; raise `num_ctx`. Check `prompt_eval_count` vs your estimate. |
| Slow first token | Model load (`load_duration`) — preload or raise `keep_alive`. Spilled to CPU — smaller quant or K/V quantisation. |
| 503 | Queue full; throttle, raise `OLLAMA_NUM_PARALLEL` (memory permitting) or `OLLAMA_MAX_QUEUE`. |
| 500 mid-conversation | Runner OOM/crash — logs (`journalctl -u ollama`, `~/.ollama/logs/server.log` on macOS, `%LOCALAPPDATA%\Ollama` on Windows). Reduce context or model size. |
| Browser CORS error | `OLLAMA_ORIGINS`. |
| Tunnel/proxy returns 403 | Host header — see above. |
| Cloud model 502 | ollama.com unreachable from the local server, or not signed in. |
