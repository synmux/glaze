/**
 * Token-aware Gemini-via-Glaze image model factory.
 *
 * Dependency-free leaf: imports only `./errors.js` and `@ai-sdk/provider` (types plus the
 * SDK's standard error classes — a few hundred bytes already bundled transitively via
 * `@ai-sdk/anthropic`). It does NOT import the app AI token
 * runtime itself — the token acquirer is a parameter — mirroring `./glaze-anthropic.ts`'s
 * split so callers keep sharing their own singleton acquirer instance. See that file's
 * module comment for the full rationale.
 *
 * Unlike `glaze-anthropic.ts` (which wraps `@ai-sdk/anthropic`'s `createAnthropic` behind a
 * placeholder base URL + custom `fetch`, because the AI SDK provider factory needs a
 * synchronous `baseURL` before the per-request token is available), this leaf implements
 * `ImageModelV4` directly. `@ai-sdk/google`'s image model targets Imagen's `:predict`
 * endpoint, which the gemini-proxy does not allow for app AI — Gemini image generation uses
 * the `:generateContent` wire shape (`contents`/`parts`/`inlineData`), not the AI SDK's
 * standard image-model wire. `doGenerate` is async and runs once per call, so it can just
 * call `acquireToken` itself and build the real request URL directly — no placeholder/rewrite
 * dance needed. That also means the fetch plumbing here isn't shaped like a `typeof fetch`
 * override (as `glaze-anthropic.ts` and the old `glaze-openai-image.ts` had), so it isn't
 * shared with them; a small self-contained copy reads more clearly than forcing a fourth
 * shape onto a shared helper.
 *
 * The V4 spec adds image inputs: `generateImage({ prompt: { text, images } })` arrives here
 * as `options.files`, which map onto Gemini `inlineData` parts (image editing / variation
 * generation on the same endpoint, proxy route, and billing lane as text-to-image).
 */
import { type ImageModelV4 } from "@ai-sdk/provider";
import { type GlazeAIErrorState } from "./errors.js";
export type AcquireGlazeAiToken = (opts?: {
    forceRefresh?: boolean;
    reconsent?: boolean;
}) => Promise<{
    token: string;
    apiBaseUrl: string;
}>;
export type GlazeAiImageGrade = "image-fast" | "image-powerful";
interface GeminiModalityTokenCount {
    modality?: string;
    tokenCount?: number;
}
interface GeminiUsageMetadata {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    totalTokenCount?: number;
    promptTokensDetails?: GeminiModalityTokenCount[];
    candidatesTokensDetails?: GeminiModalityTokenCount[];
}
/**
 * Mirrors the server-side billing parser (usage-tracking.ts): image responses often
 * report tokens ONLY through the per-modality `*TokensDetails` arrays — the IMAGE
 * modality of the generated image never appears in the top-level
 * `candidatesTokenCount` — so when a details array is present it is authoritative
 * and the top-level count is not added on top. `outputTokens` includes thinking
 * tokens; the V4 usage shape has no modality split, so both modalities are summed.
 */
export declare function mapGeminiUsage(metadata: GeminiUsageMetadata): {
    inputTokens: number | undefined;
    outputTokens: number | undefined;
    totalTokens: number | undefined;
};
/** Builds a Glaze-billed Gemini image model. `acquireToken` must already map any
 * token-acquisition failure to a `GlazeAIError` — this leaf only handles the request/response
 * plumbing (URL build, header injection, 401 retry, error mapping from the response body).
 * `onBlockedState`, when supplied, is invoked with the mapped state right before a
 * `GlazeAIError` is thrown (same contract as `createGlazeAnthropic`), so image generation
 * surfaces the out-of-credits modal exactly like text does. */
export declare function createGlazeGeminiImageModel(acquireToken: AcquireGlazeAiToken, grade: GlazeAiImageGrade, onBlockedState?: (state: GlazeAIErrorState) => void): ImageModelV4;
export {};
