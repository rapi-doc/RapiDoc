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
    </style>
    <div class="col regular-font response-panel ${this.renderStyle === 'read' ? 'read-mode' : 'view-mode'}">
      <div class="req-res-title">RESPONSE</div>
      <div style='padding-left:${this.renderStyle === 'read' ? '16px' : '0'};'>
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
          ${Object.keys(this.responses).map((status, index) => html`
          <button 
            @click="${() => this.changeSelectedStatus(status)}}"
            class='m-btn small ${this.selectedStatus === status ? 'primary' : ''}' 
            style='margin: 8px 4px 0 0'> ${status} </button>
          `)}`
        : ''
      }  
      </div>

      ${Object.keys(this.responses).map((status, index) => html`
        <div style = 'display: ${status === this.selectedStatus ? 'block' : 'none'}' >
          <div class="resp-head ${index === 0 ? 'top-gap' : 'divider'}">
            <span class="resp-status">${status}:</span> 
            <span class="resp-descr">${this.responses[status].description}</span> 
            ${(this.headersForEachRespStatus[status] && this.headersForEachRespStatus[status].length > 0)
              ? html`
                <div style="padding:12px 0 5px 0" class="resp-status">Response Headers:</div> 
                <table>
                  ${this.headersForEachRespStatus[status].map((v) => html`
                    <tr>
                      <td style="padding:0 12px;vertical-align: top;" class="regular-font-size"> ${v.name}</td> 
                      <td style="padding:0 12px;vertical-align: top; line-height:14px" class="descr-text small-font-size">
                        <span class="m-markdown-small">${unsafeHTML(marked(v.description || ''))}</span>
                        ${(v.schema && v.schema.example) ? html`<br/><span style="font-weight:bold">EXAMPLE:</span> ${v.schema.example}` : ''}
                      </td>
                    </tr>
                  `)}
                </table>`
              : ''
            }
          </div>

          ${Object.keys(this.mimeResponsesForEachStatus[status]).map(
            (mimeType) => (mimeType.includes('octet-stream')
              ? html`
                <div> 
                  <span style='color:var(--primary-color)'> Content-Type: </span> 
                  ${mimeType} (Binary Data) 
                </div>`
              : html`
                <div class="tab-panel col">
                  <div id="${status}_${mimeType}_tab-buttons" @click="${this.activateTab}" class="tab-buttons row" >
                    <button class="tab-btn active" content_id="${status}_${mimeType}_example">EXAMPLE</button>
                    <button class="tab-btn" content_id="${status}_${mimeType}_model">MODEL</button>
                    <div style="flex:1"></div>
                    <div style="align-self:center;font-size:var(--font-size-small);"> ${mimeType} </div>
                  </div>
                  <div id="${status}_${mimeType}_example" class="tab-content col" style="flex:1; ">
                    ${this.mimeResponsesForEachStatus[status][mimeType].examples[0].exampleFormat === 'json'
                      ? html`
                        <json-tree 
                          class="border tree"
                          render-style = '${this.renderStyle}'
                          .data="${this.mimeResponsesForEachStatus[status][mimeType].examples[0].exampleValue}"
                        ></json-tree>`
                      : html`
                        <pre class='multiline'>${this.mimeResponsesForEachStatus[status][mimeType].examples[0].exampleValue}</pre>
                      `
                    }
                  </div>
                  <div id="${status}_${mimeType}_model" class="tab-content col" style="flex:1;display:none">
                    ${this.schemaStyle === 'table'
                      ? html`
                        <schema-table
                          class = 'border'
                          render-style = '${this.renderStyle}'
                          .data = '${this.mimeResponsesForEachStatus[status][mimeType].schemaTree}'
                        > </schema-tree> `
                      : html`
                        <schema-tree
                          class = 'border'
                          render-style = '${this.renderStyle}'
                          .data = '${this.mimeResponsesForEachStatus[status][mimeType].schemaTree}'
                        > </schema-tree>`
                    }
                  </div>
                </div>
              `),
            )
          }
        </div>
      `)}
    `;
  }

  responseMimeTemplate() {

  }
  /* eslint-enable indent */

  changeSelectedStatus(status) {
    this.selectedStatus = status;
    this.requestUpdate();
  }

  activateTab(e) {
    if (e.target.classList.contains('active') || e.target.classList.contains('tab-btn') === false) {
      return;
    }
    const activeTabBtn = e.currentTarget.parentNode.querySelector('.tab-btn.active');
    activeTabBtn.classList.remove('active');
    e.target.classList.add('active');
    const showContentElsId = e.target.attributes.content_id.value;
    const allContentEls = e.currentTarget.parentNode.querySelectorAll('.tab-content');
    if (showContentElsId) {
      allContentEls.forEach((v) => {
        v.style.display = v.attributes.id.value === showContentElsId ? 'flex' : 'none';
      });
    }
  }
}

// Register the element with the browser
customElements.define('api-response', ApiResponse);
