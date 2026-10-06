/**
 * Generate renderer/vite-env.d.ts with Vite client type reference.
 * Skips if file already exists (non-destructive in Phase 1).
 */
export declare function generateViteEnvDts(appRoot: string, options?: {
    force?: boolean;
}): boolean;
