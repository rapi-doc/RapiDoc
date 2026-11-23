/**
 * The static sidebar and the navigation model of an OpenAPI spec.
 *
 * - `getNavBarHtml(specInput, options)`: loads the spec and returns the sidebar's HTML
 * - `renderNavBarHtml(resolvedSpec, options)`: the same from an already parsed model (internal)
 * - `getSpecNavigation(specInput, options)`: the tag groups, tags and operations as data
 *
 * With tag groups (x-tagGroups / x-tag-groups) the sidebar has three levels, otherwise two.
 */

import { resolveSpecInput } from "./render.js";
import { SPEC_OPTIONS, isTrue, pick, readOptions } from "./options.js";
import { escapeHtml } from "./serializer.js";
import { OperationSlugger, toKebabCase } from "../../rapidoc/src/utils/slugger.js";
import { bindNavBar } from "../../rapidoc/src/utils/bind-navbar.js";
import {
  isInternalOrHidden,
  navBadgeDot,
  navIconSvg,
  navItemTitle,
} from "../../rapidoc/src/utils/common-utils.js";

/** Values of show-method-in-nav-bar (rapidoc.ts accepts the same). */
const METHOD_STYLES = ["false", "as-plain-text", "as-colored-text", "as-colored-block"];

/**
 * Normalizes HTTP method badge string (3-character format matching core RapiDoc).
 * e.g., 'delete' -> 'DEL', 'post' -> 'POS', 'get' -> 'GET', 'put' -> 'PUT'
 *
 * @param {string} method
 * @param {'3-char'|'full'} [format='3-char']
 * @returns {string}
 */
export function getMethodBadge(method, format = "3-char") {
  if (!method) return "";
  const m = String(method).toLowerCase();
  if (format === "3-char") {
    return m.substring(0, 3).toUpperCase();
  }
  return m.toUpperCase();
}

/** A tag's operations, without the hidden ones (x-internal, x-hidden). */
function getTagOperations(tag) {
  return (tag.paths || []).filter((p) => !isInternalOrHidden(p));
}

/** An operation as getSpecNavigation returns it: these fields and no others (index.d.ts: NavigationOperation). */
function toNavigationOperation(op) {
  return {
    method: op.method || "",
    path: op.path || "",
    summary: op.summary || "",
    description: op.description || "",
    elementId: op.elementId || "",
    deprecated: Boolean(op.deprecated),
    operationId: op.operationId || "",
    isWebhook: Boolean(op.isWebhook),
  };
}

/**
 * The navigation of a spec as data: tag groups, tags and their operations, without the hidden ones.
 *
 * @param {string|Object} specInput - File path, URL, JSON or YAML text, or object
 * @param {Object} [options] - The spec options (`sortTags`, `sortEndpointsBy`, `filterOperations`,
 *   `showUnusedTags`, `generateMissingTags`, ...), as on <rapi-doc>
 * @returns {Promise<{ title: string, version: string, description: string, tagGroups: Array, tags: Array, remainingTags: Array }>}
 */
