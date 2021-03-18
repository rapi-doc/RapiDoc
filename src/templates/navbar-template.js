import { html } from 'lit-element';
import marked from 'marked';
import { pathIsInSearch } from '~/utils/common-utils';

export function expandCollapseNavBarTag(navLinkEl, action = 'toggle') {
  const tagAndPathEl = navLinkEl?.closest('.nav-bar-tag-and-paths');
  if (tagAndPathEl) {
    const isExpanded = tagAndPathEl.classList.contains('expanded');
    if (isExpanded && (action === 'toggle' || action === 'collapse')) {
      tagAndPathEl.classList.replace('expanded', 'collapsed');
    } else if (!isExpanded && (action === 'toggle' || action === 'expand')) {
      tagAndPathEl.classList.replace('collapsed', 'expanded');
    }
  }
}

export function expandCollapseAll(navEl, action = 'expand-all') {
  const elList = [...navEl.querySelectorAll('.nav-bar-tag-and-paths')];
  if (action === 'expand-all') {
    elList.map((el) => {
      el.classList.replace('collapsed', 'expanded');
    });
  } else {
    elList.map((el) => {
      el.classList.replace('expanded', 'collapsed');
    });
  }
}

function onExpandCollapse(e) {
  expandCollapseNavBarTag(e.target, 'toggle');
}

function onExpandCollapseAll(e, action = 'expand-all') {
  expandCollapseAll(e.target.closest('.nav-scroll'), action);
}

