# Location

Use native location:

```ts
const status = await window.glazeAPI.systemPreferences.getAuthorizationStatus("location");
if (status === "denied" || status === "restricted") {
  throw new Error("Location access denied.");
}

const position = await window.glazeAPI.location.getCurrentPosition({
  enableHighAccuracy: true,
});
```

Glaze currently supports only single-shot `getCurrentPosition`. It does not provide `watchPosition` or `clearWatch`.

Never fall back to `navigator.geolocation`, including its watch APIs. Glaze's WKWebView runtime has public media permission hooks but no public geolocation permission hook equivalent to Chromium's session handlers, so browser geolocation is denied or unreliable for file-backed runtime pages.

For continuous needs, carefully poll native `getCurrentPosition` when acceptable or implement a native Glaze location API extension before promising tracking. If native location is unavailable, offer manual selection or an explicitly labelled approximate fallback such as IP geolocation.
