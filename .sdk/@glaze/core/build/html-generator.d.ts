/**
 * Generate *-window.html files from renderer entry point convention.
 * Convention: renderer/<name>/index.tsx -> <name>-window.html
 *
 * Only writes files that don't already exist (non-destructive in Phase 1).
 */
export declare function generateWindowHtml(appRoot: string, options?: {
    force?: boolean;
}): string[];