export async function getSpecNavigation(specInput, options) {
  const o = readOptions("getSpecNavigation", options, { attributes: SPEC_OPTIONS });
  const resolvedSpec = await resolveSpecInput(specInput, o);
  const slugger = new OperationSlugger();

  const allTags = (resolvedSpec.tags || [])
    .filter((t) => !isInternalOrHidden(t))
    .map((t) => {
      const paths = getTagOperations(t).map(toNavigationOperation);
      return {
        name: t.name || t.displayName || "",
        displayName: t.displayName || t.name || "",
        description: t.description || "",
        elementId: t.elementId || slugger.slugTag(t.name),
        expanded: t.expanded !== false,
        paths,
        ...(t.descriptionOnly ? { descriptionOnly: true } : {}),
      };
    })
    .filter((t) => t.paths.length > 0 || t.descriptionOnly);

  const assignedTagNames = new Set();
  const tagGroups = (resolvedSpec.tagGroups || [])
    .filter((group) => !isInternalOrHidden(group))
    .map((group) => {
      const groupTags = (group.tags || [])
        .filter((t) => !isInternalOrHidden(t))
        .map((t) => {
          assignedTagNames.add((t.name || "").toLowerCase());
          const paths = getTagOperations(t).map(toNavigationOperation);
          return {
            name: t.name || t.displayName || "",
            displayName: t.displayName || t.name || "",
            description: t.description || "",
            elementId: t.elementId || slugger.slugTag(t.name),
            expanded: t.expanded !== false,
            paths,
            ...(t.descriptionOnly ? { descriptionOnly: true } : {}),
          };
        })
        .filter((t) => t.paths.length > 0 || t.descriptionOnly);

      if (groupTags.length === 0) return null;
      return {
        name: group.name || group.displayName || "",
        displayName: group.displayName || group.name || "",
        description: group.description || "",
        elementId: group.elementId || slugger.slugTagGroup(group.name),
        expanded: group.expanded !== false,
        tags: groupTags,
      };
    })
    .filter(Boolean);

  const remainingTags =
    tagGroups.length > 0 ? allTags.filter((t) => !assignedTagNames.has(t.name.toLowerCase())) : [];

  return {
    title: resolvedSpec.info?.title || "",
    version: resolvedSpec.info?.version || "",
    description: resolvedSpec.info?.description || "",
    tagGroups,
    tags: allTags,
    remainingTags,
  };
}

/**
 * Renders a single operation item link.
 */
function renderOperation(op, tagSlug, ctx) {
  if (!op || isInternalOrHidden(op)) return "";
  const method = op.method ? op.method.toLowerCase() : "get";
  const path = op.path || "";

  // Extract clean operation slug without tag prefix
  let opSlug;
  let hierarchicalId;

  if (op.elementId) {
    hierarchicalId = op.elementId;
    if (tagSlug && tagSlug !== "general") {
      const prefix = `${tagSlug}--`;
      opSlug = hierarchicalId.startsWith(prefix)
        ? hierarchicalId.slice(prefix.length)
        : ctx.slugger.slugOp(op);
    } else {
      opSlug = hierarchicalId;
    }
  } else {
    opSlug = ctx.slugger.slugOp(op);
    hierarchicalId = tagSlug && tagSlug !== "general" ? `${tagSlug}--${opSlug}` : opSlug;
  }

  let href;
  let contentId;
  if (ctx.routingMode === "tag-pages" && tagSlug && tagSlug !== "general") {
    href = `${ctx.cleanBase}/${tagSlug}#${opSlug}`;
    contentId = opSlug;
  } else {
    href = `${ctx.cleanBase}#${hierarchicalId}`;
    contentId = hierarchicalId;
  }

  const label = ctx.usePathInNavBar
    ? `<span class="mono-font">${escapeHtml(path)}</span>`
    : escapeHtml(op.summary || op.shortSummary || `${method.toUpperCase()} ${path}`);
  // As in <rapi-doc>: a three-letter badge for as-colored-block, the full method otherwise, nothing for false.
  const methodStyle = ctx.showMethodInNavBar;
  const methodBadge = getMethodBadge(
    method,
    methodStyle === "as-colored-block" ? ctx.methodBadgeFormat : "full",
  );
  const methodHtml =
    methodStyle === "false"
      ? ""
      : `\n      <span class="nav-method ${methodStyle} ${method}">${methodBadge}</span>`;
  const isActive = Boolean(
    ctx.activeHref &&
    (ctx.activeHref === href ||
      ctx.activeHref.endsWith(`#${contentId}`) ||
      (opSlug && ctx.activeHref.endsWith(`#${opSlug}`))),
  );
  const deprecatedClass = op.deprecated ? " deprecated" : "";
  const extraClass = ctx.itemClassName ? ` ${ctx.itemClassName}` : "";

  return `
    <a
      href="${escapeHtml(href)}"
      class="nav-bar-path${extraClass} ${isActive ? "active" : ""}${deprecatedClass}"${isActive ? ' aria-current="true"' : ""}
      part="section-navbar-item section-navbar-path"
      data-action="navigate"
      data-content-id="${contentId}"
      data-op-slug="${opSlug}"
      data-path="${escapeHtml(path)}"
      id="link-${contentId}"
      data-title="${escapeHtml(navItemTitle(ctx.usePathInNavBar ? path : op.summary || op.shortSummary || `${method.toUpperCase()} ${path}`, op.xBadges))}"
    >
${methodHtml}
      <span class="nav-bar-path-label">${label}</span>${badgeDotHtml(ctx.showBadgesInNavBar, op.xBadges)}
    </a>`;
}

