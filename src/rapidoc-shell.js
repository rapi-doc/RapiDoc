import { LitElement, html, css} from 'lit-element'; 
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import MLogo from '@/components/m-logo'; 
import EndPoints from '@/components/end-points'; 
import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import CommonStyles from '@/styles/common-styles';
import FlexStyles from '@/styles/flex-styles';

import vars from '@/styles/vars';
import ProcessSpec from '@/utils/parse-utils';
import marked from 'marked';

class RapidocLayout extends LitElement {

  render() {
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
      ${this.theme==='dark'?
      html`<style>
        :host{
          --bg:#333;
          --fg:#ccc;
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
          --light-get-color:#222;
          --light-put-color:#222;
          --light-post-color:#222;
          --light-delete-color:#222;
          --light-patch-color:#222;
          --hover-color:#222;
        }
      </style>`
      :html`<style>
        :host{
          --bg:#fff;
          --fg:#333;
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
          --placeholder-color:#666;
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
          --hover-bg:#f7f7f7;
          --get-color:#47AFE8;
          --put-color:#FF9900;
          --post-color:#99CC00;
          --delete-color:#F06560;
          --patch-color:#fc0;
          --link-color:#47AFE8;
          --primary-color:${this.primaryColor?html`${this.primaryColor}`:`#FF791A`};
          --dark-primary-color:${vars.color.brightness(this.primaryColor?this.primaryColor:'#FF791A', -30)};
          --primary-text:${this.primaryColor?html`${vars.color.invert(this.primaryColor)}`:`#ffffff`};
          --header-bg:${this.headerColor?html`${this.headerColor}`:`#444`};
          --header-fg:${this.headerColor?html`${vars.color.invert(this.headerColor)}`:`#ccc`};
          --layout:${this.layout?html`${this.layout}`:`row`}
        }
      </style>`} 
      
      <style>
        :host{
          display:block;
          min-width:750px;
          color:var(--fg);
          background-color:var(--bg);
        }
        .header{
          background-color:var(--header-bg);
          color:var(--header-fg);
        }
        input.header-input{
          background:${this.headerColor?vars.color.brightness(this.headerColor, -20):vars.color.inputReverseBg};
          color:var(--header-fg);
          border:1px solid var(--dark-primary-color); 
        }
        .m-tag-title{
          font-size: 18px;
          color:var(--fg);
          margin: 28px 0px 4px;
          text-transform: uppercase;
        }

      </style>
      ${this.showHeader==='false'?'':html`
      <div class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px">
        <div style="display:flex; align-items: center;">
          <m-logo style="height:36px;width:36px;margin-left:5px"></m-logo>
          <div class="m-prod-title">${this.headingText}</div>
        </div>  
        <div style="margin: 0px 8px;display:flex">
          <input id="spec-url" type="text" class="header-input" style="border-radius: 2px 0 0 2px;" placeholder="Spec URL" value="${this.specUrl}" @change="${this.onSepcUrlChange}">
        </div>
        <div style="flex:1"></div>  
        <div style="display:flex; flex-direction:column; margin-right:8px; align-items:flex-end;">
          <input class="header-input" style="width:100px;" type="text" placeholder="Search">
        </div> 
      </div>`}
      ${this.resolvedSpec && this.resolvedSpec.tags ?html`<div style="margin:0 16px">
        ${this.resolvedSpec.tags.map(tag => html`
          <div class="m-tag-title regular-font">${tag.name}</div>
          ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description?tag.description:'')}</div>`)}
          <end-points .paths="${tag.paths}" layout="${this.layout?this.layout:'row'}"></end-points>
        `)}
        </div>`
      :''}
    `}

    static get properties() {
      return {
        specUrl: {
          type: String, 
          attribute: 'spec-url',
        },
        headingText: {type: String, attribute: 'heading-text'},
        headerColor: {type: String, attribute:  'header-color'},
        primaryColor: {type: String, attribute: 'primary-color'},
        layout: {type: String},
        showHeader: {type: String, attribute: 'show-header'},

        theme: {type: String},
        logoUrl: {type: String, attribute: 'logo-url'},
        showTry: {type: Boolean, attribute: 'show-try'},
        showAuthentication: {type: Boolean, attribute: 'show-authentication'},
        showInfo: {type: Boolean, attribute: 'show-info'},
      };
    }
    attributeChangedCallback(name, oldVal, newVal) {
      console.log("show header :", this.showHeader);
      if (name=='spec-url'){
        if (oldVal !== newVal){
          this.loadSpec(newVal);
        }
      }
      console.log("%s change callback > %s::::%s", name, oldVal, newVal);
      super.attributeChangedCallback(name, oldVal, newVal);
    }

    onOpenSpecClicked(e) {
        this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
    }

    onSepcUrlChange(e){
      if (this.specUrl){
        this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
      }
    }

    loadSpec(specUrl) {
      var me = this;
      if (!specUrl){
        return;
      }
      ProcessSpec(specUrl).then(function(spec){
        if (spec===undefined || spec === null){
          console.error('Onoes! The API is invalid. ');
        }
        console.log(spec);
        me.afterSpecParsedAndValidated(spec);
      })
      .catch(function(err) {
        me.loading=false;
        console.error('Onoes! The API is invalid. ' + err.message);
      });
    }

    afterSpecParsedAndValidated(spec, isReloadingSpec=false){
      this.resolvedSpec=spec;
      this.resolvedSpec=spec;
      this.requestUpdate();
    }
}

customElements.define('rapidoc-layout', RapidocLayout);
