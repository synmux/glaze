// ESM shim for use-sync-external-store/shim/with-selector.
// React 19 has useSyncExternalStore built-in — this just adds the memoized selector layer.
//
// Adapted from: https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js
// The original is CJS and require("react"), which breaks Rolldown's browser output.
//
// To regenerate: read the source above, replace require("react") with ESM imports,
// inline the is() polyfill as Object.is (available in all modern browsers), and
// remove the server-only codepath (isServerEnvironment check). The public API is:
//   useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual?)
//
// TODO: Remove these shims once use-sync-external-store ships ESM or dependents drop it.
// Check if still needed:  pnpm why use-sync-external-store --filter glaze-main-app
// If no dependents remain, delete this file, the base shim, and the
// resolve.alias entries in build-renderer.ts and main-app/vite.config.ts.
import { useDebugValue, useMemo, useRef, useSyncExternalStore } from "react";

const NO_VALUE = Symbol();

export function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  const instRef = useRef(null);
  if (instRef.current === null) {
    instRef.current = { selection: NO_VALUE };
  }
  const inst = instRef.current;
  const getSelection = useMemo(() => {
    let memoizedSnapshot = NO_VALUE,
      memoizedSelection;
    return () => {
      const nextSnapshot = getSnapshot();
      // Fast path: snapshot unchanged since last call in this render
      if (Object.is(memoizedSnapshot, nextSnapshot)) return memoizedSelection;
      const nextSelection = selector(nextSnapshot);
      // Check against the ref-persisted value from the previous render
      if (inst.selection !== NO_VALUE && isEqual && isEqual(inst.selection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        memoizedSelection = inst.selection;
        return inst.selection;
      }
      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    };
  }, [getSnapshot, selector, isEqual]);
  const getServerSelection = useMemo(
    () => (getServerSnapshot ? () => selector(getServerSnapshot()) : undefined),
    [getServerSnapshot, selector],
  );
  const value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
  inst.selection = value;
  useDebugValue(value);
  return value;
}

// CJS consumers compiled to ESM (e.g. zustand) default-import this module and
// destructure — bundler interop maps `default` to module.exports. Mirror that shape.
// eslint-disable-next-line import/no-default-export
export default { useSyncExternalStoreWithSelector };
