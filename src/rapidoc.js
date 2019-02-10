import { LitElement, html, css} from 'lit-element'; 
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import MLogo from '@/components/m-logo'; 
import EndPoints from '@/components/end-points'; 
import SecuritySchemes from '@/components/security-schemes'; 

import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';

import vars from '@/styles/vars';
import ProcessSpec from '@/utils/parse-utils';
import marked from 'marked';
import clonedeep from 'lodash.clonedeep';
import debounce  from 'lodash.debounce';

export default class RapiDoc extends LitElement {

  render() {
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
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
      </style>`
      }
      ${html`<style>
        :host{
          width:100%;
          height:100%;
          margin:0;
          padding:0;
          overflow: auto;
          letter-spacing:normal;
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
          --font-regular:${this.regularFont?`${this.regularFont}`:`rapidoc, Helvetica, Arial`};
          --title-font-size:16px;
          --border-radius:2px;
        }
      </style>`} 
      
      <style>
        :host{
          display:block;
          min-width:750px;
          color:var(--fg);
          background-color:var(--bg);
          font-family:var(--font-regular);
        }

        .body-container{margin:0 16px;}
        .section-gap{padding: 28px 0px 4px 20px;}
        .doc-info{padding:16px 20px;}
        .header-title{font-size:24px; padding:0 8px;}
        .tag{text-transform: uppercase;}
        .header{
          background-color:var(--header-bg);
          color:var(--header-fg);
        }

        input.header-input{
          background:${this.headerColor?vars.color.brightness(this.headerColor, -20):vars.color.inputReverseBg};
          color:var(--header-fg);
          border:1px solid var(--dark-primary-color);
          width:450px; 
          border-radius:3px;
        }
        input.header-input::placeholder {opacity:0.4;}

      </style>

      ${this.showHeader==='false'?'':html`
      <div class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px;position:sticky;top:0;">
        <div style="display:flex; align-items: center;">
          <m-logo style="height:36px;width:36px;margin-left:5px"></m-logo>
          <div class="header-title">${this.headingText}</div>
        </div>  
        <div style="margin: 0px 8px;display:flex">
          <input id="spec-url" type="text" class="large header-input" style="padding-right:36px" placeholder="Spec URL" value="${this.specUrl}" @change="${this.onSepcUrlChange}">
          <div style="margin: 6px 15px 0 -30px; font-size:24px; cursor:pointer;">&#x23ce;</div>
          <input id="spec-file" type="file" style="display:none" value="${this.specFile}" @change="${this.onSepcFileChange}" >
          <button class="m-btn" style="margin-left:10px;"  @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
        </div>
        <div style="flex:1"></div>  
      </div>`}
      <div class="body-container regular-font">
        ${this.showInfo==='false' || !this.resolvedSpec || !this.resolvedSpec.info ?``:html`
        <div class="doc-info">
          <div class="title">
            ${this.resolvedSpec.info.title}
            ${!this.resolvedSpec.info.version?"":html`
              <span style="font-size:14px;font-weight:bold">
                ${this.resolvedSpec.info.version}
              </span>`
            }
          </div>
          ${this.resolvedSpec.info.description?html`
            ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description)}</div>`)}
          `:``}
        </div>`
        }

        ${(this.developerMode==='false' || !this.resolvedSpec || !this.resolvedSpec.servers || this.resolvedSpec.servers.length===0) ?``:html`
        <div class="sub-title regular-font section-gap">
          <a id="api_server_options"> API SERVER: </a>
          <div style="margin: 8px 0; font-size:12px">
            ${this.resolvedSpec.servers.map(server => html`
                <input type='radio' name='api_server' value='${server.url}' @change="${this.onApiServerChange}" checked style='margin:0 0 5px 8px'/>
                ${server.url}<br/>
              `)} 
          </div>
        </div>  
        `}

        ${!this.resolvedSpec || !this.resolvedSpec.securitySchemes?'':html`
        <div class="sub-title regular-font section-gap">
          <security-schemes 
            .schemes="${this.resolvedSpec.securitySchemes}" 
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
              server           = "${this.server?this.server:''}"  
              api-key-name     = "${this.apiKeyName?this.apiKeyName:''}"
              api-key-value    = "${this.apiKeyValue?this.apiKeyValue:''}"
              api-key-location = "${this.apiKeyLocation?this.apiKeyLocation:''}"
              layout           = "${this.layout?this.layout:'row'}"
              .paths           = "${tag.paths}" 
            ></end-points>
          `)}`
        :''}
      </div>  
    `}

    static get properties() {
      return {
        specUrl : { type: String, attribute: 'spec-url' },
        specFile: { type: String, attribute: false },
        server   : { type: String},
        headingText : { type: String, attribute: 'heading-text'  },
        headerColor : { type: String, attribute: 'header-color'  },
        primaryColor: { type: String, attribute: 'primary-color' },
        regularFont : { type: String, attribute: 'regular-font'  },
        monoFont    : { type: String, attribute: 'mono-font'   },
        showHeader  : { type: String, attribute: 'show-header' },
        layout  : { type: String },
        theme   : { type: String },
        logoUrl : { type: String , attribute: 'logo-url'  },
        showTry : { type: Boolean, attribute: 'show-try'  },
        showInfo: { type: Boolean, attribute: 'show-info' },
        showAuthentication: { type: Boolean, attribute: 'show-authentication' },
        apiKeyName    : { type: String, attribute: 'api-key-name' },
        apiKeyValue   : { type: String, attribute: 'api-key-value' },
        apiKeyLocation: { type: String, attribute: 'api-key-location' },
      };
    }
    attributeChangedCallback(name, oldVal, newVal) {
      if (name=='spec-url'){
        console.log("url changed")
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
        this.server = apiServerRadioEl.value;
      }
    }

    onSecurityChange(e){
      this.apiKeyName = e.detail.keyName
      this.apiKeyValue = e.detail.keyValue
      this.apiKeyLocation= e.detail.keyLocation;
    }

    loadSpec(specUrl) {
      let me = this;
      if (!specUrl){
        return;
      }
      this.apiKeyName     = "";
      this.apiKeyValue    = "";
      this.apiKeyLocation = "";
      this.server         = ""

      ProcessSpec(specUrl).then(function(spec){
        if (spec===undefined || spec === null){
          console.error('Onoes! The API is invalid. ');
        }
        console.log(spec);
        me.afterSpecParsedAndValidated(spec);
      })
      .catch(function(err) {
        me.loading=false;
        alert("The API Spec is invalid or not readable ");
        console.error('Onoes! The API is invalid. ' + err.message);
      });
    }

    afterSpecParsedAndValidated(spec, isReloadingSpec=false){
      let me = this;
      this.resolvedSpec = clonedeep(spec); //spec;
      this.resolvedSpecMaster = clonedeep(spec);
      this.requestUpdate();
      window.setTimeout(function(){
        me.onApiServerChange()
      },0);

    }
}
customElements.define('rapi-doc', RapiDoc);
