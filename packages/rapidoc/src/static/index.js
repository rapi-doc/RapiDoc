/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Exported subpath: 'rapidoc/static'
 *
 * Usable across Node.js >= 22, Bun, Astro, Nuxt, Next.js, 11ty, VitePress, or custom scripts.
 */

import { renderRapiDoc, renderEndpoint, renderSchema, resolveSpecInput } from "./render.js";
import { renderTemplateToString, escapeHtml } from "./serializer.js";
import {
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getNavFilterHtml,
  getMethodBadge,
  bindNavBar,
} from "./navigation.js";
import { getBundledCss, getNavCss, getThemeTokensCss } from "../styles/css-bundle.js";
import { toKebabCase, methodPathSlug, operationAnchorSource } from "../utils/slugger.js";
import { renderArazzoWorkflow } from "../utils/arazzo/index.js";
import FlowStyles from "../styles/flow-styles.js";

/** CSS for diagrams from `renderArazzoWorkflow`; the page also needs the theme tokens (`getThemeTokensCss`). */
function getFlowCss() {
  return FlowStyles.cssText;
}

export {
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getNavFilterHtml,
  getMethodBadge,
  bindNavBar,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
  toKebabCase,
  methodPathSlug,
  operationAnchorSource,
  renderArazzoWorkflow,
  getFlowCss,
};

export default {
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getNavFilterHtml,
  getMethodBadge,
  bindNavBar,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
  toKebabCase,
  methodPathSlug,
  operationAnchorSource,
  renderArazzoWorkflow,
  getFlowCss,
};
