import { html } from 'lit';
import { marked } from 'marked';
import { pathIsInSearch } from '~/utils/common-utils';

export function expandCollapseNavBarTag(navLinkEl, action = 'toggle') {
  const tagAndPathEl = navLinkEl?.closest('.nav-bar-tag-and-paths');
  const pathsUnderTagEl = tagAndPathEl?.querySelector('.nav-bar-paths-under-tag');
  if (tagAndPathEl) {
    const isExpanded = tagAndPathEl.classList.contains('expanded');
    if (isExpanded && (action === 'toggle' || action === 'collapse')) {
      pathsUnderTagEl.style.maxHeight = 0;
      tagAndPathEl.classList.replace('expanded', 'collapsed');
    } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
      tagAndPathEl.classList.replace('collapsed', 'expanded');
      pathsUnderTagEl.style.maxHeight = `${pathsUnderTagEl.scrollHeight}px`;
    }
  }
}

export function expandCollapseAll(event, action = 'expand-all') {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }
  const navEl = event.target.closest('.nav-scroll');
  const elList = [...navEl.querySelectorAll('.nav-bar-tag-and-paths')];
  if (action === 'expand-all') {
    elList.forEach((el) => {
      const navBarPathsUnderTagEl = el.querySelector('.nav-bar-paths-under-tag');
      el.classList.replace('collapsed', 'expanded');
      navBarPathsUnderTagEl.style.maxHeight = `${navBarPathsUnderTagEl?.scrollHeight}px`;
    });
  } else {
    elList.forEach((el) => {
      el.classList.replace('expanded', 'collapsed');
      el.querySelector('.nav-bar-paths-under-tag').style.maxHeight = 0;
    });
  }
}

export function navBarClickAndEnterHandler(event) {
  if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
    return;
  }
  const navEl = event.target;
  event.stopPropagation();
  if (navEl.dataset?.action === 'navigate') {
    this.scrollToEventTarget(event, false);
  } else if (navEl.dataset?.action === 'expand-all' || (navEl.dataset?.action === 'collapse-all')) {
    expandCollapseAll(event, navEl.dataset.action);
  } else if (navEl.dataset?.action === 'expand-collapse-tag') {
    expandCollapseNavBarTag(navEl, 'toggle');
  }
}

