import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { marked } from 'marked';
import { prepareResponseDefinitions } from '../utils/response-utils.js';
import FontStyles from '~/styles/font-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import InputStyles from '~/styles/input-styles';
import TabStyles from '~/styles/tab-styles';
import BorderStyles from '~/styles/border-styles';
import CustomStyles from '~/styles/custom-styles';
import '~/components/json-tree';
import '~/components/schema-tree';
import '~/components/schema-table';

@customElement('api-response')
export default class ApiResponse extends LitElement {
  @property({ type: Object }) config: any;
  @property({ type: String }) callback = '';
  @property({ type: String }) webhook = '';
  @property({ type: Object }) responses: any;
  @property({ type: Object }) parser: any;
  @property({ type: String, attribute: 'schema-style' }) schemaStyle = '';
  @property({ type: String, attribute: 'render-style' }) renderStyle = '';
  @property({ type: String, attribute: 'selected-status' }) selectedStatus = '';
  @property({ type: String, attribute: 'selected-mime-type' }) selectedMimeType = '';
  @property({ type: String, attribute: 'active-schema-tab' }) activeSchemaTab = 'schema';
  @property({ type: Number, attribute: 'schema-expand-level' }) schemaExpandLevel = 99999;
  @property({ type: String, attribute: 'schema-description-expanded' }) schemaDescriptionExpanded = 'false';
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' }) allowSchemaDescriptionExpandToggle = 'false';
  @property({ type: String, attribute: 'schema-hide-read-only' }) schemaHideReadOnly = 'false';
  @property({ type: String, attribute: 'schema-hide-write-only' }) schemaHideWriteOnly = 'true';

  defaultStatus = '';
  defaultMimeType = '';
  headersForEachRespStatus: any = {};
  mimeResponsesForEachStatus: any = {};

  constructor() {
    super();
    this.selectedStatus = '';
    this.defaultStatus = '';
    this.defaultMimeType = '';
    this.headersForEachRespStatus = {};
    this.mimeResponsesForEachStatus = {};
    this.activeSchemaTab = 'schema';
  }

  static get styles() {
    return [
      FontStyles,
      FlexStyles,
      TabStyles,
      TableStyles,
      InputStyles,
      BorderStyles,
      css`
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary);
        }
        .resp-head {
          vertical-align: middle;
          padding: 16px 0 8px;

          &.divider {
            border-top: 1px solid var(--border);
            margin-top: 10px;
          }
        }
        .resp-status {
          font-weight: bold;
          font-size: calc(var(--font-size-small) + 1px);
        }
        .resp-descr {
          font-size: calc(var(--font-size-small) + 1px);
          color: var(--muted-foreground);
          text-align: left;
        }
        .top-gap {
          margin-top: 16px;
        }
        .example-panel {
          font-size: var(--font-size-small);
          margin: 0;
        }
      `,
      CustomStyles,
    ];
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    // Sync configuration options passed down from parent <rapi-doc>
    if (this.config && changedProperties.has('config')) {
      if (this.config.renderStyle) this.renderStyle = this.config.renderStyle;
      if (this.config.schemaStyle) this.schemaStyle = this.config.schemaStyle;
      if (this.config.schemaExpandLevel !== undefined) this.schemaExpandLevel = this.config.schemaExpandLevel;
      if (this.config.schemaDescriptionExpanded !== undefined) this.schemaDescriptionExpanded = this.config.schemaDescriptionExpanded;
      if (this.config.allowSchemaDescriptionExpandToggle !== undefined)
        this.allowSchemaDescriptionExpandToggle = this.config.allowSchemaDescriptionExpandToggle;
      // In responses, readOnly fields are shown by default ('false') while writeOnly fields are hidden ('true').
      // For webhooks, this behavior is inverted unless configured to 'never'.
      if (this.config.schemaHideReadOnly !== undefined)
        this.schemaHideReadOnly = this.config.schemaHideReadOnly === 'never' ? 'false' : this.webhook === 'true' ? 'true' : 'false';
      if (this.config.schemaHideWriteOnly !== undefined)
        this.schemaHideWriteOnly = this.config.schemaHideWriteOnly === 'never' ? 'false' : this.webhook === 'true' ? 'false' : 'true';
      if (this.config.defaultSchemaTab) this.activeSchemaTab = this.config.defaultSchemaTab;
    }
    // Parse response definitions, headers, examples, and AST schemas when responses change
    if (changedProperties.has('responses') || changedProperties.has('callback') || changedProperties.has('webhook')) {
      if (!this.responses || typeof this.responses !== 'object') {
        return;
      }
      const defs = prepareResponseDefinitions(this.responses, {
        callback: this.callback,
        webhook: this.webhook,
      });
      this.headersForEachRespStatus = defs.headersForEachRespStatus;
      this.mimeResponsesForEachStatus = defs.mimeResponsesForEachStatus;
      this.defaultStatus = defs.defaultStatus;
      this.defaultMimeType = defs.defaultMimeType;
      // Default to primary status code (e.g. '200') if none is currently selected or if the old status doesn't exist on this response
      if (!this.selectedStatus || !this.responses?.[this.selectedStatus]) {
        this.selectedStatus = defs.defaultStatus;
      }
      if (!this.selectedMimeType) {
        this.selectedMimeType = defs.defaultMimeType;
      }
    }
  }

