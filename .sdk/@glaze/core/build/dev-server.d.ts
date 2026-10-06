/**
 * Start both backend (tsx watch) and renderer (Vite) dev servers.
 */
export declare function startDevServers(appRoot: string): Promise<{
    cleanup: () => void;
}>;
/**
 * Start renderer (Vite) dev server only.
 */
export declare function startRendererDevServer(appRoot: string): Promise<{
    cleanup: () => void;
}>;
