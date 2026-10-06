// Canonical list of shared dependencies between Glaze apps and the SDK.
// Both Vite configs (main-app, glaze-app-template) and glaze-core's build.js import from this file.
// The Swift import map (macOS/sources/macos-app/sources/runtime/webview/WebViewController.swift)
// must be kept in sync manually (cross-language boundary).

/** Top-level package names shared between app code and the SDK runtime.
 *  These are externalized from app bundles and resolved via import maps at runtime. */
export const sharedDeps = ["react", "react-dom", "@tanstack/react-query", "sonner"];

/** Vite `resolve.dedupe` — ensures a single instance of each shared dep.
 *  Includes transitive deps (like @tanstack/query-core) that must be deduped
 *  but are NOT externalized (no import map entry). */
export const sharedDepsDedupe = [...sharedDeps, "@tanstack/query-core"];

/**
 * Rollup/Vite `external` function.
 * Returns `true` for `@glaze/core/*` modules and any shared dep (including sub-paths
 * like `react/jsx-runtime` or `@tanstack/react-query/build/modern/...`).
 */
export function isExternalDep(id) {
  // SDK CSS is injected at runtime by the native shell (glaze-core://components.css).
  // Apps should NOT import it directly, but if they do, let Vite process it
  // through PostCSS/Tailwind rather than leaving a broken bare import in the output.
  if (id.endsWith(".css")) return false;
  // Externalize SDK modules
  if (/^@glaze\/core\//.test(id)) return true;
  // Externalize shared deps (same instance for app + SDK via vendor bundles)
  for (const dep of sharedDeps) {
    if (id === dep || id.startsWith(dep + "/")) return true;
  }
  return false;
}
