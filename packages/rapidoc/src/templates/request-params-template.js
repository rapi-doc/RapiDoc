/**
 * Renders path, query, header, and cookie parameter inputs, schema tree previews, constraints, and clickable example badges for <api-request>.
 */
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { live } from "lit/directives/live.js";
import { sanitizeHTML } from "../utils/sanitize.js";
import { marked } from "marked";
import {
  schemaToAST,
  getTypeInfo,
  normalizeExamples,
  getSchemaFromParam,
  generateExample,
  standardizeExample,
  anyExampleWithSummaryOrDescription,
  EMPTY_ARRAY,
} from "~/utils/schema-utils";
import "~/components/schema-tree";
import "~/components/tag-input";

/**
 * A label followed by a wrapping list of values (Allowed values, Examples).
 * Wrapped lines hang under the first value; CSS draws the separators.
 */
export function valueListTemplate(label, items) {
  return html`<div class="value-list" part="value-list">
    <span class="param-constraint-label value-list-label" part="value-list-label">${label}</span>
    <ul class="value-list-items" part="value-list-items" role="list">
      ${items.map((item) => html`<li>${item}</li>`)}
    </ul>
  </div>`;
}

/**
 * Constraints as label/value pairs. The labels share one column, so every value starts at the same place,
 * whether there is one constraint or several. Limits (range, multiple of, length) and allowed values wrap
 * as value lists, hanging under their first value.
 */
export function constraintListTemplate(paramSchema, allowedItems, exampleItems) {
  const valueItems = (items) =>
    html`<ul class="value-list-items" part="value-list-items" role="list">
      ${items.map((item) => html`<li>${item}</li>`)}
    </ul>`;
  const row = (label, value) =>
    html`<dt class="param-constraint-label" part="param-constraint-label">${label}</dt>
      <dd>${value}</dd>`;
  return html`<dl class="param-constraint" part="param-constraint">
    ${paramSchema.default ? row("Default:", paramSchema.default) : ""} ${paramSchema.pattern ? row("Pattern:", paramSchema.pattern) : ""}
    ${
      paramSchema.constrain
        ? row(
            "Limits:",
            valueItems(
              paramSchema.constrain
                .split("┃")
                .map((v) => v.trim())
                .filter(Boolean),
            ),
          )
        : ""
    }
    ${allowedItems ? row("Allowed:", valueItems(allowedItems)) : ""} ${exampleItems ? row("Examples:", valueItems(exampleItems)) : ""}
  </dl>`;
}

/**
 * Short examples join the constraint list (lined up with the other values) when there is no description to put them under.
 * Long-format examples, with a summary or description, always stay in the details.
 */
export function examplesBesideConstraints(description, hasConstraint, exampleList = []) {
  return (
    !description?.trim() &&
    Boolean(hasConstraint) &&
    exampleList.length > 0 &&
    !anyExampleWithSummaryOrDescription(exampleList)
  );
}

export function renderExample(example, paramType, paramName) {
  return html`
    ${paramType === "array" ? "[" : ""}
    <button
      type="button"
      part="anchor anchor-param-example"
      class="value-chip"
      ?disabled="${this.allowTry !== "true"}"
      data-example-type="${paramType === "array" ? paramType : "string"}"
      data-example="${
        example.value && Array.isArray(example.value)
          ? example.value?.join("~|~")
          : (typeof example.value === "object"
              ? JSON.stringify(example.value, null, 2)
              : example.value) || ""
      }"
      title="${
        example.value && Array.isArray(example.value)
          ? example.value?.join("~|~")
          : (typeof example.value === "object"
              ? JSON.stringify(example.value, null, 2)
              : example.value) || ""
      }"
      @click="${(e) => {
        const inputEl = e.target
          .closest(".param-list")
          .querySelector(`[data-pname="${paramName}"]`);
        if (inputEl) {
          inputEl.value =
            e.target.dataset.exampleType === "array"
              ? e.target.dataset.example.split("~|~")
              : e.target.dataset.example;
        }
      }}"
    >
      ${example.printableValue || example.value}
    </button>
    ${paramType === "array" ? "] " : ""}
  `;
}

