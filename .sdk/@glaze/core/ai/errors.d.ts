export type GlazeAIErrorState = "needs-consent" | "signed-out" | "needs-subscription" | "insufficient-credits" | "daily-limit-reached" | "host-unavailable" | "disabled";
/**
 * Thrown by glaze() model calls for Glaze-level failures (consent, credits, caps,
 * host reachability). Apps should catch this and render the matching blocked state;
 * all other errors are ordinary AI SDK errors.
 */
export declare class GlazeAIError extends Error {
    state: GlazeAIErrorState;
    constructor(state: GlazeAIErrorState, message: string);
}
/**
 * Maps an `AppAiTokenError.reason` (see `src/backend/app-ai-token-runtime.ts`) to the
 * `GlazeAIErrorState` shown to apps. Takes the bare reason string rather than the
 * error class itself so this module (imported by `app-ai-bridge.ts`, which lives in
 * `src/backend/`) never has to import from `src/backend/` — avoids a cycle.
 */
export declare function glazeAIStateFromAppAiTokenReason(reason: "host-unavailable" | "denied" | "needs-subscription" | "signed-out"): GlazeAIErrorState;
export declare function shouldRetryAppAiRequestWithReconsent(response: Response): Promise<boolean>;
export declare function glazeAIErrorFromResponse(status: number, body: unknown): GlazeAIError | null;
