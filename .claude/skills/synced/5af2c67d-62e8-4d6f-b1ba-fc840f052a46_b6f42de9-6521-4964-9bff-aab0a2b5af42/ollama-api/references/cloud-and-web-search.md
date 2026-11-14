# Ollama Cloud and web search

## Contents

- [Two ways to reach cloud models](#two-ways-to-reach-cloud-models)
- [Authentication](#authentication)
- [Differences from local](#differences-from-local)
- [Web search and fetch](#web-search-and-fetch)
- [Search-agent pattern](#search-agent-pattern)
- [Retirements](#retirements)
- [Disabling cloud](#disabling-cloud)

## Two ways to reach cloud models

| Route | Model name | Auth | When |
|---|---|---|---|
| **Proxied** through a local server | `gpt-oss:120b-cloud` (the `-cloud` / `:cloud` suffix marks it) | `ollama signin` once on that machine; requests to `localhost:11434` are then signed automatically | You already talk to a local server and want bigger models without changing client code |
| **Direct** to ollama.com | `gpt-oss:120b` (no suffix) | `Authorization: Bearer $OLLAMA_API_KEY` | Serverless / Workers / CI — nothing local to sign in |

Proxied: `ollama pull gpt-oss:120b-cloud` registers it locally (nothing large downloads), then use it like any model. `GET /api/tags` shows `remote_model` / `remote_host` for these.

Direct: same API surface at `https://ollama.com/api/…` (and `/v1/…` for the OpenAI layer). `GET https://ollama.com/api/tags` lists what's available; browse at `https://ollama.com/search?c=cloud`.

```bash
curl https://ollama.com/api/chat -H "Authorization: Bearer $OLLAMA_API_KEY" -d '{
  "model": "gpt-oss:120b", "stream": false,
  "messages": [{"role": "user", "content": "Why is the sky blue?"}]
}'
```

```ts
import { Ollama } from 'ollama/browser'
const cloud = new Ollama({ host: 'https://ollama.com', headers: { Authorization: `Bearer ${env.OLLAMA_API_KEY}` } })
```

```python
from ollama import Client
cloud = Client(host='https://ollama.com', headers={'Authorization': 'Bearer ' + os.environ['OLLAMA_API_KEY']})
```

Both SDKs pick up `OLLAMA_API_KEY` from the environment, but **not on the same terms** — and the difference matters:

- **JS** injects it only when the request is `https://ollama.com`. Point it at your own server and the key is not sent.
- **Python** injects it for *any* host whenever no `authorization` header was supplied. Point a `Client` at a colleague's box or a third-party proxy with `OLLAMA_API_KEY` exported and you have handed over your ollama.com credential. Pass `headers={'Authorization': ...}` explicitly (even a dummy) when talking to a host you don't control, or unset the variable.

## Authentication

- Create keys at `https://ollama.com/settings/keys`. They do not expire; revoke there.
- `ollama signin` links a local install by registering its public key (`~/.ollama/id_ed25519.pub`, or `/usr/share/ollama/.ollama/` on Linux systemd installs). Needed for cloud models via localhost, `ollama push`, and pulling private models.
- Local-only requests never need auth.

## Differences from local

- **No structured outputs** (`format`) on cloud models. Prompt for JSON and validate instead.
- Cloud models run at their **maximum context length** by default — no `num_ctx` fiddling.
- Extra status codes: `429` rate limit, `502` when the cloud model can't be reached from the local proxy.
- Privacy statement (FAQ): cloud prompts/responses are processed to serve the request, not stored or trained on.

## Web search and fetch

Cloud-only, key required, free account is enough.

```bash
curl https://ollama.com/api/web_search -H "Authorization: Bearer $OLLAMA_API_KEY" \
  -d '{"query": "what is ollama?", "max_results": 3}'
# {"results": [{"title": "…", "url": "…", "content": "…"}]}

curl https://ollama.com/api/web_fetch -H "Authorization: Bearer $OLLAMA_API_KEY" \
  -d '{"url": "https://ollama.com"}'
# {"title": "…", "content": "…markdown-ish…", "links": ["…"]}
```

`max_results` is 1–10 and the REST default is 5, but the Python SDK sends its own default of `3` on every call, so the REST default never applies through it — pass `max_results` explicitly if you want 5. SDK: `ollama.web_search(query, max_results=)` / `ollama.web_fetch(url)` in Python; `client.webSearch({ query, maxResults })` / `client.webFetch({ url })` in JS (note the camelCase key goes onto the wire unchanged). The SDK methods always hit ollama.com regardless of the client's `host`.

## Search-agent pattern

The Python SDK's `web_search` and `web_fetch` are ordinary functions, so they can be passed straight in as tools:

```python
from ollama import chat, web_fetch, web_search

tools = {'web_search': web_search, 'web_fetch': web_fetch}
messages = [{'role': 'user', 'content': "what is ollama's new engine?"}]

while True:
    response = chat(model='qwen3:4b', messages=messages, tools=list(tools.values()), think=True,
                    options={'num_ctx': 32768})
    messages.append(response.message)
    if not response.message.tool_calls:
        print(response.message.content); break
    for call in response.message.tool_calls:
        fn = tools.get(call.function.name)
        result = str(fn(**call.function.arguments))[:8000] if fn else f'Tool {call.function.name} not found'
        messages.append({'role': 'tool', 'tool_name': call.function.name, 'content': result})
```

Search results are large; the docs recommend a context of at least ~32k and truncating tool results. There is also an MCP server example (`ollama-python/examples/web-search-mcp.py`) for exposing search to Cline, Codex, Goose etc.

## Retirements

Cloud models get retired as better open models land; users are emailed and a table lives at `https://docs.ollama.com/cloud.md`. Don't hard-code a cloud model name in something long-lived without a fallback — check `GET https://ollama.com/api/tags` at startup or handle 404 by switching to the documented replacement. Local models are unaffected.

## Disabling cloud

`OLLAMA_NO_CLOUD=1` on the server, or `{"disable_ollama_cloud": true}` in `~/.ollama/server.json`, then restart. Logs show `Ollama cloud disabled: true`. This removes cloud models and web search.
