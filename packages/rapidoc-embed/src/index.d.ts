import type { IntegrationManifest } from "./core.js";

export * from "./core.js";

/** The integration manifest of the installed rapidoc. */
export declare const rapidocManifest: IntegrationManifest;

/** The options of a JavaScript server integration: the contract's, plus these. */
export interface ResponderOptions extends Omit<import("./core.js").EmbedOptions, "manifest"> {
  /** `false` answers nothing. */
  enabled?: boolean;
  /** The path as the browser sees it, when it differs from `uiPath` (a proxy that strips a prefix). */
  publicUiPath?: string;
  /** @deprecated Renamed to `publicUiPath`. */
  publicPath?: string;
}

export interface ResponderRequest {
  method?: string;
  /** The URL path of the request, without the query string. */
  path: string;
  /** The request's `If-None-Match` header. */
  ifNoneMatch?: string;
  /** Overrides `publicUiPath` for this request, for example under a router mounted at a prefix. */
  publicUiPath?: string;
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

/** The methods that get a label and a colour in a docs-site sidebar. */
export declare const SIDEBAR_METHODS: string[];
/** `delete` → `DEL`: the short label of an HTTP method; empty for an unknown one. */
export declare function methodLabel(method: string): string;
/** Class names for an operation's sidebar item: `rapidoc-op rapidoc-op--get`, plus `rapidoc-op--deprecated`. */
export declare function operationClass(
  operation: { method?: string; deprecated?: boolean },
  methods?: SidebarMethods | null,
): string;
/** How a docs-site sidebar shows an operation's method: the values of `show-method-in-nav-bar`, or `false`. */
export type SidebarMethods =
  | boolean
  | "false"
  | "as-plain-text"
  | "as-colored-text"
  | "as-colored-block";
export declare const SIDEBAR_METHOD_STYLES: string[];
export declare const DEFAULT_SIDEBAR_METHODS: "as-colored-text";
/** The `methods` option as one of `SIDEBAR_METHOD_STYLES`; throws on anything else. */
export declare function sidebarMethods(value?: SidebarMethods | null): string;
/** CSS for the method labels and the deprecated mark of a docs-site sidebar; the selectors are the theme's. */
export declare function sidebarCss(theme: {
  label: (className: string) => string;
  text: (className: string) => string;
  dark: string;
  /** Selector of the label inside the current item, when the theme fills that item with a colour. */
  active?: string;
}): string;
