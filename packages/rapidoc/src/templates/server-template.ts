/**
 * Renders the API server selector dropdown and server variable configuration form.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.ts';
import { marked } from 'marked';
import type { ServerHost } from '~/types/element';
import type { ResolvedServer, ResolvedSpec } from '~/types/spec';

export function setApiServer(this: ServerHost, serverUrl: string): boolean {
  const serverObj = (this.resolvedSpec as ResolvedSpec | null)?.servers.find((s) => s.url === serverUrl);
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

function onApiServerVarChange(this: ServerHost, e: Event, serverObj: ResolvedServer): void {
  const inputEls = [
    ...(e.currentTarget as HTMLElement).closest('table')!.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select'),
  ];
  let tempUrl = serverObj.url!;
  inputEls.forEach((v) => {
    const regex = new RegExp(`{${v.dataset.var}}`, 'g');
    tempUrl = tempUrl.replace(regex, v.value);
  });
  serverObj.computedUrl = tempUrl;
  this.requestUpdate();
}

function serverVarsTemplate(this: ServerHost): TemplateResult | '' {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return this.selectedServer && this.selectedServer.variables
    ? html`
        <div class="table-title">SERVER VARIABLES</div>
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
                          @input=${(e: Event) => {
                            onApiServerVarChange.call(this, e, this.selectedServer!);
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
                          @input=${(e: Event) => {
                            onApiServerVarChange.call(this, e, this.selectedServer!);
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

export default function serverTemplate(this: ServerHost): TemplateResult | '' {
  if (!this.resolvedSpec || this.resolvedSpec.specLoadError) {
    return '';
  }
  return html`<section
    id="servers"
    part="section-servers"
    style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;"
    class="regular-font observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap'}"
  >
    <div part="section-servers-title" class="sub-title" style="display:flex; align-items:center; gap:8px;">
      API SERVER
      ${
        this.mockServer === 'true'
          ? html`<span
              style="font-size:var(--font-size-small); font-weight:bold; color:var(--green, #10b981); border:1px solid var(--green, #10b981); border-radius:4px; padding:1px 6px; letter-spacing:0.5px;"
              title="In-browser mock server is active"
            >
              MOCK ACTIVE
            </span>`
          : ''
      }
    </div>
    <div class="mono-font" style="margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);">
      ${
        !(this.resolvedSpec as ResolvedSpec).servers || (this.resolvedSpec as ResolvedSpec).servers?.length === 0
          ? ''
          : html`
              ${(this.resolvedSpec as ResolvedSpec)?.servers.map(
                (server, i) => html`
                  <input
                    type="radio"
                    name="api_server"
                    id="srvr-opt-${i}"
                    value="${server.url}"
                    @change=${() => {
                      setApiServer.call(this, server.url!);
                    }}
                    .checked="${this.selectedServer!.url === server.url}"
                    style="margin:4px 0; cursor:pointer"
                  />
                  <label style="cursor:pointer" for="srvr-opt-${i}">
                    ${server.url} ${server.description ? html`- <span class="regular-font">${server.description} </span>` : ''}
                  </label>
                  <br />
                `
              )}
            `
      }
      <div class="table-title primary-text" part="label-selected-server">
        SELECTED: ${this.selectedServer?.computedUrl || 'none'}
        ${this.mockServer === 'true' ? html`<span style="color:var(--green, #10b981); margin-left:6px;">(Mocked)</span>` : ''}
      </div>
    </div>
    <slot name="servers"></slot>
    ${serverVarsTemplate.call(this)}
  </section>`;
}
