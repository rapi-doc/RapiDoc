import { LitElement, html } from 'lit-element';
import JsonTree from '@/components/json-tree'; 
import SchemaTree from '@/components/schema-tree';  
import vars from '@/styles/vars';
import TableStyles from '@/styles/table-styles';
import FlexStyles from '@/styles/flex-styles';
import InputStyles from '@/styles/input-styles';
import FontStyles from '@/styles/font-styles';
import CommonStyles from '@/styles/common-styles';
import { schemaToModel, getTypeInfo, schemaToObj, generateExample, removeCircularReferences} from '@/utils/common-utils';
import marked from 'marked';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';


// Create your custom component
export default class ApiRequest extends LitElement {
  render() {
    return html`
    ${TableStyles}
    ${InputStyles}
    ${FontStyles}
    ${FlexStyles}
    ${CommonStyles}
    <style>
      .title{
        font-family:${vars.font.regular};
        font-size:${vars.font.titleSize};
        font-weight:bold;
        margin-bottom:16px;
      }
      .param-name,
      .param-type{
        margin: 1px 0;
        text-align: right;
        line-height: 12px;
      }
      .param-name{
        color: var(--fg); 
        font-family: ${vars.font.mono};
      }
      .param-type{
        color: var(--light-fg); 
        font-family: ${vars.font.regular};
      }
      .top-gap{margin-top:24px;}
      .tab-buttons{
        height:30px;
        border-bottom: 1px solid var(--light-border-color) ;
        align-items: stretch;
      }
      .tab-btn{
        border:none;
        background-color:transparent;
        cursor:pointer;
        border-bottom: 3px solid transparent;
        outline:none;
        font-size:12px;
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
    <div class="title">${'\u21E7'} REQUEST</div>
    ${this.inputParametersTemplate('path')}
    ${this.inputParametersTemplate('query')}
    ${this.inputParametersTemplate('formData')}
    ${this.requestBodyTemplate()}
    ${this.inputParametersTemplate('header')}
    ${this.inputParametersTemplate('cookie')}
    </div>
    `
  }

  static get properties() {
    return {
      parameters  :{type: Array},
      request_body:{type: Object}
    };
  }


  inputParametersTemplate(paramType){
    let title ="";
    let filteredParams= this.parameters? this.parameters.filter(param => param.in === paramType):[];
    if (filteredParams.length == 0 ){
      return "";
    }
    if (paramType==='path'){ title = "PATH PARAMETERS"}
    else if (paramType==='query'){ title = "QUERY-STRING PARAMETERS"}
    else if (paramType==='header'){ title = "REQUEST HEADERS"}
    else if (paramType==='formData'){ title = "FORM DATA"}
    else if (paramType==='cookie'){ title = "COOKIES"}

    return html`
    <div class="table-title top-gap">${title}</div>
    <table style="width: 100%" class="m-table">
      ${filteredParams.map(param => html`<tr> 
        <td style="min-width:80px">
          <div class="param-name">
            ${param.required?html`<span style='color:orangered'>*</span>`:``}${param.name}
          </div>
          <div class="param-type">${unsafeHTML(getTypeInfo(param.schema))}</div>
        </td>  
        <td style="min-width:100px">
          <input type="text" class="m-small" style="width:100%" value="${param.example?param["x-example"]:''}">
        </td>
        <td>
          ${param.description?html`<span class="m-markdown"> ${unsafeHTML(marked(param.description))} </span> `:``}
        </td>  
      </tr>`
      )}
    </table>`
  }

  requestBodyTemplate(){
    if(!this.request_body){
      return '';
    }
    if (Object.keys(this.request_body).length == 0){
      return '';
    }
    
    let mimeRequestTypes={};
    let selectedMimeReqKey;
    let mimeReqCount=0;

    let content = this.request_body.content;
    for(let mimeReq in content ) {
      let exampleType=""; // can be json, xml, plain
      let mimeReqObj = content[mimeReq];
      let reqSchemaTree="", reqExample="";
      //Remove Circular references from RequestBody json-schema 
      try {
          mimeReqObj.schema = JSON.parse(JSON.stringify(mimeReqObj.schema, removeCircularReferences()));
      }
      catch{
          console.error("Unable to resolve circular refs in schema", mimeReqObj.schema);
          return;
      }

      // Generate the Schema Model  in Element UI tree format
      // reqSchemaTree = schemaToElTree(mimeReqObj.schema, [] );
      reqSchemaTree = schemaToModel(mimeReqObj.schema,{});
      // Generate Example
      reqExample = generateExample(mimeReqObj.examples, mimeReqObj.example, mimeReqObj.schema, mimeReq, "text");

      mimeRequestTypes[mimeReq]={
        "examples"   : reqExample,
        "schemaTree" : reqSchemaTree
      };
      selectedMimeReqKey = mimeReq;
      mimeReqCount++;
    }
    return html`
    <div class="table-title top-gap">BODY PARAMETERS</div>
    <div class="row" style="align-items:flex-end; padding:0 8px 2px 0;">
      <div class="m-text small gray"> ${this.request_body.description} </div>
    </div>
    <div id="tab_panel" class="tab-panel col" style="border-width:0; min-height:200px">
      <div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}">
        <button class="tab-btn active" content_id="content_a"> Example </button>
        <button class="tab-btn" content_id="content_b"> Model</button>
      </div>
      <div id="content_a" class="tab-content col" style="flex:1; ">
        <textarea class="mono" style="min-height:180px; padding:16px">${mimeRequestTypes[selectedMimeReqKey].examples[0]?mimeRequestTypes[selectedMimeReqKey].examples[0].exampleValue:''}</textarea>
      </div>
      <div id="content_b" class="tab-content col" style="flex:1;display:none">
        <schema-tree class="border" style="padding:16px;" .data="${mimeRequestTypes[selectedMimeReqKey].schemaTree? mimeRequestTypes[selectedMimeReqKey].schemaTree:''}"></schema-tree>
      </div>
    </div>


    
    `
  }

  activateTab(e){
    if (e.target.classList.contains("active")  || e.target.classList.contains("tab-btn")===false){
      return;
    }
    
    let activeTabBtn = this.shadowRoot.querySelector('.tab-btn.active');
    let clickedTabBtn = e.target;
    activeTabBtn.classList.remove("active");
    e.target.classList.add("active");
    let showContentEl = this.shadowRoot.getElementById(clickedTabBtn.attributes.content_id.value);
    let allContentEls = this.shadowRoot.querySelectorAll('.tab-content');
    if (showContentEl){
      showContentEl.style.display="flex";
      allContentEls.forEach(function(v){
        if (v.attributes.id.value !== clickedTabBtn.attributes.content_id.value){
          v.style.display="none";
        }
      })
    }



    //console.log(e.target.classList);

  }


}
// Register the element with the browser
customElements.define('api-request', ApiRequest);
