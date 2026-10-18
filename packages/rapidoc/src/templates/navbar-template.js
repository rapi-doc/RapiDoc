/**
 * Renders the sidebar navigation panel with search filter, tag groupings, method badges, and link routing.
 */
import { html } from 'lit';
import Slugger from 'github-slugger';
import { getMatchedPaths } from '~/utils/common-utils';

export function expandCollapseNavBarTag(navLinkEl, action = 'toggle') {
  const tagAndPathEl = navLinkEl?.closest('.nav-bar-tag-and-paths');
  const pathsUnderTagEl = tagAndPathEl?.querySelector('.nav-bar-paths-under-tag');
  if (tagAndPathEl) {
    const isExpanded = tagAndPathEl.classList.contains('expanded');
    if (isExpanded && (action === 'toggle' || action === 'collapse')) {
      if (pathsUnderTagEl) pathsUnderTagEl.style.maxHeight = 0;
      tagAndPathEl.classList.replace('expanded', 'collapsed');
      tagAndPathEl.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'false');
    } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
      tagAndPathEl.classList.replace('collapsed', 'expanded');
      if (pathsUnderTagEl) pathsUnderTagEl.style.maxHeight = pathsUnderTagEl.scrollHeight ? `${pathsUnderTagEl.scrollHeight}px` : null;
      tagAndPathEl.querySelector('.nav-bar-tag')?.setAttribute('aria-expanded', 'true');
    }
  }
}

export function expandCollapseNavBarTagGroup(navLinkEl, action = 'toggle') {
  const tagGroupEl = navLinkEl?.closest('.nav-bar-tag-group');
  if (tagGroupEl) {
    const isExpanded = tagGroupEl.classList.contains('expanded');
    if (isExpanded && (action === 'toggle' || action === 'collapse')) {
      tagGroupEl.classList.replace('expanded', 'collapsed');
      tagGroupEl.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'false');
    } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
      tagGroupEl.classList.replace('collapsed', 'expanded');
      tagGroupEl.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
    }
  }
}

export function expandParentNavContainers(navLinkEl) {
  if (!navLinkEl) return;
  expandCollapseNavBarTagGroup(navLinkEl, 'expand');
  expandCollapseNavBarTag(navLinkEl, 'expand');
}

export function expandCollapseAll(event, action = 'expand-all') {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }
  const navEl = event.target.closest('.nav-scroll');
  const groupList = [...navEl.querySelectorAll('.nav-bar-tag-group')];
  if (action === 'expand-all') {
    groupList.forEach((el) => {
      el.classList.replace('collapsed', 'expanded');
      el.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'true');
    });
  } else {
    groupList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
      el.querySelector('.nav-bar-tag-group-header')?.setAttribute('aria-expanded', 'false');
    });
  }
  const elList = [...navEl.querySelectorAll('.nav-bar-tag-and-paths')];
  if (action === 'expand-all') {
    elList.forEach((el) => {
      const navBarPathsUnderTagEl = el.querySelector('.nav-bar-paths-under-tag');
      el.classList.replace('collapsed', 'expanded');
      if (navBarPathsUnderTagEl) {
        navBarPathsUnderTagEl.style.maxHeight = `${navBarPathsUnderTagEl?.scrollHeight}px`;
      }
    });
  } else {
    elList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
      // el.querySelector('.nav-bar-paths-under-tag').style.maxHeight = 0;
    });
  }
}

