/**
 * Framework-Agnostic Static Pre-Rendering & Portal Utilities for RapiDoc.
 *
 * Exported subpath: 'rapidoc/static'
 *
 * Usable across Node.js >= 22, Bun, Astro, Nuxt, Next.js, 11ty, VitePress, or custom scripts.
 */

export { renderStaticDoc, renderStaticEndpoint, renderStaticSchema, resolveSpecInput } from './render.js';
export { renderTemplateToString, escapeHtml } from './serializer.js';
export { getSpecNavigation } from './navigation.js';
export { getCatalogMetadata, getSingleCatalogEntry } from './catalog.js';
export { generateSeoMetadata } from './seo.js';
export { getBundledCss } from '../styles/css-bundle.js';

export default {
  renderStaticDoc: (...args) => import('./render.js').then((m) => m.renderStaticDoc(...args)),
  renderStaticEndpoint: (...args) => import('./render.js').then((m) => m.renderStaticEndpoint(...args)),
  renderStaticSchema: (...args) => import('./render.js').then((m) => m.renderStaticSchema(...args)),
  getSpecNavigation: (...args) => import('./navigation.js').then((m) => m.getSpecNavigation(...args)),
  getCatalogMetadata: (...args) => import('./catalog.js').then((m) => m.getCatalogMetadata(...args)),
  generateSeoMetadata: (...args) => import('./seo.js').then((m) => m.generateSeoMetadata(...args)),
  getBundledCss: (...args) => import('../styles/css-bundle.js').then((m) => m.getBundledCss(...args)),
};
