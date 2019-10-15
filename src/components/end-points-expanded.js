import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import '@/components/api-request';
import '@/components/api-response';
import FontStyles from '@/styles/font-styles';

export default class EndPointsExpanded extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
      <style>
        .req-resp-container{
          border-bottom: 1px solid var(--primary-color);
          margin-bottom: 16px;
          padding-bottom: 16px;
        }
        .method {text-transform:uppercase;}
        .method.put { color: var(--put-color); }
        .method.post { color: var(--post-color); }
        .method.get { color: var(--get-color); }
        .method.delete { color: var(--delete-color); }
        .method.patch { color: var(--patch-color); }
        .method.head { color: var(--head-color); }

        .endpoint-read-body{
          padding: 12px 24px; 
        }
      </style>  
      ${this.paths.map((path) => this.endpointBodyTemplate(path))}
    `;
  }

  endpointBodyTemplate(path) {
    return html`
    <div class='endpoint-body ${path.method}' style='padding:16px 24px'>
      ${html`
        <h1> ${path.summary} </h1>
  <div class='mono-font regular-font-size'> <span class='regular-font method ${path.method}'>${path.method}</span> ${path.path} </div>`
      }
      ${path.description
          ? html`
              <div class="m-markdown m-markdown-small"> 
                ${unsafeHTML(marked(path.description || ''))}
              </div>`
          : ''
      }

      <div class='req-resp-container'> 
        <api-request  class="request"  
          method = "${path.method}", 
          path = "${path.path}" 
          api-key-name = "${this.apiKeyName}" 
          api-key-value = "${this.apiKeyValue}" 
          api-key-location = "${this.apiKeyLocation}" 
          selected-server = "${this.selectedServer}" 
          .parameters = "${path.parameters}" 
          .request_body = "${path.requestBody}"
          allow-try = "${this.allowTry}"
          accept = "${this.accept}"
          render-style="${this.renderStyle}" 
          schema-style = "${this.schemaStyle}"
        > </api-request>

        <api-response  
          class="response" 
          schema-style="${this.schemaStyle}"
          render-style="${this.renderStyle}" 
          .responses="${path.responses}"
        > </api-response>
      </div>
    </div>`;
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
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
    };
  }
}
// Register the element with the browser
customElements.define('end-points-expanded', EndPointsExpanded);
