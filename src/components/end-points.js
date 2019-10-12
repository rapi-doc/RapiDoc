import { LitElement, html } from 'lit-element';
import '@/components/end-point';

export default class EndPoints extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
      ${this.paths.filter((v) => {
        if (this.matchPaths) {
          return `${v.method} ${v.path}`.includes(this.matchPaths);
        }
        return true;
      })
      .map((path) => html`
        </span>
          <end-point
            selected-server="${this.selectedServer}" 
            api-key-name="${this.apiKeyName ? this.apiKeyName : ''}" 
            api-key-value="${this.apiKeyValue ? this.apiKeyValue : ''}" 
            api-key-location="${this.apiKeyLocation}" 
            layout="${this.layout}" 
            .path=${path}
            allow-try="${this.allowTry ? this.allowTry : 'true'}" 
            schema-style="${this.schemaStyle}" 
          > 
          </end-point>
      `)
    }`;
  }
  /* eslint-enable indent */

  static get properties() {
    return {
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      selectedServer: { type: String, attribute: 'selected-server' },
      layout: { type: String },
      paths: { type: Object },
      matchPaths: { type: String, attribute: 'match-paths' },
      allowTry: { type: String, attribute: 'allow-try' },
      schemaStyle: { type: String, attribute: 'schema-style' },
    };
  }
}
// Register the element with the browser
customElements.define('end-points', EndPoints);
