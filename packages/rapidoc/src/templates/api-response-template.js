/**
 * Renders the interactive API response panel (status, headers, body, blob actions),
 * live cURL preview/copy, and the execute/Try action controls for <api-request>.
 */
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { copyToClipboard, downloadResource, viewResource } from '~/utils/common-utils';

export function curlSyntaxTemplate(display = 'flex') {
  return html`
    <div class="col m-markdown" style="flex:1; display:${display}; position:relative; max-width: 100%;">
      <button
        class="btn btn-sm btn-outline toolbar-btn"
        style="position:absolute; top:12px; right:8px"
        @click="${(e) => {
          copyToClipboard(this.curlSyntax.trim().replace(/\\$/, ''), e);
        }}"
        part="btn btn-outline btn-copy"
      >
        Copy
      </button>
      <pre style="white-space:pre"><code class="language-shell">${this.curlSyntax.trim().replace(/\\$/, '')}</code></pre>
    </div>
  `;
}

export function apiResponseTabTemplate() {
  let responseFormat = '';
  let responseContent = '';
  if (!this.responseIsBlob) {
    if (this.responseHeaders.includes('application/x-ndjson') || this.responseHeaders.includes('json')) {
      responseFormat = 'json';
    } else if (this.responseHeaders.includes('html') || this.responseHeaders.includes('xml')) {
      responseFormat = 'html';
    } else {
      responseFormat = 'text';
    }
    responseContent = html`<code class="language-${responseFormat}">${this.responseText}</code>`;
  }
  return html` <div class="row" style="font-size:var(--font-size-small); margin:5px 0; justify-content:space-between; align-items:center;">
      <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
      <button class="btn btn-outline" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
    </div>
    <div part="tab-panel" class="tab-panel col">
      <div
        id="tab_buttons"
        part="tab-btn-row"
        class="tab-buttons row"
        @click="${(e) => {
          if (e.target.classList.contains('tab-btn') === false && e.target.classList.contains('tab') === false) {
            return;
          }
          this.activeResponseTab = e.target.dataset.tab;
        }}"
      >
        <button part="tab-btn" class="tab-btn ${this.activeResponseTab === 'response' ? 'active' : ''}" data-tab="response">
          RESPONSE
        </button>
        <button part="tab-btn" class="tab-btn ${this.activeResponseTab === 'headers' ? 'active' : ''}" data-tab="headers">
          RESPONSE HEADERS
        </button>
        ${
          this.showCurlBeforeTry === 'true'
            ? ''
            : html`<button part="tab-btn" class="tab-btn ${this.activeResponseTab === 'curl' ? 'active' : ''}" data-tab="curl">
                CURL
              </button>`
        }
      </div>
      ${
        this.responseIsBlob
          ? html`<div
              part="tab-content"
              class="tab-content col"
              style="flex:1; display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};"
            >
              ${
                this.responseBlobType === 'image'
                  ? html`<img style="max-height:var(--resp-area-height); object-fit:contain;" class="mar-top-8" src="${ifDefined(this.responseBlobUrl)}"></img>`
                  : ''
              }
              <button
                class="btn btn-outline mar-top-8"
                style="width:135px"
                @click="${() => {
                  downloadResource(this.responseBlobUrl, this.respContentDisposition);
                }}"
                part="btn btn-outline"
              >
                DOWNLOAD
              </button>
              ${
                this.responseBlobType === 'view' || this.responseBlobType === 'image'
                  ? html`<button
                      class="btn btn-outline mar-top-8"
                      style="width:135px"
                      @click="${() => {
                        viewResource(this.responseBlobUrl);
                      }}"
                      part="btn btn-outline"
                    >
                      VIEW (NEW TAB)
                    </button>`
                  : ''
              }
            </div>`
          : html`<div
              part="tab-content"
              class="tab-content col m-markdown"
              style="flex:1; display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};"
            >
              <button
                class="btn btn-sm btn-outline toolbar-btn"
                @click="${(e) => {
                  copyToClipboard(this.responseText, e);
                }}"
                part="btn btn-outline btn-copy"
              >
                Copy
              </button>
              <pre style="white-space:pre; min-height:50px; height:var(--resp-area-height); resize:vertical; overflow:auto">
${responseContent}</pre>
            </div>`
      }
      <div
        part="tab-content"
        class="tab-content col m-markdown"
        style="flex:1; display:${this.activeResponseTab === 'headers' ? 'flex' : 'none'};"
      >
        <button
          class="btn btn-sm btn-outline toolbar-btn"
          @click="${(e) => {
            copyToClipboard(this.responseHeaders, e);
          }}"
          part="btn btn-outline btn-copy"
        >
          Copy
        </button>
        <pre style="white-space:pre"><code class="language-css">${this.responseHeaders}</code></pre>
      </div>
      ${this.showCurlBeforeTry === 'true' ? '' : curlSyntaxTemplate.call(this, this.activeResponseTab === 'curl' ? 'flex' : 'none')}
    </div>`;
}

export function apiCallTemplate() {
  let authHtml;
  if (this.security?.length > 0 && !this.security.every((s) => !s || Object.keys(s).length === 0)) {
    if (this.api_keys.length > 0) {
      authHtml = html`<span class="blue-text">
        ${this.api_keys.length === 1 ? `${this.api_keys[0]?.typeDisplay} in ${this.api_keys[0].in}` : `${this.api_keys.length} API keys applied`}
      </span>`;
    } else if (this.security.some((s) => !s || Object.keys(s).length === 0)) {
      authHtml = html`Optional (None Applied)`;
    } else {
      authHtml = html`Required <span class="red-text">(None Applied)</span>`;
    }
  } else {
    authHtml = html`Not Required`;
  }

  return html`<div class="try-bar" part="wrap-request-btn">
      <div class="try-layout">
        <dl class="try-info">
          ${
            this.serverUrl
              ? html`<dt>API Server</dt>
                  <dd class="try-server-url">${this.serverUrl}</dd>`
              : ''
          }
          <dt>Authentication</dt>
          <dd>${authHtml}</dd>
        </dl>
        <div class="try-actions">
          ${
            this.parameters.length > 0 || this.request_body
              ? html` <button
                    class="btn btn-outline"
                    part="btn btn-outline btn-fill"
                    ?disabled="${this.loading}"
                    @click="${this.onFillRequestData}"
                    title="Fills with example data (if provided)"
                  >
                    FILL EXAMPLE
                  </button>
                  <button
                    class="btn btn-outline"
                    part="btn btn-outline btn-clear"
                    ?disabled="${this.loading}"
                    @click="${this.onClearRequestData}"
                  >
                    CLEAR
                  </button>`
              : ''
          }
          <button
            class="btn btn-primary"
            part="btn btn-try"
            ?disabled="${this.loading}"
            aria-busy="${this.loading}"
            @click="${this.onTryClick}"
          >
            ${this.loading ? 'TRYING...' : 'TRY'}
          </button>
        </div>
      </div>
    </div>
    <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
      ${this.showCurlBeforeTry === 'true' ? curlSyntaxTemplate.call(this) : ''}
    </div>
    ${this.responseMessage === '' ? '' : apiResponseTabTemplate.call(this)} `;
}

export default apiCallTemplate;
