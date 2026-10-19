/**
 * Direct OpenAPI Navigation HTML Serializer & Metadata Extractor.
 *
 * Directly renders framework-agnostic navigation HTML from OpenAPI specifications,
 * eliminating intermediate AST node abstractions:
 * - `getNavBarHtml(specInput, options)`: Resolves spec and renders navigation HTML directly
 * - `renderNavBarHtml(resolvedSpec, options)`: Pure zero-dependency HTML generator
 * - `getSpecNavigation(specInput, options)`: Extracts semantic navigation metadata (tagGroups & tags)
 *
 * Supports 3-tier navigation (x-tagGroups / x-tag-groups) with fallback to 2-tier tags.
 */

import { resolveSpecInput } from './render.js';
import { escapeHtml } from './serializer.js';
import { OperationSlugger, toKebabCase } from '../utils/slugger.js';

export function isInternalOrHidden(item) {
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
 * Normalizes HTTP method badge string (3-character format matching core RapiDoc).
 * e.g., 'delete' -> 'DEL', 'post' -> 'POS', 'get' -> 'GET', 'put' -> 'PUT'
 *
 * @param {string} method
 * @param {'3-char'|'full'} [format='3-char']
 * @returns {string}
 */
export function getMethodBadge(method, format = '3-char') {
  if (!method) return '';
  const m = String(method).toLowerCase();
  if (format === '3-char') {
    return m.substring(0, 3).toUpperCase();
  }
  return m.toUpperCase();
}

/**
 * Retrieves visible operations for a tag, supporting both parsed and raw specs.
 */
function getTagOperations(tag, spec) {
  if (Array.isArray(tag.paths) && tag.paths.length > 0) {
    return tag.paths.filter((p) => !isInternalOrHidden(p));
  }
  if (!spec?.paths || typeof spec.paths !== 'object') return [];

  const tagName = (tag.name || '').toLowerCase();
  const operations = [];
  const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
  const slugger = new OperationSlugger();
  const tagSlug = toKebabCase(tag.name);

  for (const [pathKey, pathObj] of Object.entries(spec.paths)) {
    if (!pathObj || typeof pathObj !== 'object') continue;
    for (const method of httpMethods) {
      const op = pathObj[method];
      if (op && typeof op === 'object' && !isInternalOrHidden(op)) {
        const opTags = Array.isArray(op.tags) ? op.tags.map((t) => String(t).toLowerCase()) : [];
        if (opTags.includes(tagName)) {
          operations.push({
            method,
            path: pathKey,
            summary: op.summary || '',
            description: op.description || '',
            deprecated: Boolean(op.deprecated),
            operationId: op.operationId || '',
            elementId: slugger.slug(
              {
                method,
                path: pathKey,
                operationId: op.operationId,
                summary: op.summary || op.description,
              },
              tagSlug
            ),
          });
        }
      }
    }
  }
  return operations;
}

/**
 * Extracts a complete, framework-agnostic navigation hierarchy from an OpenAPI spec.
 *
 * @param {string|Object} specInput - Specification file path, URL, raw string, or parsed spec
 * @param {Object} [options]
 * @returns {Promise<{ title: string, version: string, description: string, tagGroups: Array, tags: Array }>}
 */
export async function getSpecNavigation(specInput, options = {}) {
  const resolvedSpec = await resolveSpecInput(specInput, options);
  const slugger = new OperationSlugger();

  const tags = (resolvedSpec.tags || [])
    .filter((t) => !isInternalOrHidden(t))
    .map((t) => {
      const paths = getTagOperations(t, resolvedSpec);
      return {
        name: t.name || t.displayName || '',
        displayName: t.displayName || t.name || '',
        description: t.description || '',
        elementId: t.elementId || slugger.slugTag(t.name),
        expanded: t.expanded !== false,
        paths,
      };
    })
    .filter((t) => t.paths.length > 0);

  const tagGroups = (resolvedSpec.tagGroups || [])
    .filter((group) => !isInternalOrHidden(group))
    .map((group) => {
      const groupTags = (group.tags || [])
        .filter((t) => !isInternalOrHidden(t))
        .map((t) => {
          const paths = getTagOperations(t, resolvedSpec);
          return {
            name: t.name || t.displayName || '',
            displayName: t.displayName || t.name || '',
            description: t.description || '',
            elementId: t.elementId || slugger.slugTag(t.name),
            expanded: t.expanded !== false,
            paths,
          };
        })
        .filter((t) => t.paths.length > 0);

      if (groupTags.length === 0) return null;
      return {
        name: group.name || group.displayName || '',
        displayName: group.displayName || group.name || '',
        description: group.description || '',
        elementId: group.elementId || slugger.slugTagGroup(group.name),
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

/**
 * Asynchronously generates complete navigation HTML directly from a spec input (file, URL, or object).
 *
 * @param {string|Object} specInput
 * @param {Object} [options]
 * @returns {Promise<string>}
 */
export async function getNavBarHtml(specInput, options = {}) {
  const resolvedSpec = await resolveSpecInput(specInput, options);
  return renderNavBarHtml(resolvedSpec, options);
}

/**
 * Pure, zero-dependency HTML string generator for OpenAPI navigation.
 * Produces identical markup and CSS classes as core RapiDoc's navbarTemplate directly from the spec.
 *
 * @param {Object} resolvedSpec - Resolved OpenAPI specification
 * @param {Object} [options]
 * @param {string} [options.basePath=''] - Base URL prefix for all links (e.g. '/apis/shipments')
 * @param {string} [options.activeHref=''] - Currently active path or anchor
 * @param {boolean} [options.includeSearch=true] - Render filter/search input header
 * @param {string} [options.searchPlaceholder='Filter...'] - Search placeholder
 * @param {string} [options.backToDocsHref=''] - Optional back-link to documentation
 * @param {string} [options.backToDocsLabel='Documentation'] - Label for back-link
 * @param {string} [options.itemClassName=''] - Additional CSS class for endpoint link items
 * @param {boolean} [options.includeOverview=true] - Include overview/info link
 * @param {'3-char'|'full'} [options.methodBadgeFormat='3-char'] - Badge format
 * @param {boolean} [options.usePathInNav=false] - Display endpoint path instead of summary
 * @returns {string} Standard RapiDoc navigation HTML
 */
export function renderNavBarHtml(resolvedSpec = {}, options = {}) {
  const {
    basePath = '',
    activeHref = '',
    includeSearch = true,
    searchPlaceholder = 'Filter...',
    backToDocsHref = '',
    backToDocsLabel = 'Documentation',
    itemClassName = '',
    includeOverview = true,
    methodBadgeFormat = '3-char',
    usePathInNav = false,
    routingMode = options.routingMode ?? options['routing-mode'] ?? 'single-page',
  } = options;

  const slugger = new OperationSlugger();

  function renderOperation(op, tagSlug = '') {
    if (!op || isInternalOrHidden(op)) return '';
    const method = op.method ? op.method.toLowerCase() : 'get';
    const path = op.path || '';
    const cleanBase = basePath.replace(/\/$/, '');

    // Extract clean operation slug (without tag prefix)
    const rawElementId = op.elementId || slugger.slug(op, tagSlug);
    const opSlug = slugger.slugOp ? slugger.slugOp(op) : rawElementId.replace(/^[a-z0-9_-]+--/, '');
    const hierarchicalId = tagSlug && tagSlug !== 'general' ? `${tagSlug}--${opSlug}` : opSlug;

    let href;
    let contentId;
    if (routingMode === 'tag-pages' && tagSlug && tagSlug !== 'general') {
      href = `${cleanBase}/${tagSlug}#${opSlug}`;
      contentId = opSlug;
    } else {
      href = `${cleanBase}#${hierarchicalId}`;
      contentId = hierarchicalId;
    }

    const title = usePathInNav ? path : op.summary || op.shortSummary || `${method.toUpperCase()} ${path}`;
    const methodBadge = getMethodBadge(method, methodBadgeFormat);
    const isActive = Boolean(
      activeHref &&
      (activeHref === href ||
        activeHref === `${cleanBase}/${tagSlug}` ||
        activeHref.endsWith(`#${contentId}`) ||
        activeHref.endsWith(contentId) ||
        (opSlug && activeHref.endsWith(`#${opSlug}`)))
    );
    const deprecatedStyle = op.deprecated ? 'style="filter:opacity(0.5);"' : '';
    const extraClass = itemClassName ? ` ${itemClassName}` : '';

    return `
      <a
        href="${escapeHtml(href)}"
        class="nav-bar-path${extraClass} ${isActive ? 'active' : ''}"
        ${deprecatedStyle}
        part="section-navbar-item section-navbar-path"
        data-action="navigate"
        data-content-id="${escapeHtml(contentId)}"
        data-op-slug="${escapeHtml(opSlug)}"
        data-path="${escapeHtml(path)}"
        id="link-${escapeHtml(contentId)}"
        tabindex="0"
      >
        <span class="nav-bar-path-label">${escapeHtml(title)}</span>
        <span class="nav-method as-colored-block ${escapeHtml(method)}">${escapeHtml(methodBadge)}</span>
      </a>`;
  }

  function renderTag(tag) {
    if (!tag || isInternalOrHidden(tag)) return '';
    const visiblePaths = getTagOperations(tag, resolvedSpec);
    if (visiblePaths.length === 0) return '';
    const tagSlug = toKebabCase(tag.name);
    const elementId = tag.elementId || slugger.slugTag(tag.name);
    const title = tag.displayName || tag.name || '';
    const isExpanded = tag.expanded !== false;
    const pathsHtml = visiblePaths.map((op) => renderOperation(op, tagSlug)).join('');
    const tagHref =
      routingMode === 'tag-pages' && tagSlug && tagSlug !== 'general'
        ? `${basePath.replace(/\/$/, '')}/${tagSlug}`
        : `${basePath}#${elementId}`;

    return `
      <div class="nav-bar-tag-and-paths ${isExpanded ? 'expanded' : 'collapsed'}" id="link-${escapeHtml(elementId)}">
        <div
          class="nav-bar-tag"
          part="section-navbar-item section-navbar-tag"
          id="link-${escapeHtml(elementId)}-header"
          data-action="expand-collapse-tag"
          data-tag-href="${escapeHtml(tagHref)}"
          tabindex="0"
          role="button"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
        >
          <div class="nav-bar-tag-title" data-tag-href="${escapeHtml(tagHref)}">${escapeHtml(title)}</div>
          <div class="nav-bar-tag-icon" tabindex="0" data-action="expand-collapse-tag"></div>
        </div>
        <div class="nav-bar-paths-under-tag">
          ${pathsHtml}
        </div>
      </div>`;
  }

  function renderGroup(group) {
    if (!group || isInternalOrHidden(group)) return '';
    const groupTagsHtml = (group.tags || []).map(renderTag).filter(Boolean).join('');
    if (!groupTagsHtml) return '';
    const groupId = group.elementId || slugger.slugTagGroup(group.name);
    const title = group.displayName || group.name || '';
    const isExpanded = group.expanded !== false;

    return `
      <div class="nav-bar-tag-group ${isExpanded ? 'expanded' : 'collapsed'}" id="link-${escapeHtml(groupId)}">
        <div
          class="nav-bar-tag-group-header"
          part="section-navbar-item section-navbar-tag-group"
          data-action="expand-collapse-tag-group"
          tabindex="0"
          role="button"
          aria-expanded="${isExpanded ? 'true' : 'false'}"
        >
          <div class="nav-bar-tag-group-title">${escapeHtml(title)}</div>
          <div class="nav-bar-tag-group-icon" tabindex="0" data-action="expand-collapse-tag-group"></div>
        </div>
        <div class="nav-bar-tags-under-group">
          ${groupTagsHtml}
        </div>
      </div>`;
  }

  let overviewHtml = '';
  if (includeOverview && resolvedSpec.info) {
    const overviewTitle = resolvedSpec.info.title || 'Overview';
    const href = `${basePath}#overview`;
    const isActive = Boolean(activeHref && (activeHref === href || !activeHref.includes('#')));
    overviewHtml = `
      <a
        href="${escapeHtml(href)}"
        class="nav-bar-info ${isActive ? 'active' : ''}"
        id="link-overview"
        data-action="navigate"
        data-content-id="overview"
        tabindex="0"
        part="section-navbar-item section-navbar-overview"
      >
        <span class="nav-bar-info-title">${escapeHtml(overviewTitle)}</span>
      </a>`;
  }

  let bodyHtml;
  if (resolvedSpec.tagGroups && resolvedSpec.tagGroups.length > 0) {
    const assignedTagNames = new Set();
    const groupsHtml = resolvedSpec.tagGroups
      .filter((g) => !isInternalOrHidden(g))
      .map((group) => {
        (group.tags || []).forEach((t) => assignedTagNames.add((t.name || '').toLowerCase()));
        return renderGroup(group);
      })
      .filter(Boolean)
      .join('');

    const remainingTagsHtml = (resolvedSpec.tags || [])
      .filter((t) => !assignedTagNames.has((t.name || '').toLowerCase()) && !isInternalOrHidden(t))
      .map(renderTag)
      .filter(Boolean)
      .join('');

    bodyHtml = groupsHtml + remainingTagsHtml;
  } else {
    bodyHtml = (resolvedSpec.tags || [])
      .filter((t) => !isInternalOrHidden(t))
      .map(renderTag)
      .filter(Boolean)
      .join('');
  }

  const searchHeaderHtml = includeSearch
    ? `
      <div class="nav-bar-header" part="section-navbar-header">
        <div class="nav-bar-search-container" part="section-navbar-search">
          <div class="nav-bar-search-input-wrapper">
            <input
              id="nav-bar-search"
              part="textbox textbox-nav-filter"
              class="nav-bar-search-input portal-filter-input"
              type="text"
              placeholder="${escapeHtml(searchPlaceholder)}"
              aria-label="Filter endpoints"
              spellcheck="false"
            />
            <span class="nav-bar-search-icon">🔍</span>
          </div>
          <button type="button" class="portal-search-btn" id="advanced-search-btn" part="btn btn-fill btn-search">SEARCH</button>
        </div>
      </div>`
    : '';

  const backLinkHtml = backToDocsHref
    ? `
      <div class="portal-sidebar-footer-link" style="padding: 16px 12px;">
        <a href="${escapeHtml(backToDocsHref)}" class="nav-bar-path">
          <span class="nav-bar-path-label">&larr; ${escapeHtml(backToDocsLabel)}</span>
        </a>
      </div>`
    : '';

  return `
    ${searchHeaderHtml}
    <div class="nav-scroll" tabindex="-1" part="section-navbar-scroll">
      ${overviewHtml}
      ${bodyHtml}
      ${backLinkHtml}
    </div>`;
}

export default {
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getMethodBadge,
  isInternalOrHidden,
};
