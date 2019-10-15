import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import FontStyles from '@/styles/font-styles';
import '@/components/api-request';
import '@/components/api-response';

export default class PathAndMethods extends LitElement {
  /* eslint-disable indent */
  render() {
    return html`
      ${FontStyles}
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
            > </api-request>
            <api-response  
              class="response"
              schema-style = "${this.schemaStyle}" 
              .responses="${this.path[this.path.activeMethod].responses}"
            > </api-response>
          </div>
        </div>`
      : '';
  }

  /* eslint-enable indent */

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
    };
  }

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

  static get styles() {
    return [css`
    .only-large-screen {
      display:none;
    }

    .head .path{
      display: flex;
      font-family:var(--font-mono);
      font-size: var(--font-size-small);
      align-items: center;
      overflow-wrap: break-word;
      word-break: break-all;
    }

    .m-endpoint.expanded{margin-bottom:16px; }
    .m-endpoint > .head{
      border-width:1px 1px 1px 5px;
      border-style:solid;
      border-color:transparent;
      border-top-color:var(--light-border-color);
      display:flex;
      padding:6px 16px;
      align-items: center;
    }
    .m-endpoint > .head:hover{
      background-color:var(--light-put-color); 
    }
    .m-endpoint > .head.expanded{
      cursor: pointer;
    }
    .m-endpoint > .head.get {
      border-color:var(--get-color); 
      background-color:var(--light-get-color); 
    }

    .m-endpoint > .head.put {
      border-color:var(--put-color); 
      background-color:var(--light-put-color); 
    }

    .m-endpoint > .head.post {
      border-color:var(--post-color); 
      background-color:var(--light-post-color); 
    }
    .m-endpoint > .head.delete {
      border-color:var(--delete-color); 
      background-color:var(--light-delete-color); 
    }
    .m-endpoint > .head.patch {
      border-color:var(--patch-color); 
      background-color:var(--light-patch-color); 
    }


    .m-endpoint .body {
      flex-wrap:wrap;
      padding:16px 0px 0 0px;
      border-width:0px 1px 1px 5px;
      border-style:solid;
      box-shadow: 0px 4px 3px -3px rgba(0, 0, 0, 0.15);
    }
    .m-endpoint .body.delete{ border-color:var(--delete-color); }
    .m-endpoint .body.patch{ border-color:var(--patch-color); }
    .m-endpoint .body.put{ border-color:var(--put-color); }
    .m-endpoint .body.post{border-color:var(--post-color);}
    .m-endpoint .body.get{ border-color:var(--get-color); }

    .head .deprecated{
      text-decoration: line-through red;
    }

    .summary{
      padding:8px 8px;
    }
    .summary .title{
      font-size:calc(var(--title-font-size) + 2px);
      margin-bottom: 6px;
      word-break: break-all;
    }

    .method{
      padding:2px 5px;
      vertical-align: middle;
      height: 20px;
      line-height: 20px;
      min-width: 48px;
      border-radius: 2px;
      display:inline-block;
      font-size:var(--font-size-small);
      text-align: center;
      font-weight: bold;
      text-transform:uppercase;
      margin-right:5px;
      cursor: pointer;
    }

    .method.get{ 
      border: 1px solid var(--get-color);
    }
    .get.expanded .method.get,
    .method.get:hover{ 
      background-color:var(--get-color);
      color:#333;
    }

    .method.put{ 
      border: 1px solid var(--put-color); 
    }
    .put.expanded .method.put,
    .method.put:hover{ 
      background-color:var(--put-color);
      color:#333;
    }

    .method.post{ 
      border: 1px solid var(--post-color); 
    }
    .post.expanded .method.post,
    .method.post:hover{ 
      background-color:var(--post-color);
      color:#333;
    }

    .method.delete{ 
      border: 1px solid var(--delete-color);
    }
    .delete.expanded .method.delete,
    .method.delete:hover{
      background-color:var(--delete-color);
      color:#333;
    }

    .method.patch{ 
      border: 1px solid var(--patch-color); 
    }
    .patch.expanded .method.patch,
    .method.patch:hover{ 
      background-color:var(--patch-color);
      color:#333;
    }

    .method-text { margin-right:5px; }
    .head.get .method-text { color:var(--get-color);}
    .head.put .method-text { color:var(--put-color);}
    .head.post .method-text { color:var(--post-color);}
    .head.delete .method-text { color:var(--delete-color);}
    .head.patch .method-text { color:var(--patch-color);}

    .req-resp-container{
      display: flex;
      margin-top:16px;
      align-items: stretch;
      flex-wrap: wrap;
      flex-direction: column;
      border-top:1px solid var(--light-border-color);
    }
    .request,
    .response{
      flex:1; 
      min-height:100px;
      padding:16px 8px;
      overflow:hidden;
    }
    .request{
      border-width:0 0 1px 0;
      border-style:dashed;
    }
    .patch .request{ 
      border-color:var(--patch-color); 
    }
    .put .request{ 
      border-color:var(--put-color); 
    }
    .post .request{ 
      border-color:var(--post-color); 
    }
    .get .request{ 
      border-color:var(--get-color); 
    }
    .delete .request{ 
      border-color:var(--delete-color); 
    }


    @media only screen and (min-width: 768px){
      .head .path{
        font-size: var(--font-size-regular);
        min-width:400px;
      }
      .head .m-markdown-small,
      .descr .m-markdown-small{
        display:block;
      }
      .only-large-screen{
        display:block;
      }
      .req-resp-container{
        flex-direction: var(--layout, row);
      }
      .request{
        border-width:0 1px 0 0;
        padding:16px 24px;
      }
      .response{
        padding:16px 24px;
      } 
      .summary{
        padding:8px 24px;
      }
    }
  `];
  }
}
// Register the element with the browser
customElements.define('path-and-methods', PathAndMethods);
