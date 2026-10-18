/**
 * OpenAPI Navigation Tree Extractor for Portal Sidebars.
 *
 * Extracts the 3-level navigation hierarchy (Tag Group ➔ Tag ➔ Operation)
 * from OpenAPI specs declaring `x-tagGroups` or `x-tag-groups`, with fallback
 * to 2-level navigation for standard specs.
 */

import { resolveSpecInput } from './render.js';

function isInternalOrHidden(item) {
  if (!item || typeof item !== 'object') return false;
  return (
    item.xInternal === true ||
    item.xInternal === 'true' ||
    item.xHidden === true ||
    item.xHidden === 'true' ||
    item['x-internal'] === true ||
    item['x-internal'] === 'true' ||
    item['x-hidden'] === true ||
    item['x-hidden'] === 'true' ||
    item.rawOperation?.['x-internal'] === true ||
    item.rawOperation?.['x-internal'] === 'true' ||
    item.rawOperation?.['x-hidden'] === true ||
    item.rawOperation?.['x-hidden'] === 'true'
  );
}

/**
 * Normalizes an operation for sidebar navigation consumption.
 * @param {Object} op
 * @returns {Object}
 */
function normalizeNavigationOperation(op) {
  return {
    method: op.method ? op.method.toLowerCase() : 'get',
    path: op.path || '',
    summary: op.summary || op.shortSummary || `${op.method ? op.method.toUpperCase() : ''} ${op.path || ''}`,
    description: op.description || '',
    elementId: op.elementId || `${op.method}-${op.path}`,
    deprecated: Boolean(op.deprecated),
    operationId: op.operationId || '',
    isWebhook: Boolean(op.isWebhook),
  };
}

/**
 * Normalizes a tag for sidebar navigation consumption.
 * @param {Object} tag
 * @returns {Object}
 */
function normalizeNavigationTag(tag) {
  if (isInternalOrHidden(tag)) return null;
  const visiblePaths = (tag.paths || []).filter((p) => !isInternalOrHidden(p)).map(normalizeNavigationOperation);
  if (visiblePaths.length === 0) return null;
  return {
    name: tag.name || '',
    description: tag.description || '',
    elementId: tag.elementId || `tag--${tag.name}`,
    expanded: tag.expanded !== false,
    paths: visiblePaths,
  };
}

/**
 * Extracts a complete, framework-agnostic navigation hierarchy from an OpenAPI spec.
 *
 * Returned structure:
 * - `tagGroups`: Array of 3-tier groups (Tag Group -> Tags -> Operations). Non-empty when `x-tagGroups` is defined.
 * - `tags`: Standard 2-tier list (Tag -> Operations).
 * - `info`: API metadata (title, version, description, termsOfService).
 *
 * @param {string|Object} specInput - Specification file path, URL, raw string, or parsed spec
 * @param {Object} [options]
 * @returns {Promise<{ title: string, version: string, description: string, tagGroups: Array, tags: Array }>}
 */
export async function getSpecNavigation(specInput, options = {}) {
  const resolvedSpec = await resolveSpecInput(specInput, options);

  const tags = (resolvedSpec.tags || []).map(normalizeNavigationTag).filter(Boolean);

  const tagGroups = (resolvedSpec.tagGroups || [])
    .filter((group) => !isInternalOrHidden(group))
    .map((group) => {
      const groupTags = (group.tags || []).map(normalizeNavigationTag).filter(Boolean);
      if (groupTags.length === 0) return null;
      return {
        name: group.name || '',
        description: group.description || '',
        elementId: group.elementId || `tag-group--${(group.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        expanded: group.expanded !== false,
        tags: groupTags,
      };
    })
    .filter(Boolean);

  return {
    title: resolvedSpec.info?.title || '',
    version: resolvedSpec.info?.version || '',
    description: resolvedSpec.info?.description || '',
    tagGroups,
    tags,
  };
}

export default getSpecNavigation;