export function renderShortFormatExamples(examples, paramType, paramName) {
  return valueListTemplate(
    "Examples:",
    examples.map((x) => renderExample.call(this, x, paramType, paramName)),
  );
}

export function renderLongFormatExamples(exampleList, paramType, paramName) {
  return html` <ul class="param-example-list" part="param-example-list" role="list">
    ${exampleList.map(
      (v) =>
        html`<li>
          ${renderExample.call(this, v, paramType, paramName)} ${v.summary?.length > 0 ? html`<span>&lpar;${v.summary}&rpar;</span>` : ""}
          ${v.description?.length > 0 ? html`<div class="m-markdown-small">${unsafeHTML(sanitizeHTML(marked(v.description)))}</div>` : ""}
        </li>`,
    )}
  </ul>`;
}

export function exampleListTemplate(paramName, paramType, exampleList = []) {
  return html` ${
    exampleList.length > 0
      ? anyExampleWithSummaryOrDescription(exampleList)
        ? html`<span class="param-constraint-label">Examples: </span>
            ${renderLongFormatExamples.call(this, exampleList, paramType, paramName)}`
        : renderShortFormatExamples.call(this, exampleList, paramType, paramName)
      : ""
  }`;
}

// A singular `example` is the value itself, even an object; only an `examples` map wraps its values in { value }
const singleExample = (ex) =>
  ex !== null && typeof ex === "object" && !Array.isArray(ex)
    ? { Example: { value: ex } }
    : standardizeExample(ex);

