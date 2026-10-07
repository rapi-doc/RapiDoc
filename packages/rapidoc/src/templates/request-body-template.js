/**
 * Renders request body form inputs, JSON/XML textareas, MIME type dropdown, and schema preview panels for <api-request>.
 */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { live } from 'lit/directives/live.js';
import { repeat } from 'lit/directives/repeat.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';
import { schemaToAST, getTypeInfo, isBinaryFileField, generateExample, normalizeExamples, standardizeExample } from '~/utils/schema-utils';
import '~/components/schema-tree';
import '~/components/schema-table';
import '~/components/tag-input';
import { exampleListTemplate } from '~/templates/request-params-template';

export function formDataParamAsObjectTemplate(fieldName, fieldSchema, mimeType) {
  // This template is used when form-data param should be send as a object (application/json, application/xml)
  const formdataPartSchema = schemaToAST(fieldSchema);
  const formdataPartExample = generateExample(
    fieldSchema,
    'json',
    standardizeExample(fieldSchema.examples),
    standardizeExample(fieldSchema.example),
    this.callback === 'true' || this.webhook === 'true' ? true : false,
    this.callback === 'true' || this.webhook === 'true' ? false : true,
    'text',
    false
  );

  return html`
    <div part="tab-panel" class="tab-panel row" style="min-height:220px; border-left: 6px solid var(--border); align-items: stretch;">
      <div style="width:24px; background:var(--border)">
        <div
          class="row"
          style="flex-direction:row-reverse; width:160px; height:24px; transform:rotate(270deg) translateX(-160px); transform-origin:top left; display:block;"
          @click="${(e) => {
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
                otherTabBtnEl.forEach((el) => {
                  el.classList.remove('active');
                });
                otherTabContentEl.forEach((el) => {
                  el.style.display = 'none';
                });
              }
            }
            if (e.target.tagName.toLowerCase() === 'button') {
              this.activeSchemaTab = e.target.dataset.tab;
            }
          }}"
        >
          <button class="v-tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab="example">EXAMPLE</button>
          <button class="v-tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab="schema">SCHEMA</button>
        </div>
      </div>
      ${html` <div
        class="tab-content col"
        data-tab="example"
        style="display:${this.activeSchemaTab === 'example' ? 'block' : 'none'}; padding-left:5px; width:100%"
      >
        <textarea
          class="textarea"
          part="textarea textarea-param"
          style="width:100%; border:none; resize:vertical;"
          data-array="false"
          data-ptype="${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
          data-pname="${fieldName}"
          data-example="${formdataPartExample[0]?.exampleValue || ''}"
          .value="${live(this.fillRequestFieldsWithExample === 'true' ? formdataPartExample[0]?.exampleValue || '' : '')}"
          spellcheck="false"
        ></textarea>
      </div>`}
      ${html` <div
        class="tab-content col"
        data-tab="schema"
        style="display:${this.activeSchemaTab !== 'example' ? 'block' : 'none'}; padding-left:5px; width:100%;"
      >
        <schema-tree
          .data="${formdataPartSchema}"
          schema-expand-level="${this.schemaExpandLevel}"
          schema-description-expanded="${this.schemaDescriptionExpanded}"
          allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
        >
        </schema-tree>
      </div>`}
    </div>
  `;
}

