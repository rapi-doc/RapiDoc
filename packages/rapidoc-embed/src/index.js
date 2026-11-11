// @rapidoc/embed: the contract functions of ./core.js, bound to the rapidoc version this package depends
// on, so `assets: "cdn"` loads that exact version with its SRI hash. JSON import: Node 22 and bundlers.
import manifest from "rapidoc/integration.json" with { type: "json" };
import * as core from "./core.js";

export * from "./core.js";

/** The integration manifest of the installed rapidoc: version, CDN base URL, files with SRI hashes. */
export const rapidocManifest = manifest;

const bound = (options = {}) => ({ manifest, ...options });

export const embedUrls = (options) => core.embedUrls(bound(options));
export const toAttributes = (options) => core.toAttributes(bound(options));
export const renderHostPage = (options) => core.renderHostPage(bound(options));
export const renderOAuthReceiverPage = (options) => core.renderOAuthReceiverPage(bound(options));
export const embedRoutes = (options) => core.embedRoutes(bound(options));
