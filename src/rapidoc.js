import { LitElement, html, css} from 'lit-element'; 
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import MLogo from '@/components/m-logo'; 
import EndPoints from '@/components/end-points'; 
import SecuritySchemes from '@/components/security-schemes'; 

import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';

import vars from '@/styles/vars';
import ProcessSpec from '@/utils/parse-utils';
import marked from 'marked';

export default class RapiDoc extends LitElement {

  render() {
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
      ${TableStyles}
      ${this.theme==='dark'?
      html`<style>
        :host{
          --bg:#333;
          --bg2:#444;
          --fg:#bbb;
          --fg2:#aaa;
          --light-fg:#777;
          --very-light-fg:#666;
          --pre-border-color:#666;
          --pre-fg:#fff;
          --pre-bg:#222;
          --code-fg:#ccc;
          --code-bg:transparent;
          --border-color:#666;
          --input-bg:#303030;
          --input-border-color:#297aa2;
          --placeholder-color:#666;
          --light-border-color:#444;
          --light-get-color:#2a2a2a;
          --light-put-color:#2a2a2a;
          --light-post-color:#2a2a2a;
          --light-delete-color:#2a2a2a;
          --light-patch-color:#2a2a2a;
          --hover-color:#2a2a2a;
        }
      </style>`
      :html`<style>
        :host{
          --bg:#fff;
          --bg2:#fafafa;
          --fg:#333;
          --fg2:#565656;
          --light-fg:#999;
          --very-light-fg:#bbb;
          --pre-border-color:#000;
          --pre-fg:#ccc;
          --pre-bg:#263238;
          --code-fg:#ccc;
          --code-bg:transparent;
          --border-color:#ccc;
          --input-bg:#fff;
          --input-border-color:#C5D9E8;
          --placeholder-color:#dedede;
          --light-border-color:#eee;
          --light-get-color:#eff8fd;
          --light-put-color:#fff5e6;
          --light-post-color:#fbfff0;
          --light-delete-color:#fff0f0;
          --light-patch-color:#fff5cc;
          --hover-color:#f7f7f7;
        }
      </style>`}      
      <style>
        :host{
          --error-color:#ff3333;
          --success-color:#47AFE8;
          --hover-bg:#f7f7f7;
          --get-color:#47AFE8;
          --put-color:#FF9900;
          --post-color:#99CC00;
          --delete-color:#F06560;
          --patch-color:#fc0;
          --link-color:#47AFE8;
          --primary-color:${this.primaryColor?`${this.primaryColor}`:`#FF791A`};
          --dark-primary-color:${vars.color.brightness(this.primaryColor?this.primaryColor:'#FF791A', -30)};
          --primary-text:${this.primaryColor?`${vars.color.invert(this.primaryColor)}`:`#ffffff`};
          --header-bg:${this.headerColor?`${this.headerColor}`:`#444`};
          --header-fg:${this.headerColor?`${vars.color.invert(this.headerColor)}`:`#ccc`};
          --layout:${this.layout?`${this.layout}`:`row`};
          --font-mono:${this.monoFont?`${this.monoFont}`:`Monaco, 'Andale Mono', 'Roboto Mono', Consolas`}; 
          --font-mono-size:14px; 
          --font-regular:${this.regularFont?`${this.regularFont}`:`rapidoc, Helvetica, Arial`};
          --title-font-size:16px;
          --regular-font-size:14px;
          --small-font-size:12px;
          --border-radius:2px;

          display:block;
          min-width:375px;
          width:100%;
          height:100%;
          margin:0;
          padding:0;
          overflow: auto;
          letter-spacing:normal;
          color:var(--fg);
          background-color:var(--bg);
          font-family:var(--font-regular);
        }

        .body-container{ 
          margin:0;
        }
        .section-gap { 
          padding: 24px 8px 8px 8px; 
        }

        .logo { 
          height:36px;
          width:36px;
          margin-left:5px; 
        }
        .only-large-screen-flex,
        .only-large-screen{
          display:none;
        }
        .header-title{
          font-size:calc(var(--title-font-size) + 8px); padding:0 8px;
        }
        .tag{
          text-transform: uppercase;
        }
        .header{
          background-color:var(--header-bg);
          color:var(--header-fg);
        }

        input.header-input{
          background:${this.headerColor?vars.color.brightness(this.headerColor, -20):vars.color.inputReverseBg};
          color:var(--header-fg);
          border:1px solid var(--dark-primary-color);
          flex:1; 
          padding-right:24px;
          border-radius:3px;
        }
        input.header-input::placeholder {
          opacity:0.4;
        }


        @media only screen and (min-width: 768px){
          .only-large-screen{
            display:block;
          }
          .only-large-screen-flex{
            display:flex;
          }
          .body-container{ 
            margin:0 16px;
          }
          .section-gap { 
            padding: 24px 24px 8px 24px; 
          }
        }

      </style>
      ${this.showHeader==='false'?'':html`
      <div class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px;position:sticky;top:0;flex:1">
        <div class="only-large-screen-flex" style="align-items: center;">
          <slot name="logo" class="logo">
            <m-logo style="height:36px;width:36px;margin-left:5px"></m-logo>
          </slot>  
          <div class="header-title">${this.headingText}</div>
        </div>  
        <div style="margin: 0px 8px;display:flex;flex:1">

          ${ (this.allowSpecUrlLoad==='false') ?``:html`
            <input id="spec-url" type="text" class="header-input" placeholder="Spec URL" value="${this.specUrl?this.specUrl:''}" @change="${this.onSepcUrlChange}" spellcheck="false" >
            <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div> 
          `} 
          
          ${ (this.allowSpecFileLoad==='false') ?``:html`
            <input id="spec-file" type="file" style="display:none" value="${this.specFile?this.specFile:''}" @change="${this.onSepcFileChange}" spellcheck="false" >
            <button class="m-btn only-large-screen" style="margin-left:10px;"  @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
          `}
          <slot name="header"></slot>
          ${ (this.allowSearch==='false') ?``:html`  
            <input id="search" class="header-input" type="text"  placeholder="search" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
            <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div>
          `}
        </div>
      </div>`}

      <div class="body-container regular-font">
        <slot></slot>
        ${this.loading===true?html`<div style="text-align: center;margin: 16px;">Loading ... </div>`:''}
        ${ (this.showInfo==='false' || !this.resolvedSpec || !this.resolvedSpec.info) ?``:html`
        <div class="section-gap">
          <div class="title">
            ${this.resolvedSpec.info.title}
            ${!this.resolvedSpec.info.version?"":html`
              <span style="font-size:var(--small-font-size);font-weight:bold">
                ${this.resolvedSpec.info.version}
              </span>`
            }
          </div>
          ${this.resolvedSpec.info.description?html`
            ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description)}</div>`)}
          `:``}
        </div>`
        }

      ${(this.allowTry==='false' || !this.resolvedSpec)  ?``:html`
        <div class="sub-title regular-font section-gap">
          <a id="api_server_options"> API SERVER: </a>
          <div class="mono-font" style="margin: 12px 0; font-size:calc(var(--small-font-size) + 1px);">
          ${!this.resolvedSpec.servers || (this.resolvedSpec.servers.length===0)  ?``:html`
            ${this.resolvedSpec.servers.map(server => html`
                <input type='radio' name='api_server' value='${server.url}' @change="${this.onApiServerChange}" checked style='margin:2px 0 5px 8px'/>
                ${server.url}
                ${server.description ? html`- ${server.description}` : ``}
                <br/>
              `
            )}
          `}

          ${ (this.serverUrl) ?html`
            <input type='radio' name='api_server' value='${this.serverUrl}' @change="${this.onApiServerChange}" checked style='margin:2px 0 5px 8px'/>
                ${this.serverUrl}<br/>
            `:''
          }
          </div>
        </div>  
      `} 


        ${(this.allowAuthentication==='false' || !this.resolvedSpec || !this.resolvedSpec.securitySchemes)?'':html`
        <div class="sub-title regular-font section-gap">
          <security-schemes 
            .schemes="${this.resolvedSpec.securitySchemes}"
            selected-api-key-name  = "${this.apiKeyName?this.apiKeyName:''}"
            selected-api-key-value = "${this.apiKeyValue?this.apiKeyValue:''}"
            @change="${this.onSecurityChange}"
          ></security-schemes>
        </div>
        `}

        ${this.resolvedSpec && this.resolvedSpec.tags ?html`
          ${this.resolvedSpec.tags.map(tag => html`
            <div class="sub-title tag regular-font section-gap">${tag.name}</div>
            <div style="margin:4px 20px">
              ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description?tag.description:'')}</div>`)}
            </div>
            <end-points 
              selected-server  = "${this.selectedServer?this.selectedServer:''}"  
              api-key-name     = "${this.apiKeyName?this.apiKeyName:''}"
              api-key-value    = "${this.apiKeyValue?this.apiKeyValue:''}"
              api-key-location = "${this.apiKeyLocation?this.apiKeyLocation:''}"
              layout           = "${this.layout?this.layout:'row'}"
              .paths           = "${tag.paths}" 
              allow-try        = "${this.allowTry?this.allowTry:'true'}"
              match-paths      = "${this.matchPaths}"
            ></end-points>
          `)}`
        :''}
        <slot name="footer"></slot>
      </div>  
    `}
    static get properties() {
      return {
        specUrl : { type: String, attribute: 'spec-url' },
        specFile: { type: String, attribute: false },
        serverUrl  : { type: String, attribute: 'server-url'  },
        matchPaths  : { type: String, attribute: 'match-paths' },        
        headingText : { type: String, attribute: 'heading-text'  },
        headerColor : { type: String, attribute: 'header-color'  },
        primaryColor: { type: String, attribute: 'primary-color' },
        regularFont : { type: String, attribute: 'regular-font'  },
        monoFont    : { type: String, attribute: 'mono-font'   },
        showHeader  : { type: String, attribute: 'show-header' },
        showInfo    : { type: String, attribute: 'show-info'   },
        allowAuthentication: { type: String, attribute: 'allow-authentication' },
        allowTry    : { type: String, attribute: 'allow-try'    },
        allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
        allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
        allowSearch : { type: String, attribute: 'allow-search' },
        layout  : { type: String },
        theme   : { type: String },
        logoUrl : { type: String , attribute: 'logo-url' },
        apiKeyName    : { type: String, attribute: 'api-key-name' },
        apiKeyValue   : { type: String, attribute: 'api-key-value' },
        apiKeyLocation: { type: String, attribute: 'api-key-location'},
      };
    }
    attributeChangedCallback(name, oldVal, newVal) {
      if (name=='spec-url'){
        if (oldVal !== newVal){
          this.loadSpec(newVal);
        }
      }
      super.attributeChangedCallback(name, oldVal, newVal);
    }

    onSepcUrlChange(e){
      this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
    }

    onSepcFileChange(e){
      let me = this;
      this.setAttribute('spec-file', this.shadowRoot.getElementById('spec-file').value);
      let specFile = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
        try{
          let specObj = JSON.parse(reader.result);
          me.loadSpec(specObj);
          me.shadowRoot.getElementById('spec-url').value="";
        }
        catch{
          alert("Unable to read or parse json");
          console.log("Unable to read or parse json")
        }
        
      }
      // Read the Text file
      reader.readAsText(specFile);	

    }

    onFileLoadClick(){
      this.shadowRoot.getElementById('spec-file').click();
    }

    onApiServerChange(){
      let apiServerRadioEl = this.shadowRoot.querySelector("input[name='api_server']:checked");
      if (apiServerRadioEl !== null){
        this.selectedServer = apiServerRadioEl.value;
        this.requestUpdate();
      }
    }

    onSecurityChange(e){
      this.apiKeyName = e.detail.keyName
      this.apiKeyValue = e.detail.keyValue
      this.apiKeyLocation= e.detail.keyLocation;
    }

    onSearchChange(e){
      this.matchPaths = e.target.value;
    }

    loadSpec(specUrl) {
      let me = this;
      if (!specUrl){
        return;
      }
      this.loading        = true;
      this.apiKeyName     = "";
      this.apiKeyValue    = "";
      this.apiKeyLocation = "";
      this.selectedServer = "";
      this.matchPaths     = "";

      ProcessSpec(specUrl).then(function(spec){
        me.loading = false;
        if (spec===undefined || spec === null){
          console.error('Unable to resolve the API spec. ');
        }
        console.log(spec);
        me.afterSpecParsedAndValidated(spec);
      })
      .catch(function(err) {
        me.loading=false;
        console.error('Unable to resolve the API spec.. ' + err.message);
      });
    }

    afterSpecParsedAndValidated(spec, isReloadingSpec=false){
      this.resolvedSpec = spec;
      this.requestUpdate();
      window.setTimeout(()=>{
        this.onApiServerChange()
      },0);

    }
}
customElements.define('rapi-doc', RapiDoc);