/** An item's badge dot, as <rapi-doc>'s show-badges-in-nav-bar="dot" draws it */
function badgeDotHtml(mode, xBadges) {
  if (mode === "false") return "";
  const dot = navBadgeDot(xBadges);
  if (!dot) return "";
  const labels = escapeHtml(dot.labels.join(", "));
  return `\n      <span class="nav-badge-dot" part="nav-badge-dot" role="img" aria-label="Badges: ${labels}" style="background:${escapeHtml(dot.color)}"></span>`;
}

/**
 * Renders a tag accordion section and its underlying operations.
 */
function renderTag(tag, ctx) {
  if (!tag || isInternalOrHidden(tag)) return "";
  const visiblePaths = getTagOperations(tag);
  if (visiblePaths.length === 0 && !tag.descriptionOnly) return "";
  const tagSlug = toKebabCase(tag.name);
  const elementId = tag.elementId || ctx.slugger.slugTag(tag.name);
  const title = tag.displayName || tag.name || "";
  const isExpanded = tag.expanded !== false;
  const pathsHtml = visiblePaths.map((op) => renderOperation(op, tagSlug, ctx)).join("");
  const tagHref =
    ctx.routingMode === "tag-pages" && tagSlug && tagSlug !== "general"
      ? `${ctx.cleanBase}/${tagSlug}`
      : `${ctx.cleanBase}#${elementId}`;

  const isActive = Boolean(
    ctx.activeHref && (ctx.activeHref === tagHref || ctx.activeHref.endsWith(`#${elementId}`)),
  );

  // A description-only tag (show-unused-tags) is a link to its section, with nothing to expand
  if (tag.descriptionOnly) {
    return `
    <div class="nav-bar-tag-and-paths description-only">
      <a
        href="${escapeHtml(tagHref)}"
        class="nav-bar-tag ${isActive ? "active" : ""}"${isActive ? ' aria-current="true"' : ""}
        part="section-navbar-item section-navbar-tag"
        id="link-${elementId}"
        data-action="navigate"
        data-content-id="${elementId}"
      >
        <span class="nav-bar-tag-title">${escapeHtml(title)}</span>
      </a>
    </div>`;
  }

  return `
    <div class="nav-bar-tag-and-paths ${isExpanded ? "expanded" : "collapsed"}">
      <div class="nav-bar-tag${isActive ? " active" : ""}" part="section-navbar-item section-navbar-tag">
        <a
          href="${escapeHtml(tagHref)}"
          id="link-${elementId}"
          class="nav-bar-tag-title"${isActive ? ' aria-current="true"' : ""}
          data-action="navigate"
          data-content-id="${elementId}"
        >${escapeHtml(title)}</a>
        <button
          type="button"
          class="nav-bar-tag-icon"
          aria-label="Expand or collapse ${escapeHtml(title)}"
          aria-expanded="${isExpanded ? "true" : "false"}"
          data-action="expand-collapse-tag"
        ></button>
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
  if (!group || isInternalOrHidden(group)) return "";
  const groupTagsHtml = (group.tags || [])
    .map((t) => renderTag(t, ctx))
    .filter(Boolean)
    .join("");
  if (!groupTagsHtml) return "";
  const groupId = group.elementId || ctx.slugger.slugTagGroup(group.name);
  const title = group.displayName || group.name || "";

  return `
    <div class="nav-bar-tag-group expanded" id="link-${groupId}">
      <div
        class="nav-bar-tag-group-header nav-bar-section-label"
        part="section-navbar-item section-navbar-tag-group section-navbar-label"
      >
        <div class="nav-bar-tag-group-title">${escapeHtml(title)}</div>
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
export function getNavFilterHtml(options) {
  const o = readOptions("getNavFilterHtml", options, {
    own: ["searchPlaceholder", "inputClassName"],
  });
  const placeholder = o.searchPlaceholder || "Filter...";
  const extraClass = o.inputClassName ? ` ${o.inputClassName}` : "";
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

/** Options of the sidebar that are not attributes of <rapi-doc>. */
const NAV_OWN_OPTIONS = [
  "basePath",
  "activeHref",
  "includeSearch",
  "searchPlaceholder",
  "backToDocsHref",
  "backToDocsLabel",
  "itemClassName",
  "includeOverview",
  "methodBadgeFormat",
  "routingMode",
];
/** Options of the sidebar that are attributes of <rapi-doc>. */
const NAV_ATTRIBUTE_OPTIONS = ["showMethodInNavBar", "showBadgesInNavBar", "usePathInNavBar"];

/**
 * The sidebar's HTML for a spec: the options of `renderNavBarHtml` below, plus the spec options
 * (`sortTags`, `sortEndpointsBy`, `filterOperations`, `showUnusedTags`, ...), as on <rapi-doc>.
 *
 * @param {string|Object} specInput - File path, URL, JSON or YAML text, or object
 * @param {Object} [options]
 * @returns {Promise<string>}
 */
export async function getNavBarHtml(specInput, options) {
  const o = readOptions("getNavBarHtml", options, {
    own: NAV_OWN_OPTIONS,
    attributes: [...NAV_ATTRIBUTE_OPTIONS, ...SPEC_OPTIONS],
  });
  const resolvedSpec = await resolveSpecInput(specInput, pick(o, SPEC_OPTIONS));
  return renderNavBarHtml(resolvedSpec, pick(o, [...NAV_OWN_OPTIONS, ...NAV_ATTRIBUTE_OPTIONS]));
}

/**
 * The sidebar's HTML from an already parsed model (`resolveSpecInput`), in the structure <rapi-doc>'s
 * own sidebar has. Internal: the model's shape follows the parser.
 *
 * @param {Object} resolvedSpec - The parsed model
 * @param {Object} [options]
 * @param {string} [options.basePath=''] - Base URL prefix for all links (e.g. '/apis/shipments'); a closing slash is ignored
 * @param {string} [options.activeHref=''] - Currently active path or anchor
 * @param {boolean} [options.includeSearch=true] - Render filter/search input header
 * @param {string} [options.searchPlaceholder='Filter...'] - Search placeholder
 * @param {string} [options.backToDocsHref=''] - Optional back-link to documentation
 * @param {string} [options.backToDocsLabel='Documentation'] - Label for back-link
 * @param {string} [options.itemClassName=''] - Additional CSS class for endpoint link items
 * @param {boolean} [options.includeOverview=true] - Include overview/info link
 * @param {'3-char'|'full'} [options.methodBadgeFormat='3-char'] - Badge format (with `as-colored-block`)
 * @param {'false'|'as-plain-text'|'as-colored-text'|'as-colored-block'} [options.showMethodInNavBar='as-colored-text'] -
 *   How each operation shows its HTTP method, as `show-method-in-nav-bar` of <rapi-doc>
 * @param {boolean|string} [options.usePathInNavBar=false] - Each operation's path instead of its summary, as
 *   `use-path-in-nav-bar` of <rapi-doc>
 * @param {'dot'|'false'} [options.showBadgesInNavBar='dot'] - A dot on items whose operation shows a badge, as
 *   `show-badges-in-nav-bar` of <rapi-doc>
 * @param {'single-page'|'tag-pages'} [options.routingMode='single-page'] - `tag-pages`: links go to a page per tag
 *   (`<basePath>/<tag slug>#<operation>`)
 * @returns {string} Standard RapiDoc navigation HTML
 */
export function renderNavBarHtml(resolvedSpec = {}, options) {
  const o = readOptions("renderNavBarHtml", options, {
    own: NAV_OWN_OPTIONS,
    attributes: NAV_ATTRIBUTE_OPTIONS,
  });
  const {
    basePath = "",
    activeHref = "",
    includeSearch = true,
    searchPlaceholder = "Filter...",
    backToDocsHref = "",
    backToDocsLabel = "Documentation",
    itemClassName = "",
    includeOverview = true,
    methodBadgeFormat = "3-char",
    routingMode = "single-page",
  } = o;
  // The same values as <rapi-doc>'s attributes; anything else is the default.
  const showMethodInNavBar = METHOD_STYLES.includes(String(o.showMethodInNavBar))
    ? String(o.showMethodInNavBar)
    : "as-colored-text";
  const showBadgesInNavBar = String(o.showBadgesInNavBar) === "false" ? "false" : "dot";
  const usePathInNavBar = isTrue(o.usePathInNavBar);

  const slugger = new OperationSlugger();
  // One form for every link: `/apis/x/` and `/apis/x` both give `/apis/x#...` and `/apis/x/<tag>`
  const cleanBase = String(basePath).replace(/\/+$/, "");

  const ctx = {
    cleanBase,
    activeHref,
    routingMode,
    itemClassName,
    includeOverview,
    methodBadgeFormat,
    showMethodInNavBar,
    showBadgesInNavBar,
    usePathInNavBar,
    resolvedSpec,
    slugger,
  };

  let overviewHtml = "";
  if (includeOverview && resolvedSpec.info) {
    const overviewTitle = resolvedSpec.info.title || "Overview";
    const href = `${cleanBase}#overview`;
    const isActive = Boolean(
      activeHref &&
      (activeHref === href ||
        activeHref === cleanBase ||
        activeHref === `${cleanBase}/` ||
        activeHref.endsWith("#overview")),
    );
    overviewHtml = `
      <div class="nav-bar-section-label" part="section-navbar-label">Overview</div>
      <a
        href="${escapeHtml(href)}"
        class="nav-bar-info ${isActive ? "active" : ""}"${isActive ? ' aria-current="true"' : ""}
        id="link-overview"
        data-action="navigate"
        data-content-id="overview"
        part="section-navbar-item section-navbar-overview"
      >
        ${navIconSvg("overview")}<span class="nav-bar-info-title">${escapeHtml(overviewTitle)}</span>
      </a>`;
  }

  let bodyHtml;
  const hasTagGroups = Boolean(resolvedSpec.tagGroups && resolvedSpec.tagGroups.length > 0);
  if (hasTagGroups) {
    const assignedTagNames = new Set();
    const groupsHtml = resolvedSpec.tagGroups
      .filter((g) => !isInternalOrHidden(g))
      .map((group) => {
        (group.tags || []).forEach((t) => assignedTagNames.add((t.name || "").toLowerCase()));
        return renderGroup(group, ctx);
      })
      .filter(Boolean)
      .join("");

    const remainingTagsHtml = (resolvedSpec.tags || [])
      .filter((t) => !assignedTagNames.has((t.name || "").toLowerCase()) && !isInternalOrHidden(t))
      .map((t) => renderTag(t, ctx))
      .filter(Boolean)
      .join("");

    bodyHtml = groupsHtml + remainingTagsHtml;
  } else {
    bodyHtml = (resolvedSpec.tags || [])
      .filter((t) => !isInternalOrHidden(t))
      .map((t) => renderTag(t, ctx))
      .filter(Boolean)
      .join("");
  }

  // Dedicated in-place filter input header (without redundant SEARCH modal button)
  const searchHeaderHtml = includeSearch ? getNavFilterHtml({ searchPlaceholder }) : "";

  const backLinkHtml = backToDocsHref
    ? `
      <div class="portal-sidebar-footer-link">
        <a href="${escapeHtml(backToDocsHref)}" class="nav-bar-path">
          <span class="nav-bar-path-label">&larr; ${escapeHtml(backToDocsLabel)}</span>
        </a>
      </div>`
    : "";

  return `
    ${searchHeaderHtml}
    <div class="nav-scroll${hasTagGroups ? "" : " tags-as-labels"}" tabindex="-1" part="section-navbar-scroll">
      ${overviewHtml}
      ${bodyHtml}
      ${backLinkHtml}
    </div>`;
}

export { bindNavBar };
