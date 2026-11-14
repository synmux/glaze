# Imports, migration, and documentation drift

Read this for file-based model creation (GGUF/safetensors/LoRA adapter uploads), or whenever a documented feature appears to be missing from a generated type or schema. Ollama's API is not strictly versioned, and its published OpenAPI schema lags its actual source — this file records where the two disagree so a schema omission doesn't get mistaken for "not supported."

## Contents

- [Blob-based model imports](#blob-based-model-imports)
- [Migration traps](#migration-traps)
- [Resolving conflicting documentation](#resolving-conflicting-documentation)

## Blob-based model imports

The repository guide (`github.com/ollama/ollama/blob/main/docs/api.md`) documents REST imports using uploaded blobs and `files`/`adapters` mappings on `/api/create`; the published OpenAPI schema omits both the blob routes and those fields entirely. Treat that omission as a documentation gap, not proof of no support — verify against the installed server before relying on it either way.

1. Confirm model provenance, licence, architecture, available disk space, and the intended destination model name.
2. Compute SHA-256 over each file's exact bytes: `shasum -a 256 model.gguf`.
3. Check `HEAD /api/blobs/sha256:<hex>` on the target server: 200 means the blob is already present, 404 means it needs uploading.
4. Upload any absent files as raw bytes via `POST /api/blobs/sha256:<hex>` — not JSON, not base64 text, not multipart form data: `curl -T model.gguf -X POST "$HOST/api/blobs/sha256:<hex>"`. Expect 201; a digest mismatch is a 400.
5. Call `/api/create` with `files` mapping filenames to their `sha256:<hex>` digests, and wait for the terminal `{"status": "success"}`.
6. Verify the created model with `/api/show` and one small, capability-appropriate test request.

```bash
: "${OLLAMA_BASE_URL:?Set the approved server origin}"
: "${DIGEST:?Set sha256: followed by the file hash}"
curl --silent --show-error --head --connect-timeout 5 --max-time 30 \
  "$OLLAMA_BASE_URL/api/blobs/$DIGEST"

# Only when the HEAD result is 404:
curl --fail-with-body --silent --show-error \
  --connect-timeout 5 --max-time 3600 \
  -X POST -H 'Content-Type: application/octet-stream' \
  --upload-file model.gguf "$OLLAMA_BASE_URL/api/blobs/$DIGEST"
```

```json
{
  "model": "my-import:latest",
  "files": {"model.gguf": "sha256:<actual-file-hash>"},
  "stream": false
}
```

For Safetensors, upload the required weights and supporting files and map each filename to its digest the same way. `adapters` uses an identical filename→digest mapping for LoRA adapters — match an adapter to its actual base model, since a mismatched base gives erratic results, not a clean error.

The blob route addresses the Ollama *server*, not `ollama.com` directly. If the chosen SDK can't express this — the JS `ollama` library's README explicitly states `files` upload isn't currently supported there — use direct HTTP, or fall back to the documented CLI Modelfile import flow (`docs.ollama.com/import`) rather than pretending a type cast adds missing runtime functionality.

## Migration traps

| Old or incorrect assumption | Use instead |
|---|---|
| `/api/embeddings` with `prompt`, reading singular `embedding` | `/api/embed` with `input`, reading `embeddings[0]` for one item — retest actual dimensions/numerics during migration rather than assuming identical vectors come back. |
| Generate's `context` token array as conversation state | `/api/chat`'s `messages` history. `context` is explicitly deprecated. |
| A full Modelfile JSON-encoded into a `modelfile` field on `/api/create` | The current documented create fields (`from`, `system`, `parameters`, `template`, or verified `files` mappings), or the actual CLI Modelfile import flow if that's the chosen workflow. |
| "Missing from the generic schema" ⇒ "strip it from my messages" | Preserve `tool_name` and assistant `thinking` for tool loops regardless — the generic `ChatMessage` in the OpenAPI snapshot omits both even though the capability guides' own examples rely on them. |
| Native `logprobs` support implies the OpenAI-compat layer supports it too | It doesn't — the OpenAI compatibility guide explicitly marks logprobs unsupported there, even though native chat/generate list logprob fields. |

## Resolving conflicting documentation

Use the feature-specific guide and the actual repository source alongside the installed server version and a minimal test — and keep a genuine discrepancy visible in your notes/code comments rather than silently picking one side and presenting it as settled fact.

- **Cloud capabilities:** generic cloud prose implies capability parity with local models, but the structured-outputs guide explicitly excludes Ollama Cloud. The specific exclusion wins.
- **Context defaults:** the context-length guide gives hardware-tiered defaults (4k/32k/256k) while the FAQ states a flat 4096 and the Modelfile reference still says 2048. Configure explicitly and read back the actual allocation from `/api/ps` rather than baking in any one of these numbers.
- **Anthropic streaming `error` event:** listed as a supported event in one part of the compatibility page and listed under "not supported" elsewhere on the same page. Handle both an HTTP-level failure and a mid-stream `error` event defensively; don't assume exactly one of them will occur.
- **Model examples in older docs/pages:** cloud models get retired on a rolling basis (see `cloud-and-web-search.md` → Retirements) — enumerate what's actually available via `/api/tags` rather than recommending a name from an older example or integration page.

Start fresh discovery at the documentation index (`docs.ollama.com/llms.txt`) and follow its actual URLs — note that some current native-API pages live under `api-reference/` rather than `api/`, so a URL pattern guessed from one page doesn't reliably generalise to another. A documentation review date (including the one in this skill) is not a server compatibility guarantee; the API is not strictly versioned, so check the running server's actual `/api/version` and behaviour when it matters.
