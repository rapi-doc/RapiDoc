import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import fontStyles from '@/styles/font-styles';
import '@/components/api-request';
import '@/components/api-response';

export default class PathAndMethods extends LitElement {
  constructor() {
    super();
    this.accept = '';
  }

  static get properties() {
    return {
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      selectedServer: { type: String, attribute: 'selected-server' },
      layout: { type: String },
      path: { type: Object },
      allowTry: { type: String, attribute: 'allow-try' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
    };
  }

  /* eslint-disable indent */
  render() {
    return html`
      ${fontStyles}
      ${window.innerWidth >= 768
        ? html` ${this.layout === 'row'
          ? html`
            <style>
              .request{ border-width: 0 1px 0 0; }
            </style>`
          : html`
            <style>
              .request{ border-width: 0 0 1px 0; }
            </style>
          `}`
        : ''
      }

      <div class='m-endpoint regular-font ${this.path.activeMethod} ${this.path.expanded ? 'expanded' : 'collapsed'}'>
        <!-- Endpoint Head -->
        <div class='head ${this.path.activeMethod} ${this.path.expanded ? 'expanded' : 'collapsed'}' @click="${() => this.collapse()}">
          <span class="path"> 
            <span class="method-text"> ${this.path.activeMethod === 'no-active-method' ? '' : this.path.activeMethod.toUpperCase()} </span> 
            ${this.path.path} 
          </span>
          <div class="only-large-screen" style="min-width:60px; flex:1"></div>
          ${this.path.get ? html`<div class="method get" @click="${(e) => this.expand('get', e)}" > GET </div>` : ''}
          ${this.path.put ? html`<div class="method put" @click="${(e) => this.expand('put', e)}"> PUT </div>` : ''}
          ${this.path.post ? html`<div class="method post" @click="${(e) => this.expand('post', e)}"> POST </div>` : ''}
          ${this.path.delete ? html`<div class="method delete" @click="${(e) => this.expand('delete', e)}"> DELETE </div>` : ''}
          ${this.path.head ? html`<div class="method head" @click="${(e) => this.expand('head', e)}"> HEAD </div>` : ''}
          ${this.path.patch ? html`<div class="method patch" @click="${(e) => this.expand('patch', e)}"> PATCH </div>` : ''}
        </div>
        <!-- Endpoint Body -->
        ${this.pathBodyTemplate()}
      </div>
    `;
  }

  pathBodyTemplate() {
    // Merge Common Parameters with This active-methods parameters
    let finalParameters = [];
    const commonParams = this.path.parameters && this.path.parameters.length > 0 ? this.path.parameters : null;
    const pathParams = this.path[this.path.activeMethod] && this.path[this.path.activeMethod].parameters && this.path[this.path.activeMethod].parameters.length > 0
      ? this.path[this.path.activeMethod].parameters
      : undefined;

    if (commonParams) {
      if (pathParams && pathParams.length > 0) {
        finalParameters = commonParams.filter((commonParam) => {
          if (!pathParams.some((param) => (commonParam.name === param.name && commonParam.in === param.in))) {
            return commonParam;
          }
        }).concat(pathParams);
      } else {
        finalParameters = commonParams.slice(0);
      }
    } else {
      finalParameters = [];
    }

    return this.path.expanded
      ? html`
        <div class='body ${this.path.activeMethod}'>
          ${this.path[this.path.activeMethod].summary || this.path[this.path.activeMethod].description
            ? html`
              <div class="summary">
                <div class="m-markdown title">${unsafeHTML(marked(this.path[this.path.activeMethod].summary || ''))}</div>
                ${this.path[this.path.activeMethod].summary !== this.path[this.path.activeMethod].description
                  ? html`
                    <div class="m-markdown"> 
                      ${unsafeHTML(marked(this.path[this.path.activeMethod].description || ''))}
                    </div>`
                  : ''
                }  
              </div>`
            : ''
          }
          <div class='req-resp-container'> 
            <api-request  class="request"  
              method = "${this.path.activeMethod}", 
              path = "${this.path[this.path.activeMethod].path}" 
              api-key-name = "${this.apiKeyName}" 
              api-key-value = "${this.apiKeyValue}" 
              api-key-location = "${this.apiKeyLocation}" 
              selected-server = "${this.selectedServer}" 
              .parameters = "${finalParameters}" 
              .request_body = "${this.path[this.path.activeMethod].requestBody}"
              allow-try = "${this.allowTry}"
              accept = "${this.accept}"
              schema-style= "${this.schemaStyle}"
              default-schema-tab  = "${this.defaultSchemaTab}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
            > </api-request>
            <api-response  
              class="response"
              schema-style = "${this.schemaStyle}" 
              .responses="${this.path[this.path.activeMethod].responses}"
              default-schema-tab  = "${this.defaultSchemaTab}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
            > </api-response>
          </div>
        </div>`
      : '';
  }

  /* eslint-enable indent */

  collapse() {
    if (this.path.expanded) {
      this.path.expanded = false;
      this.path.activeMethod = 'no-active-method';
    }
    this.requestUpdate();
  }

  expand(method, e) {
    this.path.expanded = true;
    this.path.activeMethod = method;
    let accept = '';
    for (const respStatus in this.path.responses) {
      for (const acceptContentType in (this.path.responses[respStatus].content)) {
        accept = `${accept + acceptContentType}, `;
      }
    }
    accept = accept.replace(/,\s*$/, ''); // remove trailing comma
    this.accept = accept;
    e.stopPropagation();
    this.requestUpdate();
  }
}
// Register the element with the browser
customElements.define('path-and-methods', PathAndMethods);