export function formDataTemplate(schema, mimeType, exampleValue = '') {
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
      const example = normalizeExamples(paramSchema.examples || paramSchema.example, paramSchema.type);
      formDataTableRows.push(
        html` <tr title="${fieldSchema.deprecated ? 'Deprecated' : ''}">
            <td style="width:${labelColWidth}; min-width:100px;">
              <div class="param-name ${fieldSchema.deprecated ? 'deprecated' : ''}">
                ${fieldName}${
                  schema.required?.includes(fieldName) || fieldSchema.required ? html`<span style="color:var(--red);">*</span>` : ''
                }
              </div>
              <div class="param-type">
                ${
                  paramSchema.type === 'array' || paramSchema.type.split('┃').includes('array')
                    ? `${paramSchema.arrayType || paramSchema.type}`
                    : `${paramSchema.format && !paramSchema.type.includes('┃') ? paramSchema.format : paramSchema.contentMediaType && !paramSchema.type.includes('┃') ? paramSchema.contentMediaType : paramSchema.type}`
                }
              </div>
            </td>
            <td
              style="${
                fieldType === 'object' ? 'width:100%; padding:0;' : this.allowTry === 'true' ? '' : 'display:none;'
              } min-width:100px;"
              colspan="${fieldType === 'object' ? 2 : 1}"
            >
              ${
                fieldType === 'array'
                  ? isBinaryFileField(fieldSchema.items)
                    ? html`
                        <div class="file-input-container col" style="align-items:flex-start; width:100%;">
                          ${repeat(
                            this.fileInputKeys[fieldName] ?? [0],
                            (key) => key,
                            (key, index) => html`
                              <div class="input-set row" style="width:100%; margin-top: ${index > 0 ? '4px' : '0'};">
                                <input
                                  type="file"
                                  part="file-input"
                                  style="width:100%"
                                  data-pname="${fieldName}"
                                  data-ptype="${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                                  data-array="false"
                                  data-file-array="true"
                                />
                                <button class="file-input-remove-btn" @click="${() => this.onRemoveFileInput(fieldName, key)}">
                                  &#x2715;
                                </button>
                              </div>
                            `
                          )}
                          <button
                            class="m-btn primary file-input-add-btn"
                            part="btn btn-fill"
                            style="margin:4px 0 0 0; padding:2px 8px; align-self:flex-start;"
                            @click="${() => this.onAddFileInput(fieldName)}"
                          >
                            ADD
                          </button>
                        </div>
                      `
                    : html`
                        <tag-input
                          style="width:100%"
                          data-ptype="${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                          data-pname="${fieldName}"
                          data-example="${Array.isArray(fieldExamples) ? fieldExamples.join('~|~') : fieldExamples}"
                          data-array="true"
                          placeholder="add-multiple &#x21a9;"
                          .value="${
                            Array.isArray(fieldExamples) ? (Array.isArray(fieldExamples[0]) ? fieldExamples[0] : fieldExamples) : []
                          }"
                        >
                        </tag-input>
                      `
                  : html` ${
                      fieldType === 'object'
                        ? formDataParamAsObjectTemplate.call(this, fieldName, fieldSchema, mimeType)
                        : html`
                            ${
                              this.allowTry === 'true'
                                ? html`<input
                                    .value="${this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : ''}"
                                    spellcheck="false"
                                    type="${isBinaryFileField(fieldSchema) ? 'file' : fieldSchema.format === 'password' ? 'password' : 'text'}"
                                    part="textbox textbox-param"
                                    style="width:100%"
                                    data-ptype="${mimeType.includes('form-urlencode') ? 'form-urlencode' : 'form-data'}"
                                    data-pname="${fieldName}"
                                    data-example="${Array.isArray(fieldExamples) ? fieldExamples[0] : fieldExamples}"
                                    data-array="false"
                                  />`
                                : ''
                            }
                          `
                    }`
              }
            </td>
            ${
              fieldType === 'object'
                ? ''
                : html` <td>
                    ${
                      paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern
                        ? html` <div class="param-constraint">
                            ${paramSchema.default ? html`<span style="font-weight:bold">Default: </span>${paramSchema.default}<br />` : ''}
                            ${paramSchema.pattern ? html`<span style="font-weight:bold">Pattern: </span>${paramSchema.pattern}<br />` : ''}
                            ${paramSchema.constrain ? html`${paramSchema.constrain}<br />` : ''}
                            ${
                              paramSchema.allowedValues &&
                              String(paramSchema.allowedValues)
                                .split('┃')
                                .map(
                                  (v, i) =>
                                    html` ${i > 0 ? '┃' : html`<span style="font-weight:bold">Allowed: </span>`}
                                    ${html` <a
                                      part="anchor anchor-param-constraint"
                                      class="${this.allowTry === 'true' ? '' : 'inactive-link'}"
                                      data-type="${paramSchema.type === 'array' ? paramSchema.type : 'string'}"
                                      data-enum="${v.trim()}"
                                      @click="${(e) => {
                                        const inputEl = e.target.closest('table').querySelector(`[data-pname="${fieldName}"]`);
                                        if (inputEl) {
                                          if (e.target.dataset.type === 'array') {
                                            inputEl.value = [e.target.dataset.enum];
                                          } else {
                                            inputEl.value = e.target.dataset.enum;
                                          }
                                        }
                                      }}"
                                    >
                                      ${v}
                                    </a>`}`
                                )
                            }
                          </div>`
                        : ''
                    }
                  </td>`
            }
          </tr>
          ${
            fieldType === 'object'
              ? ''
              : html`
                  <tr>
                    <td style="border:none"></td>
                    <td colspan="2" style="border:none; margin-top:0; padding:0 5px 8px 5px;">
                      <span class="m-markdown-small"> ${unsafeHTML(sanitizeHTML(marked(fieldSchema.description || '')))} </span>
                      ${exampleListTemplate.call(this, fieldName, paramSchema.type, example.exampleList)}
                    </td>
                  </tr>
                `
          }`
      );
    }
    return html`
      <table role="presentation" style="width:100%;" class="m-table">
        ${formDataTableRows}
      </table>
    `;
  }

  return html`
    <textarea
      class="textarea dynamic-form-param ${mimeType}"
      part="textarea textarea-param"
      spellcheck="false"
      data-pname="dynamic-form"
      data-ptype="${mimeType}"
      .value="${live(exampleValue)}"
      style="width:100%"
    ></textarea>
    ${schema.description ? html`<span class="m-markdown-small"> ${unsafeHTML(sanitizeHTML(marked(schema.description)))} </span>` : ''}
  `;
}