export function inputParametersTemplate(paramType) {
  const filteredParams = this.parameters
    ? this.parameters.filter((param) => param.in === paramType)
    : [];
  if (filteredParams.length === 0) {
    return "";
  }
  let title = "";
  if (paramType === "path") {
    title = "Path parameters";
  } else if (paramType === "query") {
    title = "Query-string parameters";
  } else if (paramType === "header") {
    title = "Request headers";
  } else if (paramType === "cookie") {
    title = "Cookies";
  }

  const paramItems = [];
  for (const param of filteredParams) {
    const [declaredParamSchema, serializeStyle, mimeTypeElem] = getSchemaFromParam(param);
    if (!declaredParamSchema) {
      continue;
    }
    const paramSchema = getTypeInfo(declaredParamSchema);
    if (!paramSchema) {
      continue;
    }
    const schemaAsObj = schemaToAST(declaredParamSchema);
    let paramStyle = "form";
    let paramExplode = true;
    let paramAllowReserved = false;
    if (paramType === "query" || paramType === "header" || paramType === "path") {
      if (param.style && "form spaceDelimited pipeDelimited".includes(param.style)) {
        paramStyle = param.style;
      } else if (serializeStyle) {
        paramStyle = serializeStyle;
      }
      if (typeof param.explode === "boolean") {
        paramExplode = param.explode;
      }
      if (typeof param.allowReserved === "boolean") {
        paramAllowReserved = param.allowReserved;
      }
    }
    // openapi 3.1.0 spec based examples (which must be Object(string : { value:any, summary?: string, description?: string})
    const example = normalizeExamples(
      standardizeExample(param.examples) ||
        singleExample(param.example) ||
        singleExample(mimeTypeElem?.example) ||
        standardizeExample(mimeTypeElem?.examples) ||
        standardizeExample(paramSchema.examples) ||
        standardizeExample(paramSchema.example),
      paramSchema.type,
    );
    if (
      !example.exampleVal &&
      (paramSchema.type === "object" || paramSchema.type.split("┃").includes("object"))
    ) {
      example.exampleVal =
        generateExample(
          declaredParamSchema,
          serializeStyle || "json",
          {},
          {},
          this.callback === "true" || this.webhook === "true" ? true : false,
          this.callback === "true" || this.webhook === "true" ? false : true,
          "text",
          false,
        )[0]?.exampleValue || "";
    }
    const hasConstraint =
      paramSchema.default ||
      paramSchema.constrain ||
      paramSchema.allowedValues ||
      paramSchema.pattern;
    const inlineExamples = examplesBesideConstraints(
      param.description,
      hasConstraint,
      example.exampleList,
    );
    paramItems.push(html`
      <li class="param ${param.deprecated ? "deprecated" : ""}" part="param" title="${param.deprecated ? "Deprecated" : ""}">
        <div class="param-label" part="param-label">
          <div class="param-name ${param.deprecated ? "deprecated" : ""}" part="param-name">
            ${
              param.deprecated
                ? html`<svg class="param-deprecated-icon" viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
                    <path d="M2 2L8 8M2 8L8 2" />
                  </svg>`
                : ""
            }
            ${param.required ? html`<span class="param-required" title="Required">*</span>` : ""} ${param.name}
          </div>
          <div class="param-type" part="param-type">
            ${
              paramSchema.type === "array" || paramSchema.type.split("┃").includes("array")
                ? `${paramSchema.arrayType || paramSchema.type}`
                : `${paramSchema.format && !paramSchema.type.includes("┃") ? paramSchema.format : paramSchema.contentMediaType && !paramSchema.type.includes("┃") ? paramSchema.contentMediaType : paramSchema.type}`
            }
          </div>
        </div>
        ${
          this.allowTry === "true"
            ? html` <div class="param-input" part="param-input">
                ${
                  paramSchema.type === "array" ||
                  (paramSchema.type.split("┃").includes("array") &&
                    !paramSchema.type.split("┃").includes("object"))
                    ? html`<tag-input
                        class="request-param"
                        id="tag-input-request-param-${param.name}"
                        style="width:100%"
                        data-ptype="${paramType}"
                        data-pname="${param.name}"
                        data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join("~|~") : example.exampleVal}"
                        data-param-serialize-style="${paramStyle}"
                        data-param-serialize-explode="${paramExplode}"
                        data-param-allow-reserved="${paramAllowReserved}"
                        data-x-fill-example="${param["x-fill-example"] || "yes"}"
                        data-array="true"
                        placeholder="add-multiple &#x21a9;"
                        .value="${
                          param["x-fill-example"] === "no"
                            ? EMPTY_ARRAY
                            : live(
                                this.fillRequestFieldsWithExample === "true"
                                  ? Array.isArray(example.exampleVal)
                                    ? example.exampleVal
                                    : [example.exampleVal]
                                  : EMPTY_ARRAY,
                              )
                        }"
                        @input="${(e) => {
                          const requestPanelEl = this.getRequestPanel(e);
                          this.liveCURLSyntaxUpdate(requestPanelEl);
                        }}"
                        @change="${(e) => {
                          const requestPanelEl = this.getRequestPanel(e);
                          this.liveCURLSyntaxUpdate(requestPanelEl);
                        }}"
                      >
                      </tag-input>`
                    : paramSchema.type === "object" ||
                        paramSchema.type.split("┃").includes("object")
                      ? html`<div part="tab-panel" class="tab-panel col">
                          <div
                            part="tab-btn-row"
                            class="tab-buttons row"
                            @click="${(e) => {
                              if (e.target.tagName.toLowerCase() === "button") {
                                const newState = { ...this.activeParameterSchemaTabs };
                                newState[param.name] = e.target.dataset.tab;
                                this.activeParameterSchemaTabs = newState;
                              }
                            }}"
                          >
                            <button
                              part="tab-btn"
                              class="tab-btn ${this.activeParameterSchemaTabs[param.name] === "example" ? "active" : ""}"
                              data-tab="example"
                            >
                              EXAMPLE
                            </button>
                            <button
                              part="tab-btn"
                              class="tab-btn ${this.activeParameterSchemaTabs[param.name] !== "example" ? "active" : ""}"
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
                              this.activeParameterSchemaTabs[param.name] === "example"
                                ? "block"
                                : "none"
                            }; padding-left:5px; width:100%"
                          >
                            <textarea
                              id="textarea-request-param-${param.name}"
                              class="textarea request-param"
                              part="textarea textarea-param"
                              data-ptype="${paramType}-object"
                              data-pname="${param.name}"
                              data-example="${
                                typeof example.exampleVal === "object"
                                  ? JSON.stringify(example.exampleVal, null, 2)
                                  : example.exampleVal
                              }"
                              data-param-serialize-style="${paramStyle}"
                              data-param-serialize-explode="${paramExplode}"
                              data-param-allow-reserved="${paramAllowReserved}"
                              data-x-fill-example="${param["x-fill-example"] || "yes"}"
                              spellcheck="false"
                              .value="${
                                param["x-fill-example"] === "no"
                                  ? ""
                                  : live(
                                      this.fillRequestFieldsWithExample === "true"
                                        ? typeof example.exampleVal === "object"
                                          ? JSON.stringify(example.exampleVal, null, 2)
                                          : example.exampleVal
                                        : "",
                                    )
                              }"
                              style="resize:vertical; width:100%; height: ${"read focused".includes(this.renderStyle) ? "180px" : "120px"};"
                              @input=${(e) => {
                                const requestPanelEl = this.getRequestPanel(e);
                                this.liveCURLSyntaxUpdate(requestPanelEl);
                              }}
                            ></textarea>
                          </div>`}
                          ${html`<div
                            part="tab-content"
                            class="tab-content col"
                            data-tab="schema"
                            style="display:${
                              this.activeParameterSchemaTabs[param.name] !== "example"
                                ? "block"
                                : "none"
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
                          type="${paramSchema.format === "password" ? "password" : "text"}"
                          spellcheck="false"
                          style="width:100%"
                          id="input-request-param-${param.name}"
                          class="request-param"
                          part="textbox textbox-param"
                          data-ptype="${paramType}"
                          data-pname="${param.name}"
                          data-example="${Array.isArray(example.exampleVal) ? example.exampleVal.join("~|~") : example.exampleVal}"
                          data-param-allow-reserved="${paramAllowReserved}"
                          data-x-fill-example="${param["x-fill-example"] || "yes"}"
                          data-array="false"
                          .value="${
                            param["x-fill-example"] === "no"
                              ? ""
                              : live(
                                  this.fillRequestFieldsWithExample === "true"
                                    ? example.exampleVal
                                    : "",
                                )
                          }"
                          @input=${(e) => {
                            const requestPanelEl = this.getRequestPanel(e);
                            this.liveCURLSyntaxUpdate(requestPanelEl);
                          }}
                        />`
                }
              </div>`
            : ""
        }
        ${
          hasConstraint
            ? constraintListTemplate(
                paramSchema,
                paramSchema.allowedValues &&
                  String(paramSchema.allowedValues)
                    .split("┃")
                    .map(
                      (v) =>
                        html`<button
                          type="button"
                          part="anchor anchor-param-constraint"
                          class="value-chip"
                          ?disabled="${this.allowTry !== "true"}"
                          data-type="${paramSchema.type === "array" ? paramSchema.type : "string"}"
                          data-enum="${v.trim()}"
                          @click="${(e) => {
                            const inputEl = e.target
                              .closest(".param-list")
                              .querySelector(`[data-pname="${param.name}"]`);
                            if (inputEl) {
                              if (e.target.dataset.type === "array") {
                                inputEl.value = [e.target.dataset.enum];
                              } else {
                                inputEl.value = e.target.dataset.enum;
                              }
                            }
                          }}"
                        >
                          ${v}
                        </button>`,
                    ),
                inlineExamples &&
                  example.exampleList.map((x) =>
                    renderExample.call(this, x, paramSchema.type, param.name),
                  ),
              )
            : ""
        }
        <div class="param-details" part="param-details">
          ${param.description ? html`<div class="m-markdown-small">${unsafeHTML(sanitizeHTML(marked(param.description)))}</div>` : ""}
          ${inlineExamples ? "" : exampleListTemplate.call(this, param.name, paramSchema.type, example.exampleList)}
        </div>
      </li>
    `);
  }

  return html` <h5 class="rapidoc-heading label-heading table-title top-gap" part="heading heading-5">${title}</h5>
    <div class="param-list-container">
      <ul class="param-list" part="param-list" role="list">
        ${paramItems}
      </ul>
    </div>`;
}
