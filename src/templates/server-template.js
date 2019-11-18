import { html } from 'lit-element';

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
              @change = '${(e) => this.onApiServerChange(e, server.url)}'
              .checked = '${this.selectedServer === server.url}'
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
            @change = '${(e) => this.onApiServerChange(e, this.serverUrl)}'
            .checked = '${this.selectedServer === this.serverUrl}'
            style = 'margin:4px 0'
          />
            ${this.serverUrl}
          <br/>`
        : ''
      }
    </div>
  </div>`;
}
