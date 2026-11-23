import type { RapiDocAttributes } from "rapidoc";

/** rapidoc's `dist/integration.json`. */
export interface IntegrationManifest {
  /** Version of this file's format. Not the version of the integration contract (`CONTRACT_VERSION`). */
  contract: number;
  name: string;
  version: string;
  elements: string[];
  /** Base URL of this version's `dist/` on the CDN, ending in `/`. */
  cdn: string;
  files: Record<string, { role: string; contentType: string; bytes: number; integrity: string }>;
}

type CamelCase<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? `${Head}${Capitalize<CamelCase<Tail>>}`
  : S;

type AttributeValue<V> = V | null | (V extends "true" | "false" ? boolean : never);

/** `<rapi-doc>` attributes, in kebab-case or camelCase; booleans and numbers are written as strings. */
export type RapiDocOptions = {
  [K in keyof RapiDocAttributes]?: AttributeValue<RapiDocAttributes[K]>;
} & {
  [K in keyof RapiDocAttributes as CamelCase<K & string>]?: AttributeValue<RapiDocAttributes[K]>;
} & { [attribute: string]: unknown };

/**
 * The options every RapiDoc integration takes, under these names. An option that is `null` or an empty
 * string counts as absent, so its default applies.
 */
export interface EmbedOptions {
  /**
   * URL path of the reference page; the bundle and the OAuth return page are served under it. Default
   * `/docs`; `/` is the site root.
   *
   * An integration takes it as the path within the app or mount it is registered in, and serves the routes
   * of `embedRoutes` there. The render functions (`renderHostPage`, `renderOAuthReceiverPage`, `embedUrls`)
   * write it into the page as given, so they take the public path, the one the browser requests: the
   * integration puts the mount's prefix in front before it calls them.
   */
  uiPath?: string;
  /** URL of the OpenAPI document. Integrations default it to the framework's own endpoint. */
  specUrl?: string;
  /** The OpenAPI document itself (object or JSON text), written into the page. It wins over `specUrl`, which stays the download link. */
  spec?: object | string | null;
  /** Page title. Default `API Reference`. */
  title?: string;
  /**
   * Where the browser loads `rapidoc-min.js` from: `"bundled"` (default, served by the integration under
   * `uiPath`), `"cdn"` (the pinned version on jsDelivr, with its SRI hash) or your own URL.
   */
  assets?: "bundled" | "cdn" | { scriptUrl: string; integrity?: string };
  /** Attributes of `<rapi-doc>`. */
  options?: RapiDocOptions;
  /** HTML added to the end of `<head>`, as given. */
  head?: string;
  /** CSS added in a `<style>` element, as given. */
  css?: string;
  /** `lang` of the page. Default `en`. */
  lang?: string;
  /** Content-Security-Policy nonce for the page's `<script>` and `<style>` elements. */
  nonce?: string;
  /** rapidoc's integration manifest; `@rapidoc/embed` fills it in, `@rapidoc/embed/core` needs it for `"cdn"`. */
  manifest?: IntegrationManifest;
}

export interface EmbedUrls {
  page: string;
  script: string;
  integrity: string | undefined;
  oauthReceiver: string;
}

export type EmbedRoute =
  | { path: string; kind: "page" | "oauth-receiver"; contentType: string }
  | { path: string; kind: "file"; file: string; contentType: string };

/**
 * Version of the integration contract: the options, routes and HTML that `conformance/fixtures/` fix.
 * Independent of this package's version and of the `contract` field of rapidoc's `integration.json`.
 */
export declare const CONTRACT_VERSION: number;
export declare const DEFAULT_UI_PATH: string;
/** The `uiPath` option of `options`, or the default. */
export declare function uiPathOf(options?: EmbedOptions): string;
export declare const DEFAULT_TITLE: string;
export declare const SCRIPT_FILE: string;
export declare const LICENSE_FILE: string;
export declare const OAUTH_RECEIVER_FILE: string;

export declare function escapeHtml(value: unknown): string;
export declare function inlineJson(spec: object | string): string;
export declare function normalizePath(path?: string): string;
export declare function attributeName(key: string): string;
export declare function embedUrls(options?: EmbedOptions): EmbedUrls;
export declare function toAttributes(options?: EmbedOptions): [name: string, value: string][];
export declare function renderHostPage(options?: EmbedOptions): string;
export declare function renderOAuthReceiverPage(options?: EmbedOptions): string;
export declare function embedRoutes(options?: EmbedOptions): EmbedRoute[];
