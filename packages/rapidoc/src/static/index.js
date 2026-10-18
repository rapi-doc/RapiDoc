/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Exported subpath: 'rapidoc/static'
 *
 * Usable across Node.js >= 22, Bun, Astro, Nuxt, Next.js, 11ty, VitePress, or custom scripts.
 */

import { renderStaticDoc, renderStaticEndpoint, renderStaticSchema, resolveSpecInput } from './render.js';
import { renderTemplateToString, escapeHtml } from './serializer.js';
import { getSpecNavigation } from './navigation.js';
import { getCatalogMetadata, getSingleCatalogEntry } from './catalog.js';
import { generateSeoMetadata } from './seo.js';
import { getBundledCss } from '../styles/css-bundle.js';

export {
  renderStaticDoc,
  renderStaticEndpoint,
  renderStaticSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getCatalogMetadata,
  getSingleCatalogEntry,
  generateSeoMetadata,
  getBundledCss,
};

export default {
  renderStaticDoc,
  renderStaticEndpoint,
  renderStaticSchema,
  resolveSpecInput,
  renderTemplateToString,
  escapeHtml,
  getSpecNavigation,
  getCatalogMetadata,
  getSingleCatalogEntry,
  generateSeoMetadata,
  getBundledCss,
};
