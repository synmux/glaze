#!/usr/bin/env node

// Backwards-compatibility shim. The real CLI lives in the compiled `glaze.js`
// (bundled from `main.ts`). Apps scaffolded before the CLI was compiled resolve
// this `.ts` entry directly; this forwards them to the compiled bundle so the SDK
// no longer needs to ship the CLI's TypeScript sources. The target is resolved via
// a computed URL so it is not statically tied to the generated, gitignored bundle.
export {};

await import(new URL("./glaze.js", import.meta.url).href);
