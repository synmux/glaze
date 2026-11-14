# macOS GUI Subscription Authentication

Read [setup-and-direct-spawn.md](setup-and-direct-spawn.md) and [structured-output-and-security.md](structured-output-and-security.md) before implementing this fallback. They define the shared `formatClaudeError`, login-error classification, and JSON parser used below.

If direct spawn reports not logged in while `claude -p "hi"` works in Terminal, the GUI process probably lacks the same login/keychain context. For subscription-backed macOS apps, a login-shell PTY fallback is expected, not exotic. It still requires the user to have opened Terminal and logged in at least once.

PTY startup takes several seconds and large calls can take minutes. Use 120-second-or-longer timeouts for repository summaries, logs, or commit digests.

```ts
import os from "os";
import pty from "node-pty";

function runClaudeInLoginPty(options: {
  command: string;
  cwd?: string;
  env: NodeJS.ProcessEnv;
  timeoutMs: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = "";
    const child = pty.spawn(
      "/usr/bin/login",
      ["-fpq", os.userInfo().username, process.env.SHELL || "/bin/zsh", "-lc", options.command],
      { cwd: options.cwd, env: options.env, cols: 220, rows: 50 },
    );

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Claude Code timed out."));
    }, options.timeoutMs);

    child.onData((data) => {
      output += data;
    });
    child.onExit(({ exitCode }) => {
      clearTimeout(timer);
      if (exitCode === 0) resolve(output);
      else reject(new Error(formatClaudeError(output)));
    });
  });
}
```

Do not type commands into an interactive shell with `child.write(...)`. Pass the command as `shell -lc command` arguments.

Keep flags literal and pass user data through stdin files or quoted environment variables. Delimit machine output with a random nonce:

```ts
const command = [
  'printf "%s\\n" "BEGIN_$GLZ_NONCE"',
  '"$GLZ_CLAUDE_BIN" -p "$GLZ_PROMPT" --output-format json --json-schema "$GLZ_SCHEMA" --tools "" --no-session-persistence < "$GLZ_CONTEXT_FILE"',
  "rc=$?",
  'printf "%s\\n" "END_$GLZ_NONCE"',
  'exit "$rc"',
].join("; ");
```

Do not use `status` as a shell variable: zsh defines it as a read-only alias for `$?`, so assignment fails before the end marker.

Extract only marked output before JSON parsing:

```ts
function extractMarkedOutput(output: string, nonce: string): string {
  const begin = `BEGIN_${nonce}`;
  const end = `END_${nonce}`;
  const start = output.indexOf(begin);
  const stop = output.lastIndexOf(end);
  if (start === -1 || stop === -1 || stop <= start) {
    throw new Error("Claude Code output markers were not found.");
  }
  return output.slice(start + begin.length, stop);
}
```

Then pass the result through the parser in [structured-output-and-security.md](structured-output-and-security.md). Retry via PTY only for recognized login/auth errors.
