import { html } from 'lit-element';
import { pathIsInSearch, invalidCharsRegEx } from '@/utils/common-utils';
import marked from 'marked';

/* eslint-disable indent */
export default function navbarTemplate() {
  return html`
  <div class='nav-bar'>
    <div style="padding:16px 30px 0 16px;">
      <slot name="nav-logo" class="logo"></slot>
    </div>
    ${(this.allowSearch === 'false')
      ? ''
      : html`
        <div style="position:sticky; top:0; display:flex; flex-direction:row; align-items: stretch; padding:24px; background: var(--nav-bg-color); border-bottom: 1px solid var(--nav-hover-bg-color)">
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
              <div style='margin-left:5px; cursor:pointer; align-self:center; color:var(--nav-text-color)' class='small-font-size primary-text bold-text' @click = '${this.onClearSearch}'> CLEAR </div>`
            : ''
          }
        </div>
      `
    }
    ${html`<div class='nav-scroll'>
      ${(this.showInfo === 'false' || !this.resolvedSpec.info)
        ? ''
        : html`
          ${(this.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<div id='link-overview' class='nav-bar-info'  @click = '${(e) => this.scrollToEl(e)}' > Overview </div>` : ''}          
              ${this.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                <div class='nav-bar-h${header.depth}' id="link-${new marked.Slugger().slug(header.text)}" @click='${(e) => this.scrollToEl(e)}'>
                  ${header.text}
                </div>`)
              }
              ${this.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div id='link-overview' class='nav-bar-info'  @click = '${(e) => this.scrollToEl(e)}' > Overview </div>`
          }
        `
      }
    
    ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
      ? ''
      : html`<div id='link-api-servers' class='nav-bar-info' @click = '${(e) => this.scrollToEl(e)}' > API Servers </div>`
    }
    ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
      ? ''
      : html`<div id='link-authentication'  class='nav-bar-info' @click = '${(e) => this.scrollToEl(e)}' > Authentication </div>`
    }

    <span id='link-paths' class='nav-bar-section'>Operations</span>
    ${this.resolvedSpec.tags.map((tag) => html`
    
      <div class='nav-bar-tag' id="link-${tag.name.replace(invalidCharsRegEx, '-')}" @click='${(e) => this.scrollToEl(e)}'>
        ${tag.name}
      </div>
      ${tag.paths.filter((v) => {
        if (this.matchPaths) {
          return pathIsInSearch(this.matchPaths, v);
        }
        return true;
      }).map((p) => html`
      <div class='nav-bar-path' id='link-${p.method}-${p.path.replace(invalidCharsRegEx, '-')}' @click='${(e) => this.scrollToEl(e)}'> 
        <span> ${p.summary || p.path} </span>
      </div>`)}
    `)}

    ${(this.showComponents === 'false' || !this.resolvedSpec.components)
    ? ''
    : html`<div id='link-components' class='nav-bar-section' >Components</div>
      ${this.resolvedSpec.components.map((component) => html`
        <div class='nav-bar-tag' id="link-cmp-${component.name.toLowerCase()}" @click='${(e) => this.scrollToEl(e)}'>
          ${component.name}
        </div>
        ${component.subComponents.map((p) => html`
        <div class='nav-bar-path' id='link-cmp-${p.id}' @click='${(e) => this.scrollToEl(e)}'> 
          <span> ${p.name} </span>
        </div>`)}
      `)}
    `}
    
    </div>`
    }
  </div>
`;
}
/* eslint-enable indent */
