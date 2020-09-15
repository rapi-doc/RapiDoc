import { html } from 'lit-html';
import { invalidCharsRegEx } from '@/utils/common-utils';

import '@/components/dialog-box';

/* eslint-disable indent */
export default function searchByPropertiesModalTemplate() {
  const properties = this.matchProperties;
  // eslint-disable-next-line func-names
  document.addEventListener('ondialogboxclose', () => {
    this.hideSearchModal();
  });

  return html`
    <dialog-box id="search-dialog-box" title="Search by parameters" show="${(!!this.isSearchByPropertiesModalShow)}">
      <input id="nav-bar-search-by-params"
        style="width:100%; padding-right:20px; color:var(--nav-bg-color); border-color:var(--nav-accent-color); background-color:white;"
        type="text" placeholder="method name or description" 
        @change="${this.onSearchByPropertiesChange}"  
        spellcheck="false">
      ${!properties ? '' : html`
        <h2 style="margin: 5px 0 10px 0;">Search results:</h2>
        <div class="regular-font regular-font-size">
        ${Object.keys(properties).map((propertyName) => html`
          <div style="margin-bottom: 25px;">
            <div class="row" style="align-items: baseline;">
              <span class="bold-text">${propertyName}&nbsp;-&nbsp;</span>
              <span>${properties[propertyName].description ? properties[propertyName].description : 'No description'}</span>
            </div>
            ${[...properties[propertyName].paths].map((path) => html`
              <div
                style='margin-top: 5px; cursor: pointer;'
                data-content-id='${path.method}-${path.path}'
                id='link-${path.method}-${path.path.replace(invalidCharsRegEx, '-')}'
                @click="${(e) => this.scrollToEl(e)}"> 
                <span style="${path.method.deprecated ? 'filter:opacity(0.5)' : ''}" class="mono-font regular-font-size">
                  <span class="regular-font upper method-fg bold-text post">${path.method}</span> ${path.path}
                </span>
              </div>
            `)}
          </div>
        `)}
        </div>
      `}
    </dialog-box>
  `;
}
/* eslint-enable indent */
