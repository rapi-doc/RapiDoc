import { LitElement, html } from 'lit-element'; 
import {schemaToModel, schemaToObj, generateExample, removeCircularReferences} from '@/utils/common-utils';
import vars from '@/styles/vars';
import FontStyles from '@/styles/font-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import InputStyles from '@/styles/input-styles';
import SchemaTree from '@/components/schema-tree'; 

// Create your custom component
export default class ApiResponse extends LitElement {
  render() {
    return html`
    ${FontStyles}
    ${FlexStyles}
    ${TableStyles}
    ${InputStyles}
    <style>
      .title{
        color: var(--fg);
        font-family:${vars.font.regular};
        font-size:${vars.font.titleSize};
        font-weight:bold;
        margin-bottom:8px;
      }
      .resp-head{
        vertical-align: middle;
        padding:16px 0 8px;
      }
      .resp-head.divider{border-top: 1px solid var(--border-color);}
      .resp-status{ 
        font-weight:bold;
      }
      .top-gap{margin-top:16px;}
      .tab-buttons{
        height:30px;
        border-bottom: 1px solid var(--light-border-color) ;
        align-items: stretch;
      }
      .tab-btn{
        color:var(--fg);
        border:none;
        background-color:transparent;
        cursor:pointer;
        border-bottom: 3px solid transparent;
        outline:none;
        font-size:14px;
        margin-right:16px;
      }
      .tab-btn.active{
        border-bottom: 3px solid var(--primary-color);
        font-weight:bold;
        color:var(--primary-color);
      }

      .tab-btn:hover{
        color:var(--primary-color);
      }
      .tab-content{
        margin:-1px 0 0 0;
      }
    </style>
    <div class="col regular-font">
    <div class="title">${'\u21E9'}RESPONSE</div>
    ${this.responseTemplate()}
    `

  }

  /*
    ${this.mimeResponsesForEachStatus.map(
      responsesByStatus => html`<end-point .path=${path}> </end-point>`
    )}`
    mimeResponsesForEachStatus
    ${this.responseTemplate()}
    <!-- schema-tree .data="${this.data}"></schema-tree -->
    </div>
    `
*/
  static get properties() {
    return {
      responses:{type: Object}
    };
  }

  responseTemplate(){

    let selectedMimeValueForEachStatus={};
    let headersForEachRespStatus={};
    let selectedMimeValue="";
    let mimeResponsesForEachStatus={};
    let mimeRespCountForEachStatus=0;

    for(let statusCode in this.responses) {
      let allMimeResp={};
      let mimeRespCount=0;
      for(let mimeResp in this.responses[statusCode].content ) {
        let mimeRespObj = this.responses[statusCode].content[mimeResp];
        //Remove Circular references from Response schema 
        try {
            mimeRespObj.schema = JSON.parse(JSON.stringify(mimeRespObj.schema, removeCircularReferences(0)));
        }
        catch{
            console.error("Unable to resolve circular refs in schema", mimeRespObj.schema);
            return;
        }
        
        // Generate Schema
        let schemaTree = schemaToModel(mimeRespObj.schema,{});
        
        // Generate Example
        let respExample = generateExample(mimeRespObj.examples, mimeRespObj.example, mimeRespObj.schema, mimeResp, "json");
        allMimeResp[mimeResp] = {
          "description":this.responses[statusCode].description,
          "examples"  : respExample,
          "schemaTree": schemaTree,
        }
        selectedMimeValue = mimeResp;
        selectedMimeValueForEachStatus[statusCode]= mimeResp;
        mimeRespCount++;
      }

      // Headers for each response status
      let tempHeaders=[];
      for (let key in this.responses[statusCode].headers){
        tempHeaders.push ( { "name":key, ...this.responses[statusCode].headers[key]} );
      }
      headersForEachRespStatus[statusCode] = tempHeaders;
      mimeResponsesForEachStatus[statusCode] = allMimeResp;
      //mimeRespCountForEachStatus[statusCode] = mimeRespCount;
    }
    return html`${Object.keys(this.responses).map(

      (status, index)  => html`
      <div class="resp-head ${index===0?'top-gap':'divider'}">
        <span class="resp-status">${status}:</span> 
        <span class="resp-descr">${this.responses[status].description}</span> 
      </div>      
      ${Object.keys(mimeResponsesForEachStatus[status]).map(
        mimeType => html`
          <!-- TAB PANEL -->
          <div id="${status}_${mimeType}_tab-panel" @click="${this.activateTab}" class="tab-panel col" style="border-width:0; min-height:200px">
            <div id="${status}_${mimeType}_tab-buttons" class="tab-buttons row" >
              <button class="tab-btn active" content_id="${status}_${mimeType}_content_a"> Example </button>
              <button class="tab-btn" content_id="${status}_${mimeType}_content_b"> Model</button>
              <div style="flex:1"></div>
              <div style="align-self:center;font-size:12px;"> ${mimeType} </div>
            </div>
            <div id="${status}_${mimeType}_content_a" class="tab-content col" style="flex:1; ">
              <json-tree class="border" style="padding:16px;" .data="${mimeResponsesForEachStatus[status][mimeType].examples[0].exampleValue}"></json-tree>
            </div>
            <div id="${status}_${mimeType}_content_b" class="tab-content col" style="flex:1;display:none">
              <schema-tree class="border" style="padding:16px;" .data="${mimeResponsesForEachStatus[status][mimeType].schemaTree}"></schema-tree>
            </div>
          </div>`
      )}`
    )}`
  }

  activateTab(e){
    if (e.target.classList.contains("active")  || e.target.classList.contains("tab-btn")===false){
      return;
    }
    let activeTabBtn  = e.currentTarget.querySelector(":scope .tab-btn.active");
    activeTabBtn.classList.remove("active");
    e.target.classList.add("active");
    let showContentElsId = e.target.attributes.content_id.value;
    let allContentEls = e.currentTarget.querySelectorAll(':scope > .tab-content');
    if (showContentElsId){
      allContentEls.forEach(function(v){
        v.style.display =  v.attributes.id.value === showContentElsId?"flex":"none";
      })
    }
  }


}
// Register the element with the browser
customElements.define('api-response', ApiResponse);
