import { html } from 'lit-element';
import { pathIsInSearch, invalidCharsRegEx } from '@/utils/common-utils';
import marked from 'marked';

/* eslint-disable indent */
export default function navbarTemplate(data) {
  return html`
  <div class='nav-bar'>
    <div style="padding:16px 30px 0 16px;">
      <slot name="nav-logo" class="logo"></slot>
    </div>
    ${(data.allowSearch === 'false')
      ? ''
      : html`
        <div style="position:sticky; top:0; display:flex; flex-direction:row; align-items: stretch; padding:24px; background: var(--nav-bg-color); border-bottom: 1px solid var(--nav-hover-bg-color)">
          <div style="display:flex; flex:1">
            <input id="nav-bar-search" 
              style="width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" 
              type="text" placeholder="search" 
              @change="${data.onSearchChange}"  
              spellcheck="false" 
            >
            <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x2b90;</div>
          </div>  
          ${data.matchPaths
            ? html`
              <div style='margin-left:5px; cursor:pointer; align-self:center; color:var(--nav-text-color)' class='small-font-size primary-text bold-text' @click = '${data.onClearSearch}'> CLEAR </div>`
            : ''
          }
        </div>
      `
    }
    ${html`<div class='nav-scroll'>
      ${(data.showInfo === 'false' || !data.resolvedSpec.info)
        ? ''
        : html`
          ${(data.infoDescriptionHeadingsInNavBar === 'true')
            ? html`
              ${data.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<div id='link-overview' class='nav-bar-info'  @click = '${(e) => data.scrollToEl(e)}' > Overview </div>` : ''}          
              ${data.resolvedSpec.infoDescriptionHeaders.map((header) => html`
                <div class='nav-bar-h${header.depth}' id="link-${new marked.Slugger().slug(header.text)}" @click='${(e) => data.scrollToEl(e)}'>
                  ${header.text}
                </div>`)
              }
              ${data.resolvedSpec.infoDescriptionHeaders.length > 0 ? html`<hr style='border-top: 1px solid var(--nav-hover-bg-color); border-width:1px 0 0 0; margin: 15px 0 0 0'/>` : ''}
            `
            : html`<div id='link-overview' class='nav-bar-info'  @click = '${(e) => data.scrollToEl(e)}' > Overview </div>`
          }
        `
      }
    
    ${(data.allowTry === 'false' || data.allowServerSelection === 'false')
      ? ''
      : html`<div id='link-api-servers' class='nav-bar-info' @click = '${(e) => data.scrollToEl(e)}' > API Servers </div>`
    }
    ${(data.allowAuthentication === 'false' || !data.resolvedSpec.securitySchemes)
      ? ''
      : html`<div id='link-authentication'  class='nav-bar-info' @click = '${(e) => data.scrollToEl(e)}' > Authentication </div>`
    }

    <span id='link-paths' class='nav-bar-section'>Operations</span>
    ${data.resolvedSpec.tags.map((tag) => html`
    
      <div class='nav-bar-tag' id="link-${tag.name.replace(invalidCharsRegEx, '-')}" @click='${(e) => data.scrollToEl(e)}'>
        ${tag.name}
      </div>
      ${tag.paths.filter((v) => {
        if (data.matchPaths) {
          return pathIsInSearch(data.matchPaths, v);
        }
        return true;
      }).map((p) => html`
      <div class='nav-bar-path' id='link-${p.method}-${p.path.replace(invalidCharsRegEx, '-')}' @click='${(e) => data.scrollToEl(e)}'> 
        <span> ${p.summary || p.path} </span>
      </div>`)}
    `)}

    ${(data.showComponents === 'false' || !data.resolvedSpec.components)
    ? ''
    : html`<div id='link-components' class='nav-bar-section' >Components</div>
      ${data.resolvedSpec.components.map((component) => html`
        <div class='nav-bar-tag' id="link-cmp-${component.name.toLowerCase()}" @click='${(e) => data.scrollToEl(e)}'>
          ${component.name}
        </div>
        ${component.subComponents.map((p) => html`
        <div class='nav-bar-path' id='link-cmp-${p.id}' @click='${(e) => data.scrollToEl(e)}'> 
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
