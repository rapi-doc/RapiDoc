import { html } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

function onApiServerChange(e, data, server) {
  if (e && e.target.checked) {
    data.selectedServer = server;
    this.requestUpdate();
  }
}

function onApiServerVarChange(e, serverObj) {
  const inputEls = [...e.currentTarget.closest('table').querySelectorAll('input')];
  let tempUrl = serverObj.url;
  inputEls.forEach((v) => {
    const regex = new RegExp(`{${v.dataset.var}}`, 'g');
    tempUrl = tempUrl.replace(regex, v.value);
  });
  serverObj.computedUrl = tempUrl;
  this.requestUpdate();
}

/* eslint-disable indent */
function serverVarsTemplate(data) {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return data.selectedServer && data.selectedServer.variables
    ? html`
    <div class="table-title"> SERVER VARIABLES</div>
    <table class='m-table'>
      ${Object.entries(data.selectedServer.variables).map((kv) => html`
        <tr>
          <td style="vertical-align: middle;" >${kv[0]}</td>
          <td>
            <input 
              type = "text" 
              spellcheck = "false" 
              data-var = "${kv[0]}"
              value = "${kv[1].default}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, data.selectedServer); }}
            />
          </td>
        </tr>
        ${kv[1].description
          ? html`<tr><td colspan="2" style="border:none"><span class="m-markdown-small"> ${unsafeHTML(marked(kv[1].description))} </span></td></tr>`
          : ''
        }
      `)}
    </table>
    `
    : '';
}

export default function serverTemplate(data) {
  return html`
  <div id = 'api-servers' style="margin-top:24px; margin-bottom:24px;" class='regular-font observe-me ${data.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
    <div class = 'sub-title'> API SERVER: </div>
    <div class = 'mono-font' style='margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);'>
      ${!data.resolvedSpec.servers || (data.resolvedSpec.servers.length === 0)
        ? ''
        : html`
          ${data.resolvedSpec.servers.map((server) => html`
            <input type = 'radio' 
              name = 'api_server' 
              value = '${server.url}' 
              @change = ${(e) => { onApiServerChange.call(this, e, data, server); }}
              .checked = '${data.selectedServer.url === server.url}'
              style = 'margin:4px 0'
            />
              ${server.url} ${server.description ? html`- ${server.description}` : ''}
            <br/>
          `)}
      `}
      <div class="table-title primary-text"> SELECTED: ${data.selectedServer.computedUrl}</div>
    </div>
    ${serverVarsTemplate.call(this, data)}
  </div>`;
}
/* eslint-enable indent */