/* eslint-disable indent */
export default function navbarTemplate() {
  return html`
  <nav class='nav-bar ${this.renderStyle}' >
    <div style="padding:16px 30px 0 16px;">
      <slot name="nav-logo" class="logo"></slot>
    </div>
    ${(this.allowSearch === 'false' && this.allowAdvancedSearch === 'false')
      ? ''
      : html`
        <div style="display:flex; flex-direction:row; justify-content:center; align-items:center; padding:24px; ${this.allowAdvancedSearch === 'false' ? 'border-bottom: 1px solid var(--nav-hover-bg-color)' : ''}">
          ${this.allowSearch === 'false'
            ? ''
            : html`
              <div style="display:flex; flex:1; line-height:22px;">
                <input id="nav-bar-search" 
                  part = "textbox textbox-nav-filter"
                  style = "width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" 
                  type = "text"
                  placeholder = "Filter" 
                  @change = "${this.onSearchChange}"  
                  spellcheck = "false" 
                >
                <div style="margin: 6px 5px 0 -24px; font-size:var(--font-size-regular); cursor:pointer;">&#x21a9;</div>
              </div>  
              ${this.matchPaths
                ? html`
                  <div @click = '${this.onClearSearch}' style='margin-left:5px; cursor:pointer; align-self:center; color:var(--nav-text-color)' class='small-font-size primary-text bold-text'> CLEAR </div>`
                : ''
              }
            `
          }
          ${this.allowAdvancedSearch === 'false' || this.matchPaths
            ? ''
            : html`
              <button class="m-btn primary" part="btn btn-fill btn-search" style="margin-left:5px;" @click="${this.onShowSearchModalClicked}">
                Search
              </button>
            `
          }
        </div>
      `
    }
    ${html`<nav class='nav-scroll'>
      ${(this.showInfo === 'false' || !this.resolvedSpec.info)
        ? ''
        : html`
          ${(this.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEventTarget(e, false)}' > Overview </div>` : ''}
              <div class="overview-headers">
                ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                  <div 
                    class='nav-bar-h${header.depth}' 
                    id="link-overview--${new marked.Slugger().slug(header.text)}"  
                    data-content-id='overview--${new marked.Slugger().slug(header.text)}' 
                    @click='${(e) => this.scrollToEventTarget(e, false)}'
                  >
                    ${header.text}
                  </div>`)
                }
              </div>
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div class='nav-bar-info'  id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEventTarget(e, false)}'> Overview </div>`
          }
        `
      }
    
      ${this.allowServerSelection === 'false'
        ? ''
        : html`<div class='nav-bar-info' id='link-servers' data-content-id='servers' @click = '${(e) => this.scrollToEventTarget(e, false)}'> API Servers </div>`
      }
      ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
        ? ''
        : html`<div class='nav-bar-info' id='link-auth' data-content-id='auth' @click = '${(e) => this.scrollToEventTarget(e, false)}'> Authentication </div>`
      }

      <div id='link-paths' class='nav-bar-section'>
        <div style="font-size:16px; display:flex; margin-left:10px;">
          ${this.renderStyle === 'focused'
            ? html`
              <div @click="${(e) => { onExpandCollapseAll.call(this, e, 'expand-all'); }}" title="Expand all" style="transform: rotate(90deg); cursor:pointer; margin-right:10px;">▸</div>
              <div @click="${(e) => { onExpandCollapseAll.call(this, e, 'collapse-all'); }}" title="Collapse all" style="transform: rotate(270deg); cursor:pointer;">▸</div>`
            : ''
          }  
        </div>
        <div class='nav-bar-section-title'> OPERATIONS </div>
      </div>

      <!-- TAGS AND PATHS-->
      ${this.resolvedSpec.tags
        .filter((tag) => tag.paths.filter((path) => pathIsInSearch(this.matchPaths, path)).length)
        .map((tag) => html`
          <div class='nav-bar-tag-and-paths ${tag.expanded ? 'expanded' : 'collapsed'}'>
            <div 
              class='nav-bar-tag' 
              id="link-${tag.elementId}" 
              data-content-id='${tag.elementId}'
              data-first-path-id='${tag.firstPathId}'
              @click='${(e) => {
                if (this.renderStyle === 'focused' && this.onNavTagClick === 'expand-collapse') {
                  onExpandCollapse.call(this, e);
                } else {
                  this.scrollToEventTarget(e, false);
                }
              }}'
            >
              <div>${tag.name}</div>
              <div class="nav-bar-tag-icon" @click="${(e) => {
                if (this.renderStyle === 'focused' && this.onNavTagClick === 'show-description') {
                  onExpandCollapse.call(this, e);
                }
              }}">
              </div>
            </div>

            ${(this.infoDescriptionHeadingsInNavBar === 'true')
              ? html`
                ${this.renderStyle === 'focused' && this.onNavTagClick === 'expand-collapse'
                  ? ''
                  : html`
                    <div class='tag-headers'>
                      ${tag.headers.map((header) => html`
                      <div 
                        class='nav-bar-h${header.depth}' 
                        id="link-${tag.elementId}--${new marked.Slugger().slug(header.text)}"  
                        data-content-id='${tag.elementId}--${new marked.Slugger().slug(header.text)}' 
                        @click='${(e) => this.scrollToEventTarget(e, false)}'
                      > ${header.text}</div>`)}
                    </div>`
                }`
              : ''
            }

            
            <div class='nav-bar-paths-under-tag'>
              <!-- Paths in each tag (endpoints) -->
              ${tag.paths.filter((v) => {
                if (this.matchPaths) {
                  return pathIsInSearch(this.matchPaths, v);
                }
                return true;
              }).map((p) => html`
              <div 
                class='nav-bar-path
                ${this.usePathInNavBar === 'true' ? 'small-font' : ''}'
                data-content-id='${p.elementId}'
                id='link-${p.elementId}'
                @click = '${(e) => {
                  this.scrollToEventTarget(e, false);
                }}'
              >
                <span style = "${p.deprecated ? 'filter:opacity(0.5)' : ''}">
                  ${this.usePathInNavBar === 'true'
                    ? html`<span class='mono-font'>${p.method.toUpperCase()} ${p.path}</span>`
                    : p.summary || p.shortSummary
                  }
                  ${p.isWebhook ? '(Webhook)' : ''}
                </span>
              </div>`)}
            </div>
          </div>
        `)
      }

      <!-- COMPONENTS -->
      ${this.resolvedSpec.components && this.showComponents === 'true'
        ? html`
          <div id='link-components' class='nav-bar-section'>
            <div></div>
            <div class='nav-bar-section-title'>COMPONENTS</div>
          </div>
          ${this.resolvedSpec.components.map((component) => (component.subComponents.length
            ? html`
              <div class='nav-bar-tag' 
                data-content-id='cmp--${component.name.toLowerCase()}' 
                id='link-cmp--${component.name.toLowerCase()}' 
                @click='${(e) => this.scrollToEventTarget(e, false)}'>
                ${component.name}
              </div>
              ${component.subComponents.map((p) => html`
                <div class='nav-bar-path' data-content-id='cmp--${p.id}' id='link-cmp--${p.id}' @click='${(e) => this.scrollToEventTarget(e, false)}'>
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
