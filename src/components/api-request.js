import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { guard } from 'lit/directives/guard.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import Prism from 'prismjs';
import TableStyles from '~/styles/table-styles';
import FlexStyles from '~/styles/flex-styles';
import InputStyles from '~/styles/input-styles';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import TabStyles from '~/styles/tab-styles';
import PrismStyles from '~/styles/prism-styles';
import PrismLanguagesStyles from '~/styles/prism-languages-styles';
import CustomStyles from '~/styles/custom-styles';
import { copyToClipboard, prettyXml, downloadResource, viewResource } from '~/utils/common-utils';
import { schemaInObjectNotation, getTypeInfo, generateExample, normalizeExamples, getSchemaFromParam, nestExampleIfPresent } from '~/utils/schema-utils';
import '~/components/json-tree';
import '~/components/schema-tree';
import '~/components/tag-input';
import '~/components/breadcrumbs';

import serverTemplate from '~/templates/server-template';
import securitySchemeTemplate from '~/templates/security-scheme-template';
import updateCurl from '~/utils/update-curl';

export default class ApiRequest extends LitElement {
  constructor() {
    super();
    this.resolvedSpec = {};
    this.responseMessage = '';
    this.resultLoad = false;
    this.responseStatus = 'success';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseUrl = '';
    this.curlSyntax = '';
    this.activeResponseTab = 'response'; // allowed values: response, headers, curl
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.activeParameterSchemaTabs = {};
  }

  static get properties() {
    return {
      schemaShortSummary: { type: String, attribute: 'schema-short-summary' },
      serverUrl: { type: String, attribute: 'server-url' },
      resolvedSpec: { type: Object },
      selectedServer: { type: Object },
      servers: { type: Array },
      method: { type: String },
      path: { type: String },
      security: { type: Array },
      parameters: { type: Array },
      request_body: { type: Object },
      api_keys: { type: Array },
      parser: { type: Object },
      accept: { type: String },
      callback: { type: String },
      webhook: { type: String },
      responseMessage: { type: String, attribute: false },
      responseText: { type: String, attribute: false },
      responseHeaders: { type: String, attribute: false },
      responseStatus: { type: String, attribute: false },
      responseUrl: { type: String, attribute: false },
      fillRequestFieldsWithExample: { type: String, attribute: 'fill-request-fields-with-example' },
      useSummaryToListExamples: { type: String, attribute: 'use-summary-to-list-example' },
      allowTry: { type: String, attribute: 'allow-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      activeParameterSchemaTabs: {
        type: Object,
        converter: {
          fromAttribute: (attr) => JSON.parse(attr),
          toAttribute: (prop) => JSON.stringify(prop),
        },
        attribute: 'active-parameter-schema-tabs',
      },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      fetchCredentials: { type: String, attribute: 'fetch-credentials' },

      // properties for internal tracking
      activeResponseTab: { type: String }, // internal tracking of response-tab not exposed as a attribute
      selectedRequestBodyType: { type: String, attribute: 'selected-request-body-type' }, // internal tracking of selected request-body type
      selectedRequestBodyExample: { type: String, attribute: 'selected-request-body-example' }, // internal tracking of selected request-body example
    };
  }

