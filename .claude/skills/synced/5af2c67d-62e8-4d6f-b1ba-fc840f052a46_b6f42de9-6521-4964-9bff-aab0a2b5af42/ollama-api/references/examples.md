# Copy-paste Examples

All examples target the local daemon at `http://localhost:11434` unless
noted. Swap in `https://ollama.com` + `Authorization: Bearer $OLLAMA_API_KEY`
for cloud usage.

## Generate

```bash
# Default (streaming)
curl http://localhost:11434/api/generate -d '{
  "model": "gemma4",
  "prompt": "Why is the sky blue?"
}'

# Non-streaming
curl http://localhost:11434/api/generate -d '{
  "model": "gemma4",
  "prompt": "Why is the sky blue?",
  "stream": false
}'

# With sampling options
curl http://localhost:11434/api/generate -d '{
  "model": "gemma4",
  "prompt": "Why is the sky blue?",
  "options": { "temperature": 0.8, "top_p": 0.9, "seed": 42 }
}'

# Load model into memory only (empty prompt)
curl http://localhost:11434/api/generate -d '{ "model": "gemma4" }'

# Unload model immediately
curl http://localhost:11434/api/generate -d '{ "model": "gemma4", "keep_alive": 0 }'
```

```python
import ollama
response = ollama.generate(model='gemma4', prompt='Why is the sky blue?')
print(response.response)
```

## Chat

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4",
  "messages": [{ "role": "user", "content": "why is the sky blue?" }]
}'
```

```python
import ollama
response = ollama.chat(model='gemma4', messages=[
    {'role': 'user', 'content': 'why is the sky blue?'}
])
print(response.message.content)
```

```javascript
import { Ollama } from "ollama";
const ollama = new Ollama();
const response = await ollama.chat({
  model: "gemma4",
  messages: [{ role: "user", content: "why is the sky blue?" }],
});
console.log(response.message.content);
```

## Chat with tool calling

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3",
  "messages": [{ "role": "user", "content": "What is the weather today in Paris?" }],
  "stream": false,
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_current_weather",
      "description": "Get the current weather for a location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": { "type": "string", "description": "e.g. San Francisco, CA" },
          "format": { "type": "string", "enum": ["celsius", "fahrenheit"] }
        },
        "required": ["location", "format"]
      }
    }
  }]
}'
```

```python
import ollama

def get_current_weather(location: str, format: str) -> str:
    """Get the current weather for a location.

    Args:
        location: The location to get the weather for.
        format: 'celsius' or 'fahrenheit'.
    """
    return f"22 degrees {format} in {location}"

response = ollama.chat(
    model='llama3.1',
    messages=[{'role': 'user', 'content': 'What is the weather in Toronto?'}],
    tools=[get_current_weather],
)
for call in response.message.tool_calls or []:
    fn = {'get_current_weather': get_current_weather}.get(call.function.name)
    print(fn(**call.function.arguments) if fn else 'unknown tool')
```

## Streaming with accumulated tool calls (Python)

```python
import ollama

messages = [{'role': 'user', 'content': 'What is the weather in Paris and Tokyo?'}]
stream = ollama.chat(model='qwen3', messages=messages, tools=[...], stream=True)

content = ''
thinking = ''
tool_calls = []
for chunk in stream:
    if chunk.message.thinking:
        thinking += chunk.message.thinking
    if chunk.message.content:
        content += chunk.message.content
    if chunk.message.tool_calls:
        tool_calls.extend(chunk.message.tool_calls)

print('Thinking:', thinking)
print('Content:', content)
print('Tool calls:', tool_calls)
```

## Chat with thinking

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gpt-oss",
  "messages": [{ "role": "user", "content": "What is 1+1?" }],
  "think": "low"
}'
```

## Chat with vision (image input)

```bash
curl -L -o test.jpg "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"
IMG=$(base64 < test.jpg | tr -d '\n')
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma4",
    "messages": [{ "role": "user", "content": "What is in this image?", "images": ["'"$IMG"'"] }]
  }'
```

```python
import ollama
response = ollama.chat(model='gemma4', messages=[{
    'role': 'user',
    'content': 'What is in this image?',
    'images': ['./test.jpg'],  # SDK accepts a file path directly
}])
print(response.message.content)
```

## Structured outputs (JSON Schema)

```bash
curl http://localhost:11434/api/generate -d '{
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
}'
```

```python
from pydantic import BaseModel
import ollama

class Country(BaseModel):
    country: str
    population: int

class Countries(BaseModel):
    countries: list[Country]

response = ollama.chat(
    model='gemma4',
    messages=[{'role': 'user', 'content': 'Populations of the US and Canada?'}],
    format=Countries.model_json_schema(),
)
result = Countries.model_validate_json(response.message.content)
```

## Embeddings

```bash
# Single input
curl http://localhost:11434/api/embed -d '{
  "model": "embeddinggemma",
  "input": "Why is the sky blue?"
}'

# Multiple inputs
curl http://localhost:11434/api/embed -d '{
  "model": "embeddinggemma",
  "input": ["Why is the sky blue?", "Why is the grass green?"]
}'

# With dimensions
curl http://localhost:11434/api/embed -d '{
  "model": "embeddinggemma",
  "input": "Generate embeddings for this text",
  "dimensions": 128
}'
```

```python
import ollama
response = ollama.embed(model='embeddinggemma', input='Why is the sky blue?')
print(response.embeddings)
```

## Model management

```bash
# List local models
curl http://localhost:11434/api/tags

# List running models
curl http://localhost:11434/api/ps

# Show model details
curl http://localhost:11434/api/show -d '{ "model": "gemma4" }'
curl http://localhost:11434/api/show -d '{ "model": "gemma4", "verbose": true }'

# Create a model with a custom system prompt
curl http://localhost:11434/api/create -d '{
  "model": "mario",
  "from": "gemma4",
  "system": "You are Mario from Super Mario Bros."
}'

# Copy a model
curl http://localhost:11434/api/copy -d '{ "source": "gemma4", "destination": "gemma4-backup" }'

# Pull a model
curl http://localhost:11434/api/pull -d '{ "model": "llama3.2" }'

# Push a model (requires auth)
curl http://localhost:11434/api/push -d '{ "model": "myuser/mymodel" }'

# Delete a model
curl -X DELETE http://localhost:11434/api/delete -d '{ "model": "gemma4" }'

# Version
curl http://localhost:11434/api/version
```

## OpenAI-compatible chat completion

```python
from openai import OpenAI
client = OpenAI(base_url='http://localhost:11434/v1/', api_key='ollama')
completion = client.chat.completions.create(
    model="llama3.1",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(completion.choices[0].message.content)
```

## Anthropic-compatible messages

```bash
curl -X POST http://localhost:11434/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: ollama" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model": "qwen3-coder", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello!"}]}'
```

## Web search + web fetch (cloud, requires OLLAMA_API_KEY)

```bash
curl https://ollama.com/api/web_search \
  --header "Authorization: Bearer $OLLAMA_API_KEY" \
  -d '{"query": "what is ollama?"}'

curl --request POST \
  --url https://ollama.com/api/web_fetch \
  --header "Authorization: Bearer $OLLAMA_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"url": "ollama.com"}'
```
