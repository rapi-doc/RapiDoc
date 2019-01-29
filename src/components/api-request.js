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
        font-family:var(--font-regular);
        font-size:var(--title-font-size);
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
        font-family: var(--font-mono);
      }
      .param-type{
        color: var(--light-fg); 
        font-family: var(--font-regular);
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
        font-family:var(--font-mono);
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
    <div class="col regular-font request-panel">
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
    let textareaExampleHtml='';
    let formDataHtml='';
    let isFormDataPresent   = false;
    let reqSchemaTree="";

    let content = this.request_body.content;
    for(let mimeReq in content ) {
      if (mimeReq.includes('json')){shortMimeTypes[mimeReq]='json';}
      else if (mimeReq.includes('xml')){shortMimeTypes[mimeReq]='xml';}
      else if (mimeReq.includes('text/plain')){shortMimeTypes[mimeReq]='text';}
      else if (mimeReq.includes('form-urlencoded')){shortMimeTypes[mimeReq]='form';}
      else if (mimeReq.includes('multipart-form')){shortMimeTypes[mimeReq]='multipart-form';}

      let mimeReqObj = content[mimeReq];
      let reqExample="";
      if (mimeReq.includes('json') || mimeReq.includes('xml') || mimeReq.includes('text/plain')){
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
        textareaExampleHtml = textareaExampleHtml +  `
          <textarea 
            class="mono request-body-param ${shortMimeTypes[mimeReq]}" 
            data-ptype="${mimeReq}" 
            style="min-height:180px; padding:16px; display:${shortMimeTypes[mimeReq]==='json'?'block':'none'}; 
          ">${reqExample[0].exampleValue}</textarea>`
      }
      else if (mimeReq.includes('form') || mimeReq.includes('multipart-form')){
        isFormDataPresent = true;
        for (let fieldName in mimeReqObj.schema.properties){
          formDataHtml = formDataHtml + `<tr> 
            <td style="min-width:80px">
              <div class="param-name">${fieldName}</div>
              <div class="param-type">
                ${mimeReqObj.schema.properties[fieldName].type} 
                ${mimeReqObj.schema.properties[fieldName].format?`(${mimeReqObj.schema.properties[fieldName].format})`:''}
              </div>
            </td>
            <td style="min-width:100px">
              <input 
                type="${mimeReqObj.schema.properties[fieldName].format==='binary'?'file':'text'}" 
                name="${fieldName}"
                class="request-form-param"
                style="width:100%"
                data-pname="${fieldName}" 
                data-ptype="body-form" 
              />
            </td>
            <td>
              ${mimeReqObj.schema.properties[fieldName].description ?`<span class="m-markdown">${marked(mimeReqObj.schema.properties[fieldName].description)}</span>`:''}
            </td>  
          </tr>`
        }
        formDataHtml = `<form class="${shortMimeTypes[mimeReq]}"><table style="width: 100%" class="m-table">${formDataHtml}</table></form>`;  
      }
      mimeReqCount++;
    }

    return html`
      <div class="table-title top-gap ${isFormDataPresent?'form_data':'body_data'} "> ${isFormDataPresent?'FORM':'BODY'} DATA ${this.request_body.required?'(required)':''} </div>
      ${bodyDescrHtml}
      ${isFormDataPresent?html`${unsafeHTML(formDataHtml)}`
        :html`
        <div class="tab-panel col" style="border-width:0; min-height:200px">
          <div id="tab_buttons" class="tab-buttons row" @click="${this.activateTab}">
            <button class="tab-btn active" content_id="tab_example">EXAMPLE </button>
            <button class="tab-btn" content_id="tab_model">MODEL</button>
            <div style="flex:1"> </div>
            <div style="color:var(--light-fg); align-self:center; font-size:12px; margin-top:8px;">
              ${mimeReqCount==1?`
                ${Object.keys(shortMimeTypes)[0]}
              `:html`
                ${Object.keys(shortMimeTypes).map(k => html`
                  ${shortMimeTypes[k]==='json'?html`
                    <input type='radio' name='request_body_type' value='${shortMimeTypes[k]}' @change="${this.onMimeTypeChange}" checked style='margin:0 0 0 8px'/>
                  `
                  :html`
                    <input type='radio' name='request_body_type' value='${shortMimeTypes[k]}' @change="${this.onMimeTypeChange}" style='margin:0 0 0 8px'/>
                  `}
                  ${shortMimeTypes[k]}` 
                )}
              `}
            </div>
          </div>
          <div id="tab_example" class="tab-content col" style="flex:1; ">
            ${unsafeHTML(textareaExampleHtml)}
          </div>
          <div id="tab_model" class="tab-content col" style="flex:1;display:none">
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
        <button class="tab-btn active" content_id="tab_response_text"> RESPONSE </button>
        <button class="tab-btn" content_id="tab_response_headers"> RESPONSE HEADERS</button>
        <div style="flex:1"></div>
        <button class="m-btn" style='margin-bottom:5px' @click="${this.clearResponseData}">CLEAR</button>
      </div>
      <div id="tab_response_text" class="tab-content col" style="flex:1; ">
        <textarea class="mono" style="min-height:180px; padding:16px; white-space:nowrap;"> ${this.responseText} </textarea>
      </div>
      <div id="tab_response_headers" class="tab-content col" style="flex:1;display:none">
        <textarea class="mono" style="min-height:180px; padding:16px; white-space:nowrap;"> ${this.responseHeaders} </textarea>
      </div>
    </div>`}
    `
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

  onTryClick(e){
    let me = this;
    let requestPanelEl = e.target.closest(".request-panel");
    let pathParamEls   = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='path']")];
    let queryParamEls  = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='query']")];
    let headerParamEls = [...requestPanelEl.querySelectorAll(".request-param[data-ptype='header']")];
    let formParamEls   = [...requestPanelEl.querySelectorAll(".request-form-param")];
    let bodyParamEls   = [...requestPanelEl.querySelectorAll(".request-body-param")];

    let url = me.path;
    let fetchOptions={
      'mode'   : "cors",
      'method' : this.method.toUpperCase(),
      'headers':{},
    }

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
        fetchOptions.headers[el.dataset.pname] =  el.value;
      }
    });

    //Form Params
    if (formParamEls.length>=1){
      let formEl = requestPanelEl.querySelector("form");
      fetchOptions.body = new FormData(formEl);
      if (formEl.classList.contains("form-urlencoded")){
        fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
      }
      else{
        fetchOptions.headers['Content-Type'] = 'multipart/form-data; charset=utf-8'
      }
    }

    //Body Params (json/xml/text)
    if (bodyParamEls.length>=1){
      if (bodyParamEls.length===1){
        fetchOptions.headers['Content-Type'] = bodyParamEls[0].dataset.ptype;
        fetchOptions.body=bodyParamEls[0].value;
      }
      else{
        let mimeTypeRadioEl = e.target.closest(".request-panel").querySelector("input[name='request_body_type']:checked");
        let selectedBody = mimeTypeRadioEl===null?'json':mimeTypeRadioEl.value;
        let bodyData='';
        if (selectedBody === 'json'){
          bodyData = requestPanelEl.querySelector(".request-body-param.json").value;
          fetchOptions.headers['Content-Type'] = 'application/json; charset=utf-8'
          fetchOptions.body=bodyData;
        }
        else if (selectedBody === 'xml'){
          bodyData = requestPanelEl.querySelector(".request-body-param.xml").value;
          fetchOptions.headers['Content-Type'] = 'application/xml; charset=utf-8'
          fetchOptions.body=bodyData;
        }
        else if (selectedBody === 'text'){
          bodyData = requestPanelEl.querySelector(".request-body-param.text").value;
          fetchOptions.headers['Content-Type'] = 'text/plain; charset=utf-8'
          fetchOptions.body=bodyData;
        }
      }
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
