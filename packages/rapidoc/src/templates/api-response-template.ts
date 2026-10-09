/**
 * Renders the interactive API response panel (status, headers, body, blob actions),
 * live cURL preview/copy, and the execute/Try action controls for <api-request>.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { copyToClipboard, downloadResource, viewResource } from '~/utils/common-utils';
import type { ApiRequestElement } from '~/types/element';

export function curlSyntaxTemplate(this: ApiRequestElement, display = 'flex'): TemplateResult {
  return html`
    <div class="col m-markdown" style="flex:1; display:${display}; position:relative; max-width: 100%;">
      <button
        class="toolbar-btn"
        style="position:absolute; top:12px; right:8px"
        @click="${(e: Event) => {
          copyToClipboard(this.curlSyntax.trim().replace(/\\$/, ''), e);
        }}"
        part="btn btn-fill btn-copy"
      >
        Copy
      </button>
      <pre style="white-space:pre"><code class="language-shell">${this.curlSyntax.trim().replace(/\\$/, '')}</code></pre>
    </div>
  `;
}

export function apiResponseTabTemplate(this: ApiRequestElement): TemplateResult {
  let responseFormat = '';
  let responseContent: TemplateResult | '' = '';
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
  return html` <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
      <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
      <div style="flex:1"></div>
      <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
    </div>
    <div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
      <div
        id="tab_buttons"
        part="tab-btn-row"
        class="tab-buttons row"
        @click="${(e: Event) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('tab-btn') === false) {
            return;
          }
          this.activeResponseTab = target.dataset.tab!;
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
                  ? html`<img style="max-height:var(--resp-area-height, 400px); object-fit:contain;" class="mar-top-8" src="${ifDefined(this.responseBlobUrl)}"></img>`
                  : ''
              }
              <button
                class="m-btn thin-border mar-top-8"
                style="width:135px"
                @click="${(e: Event) => {
                  // TODO(ts-migration): downloadResource takes 2 parameters, the event argument is ignored.
                  // @ts-expect-error extra argument
                  downloadResource(this.responseBlobUrl, this.respContentDisposition, e);
                }}"
                part="btn btn-outline"
              >
                DOWNLOAD
              </button>
              ${
                this.responseBlobType === 'view' || this.responseBlobType === 'image'
                  ? html`<button
                      class="m-btn thin-border mar-top-8"
                      style="width:135px"
                      @click="${(e: Event) => {
                        // TODO(ts-migration): viewResource takes 1 parameter, the event argument is ignored.
                        // @ts-expect-error extra argument
                        viewResource(this.responseBlobUrl, e);
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
                class="toolbar-btn"
                style="position:absolute; top:12px; right:8px"
                @click="${(e: Event) => {
                  copyToClipboard(this.responseText, e);
                }}"
                part="btn btn-fill btn-copy"
              >
                Copy
              </button>
              <pre style="white-space:pre; min-height:50px; height:var(--resp-area-height, 400px); resize:vertical; overflow:auto">
${responseContent}</pre>
            </div>`
      }
      <div
        part="tab-content"
        class="tab-content col m-markdown"
        style="flex:1; display:${this.activeResponseTab === 'headers' ? 'flex' : 'none'};"
      >
        <button
          class="toolbar-btn"
          style="position:absolute; top:12px; right:8px"
          @click="${(e: Event) => {
            copyToClipboard(this.responseHeaders as string, e);
          }}"
          part="btn btn-fill btn-copy"
        >
          Copy
        </button>
        <pre style="white-space:pre"><code class="language-css">${this.responseHeaders}</code></pre>
      </div>
      ${this.showCurlBeforeTry === 'true' ? '' : curlSyntaxTemplate.call(this, this.activeResponseTab === 'curl' ? 'flex' : 'none')}
    </div>`;
}

export function apiCallTemplate(this: ApiRequestElement): TemplateResult {
  const selectedServerHtml = html`
    <div style="display:flex; flex-direction:column;">
      ${
        this.serverUrl
          ? html`<div style="display:flex; align-items:baseline;">
              <div style="font-weight:bold; padding-right:5px;">API Server</div>
              <span class="gray-text"> ${this.serverUrl} </span>
            </div>`
          : ''
      }
    </div>
  `;

  return html`<div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);" part="wrap-request-btn">
      <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;">${selectedServerHtml}</div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${
            (this.security?.length as number) > 0 && !this.security!.every((s) => !s || Object.keys(s).length === 0)
              ? html` ${
                  this.api_keys!.length > 0
                    ? html`<div style="color:var(--blue); overflow:hidden;">
                        ${
                          this.api_keys!.length === 1
                            ? `${this.api_keys![0]?.typeDisplay} in ${this.api_keys![0].in}`
                            : `${this.api_keys!.length} API keys applied`
                        }
                      </div>`
                    : this.security!.some((s) => !s || Object.keys(s).length === 0)
                      ? html`<div class="gray-text">Optional <span class="gray-text">(None Applied)</span></div>`
                      : html`<div class="gray-text">Required <span style="color:var(--red)">(None Applied)</span></div>`
                }`
              : html`<span class="gray-text"> Not Required </span>`
          }
        </div>
      </div>
      ${
        this.parameters!.length > 0 || this.request_body
          ? html` <button
                class="m-btn thin-border"
                part="btn btn-outline btn-fill"
                style="margin-right:5px;"
                ?disabled="${this.loading}"
                @click="${this.onFillRequestData}"
                title="Fills with example data (if provided)"
              >
                FILL EXAMPLE
              </button>
              <button
                class="m-btn thin-border"
                part="btn btn-outline btn-clear"
                style="margin-right:5px;"
                ?disabled="${this.loading}"
                @click="${this.onClearRequestData}"
              >
                CLEAR
              </button>`
          : ''
      }
      <button
        class="m-btn primary thin-border"
        part="btn btn-try"
        ?disabled="${this.loading}"
        aria-busy="${this.loading}"
        @click="${this.onTryClick}"
      >
        ${this.loading ? 'TRYING...' : 'TRY'}
      </button>
    </div>
    <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
      ${this.showCurlBeforeTry === 'true' ? curlSyntaxTemplate.call(this) : ''}
    </div>
    ${this.responseMessage === '' ? '' : apiResponseTabTemplate.call(this)} `;
}

export default apiCallTemplate;
