import { html } from 'lit';

// Templates
import expandedEndpointTemplate from '@rapidoc/templates/expanded-endpoint-template';
import focusedEndpointTemplate from '@rapidoc/templates/focused-endpoint-template';
import overviewTemplate from '@rapidoc/templates/overview-template';
import endpointTemplate from '@rapidoc/templates/endpoint-template';
import serverTemplate from '@rapidoc/templates/server-template';
import securitySchemeTemplate, { recoverPersistedApiKeys } from '@rapidoc/templates/security-scheme-template';
import headerTemplate from '@rapidoc/templates/header-template';
import navbarTemplate from '@rapidoc/templates/navbar-template';
import advancedSearchTemplate from './advance-search-template';
import SetTheme from '@rapidoc/utils/theme';
import { isValidHexColor } from '@rapidoc/utils/color-utils';
import { RapidocElement } from '@rapidoc-types';

export default function mainBodyTemplate(this: RapidocElement, isMini = false, showExpandCollapse = true, showTags = true, pathsExpanded = false) {
  if (!this.resolvedSpec) {
    return '';
  }
  if (this.persistAuth === 'true') {
    recoverPersistedApiKeys.call(this);
  }
  const newTheme = {
    bg1: isValidHexColor(this.bgColor) ? this.bgColor : '',
    fg1: isValidHexColor(this.textColor) ? this.textColor : '',
    headerColor: isValidHexColor(this.headerColor) ? this.headerColor : '',
    primaryColor: isValidHexColor(this.primaryColor) ? this.primaryColor : '',
    navBgColor: isValidHexColor(this.navBgColor) ? this.navBgColor : '',
    navTextColor: isValidHexColor(this.navTextColor) ? this.navTextColor : '',
    navHoverBgColor: isValidHexColor(this.navHoverBgColor) ? this.navHoverBgColor : '',
    navHoverTextColor: isValidHexColor(this.navHoverTextColor) ? this.navHoverTextColor : '',
    navAccentColor: isValidHexColor(this.navAccentColor) ? this.navAccentColor : '',
    navAccentTextColor: isValidHexColor(this.navAccentTextColor) ? this.navAccentTextColor : '',
  };
  /* eslint-disable indent */
  if (this.resolvedSpec.specLoadError) {
    if (isMini) {
      return html`
        ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
        <div style='display:flex; align-items:center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)'> ${this.resolvedSpec.info?.description} </div>
      `;
    }
    return html`
      ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
      <!-- Header -->
      ${headerTemplate.call(this)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div style='margin:24px; text-align: center;'>
          <h1 style='color: var(--red)'> ${this.resolvedSpec.info?.title} </h1>
          <div style='font-family:var(--font-mono)'> ${this.resolvedSpec.info?.description} </div>
        </div>
      </main>  
    `;
  }
  if (this.resolvedSpec.isSpecLoading) {
    return html`
      ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
      <main class='main-content regular-font' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          <div class='loader'></div>
        </div>
      </main>
    `;
  }

  return html`
    ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}

    <!-- Header -->
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}
    
    <!-- Advanced Search -->
    ${this.allowAdvancedSearch === 'false' ? '' : advancedSearchTemplate.call(this)}

    <div id='the-main-body' class='body ${this.cssClasses}' dir='${this.pageDirection}' >
      <!-- Side Nav -->
      ${((this.renderStyle === 'read' || this.renderStyle === 'focused')
          && this.showSideNav === 'true'
          && this.resolvedSpec
        ) ? navbarTemplate.call(this) : ''
      }

      <!-- Main Content -->
      <main class='main-content regular-font' tabindex='-1' part='section-main-content'>
        <slot></slot>
        <div class='main-content-inner--${this.renderStyle}-mode'>
          ${this.loading === true
            ? html`<div class='loader'></div>`
            : html`
              ${this.loadFailed === true
                ? html`<div style='text-align: center;margin: 16px;'> Unable to load the Spec</div>`
                : html`
                  <div class='operations-root' @click='${(e: MouseEvent) => { this.handleHref(e); }}'>
                  ${this.renderStyle === 'focused'
                    ? html`${focusedEndpointTemplate.call(this)}`
                    : html`
                      ${this.showInfo === 'true' ? overviewTemplate.call(this) : ''}
                      ${this.allowServerSelection === 'true' ? serverTemplate.call(this) : ''}
                      ${this.allowAuthentication === 'true' ? securitySchemeTemplate.call(this) : ''}
                      <div id='operations-top' class='observe-me'>
                        <slot name='operations-top'></slot>
                      </div>  
                      ${this.renderStyle === 'read'
                        ? expandedEndpointTemplate.call(this)
                        : endpointTemplate.call(this, showExpandCollapse, showTags, pathsExpanded)
                      }
                    `
                  }
                  </div>
                `
              }`
          }
        </div>
        <slot name='footer'></slot>
      </main>
    </div>  
  `;
}
/* eslint-enable indent */
