import { LitElement, html } from 'lit-element';
import marked from 'marked';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { schemaInObjectNotation, generateExample } from '@/utils/common-utils';
import FontStyles from '@/styles/font-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import InputStyles from '@/styles/input-styles';
import TabStyles from '@/styles/tab-styles';
import '@/components/schema-tree';
import '@/components/schema-table';

export default class ApiResponse extends LitElement {
  constructor() {
    super();
    this.selectedStatus = '';
    this.headersForEachRespStatus = {};
    this.mimeResponsesForEachStatus = {};
    this.activeSchemaTab = 'model';
  }

  render() {
    return html`
    ${FontStyles}
    ${FlexStyles}
    ${TableStyles}
    ${InputStyles}
    ${TabStyles}
    <style>
      .resp-head{
        vertical-align: middle;
        padding:16px 0 8px;
      }
      .resp-head.divider{
        border-top: 1px solid var(--border-color);
        margin-top:10px;
      }
      .resp-status{ 
        font-weight:bold;
        font-size:calc(var(--font-size-small) + 1px);
      }
      .resp-descr{
        font-size:calc(var(--font-size-small) + 1px);
        color:var(--light-fg);
      }
      .top-gap{margin-top:16px;}
      .descr-text{
        color:var(--light-fg);
        font-family:var(--font-regular);
      }
      .text-example{
        padding:16px;
        font-size:var(--font-size-small);
        margin:0;
      }
      .read.text-example{
        border: 1px solid var(--border-color);
      }
      .read-mode{
        padding-top:24px;
        margin-top:12px;
        border-top: 1px dashed var(--border-color);

      }
    </style>
    <div class="col regular-font response-panel ${this.renderStyle === 'read' ? 'read-mode' : 'view-mode'}">
      <div class="req-res-title">RESPONSE</div>
      <div>
        ${this.responseTemplate()}
      <div>  
    </div>  
    `;
  }

  static get properties() {
    return {
      responses: { type: Object },
      parser: { type: Object },
      schemaStyle: { type: String, attribute: 'schema-style' },
      renderStyle: { type: String, attribute: 'render-style' },
      selectedStatus: { type: String },
      selectedMimeType: { type: String },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
    };
  }

  /* eslint-disable indent */
  responseTemplate() {
    if (!this.responses) { return ''; }
    for (const statusCode in this.responses) {
      if (!this.selectedStatus) {
        this.selectedStatus = statusCode;
      }
      const allMimeResp = {};
      for (const mimeResp in this.responses[statusCode].content) {
        const mimeRespObj = this.responses[statusCode].content[mimeResp];
        if (!this.selectedMimeType) {
          this.selectedMimeType = mimeResp;
        }
        // Generate Schema
        const schemaTree = schemaInObjectNotation(mimeRespObj.schema, {});

        // Generate Example
        const respExample = generateExample(
          mimeRespObj.examples ? mimeRespObj.examples : '',
          mimeRespObj.example ? mimeRespObj.example : '',
          mimeRespObj.schema,
          mimeResp,
          true,
          mimeResp.includes('json') ? 'json' : 'text',
        );
        allMimeResp[mimeResp] = {
          description: this.responses[statusCode].description,
          examples: respExample,
          schemaTree,
        };
      }
      // Headers for each response status
      const tempHeaders = [];
      for (const key in this.responses[statusCode].headers) {
        tempHeaders.push({ name: key, ...this.responses[statusCode].headers[key] });
      }
      this.headersForEachRespStatus[statusCode] = tempHeaders;
      this.mimeResponsesForEachStatus[statusCode] = allMimeResp;
    }

    return html`
      ${Object.keys(this.responses).length > 1
        ? html`<div class='row'>
          ${Object.keys(this.responses).map((respStatus) => html`
          <button 
            @click="${() => { this.selectedStatus = respStatus; }}"
            class='m-btn small ${this.selectedStatus === respStatus ? 'primary' : ''}' 
            style='margin: 8px 4px 0 0'> ${respStatus} </button>
          `)}`
        : ''
      }  
      </div>

      ${Object.keys(this.responses).map((status) => html`
        <div style = 'display: ${status === this.selectedStatus ? 'block' : 'none'}' >
          <div class="top-gap ">
            <span class="resp-status">${status}:</span> 
            <span class="resp-descr">${this.responses[status].description}</span> 
            ${(this.headersForEachRespStatus[status] && this.headersForEachRespStatus[status].length > 0)
              ? html`${this.responseHeaderListTemplate(this.headersForEachRespStatus[status])}`
              : ''
            }
          </div>
          ${Object.keys(this.mimeResponsesForEachStatus[status]).length === 0
            ? ''
            : html`  
              <div class="tab-panel col">
                <div class="tab-buttons row" >
                  <button class="tab-btn ${this.activeSchemaTab === 'model' ? 'active' : ''}"   data-tab = 'model' @click="${(e) => { this.activeSchemaTab = e.target.dataset.tab; }}" >MODEL</button>
                  <button class="tab-btn ${this.activeSchemaTab === 'example' ? 'active' : ''}" data-tab = 'example' @click="${(e) => { this.activeSchemaTab = e.target.dataset.tab; }}">EXAMPLE </button>
                  <div style="flex:1"></div>
                  ${Object.keys(this.mimeResponsesForEachStatus[status]).length === 1
                    ? html`<span class='small-font-size gray-text' style='align-self:center; margin-top:8px;'> ${Object.keys(this.mimeResponsesForEachStatus[status])[0]} </span>`
                    : html`${this.mimeTypeDropdownTemplate(Object.keys(this.mimeResponsesForEachStatus[status]))}`
                  }
                </div>

                <div class ='tab-content col' style = 'flex:1; display:${this.activeSchemaTab === 'example' ? 'flex' : 'none'};'>
                  ${this.mimeExampleTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                </div>
                <div class="tab-content col" style="flex:1; display:${this.activeSchemaTab === 'model' ? 'flex' : 'none'};">
                  ${this.mimeSchemaTemplate(this.mimeResponsesForEachStatus[status][this.selectedMimeType])}
                </div>

              </div>
            `
          }`)
        }
    `;
  }

