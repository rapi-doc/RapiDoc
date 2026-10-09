/**
 * Renders path, query, header, and cookie parameter inputs, schema tree previews, constraints, and clickable example badges for <api-request>.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { live } from 'lit/directives/live.js';
import { sanitizeHTML } from '../utils/sanitize.ts';
import { marked } from 'marked';
import {
  schemaToAST,
  getTypeInfo,
  normalizeExamples,
  getSchemaFromParam,
  generateExample,
  standardizeExample,
  anyExampleWithSummaryOrDescription,
} from '~/utils/schema-utils';
import '~/components/schema-tree';
import '~/components/tag-input';
import type { ApiRequestElement } from '~/types/element';
import type { NormalizedExample, TypeInfo } from '~/types/schema';
import type { ResolvedParameter } from '~/types/spec';

/** Parameter as read by this template: `name` is always present and `x-fill-example` is a vendor extension. */
type RequestParam = ResolvedParameter & { name: string; 'x-fill-example'?: string };

export function renderExample(this: ApiRequestElement, example: NormalizedExample, paramType: string, paramName: string): TemplateResult {
  return html`
    ${paramType === 'array' ? '[' : ''}
    <a
      part="anchor anchor-param-example"
      style="display:inline-block; min-width:24px; text-align:center"
      class="${this.allowTry === 'true' ? '' : 'inactive-link'}"
      data-example-type="${paramType === 'array' ? paramType : 'string'}"
      data-example="${
        example.value && Array.isArray(example.value)
          ? example.value?.join('~|~')
          : (typeof example.value === 'object' ? JSON.stringify(example.value, null, 2) : example.value) || ''
      }"
      title="${
        example.value && Array.isArray(example.value)
          ? example.value?.join('~|~')
          : (typeof example.value === 'object' ? JSON.stringify(example.value, null, 2) : example.value) || ''
      }"
      @click="${(e: Event) => {
        const target = e.target as HTMLElement;
        const inputEl = target.closest('table')!.querySelector(`[data-pname="${paramName}"]`) as (HTMLElement & { value: unknown }) | null;
        if (inputEl) {
          inputEl.value = target.dataset.exampleType === 'array' ? target.dataset.example!.split('~|~') : target.dataset.example;
        }
      }}"
    >
      ${example.printableValue || example.value}
    </a>
    ${paramType === 'array' ? '] ' : ''}
  `;
}

export function renderShortFormatExamples(
  this: ApiRequestElement,
  examples: NormalizedExample[],
  paramType: string,
  paramName: string
): TemplateResult {
  return html`${examples.map((x, i) => html` ${i === 0 ? '' : '┃'} ${renderExample.call(this, x, paramType, paramName)}`)}`;
}

export function renderLongFormatExamples(
  this: ApiRequestElement,
  exampleList: NormalizedExample[],
  paramType: string,
  paramName: string
): TemplateResult {
  return html` <ul style="list-style-type: disclosure-closed;">
    ${exampleList.map(
      (v) =>
        html`<li>
          ${renderExample.call(this, v, paramType, paramName)}
          ${(v.summary?.length as number) > 0 ? html`<span>&lpar;${v.summary}&rpar;</span>` : ''}
          ${(v.description?.length as number) > 0 ? html`<p>${unsafeHTML(sanitizeHTML(marked(v.description!)))}</p>` : ''}
        </li>`
    )}
  </ul>`;
}

export function exampleListTemplate(
  this: ApiRequestElement,
  paramName: string,
  paramType: string,
  exampleList: NormalizedExample[] = []
): TemplateResult {
  return html` ${
    exampleList.length > 0
      ? html`<span style="font-weight:bold">Examples: </span> ${
            anyExampleWithSummaryOrDescription(exampleList)
              ? renderLongFormatExamples.call(this, exampleList, paramType, paramName)
              : renderShortFormatExamples.call(this, exampleList, paramType, paramName)
          }`
      : ''
  }`;
}

