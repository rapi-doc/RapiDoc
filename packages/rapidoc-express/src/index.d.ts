import type { IncomingMessage, ServerResponse } from "node:http";
import type { ResponderOptions } from "@rapidoc/embed";

/** The options every RapiDoc integration takes, plus the ones specific to Express. */
export interface RapidocExpressOptions extends Omit<ResponderOptions, "nonce"> {
  /**
   * Content-Security-Policy nonce for the page's script and style elements, or a function that reads it
   * from the request: `(req, res) => res.locals.cspNonce` with helmet.
   */
  nonce?: string | ((req: any, res: any) => string | undefined);
}

/**
 * Express middleware that serves an API reference at `path` (default `/docs`):
 * `app.use(rapidoc({ specUrl: "/openapi.json" }))`.
 */
export declare function rapidoc(
  options?: RapidocExpressOptions,
): (req: IncomingMessage, res: ServerResponse, next?: (error?: unknown) => void) => void;

/** The version of rapidoc this package serves. */
export declare const rapidocVersion: string;