/* eslint-disable indent */
export default function navbarTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return html`
      <nav class='nav-bar' part='section-navbar'>
        <slot name='nav-logo' class='logo'></slot>
      </nav>
    `;
  }
  return html`
  <nav class='nav-bar ${this.renderStyle}' part='section-navbar'>
    <slot name='nav-logo' class='logo'></slot>
    ${(this.allowSearch === 'false' && this.allowAdvancedSearch === 'false')
      ? ''
      : html`
        <div style='display:flex; flex-direction:row; justify-content:center; align-items:stretch; padding:8px 24px 12px 24px; ${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}' part='section-navbar-search'>
          ${this.allowSearch === 'false'
            ? ''
            : html`
              <div style = 'display:flex; flex:1; line-height:22px;'>
                <input id = 'nav-bar-search' 
                  part = 'textbox textbox-nav-filter'
                  style = 'width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)'
                  type = 'text'
                  placeholder = 'Filter' 
                  @change = '${this.onSearchChange}'
                  spellcheck = 'false'
                >
                <div style='margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;'>&#x21a9;</div>
              </div>  
              ${this.matchPaths
                ? html`
                  <button @click = '${this.onClearSearch}' class='m-btn thin-border' style='margin-left:5px; color:var(--nav-text-color); width:75px; padding:6px 8px;' part='btn btn-outline btn-clear-filter'>
                    CLEAR
                  </button>`
                : ''
              }
            `
          }
          ${this.allowAdvancedSearch === 'false' || this.matchPaths
            ? ''
            : html`
              <button class='m-btn primary' part='btn btn-fill btn-search' style='margin-left:5px; padding:6px 8px; width:75px' @click='${this.onShowSearchModalClicked}'>
                SEARCH
              </button>
            `
          }
        </div>
      `
    }
    ${html`<nav class='nav-scroll' tabindex='-1' part='section-navbar-scroll' @click='${(e) => navBarClickAndEnterHandler.call(this, e)}' @keyup='${(e) => navBarClickAndEnterHandler.call(this, e)}' >
      ${(this.showInfo === 'false' || !this.resolvedSpec.info)
        ? ''
        : html`
          ${(this.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0
                ? html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-content-id='overview' data-action='navigate' tabindex='0' part='section-navbar-item section-navbar-overview'> 
                    ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
                  </div>`
                : ''
              }
              <div class='overview-headers'>
                ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                  <div
                    class='nav-bar-h${header.depth} ${this.navActiveItemMarker}' 
                    id='link-overview--${new marked.Slugger().slug(header.text)}'
                    data-action='navigate' 
                    data-content-id='overview--${new marked.Slugger().slug(header.text)}' 
                  >
                    ${header.text}
                  </div>`)
                }
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-overview' data-action='navigate' data-content-id='overview' tabindex='0'> 
              ${this.resolvedSpec.info?.title?.trim() || 'Overview'}
            </div>`
          }
        `
      }
    
      ${this.allowServerSelection === 'false'
        ? ''
        : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-servers' data-action='navigate' data-content-id='servers' tabindex='0' part='section-navbar-item section-navbar-servers'> API Servers </div>`
      }
      ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
        ? ''
        : html`<div class='nav-bar-info ${this.navActiveItemMarker}' id='link-auth' data-action='navigate' data-content-id='auth' tabindex='0' part='section-navbar-item section-navbar-auth'> Authentication </div>`
      }

      <div id='link-operations-top' class='nav-bar-section operations' data-action='navigate' data-content-id='${this.renderStyle === 'focused' ? '' : 'operations-top'}' part='section-navbar-item section-navbar-operations-top'>
        <div style='font-size:16px; display:flex; margin-left:10px;'>
          ${this.renderStyle === 'focused'
            ? html`
              <div class='nav-bar-expand-all'
                data-action='expand-all'
                tabindex='0' 
                title='Expand all'
              >▸</div>
              <div class='nav-bar-collapse-all'
                data-action='collapse-all'
                tabindex='0' 
                title='Collapse all'
              >▸</div>`
            : ''
          }  
        </div>
        <div class='nav-bar-section-title'> OPERATIONS </div>
      </div>

      <!-- TAGS AND PATHS-->
      ${this.resolvedSpec.tags
        .filter((tag) => tag.paths.filter((path) => pathIsInSearch(this.matchPaths, path, this.matchType)).length)
        .map((tag) => html`
          <div class='nav-bar-tag-and-paths ${(this.renderStyle === 'read' ? 'expanded' : (tag.expanded ? 'expanded' : 'collapsed'))}' >
            ${tag.name === 'General ⦂'
              ? html`<hr style='border:none; border-top: 1px dotted var(--nav-text-color); opacity:0.3; margin:-1px 0 0 0;'/>`
              : html`
                <div 
                  class='nav-bar-tag ${this.navActiveItemMarker}'
                  part='section-navbar-item section-navbar-tag'
                  id='link-${tag.elementId}'
                  data-action='${(this.renderStyle === 'read' ? 'navigate' : this.onNavTagClick === 'show-description') ? 'navigate' : 'expand-collapse-tag'}'
                  data-content-id='${(this.renderStyle === 'read' ? `${tag.elementId}` : this.onNavTagClick === 'show-description') ? `${tag.elementId}` : ''}'
                  data-first-path-id='${tag.firstPathId}'
                  tabindex='0'
                >
                  <div style="pointer-events:none;">${tag.name}</div>
                  <div class='nav-bar-tag-icon' tabindex='0' data-action='expand-collapse-tag'></div>
                </div>
              `
            }
            ${(this.infoDescriptionHeadingsInNavBar === 'true')
              ? html`
                ${this.renderStyle === 'focused' && this.onNavTagClick === 'expand-collapse'
                  ? ''
                  : html`
                    <div class='tag-headers'>
                      ${tag.headers.map((header) => html`
                      <div
                        class='nav-bar-h${header.depth} ${this.navActiveItemMarker}'
                        part='section-navbar-item section-navbar-h${header.depth}'
                        id='link-${tag.elementId}--${new marked.Slugger().slug(header.text)}'
                        data-action='navigate'
                        data-content-id='${tag.elementId}--${new marked.Slugger().slug(header.text)}'
                        tabindex='0'
                      > ${header.text}</div>`)}
                    </div>`
                }`
              : ''
            }
            <div class='nav-bar-paths-under-tag' style='max-height:${(tag.expanded || this.renderStyle === 'read') ? ((tag.paths?.length || 1) * 50) : 0}px;'>
              <!-- Paths in each tag (endpoints) -->
              ${tag.paths.filter((v) => {
                if (this.matchPaths) {
                  return pathIsInSearch(this.matchPaths, v, this.matchType);
                }
                return true;
              }).map((p) => html`
              <div 
                class='nav-bar-path ${this.navActiveItemMarker} ${this.usePathInNavBar === 'true' ? 'small-font' : ''}'
                part='section-navbar-item section-navbar-path'
                data-action='navigate'
                data-content-id='${p.elementId}'
                id='link-${p.elementId}'
                tabindex='0'
              >
                <span style = 'display:flex; pointer-events: none; align-items:start; ${p.deprecated ? 'filter:opacity(0.5)' : ''}'>
                  ${html`<span class='nav-method ${this.showMethodInNavBar} ${p.method}' style='pointer-events: none;'>
                      ${this.showMethodInNavBar === 'as-colored-block' ? p.method.substring(0, 3).toUpperCase() : p.method.toUpperCase()}
                    </span>`
                  }
                  ${p.isWebhook ? html`<span style='font-weight:bold; pointer-events: none; margin-right:8px; font-size: calc(var(--font-size-small) - 2px)'>WEBHOOK</span>` : ''}
                  ${this.usePathInNavBar === 'true'
                    ? html`<span style='pointer-events: none;' class='mono-font'>${p.path}</span>`
                    : p.summary || p.shortSummary
                  }
                </span>
              </div>`)}
            </div>
          </div>
        `)
      }

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components && this.showComponents === 'true' && this.renderStyle === 'focused'
        ? html`
          <div id='link-components' class='nav-bar-section components'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((component) => (component.subComponents.length
            ? html`
              <div class='nav-bar-tag'
                part='section-navbar-item section-navbar-tag'
                data-action='navigate' 
                data-content-id='cmp--${component.name.toLowerCase()}' 
                id='link-cmp--${component.name.toLowerCase()}'
              >
                ${component.name}
              </div>
              ${component.subComponents.filter((p) => p.expanded !== false).map((p) => html`
                <div class='nav-bar-path' data-action='navigate' data-content-id='cmp--${p.id}' id='link-cmp--${p.id}'>
                  <span> ${p.name} </span>
                </div>`)
              }`
            : ''))
          }`
        : ''
      }
    </nav>`
  }
</nav>
`;
}
/* eslint-enable indent */
