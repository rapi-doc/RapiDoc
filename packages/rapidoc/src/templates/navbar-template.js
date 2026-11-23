/**
 * Renders the sidebar navigation panel with search filter, tag groupings, method badges, and link routing.
 */
import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import Slugger from "github-slugger";
import {
  getMatchedPaths,
  isInternalOrHidden,
  navBadgeDot,
  navIconSvg,
  navItemTitle,
  syncNavItemTitle,
} from "~/utils/common-utils";

/** A sidebar item's badge dot (show-badges-in-nav-bar="dot"): the first badge's color, every label */
function navBadgeDotTemplate(mode, xBadges) {
  if (mode === "false") return "";
  const dot = navBadgeDot(xBadges);
  if (!dot) return "";
  const labels = dot.labels.join(", ");
  // The row's title shows the badges: the row's children take no pointer events
  return html`<span
    class="nav-badge-dot"
    part="nav-badge-dot"
    role="img"
    aria-label="Badges: ${labels}"
    style="background:${dot.color}"
  ></span>`;
}

/**
 * Marks a sidebar item as the current one, or not: the `active` class and part on the item (a row such
 * as a tag's, or a link), and `aria-current` on its link, which is what a screen reader announces.
 * Shared with the static sidebar's binding (utils/bind-navbar.js).
 *
 * @param {Element | null} item
 * @param {boolean} current
 * @param {string} [activeClass]
 */
export function markNavItem(item, current, activeClass = "active") {
  if (!item) return;
  const row = navItemRow(item);
  row.classList.toggle(activeClass, current);
  if (row.part) {
    if (current) row.part.add("section-navbar-active-item");
    else row.part.remove("section-navbar-active-item");
  }
  const link = item.matches("a") ? item : row.querySelector(":scope > a");
  if (!link) return;
  if (current) link.setAttribute("aria-current", "true");
  else link.removeAttribute("aria-current");
}

/**
 * The element that draws a sidebar item as current: the item itself, or for a tag's link (`link-<id>`
 * names the link, so a click on it navigates) the tag's row, which holds the link and the arrow.
 *
 * @param {Element} item
 * @returns {Element}
 */
export function navItemRow(item) {
  return item.matches("a.nav-bar-tag-title") && item.parentElement ? item.parentElement : item;
}

export function expandCollapseNavBarTag(navLinkEl, action = "toggle") {
  const tagAndPathEl = navLinkEl?.closest(".nav-bar-tag-and-paths");
  if (tagAndPathEl) {
    const isExpanded = tagAndPathEl.classList.contains("expanded");
    if (isExpanded && (action === "toggle" || action === "collapse")) {
      tagAndPathEl.classList.replace("expanded", "collapsed");
      tagAndPathEl.querySelector(".nav-bar-tag-icon")?.setAttribute("aria-expanded", "false");
    } else if (!isExpanded && (action === "toggle" || action === "expand")) {
      tagAndPathEl.classList.replace("collapsed", "expanded");
      tagAndPathEl.querySelector(".nav-bar-tag-icon")?.setAttribute("aria-expanded", "true");
    }
  }
}

// Opens the tag that holds a sidebar item (a tag group is a fixed label: nothing to open)
export function expandParentNavContainers(navLinkEl) {
  expandCollapseNavBarTag(navLinkEl, "expand");
}

export { isInternalOrHidden };

export function isNavPathVisible(path, searchVal, tagName) {
  if (isInternalOrHidden(path)) {
    return false;
  }
  if (searchVal) {
    return getMatchedPaths(searchVal, path, tagName);
  }
  return true;
}

export function isNavTagVisible(tag, searchVal) {
  if (isInternalOrHidden(tag)) {
    return false;
  }
  // A description-only tag (show-unused-tags) has no operations to match, so the filter hides it
  if (tag.descriptionOnly) {
    return !searchVal;
  }
  return (tag.paths || []).some((path) => isNavPathVisible(path, searchVal, tag.name));
}

export function isNavTagGroupVisible(group, searchVal) {
  if (isInternalOrHidden(group)) {
    return false;
  }
  return (group.tags || []).some((tag) => isNavTagVisible(tag, searchVal));
}

