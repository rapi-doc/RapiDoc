/**
 * @rapidoc/prerender: RapiDoc's build-time renderer for Node and Bun (built into dist/index.js).
 *
 * The public API, typed in index.d.ts. What other RapiDoc packages use beyond it is in internal.js
 * (`@rapidoc/prerender/internal`), which is not covered by semver.
 */

import { getBundledCss as bundledCss } from "../../rapidoc/src/styles/css-bundle.js";
import { readOptions } from "./options.js";

export { renderRapiDoc, renderEndpoint, renderSchema } from "./render.js";
export { getSpecNavigation, getNavBarHtml, getNavFilterHtml, bindNavBar } from "./navigation.js";
export { getFlowCss, getNavCss, getThemeTokensCss } from "../../rapidoc/src/styles/css-bundle.js";
export {
  toKebabCase,
  methodPathSlug,
  operationAnchorSource,
} from "../../rapidoc/src/utils/slugger.js";
export { renderArazzoWorkflow } from "../../rapidoc/src/utils/arazzo/index.js";

/**
 * The CSS of <rapi-doc>, every theme and color scheme included.
 *
 * @param {Object} [options]
 * @param {string} [options.scope] - A selector to use in place of `:host`, for light-DOM HTML
 * @returns {string}
 */
export function getBundledCss(options) {
  return bundledCss(readOptions("getBundledCss", options, { own: ["scope"] }));
}