export default function requestBodyTemplate() {
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
  reqBodyTypeSelectorHtml =
    requestBodyTypes.length === 1
      ? ''
      : html`
          <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change="${(e) => this.onMimeTypeChange(e)}">
            ${requestBodyTypes.map(
              (reqBody) => html`
                <option value="${reqBody.mimeType}" ?selected="${reqBody.mimeType === this.selectedRequestBodyType}">
                  ${reqBody.mimeType}
                </option>
              `
            )}
          </select>
        `;

  // For Loop - Main
  requestBodyTypes.forEach((reqBody) => {
    let schemaAsObj;
    let reqBodyExamples = [];

    if (
      this.selectedRequestBodyType.includes('json') ||
      this.selectedRequestBodyType.includes('xml') ||
      this.selectedRequestBodyType.includes('text') ||
      this.selectedRequestBodyType.includes('jose')
    ) {
      // Generate Example
      if (reqBody.mimeType === this.selectedRequestBodyType) {
        reqBodyExamples = generateExample(
          reqBody.schema,
          reqBody.mimeType,
          standardizeExample(reqBody.examples),
          standardizeExample(reqBody.example),
          this.callback === 'true' || this.webhook === 'true' ? true : false,
          this.callback === 'true' || this.webhook === 'true' ? false : true,
          'text',
          false
        );
        if (!this.selectedRequestBodyExample) {
          this.selectedRequestBodyExample = reqBodyExamples.length > 0 ? reqBodyExamples[0].exampleId : '';
        }
        reqBodyExampleHtml = html`
          ${reqBodyExampleHtml}
          <div class="example-panel border-top pad-top-8">
            ${
              reqBodyExamples.length === 1
                ? ''
                : html`
                    <select style="min-width:100px; max-width:100%;  margin-bottom:-1px;" @change="${(e) => this.onSelectExample(e)}">
                      ${reqBodyExamples.map(
                        (v) =>
                          html`<option value="${v.exampleId}" ?selected=${v.exampleId === this.selectedRequestBodyExample}>
                            ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary ? v.exampleSummary : v.exampleId}
                          </option>`
                      )}
                    </select>
                  `
            }
            ${reqBodyExamples
              .filter((v) => v.exampleId === this.selectedRequestBodyExample)
              .map(
                (v) => html`
                  <div
                    class="example ${v.exampleId === this.selectedRequestBodyExample ? 'example-selected' : ''}"
                    data-example="${v.exampleId}"
                  >
                    ${v.exampleSummary && v.exampleSummary.length > 80 ? html`<div style="padding: 4px 0">${v.exampleSummary}</div>` : ''}
                    ${
                      v.exampleDescription
                        ? html`<div class="m-markdown-small" style="padding: 4px 0">
                            ${unsafeHTML(sanitizeHTML(marked(v.exampleDescription || '')))}
                          </div>`
                        : ''
                    }
                    <!-- This pre(hidden) is to store the original example value, this will remain unchanged when users switches from one example to another, its is used to populate the editable textarea -->
                    <pre
                      class="textarea is-hidden request-body-param ${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}"
                      spellcheck="false"
                      data-ptype="${reqBody.mimeType}"
                      style="width:100%; resize:vertical; display:none"
                    >
${v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2)}</pre>

                    <!-- this textarea is for user to edit the example -->
                    <textarea
                      class="textarea request-body-param-user-input"
                      part="textarea textarea-param"
                      spellcheck="false"
                      data-ptype="${reqBody.mimeType}"
                      data-example="${v.exampleFormat === 'text' ? v.exampleValue : JSON.stringify(v.exampleValue, null, 2)}"
                      data-example-format="${v.exampleFormat}"
                      style="width:100%; resize:vertical;"
                      .value="${
                        this.fillRequestFieldsWithExample === 'true'
                          ? v.exampleFormat === 'text'
                            ? v.exampleValue
                            : JSON.stringify(v.exampleValue, null, 2)
                          : ''
                      }"
                      @input=${(e) => {
                        const requestPanelEl = this.getRequestPanel(e);
                        this.liveCURLSyntaxUpdate(requestPanelEl);
                      }}
                      @keydown=${(e) => {
                        if ((e.keyCode === 10 || e.keyCode === 13) && e.ctrlKey) {
                          return this.onTryClick(e);
                        }
                      }}
                    ></textarea>
                  </div>
                `
              )}
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
          this.callback === 'true' || this.webhook === 'true' ? true : false,
          this.callback === 'true' || this.webhook === 'true' ? false : true,
          'text',
          false
        );
        if (reqBody.schema) {
          reqBodyFormHtml = formDataTemplate.call(this, reqBody.schema, reqBody.mimeType, ex[0] ? ex[0].exampleValue : '');
        }
      }
    } else if (
      /^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(this.selectedRequestBodyType)
    ) {
      if (reqBody.mimeType === this.selectedRequestBodyType) {
        reqBodyFileInputHtml = html`
          <div class="small-font-size bold-text row">
            <input
              id="input-request-body-param-file"
              type="file"
              part="file-input"
              style="max-width:100%"
              class="request-body-param-file"
              data-ptype="${reqBody.mimeType}"
              spellcheck="false"
            />
          </div>
        `;
      }
    }

    // Generate Schema
    if (
      reqBody.mimeType.includes('json') ||
      reqBody.mimeType.includes('xml') ||
      reqBody.mimeType.includes('text') ||
      this.selectedRequestBodyType.includes('jose')
    ) {
      schemaAsObj = schemaToAST(reqBody.schema);
      if (this.schemaStyle === 'table') {
        reqBodySchemaHtml = html`
          ${reqBodySchemaHtml}
          <schema-table
            class="${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}"
            style="display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};"
            .data="${schemaAsObj}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only="${this.schemaHideReadOnly}"
            schema-hide-write-only="${this.schemaHideWriteOnly}"
            exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          >
          </schema-table>
        `;
      } else if (this.schemaStyle === 'tree') {
        reqBodySchemaHtml = html`
          ${reqBodySchemaHtml}
          <schema-tree
            class="${reqBody.mimeType.substring(reqBody.mimeType.indexOf('/') + 1)}"
            style="display: ${this.selectedRequestBodyType === reqBody.mimeType ? 'block' : 'none'};"
            .data="${schemaAsObj}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only="${this.schemaHideReadOnly}"
            schema-hide-write-only="${this.schemaHideWriteOnly}"
            exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          >
          </schema-tree>
        `;
      }
    }
  });

  return html`
    <div class="request-body-container" data-selected-request-body-type="${ifDefined(this.selectedRequestBodyType)}">
      <div class="table-title top-gap row">
        REQUEST BODY ${this.request_body.required ? html`<span class="mono-font" style="color:var(--red)">*</span>` : ''}
        <span style="font-weight:normal; margin-left:5px"> ${this.selectedRequestBodyType}</span>
        <span style="flex:1"></span>
        ${reqBodyTypeSelectorHtml}
      </div>
      ${
        this.request_body.description
          ? html`<div class="m-markdown" style="margin-bottom:12px">
              ${unsafeHTML(sanitizeHTML(marked(this.request_body.description)))}
            </div>`
          : ''
      }
      ${
        this.selectedRequestBodyType.includes('json') ||
        this.selectedRequestBodyType.includes('xml') ||
        this.selectedRequestBodyType.includes('text') ||
        this.selectedRequestBodyType.includes('jose')
          ? html` <div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
              <div
                part="tab-btn-row"
                class="tab-buttons row"
                @click="${(e) => {
                  if (e.target.tagName.toLowerCase() === 'button') {
                    this.activeSchemaTab = e.target.dataset.tab;
                  }
                }}"
              >
                <button part="tab-btn" class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab="example">
                  EXAMPLE
                </button>
                <button part="tab-btn" class="tab-btn ${this.activeSchemaTab !== 'example' ? 'active' : ''}" data-tab="schema">
                  SCHEMA
                </button>
              </div>
              ${html`<div
                part="tab-content"
                class="tab-content col"
                style="display:${this.activeSchemaTab === 'example' ? 'block' : 'none'};"
              >
                ${reqBodyExampleHtml}
              </div>`}
              ${html`<div
                part="tab-content"
                class="tab-content col"
                style="display:${this.activeSchemaTab === 'example' ? 'none' : 'block'};"
              >
                ${reqBodySchemaHtml}
              </div>`}
            </div>`
          : html` ${reqBodyFileInputHtml} ${reqBodyFormHtml}`
      }
    </div>
  `;
}