export function navBarClickAndEnterHandler(event) {
  if (event.type !== "click") return;
  const navEl = event.target.closest("[data-action]") || event.target;
  // Ignore clicks or enter inside the search / filter controls or logo slot
  if (
    navEl.closest("#nav-bar-search") ||
    navEl.closest("#advanced-search-btn") ||
    navEl.closest('[part~="btn-clear-filter"]') ||
    navEl.closest('slot[name="nav-logo"]')
  ) {
    return;
  }
  // A link opened in a new tab or window (Ctrl, Cmd, Shift, middle button) is the browser's business
  if (
    navEl.dataset?.action === "navigate" &&
    (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
  ) {
    return;
  }
  event.stopPropagation();
  if (navEl.dataset?.action === "navigate") {
    // The element scrolls to the section and sets the address itself (update-route)
    event.preventDefault();
    // A click on a closed tag's name opens it as well as going to its section
    if (navEl.closest(".nav-bar-tag")) expandCollapseNavBarTag(navEl, "expand");
    this.scrollToEventTarget(event, false);
    const navBarEl = event.currentTarget.closest("#nav-bar");
    // hide the navigation bar incase of floating navigation
    if (navBarEl.classList.contains("floating-nav")) {
      navBarEl.classList.remove("floating-nav");
      this.shadowRoot.getElementById("nav-bar-btn")?.setAttribute("aria-expanded", "false");
    }
  } else if (navEl.dataset?.action === "expand-collapse-tag") {
    expandCollapseNavBarTag(navEl, "toggle");
  }
}

export default function navbarTemplate() {
  const slugger = new Slugger();
  let isFirstNavItem = true;
  function checkFirstNav() {
    if (isFirstNavItem) {
      isFirstNavItem = false;
      return true;
    }
    return false;
  }
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return html`<nav class="nav-bar" part="section-navbar">
      <div class="nav-bar-header" part="section-navbar-header">
        <slot name="nav-logo" class="logo" part="section-navbar-logo"></slot>
      </div>
    </nav>`;
  }
  return html`
    <button
      id="nav-bar-btn"
      part="btn-navbar"
      type="button"
      aria-label="Menu"
      aria-controls="nav-bar"
      aria-expanded="false"
      @click="${this.onOpenNavBarToggle}"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path class="nav-bar-btn-line" d="M5 7h14" />
        <path class="nav-bar-btn-line" d="M5 12h14" />
        <path class="nav-bar-btn-line" d="M5 17h14" />
      </svg>
    </button>
    <nav
      id="nav-bar"
      class="nav-bar ${this.renderStyle} overflow-${this.navItemOverflow || "ellipsis"}"
      part="section-navbar"
      aria-label="API reference"
      @pointerover="${syncNavItemTitle}"
      @keydown="${(e) => {
        if (e.key === "Escape" && e.currentTarget.classList.contains("floating-nav")) {
          this.onOpenNavBarToggle();
          this.shadowRoot.getElementById("nav-bar-btn")?.focus();
        }
      }}"
    >
      <div
        class="nav-scroll${this.resolvedSpec.tagGroups?.length ? "" : " tags-as-labels"}"
        tabindex="-1"
        part="section-navbar-scroll"
        @click="${(e) => navBarClickAndEnterHandler.call(this, e)}"
      >
        <div class="nav-bar-header" part="section-navbar-header">
          <slot name="nav-logo" class="logo" part="section-navbar-logo"></slot>
          ${
            this.allowSearch === "false" && this.allowAdvancedSearch === "false"
              ? ""
              : html`
                  <div
                    class="nav-bar-search-container ${this.allowAdvancedSearch === "false" ? "has-bottom-border" : ""}"
                    part="section-navbar-search"
                  >
                    ${
                      this.allowSearch === "false"
                        ? ""
                        : html`
                            <div class="nav-bar-search-input-wrapper">
                              <input
                                id="nav-bar-search"
                                aria-label="Filter operations"
                                part="textbox textbox-nav-filter"
                                class="nav-bar-search-input"
                                type="text"
                                placeholder="Filter"
                                @change="${this.onSearchChange}"
                                spellcheck="false"
                              />
                              <div class="nav-bar-search-icon" @click="${this.onSearchChange}">&#x21a9;</div>
                            </div>
                            ${
                              this.searchVal
                                ? html` <button
                                    @click="${this.onClearSearch}"
                                    class="btn btn-outline btn-clear-filter"
                                    part="btn btn-outline btn-clear-filter"
                                  >
                                    CLEAR
                                  </button>`
                                : ""
                            }
                          `
                    }
                    ${
                      this.allowAdvancedSearch === "false" || this.searchVal
                        ? ""
                        : html`
                            <button
                              id="advanced-search-btn"
                              class="btn btn-primary"
                              part="btn btn-fill btn-search"
                              @click="${this.onShowAdvancedSearchClicked}"
                            >
                              SEARCH
                            </button>
                          `
                    }
                  </div>
                `
          }
        </div>
        ${(() => {
          // OVERVIEW: the API's title (with its description's headings under it), API Servers and
          // Authentication, under one section label
          const showOverviewItem = this.showInfo !== "false" && this.resolvedSpec.info;
          const showHeadings =
            showOverviewItem &&
            this.infoDescriptionHeadingsInNavBar === "true" &&
            this.resolvedSpec.infoDescriptionHeaders.length > 0;
          const showServers = this.allowServerSelection !== "false";
          const showAuth =
            this.allowAuthentication !== "false" && Boolean(this.resolvedSpec.securitySchemes);
          if (!showOverviewItem && !showServers && !showAuth) return "";
          const infoItem = (id, contentId, cls, part, iconName, label) => {
            const isFirst = checkFirstNav();
            return html`<a
              href="#${contentId}"
              class="${cls}${isFirst ? " first-nav-item" : ""}"
              id="${id}"
              data-action="navigate"
              data-content-id="${contentId}"
              data-first-nav-item="${isFirst ? "true" : nothing}"
              part="${part}"
            >
              ${unsafeHTML(navIconSvg(iconName))}<span class="nav-bar-info-title">${label}</span>
            </a>`;
          };
          return html`
            <div class="nav-bar-section-label" part="section-navbar-label">Overview</div>
            ${
              showOverviewItem
                ? infoItem(
                    "link-overview",
                    "overview",
                    "nav-bar-info",
                    "section-navbar-item section-navbar-overview",
                    "overview",
                    this.resolvedSpec.info?.title?.trim() || "Overview",
                  )
                : ""
            }
            ${
              showHeadings
                ? html`<div class="overview-headers">
                    ${this.resolvedSpec.infoDescriptionHeaders.map((header) => {
                      const headerElId = slugger.slug(header.text);
                      return html`<a
                        href="#overview--${headerElId}"
                        class="nav-bar-h${header.depth}"
                        id="link-overview--${headerElId}"
                        data-action="navigate"
                        data-content-id="overview--${headerElId}"
                      >
                        <span class="nav-bar-path-label">${header.text}</span>
                      </a>`;
                    })}
                  </div>`
                : ""
            }
            ${
              showServers
                ? infoItem(
                    "link-servers",
                    "servers",
                    "nav-bar-info",
                    "section-navbar-item section-navbar-servers",
                    "servers",
                    "API Servers",
                  )
                : ""
            }
            ${
              showAuth
                ? infoItem(
                    "link-auth",
                    "auth",
                    "nav-bar-info",
                    "section-navbar-item section-navbar-auth",
                    "auth",
                    "Authentication",
                  )
                : ""
            }
          `;
        })()}

        <!-- TAGS AND PATHS (3-tier if tagGroups exist, else 2-tier) -->
        ${(() => {
          const renderNavTagItem = (tag) => {
            // A description-only tag is a link to its section: no operations to expand or collapse
            if (tag.descriptionOnly) {
              if (!isNavTagVisible(tag, this.searchVal)) return "";
              return html` <div class="nav-bar-tag-and-paths description-only">
                <a
                  href="#${tag.elementId}"
                  class="nav-bar-tag"
                  part="section-navbar-item section-navbar-tag"
                  id="link-${tag.elementId}"
                  data-action="navigate"
                  data-content-id="${tag.elementId}"
                >
                  <span class="nav-bar-tag-title">${tag.displayName || tag.name}</span>
                </a>
              </div>`;
            }
            const visiblePaths = (tag.paths || []).filter((p) =>
              isNavPathVisible(p, this.searchVal, tag.name),
            );
            if (visiblePaths.length === 0) return "";
            const firstPathId = visiblePaths[0].elementId;

            return html` <div class="nav-bar-tag-and-paths ${tag.expanded ? "expanded" : "collapsed"}">
              <div class="nav-bar-tag" part="section-navbar-item section-navbar-tag">
                <a
                  href="#${tag.elementId}"
                  id="link-${tag.elementId}"
                  class="nav-bar-tag-title"
                  data-action="navigate"
                  data-content-id="${tag.elementId}"
                  data-first-path-id="${firstPathId}"
                  >${tag.displayName || tag.name}</a
                >
                <button
                  type="button"
                  class="nav-bar-tag-icon"
                  aria-label="Expand or collapse ${tag.displayName || tag.name}"
                  aria-expanded="${tag.expanded ? "true" : "false"}"
                  data-action="expand-collapse-tag"
                ></button>
              </div>
              ${
                this.infoDescriptionHeadingsInNavBar === "true"
                  ? html` <div class="tag-headers">
                      ${(() => {
                        const tagSlugger = new Slugger();
                        return tag.headers.map((header) => {
                          const headerElId = tagSlugger.slug(header.text);
                          return html` <a
                            href="#${tag.elementId}--${headerElId}"
                            class="nav-bar-h${header.depth}"
                            part="section-navbar-item section-navbar-h${header.depth}"
                            id="link-${tag.elementId}--${headerElId}"
                            data-action="navigate"
                            data-content-id="${tag.elementId}--${headerElId}"
                          >
                            <span class="nav-bar-path-label">${header.text}</span>
                          </a>`;
                        });
                      })()}
                    </div>`
                  : ""
              }
              <div class="nav-bar-paths-under-tag">
                <!-- Paths in each tag (endpoints) -->
                ${visiblePaths.map((p) => {
                  const isFirst = checkFirstNav();
                  return html` <a
                    href="#${p.elementId}"
                    class="nav-bar-path${isFirst ? " first-nav-item" : ""}${p.deprecated ? " deprecated" : ""}"
                    part="section-navbar-item section-navbar-path"
                    data-action="navigate"
                    data-content-id="${p.elementId}"
                    data-first-nav-item="${isFirst ? "true" : nothing}"
                    id="link-${p.elementId}"
                    data-title="${navItemTitle(this.usePathInNavBar === "true" ? p.path : p.summary || p.shortSummary, p.xBadges)}"
                  >
                    ${html`<span class="nav-method ${this.showMethodInNavBar} ${p.method}">
                      ${this.showMethodInNavBar === "as-colored-block" ? p.method.substring(0, 3).toUpperCase() : p.method.toUpperCase()}
                    </span>`}
                    <span class="nav-bar-path-label">
                      ${p.isWebhook ? html`<span class="nav-bar-webhook">WEBHOOK</span>` : ""}
                      ${this.usePathInNavBar === "true" ? html`<span class="mono-font">${p.path}</span>` : p.summary || p.shortSummary}
                    </span>
                    ${navBadgeDotTemplate(this.showBadgesInNavBar, p.xBadges)}
                  </a>`;
                })}
              </div>
            </div>`;
          };

          if (this.resolvedSpec.tagGroups && this.resolvedSpec.tagGroups.length > 0) {
            const assignedTagNames = new Set();
            this.resolvedSpec.tagGroups.forEach((group) => {
              (group.tags || []).forEach((tag) => {
                assignedTagNames.add(tag.name.toLowerCase());
              });
            });

            const renderedGroups = this.resolvedSpec.tagGroups
              .filter((group) => isNavTagGroupVisible(group, this.searchVal))
              .map((group) => {
                const groupTags = group.tags.filter((tag) => isNavTagVisible(tag, this.searchVal));
                if (groupTags.length === 0) return "";
                return html`
                  <div class="nav-bar-tag-group" id="link-${group.elementId}">
                    <div
                      class="nav-bar-tag-group-header nav-bar-section-label"
                      part="section-navbar-item section-navbar-tag-group section-navbar-label"
                    >
                      <div class="nav-bar-tag-group-title">${group.displayName || group.name}</div>
                    </div>
                    <div class="nav-bar-tags-under-group">${groupTags.map((tag) => renderNavTagItem(tag))}</div>
                  </div>
                `;
              });

            const remainingTags = (this.resolvedSpec.tags || [])
              .filter(
                (tag) =>
                  !assignedTagNames.has(tag.name.toLowerCase()) &&
                  isNavTagVisible(tag, this.searchVal),
              )
              .map((tag) => renderNavTagItem(tag));

            return html`${renderedGroups}${remainingTags}`;
          }

          return (this.resolvedSpec.tags || [])
            .filter((tag) => isNavTagVisible(tag, this.searchVal))
            .map((tag) => renderNavTagItem(tag));
        })()}

        <!-- COMPONENTS -->
        ${
          this.resolvedSpec.components && this.showComponents === "true"
            ? html` <div id="link-components" class="nav-bar-section-label components" part="section-navbar-label">
                  Components
                </div>
                ${this.resolvedSpec.components.map((component) =>
                  component.subComponents.length
                    ? html` <div class="nav-bar-component">
                        <a
                          href="#cmp--${component.name.toLowerCase()}"
                          class="nav-bar-tag"
                          part="section-navbar-item section-navbar-tag"
                          data-action="navigate"
                          data-content-id="cmp--${component.name.toLowerCase()}"
                          id="link-cmp--${component.name.toLowerCase()}"
                        >
                          <span class="nav-bar-tag-title">${component.name}</span>
                        </a>
                        <div class="nav-bar-paths-under-tag">
                          ${component.subComponents
                            .filter((p) => p.expanded !== false)
                            .map(
                              (p) =>
                                html` <a href="#cmp--${p.id}" class="nav-bar-path" data-action="navigate" data-content-id="cmp--${p.id}" id="link-cmp--${p.id}">
                                  <span class="nav-bar-path-label">${p.name}</span>
                                </a>`,
                            )}
                        </div>
                      </div>`
                    : "",
                )}`
            : ""
        }
      </div>
    </nav>
  `;
}
