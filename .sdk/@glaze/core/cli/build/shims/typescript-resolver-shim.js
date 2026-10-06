// ESM shim for "typescript" in the bundled CLI (cli/glaze.js).
//
// The AI capability scanner (from @glaze/publishing) needs the TypeScript
// compiler API, but typescript is not a runtime dependency of @glaze/core, so
// it may be absent from a shipped SDK's node_modules. Every scaffolded app
// declares its own typescript (glaze-app-template dependency) — the same
// guarantee `glaze type-check` relies on — so resolve from the app (cwd)
// first, then fall back to the SDK's own node_modules (dev checkouts).
//
// Must not throw at module load: the CLI bundle imports this on every command.
// Exports null when unresolvable; callers of the scanner handle the resulting
// failure as "scan skipped", never as a broken CLI.
import { createRequire } from "node:module";
import { join } from "node:path";
import process from "node:process";

function resolveTypescript() {
  const candidates = [join(process.cwd(), "package.json"), import.meta.url];
  for (const base of candidates) {
    try {
      return createRequire(base)("typescript");
    } catch {
      // try next candidate
    }
  }
  return null;
}

// Default export required: the scanner does `import ts from "typescript"`.
// eslint-disable-next-line import/no-default-export
export default resolveTypescript();
