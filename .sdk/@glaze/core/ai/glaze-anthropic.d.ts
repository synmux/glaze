import { type GlazeAIErrorState } from "./errors.js";
export type AcquireGlazeAiToken = (opts?: {
    forceRefresh?: boolean;
    reconsent?: boolean;
}) => Promise<{
    token: string;
    apiBaseUrl: string;
}>;
/** Builds a Glaze-billed Anthropic provider. `acquireToken` must already map any
 * token-acquisition failure to a `GlazeAIError` — this leaf only handles the
 * request/response plumbing (URL rewrite, header injection, 401 retry, error
 * mapping from the response body). `onBlockedState`, when supplied, is invoked
 * with the mapped state right before a `GlazeAIError` is thrown, so the caller
 * can react to a block (e.g. surface the host's out-of-credits modal) without
 * this backend-import-free leaf reaching into the token runtime itself. */
export declare function createGlazeAnthropic(acquireToken: AcquireGlazeAiToken, onBlockedState?: (state: GlazeAIErrorState) => void): import("@ai-sdk/anthropic").AnthropicProvider;
