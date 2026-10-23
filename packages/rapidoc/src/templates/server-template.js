/**
 * Renders the API server selector dropdown and server variable configuration form.
 */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';

export function setApiServer(serverUrl) {
  const serverObj = this.resolvedSpec?.servers.find((s) => s.url === serverUrl);
  if (!serverObj) {
    return false;
  }
  this.selectedServer = serverObj;
  this.requestUpdate();
  this.dispatchEvent(
    new CustomEvent('api-server-change', {
      bubbles: true,
      composed: true,
      detail: {
        selectedServer: serverObj,
      },
    })
  );
  return true;
}

function onApiServerVarChange(e, serverObj) {
  const inputEls = [...e.currentTarget.closest('table').querySelectorAll('input, select')];
  let tempUrl = serverObj.url;
  inputEls.forEach((v) => {
    const regex = new RegExp(`{${v.dataset.var}}`, 'g');
    tempUrl = tempUrl.replace(regex, v.value);
  });
  serverObj.computedUrl = tempUrl;
  this.requestUpdate();
}

function serverVarsTemplate() {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return this.selectedServer && this.selectedServer.variables
    ? html`
        <h3 class="rapidoc-heading label-heading table-title" part="heading heading-3">Server variables</h3>
        <table class="m-table" role="presentation">
          ${Object.entries(this.selectedServer.variables).map(
            (kv) => html`
              <tr>
                <td style="vertical-align: middle;">${kv[0]}</td>
                <td>
                  ${
                    kv[1].enum
                      ? html` <select
                          data-var="${kv[0]}"
                          @input=${(e) => {
                            onApiServerVarChange.call(this, e, this.selectedServer);
                          }}
                        >
                          ${Object.entries(kv[1].enum).map((e) =>
                            kv[1].default === e[1]
                              ? html`<option selected label=${e[1]} value=${e[1]}></option>`
                              : html`<option label=${e[1]} value=${e[1]}></option>`
                          )}
                        </select>`
                      : html` <input
                          type="text"
                          part="textbox textbox-server-var"
                          spellcheck="false"
                          data-var="${kv[0]}"
                          value="${kv[1].default}"
                          @input=${(e) => {
                            onApiServerVarChange.call(this, e, this.selectedServer);
                          }}
                        />`
                  }
                </td>
              </tr>
              ${
                kv[1].description
                  ? html`<tr>
                      <td colspan="2" style="border:none">
                        <span class="m-markdown-small"> ${unsafeHTML(sanitizeHTML(marked(kv[1].description)))} </span>
                      </td>
                    </tr>`
                  : ''
              }
            `
          )}
        </table>
      `
    : '';
}

export default function serverTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return '';
  }
  return html`<section
    id="servers"
    part="section-servers"
    style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;"
    class="regular-font observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap'}"
  >
    <h2 part="section-servers-title heading heading-2" class="rapidoc-heading sub-title" style="display:flex; align-items:center; gap:8px;">
      API Server
      ${
        this.mockServer === 'true'
          ? html`<span
              style="font-size:var(--font-size-small); font-weight:bold; color:var(--green); border:1px solid var(--green); border-radius:4px; padding:1px 6px; letter-spacing:0.5px;"
              title="In-browser mock server is active"
            >
              MOCK ACTIVE
            </span>`
          : ''
      }
    </h2>
    <div class="mono-font" style="margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);">
      ${
        !this.resolvedSpec.servers || this.resolvedSpec.servers?.length === 0
          ? ''
          : html`
              ${this.resolvedSpec?.servers.map(
                (server, i) => html`
                  <div class="server-opt-row">
                    <input
                      type="radio"
                      name="api_server"
                      id="srvr-opt-${i}"
                      value="${server.url}"
                      @change=${() => {
                        setApiServer.call(this, server.url);
                      }}
                      .checked="${this.selectedServer.url === server.url}"
                    />
                    <label for="srvr-opt-${i}">
                      ${server.url} ${server.description ? html`- <span class="regular-font">${server.description} </span>` : ''}
                    </label>
                  </div>
                `
              )}
            `
      }
      <div class="table-title primary-text" part="label-selected-server">
        SELECTED: ${this.selectedServer?.computedUrl || 'none'}
        ${this.mockServer === 'true' ? html`<span style="color:var(--green); margin-left:6px;">(Mocked)</span>` : ''}
      </div>
    </div>
    <slot name="servers"></slot>
    ${serverVarsTemplate.call(this)}
  </section>`;
}
