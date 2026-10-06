import { type Plugin as EsbuildPlugin } from "esbuild";
export interface BuildBackendOptions {
    /** Extra packages to mark as external in the esbuild bundle */
    external?: string[];
    /** Extra esbuild plugins */
    plugins?: EsbuildPlugin[];
    /** Entry point for the backend. Default: "main/index.ts" */
    entry?: string;
}
export interface ViteConfigOverrides {
    /** Extra Vite plugins */
    plugins?: any[];
    /** Server config overrides */
    server?: {
        port?: number;
        host?: string;
    };
    /** Extra define entries */
    define?: Record<string, string>;
}
export interface GlazeConfig {
    build?: BuildBackendOptions;
    vite?: ViteConfigOverrides;
}
