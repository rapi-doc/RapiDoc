/**
 * Renders the modal search dialog for full-text search across paths, operation summaries, descriptions, and tags.
 */
import { html } from 'lit';
export default function advancedSearchDialogTemplate() {
  return html`<dialog id="advanced-search-dialog" class="dialog-box">
    <header class="dialog-box-header">
      <span class="dialog-box-title">Search</span>
      <button type="button" @click="${(e) => this.onAdvancedSearchClose(e)}">&times;</button>
    </header>
    <div class="dialog-box-content">
      <div class="advanced-search-options">
        <input
          id="input-advanced-search-dialog"
          style="width:100%; padding-right:20px;"
          type="text"
          part="textbox textbox-search-dialog"
          placeholder="search text..."
          spellcheck="false"
          @keyup="${(e) => this.onAdvancedSearch(e, 400)}"
        />
        <div class="search-options-row">
          <label class="search-option-label" for="search-api-path">
            <input
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-path"
              checked
              @change="${(e) => this.onAdvancedSearch(e, 0)}"
            />
            API Path
          </label>
          <label class="search-option-label" for="search-api-descr">
            <input
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-descr"
              checked
              @change="${(e) => this.onAdvancedSearch(e, 0)}"
            />
            API Description
          </label>
          <label class="search-option-label" for="search-api-params">
            <input
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-params"
              @change="${(e) => this.onAdvancedSearch(e, 0)}"
            />
            API Parameters
          </label>
          <label class="search-option-label" for="search-api-request-body">
            <input
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-request-body"
              @change="${(e) => this.onAdvancedSearch(e, 0)}"
            />
            Request Body Parameters
          </label>
          <label class="search-option-label" for="search-api-resp-descr">
            <input
              type="checkbox"
              part="checkbox checkbox-search-dialog"
              id="search-api-resp-descr"
              @change="${(e) => this.onAdvancedSearch(e, 0)}"
            />
            Response Description
          </label>
        </div>
      </div>
      ${this.advancedSearchMatches?.map(
        (path) => html`
          <div
            class="mono-font small-font-size hover-bg search-match-row"
            style="${path.deprecated ? 'filter:opacity(0.5);' : ''}"
            data-content-id="${path.elementId}"
            tabindex="0"
            @click="${(e) => {
              this.searchVal = ''; // clear quick filter if applied
              this.shadowRoot.getElementById('advanced-search-dialog').close();
              this.requestUpdate();
              this.scrollToEventTarget(e, true);
            }}"
          >
            <span class="upper bold-text method-fg ${path.method}">${path.method}</span>
            <span>${path.path}</span>
            <span class="regular-font gray-text">${path.summary}</span>
          </div>
        `
      )}
    </div>
  </dialog>`;
}
