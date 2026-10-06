// ESM shim for use-sync-external-store — React 19 has useSyncExternalStore built-in.
// This eliminates the CJS require("react") that breaks Rolldown's browser output.
//
// Source: https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js
// The original is CJS; this re-exports React 19's built-in.
//
// To regenerate: this file is a trivial re-export — nothing to derive.
//
// TODO: Remove these shims once use-sync-external-store ships ESM or dependents drop it.
// Check if still needed:  pnpm why use-sync-external-store --filter glaze-main-app
// If no dependents remain, delete this file, the with-selector shim, and the
// resolve.alias entries in build-renderer.ts and main-app/vite.config.ts.
import { useSyncExternalStore } from "react";

export { useSyncExternalStore };

// CJS consumers compiled to ESM (e.g. valtio) default-import this module and
// destructure — bundler interop maps `default` to module.exports. Mirror that shape.
// eslint-disable-next-line import/no-default-export
export default { useSyncExternalStore };
