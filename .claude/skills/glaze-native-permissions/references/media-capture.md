# Camera and Microphone Capture

Check native status and prompt as described in [capabilities-and-prompts.md](capabilities-and-prompts.md), then use `navigator.mediaDevices.getUserMedia`.

## StrictMode capture race

React StrictMode double-mounts in development. The first mount can begin capture, unmount and stop it, while the second mount requests the same native handle before release completes. The second call then fails with `AbortError`; a manual retry often works. This is a lifecycle race, not usually a permission failure.

Do not use one boolean cancellation ref. Use a monotonically increasing request ID:

```ts
const streamRef = React.useRef<MediaStream | null>(null);
const requestIdRef = React.useRef(0);

const stopStream = React.useCallback(() => {
  const stream = streamRef.current;
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
  streamRef.current = null;
}, []);

const startCamera = React.useCallback(
  async (deviceId?: string, retryAttempt = 0) => {
    const thisRequest = ++requestIdRef.current;
    const isStale = () => requestIdRef.current !== thisRequest;

    stopStream();
    setState({ kind: "requesting" });

    try {
      // Perform permission checks; call isStale() after each await.
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (isStale()) {
        for (const track of stream.getTracks()) track.stop();
        return;
      }

      streamRef.current = stream;
      videoRef.current!.srcObject = stream;
      await videoRef.current!.play();
      if (isStale()) {
        stopStream();
        return;
      }

      setState({ kind: "streaming" });
    } catch (err) {
      if (isStale()) return;
      const errorName = err instanceof DOMException ? err.name : "";

      if (errorName === "AbortError" && retryAttempt === 0) {
        const retryRequest = thisRequest;
        setTimeout(() => {
          if (requestIdRef.current === retryRequest) {
            void startCamera(deviceId, 1);
          }
        }, 200);
        return;
      }

      setState({ kind: "error", message: "Unable to start camera." });
    }
  },
  [stopStream],
);

React.useEffect(() => {
  void startCamera();
  return () => {
    requestIdRef.current++;
    stopStream();
  };
}, [startCamera, stopStream]);
```

Required lifecycle properties:

1. Store streams in refs, not React state.
2. Check staleness after permission checks, `getUserMedia`, and `video.play()`.
3. Enter `"streaming"` only after playback succeeds.
4. Retry `AbortError` at most once after 200ms, guarded by the same request ID.
5. Cleanup increments the request ID and stops every track.

## Repeated prompts

1. Verify `askForMediaAccess` runs only for `not-determined`.
2. Verify the native delegate exists at `macOS/sources/macos-app/sources/runtime/webview/WebViewController.swift`, method `webView(_:requestMediaCapturePermissionFor:initiatedByFrame:type:decisionHandler:)`.
3. Verify bundle ID and signing identity remain stable across launches; otherwise macOS may treat each launch as a different app.