  static get styles() {
    return [
      TableStyles,
      InputStyles,
      FontStyles,
      FlexStyles,
      BorderStyles,
      TabStyles,
      PrismStyles,
      PrismLanguagesStyles,
      css`
        *, *:before, *:after { box-sizing: border-box; }
    
        .read-mode {
          border-top: 1px solid #E7E9EE;
          margin-top: 24px;
        }

        .param-name {
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
          color: #545454; 
          margin-block: 24px 4px;
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .param-name.deprecated { 
          color: #DC5A41;
        }
        .param-type{
          font-size: 14px;
          font-weight: normal;
          line-height: 16px;
          color: #4A4A4A; 
          font-family: var(--font-regular);
        }

        .param-type > span {
          margin-left: 8px;
        }

        .param-constraint{
          min-width:100px;
        }
        .param-constraint:empty{
          display:none;
        }

        .param-description {
          font-size: 12px;
          line-height: 16px;
          color: #4A4A4A;
        }

        .top-gap{margin-top:24px;}

        .textarea {
          min-height:220px; 
          padding:5px;
          resize:vertical;
          direction: ltr;
        }
        .example:first-child {
          margin-top: -9px;
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

        .v-tab-btn {
          font-size: var(--smal-font-size);
          height:24px; 
          border:none; 
          background:none; 
          opacity: 0.3;
          cursor: pointer;
          padding: 4px 8px;
        }
        .v-tab-btn.active {
          font-weight: bold;
          background: var(--bg);
          opacity: 1;
        }

        @media only screen and (min-width: 768px) {
          .textarea {
            padding:8px;
          }
        }

        @media only screen and (max-width: 470px) {
          .hide-in-small-screen {
            display:none;
          }
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    return html`
    <div class="row-api regular-font request-panel ${'read focused'.includes(this.renderStyle) || this.callback === 'true' ? 'read-mode' : 'view-mode'}">
      <div class="row-api-left">
        ${guard([this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('path'))}
        ${guard([this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('query'))}
        ${this.requestBodyTemplate()}
        ${guard([this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('header'))}
        ${guard([this.allowTry, this.parameters, this.activeParameterSchemaTabs], () => this.inputParametersTemplate('cookie'))}
        ${this.allowTry === 'false' ? '' : html`${this.apiCallTemplate()}`}
      </div>
      <div class="row-api-right">
        ${securitySchemeTemplate.call(this)}
        ${serverTemplate.call(this)}
        ${this.apiResponseTabTemplate()}
      </div>  
    </div>
    `;
  }

  updated(changedProperties) {
    // In focused mode after rendering the request component, update the text-areas(which contains examples) using
    // the original values from hidden textareas
    // This is done coz, user may update the dom by editing the textarea's and once the DOM is updated externally change detection wont happen, therefore update the values manually
    if (this.renderStyle === 'focused') {
      if (changedProperties.size === 1 && changedProperties.has('activeSchemaTab')) {
        // dont update example as only tabs is switched
      } else {
        const exampleTextAreaEls = [...this.shadowRoot.querySelectorAll('textarea[data-ptype="form-data"]')];
        exampleTextAreaEls.forEach((el) => {
          const origExampleEl = this.shadowRoot.querySelector(`textarea[data-pname='hidden-${el.dataset.pname}']`);
          if (origExampleEl) {
            el.value = origExampleEl.value;
          }
        });
      }
    }
  }

  /* eslint-disable indent */

  exampleListTemplate(paramName, paramType, exampleList = []) {
    return html`
    ${(exampleList.length > 0
      ? html`<span style="font-weight:bold; font-size:12px;margin-top:10px;">Example: </span>
        ${exampleList.map((v, i) => html`
          ${i === 0 ? '' : '┃'}
          ${paramType === 'array' ? '[' : ''}
          <a part="anchor anchor-param-example" class = "${this.allowTry === 'true' ? '' : 'inactive-link'}"
            data-example-type="${paramType === 'array' ? paramType : 'string'}"
            data-example = "${v.value && Array.isArray(v.value) ? (v.value?.join('~|~')) : (v.value || '')}"
            @click="${(e) => {
              const inputEl = e.target.closest('div').querySelector(`[data-pname="${paramName}"]`);
              if (inputEl) {
                if (e.target.dataset.exampleType === 'array') {
                  inputEl.value = e.target.dataset.example.split('~|~');
                } else {
                  inputEl.value = e.target.dataset.example;
                }

                updateCurl.call(this, inputEl);
                this.requestUpdate();
              }
            }
          }"
          >
          ${this.useSummaryToListExamples === 'true'
            ? v.description || v.summary || (v.value && Array.isArray(v.value) ? (v.value?.join(', ')) : (v.value || ''))
            : v.value && Array.isArray(v.value) ? (v.value?.join(', ')) : (v.value || '')
          }
          </a>
          ${paramType === 'array' ? '] ' : ''}
        `)}
      `
      : ''
    )}`;
  }

  inputParametersTemplate(paramType) {
    const filteredParams = this.parameters ? this.parameters.filter((param) => param.in === paramType) : [];
    if (filteredParams.length === 0) {
      return '';
    }
    let title = '';
    if (paramType === 'path') {
      title = 'Path Params';
    } else if (paramType === 'query') {
      title = 'Query-String Params';
    } else if (paramType === 'header') {
      title = 'Headers';
    } else if (paramType === 'cookie') {
      title = 'Cookies';
    }

    const tableRows = [];
    for (const param of filteredParams) {
      const [declaredParamSchema, serializeStyle, mimeTypeElem] = getSchemaFromParam(param);
      if (!declaredParamSchema) {
        continue; // eslint-disable-line no-continue
      }
      const paramSchema = getTypeInfo(declaredParamSchema);
      if (!paramSchema) {
        continue; // eslint-disable-line no-continue
      }
      const schemaAsObj = schemaInObjectNotation(declaredParamSchema, {});
      // let exampleVal = '';
      // let exampleList = [];
      let paramStyle = 'form';
      let paramExplode = true;
      let paramAllowReserved = false;
      if (paramType === 'query') {
        if (param.style && 'form spaceDelimited pipeDelimited'.includes(param.style)) {
          paramStyle = param.style;
        } else if (serializeStyle) {
          paramStyle = serializeStyle;
        }
        if (typeof param.explode === 'boolean') {
          paramExplode = param.explode;
        }
        if (typeof param.allowReserved === 'boolean') {
          paramAllowReserved = param.allowReserved;
        }
      }

      // openapi 3.1.0 spec based examples (which must be Object(string : { value:any, summary?: string, description?: string})
      const example = normalizeExamples(
        (param.examples
          || nestExampleIfPresent(param.example)
          || nestExampleIfPresent(mimeTypeElem?.example)
          || mimeTypeElem?.examples
          || paramSchema.examples
          || nestExampleIfPresent(paramSchema.example)
        ),
        paramSchema.type,
      );
      if (!example.exampleVal && paramSchema.type === 'object') {
        example.exampleVal = generateExample(
          declaredParamSchema,
          serializeStyle || 'json',
          '',
          '',
          this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
          this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
          true,
          'text',
          false,
        )[0].exampleValue;
      }
      if (!this.resolvedSpec.securitySchemes.some((e) => e.name === param.name)) {
        tableRows.push(html`
              <div class="param-name ${param.deprecated ? 'deprecated' : ''}" >
                ${param.name}

                <div class="param-type">
                  ${paramSchema.type === 'array'
                    ? `${paramSchema.arrayType}`
                    : `${paramSchema.format ? paramSchema.format : paramSchema.type}`
                  }
                  ${param.deprecated ? html`<span style='color:#DC5A41;'>deprecated</span>` : ''}
                  ${param.required ? html`<span style='color:#DC5A41;'>required</span>` : ''}
                </div>
              </div>

              ${this.allowTry === 'true'
                ? html`
                  ${paramSchema.type === 'array'
                    ? html`
                      <tag-input class="request-param" 
                        style = "width:100%" 
                        data-ptype = "${paramType}"
                        data-pname = "${param.name}"
                        data-example = "${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                        data-param-serialize-style = "${paramStyle}"
                        data-param-serialize-explode = "${paramExplode}"
                        data-param-allow-reserved = "${paramAllowReserved}"
                        data-array = "true"
                        placeholder = "add-multiple &#x21a9;"
                        .value = "${Array.isArray(example.exampleVal) ? example.exampleVal : example.exampleVal}"
                      >
                      </tag-input>`
                    : paramSchema.type === 'object'
                      ? html`
                        <div class="tab-panel col" style="border-width:0 0 1px 0; margin-top: 24px;">
                          <div class="tab-buttons row" @click="${(e) => {
                            if (e.target.tagName.toLowerCase() === 'button') {
                              const newState = { ...this.activeParameterSchemaTabs };
                              newState[param.name] = e.target.dataset.tab;
                              this.activeParameterSchemaTabs = newState;
                            }
                          }}">
                            <button class="tab-btn ${this.activeParameterSchemaTabs[param.name] !== 'example' ? 'active' : ''}" data-tab = 'schema'>Parameters</button>
                            <button class="tab-btn ${this.activeParameterSchemaTabs[param.name] === 'example' ? 'active' : ''}" data-tab = 'example'>Example </button>
                          </div>
                          ${this.activeParameterSchemaTabs[param.name] === 'example'
                            ? html`<div class="tab-content col">
                              <textarea 
                                class = "textarea request-param"
                                part = "textarea textarea-param"
                                data-ptype = "${paramType}-object"
                                data-pname = "${param.name}"
                                data-example = "${example.exampleVal}"
                                data-param-serialize-style = "${paramStyle}"
                                data-param-serialize-explode = "${paramExplode}"
                                data-param-allow-reserved = "${paramAllowReserved}"
                                spellcheck = "false"
                                .textContent = "${this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : ''}"
                                style = "resize:vertical; width:100%; height: ${'read focused'.includes(this.renderStyle) ? '180px' : '120px'};"
                              ></textarea>
                            </div>`
                            : html`
                              <div class="tab-content col">            
                                <schema-tree
                                  class = 'json'
                                  style = 'display: block'
                                  .data = '${schemaAsObj}'
                                  schema-expand-level = "${this.schemaExpandLevel}"
                                  schema-description-expanded = "${this.schemaDescriptionExpanded}"
                                  allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
                                  schema-hide-read-only = "${this.schemaHideReadOnly.includes(this.method)}"
                                  schema-hide-write-only = "${this.schemaHideWriteOnly.includes(this.method)}"
                                  exportparts = "btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                anchor:anchor, anchor-param-example:anchor-param-example"
                                > </schema-tree>
                              </div>`
                            }
                        </div>`
                      : html`
                        <input type="${paramSchema.format === 'password' ? 'password' : 'text'}" spellcheck="false" style="width:100%" W
                          data-ptype="${paramType}"
                          data-pname="${param.name}" 
                          data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                          data-param-allow-reserved = "${paramAllowReserved}"
                          data-x-fill-example = "${param['x-fill-example'] || 'yes'}"
                          data-array="false"
                          value="${param.schema.default}"
                          @input = ${(e) => { updateCurl.call(this, e.target ? e.target : e); this.requestUpdate(); }}
                        />`
                    }`
                : ''
              }
              <span class="param-description">${unsafeHTML(marked(param.description || ''))}</span>
              ${this.exampleListTemplate.call(this, param.name, paramSchema.type, example.exampleList)}
            `);
        }
    }

    return html`
    <div class="request-card">
      <div class="request-title-container">
        <div class="request-title">${title}</div>
        <bread-crumbs
          .headers=${[
            {
              title: this.schemaShortSummary,
              link: '.',
            },
            {
              title,
              link: '.',
            },
          ]}
        >
        </bread-crumbs>
      </div>
      <hr style="border-top: 1px solid #E7E9EE;border-bottom:0;margin-block: 24px 0px;">
      <div style="display:block; overflow-x:auto; max-width:100%;padding-inline: 16px;">
        <div style="width:100%; display:flex; flex-direction: column;">
          ${tableRows}
        </div>
      </div>
    </div>`;
  }

  resetRequestBodySelection() {
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.clearResponseData();
  }

  // Request-Body Event Handlers
  onSelectExample(e) {
    this.selectedRequestBodyExample = e.target.value;
    const exampleDropdownEl = e.target;
    window.setTimeout((selectEl) => {
      const readOnlyExampleEl = selectEl.closest('.example-panel').querySelector('.request-body-param');
      const userInputExampleTextareaEl = selectEl.closest('.example-panel').querySelector('.request-body-param-user-input');
      userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
    }, 0, exampleDropdownEl);
  }

  onMimeTypeChange(e) {
    this.selectedRequestBodyType = e.target.value;
    const mimeDropdownEl = e.target;
    this.selectedRequestBodyExample = '';
    window.setTimeout((selectEl) => {
      const readOnlyExampleEl = selectEl.closest('.request-body-container').querySelector('.request-body-param');
      if (readOnlyExampleEl) {
        const userInputExampleTextareaEl = selectEl.closest('.request-body-container').querySelector('.request-body-param-user-input');
        userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
      }
    }, 0, mimeDropdownEl);
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
    const { content } = this.request_body;
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

      if (this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text') || this.selectedRequestBodyType.includes('jose')) {
        // Generate Example
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyExamples = generateExample(
            reqBody.schema,
            reqBody.mimeType,
            reqBody.examples,
            reqBody.example,
            this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
            this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
            'text',
            false,
          );
          if (!this.selectedRequestBodyExample) {
            this.selectedRequestBodyExample = (reqBodyExamples.length > 0 ? reqBodyExamples[0].exampleId : '');
          }
          reqBodyExampleHtml = html`
            ${reqBodyExampleHtml}
            <div class = 'example-panel pad-top-8'>
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
                  <!-- This pre(hidden) is to store the original example value, this will remain unchanged when users switches from one example to another, its is used to populate the editable textarea -->
                  <pre 
                    class = "textarea is-hidden request-body-param ${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}" 
                    spellcheck = "false"
                    data-ptype = "${reqBody.mimeType}" 
                    style="width:100%; resize:vertical; display:none"
                  >${(v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2))}</pre>

