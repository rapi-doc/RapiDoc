import { html } from 'lit-element';
import { pathIsInSearch, invalidCharsRegEx } from '@/utils/common-utils';
import marked from 'marked';

/* eslint-disable indent */
export default function navbarTemplate() {
  return html`
  <aside class='nav-bar'>
    <div style="padding:16px 30px 0 16px;">
      <slot name="nav-logo" class="logo"></slot>
    </div>
    ${(this.allowSearch === 'false')
      ? ''
      : html`
        <div style="position:sticky; top:0; display:flex; flex-direction:row; align-items: stretch; padding:24px; border-bottom: 1px solid var(--nav-hover-bg-color)">
          <div style="display:flex; flex:1">
            <input id="nav-bar-search" 
              style="width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" 
              type="text" placeholder="search" 
              @change="${this.onSearchChange}"  
              spellcheck="false" 
            >
            <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x2b90;</div>
          </div>  
          ${this.matchPaths
            ? html`
              <div @click = '${this.onClearSearch}' style='margin-left:5px; cursor:pointer; align-self:center; color:var(--nav-text-color)' class='small-font-size primary-text bold-text'> CLEAR </div>`
            : ''
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
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<div class='nav-bar-info' id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEl(e)}' > Overview </div>` : ''}          
              ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                <div class='nav-bar-h${header.depth}' id="link-overview--${new marked.Slugger().slug(header.text)}"  data-content-id='overview--${new marked.Slugger().slug(header.text)}' @click='${(e) => this.scrollToEl(e)}'>
                  ${header.text}
                </div>`)
              }
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div class='nav-bar-info'  id='link-overview' data-content-id='overview' @click = '${(e) => this.scrollToEl(e)}' > Overview </div>`
          }
        `
      }
    
    ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
      ? ''
      : html`<div class='nav-bar-info' id='link-api-servers' data-content-id='api-servers' @click = '${(e) => this.scrollToEl(e)}' > API Servers </div>`
    }
    ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
      ? ''
      : html`<div class='nav-bar-info' id='link-authentication' data-content-id='authentication' @click = '${(e) => this.scrollToEl(e)}' > Authentication </div>`
    }

    <span id='link-paths' class='nav-bar-section'>Operations</span>
    ${this.resolvedSpec.tags.map((tag) => html`
      <!-- Tag -->
      <div class='nav-bar-tag' id="link-tag--${tag.name.replace(invalidCharsRegEx, '-')}" data-content-id='tag--${tag.name.replace(invalidCharsRegEx, '-')}' @click='${(e) => this.scrollToEl(e)}'>
        ${tag.name}
      </div>

      <!-- Path (endpoints) -->
      ${tag.paths.filter((v) => {
        if (this.matchPaths) {
          return pathIsInSearch(this.matchPaths, v);
        }
        return true;
      }).map((p) => html`
      <div 
        class='nav-bar-path 
        ${this.usePathInNavBar === 'true' ? 'small-font' : ''}' 
        data-content-id='${p.method}-${p.path}' 
        id='link-${p.method}-${p.path.replace(invalidCharsRegEx, '-')}' 
        @click = '${(e) => this.scrollToEl(e)}'
      > 
        <span style = "${p.deprecated ? 'filter:opacity(0.5)' : ''}"> 
          ${this.usePathInNavBar === 'true'
            ? html`<span class='mono-font'>${p.method.toUpperCase()} ${p.path}</span>`
            : p.summary
          } 
        </span>
      </div>`)}
    `)}

    <!-- Components -->
    ${(this.showComponents === 'false' || !this.resolvedSpec.components)
    ? ''
    : html`<div id='link-components' class='nav-bar-section' >Components</div>
      ${this.resolvedSpec.components.map((component) => (component.subComponents.length ? html`
        <div class='nav-bar-tag' data-content-id='cmp-${component.name.toLowerCase()}' id='link-cmp-${component.name.toLowerCase()}' @click='${(e) => this.scrollToEl(e)}'>
          ${component.name}
        </div>
        ${component.subComponents.map((p) => html`
        <div class='nav-bar-path' data-content-id='cmp-${p.id}' id='link-cmp-${p.id}' @click='${(e) => this.scrollToEl(e)}'>
          <span> ${p.name} </span>
        </div>`)}
      ` : ''))}
    `}
    </nav>`
    }
  </aside>
`;
}
/* eslint-enable indent */