  render() {
    return html`<div class="col regular-font response-panel ${this.renderStyle}-mode">
      <div class=" ${this.callback === 'true' ? 'tiny-title' : 'req-res-title'} ">
        ${this.callback === 'true' ? 'CALLBACK RESPONSE' : 'RESPONSE'}
      </div>
      <div>${this.responseTemplate()}</div>
    </div> `;
  }

  // Called by rapi-doc after navigating in focused mode.
  // In focused mode, the single <api-response> element instance is reused across operations.
  // We reset selections back to the default status code and MIME type of the active endpoint,
  // preventing user selections from a prior endpoint (e.g., status 400) from carrying over or hiding panels.
  resetSelection() {
    this.selectedStatus = this.defaultStatus || (this.responses ? Object.keys(this.responses).find((k) => k !== '$$ref') || '' : '');
    if (this.selectedStatus && this.mimeResponsesForEachStatus?.[this.selectedStatus]) {
      this.selectedMimeType = Object.keys(this.mimeResponsesForEachStatus[this.selectedStatus])[0] || '';
    } else {
      this.selectedMimeType = this.defaultMimeType || '';
    }
  }

  responseTemplate() {
    if (!this.responses) {
      return '';
    }
    // Fallback guard: Ensure selectedStatus and selectedMimeType always point to valid options
    // for this endpoint, even if resetSelection was called or responses have not re-rendered yet.
    if (!this.selectedStatus || !this.responses[this.selectedStatus]) {
      this.selectedStatus =
        this.defaultStatus || Object.keys(this.responses).find((k) => k !== '$$ref') || Object.keys(this.responses)[0] || '';
    }
    if (!this.selectedMimeType && this.selectedStatus && this.mimeResponsesForEachStatus?.[this.selectedStatus]) {
      this.selectedMimeType = Object.keys(this.mimeResponsesForEachStatus[this.selectedStatus])[0] || this.defaultMimeType || '';
    }
    return html`
      ${
        Object.keys(this.responses).length > 1
          ? html`<div class="row" style="flex-wrap:wrap">
              ${Object.keys(this.responses).map(
                (respStatus) =>
                  html` ${
                    respStatus === '$$ref' // Ignore '$$ref' if present from legacy reference parsing
                      ? ''
                      : html`<button
                          @click="${() => {
                            this.selectedStatus = respStatus;
                            if (this.responses[respStatus].content && Object.keys(this.responses[respStatus].content)[0]) {
                              this.selectedMimeType = Object.keys(this.responses[respStatus].content)[0];
                            } else {
                              this.selectedMimeType = undefined;
                            }
                          }}"
                          class="btn btn-sm ${this.selectedStatus === respStatus ? 'btn-primary' : 'btn-outline'}"
                          part="btn ${
                            this.selectedStatus === respStatus ? 'btn-response-status btn-selected-response-status' : ' btn-response-status'
                          }"
                          style="margin: 8px 4px 0 0"
                        >
                          ${respStatus}
                        </button>`
                  }`
              )}
            </div>`
          : html`<span>${Object.keys(this.responses)[0]}</span>`
      }
      ${Object.keys(this.responses).map(
        (status) =>
          html`<div style="display: ${status === this.selectedStatus ? 'block' : 'none'}">
            <div class="top-gap">
              <span class="resp-descr m-markdown">${unsafeHTML(sanitizeHTML(marked(this.responses[status]?.description || '')))}</span>
              ${
                this.headersForEachRespStatus[status] && this.headersForEachRespStatus[status]?.length > 0
                  ? html`${this.responseHeaderListTemplate(this.headersForEachRespStatus[status])}`
                  : ''
              }
            </div>
            ${
              !this.mimeResponsesForEachStatus[status] || Object.keys(this.mimeResponsesForEachStatus[status]).length === 0
                ? ''
                : html`<div part="tab-panel" class="tab-panel col">
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
                      <div style="flex:1"></div>
                      ${
                        Object.keys(this.mimeResponsesForEachStatus[status]).length === 1
                          ? html`<span class="small-font-size gray-text" style="align-self:center; margin-top:8px;">
                              ${Object.keys(this.mimeResponsesForEachStatus[status])[0]}
                            </span>`
                          : html`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[status]))}`
                      }
                    </div>
                    ${
                      this.activeSchemaTab === 'example'
                        ? html`<div part="tab-content" class="tab-content col" style="flex:1;">
                            ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                          </div>`
                        : html`<div part="tab-content" class="tab-content col" style="flex:1;">
                            ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                          </div>`
                    }
                  </div> `
            }
          </div>`
      )}
    `;
  }

  responseHeaderListTemplate(respHeaders) {
    return html`<div style="padding:16px 0 8px 0" class="resp-headers small-font-size bold-text">RESPONSE HEADERS</div>
      <table
        role="presentation"
        style="border-collapse: collapse; margin-bottom:16px; border:1px solid var(--border); border-radius: var(--card-radius)"
        class="small-font-size mono-font"
      >
        ${respHeaders.map(
          (v) =>
            html` <tr>
              <td
                style="padding:8px; vertical-align: baseline; min-width:120px; border-top: 1px solid var(--border); text-overflow: ellipsis;"
              >
                ${v.name || ''}
              </td>
              <td
                style="padding:4px; vertical-align: baseline; padding:0 5px; border-top: 1px solid var(--border); text-overflow: ellipsis;"
              >
                ${v.schema?.type || ''}
              </td>
              <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--border);text-overflow: ellipsis;">
                <div class="m-markdown-small regular-font">${unsafeHTML(sanitizeHTML(marked(v.description || '')))}</div>
              </td>
              <td style="padding:8px; vertical-align: baseline; border-top: 1px solid var(--border); text-overflow: ellipsis;">
                ${v.schema?.example || ''}
              </td>
            </tr>`
        )}
      </table>`;
  }

  mimeTypeDropdownTemplate(mimeTypes) {
    return html`<select
      aria-label="mime types"
      @change="${(e) => {
        this.selectedMimeType = e.target.value;
      }}"
      style="margin-bottom: -1px; z-index:1"
    >
      ${mimeTypes.map(
        (mimeType) => html`<option value="${mimeType}" ?selected="${mimeType === this.selectedMimeType}">${mimeType}</option>`
      )}
    </select>`;
  }

  onSelectExample(e) {
    const exampleContainerEl = e.target.closest('.example-panel');
    const exampleEls = [...exampleContainerEl.querySelectorAll('.example')];

    exampleEls.forEach((v) => {
      v.style.display = v.dataset.example === e.target.value ? 'block' : 'none';
    });
  }

  mimeExampleTemplate(mimeRespDetails) {
    if (!mimeRespDetails || !mimeRespDetails.examples || mimeRespDetails.examples.length === 0) {
      return html`
        <pre
          style="color:var(--red)"
          class="${this.renderStyle === 'read' ? 'read example-panel border pad-8-16' : 'example-panel border-top'}"
        >
 No example provided </pre>
      `;
    }
    return html`
      ${
        mimeRespDetails.examples.length === 1
          ? html` ${
              mimeRespDetails.examples[0].exampleFormat === 'json'
                ? html` ${
                      mimeRespDetails.examples[0].exampleSummary && mimeRespDetails.examples[0].exampleSummary.length > 80
                        ? html`<div style="padding: 4px 0">${mimeRespDetails.examples[0].exampleSummary}</div>`
                        : ''
                    }
                    ${
                      mimeRespDetails.examples[0].exampleDescription
                        ? html`<div class="m-markdown-small" style="padding: 4px 0">
                            ${unsafeHTML(sanitizeHTML(marked(mimeRespDetails.examples[0].exampleDescription || '')))}
                          </div>`
                        : ''
                    }
                    <json-tree
                      render-style="${this.renderStyle}"
                      .data="${mimeRespDetails.examples[0].exampleValue}"
                      class="example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}"
                      exportparts="btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
                    ></json-tree>`
                : html`
                    ${
                      mimeRespDetails.examples[0].exampleSummary && mimeRespDetails.examples[0].exampleSummary.length > 80
                        ? html`<div style="padding: 4px 0">${mimeRespDetails.examples[0].exampleSummary}</div>`
                        : ''
                    }
                    ${
                      mimeRespDetails.examples[0].exampleDescription
                        ? html`<div class="m-markdown-small" style="padding: 4px 0">
                            ${unsafeHTML(sanitizeHTML(marked(mimeRespDetails.examples[0].exampleDescription || '')))}
                          </div>`
                        : ''
                    }
                    <pre class="example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}">
${mimeRespDetails.examples[0].exampleValue}</pre>
                  `
            }`
          : html`
              <span class="example-panel ${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top pad-top-8'}">
                <select aria-label="response examples" style="min-width:100px; max-width:100%" @change="${(e) => this.onSelectExample(e)}">
                  ${mimeRespDetails.examples.map(
                    (v) =>
                      html`<option value="${v.exampleId}" ?selected=${v.exampleId === mimeRespDetails.selectedExample}>
                        ${v.exampleSummary.length > 80 ? v.exampleId : v.exampleSummary}
                      </option>`
                  )}
                </select>
                ${mimeRespDetails.examples.map(
                  (v) => html`
                    <div
                      class="example"
                      data-example="${v.exampleId}"
                      style="display: ${v.exampleId === mimeRespDetails.selectedExample ? 'block' : 'none'}"
                    >
                      ${v.exampleSummary && v.exampleSummary.length > 80 ? html`<div style="padding: 4px 0">${v.exampleSummary}</div>` : ''}
                      ${
                        v.exampleDescription
                          ? html`<div class="m-markdown-small" style="padding: 4px 0">
                              ${unsafeHTML(sanitizeHTML(marked(v.exampleDescription || '')))}
                            </div>`
                          : ''
                      }
                      ${
                        v.exampleFormat === 'json'
                          ? html`<json-tree
                              render-style="${this.renderStyle}"
                              .data="${v.exampleValue}"
                              exportparts="btn:btn, btn-fill:btn-fill, btn-copy:btn-copy"
                            ></json-tree>`
                          : html`<pre>${v.exampleValue}</pre>`
                      }
                    </div>
                  `
                )}
              </span>
            `
      }
    `;
  }

  mimeSchemaTemplate(mimeRespDetails) {
    if (!mimeRespDetails) {
      return html`
        <pre style="color:var(--red)" class="${this.renderStyle === 'read' ? 'border pad-8-16' : 'border-top'}"> Schema not found</pre>
      `;
    }
    return html` ${
      this.schemaStyle === 'table'
        ? html`
            <schema-table
              .data="${mimeRespDetails.schemaTree}"
              schema-expand-level="${this.schemaExpandLevel}"
              schema-description-expanded="${this.schemaDescriptionExpanded}"
              allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
              schema-hide-read-only="${this.schemaHideReadOnly}"
              schema-hide-write-only="${this.schemaHideWriteOnly}"
              exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
            >
            </schema-table>
          `
        : html`<schema-tree
            .data="${mimeRespDetails.schemaTree}"
            schema-expand-level="${this.schemaExpandLevel}"
            schema-description-expanded="${this.schemaDescriptionExpanded}"
            allow-schema-description-expand-toggle="${this.allowSchemaDescriptionExpandToggle}"
            schema-hide-read-only="${this.schemaHideReadOnly}"
            schema-hide-write-only="${this.schemaHideWriteOnly}"
            exportparts="schema-description:schema-description, schema-multiline-toggle:schema-multiline-toggle"
          >
          </schema-tree>`
    }`;
  }
}
