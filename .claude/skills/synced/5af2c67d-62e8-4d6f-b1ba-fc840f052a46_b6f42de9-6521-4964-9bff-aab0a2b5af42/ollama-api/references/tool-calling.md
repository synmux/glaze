# Tool calling

Ollama's tool calling is the OpenAI "function" shape on the way in and a simpler, name-keyed shape on the way out. Models need the `tools` capability (`POST /api/show` → `capabilities` contains `"tools"`); send `tools` to one that lacks it and the request fails (a 400 in practice — the docs don't specify), so check first rather than catching it. Good local choices: `qwen3`, `gpt-oss`, `gemma4`, `llama3.1+`, `llama4`, `qwen2.5-coder`, `devstral`, `mistral`; the ollama.com library filters with `?c=tool`, or search results tagged "Tools".

Supported on `/api/chat`, and (in their own dialects — see `compat-openai-anthropic.md`) on `/v1/chat/completions`, `/v1/responses`, and `/v1/messages`. Everything below is the **native** dialect; don't mix it with the OpenAI/Anthropic tool-message shapes.

## Contents

- [Message shapes](#message-shapes)
- [Single call, then answer](#single-call-then-answer)
- [Parallel calls](#parallel-calls)
- [Agent loop](#agent-loop)
- [Streaming with tools](#streaming-with-tools)
- [Design notes](#design-notes)
- [Safety](#safety)

## Message shapes

**Tool definition** (in the request's `tools` array):

```json
{"type": "function",
 "function": {"name": "get_temperature",
              "description": "Get the current temperature for a city",
              "parameters": {"type": "object", "required": ["city"],
                             "properties": {"city": {"type": "string", "description": "City name"}}}}}
```

**Assistant message containing calls** (what the model returns, and what you echo back):

```json
{"role": "assistant", "content": "", "thinking": "…",
 "tool_calls": [{"type": "function", "function": {"index": 0, "name": "get_temperature", "arguments": {"city": "London"}}}]}
```

`arguments` is a JSON object, not a string to parse — that's an OpenAI-dialect habit that doesn't apply here. `index` and `type` may or may not be present; pass back whatever you received.

**Tool result** (what you append before calling again):

```json
{"role": "tool", "tool_name": "get_temperature", "content": "15°C"}
```

No `tool_call_id` in the documented shape. Results are matched by `tool_name` and by order, so append them in the same order as the calls. `content` must be a string — `JSON.stringify`/`json.dumps` structured results.

## Single call, then answer

```bash
# 1. ask, with tools
curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3", "stream": false,
  "messages": [{"role": "user", "content": "What is the temperature in London?"}],
  "tools": [{"type": "function", "function": {"name": "get_temperature", "description": "Current temperature for a city",
             "parameters": {"type": "object", "required": ["city"], "properties": {"city": {"type": "string"}}}}}]
}'
# → message.tool_calls = [{"function": {"name": "get_temperature", "arguments": {"city": "London"}}}]

# 2. run the tool yourself, then send history + result back (tools included again)
curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3", "stream": false,
  "messages": [
    {"role": "user", "content": "What is the temperature in London?"},
    {"role": "assistant", "tool_calls": [{"function": {"name": "get_temperature", "arguments": {"city": "London"}}}]},
    {"role": "tool", "tool_name": "get_temperature", "content": "15°C"}
  ],
  "tools": [ …same tools… ]
}'
# → message.content = "It's 15°C in London."
```

Keep sending `tools` on the follow-up request; models tend to answer better when the definitions stay in context, and the loop below needs them anyway.

## Parallel calls

Capable models return several entries in `tool_calls` at once. Execute all of them (concurrently if you like, if the operations are safe to run concurrently — see Safety below), then append one `role: "tool"` message per call **in the same order**:

```json
[
  {"role": "assistant", "tool_calls": [
    {"function": {"index": 0, "name": "get_temperature", "arguments": {"city": "London"}}},
    {"function": {"index": 1, "name": "get_conditions",  "arguments": {"city": "London"}}}]},
  {"role": "tool", "tool_name": "get_temperature", "content": "15°C"},
  {"role": "tool", "tool_name": "get_conditions",  "content": "Rainy"}
]
```

(the tail of `messages` — the assistant turn you echo back, then one result per call)

## Agent loop

The general pattern — call, execute, append, repeat until the model returns no `tool_calls`. It helps to tell the model in the system prompt that it is in a loop and may call tools repeatedly. Cap iterations and total call count explicitly (e.g. eight rounds, sixteen calls); these are application safeguards, not Ollama defaults, and local models occasionally loop.

```ts
import ollama from 'ollama'   // or 'ollama/browser'

const tools = [/* definitions */]
const impl: Record<string, (args: any) => Promise<unknown>> = { get_temperature: async ({ city }) => lookup(city) }
const messages = [{ role: 'system', content: 'You may call tools as many times as needed before answering.' },
                  { role: 'user', content: 'Compare the weather in London and Tokyo.' }]

for (let turn = 0; turn < 10; turn++) {
  const res = await ollama.chat({ model: 'qwen3', messages, tools, think: true, options: { num_ctx: 32768 } })
  messages.push(res.message)                                   // keeps thinking + tool_calls
  if (!res.message.tool_calls?.length) { console.log(res.message.content); break }
  for (const call of res.message.tool_calls) {
    const fn = impl[call.function.name]
    const result = fn ? await fn(call.function.arguments) : `Unknown tool ${call.function.name}`
    messages.push({ role: 'tool', tool_name: call.function.name, content: typeof result === 'string' ? result : JSON.stringify(result) })
  }
}
```

Python equivalent is in `sdk-python.md` — the SDK derives a JSON Schema tool definition straight from a plain Python function's type hints and Google-style docstring, so you can pass the function object directly in `tools=[...]` instead of hand-writing a schema.

## Streaming with tools

When `stream: true`, `tool_calls` arrive in chunks alongside `thinking` and `content`. A dedicated streaming-aware parser (introduced in Ollama's May 2025 update) understands each model's own template to correctly separate tool-call syntax from regular content, which is what makes reliable streaming tool calls possible at all. Accumulate all three fields, then push a single assistant message with the totals, then the tool results — don't execute a call from a partial chunk:

```python
while True:
    thinking, content, tool_calls = '', '', []
    for chunk in chat(model='qwen3', messages=messages, tools=tools, stream=True, think=True):
        thinking   += chunk.message.thinking or ''
        content    += chunk.message.content or ''
        tool_calls += chunk.message.tool_calls or []
        if chunk.message.content:
            print(chunk.message.content, end='', flush=True)   # stream to the user as it arrives
    messages.append({'role': 'assistant', 'thinking': thinking, 'content': content, 'tool_calls': tool_calls})
    if not tool_calls:
        break
    for call in tool_calls:
        messages.append({'role': 'tool', 'tool_name': call.function.name, 'content': str(run(call))})
```

Do not drop `thinking` when echoing the assistant turn back — thinking models use it to stay coherent across the tool round-trip.

## Design notes

- **Context budget.** Every tool result lands in the prompt. Truncate large results (the docs' search-agent example caps at ~8000 chars) and set `options.num_ctx` to at least 32k for anything beyond a single call — a context window of 32k+ measurably improves tool-calling accuracy. Web-search agents want 64k+.
- **Schema quality matters more than with frontier models.** Small local models follow `description` strings and `enum`s closely and improvise when they are vague. Mark `required` explicitly.
- **No `tool_choice`.** You cannot force or forbid a specific tool via the native API (or the compat layers). Steer with the system prompt, or omit `tools` on the turn where you want a plain answer.
- **Validate arguments** before executing — a model can emit a missing or mistyped field. Return the validation error as the tool result so it can self-correct.
- **Thinking + tools** combine well (`think: true`), and gpt-oss needs a level (`"low"|"medium"|"high"`) rather than a boolean.
- **The OpenAI layer** (`/v1/chat/completions`) uses standard OpenAI shapes there — `tool_calls[].id`, `role: "tool"` with `tool_call_id`, `arguments` as a JSON *string*. Don't mix the two dialects.
- **Model support:** Llama 3.1+/4, Qwen 3 / 3.5 / 2.5 (and 2.5-coder), Devstral, GPT-OSS, Mistral and other models tagged "Tools" on ollama.com/search?c=tool. Verify the specific installed model with `/api/show` rather than trusting the family name.

## Safety

The model's tool requests, and anything a tool then fetches, are untrusted input — a model can emit a malformed or actively adversarial-looking call, and fetched content (web pages, file contents) can contain text that *looks* like instructions. Treat it as data:

- Dispatch through an explicit allowlist mapping tool name → implementation. Never `eval`/`exec` a model-supplied name or expression, and never build a shell command by interpolating a tool argument.
- Validate every argument against its schema before executing, independent of whatever the model claims about types.
- Bound rounds, total call count, per-call execution time and response size. Run dependent/mutating operations in a valid order — the model returning several calls at once is not itself authorisation to run them concurrently if they touch shared state.
- Record completed side effects so a retried turn (after a truncated stream, say) doesn't repeat a mutating action.
- Convert a recoverable tool failure into a tool result the model can react to; stop and surface anything that needs human judgement rather than looping on it.
