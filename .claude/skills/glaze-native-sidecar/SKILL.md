---
name: glaze-native-sidecar
description: Use when a Glaze app needs native macOS capabilities beyond Node and npm — system frameworks (AppKit, CoreGraphics, IOKit), sensor/hardware access, or APIs without a Glaze SDK wrapper — by shipping a compiled Swift executable (sidecar) with the app. Covers typed callable Swift, raw long-lived processes, streaming events, SwiftPM dependencies, and the rules that keep sidecars publishable.
---

# Native Swift Sidecars

Ship a Swift executable inside the app for native capabilities Node can't reach. Sidecars are compiled as arm64 binaries by Xcode, then bundled and signed automatically.

## Toolchain gate

Before creating `native/` or committing to a Swift solution, run `xcodebuild -version`. Continue only when Xcode 16.3 or later is already installed and selected.

Never install Xcode, run `xcode-select --install`, change the selected developer directory with `sudo xcode-select`, or run Xcode first-launch setup on the user's behalf. If Xcode is unavailable or unsuitable, re-plan using public Glaze APIs, Node/npm, an existing system tool, AppleScript/JXA, or a reduced version of the feature. If none can satisfy the request, explain what Swift would unlock and let the user decide whether to set up Xcode themselves; continue with the rest of the app where possible.

Choose the narrowest mode that fits:

- **Callable Swift (default for request/response):** mark Swift functions with `@raycast` and import them from the backend with `swift:../native/<name>`. Glaze generates the JavaScript bridge and TypeScript declarations.
- **Raw process:** import the executable path as the default export from the same `swift:../native/<name>` module and choose the process protocol yourself. Use this for persistent state, streaming callbacks, or protocols that do not fit one request/one response.

## Rules

- Package lives at `native/<name>/`; the executable product/target must be named `<name>`. No other registration.
- Swift source only — never commit compiled binaries.
- SwiftPM source dependencies are supported. The first Glaze host build generates `Package.resolved` when needed; commit it so publishing builds exactly those revisions. Glaze validates the resolved graph before compiling.
- No binary or system-library targets, `unsafeFlags`, or untrusted build plugins/macros. The official Raycast Swift tools and their `swift-syntax` tooling are supported.
- For raw processes, always use the `swift:` module's default export. Never hard-code binary paths.
- Print one JSON document (or one JSON line per response/event) to stdout; errors to stderr + non-zero exit.
- In long-lived processes call `setvbuf(stdout, nil, _IOLBF, 0)` first — without line buffering Node never sees output.
- TCC attribution varies by framework — add usage strings via appConfig as usual. In particular, `CLLocationManager` and `CMHeadphoneMotionManager` cannot request authorization reliably from a command-line sidecar; use Glaze's host-native `location` and `motion` APIs. Capabilities requiring Apple-provisioned entitlements are not available.
- Prefer npm packages or the `glaze-cli-dependencies` skill (Homebrew tools) when they suffice; a sidecar is for capabilities that genuinely need compiled native code.
- Building requires Xcode 16.3 or later. Glaze only checks for Xcode when the app contains a native package.

## Raw package boilerplate

`native/<name>/Package.swift`:

```swift
// swift-tools-version:6.0
import PackageDescription

let package = Package(
  name: "<name>",
  platforms: [.macOS(.v13)],
  targets: [.executableTarget(name: "<name>")]
)
```

## Pattern 1: Typed callable Swift (default)

Callable functions spawn the sidecar once per invocation. This is the simplest option for queries and actions that return one result.

