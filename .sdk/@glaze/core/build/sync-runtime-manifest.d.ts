/**
 * Sync the runtime manifest from a source package.json into the .glaze/package.json.
 *
 * Reads the source `package.json` at `appRoot`, merges it with any existing
 * runtime manifest, and atomically writes the result. Returns `true` if the
 * manifest was updated, `false` if it was already up-to-date, or `null` if
 * no runtime manifest path could be resolved (not in a deployed context).
 */
export declare function syncRuntimeManifest(appRoot?: string): boolean | null;
