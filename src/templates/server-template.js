import { html } from 'lit-element';

function onApiServerChange(e, server) {
  if (e && e.target.checked) {
    this.selectedServer = server;
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

function serverVarsTemplate() {
  // const selectedServerObj = this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer));
  return this.selectedServer && this.selectedServer.variables
    ? html`
    <div class="table-title"> SERVER VARIABLES</div>
    <table class='m-table'>
      ${Object.entries(this.selectedServer.variables).map((kv) => html`
        <tr>
          <td style="vertical-align: middle;" >${kv[0]}</td>
          <td>
            <input 
              type = "text" 
              spellcheck = "false" 
              style = "width:100%"
              data-var = "${kv[0]}"
              value = "${kv[1].default}"
              @input = ${(e) => { onApiServerVarChange.call(this, e, this.selectedServer); }}
            />
          </td>
        </tr>  
      `)}
    </table>
    `
    : '';
}

/* eslint-disable indent */
export default function serverTemplate() {
  return html`
  <div id = 'api-servers' class='regular-font observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
    <div class = 'sub-title'> API SERVER: </div>
    <div class = 'mono-font' style='margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);'>
      ${!this.resolvedSpec.servers || (this.resolvedSpec.servers.length === 0)
        ? ''
        : html`
          ${this.resolvedSpec.servers.map((server) => html`
            <input type = 'radio' 
              name = 'api_server' 
              value = '${server.url}' 
              @change = ${(e) => { onApiServerChange.call(this, e, server); }}
              .checked = '${this.selectedServer.url === server.url}'
              style = 'margin:4px 0'
            />
              ${server.url} ${server.description ? html`- ${server.description}` : ''}
            <br/>
          `)}
      `}
      ${(this.serverUrl)
        ? html`
          <input type='radio' 
            name = 'api_server' 
            value = '${this.serverUrl}' 
            @change = ${(e) => { onApiServerChange.call(this, e, { url: this.serverUrl, computedUrl: this.serverUrl }); }}
            .checked = '${this.selectedServer.url === this.serverUrl}'
            style = 'margin:4px 0'
          />
            ${this.serverUrl}
          <br/>`
        : ''
      }
      <div class="table-title primary-text"> SELECTED: ${this.selectedServer.computedUrl}</div>
    </div>
    ${serverVarsTemplate.call(this)}
  </div>`;
}
