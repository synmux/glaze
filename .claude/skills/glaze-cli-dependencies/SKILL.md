---
name: glaze-cli-dependencies
description: Use when a Glaze app must call an external CLI or Homebrew-installed tool because npm packages are not sufficient, including ffmpeg/yt-dlp/imagemagick/pandoc/whisper/jq, install checks, one-click Homebrew setup, child_process safety, and runtime missing-dependency UI.
---

# Glaze CLI Dependencies

Guide for handling external CLI tools that Glaze apps may require.

If no suitable CLI tool exists, or the capability needs real framework APIs (AppKit, IOKit, private frameworks), use the `glaze-native-sidecar` skill instead — the app ships its own compiled Swift executable.

**Important:** When using CLI tools, you must both install the tool via `brew install` AND add runtime checks. Just adding runtime checks is not enough — the tool must actually be installed for the app to work.

## Core Rules

1. **Prefer npm packages when simpler** — If an npm package can do the job, use it instead of a CLI tool, npm packages don't require runtime checks or user installation.
2. **Check before use** — Always verify CLI is installed before calling
3. **Runtime checks required** — Include checks that verify the tool is installed and instruct the user to install it if not
4. **Use Bash tool for install** — Run `brew install` via Bash (triggers permission prompt)
5. **Discover with `brew search`** — Find package names for any CLI tool

---

## npm Alternatives (Prefer These)

| Task             | Instead of CLI | Use npm          |
| ---------------- | -------------- | ---------------- |
| Image processing | imagemagick    | `sharp`          |
| Audio metadata   | ffprobe        | `music-metadata` |
| PDF generation   | wkhtmltopdf    | `puppeteer`      |

---

## Implementation

### Check if Installed

```typescript
// main/services/cli-utils.ts
import { execFile } from "node:child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFile);

export async function isCliInstalled(cmd: string): Promise<boolean> {
  try {
    await execFileAsync("/usr/bin/which", [cmd], {
      maxBuffer: 1024 * 1024,
      timeout: 5_000,
    });
    return true;
  } catch {
    return false;
  }
}
```

### UI Pattern: EmptyState with Auto-Install

When CLI tools are missing, show an `EmptyState` that lets users install dependencies with one click:

```tsx
// renderer/main/home-view.tsx
import {
  EmptyState,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  Button,
} from "@glaze/core/components";
import { InfoIcon } from "lucide-react";

function MissingDependencies({ onInstall }: { onInstall: () => void }) {
  return (
    <EmptyState>
      <EmptyStateMedia>
        <InfoIcon className="size-10 text-support-blue" />
      </EmptyStateMedia>
      <EmptyStateTitle>Setup Required</EmptyStateTitle>
      <EmptyStateDescription>yt-dlp and ffmpeg are needed. They will be installed via Homebrew.</EmptyStateDescription>
      <EmptyStateActions>
        <Button onClick={onInstall}>Install Dependencies</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
```

### Backend: Install Handler

Add an IPC handler that runs `brew install` when the user clicks the button:

```typescript
// main/handlers/index.ts
import { ipcMain } from "@glaze/core/backend";
import { execFile } from "node:child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFile);

ipcMain.handle("deps:install", async () => {
  await execFileAsync("brew", ["install", "yt-dlp", "ffmpeg"], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 10 * 60_000,
  });
  return { success: true };
});

ipcMain.handle("deps:check", async () => {
  const ytdlp = await isCliInstalled("yt-dlp");
  const ffmpeg = await isCliInstalled("ffmpeg");
  return { installed: ytdlp && ffmpeg };
});
```

### Frontend: Connect UI to Backend

```tsx
// renderer/main/home-view.tsx
const [depsInstalled, setDepsInstalled] = useState<boolean | null>(null);

useEffect(() => {
  window.glazeAPI.glaze.ipc.invoke("deps:check").then((result) => {
    setDepsInstalled(result.installed);
  });
}, []);

const handleInstall = async () => {
  await window.glazeAPI.glaze.ipc.invoke("deps:install");
  setDepsInstalled(true);
};

if (depsInstalled === false) {
  return <MissingDependencies onInstall={handleInstall} />;
}
```

### Backend Error Handling

```typescript
async function processVideo(input: string, output: string) {
  if (!(await isCliInstalled("ffmpeg"))) {
    throw new Error("ffmpeg not installed. Run: brew install ffmpeg");
  }
  await execFileAsync("ffmpeg", ["-i", input, output], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 5 * 60_000,
  });
}
```

---

## child_process Safety

### Always Set maxBuffer for Large Output

Default `maxBuffer` is **1 MB**. Commands producing image data, base64 output, or large JSON will crash with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`.

```typescript
// WRONG: default 1 MB limit when no maxBuffer is provided
const { stdout } = await execFileAsync("/usr/bin/osascript", ["-l", "JavaScript", "-e", largeOutputScript]);

// CORRECT: explicit buffer + timeout
const { stdout } = await execFileAsync("/usr/bin/osascript", ["-l", "JavaScript", "-e", largeOutputScript], {
  maxBuffer: 10 * 1024 * 1024, // 10 MB
  timeout: 30_000,
});
```

### Prefer execFile Over exec

`exec` runs through the shell — injection risk with dynamic arguments. `execFile` passes arguments as an array:

```typescript
// WRONG: do not compose user input into a shell command string.
// exec/execAsync(commandString) routes through a shell and can execute injected syntax.

// CORRECT: no shell, arguments are separate
await execFileAsync("/usr/bin/osascript", ["-l", "JavaScript", "-e", userInput], {
  maxBuffer: 10 * 1024 * 1024,
  timeout: 30_000,
});
```

For spawn-based streaming patterns with unbounded output, see `glaze-backend-performance` skill.

---

## Discovering & Installing Any CLI Tool

When the app needs a CLI tool not listed here:

1. **Search for the package:** `brew search <tool-name>`
2. **Get package info:** `brew info <package>` (shows dependencies)
3. **Install with dependencies:** `brew install <package> [additional-deps]`

### Example: Finding a new tool

```bash
# User needs 'pandoc' for document conversion
brew search pandoc
# Returns: pandoc

brew info pandoc
# Shows description and dependencies

brew install pandoc
# Installs pandoc and its dependencies
```

---

## Common Tools Reference

| Tool | Check | Install | Notes |
| --- | --- | --- | --- |
| ffmpeg | `which ffmpeg` | `brew install ffmpeg` | Video/audio processing |
| yt-dlp | `which yt-dlp` | `brew install yt-dlp ffmpeg` | Requires ffmpeg |
| imagemagick | `which convert` | `brew install imagemagick` | Image manipulation |
| whisper | `which whisper` | `brew install openai-whisper ffmpeg` | Requires ffmpeg |
| pandoc | `which pandoc` | `brew install pandoc` | Document conversion |
| jq | `which jq` | `brew install jq` | JSON processing |
| ripgrep | `which rg` | `brew install ripgrep` | Fast text search |
| osascript | `which osascript` | Built-in (macOS) | JXA/AppleScript. Set `maxBuffer: 10MB` for image output |

**Tip:** Many media tools require `ffmpeg` as a dependency — install together.
