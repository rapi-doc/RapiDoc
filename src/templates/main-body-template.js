import { html } from 'lit';

// Templates
import expandedEndpointTemplate from '~/templates/expanded-endpoint-template';
import focusedEndpointTemplate from '~/templates/focused-endpoint-template';
import overviewTemplate from '~/templates/overview-template';
import endpointTemplate from '~/templates/endpoint-template';
import serverTemplate from '~/templates/server-template';
import securitySchemeTemplate, { recoverPersistedApiKeys } from '~/templates/security-scheme-template';
import headerTemplate from '~/templates/header-template';
import navbarTemplate from '~/templates/navbar-template';
import advancedSearchTemplate from '~/templates/advance-search-template';
import SetTheme from '~/utils/theme';
import { isValidHexColor } from '~/utils/color-utils';

export default function mainBodyTemplate(isMini = false, pathsExpanded = false) {
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
    return html`
      ${this.theme === 'dark' ? SetTheme.call(this, 'dark', newTheme) : SetTheme.call(this, 'light', newTheme)}
      <div id="spec-not-found" style='display:flex; align-items:center; justify-content: center; border:1px dashed var(--border-color); height:42px; padding:5px; font-size:var(--font-size-small); color:var(--red); font-family:var(--font-mono)'> 
        ${this.resolvedSpec.info.description} 
      </div>
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
                  <div class='operations-root' @click='${(e) => { this.handleHref(e); }}'>
                  ${this.renderStyle === 'focused'
                    ? html`${focusedEndpointTemplate.call(this)}`
                    : html`
                      ${this.showInfo === 'true' ? overviewTemplate.call(this) : ''}
                      ${this.allowServerSelection === 'true' ? serverTemplate.call(this) : ''}
                      ${this.allowAuthentication === 'true' ? securitySchemeTemplate.call(this, this.allowTry) : ''}
                      <div id='operations-top' class='observe-me'>
                        <slot name='operations-top'></slot>
                      </div>  
                      ${this.renderStyle === 'read'
                        ? expandedEndpointTemplate.call(this)
                        : endpointTemplate.call(this, isMini, pathsExpanded)
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
