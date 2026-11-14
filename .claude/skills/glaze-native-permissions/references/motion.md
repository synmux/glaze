# Headphone Motion

Declare why the app needs motion data:

```json
{
  "glaze": {
    "capabilities": {
      "motion": { "usage": "Monitor posture using connected headphones" }
    }
  }
}
```

Use the backend SDK. Do not create a Swift sidecar or invoke `swiftc`:

```ts
import { motion } from "@glaze/core/backend";

const status = await motion.status();

motion.on("data", (sample) => {
  const pitchDegrees = sample.attitude.pitch * (180 / Math.PI);
  // Derive feature-specific state and send only that state to the renderer.
});

motion.on("status-changed", (nextStatus) => {
  // Show waiting, connected, denied, or unavailable UI as appropriate.
});

motion.on("error", (error) => {
  // Surface recovery guidance instead of crashing or retrying permission prompts.
});

await motion.start({ updateIntervalMs: 50 });
```

Rules:

- Call `status()` before rendering the initial permission/device state. It never prompts.
- Call `start()` only after an explicit user action. Starting is the operation that may show the macOS motion prompt.
- `start()` keeps watching for compatible headphones when disconnected and resumes samples after reconnection.
- Call `stop()` when tracking ends. Closing a renderer window is not necessarily the end of tracking for tray or background apps.
- Euler angles are radians. Samples also include quaternion, rotation rate, gravity, user acceleration, nullable heading, Unix delivery time, and Core Motion's monotonic source time.
- Keep threshold duration, cooldown, persistence, notifications, and overlay behavior in app code. Send narrow posture status DTOs to renderers through app IPC instead of forwarding the raw sensor stream.
