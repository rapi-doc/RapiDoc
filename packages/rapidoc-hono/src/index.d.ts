import type { Context, MiddlewareHandler } from "hono";
import type { ResponderOptions } from "@rapidoc/embed";

/** The options every RapiDoc integration takes, plus the ones specific to Hono. */
export interface RapidocHonoOptions extends Omit<ResponderOptions, "nonce"> {
  /**
   * Content-Security-Policy nonce for the page's script and style elements, or a function that reads it
   * from the request: `(c) => c.get("secureHeadersNonce")` with Hono's `secureHeaders`.
   */
  nonce?: string | ((c: Context) => string | undefined);
}

/**
 * Hono middleware that serves an API reference at `uiPath` (default `/docs`):
 * `app.use(rapidoc({ specUrl: "/openapi.json" }))`.
 */
export declare function rapidoc(options?: RapidocHonoOptions): MiddlewareHandler;

/** The version of rapidoc this package serves. */
export declare const rapidocVersion: string;
