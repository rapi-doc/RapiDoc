/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Exported subpath: 'rapidoc/static'
 *
 * Usable across Node.js >= 22, Bun, Astro, Nuxt, Next.js, 11ty, VitePress, or custom scripts.
 */

import { renderRapiDoc, renderEndpoint, renderSchema, resolveSpecInput } from './render.js';
import { renderTemplateToString, escapeHtml } from './serializer.js';
import { getSpecNavigation, getNavBarHtml, renderNavBarHtml, getMethodBadge } from './navigation.js';
import { getBundledCss, getNavCss, getThemeTokensCss } from '../styles/css-bundle.js';
import { toKebabCase } from '../utils/slugger.js';

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
  getMethodBadge,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
  toKebabCase,
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
  getMethodBadge,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
  toKebabCase,
};
