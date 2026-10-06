/**
 * Deployed-app detection and the project layout names.
 *
 * DUPLICATED, deliberately, from src/shared/project-layout.ts — keep the two in sync.
 * The cli build (tsconfig.build-cli.json) pins `rootDir` to `cli/`, so this file cannot import
 * from `src/`, and the backend must not import cli code. If you change the layout names or this
 * resolution, update src/shared/project-layout.ts to match (and vice versa).
 */
export declare const SOURCES_DIR_NAME = "sources";
export declare const RUNTIME_DIR_NAME = "runtime";
export declare const LEGACY_SOURCES_DIR_NAME = ".glaze-sources";
export declare const LEGACY_RUNTIME_DIR_NAME = ".glaze";
/** The compiled-output directory nested inside the runtime directory. */
export declare const BUILD_OUTPUT_DIR_NAME = "build";
export declare function isSourcesDirName(name: string): boolean;
export declare function isRuntimeDirName(name: string): boolean;
/**
 * Resolve the runtime directory for a deployed app whose sources directory is `cwd`,
 * or null when `cwd` is not a deployed app (i.e. the template checked out in the monorepo).
 *
 * An existing sibling wins over name symmetry, so a half-relocated project resolves to whichever
 * runtime directory is actually on disk. Name symmetry is the fallback for a first build, before
 * the runtime directory has been created.
 */
export declare function resolveDeployedRuntimeDir(cwd: string): string | null;
export declare function isDeployedApp(cwd?: string): boolean;
