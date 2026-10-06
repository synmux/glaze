import { type GlazeConfig } from "./types.js";
/** Type-safe config helper (passthrough for types, identity at runtime) */
export declare function defineConfig(config: GlazeConfig): GlazeConfig;
/**
 * Detect if we're running inside a deployed app's sources/ directory vs the template
 * directly (development).
 *
 * Shares its resolution with the backend's resolveBuildOutDir (src/backend/app-path.ts) through
 * src/shared/project-layout.ts, so the two cannot drift.
 */
export declare function detectAppContext(cwd?: string): {
    isDeployed: boolean;
    appRoot: string;
    buildOutDir: string;
};
/**
 * Load glaze.config.ts from the app root (if it exists).
 * The @glaze/core resolve hook is registered globally by the CLI entry point (glaze.ts).
 */
export declare function loadConfig(appRoot: string): Promise<GlazeConfig>;
