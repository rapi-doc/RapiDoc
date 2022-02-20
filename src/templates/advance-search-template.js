import { html } from 'lit';
import '~/components/dialog-box';

/* eslint-disable indent */
export default function searchByPropertiesModalTemplate() {
  document.addEventListener('close', () => { this.showAdvancedSearchDialog = false; });
  document.addEventListener('open', this.onOpenSearchDialog);

  return html`
    <dialog-box 
      heading="Search" 
      show="${(!!this.showAdvancedSearchDialog)}"
    >
      <span class="advanced-search-options">
        <input
          style="width:100%; padding-right:20px;"
          type="text"
          part="textbox textbox-search-dialog"
          placeholder="search text..."
          spellcheck="false"
          @keyup = "${(e) => this.onAdvancedSearch(e, 400)}"
        >
        <div style="display:flex; margin:8px 0 24px;">
          <div>
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-path" checked @change = "${(e) => this.onAdvancedSearch(e, 0)}">
            <label for="search-api-path" style="cursor:pointer;"> API Path </label>
            </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-descr" checked @change = "${(e) => this.onAdvancedSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-descr"> API Description </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-params" @change = "${(e) => this.onAdvancedSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-params"> API Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-request-body" @change = "${(e) => this.onAdvancedSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-request-body"> Request Body Parameters </label>
          </div>
          <div style="margin-left: 16px;">
            <input style="cursor:pointer;" type="checkbox" part="checkbox checkbox-search-dialog" id="search-api-resp-descr" @change = "${(e) => this.onAdvancedSearch(e, 0)}">
            <label style="cursor:pointer;" for="search-api-resp-descr"> Response Description </label>
          </div>
        </div>
      </span>
      
      ${this.advancedSearchMatches?.map((path) => html`
      <div
        class="mono-font small-font-size hover-bg"
        style='padding: 5px; cursor: pointer; border-bottom: 1px solid var(--light-border-color); ${path.deprecated ? 'filter:opacity(0.5);' : ''}' 
        data-content-id='${path.elementId}'
        tabindex = '0'
        @click="${
          (e) => {
            this.matchPaths = ''; // clear quick filter if applied
            this.showAdvancedSearchDialog = false; // Hide Search Dialog
            this.requestUpdate();
            this.scrollToEventTarget(e, true);
          }
        }"
      > 
        <span class="upper bold-text method-fg ${path.method}">${path.method}</span> 
        <span>${path.path}</span>
        <span class="regular-font gray-text">${path.summary}</span>
      </div>
    `)
    }
    </dialog-box>
  `;
}
/* eslint-enable indent */
