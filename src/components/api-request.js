import { LitElement, html } from 'lit-element';
import marked from 'marked';
import Prism from 'prismjs';

import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import TableStyles from '@/styles/table-styles';
import FlexStyles from '@/styles/flex-styles';
import InputStyles from '@/styles/input-styles';
import FontStyles from '@/styles/font-styles';
import BorderStyles from '@/styles/border-styles';
import TabStyles from '@/styles/tab-styles';
import PrismStyles from '@/styles/prism-styles';
import { copyToClipboard } from '@/utils/common-utils';
import { schemaInObjectNotation, getTypeInfo, generateExample } from '@/utils/schema-utils';
import '@/components/json-tree';
import '@/components/schema-tree';
import '@/components/tag-input';

export default class ApiRequest extends LitElement {
  constructor() {
    super();
    this.responseMessage = '';
    this.responseStatus = 'success';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseUrl = '';
    this.curlSyntax = '';
    this.activeResponseTab = 'response'; // allowed values: response, headers, curl
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
  }

  static get properties() {
    return {
      serverUrl: { type: String, attribute: 'server-url' },
      servers: { type: Array },
      method: { type: String },
      path: { type: String },
      parameters: { type: Array },
      request_body: { type: Object },
      api_keys: { type: Array },
      parser: { type: Object },
      accept: { type: String },
      callback: { type: String },
      responseMessage: { type: String, attribute: false },
      responseText: { type: String, attribute: false },
      responseHeaders: { type: String, attribute: false },
      responseStatus: { type: String, attribute: false },
      responseUrl: { type: String, attribute: false },
      allowTry: { type: String, attribute: 'allow-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      activeResponseTab: { type: String }, // internal tracking of response-tab not exposed as a attribute
      selectedRequestBodyType: { type: String, attribute: 'selected-request-body-type' }, // internal tracking of selected request-body type
      selectedRequestBodyExample: { type: String, attribute: 'selected-request-body-example' }, // internal tracking of selected request-body example
    };
  }

  render() {
    return html`
    ${TableStyles}
    ${InputStyles}
    ${FontStyles}
    ${FlexStyles}
    ${BorderStyles}
    ${TabStyles}
    ${PrismStyles}
    <style>
      .read-mode{
        margin-top:24px;
      }
      .param-name,
      .param-type{
        margin: 1px 0;
        text-align: right;
        line-height: 12px;
      }
      .param-name{
        color: var(--fg); 
        font-family: var(--font-mono);
      }
      .param-type{
        color: var(--light-fg); 
        font-family: var(--font-regular);
      }
      .param-constraint{
        min-width:100px;
      }
      .param-constraint:empty{
        display:none;
      }
      .top-gap{margin-top:24px;}

      .textarea {
        min-height:220px; 
        padding:5px;
        resize:vertical;
        font-family:var(--font-mono);
        font-size:var(--font-size-small);
      }
      .response-message{
        font-weight:bold;
        text-overflow: ellipsis;
      }
      .response-message.error {
        color:var(--red);
      }
      .response-message.success {
        color:var(--blue);
      }

      .file-input-container {
        align-items:flex-end;
      }
      .file-input-container .input-set:first-child .file-input-remove-btn{
        visibility:hidden;
      }

      .file-input-remove-btn{
        font-size:16px;
        color:var(--red);
        outline: none;
        border: none;
        background:none;
        cursor:pointer;
      }

      @media only screen and (min-width: 768px) {
        .textarea {
          padding:8px;
        }
      }

    </style>
    <div class="col regular-font request-panel ${this.renderStyle === 'read' || this.callback === 'true' ? 'read-mode' : 'view-mode'}">
      <div class=" ${this.callback === 'true' ? 'tiny-title' : 'req-res-title'} "> 
        ${this.callback === 'true' ? 'CALLBACK REQUEST' : 'REQUEST'}
      </div>
      <div>
        ${this.inputParametersTemplate('path')}
        ${this.inputParametersTemplate('query')}
        ${this.requestBodyTemplate()}
        ${this.inputParametersTemplate('header')}
        ${this.inputParametersTemplate('cookie')}
        ${this.allowTry === 'false' ? '' : html`${this.apiCallTemplate()}`}
      </div>  
    </div>
    `;
  }

  /* eslint-disable indent */
  inputParametersTemplate(paramType) {
    let title = '';
    const filteredParams = this.parameters ? this.parameters.filter((param) => param.in === paramType) : [];
    if (filteredParams.length === 0) {
      return '';
    }
    if (paramType === 'path') {
      title = 'PATH PARAMETERS';
    } else if (paramType === 'query') {
      title = 'QUERY-STRING PARAMETERS';
    } else if (paramType === 'header') {
      title = 'REQUEST HEADERS';
    } else if (paramType === 'cookie') {
      title = 'COOKIES';
    }

    const tableRows = [];
    for (const param of filteredParams) {
      if (!param.schema) {
        continue;
      }
      const paramSchema = getTypeInfo(param.schema);
      let inputVal = '';
      let paramStyle = 'form';
      let paramExplode = true;
      if (paramType === 'query') {
        if (param.style && 'form spaceDelimited pipeDelimited'.includes(param.style)) {
          paramStyle = param.style;
        }
        if (typeof param.explode === 'boolean') {
          paramExplode = param.explode;
        }
      }

      if (param.example) {
        if (param.example === '0' || param.example === 0) {
          inputVal = '0';
        } else {
          inputVal = param.example;
        }
      } else if (param.examples && param.examples.length > 0) {
        inputVal = param.examples[0];
      } else {
        inputVal = paramSchema.default;
      }
      tableRows.push(html`
      <tr> 
        <td style="width:160px; min-width:100px;">
          <div class="param-name">
            ${param.required ? html`<span style='color:var(--red)'>*</span>` : ''}${param.name}
          </div>
          <div class="param-type">
            ${paramSchema.type === 'array'
              ? `${paramSchema.arrayType}`
              : `${paramSchema.format ? paramSchema.format : paramSchema.type}`
            }
          </div>
        </td>  
        <td style="width:${paramSchema.type === 'array' || paramSchema.type === 'object' ? (this.renderStyle === 'read' ? '300px' : '220px') : '160px'}; min-width:100px;">
          ${paramSchema.type === 'array'
            ? html`
              <tag-input class="request-param" 
                style = "width:160px; background:var(--input-bg);" 
                data-ptype = "${paramType}"
                data-pname = "${param.name}"
                data-param-serialize-style = "${paramStyle}"
                data-param-serialize-explode = "${paramExplode}"
                data-array = "true"
                placeholder= "add-multiple &#x2b90;"
                .value = "${inputVal}"
              >
              </tag-input>`
            : paramSchema.type === 'object'
              ? html`
                <textarea 
                  class = "textarea request-param"
                  data-ptype = "${paramType}-object"
                  data-pname = "${param.name}"
                  data-param-serialize-style = "${paramStyle}"
                  data-param-serialize-explode = "${paramExplode}"
                  spellcheck = "false"
                  style = "resize:vertical; width:100%; height: ${this.renderStyle === 'read' ? '180px' : '120px'};"
                >${inputVal}</textarea>
              `
              : html`
                <input type="text" spellcheck="false" style="width:100%" class="request-param" 
                  data-pname="${param.name}" 
                  data-ptype="${paramType}"  
                  data-array="false"
                  value="${inputVal}"
                />`
            }
        </td>
        <td>
          ${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues
            ? html`
              <div class="param-constraint">
                ${paramSchema.default ? html`<span style="font-weight:bold">Default: </span>${paramSchema.default}<br/>` : ''}
                ${paramSchema.constrain ? html`${paramSchema.constrain}<br/>` : ''}
                ${paramSchema.allowedValues ? html`<span style="font-weight:bold">Allowed: </span>${paramSchema.allowedValues}` : ''}
              </div>`
            : ''
          }
        </td>  
      </tr>
      ${param.description
        ? html`
          <tr>
            <td style="border:none">  </td>
            <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
              <span class="m-markdown-small">${unsafeHTML(marked(param.description || ''))}</span>
            </td>
          </tr>`
        : ''
      }
    `);
    }

    return html`
    <div class="table-title top-gap">${title}</div>
    <div style="display:block; overflow-x:auto; max-width:100%;">
      <table class="m-table" style="width:100%; word-break:break-word;">
        ${tableRows}
      </table>
    </div>`;
  }

  // Request-Body Event Handlers
  onSelectExample(e) {
    this.selectedRequestBodyExample = e.target.value;
  }

  onMimeTypeChange(e) {
    this.selectedRequestBodyType = e.target.value;
    this.selectedRequestBodyExample = '';
  }

  requestBodyTemplate() {
    if (!this.request_body) {
      return '';
    }
    if (Object.keys(this.request_body).length === 0) {
      return '';
    }

    // Variable to store partial HTMLs
    let reqBodyTypeSelectorHtml = '';
    let reqBodyFileInputHtml = '';
    let reqBodyFormHtml = '';
    let reqBodySchemaHtml = '';
    let reqBodyExampleHtml = '';

    const requestBodyTypes = [];
    const content = this.request_body.content;

    for (const mimeType in content) {
      requestBodyTypes.push({
        mimeType,
        schema: content[mimeType].schema,
        example: content[mimeType].example,
        examples: content[mimeType].examples,
      });
      if (!this.selectedRequestBodyType) {
        this.selectedRequestBodyType = mimeType;
      }
    }

    // MIME Type selector
    reqBodyTypeSelectorHtml = requestBodyTypes.length === 1
      ? ''
      : html`
        <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change = '${(e) => this.onMimeTypeChange(e)}'>
          ${requestBodyTypes.map((reqBody) => html`
            <option value = '${reqBody.mimeType}' ?selected = '${reqBody.mimeType === this.selectedRequestBodyType}'>
              ${reqBody.mimeType}
            </option> `)
          }
        </select>
      `;

    // For Loop - Main
    requestBodyTypes.forEach((reqBody) => {
      let schemaAsObj;
      let reqBodyExamples = [];

      if (this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text')) {
        // Generate Example
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyExamples = generateExample(
            reqBody.examples ? reqBody.examples : '',
            reqBody.example ? reqBody.example : '',
            reqBody.schema,
            reqBody.mimeType,
            false,
            'text',
          );
          if (!this.selectedRequestBodyExample) {
            this.selectedRequestBodyExample = (reqBodyExamples.length > 0 ? reqBodyExamples[0].exampleId : '');
          }
          reqBodyExampleHtml = html`
            ${reqBodyExampleHtml}
            <div class = 'example-panel border-top pad-top-8'>
              ${reqBodyExamples.length === 1
                ? ''
                : html`
                  <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change='${(e) => this.onSelectExample(e)}'>
                    ${reqBodyExamples.map((v) => html`<option value="${v.exampleId}" ?selected=${v.exampleId === this.selectedRequestBodyExample} > 
                      ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary ? v.exampleSummary : v.exampleId} 
                    </option>`)}
                  </select>
                `
              }
              ${reqBodyExamples
                .filter((v) => v.exampleId === this.selectedRequestBodyExample)
                .map((v) => html`
                <div class="example ${v.exampleId === this.selectedRequestBodyExample ? 'example-selected' : ''}" data-example = '${v.exampleId}'>
                  ${v.exampleSummary && v.exampleSummary.length > 80 ? html`<div style="padding: 4px 0"> ${v.exampleSummary} </div>` : ''}
                  ${v.exampleDescription ? html`<div class="m-markdown-small" style="padding: 4px 0"> ${unsafeHTML(marked(v.exampleDescription || ''))} </div>` : ''}
                  <textarea 
                    class = "textarea request-body-param ${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}" 
                    spellcheck = "false"
                    data-ptype = "${reqBody.mimeType}" 
                    style="width:100%; resize:vertical;"
                  >${v.exampleValue}</textarea>
                </div>  
              `)}
            </div>
          `;
        }
      } else if (this.selectedRequestBodyType.includes('form-urlencoded') || this.selectedRequestBodyType.includes('form-data')) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          const ex = generateExample(
            reqBody.examples ? reqBody.examples : '',
            reqBody.example ? reqBody.example : '',
            reqBody.schema,
            reqBody.mimeType,
            false,
            'text',
          );
          if (reqBody.schema) {
            reqBodyFormHtml = this.formDataTemplate(reqBody.schema, reqBody.mimeType, (ex[0] ? ex[0].exampleValue : ''));
          }
        }
      } else if (this.selectedRequestBodyType.includes('octet-stream')) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyFileInputHtml = html`
            <div class = "small-font-size bold-text row">
              <input type="file" style="max-width:100%" class="request-body-param-file" data-ptype="${reqBody.mimeType}" spellcheck="false" />
            </div>  
          `;
        }
      }

      // Generate Schema
      if (reqBody.mimeType.includes('json') || reqBody.mimeType.includes('xml') || reqBody.mimeType.includes('text')) {
        schemaAsObj = schemaInObjectNotation(reqBody.schema, {});
        if (this.schemaStyle === 'table') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-table
              class = '${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}'
              style = 'display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};'
              render-style = '${this.renderStyle}'
              .data = '${schemaAsObj}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
            > </schema-table>
          `;
        } else if (this.schemaStyle === 'tree') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-tree
              class = '${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}'
              style = 'display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};'
              render-style = '${this.renderStyle}'
              .data = '${schemaAsObj}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
            > </schema-tree>
          `;
        }
      }
    });

    return html`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required ? html`<span class="mono-font" style='color:var(--red)'>*</span>` : ''} 
          <span style = "font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</span>
          <span style="flex:1"></span>
          ${reqBodyTypeSelectorHtml}
        </div>
        ${this.request_body.description ? html`<div class="m-markdown" style="margin-bottom:12px">${unsafeHTML(marked(this.request_body.description))}</div>` : ''}
        
        ${(this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text'))
          ? html`
            <div class="tab-panel col" style="border-width:0 0 1px 0;">
              <div class="tab-buttons row" @click="${(e) => { if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; } }}">
                <button class="tab-btn ${this.activeSchemaTab === 'model' ? 'active' : ''}"   data-tab = 'model'  >MODEL</button>
                <button class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>EXAMPLE </button>
              </div>
              ${html`<div class="tab-content col" style="display: ${this.activeSchemaTab === 'model' ? 'block' : 'none'}"> ${reqBodySchemaHtml}</div>`}
              ${html`<div class="tab-content col" style="display: ${this.activeSchemaTab === 'model' ? 'none' : 'block'}"> ${reqBodyExampleHtml}</div>`}
            </div>`
          : html`  
            ${reqBodyFileInputHtml}
            ${reqBodyFormHtml}`
        }
      </div>  
    `;
  }

  formDataTemplate(schema, mimeType, exampleValue = '') {
    const formDataTableRows = [];
    if (schema.properties) {
      for (const fieldName in schema.properties) {
        const fieldSchema = schema.properties[fieldName];
        const fieldType = fieldSchema.type;
        const arrayType = fieldSchema.type === 'array' ? fieldSchema.items.type : '';
        formDataTableRows.push(html`
        <tr> 
          <td style="width:160px; min-width:100px;">
            <div class="param-name">${fieldName}</div>
            <div class="param-type">
              ${fieldType === 'array'
                ? `${fieldType} of ${arrayType}`
                : `${fieldType} ${fieldSchema.format ? `\u00a0(${fieldSchema.format})` : ''}`
              }
            </div>
          </td>  
          <td style="width:160px; min-width:100px;">
            ${fieldType === 'array'
              ? fieldSchema.items.format === 'binary'
                ? html`
                <div class="file-input-container col" style='align-items:flex-end;' @click="${(e) => this.onAddRemoveFileInput(e, fieldName, mimeType)}">
                  <div class='input-set row'>
                    <input 
                      type = 'file'
                      style = "width:200px" 
                      data-pname = "${fieldName}" 
                      data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                      data-array = "false" 
                      data-file-array = "true" 
                    />
                    <button class="file-input-remove-btn"> &#x2715; </button>
                  </div>  
                  <button class="m-btn primary file-input-add-btn" style="margin:2px 25px 0 0; padding:2px 6px;">ADD</button>
                </div>  
                `
                : html`
                  <tag-input
                    style = "width:160px; background:var(--input-bg);" 
                    data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                    data-pname = "${fieldName}"
                    data-array = "true"
                    placeholder = "add-multiple &#x2b90;"
                  >
                  </tag-input>
                `
              : html`<input 
                  spellcheck = "false"
                  type = "${fieldSchema.format === 'binary' ? 'file' : fieldSchema.format === 'password' ? 'password' : 'text'}"
                  style = "width:200px" 
                  data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                  data-pname = "${fieldName}" 
                  data-array = "false" 
                />`
              }
          </td>
          <td>
            <div class="param-constraint"></div>
          </td>  
        </tr>
        ${fieldSchema.description
          ? html`
            <tr>
              <td style="border:none"></td>
              <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
                <span class="m-markdown-small">${unsafeHTML(marked(fieldSchema.description || ''))}</span>
              </td>
            </tr>`
          : ''
        }`);
      }
      return html`
        <table style="width:100%;" class="m-table">
          ${formDataTableRows}
        </table>
      `;
    }

    return html`
      <textarea
        class = "textarea dynamic-form-param ${mimeType}" 
        spellcheck = "false"
        data-pname="dynamic-form" 
        data-ptype="${mimeType}"  
        style="width:100%"
      >${exampleValue}</textarea>
      ${schema.description ? html`<span class="m-markdown-small">${unsafeHTML(marked(schema.description))}</span>` : ''}
    `;
  }

  apiResponseTabTemplate() {
    const responseFormat = this.responseHeaders.includes('json') ? 'json' : (this.responseHeaders.includes('html') || this.responseHeaders.includes('xml')) ? 'html' : '';
    return html`
      <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
        <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
        <div style="flex:1"></div>
        <button class="m-btn" style="padding: 6px 0px;width:60px" @click="${this.clearResponseData}">CLEAR</button>
      </div>
      <div class="tab-panel col" style="border-width:0 0 1px 0;">
        <div id="tab_buttons" class="tab-buttons row" @click="${(e) => {
            if (e.target.classList.contains('tab-btn') === false) { return; }
            this.activeResponseTab = e.target.dataset.tab;
        }}">
          <button class="tab-btn ${this.activeResponseTab === 'response' ? 'active' : ''}" data-tab = 'response' > RESPONSE</button>
          <button class="tab-btn ${this.activeResponseTab === 'headers' ? 'active' : ''}"  data-tab = 'headers' > RESPONSE HEADERS</button>
          <button class="tab-btn ${this.activeResponseTab === 'curl' ? 'active' : ''}" data-tab = 'curl'>CURL</button>
        </div>
        ${this.responseIsBlob
          ? html`
            <div class="tab-content col" style="flex:1; display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};">
              <button class="m-btn" @click="${this.downloadResponseBlob}">DOWNLOAD</button>
            </div>`
          : html`
            <div class="tab-content col m-markdown" style="flex:1;display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};" >
              <button class="toolbar-btn" style = "position:absolute; top:12px; right:2px" @click='${(e) => { copyToClipboard(this.responseText, e); }}'> Copy </button>
              <pre style="white-space:pre; max-height:400px; overflow:auto">${responseFormat
                ? html`<code>${unsafeHTML(Prism.highlight(this.responseText, Prism.languages[responseFormat], responseFormat))}</code>`
                : `${this.responseText}`
              }
              </pre>
            </div>`
        }
        <div class="tab-content col m-markdown" style="flex:1;display:${this.activeResponseTab === 'headers' ? 'flex' : 'none'};" >
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:2px" @click='${(e) => { copyToClipboard(this.responseHeaders, e); }}'> Copy </button>
          <pre style="white-space:pre"><code>${unsafeHTML(Prism.highlight(this.responseHeaders, Prism.languages.css, 'css'))}</code></pre>
        </div>
        <div class="tab-content col m-markdown" style="flex:1;display:${this.activeResponseTab === 'curl' ? 'flex' : 'none'};">
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:2px" @click='${(e) => { copyToClipboard(this.curlSyntax.replace(/\\$/, ''), e); }}'> Copy </button>
          <pre style="white-space:pre"><code>${unsafeHTML(Prism.highlight(this.curlSyntax.trim().replace(/\\$/, ''), Prism.languages.shell, 'shell'))}</code></pre>
        </div>
      </div>`;
  }

  apiCallTemplate() {
    let selectServerDropdownHtml = '';

    if (this.servers && this.servers.length > 0) {
      selectServerDropdownHtml = html`
        <select style="min-width:100px;" @change='${(e) => { this.serverUrl = e.target.value; }}'>
          ${this.servers.map((v) => html`<option value = "${v.url}"> ${v.url} - ${v.description} </option>`)}
        </select>
      `;
    }
    const selectedServerHtml = html`
      <div style="display:flex; flex-direction:column;">
        ${selectServerDropdownHtml}
        ${this.serverUrl
          ? html`
            <div style="display:flex; align-items:baseline;">
              <div style="font-weight:bold; padding-right:5px;">API Server</div> 
              <span class = "gray-text"> ${this.serverUrl} </span>
            </div>
          `
          : ''
        }
      </div>  
    `;

    return html`
    <div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);">
      <div style="display:flex; flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${selectedServerHtml}
        </div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${this.api_keys.length > 0
            ? html`<div style="color:var(--blue); overflow:hidden;"> 
                ${this.api_keys.length === 1
                  ? `API Key '${this.api_keys[0].name}' in ${this.api_keys[0].in}`
                  : `${this.api_keys.length} API keys applied`
                } 
              </div>`
            : html`<div style="color:var(--red)">No API key applied</div>`
          }
        </div>
      </div>
      <button class="m-btn primary" @click="${this.onTryClick}">TRY</button>
    </div>
    ${this.responseMessage === '' ? '' : this.apiResponseTabTemplate()}
    `;
  }
  /* eslint-enable indent */

  async onTryClick(e) {
    const me = this;
    const tryBtnEl = e.target;
    let fetchUrl;
    let curlUrl;
    let curl = '';
    let curlHeaders = '';
    let curlData = '';
    let curlForm = '';
    const requestPanelEl = e.target.closest('.request-panel');
    const pathParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll("[data-ptype='query-object']")];
    const headerParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='header']")];
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');

    fetchUrl = me.path;
    const fetchOptions = {
      method: this.method.toUpperCase(),
      headers: {},
    };
    // Generate URL using Path Params
    pathParamEls.map((el) => {
      fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, encodeURIComponent(el.value));
    });

    // Query Params
    if (queryParamEls.length > 0) {
      const urlQueryParam = new URLSearchParams();
      queryParamEls.forEach((el) => {
        if (el.dataset.array === 'false') {
          if (el.value !== '') {
            urlQueryParam.append(el.dataset.pname, el.value);
          }
        } else {
          const paramSerializeStyle = el.dataset.paramSerializeStyle;
          const paramSerializeExplode = el.dataset.paramSerializeExplode;
          const vals = (el.value && Array.isArray(el.value)) ? el.value : [];
          if (paramSerializeStyle === 'spaceDelimited') {
            urlQueryParam.append(el.dataset.pname, vals.join(' '));
          } else if (paramSerializeStyle === 'pipeDelimited') {
            urlQueryParam.append(el.dataset.pname, vals.join('|'));
          } else {
            if (paramSerializeExplode === 'true') { // eslint-disable-line no-lonely-if
              vals.forEach((v) => { urlQueryParam.append(el.dataset.pname, v); });
            } else {
              urlQueryParam.append(el.dataset.pname, vals.join(','));
            }
          }
        }
      });
      fetchUrl = `${fetchUrl}?${urlQueryParam.toString()}`;
    }

    // Query Params (Dynamic - create from JSON)
    if (queryParamObjTypeEls.length > 0) {
      const urlDynQueryParam = new URLSearchParams();
      queryParamObjTypeEls.map((el) => {
        try {
          let queryParamObj = {};
          const paramSerializeStyle = el.dataset.paramSerializeStyle;
          const paramSerializeExplode = el.dataset.paramSerializeExplode;
          queryParamObj = Object.assign(queryParamObj, JSON.parse(el.value.replace(/\s+/g, ' ')));
          for (const key in queryParamObj) {
            if (typeof queryParamObj[key] === 'object') {
              if (Array.isArray(queryParamObj[key])) {
                if (paramSerializeStyle === 'spaceDelimited') {
                  urlDynQueryParam.append(key, queryParamObj[key].join(' '));
                } else if (paramSerializeStyle === 'pipeDelimited') {
                  urlDynQueryParam.append(key, queryParamObj[key].join('|'));
                } else {
                  if (paramSerializeExplode === 'true') { // eslint-disable-line no-lonely-if
                    queryParamObj[key].forEach((v) => {
                      urlDynQueryParam.append(key, v);
                    });
                  } else {
                    urlDynQueryParam.append(key, queryParamObj[key]);
                  }
                }
              }
            } else {
              urlDynQueryParam.append(key, queryParamObj[key]);
            }
          }
          fetchUrl = `${fetchUrl}?${urlDynQueryParam.toString()}`;
        } catch (err) {
          console.log('RapiDoc: unable to parse %s into object', el.value); // eslint-disable-line no-console
        }
      });
    }

    // Add authentication Query-Param if provided
    this.api_keys
      .filter((v) => (v.in === 'query'))
      .forEach((v) => {
        fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${v.name}=${encodeURIComponent(v.finalKeyValue)}`;
      });

    // Final URL for API call
    fetchUrl = `${this.serverUrl.replace(/\/$/, '')}${fetchUrl}`;
    if (fetchUrl.startsWith('http') === false) {
      const url = new URL(fetchUrl, window.location.href);
      curlUrl = url.href;
    } else {
      curlUrl = fetchUrl;
    }
    curl = `curl -X ${this.method.toUpperCase()} "${curlUrl}" \\\n`;

    if (this.accept) {
      fetchOptions.headers.Accept = this.accept;
      curlHeaders += ` -H "Accept: ${this.accept}" \\\n`;
    }

    // Add Authentication Header if provided
    this.api_keys
      .filter((v) => (v.in === 'header'))
      .forEach((v) => {
        fetchOptions.headers[v.name] = v.finalKeyValue;
        curlHeaders += ` -H "${v.name}: ${v.finalKeyValue}" \\\n`;
      });

    // Add Header Params
    headerParamEls.map((el) => {
      if (el.value) {
        fetchOptions.headers[el.dataset.pname] = el.value;
        curlHeaders += ` -H "${el.dataset.pname}: ${el.value}" \\\n`;
      }
    });


    // Request Body Params
    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      if (requestBodyType.includes('form-urlencoded')) {
        // url-encoded Form Params (dynamic) - Parse JSON and generate Params
        const formUrlDynamicTextAreaEl = requestPanelEl.querySelector("[data-ptype='dynamic-form']");
        if (formUrlDynamicTextAreaEl) {
          const val = formUrlDynamicTextAreaEl.value;
          const formUrlDynParams = new URLSearchParams();
          let proceed = true;
          let tmpObj;
          if (val) {
            try {
              tmpObj = JSON.parse(val);
            } catch (err) {
              proceed = false;
              console.warn('RapiDoc: Invalid JSON provided', err); // eslint-disable-line no-console
            }
          } else {
            proceed = false;
          }
          if (proceed) {
            for (const prop in tmpObj) {
              formUrlDynParams.append(prop, JSON.stringify(tmpObj[prop]));
            }
            fetchOptions.body = formUrlDynParams;
            curlData = ` -d ${formUrlDynParams.toString()} \\\n`;
          }
        } else {
          // url-encoded Form Params (regular)
          const formUrlEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']")];
          const formUrlParams = new URLSearchParams();
          formUrlEls
            .filter((v) => (v.type !== 'file'))
            .forEach((el) => {
              if (el.dataset.array === 'false') {
                if (el.value) {
                  formUrlParams.append(el.dataset.pname, el.value);
                }
              } else {
                const vals = (el.value && Array.isArray(el.value)) ? el.value.join(',') : '';
                formUrlParams.append(el.dataset.pname, vals);
              }
            });
          fetchOptions.body = formUrlParams;
          curlData = ` -d ${formUrlParams.toString()} \\\n`;
        }
      } else if (requestBodyType.includes('form-data')) {
        const formDataParams = new FormData();
        const formDataEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-data']")];
        formDataEls.forEach((el) => {
          if (el.dataset.array === 'false') {
            if (el.type === 'file' && el.files[0]) {
              formDataParams.append(el.dataset.pname, el.files[0], el.files[0].name);
              curlForm += ` -F "${el.dataset.pname}=@${el.files[0].name}" \\\n`;
            } else if (el.value) {
              formDataParams.append(el.dataset.pname, el.value);
              curlForm += ` -F "${el.dataset.pname}=${el.value}" \\\n`;
            }
          } else if (el.value && Array.isArray(el.value)) {
            el.value.forEach((v) => {
              curlForm = `${curlForm} -F "${el.dataset.pname}[]=${v}" \\\n`;
            });
            formDataParams.append(el.dataset.pname, el.value.join(','));
          }
        });
        fetchOptions.body = formDataParams;
      } else if (requestBodyType.includes('octet-stream')) {
        const bodyParamFileEl = requestPanelEl.querySelector('.request-body-param-file');
        if (bodyParamFileEl && bodyParamFileEl.files[0]) {
          fetchOptions.body = bodyParamFileEl.files[0];
          curlData = ` --data-binary @${bodyParamFileEl.files[0].name} \\\n`;
        }
      } else if (requestBodyType.includes('json') || requestBodyType.includes('xml') || requestBodyType.includes('text')) {
        const exampleTextAreaEl = requestPanelEl.querySelector('.example-selected textarea');
        if (exampleTextAreaEl && exampleTextAreaEl.value) {
          fetchOptions.body = exampleTextAreaEl.value;
          // curlData = ` -d ${JSON.stringify(exampleTextAreaEl.value.replace(/(\r\n|\n|\r)/gm, '')).replace(/\\"/g, "'")} \\ \n`;
          try {
            curlData = ` -d '${JSON.stringify(JSON.parse(exampleTextAreaEl.value))}' \\\n`;
          } catch (err) {
            curlData = ` -d '${exampleTextAreaEl.value.replace(/(\r\n|\n|\r)/gm, '')}' \\\n`;
          }
        }
      }
      // Common for all request-body
      if (!requestBodyType.includes('form-data')) {
        // For multipart/form-data dont set the content-type to allow creation of browser generated part boundaries
        fetchOptions.headers['Content-Type'] = `${requestBodyType}; charset=utf-8`;
      }
      curlHeaders += ` -H "Content-Type: ${requestBodyType}" \\\n`;
    }

    me.responseUrl = '';
    me.responseHeaders = '';
    // me.responseText    = '';
    me.curlSyntax = '';
    me.responseStatus = 'success';
    me.responseIsBlob = false;

    me.respContentDisposition = '';
    if (me.responseBlobUrl) {
      URL.revokeObjectURL(me.responseBlobUrl);
      me.responseBlobUrl = '';
    }
    me.curlSyntax = `${curl}${curlHeaders}${curlData}${curlForm}`;
    try {
      tryBtnEl.disabled = true;
      // await wait(1000);
      const resp = await fetch(fetchUrl, fetchOptions);
      tryBtnEl.disabled = false;
      me.responseStatus = resp.ok ? 'success' : 'error';
      me.responseMessage = `${resp.statusText}:${resp.status}`;
      me.responseUrl = resp.url;
      resp.headers.forEach((hdrVal, hdr) => {
        me.responseHeaders = `${me.responseHeaders}${hdr.trim()}: ${hdrVal}\n`;
      });
      const contentType = resp.headers.get('content-type');
      if (contentType) {
        if (contentType.includes('json')) {
          resp.json().then((respObj) => {
            me.responseText = JSON.stringify(respObj, null, 2);
          });
        } else if (contentType.includes('octet-stream')) {
          me.responseIsBlob = true;
          const contentDisposition = resp.headers.get('content-disposition');
          me.respContentDisposition = contentDisposition ? contentDisposition.split('filename=')[1] : 'filename';
          resp.blob().then((respBlob) => {
            me.responseBlobUrl = URL.createObjectURL(respBlob);
          });
        } else {
          resp.text().then((respText) => {
            me.responseText = respText;
          });
        }
      } else {
        resp.text().then((respText) => {
          me.responseText = respText;
        });
      }
    } catch (err) {
      tryBtnEl.disabled = false;
      me.responseMessage = `${err.message} (CORS or Network Issue)`;
    }
  }


  onAddRemoveFileInput(e, pname, ptype) {
    if (e.target.tagName.toLowerCase() !== 'button') {
      return;
    }

    if (e.target.classList.contains('file-input-remove-btn')) {
      // Remove File Input Set
      const el = e.target.closest('.input-set');
      el.remove();
      return;
    }
    const el = e.target.closest('.file-input-container');

    // Add File Input Set

    // Container
    const newInputContainerEl = document.createElement('div');
    newInputContainerEl.setAttribute('class', 'input-set row');

    // File Input
    const newInputEl = document.createElement('input');
    newInputEl.type = 'file';
    newInputEl.style = 'width:200px; margin-top:2px;';
    newInputEl.setAttribute('data-pname', pname);
    newInputEl.setAttribute('data-ptype', ptype.includes('form-urlencode') ? 'form-urlencode' : 'form-data');
    newInputEl.setAttribute('data-array', 'false');
    newInputEl.setAttribute('data-file-array', 'true');

    // Remover Button
    const newRemoveBtnEl = document.createElement('button');
    newRemoveBtnEl.setAttribute('class', 'file-input-remove-btn');
    newRemoveBtnEl.innerHTML = '&#x2715;';

    newInputContainerEl.appendChild(newInputEl);
    newInputContainerEl.appendChild(newRemoveBtnEl);
    el.insertBefore(newInputContainerEl, e.target);
    // el.appendChild(newInputContainerEl);
  }

  downloadResponseBlob() {
    if (this.responseBlobUrl) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = this.responseBlobUrl;
      a.download = this.respContentDisposition;
      a.click();
      a.remove();
    }
  }

  clearResponseData() {
    this.responseUrl = '';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseStatus = 'success';
    this.responseMessage = '';
    this.responseIsBlob = false;
    this.respContentDisposition = '';
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
  }

  disconnectedCallback() {
    // Cleanup ObjectURL forthe blob data if this component created one
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
    super.disconnectedCallback();
  }
}

// Register the element with the browser
customElements.define('api-request', ApiRequest);