export function navBarClickAndEnterHandler(event) {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }
  const navEl = event.target.closest('[data-action]') || event.target;
  // Ignore clicks or enter inside the search / filter controls or logo slot
  if (
    navEl.closest('#nav-bar-search') ||
    navEl.closest('#advanced-search-btn') ||
    navEl.closest('[part~="btn-clear-filter"]') ||
    navEl.closest('slot[name="nav-logo"]')
  ) {
    return;
  }
  event.stopPropagation();
  if (navEl.dataset?.action === 'navigate') {
    this.scrollToEventTarget(event, false);
    const navBarEl = event.currentTarget.closest('#nav-bar');
    // hide the navigation bar incase of floating navigation
    if (navBarEl.classList.contains('floating-nav')) {
      navBarEl.classList.remove('floating-nav');
    }
  } else if (navEl.dataset?.action === 'expand-all' || navEl.dataset?.action === 'collapse-all') {
    expandCollapseAll(event, navEl.dataset.action);
  } else if (navEl.dataset?.action === 'expand-collapse-tag-group') {
    expandCollapseNavBarTagGroup(navEl, 'toggle');
  } else if (navEl.dataset?.action === 'expand-collapse-tag') {
    expandCollapseNavBarTag(navEl, 'toggle');
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
    <button id="nav-bar-btn" part="btn-navbar" class="btn" @click="${this.onOpenNavBarToggle}">☰</button>
    <nav id="nav-bar" class="nav-bar ${this.renderStyle} overflow-${this.navItemOverflow || 'ellipsis'}" part="section-navbar">
      <div
        class="nav-scroll"
        tabindex="-1"
        part="section-navbar-scroll"
        @click="${(e) => navBarClickAndEnterHandler.call(this, e)}"
        @keyup="${(e) => navBarClickAndEnterHandler.call(this, e)}"
      >
        <div class="nav-bar-header" part="section-navbar-header">
          <slot name="nav-logo" class="logo" part="section-navbar-logo"></slot>
          ${
            this.allowSearch === 'false' && this.allowAdvancedSearch === 'false'
              ? ''
              : html`
                  <div
                    class="nav-bar-search-container ${this.allowAdvancedSearch === 'false' ? 'has-bottom-border' : ''}"
                    part="section-navbar-search"
                  >
                    ${
                      this.allowSearch === 'false'
                        ? ''
                        : html`
                            <div class="nav-bar-search-input-wrapper">
                              <input
                                id="nav-bar-search"
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
                                    class="m-btn thin-border btn-clear-filter"
                                    part="btn btn-outline btn-clear-filter"
                                  >
                                    CLEAR
                                  </button>`
                                : ''
                            }
                          `
                    }
                    ${
                      this.allowAdvancedSearch === 'false' || this.searchVal
                        ? ''
                        : html`
                            <button
                              id="advanced-search-btn"
                              class="m-btn primary"
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
        ${
          this.showInfo === 'false' || !this.resolvedSpec.info
            ? ''
            : html`
                ${
                  this.infoDescriptionHeadingsInNavBar === 'true'
                    ? html`
                        ${
                          this.resolvedSpec.infoDescriptionHeaders.length > 0
                            ? (() => {
                                const isFirst = checkFirstNav();
                                return html`<div
                                  class="nav-bar-info${isFirst ? ' first-nav-item' : ''}"
                                  id="link-overview"
                                  data-content-id="overview"
                                  data-action="navigate"
                                  data-first-nav-item="${isFirst ? 'true' : undefined}"
                                  tabindex="0"
                                  part="section-navbar-item section-navbar-overview"
                                >
                                  ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
                                </div>`;
                              })()
                            : ''
                        }
                        <div class="overview-headers">
                          ${this.resolvedSpec.infoDescriptionHeaders.map((header) => {
                            const headerElId = slugger.slug(header.text);
                            return html`<div
                              class="nav-bar-h${header.depth}"
                              id="link-overview--${headerElId}"
                              data-action="navigate"
                              data-content-id="overview--${headerElId}"
                            >
                              ${header.text}
                            </div>`;
                          })}
                        </div>
                        ${
                          this.resolvedSpec.infoDescriptionHeaders.length > 0
                            ? html`<hr style="border-top: 1px solid var(--muted); border-width:1px 0 0 0; margin: 15px 0 0 0" />`
                            : ''
                        }
                      `
                    : (() => {
                        const isFirst = checkFirstNav();
                        return html`<div
                          class="nav-bar-info${isFirst ? ' first-nav-item' : ''}"
                          id="link-overview"
                          data-action="navigate"
                          data-content-id="overview"
                          data-first-nav-item="${isFirst ? 'true' : undefined}"
                          tabindex="0"
                        >
                          ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
                        </div>`;
                      })()
                }
              `
        }
        ${
          this.allowServerSelection === 'false'
            ? ''
            : (() => {
                const isFirst = checkFirstNav();
                return html`<div
                  class="nav-bar-info${isFirst ? ' first-nav-item' : ''}"
                  id="link-servers"
                  data-action="navigate"
                  data-content-id="servers"
                  data-first-nav-item="${isFirst ? 'true' : undefined}"
                  tabindex="0"
                  part="section-navbar-item section-navbar-servers"
                >
                  API Servers
                </div>`;
              })()
        }
        ${
          this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes
            ? ''
            : (() => {
                const isFirst = checkFirstNav();
                return html`<div
                  class="nav-bar-info${isFirst ? ' first-nav-item' : ''}"
                  id="link-auth"
                  data-action="navigate"
                  data-content-id="auth"
                  data-first-nav-item="${isFirst ? 'true' : undefined}"
                  tabindex="0"
                  part="section-navbar-item section-navbar-auth"
                >
                  Authentication
                </div>`;
              })()
        }

        <div
          id="link-operations-top"
          class="nav-bar-section operations"
          data-action="navigate"
          data-content-id="${this.renderStyle === 'focused' ? '' : 'operations-top'}"
          part="section-navbar-item section-navbar-operations-top"
        >
          <div style="font-size:16px; display:flex; margin-left:10px;">
            ${
              this.renderStyle === 'focused'
                ? html`<div class="nav-bar-expand-all" data-action="expand-all" tabindex="0" title="Expand all">▸</div>
                    <div class="nav-bar-collapse-all" data-action="collapse-all" tabindex="0" title="Collapse all">▸</div>`
                : ''
            }
          </div>
          <div class="nav-bar-section-title">OPERATIONS</div>
        </div>

        <!-- TAGS AND PATHS (3-tier if tagGroups exist, else 2-tier) -->
        ${(() => {
          const renderNavTagItem = (tag) =>
            html` <div class="nav-bar-tag-and-paths ${tag.expanded ? 'expanded' : 'collapsed'}">
              <div
                class="nav-bar-tag"
                part="section-navbar-item section-navbar-tag"
                id="link-${tag.elementId}"
                data-action="expand-collapse-tag"
                data-first-path-id="${tag.firstPathId}"
                tabindex="0"
                role="button"
                aria-expanded="${tag.expanded ? 'true' : 'false'}"
              >
                <div class="nav-bar-tag-title">${tag.displayName || tag.name}</div>
                <div class="nav-bar-tag-icon" tabindex="0" data-action="expand-collapse-tag"></div>
              </div>
              ${
                this.infoDescriptionHeadingsInNavBar === 'true'
                  ? html` <div class="tag-headers">
                      ${(() => {
                        const tagSlugger = new Slugger();
                        return tag.headers.map((header) => {
                          const headerElId = tagSlugger.slug(header.text);
                          return html` <div
                            class="nav-bar-h${header.depth}"
                            part="section-navbar-item section-navbar-h${header.depth}"
                            id="link-${tag.elementId}--${headerElId}"
                            data-action="navigate"
                            data-content-id="${tag.elementId}--${headerElId}"
                            tabindex="0"
                          >
                            ${header.text}
                          </div>`;
                        });
                      })()}
                    </div>`
                  : ''
              }
              <div class="nav-bar-paths-under-tag">
                <!-- Paths in each tag (endpoints) -->
                ${tag.paths
                  .filter((v) => {
                    if (this.searchVal) {
                      return getMatchedPaths(this.searchVal, v, tag.name);
                    }
                    return true;
                  })
                  .map((p) => {
                    const isFirst = checkFirstNav();
                    return html` <div
                      class="nav-bar-path${isFirst ? ' first-nav-item' : ''}"
                      style="${p.deprecated ? 'filter:opacity(0.5);' : ''}"
                      part="section-navbar-item section-navbar-path"
                      data-action="navigate"
                      data-content-id="${p.elementId}"
                      data-first-nav-item="${isFirst ? 'true' : undefined}"
                      id="link-${p.elementId}"
                      tabindex="0"
                    >
                      <span class="nav-bar-path-label">
                        ${p.isWebhook ? html`<span class="nav-bar-webhook">WEBHOOK</span>` : ''}
                        ${this.usePathInNavBar === 'true' ? html`<span class="mono-font">${p.path}</span>` : p.summary || p.shortSummary}
                      </span>
                      ${html`<span class="nav-method ${this.showMethodInNavBar} ${p.method}">
                        ${this.showMethodInNavBar === 'as-colored-block' ? p.method.substring(0, 3).toUpperCase() : p.method.toUpperCase()}
                      </span>`}
                    </div>`;
                  })}
              </div>
            </div>`;

          if (this.resolvedSpec.tagGroups && this.resolvedSpec.tagGroups.length > 0) {
            return this.resolvedSpec.tagGroups.map((group) => {
              const groupTags = group.tags.filter(
                (tag) => tag.paths.filter((path) => getMatchedPaths(this.searchVal, path, tag.name)).length
              );
              if (groupTags.length === 0) return '';
              return html`
                <div class="nav-bar-tag-group ${group.expanded ? 'expanded' : 'collapsed'}" id="link-${group.elementId}">
                  <div
                    class="nav-bar-tag-group-header"
                    part="section-navbar-item section-navbar-tag-group"
                    data-action="expand-collapse-tag-group"
                    tabindex="0"
                    role="button"
                    aria-expanded="${group.expanded ? 'true' : 'false'}"
                  >
                    <div class="nav-bar-tag-group-title">${group.displayName || group.name}</div>
                    <div class="nav-bar-tag-group-icon" tabindex="0" data-action="expand-collapse-tag-group"></div>
                  </div>
                  <div class="nav-bar-tags-under-group">${groupTags.map((tag) => renderNavTagItem(tag))}</div>
                </div>
              `;
            });
          }

          return this.resolvedSpec.tags
            .filter((tag) => tag.paths.filter((path) => getMatchedPaths(this.searchVal, path, tag.name)).length)
            .map((tag) => renderNavTagItem(tag));
        })()}

        <!-- COMPONENTS -->
        ${
          this.resolvedSpec.components && this.showComponents === 'true'
            ? html` <div id="link-components" class="nav-bar-section components">
                  <div></div>
                  <div class="nav-bar-section-title">COMPONENTS</div>
                </div>
                ${this.resolvedSpec.components.map((component) =>
                  component.subComponents.length
                    ? html` <div
                          class="nav-bar-tag"
                          part="section-navbar-item section-navbar-tag"
                          data-action="navigate"
                          data-content-id="cmp--${component.name.toLowerCase()}"
                          id="link-cmp--${component.name.toLowerCase()}"
                        >
                          ${component.name}
                        </div>
                        ${component.subComponents
                          .filter((p) => p.expanded !== false)
                          .map(
                            (p) =>
                              html` <div class="nav-bar-path" data-action="navigate" data-content-id="cmp--${p.id}" id="link-cmp--${p.id}">
                                <span style="pointer-events: none;"> ${p.name} </span>
                              </div>`
                          )}`
                    : ''
                )}`
            : ''
        }
      </div>
    </nav>
  `;
}
