/**
 * The glaze() model provider: a thin wrap of @ai-sdk/anthropic pointed at the Glaze
 * AI proxy. The model argument may be a grade alias ("fast" | "smart" | "powerful")
 * or an exact claude model id — the proxy resolves aliases against the server-side
 * catalog, so model policy never requires an app update. Auth is the app AI token,
 * injected per-request by a custom fetch (acquired lazily: cache → refresh → host).
 *
 * glaze.image() is declaration-merged onto the same function (see the `namespace
 * glaze` block below) and returns a Glaze-billed Gemini image model, backed by the
 * gemini-proxy's `:generateContent` endpoint — see ./glaze-gemini-image.ts.
 */
import { type ImageModel, type LanguageModel } from "ai";
import { type GlazeAiImageGrade } from "./glaze-gemini-image.js";
/** Get a Glaze-billed language model by grade alias or exact model id. */
export declare function glaze(modelOrAlias: "fast" | "smart" | "powerful" | (string & {})): LanguageModel;
export declare namespace glaze {
    /** Get a Glaze-billed image model by grade alias: "image-fast" (quick, cost-efficient)
     * or "image-powerful" (highest quality). The server catalog resolves the grade against its own
     * model policy — apps never name a concrete image model. */
    function image(grade: GlazeAiImageGrade): ImageModel;
}