`native/system-info/Package.swift`:

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "system-info",
  platforms: [.macOS(.v13)],
  dependencies: [
    .package(url: "https://github.com/raycast/extensions-swift-tools", exact: "1.1.0")
  ],
  targets: [
    .executableTarget(
      name: "system-info",
      dependencies: [
        .product(name: "RaycastSwiftMacros", package: "extensions-swift-tools"),
        .product(name: "RaycastSwiftPlugin", package: "extensions-swift-tools"),
        .product(name: "RaycastTypeScriptPlugin", package: "extensions-swift-tools"),
      ]
    )
  ]
)
```

After editing dependencies, use `BuildApp` when available; otherwise run `npm run verify`. The trusted build path resolves packages and creates or updates `Package.resolved`. Commit `Package.resolved`. Do not add `main.swift`; the build plugin generates the entrypoint.

Glaze generates `main/glaze-swift.d.ts` before TypeScript checking. Never hand-write or commit that file; keep it in `.gitignore` along with `native/*/.build/`.

`native/system-info/Sources/system-info/SystemInfo.swift`:

```swift
import AppKit
import Foundation
import RaycastSwiftMacros

struct Info: Codable {
  let frontmostApp: String
  let osVersion: String
}

@raycast func systemInfo() -> Info {
  Info(
    frontmostApp: NSWorkspace.shared.frontmostApplication?.localizedName ?? "unknown",
    osVersion: ProcessInfo.processInfo.operatingSystemVersionString
  )
}
```

Backend:

```ts
import { systemInfo } from "swift:../native/system-info";

export async function getSystemInfo(): Promise<{ frontmostApp: string; osVersion: string }> {
  return systemInfo();
}
```

The generated declaration maps Swift primitives and standard containers. Custom `Codable` structs currently appear as `any`, so narrow them at the application boundary as above.

## Pattern 2: Raw long-lived server

Spawn once, line-delimited request/response over stdio (~0.03ms per round trip). Right for frequent calls or native state that must persist between calls.

Swift main loop:

```swift
import Foundation

setvbuf(stdout, nil, _IOLBF, 0)
while let line = readLine(strippingNewline: true) {
  guard !line.isEmpty else { continue }
  let parts = line.split(separator: " ", maxSplits: 1)
  let method = String(parts[0])
  let paramsJSON = parts.count > 1 ? String(parts[1]) : "{}"
  print(handle(method: method, paramsJSON: paramsJSON))  // one JSON line per request
}
```

Backend wrapper:

```ts
import { spawn, type ChildProcess } from "child_process";
import * as readline from "readline";
import helperPath from "swift:../native/my-helper";

let child: ChildProcess | null = null;
const pending: Array<(line: string) => void> = [];

function ensureStarted(): ChildProcess {
  if (child && child.exitCode === null) return child;
  child = spawn(helperPath, ["--serve"], { stdio: ["pipe", "pipe", "inherit"] });
  const lines = readline.createInterface({ input: child.stdout! });
  lines.on("line", (line) => pending.shift()?.(line));
  child.on("exit", () => {
    child = null; // next call respawns
  });
  child.on("error", (error) => {
    child = null;
    pending.splice(0).forEach((resolve) => resolve(JSON.stringify({ error: String(error) })));
  });
  return child;
}

export function call(method: string, params: unknown): Promise<unknown> {
  const proc = ensureStarted();
  return new Promise((resolve) => {
    pending.push((line) => resolve(JSON.parse(line)));
    proc.stdin!.write(`${method} ${JSON.stringify(params)}\n`);
  });
}
```

## Pattern 3: Raw streaming events

For callback/sensor APIs: the sidecar pushes one JSON line per event; Node consumes them as they arrive. Callback-based frameworks need a run loop:

```swift
import Foundation

setvbuf(stdout, nil, _IOLBF, 0)

func emit<T: Encodable>(_ event: T) {
  if let data = try? JSONEncoder().encode(event) {
    print(String(decoding: data, as: UTF8.self))
  }
}

// register framework callbacks that call emit(...), then:
RunLoop.main.run()
```

```ts
import { spawn } from "child_process";
import * as readline from "readline";
import sensorStreamPath from "swift:../native/sensor-stream";

export function streamEvents(onEvent: (event: unknown) => void): () => void {
  const child = spawn(sensorStreamPath, { stdio: ["ignore", "pipe", "inherit"] });
  readline.createInterface({ input: child.stdout! }).on("line", (line) => onEvent(JSON.parse(line)));
  child.on("error", (error) => onEvent({ error: String(error) }));
  return () => child.kill();
}
```

## Recipe: Accessibility APIs (control other apps)

For reading other apps' UI (`AXUIElement` trees), posting synthetic input (`CGEvent`), or global event taps — the Homerow-style capability class. All of it needs exactly one TCC grant: **Accessibility**, on the app.

1. **Request the grant from the sidecar.** The system attributes the child process to the app bundle, so the prompt and the System Settings entry show the user's app:

```swift
import ApplicationServices

let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
let trusted = AXIsProcessTrustedWithOptions(options)
// Report trusted=false to the backend so the UI can guide the user to
// System Settings → Privacy & Security → Accessibility instead of failing silently.
```

2. **Read + act with the same grant.** `AXUIElementCopyAttributeValue` / `AXObserver` for reading (use the streaming pattern — observers need `RunLoop.main.run()`), `CGEventPost` for clicks/keystrokes. No additional permission for posting input.

3. **Overlays (hint labels over other apps) need no native code.** Use a `BrowserWindow` with `transparent: true`, `setIgnoreMouseEvents(true, { forward: true })`, `setAlwaysOnTop(true, "screen-saver")`, and `visibleOnAllWorkspaces` — render hints in the renderer from coordinates the sidecar streams.

Caveats:

- The grant is keyed to the app's signing identity — after installing the published app, the user grants it once; the dev-sandbox grant does not carry over. Tell the user to expect one re-grant after install.
- `AXIsProcessTrusted()` returning `false` right after the user toggles the setting is normal for an already-running sidecar — restart the sidecar process after the grant.

## Gotchas

- Core Location authorization is a no-op in a command-line sidecar. Request it through the registered app host, then pass the coordinates to Swift:

  ```ts
  import { location } from "@glaze/core/backend";

  const position = await location.getCurrentPosition({ enableHighAccuracy: true, timeout: 15_000 });
  const coordinates = position.coords;
  ```

  The renderer also exposes `window.glazeAPI.location.getCurrentPosition()`. Glaze currently provides one-shot fixes rather than live subscriptions, so poll when continuous updates are genuinely needed.

- Headphone motion belongs in the registered app host too. Import `motion` from `@glaze/core/backend`; do not compile or spawn a `CMHeadphoneMotionManager` helper.

- `Codable` cannot encode `[String: Any]` — define concrete `Codable` structs for every payload.
- Always attach a child.on("error", ...) handler — an unhandled spawn error event (ENOENT/EACCES) crashes the backend.
- Kill long-lived children on quit (`app.on("before-quit", ...)`) and stop streams when their consumers go away.
- Xcode compiler errors from `glaze build` are shown verbatim — fix the Swift source and rebuild; `glaze dev` compiles sidecars only at startup, so restart dev after Swift changes.
