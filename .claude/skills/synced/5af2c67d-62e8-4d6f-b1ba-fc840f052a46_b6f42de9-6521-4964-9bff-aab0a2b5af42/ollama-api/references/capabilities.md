# Structured outputs, vision, and thinking

Cross-cutting feature guides for `/api/chat` and `/api/generate` (and, where noted, the compatibility layers — see `compat-openai-anthropic.md` for their exact field names). Tool calling has its own file: `tool-calling.md`. Read only the section the current task needs, and verify the chosen model/server version rather than assuming every Ollama model implements every field.

## Contents

- [Structured outputs](#structured-outputs)
- [Vision (image input)](#vision-image-input)
- [Thinking (reasoning traces)](#thinking-reasoning-traces)

## Structured outputs

Native chat/generate accept `format: "json"` (free-form valid JSON, no schema enforcement) or a JSON Schema object (output constrained to match it exactly — property names, types, required fields). The OpenAI-compatible surface uses `response_format` instead; **structured outputs are not supported on Ollama Cloud** regardless of surface — prompt for JSON and validate client-side there instead.

```json
{
  "model": "gemma4",
  "prompt": "What are the populations of the United States and Canada?",
  "stream": false,
  "format": {
    "type": "object",
    "properties": {
      "countries": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": { "country": {"type": "string"}, "population": {"type": "integer"} },
          "required": ["country", "population"]
        }
      }
    },
    "required": ["countries"]
  }
}
```

Workflow:

1. Define the schema and a matching application validator (Pydantic in Python, Zod in JS) — the *same* schema, so parsing and validation agree.
2. Also restate the requested shape in the prompt text itself; the model is grounded better by the plain-language ask even though `format` separately enforces it.
3. Send `format: schema`, `stream: false`, and a low `temperature` (`0` for extraction-style tasks) — this improves consistency but does not guarantee factual correctness or perfect repeatability.
4. Parse `message.content` (chat) or `response` (generate) as JSON — it's schema-controlled text, but it still arrives as a string inside the outer response.
5. Validate types, required fields and any application-level constraints; treat schema rejection, truncated output (check `done_reason`) and validation failure as three distinct failure modes, and use a bounded retry if you correct one.

```python
import os
from ollama import Client
from pydantic import BaseModel, ConfigDict

class Label(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    name: str
    count: int

client = Client(host=os.environ.get("OLLAMA_HOST", "http://localhost:11434"), timeout=180.0)
result = client.chat(
    model=os.environ["OLLAMA_MODEL"],
    messages=[{"role": "user", "content": 'Return JSON with name "resistor" and count 3.'}],
    format=Label.model_json_schema(),
    stream=False,
    options={"temperature": 0, "num_predict": 128},
)
if result.done_reason == "length":
    raise RuntimeError("Output hit its token limit before completing the JSON")
label = Label.model_validate_json(result.message.content)
```

Works on vision models too — pass `format` alongside `images` for deterministic structured image descriptions. Don't claim full support for every JSON Schema keyword; check the actual schema/model combination if something exotic (`oneOf`, `patternProperties`, …) doesn't seem to be enforced.

## Vision (image input)

Supported on `/api/chat`, `/api/generate`, and (base64-only) both compatibility layers.

Native REST requires **bare base64 image bytes** in `images` — no `data:image/png;base64,` prefix, and no remote HTTP URL. Chat places `images` inside the user message; generate places `images` at the top level.

```bash
IMG=$(base64 < test.jpg | tr -d '\n')
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model": "gemma4", "messages": [{"role": "user", "content": "What is in this image?", "images": ["'"$IMG"'"]}]}'
```

```python
import base64
from pathlib import Path

image = base64.b64encode(Path("image.jpg").read_bytes()).decode("ascii")
body = {
    "model": "<vision-capable-model-tag>",
    "messages": [{"role": "user", "content": "Describe the image.", "images": [image]}],
    "stream": False,
}
```

CLI equivalent: `ollama run gemma4 ./image.png "what is in this image?"`.

The SDKs are more permissive than raw REST: Python and Node accept file paths, `pathlib.Path`, raw bytes, or an already-base64 string and encode for you (a string that *looks* like an image path but doesn't exist raises `ValueError` rather than silently being sent as text). Some official docs describe SDK **URL** support for images, but the actual serialisation code in both the Python and JS/Node libraries does not fetch HTTP URLs — download an authorised remote image explicitly and pass the bytes, rather than trusting that claim. The `ollama/browser` build has no filesystem access at all and needs `Uint8Array` or base64 directly. Validate file size/type before encoding, and think about whether an image is genuinely staying local before sending it to a cloud model.

The OpenAI-compatible layer is the opposite of native on this one point: its `image_url.image_url` field wants a **full data URL** (`data:image/png;base64,...`), not bare base64. Don't mix the two dialects — a bare base64 string in the OpenAI shape, or a data-URL-prefixed string in the native `images` array, both fail silently or with a confusing error depending on version.

## Thinking (reasoning traces)

Thinking-capable models emit a separate reasoning trace alongside the final answer: `message.thinking` on chat, top-level `thinking` on generate. Keep it out of the final-answer text you show the user by default, but retain it when echoing an assistant turn back into a tool-loop or multi-turn history — some thinking models use it to stay coherent across turns. Thinking is **on by default** in the CLI and API for models that support it.

### Enabling

Set `think` on `/api/chat` or `/api/generate`:

- Boolean: `true` / `false`.
- Level string: `"low"`, `"medium"`, `"high"`, `"max"` (`"max"` requests the highest available level for models that support it — current docs list it, but the Python SDK's own type hints only include `low|medium|high`; the server accepts `"max"` at runtime regardless, so cast past the type checker if needed rather than assuming it's rejected).
- **GPT-OSS is the exception**: it only accepts `"low"` | `"medium"` | `"high"` — boolean values are ignored, and the trace can't be fully disabled.
- **IBM Granite 4.2** is also an exception in the other direction: it uses its own `enable_thinking` / `reasoning_effort` parameter pair inside `options` rather than the plain top-level `think` field.

### Supported models

Qwen 3, GPT-OSS, DeepSeek-v3.1, DeepSeek R1, Granite 4.2, and others tagged "thinking" on `ollama.com/search?c=thinking`. Check a specific installed model's actual support via `/api/show` → `capabilities` rather than trusting the family name.

### Streaming

Thinking tokens interleave *before* answer tokens in a stream — detect the first non-empty `thinking` chunk to start rendering a "thinking" UI section, then switch over once `message.content` starts arriving. Accumulate `thinking` and `content` as separate strings; don't concatenate them together.

### CLI quick reference

```bash
ollama run deepseek-r1 --think "Where should I visit in Lisbon?"
ollama run deepseek-r1 --think=false "Summarize this article"
ollama run deepseek-r1 --hidethinking "Is 9.9 bigger or 9.11?"
ollama run gpt-oss --think=low "Draft a headline"
```

Inside an interactive session: `/set think`, `/set nothink`, `/set think low|medium|high`.
