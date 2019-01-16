import { LitElement, html} from 'lit-element'; 
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
      <style>
        :host{
          display:block;
          min-width:750px;
        }
        :host{
          ${this.primaryColor? html`--primary-color:${this.primaryColor};`:''}
          ${this.primaryColor? html`--primary-text:${vars.color.invert(this.primaryColor)};`:''}
          ${this.layout? html`--layout:${this.layout};`:'row'}
          ${this.theme==='dark'?html`
            --bg:#333;
            --fg:#ccc;
          `:
          html`

          `}
        }
        .header{
          background-color:${this.headerColor?this.headerColor:vars.color.headerBg};
          color:${this.headerColor?vars.color.invert(this.headerColor):vars.color.reverseFg};
        }
        input.header-input{
          background:${this.headerColor?vars.color.brightness(this.headerColor, -20):vars.color.inputReverseBg};
          color:${this.headerColor?vars.color.invert(this.headerColor):vars.color.inputReverseFg};
          border:1px solid var(--primary-color, ${this.primaryColor?vars.color.brightness(this.primaryColor, -20) :vars.color.primaryBg}); 
        }
        .m-tag-title{
          font-size: 18px;
          color:${vars.color.fg};
          margin: 28px 0px 4px;
          text-transform: uppercase;
        }

      </style>
      ${this.showHeader==='true'?html`
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
      </div>
      `:``}
      ${this.resolvedSpec && this.resolvedSpec.tags ?html`
        ${this.resolvedSpec.tags.map(tag => html`
          <div class="m-tag-title regular-font">${tag.name}</div>
          ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description?tag.description:'')}</div>`)}
          <end-points .paths="${tag.paths}" layout="${this.layout?this.layout:'row'}"></end-points>
        `)}
      `
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
