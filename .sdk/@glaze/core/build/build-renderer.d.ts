import { type ViteConfigOverrides } from "./types.js";
/**
 * Resolve the path to @glaze/core.
 * Dev: sibling ../glaze-core/ package. Host-spawned builds: GLAZE_SDK_PATH (the version-pinned
 * SDK store). Terminal builds without the env: the projects-root projection, then the legacy
 * store path.
 */
export declare function resolveGlazeCorePath(appRoot: string): string;
/**
 * Create a complete Vite configuration for a Glaze app.
 */
export declare function createViteConfig(appRoot: string, overrides?: ViteConfigOverrides): Promise<Record<string, any>>;
/**
 * Build the renderer (Vite build).
 */
export declare function buildRenderer(appRoot: string, overrides?: ViteConfigOverrides): Promise<void>;
/**
 * Create and start a Vite dev server using the framework config.
 * Returns the server URL and a cleanup function.
 */
export declare function createViteDevServer(appRoot: string, overrides?: ViteConfigOverrides): Promise<{
    url: string;
    close: () => Promise<void>;
}>;