                  <!-- this textarea is for user to edit the example -->
                  <textarea 
                    class = "textarea request-body-param-user-input"
                    part = "textarea textarea-param"
                    spellcheck = "false"
                    data-ptype = "${reqBody.mimeType}" 
                    data-example = "${v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2)}"
                    data-example-format = "${v.exampleFormat}"
                    style="width:100%; resize:vertical;"
                    .textContent = "${this.fillRequestFieldsWithExample === 'true' ? (v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2)) : ''}"
                    @input = ${(e) => { updateCurl.call(this, e.target ? e.target : e); this.requestUpdate(); }}
                  ></textarea>
                </div>  
              `)}

            </div>
          `;
        }
      } else if (this.selectedRequestBodyType.includes('form-urlencoded') || this.selectedRequestBodyType.includes('form-data')) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          const ex = generateExample(
            reqBody.schema,
            reqBody.mimeType,
            reqBody.examples,
            reqBody.example,
            this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
            this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
            'text',
            false,
          );
          if (reqBody.schema) {
            reqBodyFormHtml = this.formDataTemplate(reqBody.schema, reqBody.mimeType, (ex[0] ? ex[0].exampleValue : ''));
          }
        }
      } else if ((/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType))) {
        if (reqBody.mimeType === this.selectedRequestBodyType) {
          reqBodyFileInputHtml = html`
            <div class = "small-font-size bold-text row">
              <input type="file" part="file-input" style="max-width:100%" class="request-body-param-file" data-ptype="${reqBody.mimeType}" spellcheck="false" />
            </div>  
          `;
        }
      }

      // Generate Schema
      if (reqBody.mimeType.includes('json') || reqBody.mimeType.includes('xml') || reqBody.mimeType.includes('text') || this.selectedRequestBodyType.includes('jose')) {
        schemaAsObj = schemaInObjectNotation(reqBody.schema, {});
        if (this.schemaStyle === 'table') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-table
              class = '${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}'
              style = 'display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};'
              .data = '${schemaAsObj}'
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-table>
          `;
        } else if (this.schemaStyle === 'tree') {
          reqBodySchemaHtml = html`
            ${reqBodySchemaHtml}
            <schema-tree
              class = "${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}"
              style = "display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};"
              .data = "${schemaAsObj}"
              schema-expand-level = "${this.schemaExpandLevel}"
              schema-description-expanded = "${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
              schema-hide-read-only = "${this.schemaHideReadOnly}"
              schema-hide-write-only = "${this.schemaHideWriteOnly}"
              exportparts = "schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            > </schema-tree>
          `;
        }
      }
    });

    return html`
      <div class='request-body-container' data-selected-request-body-type="${this.selectedRequestBodyType}">
        <div class="table-title top-gap row">
          REQUEST BODY ${this.request_body.required ? html`<span class="mono-font" style='color:var(--red)'>*</span>` : ''} 
          <code style = "font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</code>
          <span style="flex:1"></span>
          ${reqBodyTypeSelectorHtml}
        </div>
        ${this.request_body.description ? html`<div class="m-markdown" style="margin-bottom:12px">${unsafeHTML(marked(this.request_body.description))}</div>` : ''}
        
        ${(this.selectedRequestBodyType.includes('json') || this.selectedRequestBodyType.includes('xml') || this.selectedRequestBodyType.includes('text') || this.selectedRequestBodyType.includes('jose'))
          ? html`
            <div class="tab-panel col" style="border-width:0 0 1px 0; margin-top: 24px;">
              <div class="tab-buttons row" @click="${(e) => { if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; } }}">
                <button class="tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab = 'schema'>Parameters</button>
                <button class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>Example</button>
              </div>
              ${this.activeSchemaTab === 'example'
                ? html`<div class="tab-content col"> ${reqBodyExampleHtml}</div>`
                : html`<div class="tab-content col"> ${reqBodySchemaHtml}</div>`
              }
            </div>`
          : html`  
            ${reqBodyFileInputHtml}
            ${reqBodyFormHtml}`
        }
      </div>  
    `;
  }

  formDataParamAsObjectTemplate(fieldName, fieldSchema, mimeType) {
    // This template is used when form-data param should be send as a object (application/json, application/xml)
    const formdataPartSchema = schemaInObjectNotation(fieldSchema, {});
    const formdataPartExample = generateExample(
      fieldSchema,
      'json',
      fieldSchema.examples,
      fieldSchema.example,
      this.callback === 'true' || this.webhook === 'true' ? true : false, // eslint-disable-line no-unneeded-ternary
      this.callback === 'true' || this.webhook === 'true' ? false : true, // eslint-disable-line no-unneeded-ternary
      'text',
      false,
    );

    return html`
      <div class="tab-panel row" style="min-height:220px; border-left: 6px solid var(--light-border-color); align-items: stretch;">
        <div style="width:24px; background-color:var(--light-border-color)">
          <div class="row" style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;" @click="${(e) => {
          if (e.target.classList.contains('v-tab-btn')) {
            const { tab } = e.target.dataset;
            if (tab) {
              const tabPanelEl = e.target.closest('.tab-panel');
              const selectedTabBtnEl = tabPanelEl.querySelector(`.v-tab-btn[data-tab="${tab}"]`);
              const otherTabBtnEl = [...tabPanelEl.querySelectorAll(`.v-tab-btn:not([data-tab="${tab}"])`)];
              const selectedTabContentEl = tabPanelEl.querySelector(`.tab-content[data-tab="${tab}"]`);
              const otherTabContentEl = [...tabPanelEl.querySelectorAll(`.tab-content:not([data-tab="${tab}"])`)];
              selectedTabBtnEl.classList.add('active');
              selectedTabContentEl.style.display = 'block';
              otherTabBtnEl.forEach((el) => { el.classList.remove('active'); });
              otherTabContentEl.forEach((el) => { el.style.display = 'none'; });
            }
          }
          if (e.target.tagName.toLowerCase() === 'button') { this.activeSchemaTab = e.target.dataset.tab; }
        }}">
          <button class="v-tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab = 'schema'>Parameters</button>
          <button class="v-tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example'>Example</button>
        </div>
      </div>
      ${html`
        <div class="tab-content col" data-tab = 'example' style="display:${this.activeSchemaTab === 'example' ? 'block' : 'none'}; padding-left:5px; width:100%"> 
          <textarea 
            class = "textarea"
            part = "textarea textarea-param"
            style = "width:100%; border:none; resize:vertical;" 
            data-array = "false" 
            data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
            data-pname = "${fieldName}"
            data-example = "${formdataPartExample[0]?.exampleValue || ''}"
            .textContent = "${this.fillRequestFieldsWithExample === 'true' ? formdataPartExample[0].exampleValue : ''}"
            spellcheck = "false"
          ></textarea>
          <!-- This textarea(hidden) is to store the original example value, in focused mode on navbar change it is used to update the example text -->
          <textarea data-pname = "hidden-${fieldName}" data-ptype = "${mimeType.includes('form-urlencode') ? 'hidden-form-urlencode' : 'hidden-form-data'}" class="is-hidden" style="display:none">${formdataPartExample[0].exampleValue}</textarea>
        </div>`
      }
      ${html`
        <div class="tab-content col" data-tab = 'schema' style="display:${this.activeSchemaTab !== 'example' ? 'block' : 'none'}; padding-left:5px; width:100%;"> 
          <schema-tree
            .data = '${formdataPartSchema}'
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle = "${this.allowSchemaDescriptionExpandToggle}",
          > </schema-tree>
        </div>`
      }
      </div>
    `;
  }

  formDataTemplate(schema, mimeType, exampleValue = '') {
    const formDataTableRows = [];
    if (schema.properties) {
      for (const fieldName in schema.properties) {
        const fieldSchema = schema.properties[fieldName];
        if (fieldSchema.readOnly) {
          continue;
        }
        const fieldExamples = fieldSchema.examples || fieldSchema.example || '';
        const fieldType = fieldSchema.type;
        const paramSchema = getTypeInfo(fieldSchema);
        const labelColWidth = 'read focused'.includes(this.renderStyle) ? '200px' : '160px';
        const example = normalizeExamples((paramSchema.examples || paramSchema.example), paramSchema.type);
        formDataTableRows.push(html`
        <tr title="${fieldSchema.deprecated ? 'Deprecated' : ''}"> 
          <td style="width:${labelColWidth}; min-width:100px;">
            <div class="param-name ${fieldSchema.deprecated ? 'deprecated' : ''}">
              ${fieldName}${(schema.required?.includes(fieldName) || fieldSchema.required) ? html`<span style='color:var(--red);'>*</span>` : ''}
            </div>
            <div class="param-type">${paramSchema.type}</div>
          </td>  
          <td 
            style="${fieldType === 'object' ? 'width:100%; padding:0;' : this.allowTry === 'true' ? '' : 'display:none;'} min-width:100px;" 
            colspan="${fieldType === 'object' ? 2 : 1}">
            ${fieldType === 'array'
              ? fieldSchema.items?.format === 'binary'
                ? html`
                <div class="file-input-container col" style='align-items:flex-end;' @click="${(e) => this.onAddRemoveFileInput(e, fieldName, mimeType)}">
                  <div class='input-set row'>
                    <input 
                      type = "file"
                      part = "file-input"
                      style = "width:100%" 
                      data-pname = "${fieldName}" 
                      data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                      data-array = "false" 
                      data-file-array = "true" 
                    />
                    <button class="file-input-remove-btn"> &#x2715; </button>
                  </div>  
                  <button class="m-btn primary file-input-add-btn" part="btn btn-fill" style="margin:2px 25px 0 0; padding:2px 6px;">ADD</button>
                </div>  
                `
                : html`
                  <tag-input
                    style = "width:100%" 
                    data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                    data-pname = "${fieldName}"
                    data-example = "${Array.isArray(fieldExamples) ? fieldExamples.join('~|~') : fieldExamples}"
                    data-array = "true"
                    placeholder = "add-multiple &#x21a9;"
                    .value = "${Array.isArray(fieldExamples) ? Array.isArray(fieldExamples[0]) ? fieldExamples[0] : [fieldExamples[0]] : [fieldExamples]}"
                  >
                  </tag-input>
                `
              : html`
                ${fieldType === 'object'
                  ? this.formDataParamAsObjectTemplate.call(this, fieldName, fieldSchema, mimeType)
                  : html`
                    ${this.allowTry === 'true'
                      ? html`<input
                          .value = "${this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : ''}"
                          spellcheck = "false"
                          type = "${fieldSchema.format === 'binary' ? 'file' : fieldSchema.format === 'password' ? 'password' : 'text'}"
                          part = "textbox textbox-param"
                          style = "width:100%"
                          data-ptype = "${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                          data-pname = "${fieldName}"
                          data-example = "${Array.isArray(fieldExamples) ? fieldExamples[0] : fieldExamples}"
                          data-array = "false"
                          @input = ${(e) => { updateCurl.call(this, e.target ? e.target : e); this.requestUpdate(); }}
                        />`
                      : ''
                    }
                    `
                  }`
              }
          </td>
          ${fieldType === 'object'
            ? ''
            : html`
              <td>
                ${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern
                  ? html`
                    <div class="param-constraint">
                      ${paramSchema.default ? html`<span style="font-weight:bold">Default: </span>${paramSchema.default}<br/>` : ''}
                      ${paramSchema.pattern ? html`<span style="font-weight:bold">Pattern: </span>${paramSchema.pattern}<br/>` : ''}
                      ${paramSchema.constrain ? html`${paramSchema.constrain}<br/>` : ''}
                      ${paramSchema.allowedValues && paramSchema.allowedValues.split('┃').map((v, i) => html`
                        ${i > 0 ? '┃' : html`<span style="font-weight:bold">Allowed: </span>`}
                        ${html`
                          <a part="anchor anchor-param-constraint" class = "${this.allowTry === 'true' ? '' : 'inactive-link'}"
                            data-type="${paramSchema.type === 'array' ? paramSchema.type : 'string'}"
                            data-enum="${v.trim()}"
                            @click="${(e) => {
                              const inputEl = e.target.closest('div').querySelector(`[data-pname="${fieldName}"]`);
                              if (inputEl) {
                                if (e.target.dataset.type === 'array') {
                                  inputEl.value = [e.target.dataset.enum];
                                } else {
                                  inputEl.value = e.target.dataset.enum;
                                }

                                updateCurl.call(this, inputEl);
                                this.requestUpdate();
                              }
                            }}"
                          > 
                            ${v} 
                          </a>`
                        }`)
                      }
                    </div>`
                  : ''
                }
              </td>`
          }
        </tr>
        ${fieldType === 'object'
          ? ''
          : html`
            <tr>
              <td style="border:none"> </td>
              <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;"> 
                <span class="m-markdown-small">${unsafeHTML(marked(fieldSchema.description || ''))}</span>
                ${this.exampleListTemplate.call(this, fieldName, paramSchema.type, example.exampleList)}
              </td>
            </tr>
          `
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
        part = "textarea textarea-param"
        spellcheck = "false"
        data-pname="dynamic-form" 
        data-ptype="${mimeType}"
        .textContent = "${exampleValue}"
        style="width:100%"
      ></textarea>
      ${schema.description ? html`<span class="m-markdown-small">${unsafeHTML(marked(schema.description))}</span>` : ''}
    `;
  }

  apiResponseTabTemplate() {
    const responseFormat = this.responseHeaders.includes('json') ? 'json' : (this.responseHeaders.includes('html') || this.responseHeaders.includes('xml')) ? 'html' : '';

    Prism.languages.shell = {
      ...Prism.languages.shell,
      method: /\b(GET|POST|PUT|DELETE)\b/g,
    };

    Prism.plugins.customClass.map((className, language) => `${language}-${className}`);
    return html`
      <!--
        <div class="row" style="font-size:var(--font-size-small); margin:5px 0">
          <div style="flex:1"></div>
          <button class="m-btn" part="btn btn-outline btn-clear-response" @click="${this.clearResponseData}">CLEAR RESPONSE</button>
        </div>
      -->
      <div class="tab-panel col" style="border-top: 1px solid #E7E9EE; border-bottom: 1px solid #E7E9EE; margin-top: 24px;">
        <div class="tab-content col m-markdown" style="flex:1; display:flex; margin: 0;">
          <button  class="toolbar-btn" style = "position:absolute; top:12px; right:8px" @click='${(e) => { copyToClipboard(this.curlSyntax.replace(/\\$/, ''), e); }}' part="btn btn-fill"> Copy </button>
          <pre class="code-container" style="border: none;"><code>${unsafeHTML(Prism.highlight(this.curlSyntax.trim().replace(/\\$/, ''), Prism.languages.shell, 'shell'))}</code></pre>
        </div>
        <div style="background: #F8F7FC; padding-inline: 32px;padding-block: 16px">
          <div class="row" style="width:100%; height:20px; background:#E7E9EE; border-radius:2px;padding-inline:4px;margin-bottom:4px">
            <div style="width:8px;height:8px;border-radius:50%;${this.responseBlobUrl || this.responseText ? 'border: 1px solid #79A479;background: #E6F2E6;' : 'border: 1px solid #DC4C43;background: #F0E6E4;'}"></div>
            <div style="margin-left:4px; color:#4A596B; font-size:12px; font-weight:500;">${this.responseMessage}</div>
          </div>
          ${this.responseIsBlob
            ? html`
              <div class="tab-content col" style="flex:1; display:flex;">
                <button class="m-btn thin-border mar-top-8" style="width:135px" @click='${(e) => { downloadResource(this.responseBlobUrl, this.respContentDisposition, e); }}' part="btn btn-outline">
                  DOWNLOAD
                </button>
                ${this.responseBlobType === 'view'
                  ? html`<button class="m-btn thin-border mar-top-8" style="width:135px"  @click='${(e) => { viewResource(this.responseBlobUrl, e); }}' part="btn btn-outline">VIEW (NEW TAB)</button>`
                  : ''
                }
              </div>`
            : html`
              ${responseFormat || this.responseText
                ? html`<div class="tab-content col m-markdown" style="flex:1; display:flex;" >
                <button class="toolbar-btn" style="position:absolute; top:12px; right:8px" @click='${(e) => { copyToClipboard(this.responseText, e); }}' part="btn btn-fill"> Copy </button>
                <pre style="white-space:pre; min-height:50px; height:auto; resize:vertical; overflow:auto">
                ${responseFormat
                  ? html`<code>${unsafeHTML(Prism.highlight(this.responseText, Prism.languages[responseFormat], responseFormat))}</code>`
                  : `${this.responseText}`
                }</pre>
              </div>`
                : ''
              } 
              `
          }
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

    if (!this.resultLoad) {
      this.updateComplete.then(() => { this.onTryClick(this.renderRoot.host.shadowRoot.children[0]); });
      this.resultLoad = true;
    } else {
      const el = this.renderRoot.host.shadowRoot.children[0];
      updateCurl.call(this, el.target ? el.target : el);
    }

    return html`
    <div style="display:flex; align-items:flex-end; margin:16px 0; font-size:var(--font-size-small);">
      <div class="hide-in-small-screen" style="flex-direction:column; margin:0; width:calc(100% - 60px);">
        <div style="display:flex; flex-direction:row; align-items:center; overflow:hidden;"> 
          ${selectedServerHtml}
        </div>
        <div style="display:flex;">
          <div style="font-weight:bold; padding-right:5px;">Authentication</div>
          ${this.security?.length > 0
            ? html`
              ${this.api_keys.length > 0
                ? html`<div style="color:var(--blue); overflow:hidden;"> 
                    ${this.api_keys.length === 1
                      ? `${this.api_keys[0]?.typeDisplay} in ${this.api_keys[0].in}`
                      : `${this.api_keys.length} API keys applied`
                    } 
                  </div>`
                : html`<div class="gray-text">Required  <span style="color:var(--red)">(None Applied)</span>`
              }`
            : html`<span class="gray-text"> Not Required </span>`
          }
        </div>
      </div>
      <!-- ${
        this.parameters.length > 0 || this.request_body
          ? html`
            <button class="m-btn thin-border" part="btn btn-outline btn-fill" style="margin-right:5px;" @click="${this.onFillRequestData}" title="Fills with example data (if provided)">
              FILL EXAMPLE
            </button>
            <button class="m-btn thin-border" part="btn btn-outline btn-clear" style="margin-right:5px;" @click="${this.onClearRequestData}">
              CLEAR
            </button>`
          : ''
      } 
      <button class="m-btn primary thin-border" part="btn btn-try" @click="${this.onTryClick}">TRY</button>
      -->
    </div>
    `;
  }
  /* eslint-enable indent */

  async onFillRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      if (el.dataset.example) {
        if (el.tagName.toUpperCase() === 'TAG-INPUT') {
          el.value = el.dataset.example.split('~|~');
        } else {
          el.value = el.dataset.example;
        }
      }
    });
  }

  async onClearRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => { el.value = ''; });
  }

  async onTryClick(e) {
    const tryBtnEl = e.target ? e.target : e;

    const { fetchUrl, fetchOptions, reqHeaders } = updateCurl.call(this, tryBtnEl);
    const encodedUrl = encodeURIComponent(fetchUrl);

    this.responseUrl = '';
    this.responseHeaders = [];
    this.responseStatus = 'success';
    this.responseIsBlob = false;

    this.respContentDisposition = '';
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }

    if (this.fetchCredentials) {
      fetchOptions.credentials = this.fetchCredentials;
    }
    const controller = new AbortController();
    const { signal } = controller;
    fetchOptions.headers = reqHeaders;
    const fetchRequest = new Request(`/api/proxy/${encodedUrl}`, fetchOptions);
    this.dispatchEvent(new CustomEvent('before-try', {
      bubbles: true,
      composed: true,
      detail: {
        request: fetchRequest,
        controller,
      },
    }));

    let fetchResponse;
    let responseClone;
    try {
      let respBlob;
      let respJson;
      let respText;
      tryBtnEl.disabled = true;
      const startTime = performance.now();
      fetchResponse = await fetch(fetchRequest, { signal });
      const endTime = performance.now();
      responseClone = fetchResponse.clone(); // create a response clone to allow reading response body again (response.json, response.text etc)
      tryBtnEl.disabled = false;
      this.responseMessage = html`${fetchResponse.statusText ? `${fetchResponse.statusText}:${fetchResponse.status}` : fetchResponse.status} <div style="color:var(--light-fg)"> Took ${Math.round(endTime - startTime)} milliseconds </div>`;
      this.responseUrl = fetchResponse.url;
      const respHeadersObj = {};
      fetchResponse.headers.forEach((hdrVal, hdr) => {
        respHeadersObj[hdr] = hdrVal;
        this.responseHeaders = `${this.responseHeaders}${hdr}: ${hdrVal}\n`;
      });
      const contentType = fetchResponse.headers.get('content-type');
      const respEmpty = (await fetchResponse.clone().text()).length === 0;
      if (respEmpty) {
        this.responseText = '';
      } else if (contentType) {
        if (contentType.includes('json')) {
          if ((/charset=[^"']+/).test(contentType)) {
            const encoding = contentType.split('charset=')[1];
            const buffer = await fetchResponse.arrayBuffer();
            try {
              respText = new TextDecoder(encoding).decode(buffer);
            } catch {
              respText = new TextDecoder('utf-8').decode(buffer);
            }
            try {
              respJson = JSON.parse(respText);
              this.responseText = JSON.stringify(respJson, null, 2);
            } catch {
              this.responseText = respText;
            }
          } else {
            respJson = await fetchResponse.json();
            this.responseText = JSON.stringify(respJson, null, 2);
          }
        // eslint-disable-next-line no-useless-escape
        } else if (/^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(contentType)) {
          this.responseIsBlob = true;
          this.responseBlobType = 'download';
        } else if (/^audio|^image|^video/.test(contentType)) {
          this.responseIsBlob = true;
          this.responseBlobType = 'view';
        } else {
          respText = await fetchResponse.text();
          if (contentType.includes('xml')) {
            this.responseText = prettyXml(respText);
          }
          this.responseText = respText;
        }
        if (this.responseIsBlob) {
          const contentDisposition = fetchResponse.headers.get('content-disposition');
          this.respContentDisposition = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"|'/g, '') : 'filename';
          respBlob = await fetchResponse.blob();
          this.responseBlobUrl = URL.createObjectURL(respBlob);
        }
      } else {
        respText = await fetchResponse.text();
        this.responseText = respText;
      }
      this.dispatchEvent(new CustomEvent('after-try', {
        bubbles: true,
        composed: true,
        detail: {
          request: fetchRequest,
          response: responseClone,
          responseHeaders: respHeadersObj,
          responseBody: respJson || respText || respBlob,
          responseStatus: responseClone.ok,
        },
      }));
    } catch (err) {
      tryBtnEl.disabled = false;
      if (err.name === 'AbortError') {
        this.dispatchEvent(new CustomEvent('request-aborted', {
          bubbles: true,
          composed: true,
          detail: {
            err,
            request: fetchRequest,
          },
        }));
        this.responseMessage = 'Request Aborted';
      } else {
        this.dispatchEvent(new CustomEvent('after-try', {
          bubbles: true,
          composed: true,
          detail: {
            err,
            request: fetchRequest,
          },
        }));
        this.responseMessage = `${err.message} (CORS or Network Issue)`;
      }
    }
    this.requestUpdate();
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

  clearResponseData() {
    this.responseUrl = '';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseStatus = 'success';
    this.responseMessage = '';
    this.responseIsBlob = false;
    this.responseBlobType = '';
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
