import { LitElement, html } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import TableStyles from '@/styles/table-styles';
import FlexStyles from '@/styles/flex-styles';
import InputStyles from '@/styles/input-styles';
import FontStyles from '@/styles/font-styles';
import BorderStyles from '@/styles/border-styles';
import TabStyles from '@/styles/tab-styles';
import {
  schemaInObjectNotation, getTypeInfo, generateExample,
} from '@/utils/common-utils';
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
        font-size:var(--font-size-mono);
      }
      .response-message{
        font-weight:bold;
        text-overflow: ellipsis;
      }
      .response-message.error{
        color:var(--red);
      }
      .response-message.success{
        color:var(--blue);
      }

      @media only screen and (min-width: 768px) {
        .textarea {
          padding:16px;
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
                style = "width:160px; background:var(--input-bg);line-height:13px;" 
                data-ptype = "${paramType}"
                data-pname = "${param.name}"
                data-param-serialize-style = "${paramStyle}"
                data-param-serialize-explode = "${paramExplode}"
                data-array = "true"
                placeholder= "add-multiple\u23ce"
                .value = "${inputVal}"
              >
              </tag-input>`
            : paramSchema.type === 'object'
              ? html`
                <textarea 
                  class = "mono request-param"
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

  requestBodyTemplate() {
    if (!this.request_body) {
      return '';
    }
    if (Object.keys(this.request_body).length === 0) {
      return '';
    }

    let mimeReqCount = 0;
    const shortMimeTypes = {};
    const bodyDescrHtml = this.request_body.description ? html`<div class="m-markdown">${unsafeHTML(marked(this.request_body.description || ''))}</div>` : '';
    let textareaExampleHtml;
    let formDataHtml = '';
    let fileInputHtml = '';
    const formDataTableRows = [];
    let contentDataType = ''; // form-data, body-data, octet-body-data
    const reqSchemaTree = {
      json: '',
      xml: '',
    };

    const content = this.request_body.content;

    for (const mimeReq in content) {
      // do not change shortMimeTypes values, they are referenced in other places
      if (mimeReq.includes('json')) {
        shortMimeTypes[mimeReq] = 'json';
      } else if (mimeReq.includes('xml')) {
        shortMimeTypes[mimeReq] = 'xml';
      } else if (mimeReq.includes('text/plain')) {
        shortMimeTypes[mimeReq] = 'text';
      } else if (mimeReq.includes('form-urlencoded')) {
        shortMimeTypes[mimeReq] = 'form-urlencoded';
      } else if (mimeReq.includes('multipart/form-data')) {
        shortMimeTypes[mimeReq] = 'multipart-form-data';
      } else if (mimeReq.includes('application/octet-stream')) {
        shortMimeTypes[mimeReq] = 'octet-stream'; // TODO: allow users to upload a file
      }

      const mimeReqObj = content[mimeReq];
      let reqExample = '';
      try {
        // Remove Circular references from RequestBody json-schema
        mimeReqObj.schema = JSON.parse(JSON.stringify(mimeReqObj.schema));
      } catch (err) {
        console.error('RapiDoc: Unable to resolve circular refs in schema', mimeReqObj.schema); // eslint-disable-line no-console
        return;
      }
      if (mimeReq.includes('json')) {
        reqSchemaTree.json = schemaInObjectNotation(mimeReqObj.schema, {});
      } else if (mimeReq.includes('xml')) {
        reqSchemaTree.xml = schemaInObjectNotation(mimeReqObj.schema, {});
      }
      reqExample = generateExample(
        mimeReqObj.examples ? mimeReqObj.examples : '',
        mimeReqObj.example ? mimeReqObj.example : '',
        mimeReqObj.schema,
        mimeReq,
        false,
        'text',
      );

      if (mimeReq.includes('octet-stream')) {
        contentDataType = 'octet-body-data';
        fileInputHtml = html`
          <input spellcheck="false" type="file"  style="width:200px" 
              class="request-body-param-file" 
              data-ptype="${mimeReq}" 
          />
        `;
      } else if (mimeReq.includes('json') || mimeReq.includes('xml') || mimeReq.includes('text/plain')) {
        contentDataType = 'body-data';
        textareaExampleHtml = html`
          ${textareaExampleHtml}
          <textarea 
            class = "textarea mono request-body-param ${shortMimeTypes[mimeReq]}" 
            spellcheck = "false"
            data-ptype = "${mimeReq}" 
            style="resize:vertical;display:${shortMimeTypes[mimeReq] === 'json' ? 'block' : 'none'}; "
          >${reqExample[0].exampleValue}</textarea>
        `;
      } else if (mimeReq.includes('form') || mimeReq.includes('multipart-form')) {
        contentDataType = 'form-data';
        if (mimeReqObj.schema.properties) {
          for (const fieldName in mimeReqObj.schema.properties) {
            const fieldSchema = mimeReqObj.schema.properties[fieldName];
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
                    <div class="file-input-container">
                      <div class='input-set'>
                        <input 
                          spellcheck = 'false'
                          type = 'file'
                          style = "width:200px" 
                          class="request-form-param" 
                          data-pname="${fieldName}" 
                          data-ptype="${fieldType}"  
                          data-array="true" 
                        />
                      </div>  
                      <button class="m-btn primary try-btn" style="padding:4px 0px;width:50px; margin-top:5px" @click="${(e) => this.onAddFileInput(e, fieldName, fieldType)}">ADD</button>
                    </div>  
                    `
                    : html`
                      <tag-input class="request-form-param" 
                        style="width:160px; background:var(--input-bg);line-height:13px;" 
                        data-ptype="${fieldType}" 
                        data-pname="${fieldName}"
                        data-array="true"
                        placeholder="add-multiple\u23ce"
                      >
                      </tag-input>
                    `
                  : html`<input 
                      spellcheck="false"
                      type="${fieldSchema.format === 'binary' ? 'file' : fieldSchema.format === 'password' ? 'password' : 'text'}"
                      style="width:160px" 
                      class="request-form-param" 
                      data-pname="${fieldName}" 
                      data-ptype="${fieldType}"  
                      data-array="false" 
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
          formDataHtml = html`
          <form class="${shortMimeTypes[mimeReq]}" onsubmit="event.preventDefault();">
            <table style="width: 100%" class="m-table">
              ${formDataTableRows}
            </table>
          </form>`;
        } else {
          formDataHtml = html`<textarea 
            class = "textarea mono dynamic-form-param ${shortMimeTypes[mimeReq]}" 
            spellcheck = "false"
            data-ptype = "${mimeReq}"
            style="resize:vertical;display:block; width:100%"
          >${reqExample[0].exampleValue}</textarea>
          <span class="m-markdown-small">${unsafeHTML(marked(mimeReqObj.schema.description || ''))}</span>
        `;
        }
      }
      mimeReqCount++;
    }
    return html`
      <div class="table-title top-gap ${contentDataType === 'form-data' ? 'form_data' : 'body_data'} "> 
        ${contentDataType === 'form-data' ? 'FORM' : 'BODY'} DATA ${this.request_body.required ? '(required)' : ''} 
      </div>
      ${bodyDescrHtml}
      ${contentDataType === 'form-data'
        ? html`${formDataHtml}`
        : contentDataType === 'octet-body-data'
          ? html`${fileInputHtml}`
          : html`
            <div class="tab-panel col" style="border-width:0 0 1px 0;">
              <div class="tab-buttons row" @click="${(e) => { if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; } }}">
                <button class="tab-btn ${this.activeSchemaTab === 'model' ? 'active' : ''}"   data-tab = 'model'  >MODEL</button>
                <button class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>EXAMPLE </button>
                <div style="flex:1"> </div>
                <div style="color:var(--light-fg); align-self:center; font-size:var(--font-size-small); margin-top:8px;">
                  ${mimeReqCount === 1
                    ? `${Object.keys(shortMimeTypes)[0]}`
                    : html`
                      ${Object.keys(shortMimeTypes).map((k) => html`
                        ${shortMimeTypes[k] === 'json'
                          ? html`
                            <input type='radio' 
                              name='request_body_type' 
                              value='${shortMimeTypes[k]}' 
                              @change="${this.onMimeTypeChange}" 
                              checked 
                              style='margin:0 0 0 8px'
                            />`
                          : html`
                            <input type='radio' 
                              name='request_body_type' 
                              value='${shortMimeTypes[k]}' 
                              @change="${this.onMimeTypeChange}" 
                              style='margin:0 0 0 8px'
                            />`
                          }
                          ${shortMimeTypes[k]}
                        `)
                      }`
                    }
                </div>
              </div>
              <div class ='tab-content col' style = 'flex:1; display:${this.activeSchemaTab === 'example' ? 'flex' : 'none'};'>
                ${textareaExampleHtml}
              </div>
              <div class="tab-content col" style="flex:1; display:${this.activeSchemaTab === 'model' ? 'flex' : 'none'};">
                ${Object.keys(shortMimeTypes).map((k) => html`
                  ${this.schemaStyle === 'table'
                    ? html`
                      <schema-table
                        class = '${shortMimeTypes[k]}'
                        style = 'display: ${(shortMimeTypes[k] === 'json' ? 'block' : 'none')};'
                        render-style = '${this.renderStyle}'
                        .data = '${reqSchemaTree[shortMimeTypes[k]]}'
                        schema-expand-level = "${this.schemaExpandLevel}"
                        schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      > </schema-table>`
                    : html`
                      <schema-tree 
                        class = '${shortMimeTypes[k]}'
                        style = 'display: ${(shortMimeTypes[k] === 'json' ? 'block' : 'none')};'
                        render-style = '${this.renderStyle}'
                        .data = '${reqSchemaTree[shortMimeTypes[k]]}'
                        schema-expand-level = "${this.schemaExpandLevel}"
                        schema-description-expanded = "${this.schemaDescriptionExpanded}"
                      > </schema-tree>`
                  }
                `)}
              </div>
            </div>
          `
      }`;
  }

  apiCallTemplate() {
    // use default server url, if multiple overrides exists show select
    let selectedServerHtml = this.serverUrl
      ? html`<div style="font-weight:bold;padding-right:5px;">API SERVER: </div> ${this.serverUrl}`
      : html`<div style="font-weight:bold;color:var(--red)">NO API Server Selected</div>`;

    if (this.servers && this.servers.length > 0) {
      // this.serverUrl = this.servers[0].url;
      selectedServerHtml = html`
      <div style="display:flex; flex-direction:column;">
        <select style="min-width:100px;" @change='${(e) => { this.serverUrl = e.target.value; }}'>
          ${this.servers.map((v) => html`<option value="${v.url}">${v.url} - ${v.description}</option>`)}
        </select>
        
        <div style="display:flex; flex-direction:row; align-items:center; margin-top:10px;">
          <div style="font-weight:bold;padding-right:5px;">API SERVER: </div>
          <div> ${this.serverUrl ? this.serverUrl : html`<div style="font-weight:bold;color:var(--red)">NO API Server Selected</div>`}</div>
        </div>
      </div>
      `;
    }

    return html`
    <div style="display:flex; align-items: center; margin:16px 0; font-size:var(--font-size-small);">
      <div style="display:flex; flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${selectedServerHtml}
        </div>
        <div style="display:flex;">
          <div style="padding-right:5px;">Authentication: </div>
          ${this.api_keys.length > 0
            ? html`<div style="font-weight:bold;color:var(--blue); overflow:hidden;"> 
                ${this.api_keys.length === 1
                  ? `API Key '${this.api_keys[0].name}' in ${this.api_keys[0].in}`
                  : `${this.api_keys.length} API keys applied`
                } 
              </div>`
            : html`<div style="font-weight:bold; color:var(--red)">No API key applied</div>`
          }
        </div>
      </div>
      <button class="m-btn primary try-btn" style="padding: 6px 0px;width:60px; align-self:flex-start; margin:1px 0 0 5px;" @click="${this.onTryClick}">TRY</button>
    </div>
    ${this.responseMessage === ''
      ? ''
      : html`
        <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
          <div class="response-message ${this.responseStatus}">Response Status: ${this.responseMessage}</div>
          <div style="flex:1"></div>
          <button class="m-btn" style="padding: 6px 0px;width:60px" @click="${this.clearResponseData}">CLEAR</button>
        </div>
        <div class="tab-panel col" style="border-width:0 0 1px 0;">
          <div id="tab_buttons" class="tab-buttons row" @click="${(e) => { this.activeResponseTab = e.target.dataset.tab; }}">
            <button class="tab-btn ${this.activeResponseTab === 'response' ? 'active' : ''}" data-tab = 'response' > RESPONSE</button>
            <button class="tab-btn ${this.activeResponseTab === 'headers' ? 'active' : ''}"  data-tab = 'headers' > RESPONSE HEADERS</button>
            <button class="tab-btn ${this.activeResponseTab === 'curl' ? 'active' : ''}" data-tab = 'curl'>CURL</button>
          </div>
          <div class="tab-content col" style="flex:1; display:${this.activeResponseTab === 'response' ? 'flex' : 'none'};">
            ${this.responseIsBlob
              ? html`
                <div style="margin:10px 2px"> 
                  <button class="m-btn" @click="${this.downloadResponseBlob}">DOWNLOAD</button>
                </div>`
              : html`
                <pre class="multiline">${this.responseText}</pre>
              `
            }
          </div>
          <div class="tab-content col" style="flex:1;display:${this.activeResponseTab === 'headers' ? 'flex' : 'none'};" >
            <pre class="multiline">${this.responseHeaders}</pre>
          </div>
          <div class="tab-content col" style="flex:1;display:${this.activeResponseTab === 'curl' ? 'flex' : 'none'};">
            <pre class="multiline" style="white-space: normal;">${this.curlSyntax}</pre>
          </div>
        </div>`
      }
      <slot style="display:block"></slot>
    `;
  }
  /* eslint-enable indent */

  static onMimeTypeChange(e) {
    const textareaEls = e.target.closest('.tab-panel').querySelectorAll('textarea.request-body-param');
    const schemaTreeEls = e.target.closest('.tab-panel').querySelectorAll('schema-tree');
    [...textareaEls].map((el) => {
      el.style.display = el.classList.contains(e.target.value) ? 'block' : 'none';
    });

    [...schemaTreeEls].map((el) => {
      el.style.display = el.classList.contains(e.target.value) ? 'block' : 'none';
    });
  }

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
    const pathParamEls = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='query-object']")];
    const headerParamEls = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='header']")];
    const formParamEls = [...requestPanelEl.querySelectorAll('.request-form-param')];
    const dynFormParamEls = [...requestPanelEl.querySelectorAll('.dynamic-form-param')];
    const bodyParamEls = [...requestPanelEl.querySelectorAll('.request-body-param')];
    const bodyParamFileEls = [...requestPanelEl.querySelectorAll('.request-body-param-file')];

    fetchUrl = me.path;
    const fetchOptions = {
      method: this.method.toUpperCase(),
      headers: {},
    };
    // Generate URL using Path Params
    pathParamEls.map((el) => {
      fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, encodeURIComponent(el.value));
    });

    // Collect Query Params
    const urlQueryParam = new URLSearchParams('');
    if (queryParamEls.length > 0) {
      queryParamEls.map((el) => {
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
    }

    // Collect Query Params from Object
    if (queryParamObjTypeEls.length > 0) {
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
                  urlQueryParam.append(key, queryParamObj[key].join(' '));
                } else if (paramSerializeStyle === 'pipeDelimited') {
                  urlQueryParam.append(key, queryParamObj[key].join('|'));
                } else {
                  if (paramSerializeExplode === 'true') { // eslint-disable-line no-lonely-if
                    queryParamObj[key].forEach((v) => {
                      urlQueryParam.append(key, v);
                    });
                  } else {
                    urlQueryParam.append(key, queryParamObj[key]);
                  }
                }
              }
            } else {
              urlQueryParam.append(key, queryParamObj[key]);
            }
          }
        } catch (err) {
          console.log('RapiDoc: unable to parse %s into object', el.value); // eslint-disable-line no-console
        }
      });
    }
    if (urlQueryParam.toString().trim()) {
      fetchUrl = `${fetchUrl}?${urlQueryParam.toString()}`;
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
    curl = `curl -X ${this.method.toUpperCase()} "${curlUrl}" `;

    if (this.accept) {
      fetchOptions.headers.Accept = this.accept;
      curlHeaders += ` -H "Accept: ${this.accept}"`;
    }

    // Submit Header Params
    headerParamEls.map((el) => {
      if (el.value) {
        fetchOptions.headers[el.dataset.pname] = el.value;
        curlHeaders += ` -H "${el.dataset.pname}: ${el.value}"`;
      }
    });
    // Add Authentication Header if provided
    this.api_keys
      .filter((v) => (v.in === 'header'))
      .forEach((v) => {
        fetchOptions.headers[v.name] = v.finalKeyValue;
        curlHeaders += ` -H "${v.name}: ${v.finalKeyValue}"`;
      });

    // Submit Form Params (url-encoded or form-data)
    if (formParamEls.length >= 1) {
      const formEl = requestPanelEl.querySelector('form');
      const formUrlParams = new URLSearchParams();
      const formDataParams = new FormData();
      formParamEls.forEach((el) => {
        if (el.dataset.array === 'false') {
          if (el.type !== 'file') {
            if (el.value !== '') {
              formUrlParams.append(el.dataset.pname, el.value);
              formDataParams.append(el.dataset.pname, el.value);
              curlForm += ` -F "${el.dataset.pname}=${el.value}"`;
            }
          } else if (el.files[0]) {
            formUrlParams.append(el.dataset.pname, el.files[0]);
            formDataParams.append(el.dataset.pname, el.files[0]);
            curlForm = `${curlForm} -F "${el.dataset.pname}=@${el.value}"`;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (el.type === 'file') {
            formUrlParams.append(el.dataset.pname, el.files[0]);
            formDataParams.append(`${el.dataset.pname}[]`, el.files[0]);
            curlForm = `${curlForm} -F "${el.dataset.pname}[]=@${el.value}"`;
          } else {
            const vals = (el.value && Array.isArray(el.value)) ? el.value : [];
            vals.forEach((v) => {
              formUrlParams.append(el.dataset.pname, v);
              formDataParams.append(el.dataset.pname, v);
              curlForm += ` -F "${el.dataset.pname}=${v}"`;
            });
          }
        }
      });

      if (formEl.classList.contains('form-urlencoded')) {
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        curlHeaders += ' -H "Content-Type: application/x-www-form-urlencoded"';
        fetchOptions.body = formUrlParams;
      } else {
        // fetchOptions.headers['Content-Type'] = 'multipart/form-data' // Dont set content type for fetch, coz the browser must auto-generate boundry value too
        curlHeaders += ' -H "Content-Type: multipart/form-data"';
        fetchOptions.body = formDataParams;
      }
    } else if (dynFormParamEls.length === 1) {
      // Submit Dynamic Form Params (url-encoded or form-data)
      const val = dynFormParamEls[0].value;
      const formUrlParams = new URLSearchParams();
      const formDataParams = new FormData();

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
          formUrlParams.append(prop, JSON.stringify(tmpObj[prop]));
          formDataParams.append(prop, JSON.stringify(tmpObj[prop]));
          curlForm += ` -F "${prop}=${JSON.stringify(tmpObj[prop])}"`;
        }
      }
      if (dynFormParamEls[0].classList.contains('form-urlencoded')) {
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        curlHeaders += ' -H "Content-Type: application/x-www-form-urlencoded"';
        fetchOptions.body = formUrlParams;
      } else {
        // fetchOptions.headers['Content-Type'] = 'multipart/form-data' // Dont set content type for fetch, coz the browser must auto-generate boundry value too
        curlHeaders += ' -H "Content-Type: multipart/form-data"';
        fetchOptions.body = formDataParams;
      }
    }

    if (bodyParamFileEls.length >= 1) { // Submit Body Params (file)
      fetchOptions.headers['Content-Type'] = bodyParamFileEls[0].dataset.ptype;
      curlHeaders += ` -H "Content-Type: ${bodyParamFileEls[0].dataset.ptype}"`;
      fetchOptions.body = bodyParamFileEls[0].files[0];
      curlData = ` -d ${bodyParamFileEls[0].files[0]}`;
    } else if (bodyParamEls.length >= 1) { // Submit Body Params (json/xml/text)
      if (bodyParamEls.length === 1) {
        fetchOptions.headers['Content-Type'] = bodyParamEls[0].dataset.ptype;
        curlHeaders += ` -H "Content-Type: ${bodyParamEls[0].dataset.ptype}"`;
        fetchOptions.body = bodyParamEls[0].value;
        curlData = ` -d ${JSON.stringify(bodyParamEls[0].value.replace(/(\r\n|\n|\r)/gm, ''))}`;
      } else {
        const mimeTypeRadioEl = e.target.closest('.request-panel').querySelector("input[name='request_body_type']:checked");
        const selectedBody = mimeTypeRadioEl === null ? 'json' : mimeTypeRadioEl.value;
        let bodyData = '';
        if (selectedBody === 'json') {
          bodyData = requestPanelEl.querySelector('.request-body-param.json').value;
          fetchOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
          curlHeaders += ' -H "Content-Type: application/json"';
        } else if (selectedBody === 'xml') {
          bodyData = requestPanelEl.querySelector('.request-body-param.xml').value;
          fetchOptions.headers['Content-Type'] = 'application/xml; charset=utf-8';
          curlHeaders += ' -H "Content-Type: application/xml"';
        } else if (selectedBody === 'text') {
          bodyData = requestPanelEl.querySelector('.request-body-param.text').value;
          fetchOptions.headers['Content-Type'] = 'text/plain; charset=utf-8';
          curlHeaders += ' -H "Content-Type: text/plain"';
        }
        fetchOptions.body = bodyData;
        curlData = ` -d ${JSON.stringify(bodyData.replace(/(\r\n|\n|\r)/gm, ''))}`;
      }
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
    me.curlSyntax = `${curl} ${curlHeaders} ${curlData} ${curlForm}`;
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

  onAddFileInput(e, pname, ptype) {
    const el = e.currentTarget.closest('.file-input-container').querySelector('.input-set');
    const newInputEl = document.createElement('input');
    newInputEl.type = 'file';
    newInputEl.style = 'width:200px; margin-top:2px;';
    newInputEl.classList.add('request-form-param');
    newInputEl.setAttribute('data-pname', pname);
    newInputEl.setAttribute('data-ptype', ptype);
    newInputEl.setAttribute('data-array', 'true');
    el.appendChild(newInputEl);
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
  }
}
// Register the element with the browser
customElements.define('api-request', ApiRequest);
