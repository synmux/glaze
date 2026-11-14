# Setup UI and Errors

Do not reduce missing Claude Code to a toast, exception, or raw error. Render a persistent setup state before any Claude-powered action can run.

Include:

- A concise explanation that Claude Code is required.
- Install/login instructions.
- Check Again, which re-runs the setup check and optional login smoke test.
- An optional custom binary path when lookup fails.
- Disabled primary actions until setup/login succeeds.
- Detected binary path and version after success.

Recommended copy:

- “Claude Code is required for this app.”
- “Install Claude Code, then run `claude` in Terminal and complete login.”
- “After login, return here and click Check Again.”
- “Optional: choose a custom `claude` binary path.”

Do not expose internal keychain, PTY, shell-profile, or auth-precedence explanations unless setup fails.

## Actionable errors

- Missing binary → installation guidance and optional custom path.
- Not logged in → ask the user to run `claude` in Terminal and complete login.
- Works in Terminal but not in app → use the login-shell PTY fallback.
- Tool/permission failure → name the folder or capability needed.
- API-key/gateway environment detected → explain that it may override subscription login.

Large analyses need a visible long-running state and cancellation/retry UX; PTY calls can take a minute or more.

Never log prompts, generated source, environment values, tokens, API keys, or full Claude output unless the user explicitly requests an exported debug report. Any report must redact credentials first.