  responseHeaderListTemplate(respHeaders) {
    return html`
      <div style="padding:16px 0 8px 0" class="resp-headers small-font-size upper bold-text">Response Headers:</div> 
      <table style="padding-bottom:16px;" class='small-font-size'>
        ${respHeaders.map((v) => html`
          <tr>
            <td style="padding:0 12px;vertical-align: top;"> ${v.name}</td> 
            <td style="padding:0 12px;vertical-align: top; line-height:14px" class="descr-text">
              <span class="m-markdown-small">${unsafeHTML(marked(v.description || ''))}</span>
              ${(v.schema && v.schema.example) ? html`<br/><span style="font-weight:bold">EXAMPLE:</span> ${v.schema.example}` : ''}
            </td>
          </tr>
        `)}
    </table>`;
  }


  mimeTypeDropdownTemplate(mimeTypes) {
    return html`
      <select @change="${(e) => { this.selectedMimeType = e.target.value; }}">
        ${mimeTypes.map((mimeType) => html`<option value='${mimeType}'> ${mimeType} </option>`)}
      </select>`;
  }

  mimeExampleTemplate(mimeRespDetails) {
    if (!mimeRespDetails) {
      return html`
        <pre style='color:var(--delete-color)' class = '${this.renderStyle === 'read' ? 'read text-example' : 'text-example'}'> No example provided </pre>
      `;
    }
    return html`
      ${mimeRespDetails.examples[0].exampleFormat === 'json'
        ? html`
          <json-tree 
            class="border tree"
            render-style = '${this.renderStyle}'
            .data="${mimeRespDetails.examples[0].exampleValue}"
          ></json-tree>`
        : html`
          <pre class = '${this.renderStyle === 'read' ? 'read text-example' : 'text-example'}'>${mimeRespDetails.examples[0].exampleValue}</pre>
        `
      }
    `;
  }

  mimeSchemaTemplate(mimeRespDetails) {
    if (!mimeRespDetails) {
      return html`
        <pre style='color:var(--delete-color)' class = '${this.renderStyle === 'read' ? 'read text-example' : 'text-example'}'> Schema not found</pre>
      `;
    }
    return html`
      ${this.schemaStyle === 'table'
        ? html`
          <schema-table
            class = 'border'
            render-style = '${this.renderStyle}'
            .data = '${mimeRespDetails.schemaTree}'
          > </schema-tree> `
        : html`
          <schema-tree
            class = 'border'
            render-style = '${this.renderStyle}'
            .data = '${mimeRespDetails.schemaTree}'
          > </schema-tree>`
      }`;
  }


  /* eslint-enable indent */
}

// Register the element with the browser
customElements.define('api-response', ApiResponse);
