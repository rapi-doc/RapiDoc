import type { IntegrationManifest } from "./core.js";

export * from "./core.js";
export * from "./sidebar.js";

/** The integration manifest of the installed rapidoc. */
export declare const rapidocManifest: IntegrationManifest;

/** The options of a JavaScript server integration: the contract's, plus these. */
export interface ResponderOptions extends Omit<import("./core.js").EmbedOptions, "manifest"> {
  /** `false` answers nothing. */
  enabled?: boolean;
  /**
   * The page's whole path as the browser sees it. Only for a proxy that strips a prefix before the request
   * reaches the app: the prefix of a mount inside the app is added without it.
   */
  publicUiPath?: string;
}

export interface ResponderRequest {
  method?: string;
  /** The URL path of the request within the mount, without the query string. */
  path: string;
  /**
   * The prefix the framework took off `path`: Express's `req.baseUrl`, a Fastify plugin's `prefix`, a Hono
   * base path. It goes in front of `uiPath` in the URLs the pages write. Default: none.
   */
  mount?: string;
  /** The request's `If-None-Match` header, as sent. */
  ifNoneMatch?: string;
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
