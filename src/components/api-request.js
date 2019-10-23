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
        color:var(--error-color);
      }
      .response-message.success{
        color:var(--success-color);
      }

      @media only screen and (min-width: 768px){
        .textarea {
          padding:16px;
        }
      }

    </style>
    <div class="col regular-font request-panel ${this.renderStyle === 'read' ? 'read-mode' : 'view-mode'}">
      <div class="req-res-title">REQUEST</div>
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
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      selectedServer: { type: String, attribute: 'selected-server' },
      method: { type: String },
      path: { type: String },
      parameters: { type: Array },
      request_body: { type: Object },
      parser: { type: Object },
      accept: { type: String },
      responseMessage: { type: String, attribute: false },
      responseText: { type: String, attribute: false },
      responseHeaders: { type: String, attribute: false },
      responseStatus: { type: String, attribute: false },
      responseUrl: { type: String, attribute: false },
      allowTry: { type: String, attribute: 'allow-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      activeResponseTab: { type: String }, // internal tracking of response-tab not exposed as a attribute
    };
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
            ${param.required ? html`<span style='color:orangered'>*</span>` : ''}${param.name}
          </div>
          <div class="param-type">
            ${paramSchema.type === 'array'
              ? `${paramSchema.arrayType}`
              : `${paramSchema.type}${paramSchema.format
                  ? `\u00a0(${paramSchema.format})`
                  : ''
                }`
            }
          </div>
        </td>  
        <td style="width:${paramSchema.type === 'array' || paramSchema.type === 'object' ? '220px' : '160px'}; min-width:100px;">
          ${paramSchema.type === 'array'
            ? html`
              <tag-input class="request-param" 
                style = "width:160px; background:var(--input-bg);line-height:13px;" 
                data-ptype = "${paramType}"
                data-pname = "${param.name}"
                data-array = "true"
                placeholder= "add-multiple\u23ce"
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
                  style = "resize:vertical; width:100%; height:120px;"
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
    const bodyDescrHtml = this.request_body.description ? html`<div class="m-markdown"> ${unsafeHTML(marked(this.request_body.description || ''))}</div>` : '';
    let textareaExampleHtml;
    let formDataHtml = '';
    const formDataTableRows = [];
    let isFormDataPresent = false;
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
      if (mimeReq.includes('json') || mimeReq.includes('xml') || mimeReq.includes('text/plain')) {
        try {
          // Remove Circular references from RequestBody json-schema
          mimeReqObj.schema = JSON.parse(JSON.stringify(mimeReqObj.schema));
        } catch (err) {
          console.error('Unable to resolve circular refs in schema', mimeReqObj.schema); // eslint-disable-line no-console
          return;
        }
        if (mimeReq.includes('json')) {
          reqSchemaTree.json = schemaInObjectNotation(mimeReqObj.schema, {});
        } else if (mimeReq.includes('xml')) {
          reqSchemaTree.xml = schemaInObjectNotation(mimeReqObj.schema, {});
        }
        reqExample = generateExample(
          mimeReqObj.schema ? mimeReqObj.schema.examples : '',
          mimeReqObj.schema ? mimeReqObj.schema.example : '',
          mimeReqObj.schema,
          mimeReq,
          false,
          'text',
        );
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
        isFormDataPresent = true;
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
                ? html`
                  <tag-input class="request-form-param" 
                    style="width:160px; background:var(--input-bg);line-height:13px;" 
                    data-ptype="${fieldType}" 
                    data-pname="${fieldName}"
                    data-array="true"
                    placeholder="add-multiple\u23ce"
                  >
                  </tag-input>`
                : html`<input 
                    spellcheck="false"
                    type="${fieldSchema.format === 'binary' ? 'file' : 'text'}" 
                    style="width:160px" class="request-form-param" 
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
      }
      mimeReqCount++;
    }
    return html`
      <div class="table-title top-gap ${isFormDataPresent ? 'form_data' : 'body_data'} "> 
        ${isFormDataPresent ? 'FORM' : 'BODY'} DATA ${this.request_body.required ? '(required)' : ''} 
      </div>
      ${bodyDescrHtml}
      ${isFormDataPresent
        ? html`${formDataHtml}`
        : html`
        <div class="tab-panel col" style="border-width:0 0 1px 0;">
          <div class="tab-buttons row" @click="${(e) => { this.activeSchemaTab = e.target.dataset.tab; }}">
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
                  > </schema-table>`
                : html`
                  <schema-tree 
                    class = '${shortMimeTypes[k]}'
                    style = 'display: ${(shortMimeTypes[k] === 'json' ? 'block' : 'none')};'
                    render-style = '${this.renderStyle}'
                    .data = '${reqSchemaTree[shortMimeTypes[k]]}'
                  > </schema-tree>`
              }
            `)}
          </div>
        </div>`
      }`;
  }

  apiCallTemplate() {
    return html`
    <div style="display:flex; align-items: center; margin:16px 0; font-size:var(--font-size-small);">
      <div style="display:flex; flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex;flex-direction:row;overflow:hidden;"> <div style="font-weight:bold;padding-right:5px;">API SERVER: </div> 
          ${this.selectedServer
            ? html`${this.selectedServer}`
            : html`<div style="font-weight:bold;color:var(--error-color)">Not Set</div>`
          }
        </div>
        <div style="display:flex;flex-direction:row;overflow:hidden;line-height:16px;color:var(--fg3)"> 
          ${this.apiKeyValue && this.apiKeyName
            ? html`
                <div style="font-weight:bold;color:var(--success-color)">Authentication: &nbsp; </div>
                send <div style="font-family:var(--font-mono); color:var(--fg)"> '${this.apiKeyName}' </div>
                in<div style="font-family:var(--font-mono); color:var(--fg)"> '${this.apiKeyLocation}' </div>
                with value<div style="font-family:var(--font-mono); color:var(--fg)"> '${`${this.apiKeyValue.substring(0, 3)}***`}' </div>
              `
            : html`<div style="color:var(--light-fg)">No Authentication Token provided</div>`
          }
        </div>
      </div>
      <button class="m-btn primary try-btn" style="padding: 6px 0px;width:60px" @click="${this.onTryClick}">TRY</button>
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
    const bodyParamEls = [...requestPanelEl.querySelectorAll('.request-body-param')];

    fetchUrl = me.path;
    const fetchOptions = {
      mode: 'cors',
      method: this.method.toUpperCase(),
      headers: {},
    };
    // Generate URL using Path Params
    pathParamEls.map((el) => {
      fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, el.value);
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
          const vals = el.getValues();
          for (const v of vals) {
            urlQueryParam.append(el.dataset.pname, v);
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
          console.log('unable to parse %s into object', el.value); // eslint-disable-line no-console
        }
      });
    }
    if (urlQueryParam.toString().trim()) {
      fetchUrl = `${fetchUrl}?${urlQueryParam.toString()}`;
    }


    // Add authentication Query-Param if provided
    if (this.apiKeyValue && this.apiKeyName && this.apiKeyLocation === 'query') {
      fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${this.apiKeyName}=${encodeURIComponent(this.apiKeyValue)}`;
    }

    // Final URL for API call
    fetchUrl = `${this.selectedServer.replace(/\/$/, '')}${fetchUrl}`;
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
        curlHeaders += ` -H "${fetchOptions.headers[el.dataset.pname]}: ${el.value}"`;
      }
    });
    // Add Authentication Header if provided
    if (this.apiKeyValue && this.apiKeyName && this.apiKeyLocation === 'header') {
      fetchOptions.headers[this.apiKeyName] = this.apiKeyValue;
      curlHeaders += ` -H "${this.apiKeyName}: ${this.apiKeyValue}"`;
    }

    // Submit Form Params (url-encoded or form-data)
    if (formParamEls.length >= 1) {
      const formEl = requestPanelEl.querySelector('form');
      const formUrlParams = new URLSearchParams();
      const formDataParams = new FormData();
      formParamEls.map((el) => {
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
          const vals = el.getValues();
          for (const v of vals) {
            formUrlParams.append(el.dataset.pname, v);
            formDataParams.append(el.dataset.pname, v);
            curlForm += ` -F "${el.dataset.pname}=${v}"`;
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
    }

    // Submit Body Params (json/xml/text)
    if (bodyParamEls.length >= 1) {
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
