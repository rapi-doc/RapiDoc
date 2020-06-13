import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import marked from 'marked';

// Templates
import expandedEndpointTemplate from '@/templates/expanded-endpoint-template';
import focusedEndpointTemplate from '@/templates/focused-endpoint-template';
import endpointTemplate from '@/templates/endpoint-template';
import serverTemplate from '@/templates/server-template';
import securitySchemeTemplate from '@/templates/security-scheme-template';
import componentsTemplate from '@/templates/components-template';
import contactInfoTemplate from '@/templates/contact-info-template';
import headerTemplate from '@/templates/header-template';
import navbarTemplate from '@/templates/navbar-template';

import SetTheme from '@/utils/theme';
import { isValidHexColor } from '@/utils/color-utils';

function infoDescriptionHeadingRenderer() {
  const renderer = new marked.Renderer();
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="overview--${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}

/* eslint-disable indent */

function overviewTemplate() {
  return html`
    <div id = 'overview' class = 'observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : (this.renderStyle === 'focused' ? 'section-gap--read-mode' : 'section-gap')}'>
      <div style = 'font-size:32px'>
        ${this.resolvedSpec.info.title}
        ${!this.resolvedSpec.info.version ? '' : html`
          <span style = 'font-size:var(--font-size-small);font-weight:bold'>
            ${this.resolvedSpec.info.version}
          </span>`
        }
      </div>

      ${this.resolvedSpec.info.description
        ? html`${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description, { renderer: infoDescriptionHeadingRenderer() })}</div>`)}`
        : ''
      }
      ${this.resolvedSpec.info.termsOfService
        ? html`${unsafeHTML(`<div class='tiny-title' style="margin-top:8px"> Terms: </div> <span class='m-markdown regular-font'>${marked(this.resolvedSpec.info.termsOfService)}</span>`)}`
        : ''
      }
      ${this.resolvedSpec.info.contact ? contactInfoTemplate.call(this) : ''}
    </div>
  `;
}

export default function mainBodyTemplate() {
  const newTheme = {
    bg1: isValidHexColor(this.bgColor) ? this.bgColor : '',
    fg1: isValidHexColor(this.textColor) ? this.textColor : '',
    headerColor: isValidHexColor(this.headerColor) ? this.headerColor : '',
    primaryColor: isValidHexColor(this.primaryColor) ? this.primaryColor : '',
    navBgColor: isValidHexColor(this.navBgColor) ? this.navBgColor : '',
    navBgImage: this.navBgImage || '',
    navBgImageSize: this.navBgImageSize,
    navBgImageRepeat: this.navBgImageRepeat,
    navTextColor: isValidHexColor(this.navTextColor) ? this.navTextColor : '',
    navHoverBgColor: isValidHexColor(this.navHoverBgColor) ? this.navHoverBgColor : '',
    navHoverTextColor: isValidHexColor(this.navHoverTextColor) ? this.navHoverTextColor : '',
    navAccentColor: isValidHexColor(this.navAccentColor) ? this.navAccentColor : '',
  };

  return html`
    ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}

    <!-- Header -->
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}
    
    <div class="body">
      <!-- Side Nav -->
      ${((this.renderStyle === 'read' || this.renderStyle === 'focused') && this.resolvedSpec) ? navbarTemplate.call(this) : ''}
      
      <!-- Main Content -->
      <main class="main-content regular-font">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${this.loading === true ? html`<div class="loader"></div>` : ''}
          ${this.loadFailed === true ? html`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>` : ''}
          ${this.resolvedSpec
            ? html`
              ${(this.showInfo === 'false' || !this.resolvedSpec.info)
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'overview' ? overviewTemplate.call(this) : '')
                  : overviewTemplate.call(this)
              }

              ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'api-servers' ? serverTemplate.call(this) : '')
                  : serverTemplate.call(this)
              } 

              ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'authentication' ? securitySchemeTemplate.call(this) : '')
                  : securitySchemeTemplate.call(this)
              }
              <div @click="${(e) => { this.handleHref(e); }}">
                ${this.resolvedSpec.tags
                  ? this.renderStyle === 'read'
                    ? expandedEndpointTemplate.call(this)
                    : this.renderStyle === 'focused'
                      ? focusedEndpointTemplate.call(this)
                      : endpointTemplate.call(this)
                  : ''
                }
              </div>

              ${this.showComponents === 'true' ? componentsTemplate.call(this) : ''}
            `
            : ''
          }
        </div>  
        <slot name="footer"></slot>
      </main>
    </div>  
  `;
}
/* eslint-enable indent */
