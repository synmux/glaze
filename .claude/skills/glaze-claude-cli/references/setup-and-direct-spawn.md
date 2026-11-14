# Setup and Direct Spawn

Before using these recipes, also read [structured-output-and-security.md](structured-output-and-security.md). It defines `buildClaudeSubscriptionEnv` and `parseClaudeJson`, which this guide calls; do not omit or reimplement those helpers.

Resolve `claude` without assuming a GUI app has the user's shell PATH:

```ts
import { spawn } from "child_process";
import { constants } from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";

async function isExecutable(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export async function resolveClaudeBinary(customPath?: string): Promise<string | null> {
  const candidates = [
    customPath,
    path.join(os.homedir(), ".claude", "local", "claude"),
    path.join(os.homedir(), ".local", "bin", "claude"),
    "/opt/homebrew/bin/claude",
    "/usr/local/bin/claude",
    path.join(os.homedir(), ".npm-global", "bin", "claude"),
    path.join(os.homedir(), ".bun", "bin", "claude"),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (await isExecutable(candidate)) return candidate;
  }

  const lookup = await runProcess("/bin/zsh", ["-lc", "command -v claude"], {
    stdin: "",
    timeoutMs: 5000,
    maxBufferBytes: 1024,
  }).catch(() => null);
  return lookup?.stdout.trim() || null;
}
```

## Typed setup check

`--version` is a binary check, not authentication proof. Optionally verify login only when the user clicks Check Again or immediately before the first Claude action—not on every launch. A sandboxed diagnostic shell without network does not prove the subscription is broken; validate via the running app.

```ts
export type ClaudeSetupStatus =
  | { ok: true; path: string; version: string }
  | { ok: false; reason: "missing" | "not-logged-in" | "failed"; message: string };

export async function checkClaudeSetup(
  options: { customPath?: string; verifyLogin?: boolean } = {},
): Promise<ClaudeSetupStatus> {
  const { customPath, verifyLogin = false } = options;
  const bin = await resolveClaudeBinary(customPath);
  if (!bin) {
    return {
      ok: false,
      reason: "missing",
      message: "Claude Code CLI was not found. Install Claude Code, then run `claude` in Terminal to log in.",
    };
  }

  try {
    const result = await runProcess(bin, ["--version"], { stdin: "", timeoutMs: 5000, maxBufferBytes: 4096 });
    const version = result.stdout.trim() || result.stderr.trim();
    if (verifyLogin) {
      await runProcess(
        bin,
        ["-p", "Respond with OK.", "--output-format", "json", "--tools", "", "--no-session-persistence"],
        {
          stdin: "",
          timeoutMs: 30_000,
          maxBufferBytes: 256 * 1024,
          env: buildClaudeSubscriptionEnv(process.env),
        },
      );
    }
    return { ok: true, path: bin, version };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: looksLikeLoginError(message) ? "not-logged-in" : "failed", message };
  }
}
```

## Direct feature call

Use direct spawn first because it avoids shell quoting. Retry through PTY only for login/auth errors—not parse errors, timeouts, bad prompts, tool failures, or permission errors.

```ts
const issueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    body: { type: "string" },
    labels: { type: "array", items: { type: "string" } },
  },
  required: ["title", "body", "labels"],
};

export async function draftIssue(input: { prompt: string; repoPath?: string }) {
  const setup = await checkClaudeSetup();
  if (!setup.ok) throw new Error(setup.message);

  const args = [
    "-p",
    "Draft a GitHub issue from stdin. Return only data matching the JSON schema.",
    "--output-format",
    "json",
    "--json-schema",
    JSON.stringify(issueSchema),
    "--tools",
    input.repoPath ? "Read" : "",
    "--no-session-persistence",
    ...(input.repoPath ? ["--allowedTools", "Read", "--add-dir", input.repoPath] : []),
  ];

  const result = await runProcess(setup.path, args, {
    cwd: input.repoPath,
    stdin: input.prompt,
    timeoutMs: 120_000,
    maxBufferBytes: 5 * 1024 * 1024,
    env: buildClaudeSubscriptionEnv(process.env),
  });
  return parseClaudeJson(result.stdout);
}
```

## Bounded process runner

Every call must write and end stdin:

```ts
function runProcess(
  bin: string,
  args: string[],
  options: {
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    stdin: string;
    timeoutMs: number;
    maxBufferBytes: number;
  },
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Claude Code timed out."));
    }, options.timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > options.maxBufferBytes) {
        child.kill();
        reject(new Error("Claude Code produced too much output."));
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(formatClaudeError(stderr || stdout)));
    });
    child.stdin.end(options.stdin);
  });
}

function formatClaudeError(output: string): string {
  const text = output.trim();
  if (looksLikeLoginError(text)) {
    return "Claude Code is not logged in. Run `claude` in Terminal and complete login, then try again.";
  }
  return text.slice(0, 2000) || "Claude Code failed.";
}

function looksLikeLoginError(output: string): boolean {
  const normalized = output.toLowerCase();
  return normalized.includes("not logged in") || normalized.includes("please run /login");
}
```
