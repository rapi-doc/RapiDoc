/**
 * Multi-Spec API Catalog Metadata Generator.
 *
 * Extracts standardized metadata cards across multiple OpenAPI specifications
 * for building developer portal catalog overview grids (Zudoku / Cosmo Cargo style).
 */

import { resolveSpecInput } from './render.js';

/**
 * Extracts metadata for a single OpenAPI specification.
 *
 * @param {string|Object} specItem - Either a spec descriptor { id, spec, ... } or raw spec path/object
 * @param {Object} [options]
 * @returns {Promise<Object>} Catalog card metadata
 */
export async function getSingleCatalogEntry(specItem, options = {}) {
  const isDescriptor = typeof specItem === 'object' && specItem !== null && 'spec' in specItem;
  const specToResolve = isDescriptor ? specItem.spec : specItem;
  const customId = isDescriptor ? specItem.id : undefined;

  const resolved = await resolveSpecInput(specToResolve, options);

  const methodsSummary = {
    get: 0,
    post: 0,
    put: 0,
    delete: 0,
    patch: 0,
    head: 0,
    options: 0,
  };

  let totalEndpoints = 0;
  for (const tag of resolved.tags || []) {
    for (const op of tag.paths || []) {
      totalEndpoints++;
      const m = (op.method || 'get').toLowerCase();
      methodsSummary[m] = (methodsSummary[m] || 0) + 1;
    }
  }

  const title = (isDescriptor && specItem.title) || resolved.info?.title || 'API Specification';
  const slugId =
    customId ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return {
    id: slugId,
    title,
    version: resolved.info?.version || '',
    description: (isDescriptor && specItem.description) || resolved.info?.description || '',
    servers: (resolved.servers || []).map((s) => s.url || s.computedUrl || ''),
    contact: resolved.info?.contact || null,
    license: resolved.info?.license || null,
    endpointsCount: totalEndpoints,
    tagGroupsCount: (resolved.tagGroups || []).length,
    tagsCount: (resolved.tags || []).length,
    methodsSummary,
    ...(isDescriptor ? { ...specItem, spec: undefined } : {}),
  };
}

/**
 * Extracts catalog metadata cards for an array of OpenAPI specifications.
 *
 * @param {Array<string|Object>} specsList - List of spec paths, URLs, objects, or descriptor objects
 * @param {Object} [options]
 * @returns {Promise<Array<Object>>} Array of catalog card objects
 */
export async function getCatalogMetadata(specsList = [], options = {}) {
  if (!Array.isArray(specsList)) {
    throw new Error('specsList must be an array of specifications or spec descriptors.');
  }

  return Promise.all(specsList.map((item) => getSingleCatalogEntry(item, options)));
}

export default getCatalogMetadata;
