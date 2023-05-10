import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import '../components/base-url';
import updateCodeExample from '../utils/update-code-example';

export function setApiServer(serverUrl) {
  const serverObj = this.resolvedSpec?.servers.find((s) => s.url === serverUrl);
  if (!serverObj) {
    return false;
  }
  this.selectedServer = serverObj;
  this.requestUpdate();
  this.dispatchEvent(new CustomEvent('api-server-change', {
    bubbles: true,
    composed: true,
    detail: {
      selectedServer: serverObj,
    },
  }));
  return true;
}

function onApiServerVarChange(e, serverObj) {
  const inputEls = [...e.currentTarget.closest('.server-vars').querySelectorAll('input, select')];
  let tempUrl = serverObj.url;
  inputEls.forEach((v) => {
    serverObj.variables[v.dataset.var].value = v.value;
    const regex = new RegExp(`{${v.dataset.var}}`, 'g');
    tempUrl = tempUrl.replace(regex, v.value.trim());
  });
  serverObj.computedUrl = tempUrl;

  const requestPanelEl = this.getRequestPanel(e);
  updateCodeExample.call(this, requestPanelEl);

  this.requestUpdate();
}

/* eslint-disable indent */
function serverVarsTemplate() {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return this.selectedServer && this.selectedServer.variables
    ? html`
    <div class='server-vars'>
      ${Object.entries(this.selectedServer.variables).map((kv) => html`
        <div>
          <div class='right-box-label' >${kv[0]}</div>
          <div>
            ${kv[1].enum
            ? html`
            <select
              data-var = "${kv[0]}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, this.selectedServer); }}
            >
            ${Object.entries(kv[1].enum).map((e) => (kv[1].default === e[1]
              ? html`
              <option
                selected
                label = ${e[1]}
                value = ${e[1]}
              />`
              : html`
              <option
                label = ${e[1]}
                value = ${e[1]}
              />`
            ))}
            </select>`
            : html`
            <input
              class="right-box-input"
              type = "text"
              part="textbox textbox-server-var"
              spellcheck = "false"
              data-var = "${kv[0]}"
              value = "${kv[1].default}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, this.selectedServer); }}
            />`}
          </div>
        </div>
        ${kv[1].description
          ? html`<div><div style="border:none; margin-top: 4px"><span class="m-markdown-small"> ${unsafeHTML(marked(kv[1].description))} </span></div></div>`
          : ''
        }
      `)}
    </div>
    `
    : '';
}

export default function serverTemplate() {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) { return ''; }
  return html`
  <section id = 'servers' part="section-servers" class='server-template row-api-right-box regular-font observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap'}'>
    <span class="right-box-title">Base URL</span>
    <div style="display: flex; align-items: center;" class="server-template">
      ${this.selectedServer?.computedUrl
        ? html`
            <base-url id='copy-baseURL' url='${this.selectedServer?.url}' path='${this.path}' computedUrl='${this.selectedServer.computedUrl}' .variables='${this.selectedServer?.variables}' style="width: 100%;">
              <div class="server-template-vars">
                ${serverVarsTemplate.call(this)}
              </div>
            </base-url>
          </div>`
        : ''
      }
    </div>
  </section>`;
}
/* eslint-enable indent */
