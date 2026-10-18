/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Exported subpath: 'rapidoc/static'
 *
 * Usable across Node.js >= 22, Bun, Astro, Nuxt, Next.js, 11ty, VitePress, or custom scripts.
 */

import { renderRapiDoc, renderEndpoint, renderSchema, resolveSpecInput } from './render.js';
import { renderTemplateToString, escapeHtml } from './serializer.js';
import { getSpecNavigation } from './navigation.js';
import { getBundledCss } from '../styles/css-bundle.js';

export {
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getBundledCss,
};

export default {
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getBundledCss,
};
