import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { ResponderOptions } from "@rapidoc/embed";

/** The options every RapiDoc integration takes, plus the ones specific to Fastify. */
export interface RapidocFastifyOptions extends Omit<ResponderOptions, "nonce"> {
  /**
   * Content-Security-Policy nonce for the page's script and style elements, or a function that reads it
   * from the request: `(request, reply) => reply.cspNonce.script` with @fastify/helmet.
   */
  nonce?: string | ((request: FastifyRequest, reply: FastifyReply) => string | undefined);
}

/**
 * Fastify plugin that serves an API reference at `uiPath` (default `/docs`):
 * `fastify.register(rapidoc, { specUrl: "/openapi.json" })`.
 */
export declare const rapidoc: FastifyPluginAsync<RapidocFastifyOptions>;
export default rapidoc;

/** The version of rapidoc this package serves. */
export declare const rapidocVersion: string;
