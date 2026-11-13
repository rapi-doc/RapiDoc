/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Package: '@rapidoc/prerender' (built into dist/index.js)
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
import {
  getBundledCss,
  getFlowCss,
  getNavCss,
  getThemeTokensCss,
} from "../../rapidoc/src/styles/css-bundle.js";
import {
  toKebabCase,
  methodPathSlug,
  operationAnchorSource,
} from "../../rapidoc/src/utils/slugger.js";
import { renderArazzoWorkflow } from "../../rapidoc/src/utils/arazzo/index.js";

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
