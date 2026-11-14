# Scripts and verification

Three bundled scripts cover three different jobs — discovery, making one raw request, and validating/aggregating a captured stream. None of them require third-party packages; all are Python 3.9+ standard library only (the probe script and the stream aggregator are typed for 3.9+/3.10+ style but avoid non-stdlib imports either way). Only `read_ndjson.py` has an offline test suite, because it's the one with real parsing logic; the other two are thin, deliberately dumb wrappers around `urllib` where the interesting behaviour is what the *server* does, not the client.

## Contents

- [`ollama_probe.py` — what's on this server](#ollama_probepy--whats-on-this-server)
- [`ollama_request.py` — make one raw request](#ollama_requestpy--make-one-raw-request)
- [`read_ndjson.py` — validate/aggregate a captured stream](#read_ndjsonpy--validateaggregate-a-captured-stream)
- [Run the offline test suite](#run-the-offline-test-suite)
- [Live acceptance checks](#live-acceptance-checks)

## `ollama_probe.py` — what's on this server

```bash
python3 scripts/ollama_probe.py [HOST] [MODEL] [--json] [--timeout SECONDS]
```

Read-only discovery: hits `/api/version`, `/api/tags`, `/api/ps`, and — when `MODEL` is given — `/api/show`, then reports version, installed models, currently loaded models (with GPU share and active context), and for the named model its `capabilities` array, family/quant details, maximum context length, and Modelfile parameters, plus an explicit note for each of `tools`/`vision`/`thinking` the model *doesn't* have. `--json` emits the same as one document for feeding into other tooling. Run this **first**, before writing integration code — most "Ollama is broken" reports turn out to be "the model doesn't support tools" or "the context window is 4k and the prompt is 9k," and both are visible here in seconds.

Exit codes: `0` ok, `1` usage error, `2` server unreachable, `3` auth rejected (401/403). Pass `https://ollama.com` as `HOST` (with `OLLAMA_API_KEY` set) to inspect the cloud catalogue instead of a local daemon. Treat `2`/`3` as "write the code, but say plainly that live verification wasn't possible here" rather than working around it.

## `ollama_request.py` — make one raw request

```bash
python3 scripts/ollama_request.py {version,tags,ps,show,chat,generate,embed,pull,create,copy,push,delete,web_search,web_fetch} \
  [--host HOST] [--data FILE|-] [--api-key-env ENV_NAME] [--timeout SECONDS]
```

A minimal, strict native-API client for one-off diagnostic requests: builds the URL, sends the body from `--data` (a file, or `-` for stdin), prints each returned JSON/NDJSON object as one line, and checks terminal state before exiting `0` — chat/generate need a final `done: true`, pull/create/push need a final `status: "success"`, copy/delete tolerate an empty body. It refuses redirects (fails loudly rather than silently following one to an unintended host), validates the host is a bare HTTP(S) origin (optionally `/api`-suffixed), and rejects a non-object JSON body before sending it. It sends an `Authorization` header **only** when you pass `--api-key-env NAME` explicitly — it never reads `OLLAMA_API_KEY` implicitly, so there's no risk of the Python-SDK auth-leak footgun described in `operations.md`.

It does **not**: aggregate streamed assistant text into one string, execute tools, retry, follow redirects, upload blobs, or parse the OpenAI/Anthropic compatibility layers' SSE framing — it is a native NDJSON/JSON tool only. Its `--timeout` bounds individual blocking socket operations, not a whole-request deadline; output already printed before a failure is genuinely partial data, not a complete-but-truncated response.

```bash
python3 scripts/ollama_request.py version
python3 scripts/ollama_request.py tags
python3 - <<'PY' > request.json
import json, os
print(json.dumps({
    "model": os.environ["OLLAMA_MODEL"],
    "messages": [{"role": "user", "content": "Reply with one short sentence."}],
    "stream": False,
    "options": {"num_predict": 128}
}))
PY
python3 scripts/ollama_request.py chat --data request.json
```

For a streamed request, pipe its output straight into the aggregator below:

```bash
set -o pipefail
python3 scripts/ollama_request.py chat --data streamed-request.json | python3 scripts/read_ndjson.py --kind chat
```

## `read_ndjson.py` — validate/aggregate a captured stream

```bash
python3 scripts/read_ndjson.py --kind chat < captured-chat.ndjson
python3 scripts/read_ndjson.py --kind generate < captured-generate.ndjson
python3 scripts/read_ndjson.py --kind status < captured-pull.ndjson
```

Reads NDJSON from stdin and emits **one** JSON object on stdout, but only after a successful, complete stream — a reconstructed assistant `message` (content + thinking + tool_calls + images, all correctly accumulated) for `chat`, concatenated `response`/`thinking` for `generate`, or the final status object for `status`. Any error goes to stderr with exit code 1, and nothing is printed to stdout on failure — no partial-success output to accidentally treat as done.

It's deliberately strict, which is the point when you're debugging a stream parser: it rejects a line after the terminal event, malformed JSON or non-UTF-8 bytes, a non-finite/overflowing number, a `done`/`status` field of the wrong type, a tool call missing a name or with non-object `arguments`, and non-string entries in `images`. It handles the fiddly correctness cases most hand-rolled parsers get wrong on the first try: blank lines, a missing final newline, CRLF line endings, and a multi-byte UTF-8 character split across two reads.

Limitations worth knowing before reaching for it: it has no HTTP layer at all (no auth, status-code checks, retries, cancellation, or deadline — pair it with `ollama_request.py` or your own transport for that), it is not an SSE parser (it will reject `data:`/`[DONE]` framing from the compatibility layers — use the provider SDK there), it buffers the whole result in memory (a 16 MiB per-line ceiling guards against one absurd record, but total stream size is still the caller's problem), and its aggregated output can contain `thinking` and image data — treat that output as you would any other piece of conversation history, not as a safe-by-default debug log.

## Run the offline test suite

```bash
python -m unittest discover -s tests -v
```

Exercises `read_ndjson.py` only (the other two scripts don't have meaningful client-side logic to unit test — their correctness is "does it talk to the server correctly," which is a live check, not an offline one). Needs nothing beyond Python 3.10+: no daemon, network, account, model, or GPU. Covers terminal-chunk content, UTF-8/escaped-Unicode handling, blank lines, a missing final newline, thinking/tool-call accumulation across chunks, `status: success` handling, malformed JSON, numeric overflow, wrong `--kind` for the data, non-object events, in-band `error` events, missing completion, duplicate terminal events, and CLI exit-code behaviour. Passing it validates the helper's parsing logic — it says nothing about Ollama's actual deployed API or model quality.

## Live acceptance checks

When there's authorised access to the intended daemon:

1. Run `ollama_probe.py` to record its origin/version and discover a model and its capabilities, without downloading anything.
2. Send one small `stream: false` chat request (`ollama_request.py chat` or your own client) and verify the response shape and completion.
3. Repeat with streaming and confirm complete aggregation (`ollama_request.py chat --data … | read_ndjson.py --kind chat`), including the final usage metadata.
4. Exercise the specific feature the task actually needs: validate structured JSON against its schema, check embedding vector shape/count, try vision, or run one bounded, harmless tool-loop iteration.
5. Test an intentionally invalid model name/route, and — if practical — a controlled interrupted stream, to confirm errors surface as errors rather than partial success.
6. For any authorised model mutation (create/copy/pull), inspect the result afterward via `/api/show`/`/api/tags` and remove only explicitly approved disposable test artefacts.

Prefer captured or hand-built fixture streams for deterministic error-path testing over deliberately breaking the user's actual running server. Report clearly which parts were verified live and which were only exercised against fixtures or written but untested — never describe an illustrative example response as an observed result.
