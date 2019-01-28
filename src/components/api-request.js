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
        outline:none;
        font-size:12px;
        margin-right:16px;
        padding:1px;
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
      .response-url{
        font-size:12px;
        white-space:nowrap;
        overflow:hidden;
        color:var(--light-fg);
        font-family:${vars.font.mono};
        margin-bottom:2px;
        text-overflow: ellipsis;
      }
      .response-message.error{
        color:var(--error-color);
        font-weight:bold;
        text-overflow: ellipsis;
      }
      .response-message.success{
        color:var(--success-color);
        font-weight:bold;
        text-overflow: ellipsis;
      }

    </style>
    <div class="col regular-font">
    <div class="title">REQUEST</div>
    ${this.inputParametersTemplate('path')}
    ${this.inputParametersTemplate('query')}
    ${this.requestBodyTemplate()}
    ${this.inputParametersTemplate('header')}
    ${this.inputParametersTemplate('cookie')}
    ${this.apiCallTemplate()}
    </div>
    `
  }

  constructor() {
    super();
    this.responseMessage = '';
    this.responseStatus  = 'success';
    this.responseHeaders = '';
    this.responseText    = '';
    this.responseUrl     = '';

  }

  static get properties() {
    return {
      server      :{type: String},
      method      :{type: String},
      path        :{type: String},
      parameters  :{type: Array},
      request_body:{type: Object},
      responseMessage:{type: String, attribute:false},
      responseText   : {type: String, attribute:false},
      responseHeaders: {type: String, attribute:false},
      responseStatus : {type: String, attribute:false},
      responseUrl    : {type: String, attribute:false},
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
          <input type="text" class="request-param" data-pname="${param.name}" data-ptype="${paramType}" style="width:100%" value="${param.example?param["x-example"]:''}">
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
    
    let mimeReqCount=0;
    let shortMimeTypes={};
    let bodyDescrHtml = this.request_body.description? html`<div class="m-markdown"> ${unsafeHTML(marked(this.request_body.description))}</div>`:'';
    let mimeTypeRadioHtml='';
    let textareaExampleHtml='';
    let formDataHtml='';
    let isFormDataPresent= false;
    let reqSchemaTree="";

    let content = this.request_body.content;
    for(let mimeReq in content ) {
      if (mimeReq.includes('json')){shortMimeTypes[mimeReq]='json';}
      else if (mimeReq.includes('xml')){shortMimeTypes[mimeReq]='xml';}
      else if (mimeReq.includes('form')){shortMimeTypes[mimeReq]='form';}

      let mimeReqObj = content[mimeReq];
      let reqExample="";
      if (mimeReq.includes('json') || mimeReq.includes('xml')){
        //Remove Circular references from RequestBody json-schema 
        try {
          mimeReqObj.schema = JSON.parse(JSON.stringify(mimeReqObj.schema, removeCircularReferences()));
        } 
        catch{
          console.error("Unable to resolve circular refs in schema", mimeReqObj.schema);
          return;
        }
        reqSchemaTree = schemaToModel(mimeReqObj.schema,{});
        reqExample    = generateExample(mimeReqObj.examples, mimeReqObj.example, mimeReqObj.schema, mimeReq, "text");
        textareaExampleHtml = textareaExampleHtml +  `<textarea class="mono request-body-param ${shortMimeTypes[mimeReq]}" data-ptype="${shortMimeTypes[mimeReq]}" style="min-height:180px; padding:16px; display:${shortMimeTypes[mimeReq]==='json'?'block':'none'}; ">${reqExample[0].exampleValue}</textarea>`
      }
      else if (mimeReq.includes('form')){
        isFormDataPresent = true;
        for (let fieldName in mimeReqObj.schema.properties){
          formDataHtml = formDataHtml + `<tr> 
            <td style="min-width:80px">
              <div class="param-name">${fieldName}</div>
              <div class="param-type">${mimeReqObj.schema.properties[fieldName].type}</div>
            </td>  
            <td style="min-width:100px">
              <input type="text" class="request-param" data-pname="${fieldName}" data-ptype="body-form" style="width:100%" value="">
            </td>
            <td>
              ${mimeReqObj.schema.properties[fieldName].description ? marked(mimeReqObj.schema.properties[fieldName].description):''}
            </td>  
          </tr>`
        }
        formDataHtml = `<table style="width: 100%" class="m-table">${formDataHtml}</table>`;  
      }
      mimeReqCount++;
    }

    return html`
      <div class="table-title top-gap">BODY DATA ${this.request_body.required?'(required)':''} </div>
      ${bodyDescrHtml}
      ${isFormDataPresent?html`${unsafeHTML(formDataHtml)}`
        :html`
        <div class="tab-panel col" style="border-width:0; min-height:200px">
          <div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}">
            <button class="tab-btn active" content_id="json_example">EXAMPLE </button>
            <button class="tab-btn" content_id="json_model">MODEL</button>
            <div style="flex:1"> </div>
            ${mimeReqCount<=0?``:html`
              <div style="color:var(--light-fg); align-self:center; font-size:12px; margin-top:8px;">
                ${Object.keys(shortMimeTypes).map(k => html`
                  <input type='radio' name='body_type' value='${shortMimeTypes[k]}' @change="${this.onMimeTypeChange}" style='margin:0 0 0 8px'/>  ${shortMimeTypes[k]}` 
                )}
              </div>
            `}
          </div>
          <div id="json_example" class="tab-content col" style="flex:1; ">
            ${unsafeHTML(textareaExampleHtml)}
          </div>
          <div id="json_model" class="tab-content col" style="flex:1;display:none">
            <schema-tree class="border" style="padding:16px;" .data="${reqSchemaTree}"></schema-tree>
          </div>
        </div>`
      }`


  }

  apiCallTemplate(){
    return html`
    <div style="display:flex; align-items: center; margin:16px 0">
      <button class="m-btn" @click="${this.onTryClick}">TRY</button>
      <div style="font-size:12px; margin:0 5px; width:calc(100% - 50px);">
        <div class='response-url'> ${this.responseUrl} </div>
        <div class="response-message ${this.responseStatus}" >${this.responseMessage}</div>
      </div>
    </div>
    ${this.responseMessage===''?'':html`
    <div class="tab-panel col" style="border-width:0; min-height:200px">
      <div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}">
        <button class="tab-btn active" content_id="content_aa"> RESPONSE </button>
        <button class="tab-btn" content_id="content_bb"> RESPONSE HEADERS</button>
        <div style="flex:1"></div>
        <button class="m-btn" style='margin-bottom:5px' @click="${this.clearResponseData}">CLEAR</button>
      </div>
      <div id="content_aa" class="tab-content col" style="flex:1; ">
        <textarea class="mono" style="min-height:180px; padding:16px; white-space:nowrap;"> ${this.responseText} </textarea>
      </div>
      <div id="content_bb" class="tab-content col" style="flex:1;display:none">
        <textarea class="mono" style="min-height:180px; padding:16px; white-space:nowrap;"> ${this.responseHeaders} </textarea>
      </div>
    </div>`}`
  }

  activateTab(e){
    if (e.target.classList.contains("active")  || e.target.classList.contains("tab-btn")===false){
      return;
    }

    let activeTabBtn  = e.currentTarget.parentNode.querySelector('.tab-btn.active');
    let clickedTabBtn = e.target;
    activeTabBtn.classList.remove("active");
    e.target.classList.add("active");
    let showContentEl = this.shadowRoot.getElementById(clickedTabBtn.attributes.content_id.value);
    let allContentEls = e.currentTarget.parentNode.querySelectorAll('.tab-content');
    if (showContentEl){
      showContentEl.style.display="flex";
      allContentEls.forEach(function(v){
        if (v.attributes.id.value !== clickedTabBtn.attributes.content_id.value){
          v.style.display="none";
        }
      })
    }
  }


  onMimeTypeChange(e){
    let textareaEls = e.target.closest('.tab-panel').querySelectorAll(`textarea.request-body-param`);
    [...textareaEls].map(function(el){
      el.style.display = el.classList.contains(e.target.value)?"block":"none";
    });
  }

  onTryClick(){
    let me = this;
    let pathParamEls   = [...this.shadowRoot.querySelectorAll(".request-param[data-ptype='path']")];
    let queryParamEls  = [...this.shadowRoot.querySelectorAll(".request-param[data-ptype='query']")];
    let headerParamEls = [...this.shadowRoot.querySelectorAll(".request-param[data-ptype='header']")];
    let bodyParamEl = this.shadowRoot.querySelector(".request-body-param");
    let url = me.path;
    let headers = {'Content-Type': 'application/json'};

    //Path Params
    pathParamEls.map(function(el){
      url = url.replace("{"+el.dataset.pname+"}", el.value);
    });
    //Query Params
    if (queryParamEls.length>0){
      let queryParam = new URLSearchParams("");
      queryParamEls.map(function(el){
        queryParam.append(el.dataset.pname, el.value);
      })
      url = `${url}?${queryParam.toString()}`;
    }
    url = `${this.server.replace(/\/$/, "")}${url}`;

    //Header Params
    headerParamEls.map(function(el){
      if (el.value){
        headers[el.dataset.pname] =  el.value;
      }
    });

    let fetchOptions={
      'mode': "cors",
      'method': this.method.toUpperCase(),
      'headers':headers
    }

    //Body Params
    if (bodyParamEl){
      fetchOptions.body=JSON.stringify(bodyParamEl.value) // data can be `string` or {object}!
    }

    me.responseUrl     = '';
    me.responseHeaders = '';
    me.responseText    = '';
    me.responseStatus  = 'success';
    me.responseMessage = ''

    fetch(url,fetchOptions).then(function(resp){
      me.responseStatus  = resp.ok ? 'success':'error';
      me.responseMessage = `${resp.statusText}:${resp.status}`;
      me.responseUrl     = resp.url;
      resp.headers.forEach(function(hdrVal, hdr) {
        me.responseHeaders = me.responseHeaders + `${hdr.trim()}: ${hdrVal}`+"\n";
      });
      let contentType = resp.headers.get("content-type");
      if(contentType && contentType.includes("json")) {
        resp.json().then(function(respObj) {
          me.responseText = JSON.stringify(respObj,null,2);
        })
      }
      else{
        resp.text().then(function(respText) {
          me.responseText = respText;
        })
      }
    })
    .catch(function(err){
      me.responseMessage = err.message + " (CORS or Network Issue)";
    });
  }

  clearResponseData(){
    this.responseUrl     = '';
    this.responseHeaders = '';
    this.responseText    = '';
    this.responseStatus  = 'success';
    this.responseMessage = ''
  }

}
// Register the element with the browser
customElements.define('api-request', ApiRequest);
