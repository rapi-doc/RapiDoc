import type { IntegrationManifest } from "./core.js";

export * from "./core.js";

/** The integration manifest of the installed rapidoc. */
export declare const rapidocManifest: IntegrationManifest;

/** The options of a JavaScript server integration: the contract's, plus these. */
export interface ResponderOptions extends Omit<import("./core.js").EmbedOptions, "manifest"> {
  /** `false` answers nothing. */
  enabled?: boolean;
  /** The path as the browser sees it, when it differs from `path` (a proxy that strips a prefix). */
  publicPath?: string;
}

export interface ResponderRequest {
  method?: string;
  /** The URL path of the request, without the query string. */
  path: string;
  /** The request's `If-None-Match` header. */
  ifNoneMatch?: string;
  /** Overrides `publicPath` for this request, for example under a router mounted at a prefix. */
  publicPath?: string;
  /** Overrides `nonce` for this request. */
  nonce?: string;
}

export interface ResponderResponse {
  status: number;
  headers: Record<string, string>;
  body: string | Uint8Array | null;
}

/**
 * Matches a request against the routes and produces the response; `null` when the request is not for
 * RapiDoc. Pass `readAsset` (from `@rapidoc/embed/node`) to serve the bundle; without it `assets`
 * defaults to `"cdn"`.
 */
export declare function createResponder(
  options?: ResponderOptions,
  runtime?: { readAsset?: (file: string) => Uint8Array | Promise<Uint8Array> },
): (request: ResponderRequest) => Promise<ResponderResponse | null>;
