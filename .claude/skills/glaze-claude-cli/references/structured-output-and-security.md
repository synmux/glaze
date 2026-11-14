# Structured Output and Security

## Subscription environment

Unless the user explicitly configured API-key mode, remove inherited API-key and gateway variables so they cannot override subscription login:

```ts
function buildClaudeSubscriptionEnv(base: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const env = { ...base };
  for (const key of [
    "ANTHROPIC_API_KEY",
    "ANTHROPIC_AUTH_TOKEN",
    "ANTHROPIC_BASE_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "GOOGLE_APPLICATION_CREDENTIALS",
  ]) {
    delete env[key];
  }
  return env;
}
```

Never ask for or persist `CLAUDE_CODE_OAUTH_TOKEN`. If an advanced user already supplies it in their environment, treat it as a credential and never log it. Do not log environment variables. Redact error text containing `KEY`, `TOKEN`, `SECRET`, `AUTH`, or `PASSWORD`.

## JSON envelopes

With `--json-schema`, current versions may return `structured_output`; older versions put JSON text in `result`. PTY output can retain control bytes, so strip ANSI and slice to the JSON envelope:

```ts
function stripAnsi(value: string): string {
  return value
    .replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/\x1B\][^\x07\x1B]*(?:\x07|\x1B\\)/g, "")
    .replace(/\x1B[()][0-9A-Z]/g, "")
    .replace(/\x1B[78]/g, "")
    .replace(/[\x0E\x0F]/g, "");
}

function parseClaudeJson(stdout: string): unknown {
  const cleaned = stripAnsi(stdout);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Claude Code returned output without a JSON envelope.");
  }

  const envelope = JSON.parse(cleaned.slice(start, end + 1));
  if ("structured_output" in envelope) return envelope.structured_output;
  if (typeof envelope.result === "string") return JSON.parse(envelope.result);
  throw new Error("Claude Code returned an unexpected response shape.");
}
```

Prefer `--output-format json --json-schema ...` for app-consumed data. For progress, use `--output-format stream-json --verbose` and parse newline-delimited JSON events. Never scrape human terminal text.

Claude Code caps piped stdin at 10 MB. Write larger context to a temporary file and reference its path. Scope tools to the minimum and grant only explicit `--add-dir` roots; non-interactive mode skips the workspace trust dialog.

If asking for markdown, render markdown. Otherwise request plain text so users do not see raw `##` and `**`.
