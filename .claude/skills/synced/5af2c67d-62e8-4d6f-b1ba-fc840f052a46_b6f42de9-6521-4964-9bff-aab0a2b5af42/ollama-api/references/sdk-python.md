# Python SDK (`ollama` on PyPI)

Repo: `github.com/ollama/ollama-python`. Facts checked against `ollama/_client.py`, `ollama/_types.py`, `ollama/__init__.py` at v0.6.x. Requires Python ≥ 3.8, `httpx ≥ 0.27`, `pydantic ≥ 2.9`.

## Contents

- [Install and clients](#install-and-clients)
- [Methods](#methods)
- [Streaming](#streaming)
- [Errors](#errors)
- [Response objects](#response-objects)
- [Tools from plain functions](#tools-from-plain-functions)
- [Images](#images)
- [Structured output with Pydantic](#structured-output-with-pydantic)
- [Async](#async)
- [Gotchas](#gotchas)

## Install and clients

```bash
pip install -U ollama      # or: uv add ollama
```

```python
import ollama                      # module-level functions bound to ONE global Client() created at import
from ollama import Client, AsyncClient

client = Client(
    host='http://127.0.0.1:11434',   # default; falls back to $OLLAMA_HOST when omitted
    headers={'Authorization': 'Bearer ' + os.environ['OLLAMA_API_KEY']},   # optional
    timeout=120,                     # passed to httpx; default None (no timeout)
    # any other httpx.Client kwarg: verify=, proxies=, transport=, …
)
```

- `OLLAMA_HOST` is honoured (unlike the JS SDK). `OLLAMA_API_KEY` is auto-injected as a Bearer header if set and no `authorization` header was given.
- Both clients are context managers (`with Client() as c:`) and have `.close()`.
- Module-level `ollama.chat(...)` etc. are *bound methods of a single global client* built at import time. Changing `os.environ['OLLAMA_HOST']` afterwards does nothing to them — construct your own `Client`.

## Methods

Identical on `Client` (sync) and `AsyncClient` (awaitable). `model` is the first positional parameter everywhere.

| Method | Returns | Streams? |
|---|---|---|
| `chat(model, messages=, tools=, stream=, format=, options=, keep_alive=, think=)` | `ChatResponse` | yes |
| `generate(model, prompt=, suffix=, system=, template=, raw=, images=, format=, options=, keep_alive=, think=, stream=)` | `GenerateResponse` | yes |
| `embed(model, input=, truncate=, dimensions=, options=, keep_alive=)` | `EmbedResponse` (`.embeddings: list[list[float]]`) | no |
| `embeddings(model, prompt=)` — legacy | `EmbeddingsResponse` (`.embedding`) | no |
| `pull(model, insecure=, stream=)` / `push(model, …)` | `ProgressResponse` | yes |
| `create(model, from_=, files=, adapters=, template=, system=, parameters=, messages=, quantize=, license=, stream=)` | `ProgressResponse` | yes |
| `create_blob(path)` — only on client instances, not module level | digest string | no |
| `list()` / `ps()` | `ListResponse` / `ProcessResponse` (`.models`) | no |
| `show(model)` | `ShowResponse` (`.capabilities`, `.modelinfo`, `.parameters`, `.template`, `.details`) | no |
| `copy(source, destination)` / `delete(model)` | `StatusResponse` | no |
| `web_search(query, max_results=)` / `web_fetch(url)` | `WebSearchResponse` / `WebFetchResponse` | no |

## Streaming

`stream=False` by default. `stream=True` returns an `Iterator[...]` (sync) or `AsyncIterator[...]` (async) of the same response type, one per NDJSON line. Cancel by breaking out of the loop.

```python
from ollama import chat

thinking, content, tool_calls = '', '', []
for chunk in chat(model='qwen3', messages=messages, stream=True, think=True):
    if chunk.message.thinking:
        thinking += chunk.message.thinking
    if chunk.message.content:
        content += chunk.message.content
        print(chunk.message.content, end='', flush=True)
    if chunk.message.tool_calls:
        tool_calls.extend(chunk.message.tool_calls)
    if chunk.done:
        print(f'\n{chunk.eval_count} tokens, {chunk.eval_duration / 1e9:.2f}s')
messages.append({'role': 'assistant', 'thinking': thinking, 'content': content, 'tool_calls': tool_calls})
```

A mid-stream `{"error": …}` line raises `ResponseError` from inside the iterator.

## Errors

| Exception | When | Fields |
|---|---|---|
| `ollama.ResponseError` | Any non-2xx, or an `error` line mid-stream | `.error` (str), `.status_code` (int, -1 if unknown); `str(e)` → `"<error> (status code: N)"` |
| `ollama.RequestError` | Client-side validation, e.g. missing `model` | `.error` |
| built-in `ConnectionError` | Server unreachable on a **non-streaming** call (`httpx.ConnectError` is re-raised as this) | message points at ollama.com/download |
| raw `httpx.ConnectError` / `httpx.TransportError` | Server unreachable on a **streaming** call | The re-raise happens in the non-streaming path only, so a streamed call leaks the httpx exception |

Catch both connection types whenever the call might be streamed — a script that guards only `ConnectionError` around a `stream=True` call still dies with a traceback when the server is down:

```python
import httpx
from ollama import chat, pull, ResponseError

try:
    for chunk in chat(model, messages=[{'role': 'user', 'content': 'hi'}], stream=True):
        ...
except ResponseError as e:
    if e.status_code == 404:
        pull(model)          # then retry
    else:
        raise
except (ConnectionError, httpx.TransportError):     # httpx.ConnectError subclasses TransportError
    raise SystemExit('Ollama is not running on ' + host)
```

Check the model exists with `show()` *before* the first chat rather than catching 404 from `chat()`: a model that is present but lacks a capability you asked for (`tools`, `think`) returns 400, not 404, so a 404-only guard misdiagnoses it.

## Response objects

Every request/response type is a Pydantic `SubscriptableBaseModel`: attribute access **and** dict-style access both work (`response.message.content` == `response['message']['content']`), plus `.get()`, `in`, `.model_dump()`.

Useful fields: `ChatResponse.message` (`role`, `content`, `thinking`, `images`, `tool_calls`, `tool_name`), `.done`, `.done_reason`, `.prompt_eval_count`, `.eval_count`, `.total_duration` (ns). `GenerateResponse.response` / `.thinking`. `ShowResponse.capabilities` is the list to check before using tools/vision/thinking.

## Tools from plain functions

Pass callables directly in `tools=`; the SDK builds the JSON schema from type hints plus a **Google-style docstring** (the `Args:` section supplies parameter descriptions; an unannotated parameter becomes `string`). Explicit schema dicts and `ollama.Tool` objects are accepted too.

```python
from ollama import chat

def get_temperature(city: str) -> str:
    """Get the current temperature for a city.

    Args:
      city: The name of the city
    """
    return {'London': '15°C'}.get(city, 'Unknown')

available = {'get_temperature': get_temperature}
messages = [{'role': 'user', 'content': 'How warm is London?'}]

while True:
    response = chat(model='qwen3', messages=messages, tools=list(available.values()), think=True)
    messages.append(response.message)                       # keeps thinking + tool_calls intact
    if not response.message.tool_calls:
        break
    for call in response.message.tool_calls:
        fn = available.get(call.function.name)
        result = fn(**call.function.arguments) if fn else f'Unknown tool {call.function.name}'
        messages.append({'role': 'tool', 'tool_name': call.function.name, 'content': str(result)})
print(response.message.content)
```

`call.function.arguments` is already a `dict`. Tool results go back as `{'role': 'tool', 'tool_name': …, 'content': …}` — no `tool_call_id`.

## Images

`images=[...]` on a message (chat) or the request (generate) accepts `str` file paths, `pathlib.Path`, raw `bytes`, or an already-base64 `str`. The `ollama.Image` type wraps these and base64-encodes at serialisation; a string that *looks* like an image path (`.png/.jpg/.jpeg/.webp`) but doesn't exist raises `ValueError` rather than being sent as base64.

```python
chat(model='gemma4', messages=[{'role': 'user', 'content': 'Describe this.', 'images': ['./photo.jpg']}])
```

## Structured output with Pydantic

```python
from pydantic import BaseModel
from ollama import chat

class Country(BaseModel):
    name: str
    capital: str
    languages: list[str]

response = chat(
    model='gemma4',
    messages=[{'role': 'user', 'content': 'Tell me about Canada. Reply in JSON.'}],
    format=Country.model_json_schema(),
    options={'temperature': 0},
)
country = Country.model_validate_json(response.message.content)
```

`format` accepts `'json'` or any JSON-schema dict. Validate — the server enforces the grammar but not semantics.

## Async

```python
import asyncio
from ollama import AsyncClient

async def main():
    client = AsyncClient()
    async for chunk in await client.chat('gemma4', messages=[{'role': 'user', 'content': 'hi'}], stream=True):
        print(chunk.message.content, end='', flush=True)

asyncio.run(main())
```

Note the `await client.chat(...)` *then* `async for` — the call returns the iterator.

## Gotchas

- `create()` uses `from_=` (trailing underscore) because `from` is a keyword; it serialises to `"from"`.
- `stream=False` by default — opposite of the REST API.
- Server down → plain `ConnectionError`, so `except ResponseError` alone will not catch it.
- `think` is typed `bool | Literal['low','medium','high']`; the server also accepts `'max'` (type checkers will complain, runtime is fine).
- The sync `Client.web_search/web_fetch` raise `ValueError` if no Bearer header is configured; `AsyncClient` skips that check and you get the server's 401 instead.
- Default `timeout=None` means a hung server hangs your program. Set one.
- Module-level functions share one client; for a different host or headers build `Client(...)` explicitly.
