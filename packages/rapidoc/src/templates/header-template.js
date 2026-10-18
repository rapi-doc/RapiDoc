/**
 * Renders the top navigation header with logo, title, search trigger, server selector, theme switcher, and auth controls.
 */
import { html } from 'lit';
import logoTemplate from '~/templates/logo-template';

export default function headerTemplate() {
  return html`<header class="row main-header regular-font" part="section-header">
    <div class="only-large-screen-flex" style="align-items: center;">
      <slot name="logo" class="logo" part="section-logo">
        ${logoTemplate('height:36px;width:36px;margin-left:5px')}
        <!-- m-logo style="height:36px;width:36px;margin-left:5px"></m-logo -->
      </slot>
      <div class="header-title" part="label-header-title">${this.headingText}</div>
    </div>
    <div class="main-header-controls">
      ${
        this.allowSpecUrlLoad === 'false'
          ? ''
          : html`
              <input
                id="spec-url"
                type="text"
                style="font-size:var(--font-size-small)"
                class="header-input mono-font"
                part="textbox textbox-spec-url"
                placeholder="Spec URL"
                value="${this.specUrl || ''}"
                @change="${this.onSpecUrlChange}"
                spellcheck="false"
              />
              <div class="header-action-icon" @click="${this.onSpecUrlChange}">&#x21a9;</div>
            `
      }
      ${
        this.allowSpecFileLoad === 'false'
          ? ''
          : html`
              <input
                id="spec-file"
                part="file-input"
                type="file"
                style="display:none"
                value="${this.specFile || ''}"
                @change="${this.onSpecFileChange}"
                spellcheck="false"
              />
              <button
                class="m-btn primary only-large-screen"
                style="margin-left:10px;"
                part="btn btn-fill"
                @click="${this.onFileLoadClick}"
              >
                LOCAL JSON FILE
              </button>
            `
      }
      <slot name="header"></slot>
      ${
        this.allowSearch === 'false' || 'read focused'.includes(this.renderStyle)
          ? ''
          : html`
              <input
                id="search"
                class="header-input"
                type="text"
                part="textbox textbox-header-filter"
                placeholder="Filter"
                @change="${this.onSearchChange}"
                style="max-width:130px;margin-left:10px;"
                spellcheck="false"
              />
              <div class="header-action-icon" @click="${this.onSearchChange}">&#x21a9;</div>
            `
      }
      ${
        this.allowAdvancedSearch === 'false' || 'read focused'.includes(this.renderStyle)
          ? ''
          : html`
              <button
                class="m-btn primary only-large-screen"
                part="btn btn-fill btn-search"
                style="margin-left:10px;"
                @click="${this.onShowAdvancedSearchClicked}"
              >
                Search
              </button>
            `
      }
    </div>
  </header>`;
}
