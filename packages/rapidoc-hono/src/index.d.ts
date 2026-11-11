import type { Context, MiddlewareHandler } from "hono";
import type { EmbedOptions } from "@rapidoc/embed";

/** The options every RapiDoc integration takes, plus the ones specific to Hono. */
export interface RapidocHonoOptions extends Omit<EmbedOptions, "nonce" | "manifest"> {
  /** `false` serves nothing: every request is passed on. */
  enabled?: boolean;
  /**
   * The path as the browser sees it, when a proxy strips a prefix before the request reaches the app:
   * `path: "/docs", publicPath: "/api/docs"`. Default: `path`.
   */
  publicPath?: string;
  /**
   * Content-Security-Policy nonce for the page's script and style elements, or a function that reads it
   * from the request: `(c) => c.get("secureHeadersNonce")` with Hono's `secureHeaders`.
   */
  nonce?: string | ((c: Context) => string | undefined);
}

/**
 * Hono middleware that serves an API reference at `path` (default `/docs`):
 * `app.use(rapidoc({ specUrl: "/openapi.json" }))`.
 */
export declare function rapidoc(options?: RapidocHonoOptions): MiddlewareHandler;

/** The version of rapidoc this package serves. */
export declare const rapidocVersion: string;
