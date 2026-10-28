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
import { bindNavBar } from '../utils/bind-navbar.js';
import { isInternalOrHidden } from '../utils/common-utils.js';

export { isInternalOrHidden };

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
 *
 * @param {Object} tag
 * @param {Object} spec
 * @param {OperationSlugger} [sharedSlugger]
 */
function getTagOperations(tag, spec, sharedSlugger) {
  if (Array.isArray(tag.paths) && tag.paths.length > 0) {
    return tag.paths.filter((p) => !isInternalOrHidden(p));
  }
  if (!spec?.paths || typeof spec.paths !== 'object') return [];

  const tagName = (tag.name || '').toLowerCase();
  const operations = [];
  const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
  const slugger = sharedSlugger || new OperationSlugger();
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
 * @returns {Promise<{ title: string, version: string, description: string, tagGroups: Array, tags: Array, remainingTags: Array }>}
 */
export async function getSpecNavigation(specInput, options = {}) {
  const resolvedSpec = await resolveSpecInput(specInput, options);
  const slugger = new OperationSlugger();

  const allTags = (resolvedSpec.tags || [])
    .filter((t) => !isInternalOrHidden(t))
    .map((t) => {
      const paths = getTagOperations(t, resolvedSpec, slugger);
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

  const assignedTagNames = new Set();
  const tagGroups = (resolvedSpec.tagGroups || [])
    .filter((group) => !isInternalOrHidden(group))
    .map((group) => {
      const groupTags = (group.tags || [])
        .filter((t) => !isInternalOrHidden(t))
        .map((t) => {
          assignedTagNames.add((t.name || '').toLowerCase());
          const paths = getTagOperations(t, resolvedSpec, slugger);
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

  const remainingTags = tagGroups.length > 0 ? allTags.filter((t) => !assignedTagNames.has(t.name.toLowerCase())) : [];

  return {
    title: resolvedSpec.info?.title || '',
    version: resolvedSpec.info?.version || '',
    description: resolvedSpec.info?.description || '',
    tagGroups,
    tags: allTags,
    remainingTags,
  };
}

/**
 * Renders a single operation item link.
 */
function renderOperation(op, tagSlug, ctx) {
  if (!op || isInternalOrHidden(op)) return '';
  const method = op.method ? op.method.toLowerCase() : 'get';
  const path = op.path || '';

  // Extract clean operation slug without tag prefix
  const rawElementId = op.elementId || ctx.slugger.slug(op, tagSlug);
  let opSlug;
  let hierarchicalId;

  if (op.elementId) {
    hierarchicalId = op.elementId;
    if (tagSlug && tagSlug !== 'general') {
      const prefix = `${tagSlug}--`;
      opSlug = hierarchicalId.startsWith(prefix)
        ? hierarchicalId.slice(prefix.length)
        : ctx.slugger.slugOp
          ? ctx.slugger.slugOp(op)
          : hierarchicalId;
    } else {
      opSlug = hierarchicalId;
    }
  } else {
    opSlug = ctx.slugger.slugOp ? ctx.slugger.slugOp(op) : rawElementId.replace(/^[a-z0-9_-]+--/, '');
    hierarchicalId = tagSlug && tagSlug !== 'general' ? `${tagSlug}--${opSlug}` : opSlug;
  }

  let href;
  let contentId;
  if (ctx.routingMode === 'tag-pages' && tagSlug && tagSlug !== 'general') {
    href = `${ctx.cleanBase}/${tagSlug}#${opSlug}`;
    contentId = opSlug;
  } else {
    href = `${ctx.cleanBase}#${hierarchicalId}`;
    contentId = hierarchicalId;
  }

  const title = ctx.usePathInNav ? path : op.summary || op.shortSummary || `${method.toUpperCase()} ${path}`;
  const methodBadge = getMethodBadge(method, ctx.methodBadgeFormat);
  const isActive = Boolean(
    ctx.activeHref &&
    (ctx.activeHref === href || ctx.activeHref.endsWith(`#${contentId}`) || (opSlug && ctx.activeHref.endsWith(`#${opSlug}`)))
  );
  const deprecatedClass = op.deprecated ? ' deprecated' : '';
  const extraClass = ctx.itemClassName ? ` ${ctx.itemClassName}` : '';

  return `
    <a
      href="${escapeHtml(href)}"
      class="nav-bar-path${extraClass} ${isActive ? 'active' : ''}${deprecatedClass}"
      part="section-navbar-item section-navbar-path"
      data-action="navigate"
      data-content-id="${contentId}"
      data-op-slug="${opSlug}"
      data-path="${escapeHtml(path)}"
      id="link-${contentId}"
      tabindex="0"
    >
      <span class="nav-bar-path-label">${escapeHtml(title)}</span>
      <span class="nav-method as-colored-block ${method}">${methodBadge}</span>
    </a>`;
}

/**
 * Renders a tag accordion section and its underlying operations.
 */
function renderTag(tag, ctx) {
  if (!tag || isInternalOrHidden(tag)) return '';
  const visiblePaths = getTagOperations(tag, ctx.resolvedSpec, ctx.slugger);
  if (visiblePaths.length === 0) return '';
  const tagSlug = toKebabCase(tag.name);
  const elementId = tag.elementId || ctx.slugger.slugTag(tag.name);
  const title = tag.displayName || tag.name || '';
  const isExpanded = tag.expanded !== false;
  const pathsHtml = visiblePaths.map((op) => renderOperation(op, tagSlug, ctx)).join('');
  const tagHref =
    ctx.routingMode === 'tag-pages' && tagSlug && tagSlug !== 'general' ? `${ctx.cleanBase}/${tagSlug}` : `${ctx.basePath}#${elementId}`;

  return `
    <div class="nav-bar-tag-and-paths ${isExpanded ? 'expanded' : 'collapsed'}" id="link-${elementId}">
      <div
        class="nav-bar-tag"
        part="section-navbar-item section-navbar-tag"
        id="link-${elementId}-header"
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

/**
 * Renders a 3-tier tag group accordion.
 */
function renderGroup(group, ctx) {
  if (!group || isInternalOrHidden(group)) return '';
  const groupTagsHtml = (group.tags || [])
    .map((t) => renderTag(t, ctx))
    .filter(Boolean)
    .join('');
  if (!groupTagsHtml) return '';
  const groupId = group.elementId || ctx.slugger.slugTagGroup(group.name);
  const title = group.displayName || group.name || '';
  const isExpanded = group.expanded !== false;

  return `
    <div class="nav-bar-tag-group ${isExpanded ? 'expanded' : 'collapsed'}" id="link-${groupId}">
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

/**
 * Renders standard RapiDoc navigation filter/search header HTML.
 *
 * @param {Object} [options]
 * @param {string} [options.searchPlaceholder='Filter...']
 * @param {string} [options.inputClassName='']
 * @returns {string}
 */
export function getNavFilterHtml(options = {}) {
  const placeholder = options.searchPlaceholder || options.placeholder || 'Filter...';
  const extraClass = options.inputClassName ? ` ${options.inputClassName}` : '';
  return `
      <div class="nav-bar-header" part="section-navbar-header">
        <div class="nav-bar-search-container" part="section-navbar-search">
          <div class="nav-bar-search-input-wrapper">
            <input
              id="nav-bar-search"
              part="textbox textbox-nav-filter"
              class="nav-bar-search-input portal-filter-input${extraClass}"
              type="text"
              placeholder="${escapeHtml(placeholder)}"
              aria-label="Filter endpoints"
              spellcheck="false"
            />
            <svg class="nav-bar-search-icon" viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"/></svg>
          </div>
        </div>
      </div>`;
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
 * Produces standard RapiDoc navigation HTML directly from the spec.
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
  const cleanBase = basePath.replace(/\/$/, '');

  const ctx = {
    basePath,
    cleanBase,
    activeHref,
    routingMode,
    itemClassName,
    includeOverview,
    methodBadgeFormat,
    usePathInNav,
    resolvedSpec,
    slugger,
  };

  let overviewHtml = '';
  if (includeOverview && resolvedSpec.info) {
    const overviewTitle = resolvedSpec.info.title || 'Overview';
    const href = `${basePath}#overview`;
    const isActive = Boolean(
      activeHref && (activeHref === href || activeHref === basePath || activeHref === `${basePath}/` || activeHref.endsWith('#overview'))
    );
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
        return renderGroup(group, ctx);
      })
      .filter(Boolean)
      .join('');

    const remainingTagsHtml = (resolvedSpec.tags || [])
      .filter((t) => !assignedTagNames.has((t.name || '').toLowerCase()) && !isInternalOrHidden(t))
      .map((t) => renderTag(t, ctx))
      .filter(Boolean)
      .join('');

    bodyHtml = groupsHtml + remainingTagsHtml;
  } else {
    bodyHtml = (resolvedSpec.tags || [])
      .filter((t) => !isInternalOrHidden(t))
      .map((t) => renderTag(t, ctx))
      .filter(Boolean)
      .join('');
  }

  // Dedicated in-place filter input header (without redundant SEARCH modal button)
  const searchHeaderHtml = includeSearch ? getNavFilterHtml({ searchPlaceholder }) : '';

  const backLinkHtml = backToDocsHref
    ? `
      <div class="portal-sidebar-footer-link">
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

export { bindNavBar };

export default {
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getNavFilterHtml,
  getMethodBadge,
  isInternalOrHidden,
  bindNavBar,
};