export function inputParametersTemplate(this: ApiRequestElement, paramType: string): TemplateResult | '' {
  const filteredParams = this.parameters ? (this.parameters as RequestParam[]).filter((param) => param.in === paramType) : [];
  if (filteredParams.length === 0) {
    return '';
  }
  let title = '';
  if (paramType === 'path') {
    title = 'PATH PARAMETERS';
  } else if (paramType === 'query') {
    title = 'QUERY-STRING PARAMETERS';
  } else if (paramType === 'header') {
    title = 'REQUEST HEADERS';
  } else if (paramType === 'cookie') {
    title = 'COOKIES';
  }

  const tableRows: TemplateResult[] = [];
  for (const param of filteredParams) {
    const [declaredParamSchema, serializeStyle, mimeTypeElem] = getSchemaFromParam(param as Parameters<typeof getSchemaFromParam>[0]);
    if (!declaredParamSchema) {
      continue;
    }
    const paramSchema = getTypeInfo(declaredParamSchema);
    if (!paramSchema) {
      continue;
    }
    const schemaAsObj = schemaToAST(declaredParamSchema);
    let paramStyle = 'form';
    let paramExplode = true;
    let paramAllowReserved = false;
    if (paramType === 'query' || paramType === 'header' || paramType === 'path') {
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
      standardizeExample(param.examples) ||
        standardizeExample(param.example) ||
        standardizeExample(mimeTypeElem?.example) ||
        standardizeExample(mimeTypeElem?.examples) ||
        standardizeExample(paramSchema.examples) ||
        // TODO(ts-migration): `TypeInfo` has no `example` (only `examples`), so this is always undefined.
        standardizeExample((paramSchema as TypeInfo & { example?: unknown }).example),
      paramSchema.type
    );
    if (!example.exampleVal && (paramSchema.type === 'object' || paramSchema.type.split('┃').includes('object'))) {
      example.exampleVal =
        generateExample(
          declaredParamSchema,
          serializeStyle || 'json',
          {},
          {},
          this.callback === 'true' || this.webhook === 'true' ? true : false,
          this.callback === 'true' || this.webhook === 'true' ? false : true,
          true,
          'text',
          // TODO(ts-migration): generateExample takes 8 parameters; this call passes 9, so `true` lands in `outputType` and 'text' in `includeGeneratedExample`.
          // @ts-expect-error extra argument
          false
        )[0]?.exampleValue || '';
    }
    const labelColWidth = 'read focused'.includes(this.renderStyle) ? '200px' : '160px';
    tableRows.push(html`
      <tr title="${param.deprecated ? 'Deprecated' : ''}">
        <td rowspan="${this.allowTry === 'true' ? '1' : '2'}" style="vertical-align:middle; width:${labelColWidth}; min-width:100px;">
          <div class="param-name ${param.deprecated ? 'deprecated' : ''}">
            ${
              param.deprecated
                ? html`<svg viewBox="0 0 10 10" width="10" height="10" style="stroke:var(--red); margin-right:-6px">
                    <path d="M2 2L8 8M2 8L8 2" />
                  </svg>`
                : ''
            }
            ${param.required ? html`<span style="color:var(--red)">*</span>` : ''} ${param.name}
          </div>
          <div class="param-type">
            ${
              paramSchema.type === 'array' || paramSchema.type.split('┃').includes('array')
                ? `${paramSchema.arrayType || paramSchema.type}`
                : `${paramSchema.format && !paramSchema.type.includes('┃') ? paramSchema.format : paramSchema.contentMediaType && !paramSchema.type.includes('┃') ? paramSchema.contentMediaType : paramSchema.type}`
            }
          </div>
        </td>
        ${
          this.allowTry === 'true'
            ? html` <td
                style="min-width:100px;"
                colspan="${paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern ? '1' : '2'}"
              >
                ${
                  paramSchema.type === 'array' ||
                  (paramSchema.type.split('┃').includes('array') && !paramSchema.type.split('┃').includes('object'))
                    ? html`<tag-input
                        class="request-param"
                        id="tag-input-request-param-${param.name}"
                        style="width:100%"
                        data-ptype="${paramType}"
                        data-pname="${param.name}"
                        data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                        data-param-serialize-style="${paramStyle}"
                        data-param-serialize-explode="${paramExplode}"
                        data-param-allow-reserved="${paramAllowReserved}"
                        data-x-fill-example="${param['x-fill-example'] || 'yes'}"
                        data-array="true"
                        placeholder="add-multiple &#x21a9;"
                        .value="${
                          param['x-fill-example'] === 'no'
                            ? []
                            : live(
                                this.fillRequestFieldsWithExample === 'true'
                                  ? Array.isArray(example.exampleVal)
                                    ? example.exampleVal
                                    : [example.exampleVal]
                                  : []
                              )
                        }"
                      >
                      </tag-input>`
                    : paramSchema.type === 'object' || paramSchema.type.split('┃').includes('object')
                      ? html`<div part="tab-panel" class="tab-panel col" style="border-width:0 0 1px 0;">
                          <div
                            part="tab-btn-row"
                            class="tab-buttons row"
                            @click="${(e: Event) => {
                              const target = e.target as HTMLElement;
                              if (target.tagName.toLowerCase() === 'button') {
                                const newState = { ...this.activeParameterSchemaTabs };
                                newState[param.name] = target.dataset.tab!;
                                this.activeParameterSchemaTabs = newState;
                              }
                            }}"
                          >
                            <button
                              part="tab-btn"
                              class="tab-btn ${this.activeParameterSchemaTabs[param.name] === 'example' ? 'active' : ''}"
                              data-tab="example"
                            >
                              EXAMPLE
                            </button>
                            <button
                              part="tab-btn"
                              class="tab-btn ${this.activeParameterSchemaTabs[param.name] !== 'example' ? 'active' : ''}"
                              data-tab="schema"
                            >
                              SCHEMA
                            </button>
                          </div>

                          ${html`<div
                            part="tab-content"
                            class="tab-content col"
                            data-tab="example"
                            style="display:${
                              this.activeParameterSchemaTabs[param.name] === 'example' ? 'block' : 'none'
                            }; padding-left:5px; width:100%"
                          >
                            <textarea
                              id="textarea-request-param-${param.name}"
                              class="textarea request-param"
                              part="textarea textarea-param"
                              data-ptype="${paramType}-object"
                              data-pname="${param.name}"
                              data-example="${example.exampleVal}"
                              data-param-serialize-style="${paramStyle}"
                              data-param-serialize-explode="${paramExplode}"
                              data-param-allow-reserved="${paramAllowReserved}"
                              data-x-fill-example="${param['x-fill-example'] || 'yes'}"
                              spellcheck="false"
                              .value="${
                                param['x-fill-example'] === 'no'
                                  ? ''
                                  : live(
                                      this.fillRequestFieldsWithExample === 'true'
                                        ? typeof example.exampleVal === 'object'
                                          ? JSON.stringify(example.exampleVal, null, 2)
                                          : example.exampleVal
                                        : ''
                                    )
                              }"
                              style="resize:vertical; width:100%; height: ${'read focused'.includes(this.renderStyle) ? '180px' : '120px'};"
                              @input=${(e: Event) => {
                                const requestPanelEl = this.getRequestPanel(e);
                                this.liveCURLSyntaxUpdate(requestPanelEl!);
                              }}
                            ></textarea>
                          </div>`}
                          ${html`<div
                            part="tab-content"
                            class="tab-content col"
                            data-tab="schema"
                            style="display:${
                              this.activeParameterSchemaTabs[param.name] !== 'example' ? 'block' : 'none'
                            }; padding-left:5px; width:100%;"
                          >
                            <schema-tree
                              class="json"
                              style="display: block"
                              .data="${schemaAsObj}"
                              schema-expand-level="${this.schemaExpandLevel}"
                              schema-description-expanded="${this.schemaDescriptionExpanded}"
                              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
                              schema-hide-read-only="${this.schemaHideReadOnly.includes(this.method)}"
                              schema-hide-write-only="${this.schemaHideWriteOnly.includes(this.method)}"
                              exportparts="wrap-request-btn:wrap-request-btn, btn:btn, btn-fill:btn-fill, btn-outline:btn-outline, btn-try:btn-try, btn-clear:btn-clear, btn-clear-resp:btn-clear-resp,
                          file-input:file-input, textbox:textbox, textbox-param:textbox-param, textarea:textarea, textarea-param:textarea-param, 
                          anchor:anchor, anchor-param-example:anchor-param-example"
                            >
                            </schema-tree>
                          </div>`}
                        </div>`
                      : html` <input
                          type="${paramSchema.format === 'password' ? 'password' : 'text'}"
                          spellcheck="false"
                          style="width:100%"
                          id="input-request-param-${param.name}"
                          class="request-param"
                          part="textbox textbox-param"
                          data-ptype="${paramType}"
                          data-pname="${param.name}"
                          data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join('~|~') : example.exampleVal}"
                          data-param-allow-reserved="${paramAllowReserved}"
                          data-x-fill-example="${param['x-fill-example'] || 'yes'}"
                          data-array="false"
                          .value="${
                            param['x-fill-example'] === 'no'
                              ? ''
                              : live(this.fillRequestFieldsWithExample === 'true' ? example.exampleVal : '')
                          }"
                          @input=${(e: Event) => {
                            const requestPanelEl = this.getRequestPanel(e);
                            this.liveCURLSyntaxUpdate(requestPanelEl!);
                          }}
                        />`
                }
              </td>`
            : ''
        }
        ${
          paramSchema.default || paramSchema.constrain || paramSchema.allowedValues || paramSchema.pattern
            ? html` <td colspan="${this.allowTry === 'true' ? '1' : '2'}">
                <div class="param-constraint">
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
                            @click="${(e: Event) => {
                              const target = e.target as HTMLElement;
                              const inputEl = target.closest('table')!.querySelector(`[data-pname="${param.name}"]`) as
                                (HTMLElement & { value: unknown }) | null;
                              if (inputEl) {
                                if (target.dataset.type === 'array') {
                                  inputEl.value = [target.dataset.enum];
                                } else {
                                  inputEl.value = target.dataset.enum;
                                }
                              }
                            }}"
                            >${v}</a
                          >`}`
                      )
                  }
                </div>
              </td>`
            : html`<td></td>`
        }
      </tr>
      <tr>
        ${this.allowTry === 'true' ? html`<td style="border:none"></td>` : ''}
        <td colspan="2" style="border:none">
          <span class="m-markdown-small"> ${unsafeHTML(sanitizeHTML(marked(param.description || '')))} </span>
          ${exampleListTemplate.call(this, param.name, paramSchema.type, example.exampleList)}
        </td>
      </tr>
    `);
  }

  return html` <div class="table-title top-gap">${title}</div>
    <div style="display:block; overflow-x:auto; max-width:100%;">
      <table role="presentation" class="m-table" style="width:100%; word-break:break-word;">
        ${tableRows}
      </table>
    </div>`;
}
