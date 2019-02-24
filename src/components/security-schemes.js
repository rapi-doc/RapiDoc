import { LitElement, html } from 'lit-element'; 
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import marked from 'marked';

import FontStyles from '@/styles/font-styles';
import TableStyles from '@/styles/table-styles';
import InputStyles from '@/styles/input-styles';


export default class SecuritySchemes extends LitElement {
  render() {
    return html`
    ${FontStyles}
    ${TableStyles}
    ${InputStyles}
    <div>AUTHENTICATION</div>
    <table style="width:auto" class="m-table">
      <tr>
        <th >Type </th>  
        <th> Authentication Procedure </th>  
      </tr>
      
        ${Object.keys(this.schemes).map(s => html`
          <tr>  
          <td>
            <div style="font-weight:bold">${this.schemes[s].type}: ${this.schemes[s].scheme}</div>
            ${this.schemes[s].description?html`
              <div class="m-markdown"> 
                ${unsafeHTML(marked(this.schemes[s].description))}
              </div>`
            :''}
          </td>
          <td>
            ${this.schemes[s].type==='apiKey'?html`
              Send <code>'${this.schemes[s].name}'</code> in <code>'${this.schemes[s].in}'</code> with the given value
              <div class="api-key" data-type="${this.schemes[s].type}" data-in="${this.schemes[s].in}" data-name="${this.schemes[s].name}" style="margin:5px 0">
                <input type="text" name="token" style="width:222px;" placeholder="api-token" >
                <button 
                  class="m-btn" 
                  data-action="${this.keyValue?'CLEAR':'SET'}" 
                  @click="${this.dispatchChange}"
                >${this.keyValue?'CLEAR':'SET'}</button>
              </div>
            `:``}
            ${this.schemes[s].type==='http' && this.schemes[s].scheme==='basic'?html`
              Send <code>'Authorization'</code> in header which will contains the word  <code>'Basic'</code> followed by a space and a base64-encoded string username:password.
              <div class="api-key " data-type="${this.schemes[s].type}" data-scheme="${this.schemes[s].scheme}" data-in="header" data-name="Authorization" style="margin:15px 0">
                <input type="text" name="username" style="width:110px;" placeholder="username">
                <input type="text" name="password" style="width:110px;" placeholder="password">
                <button 
                  class="m-btn" 
                  data-action="${this.keyValue?'CLEAR':'SET'}" 
                  @click="${this.dispatchChange}"
                >${this.keyValue?'CLEAR':'SET'}</button>
              </div>
            `:``}
            ${this.schemes[s].type==='http' && this.schemes[s].scheme==='bearer'?html`
              Send <code>'Authorization'</code> in header which will contains the word  <code>'Bearer'</code> ffollowed by a space and a Token String.
              <div class="api-key" data-type="${this.schemes[s].type}" data-scheme="${this.schemes[s].scheme}" data-in="header" data-name="Authorization" style="margin:15px 0">
                <input type="text" name="token" style="width:222px;" placeholder="api-token">
                <button 
                  class="m-btn" 
                  data-action="${this.keyValue?'CLEAR':'SET'}" 
                  @click="${this.dispatchChange}"
                >${this.keyValue?'CLEAR':'SET'}</button>
              </div>
            `:``}
            ${this.schemes[s].type==='oauth2'?html`
              <div>
              ${Object.keys(this.schemes[s].flows).map(f => html`
                ${this.schemes[s].flows[f].authorizationUrl?html`<div><b>Auth URL:</b> <code style="color:#999"> ${this.schemes[s].flows[f].authorizationUrl}</code></div>`:``}
                ${this.schemes[s].flows[f].tokenUrl?html`<div><b>Token URL:</b> <code style="color:#999"> ${this.schemes[s].flows[f].tokenUrl}</code></div>`:``}
                ${this.schemes[s].flows[f].refreshUrl?html`<div><b>Refresh URL:</b> <code style="color:#999"> ${this.schemes[s].flows[f].refreshUrl}</code></div>`:``}
                <div class="oauth" style="margin:5px 0">
                  <input type="text" name="client" style="width:110px;" placeholder="client-id">
                  <input type="text" name="secret" style="width:110px;" placeholder="client-secret">
                </div>
              `)}
              </div>
            `:``}
          </td>
          </tr>`
        )}
    </table>`
  }

  static get properties() {
    return {
      schemes: {type: Object},
      keyValue:{type: String}
    };

  }

  dispatchChange(e){
    let apiEl = e.target.closest(".api-key");
    if (!apiEl){
      return;
    }

    let keyType  = apiEl.dataset.type;
    let keyLocation = apiEl.dataset.in;
    let keyName  = apiEl.dataset.name;
    
    if (e.target.dataset.action === "CLEAR"){
      this.keyValue = "";
      let tokenEl = apiEl.querySelector("input[name=token]");
      if (tokenEl){
        tokenEl.value="";
      }
    }
    else{
      if (keyType==="apiKey"){
        let tokenEl = apiEl.querySelector("input[name=token]");
        if (tokenEl){
          this.keyValue = tokenEl.value;
        }

      }
      else if (keyType==="http"){
        let securityScheme=apiEl.dataset.scheme;
        if (securityScheme==="basic"){
          let userNameEl = apiEl.querySelector("input[name=username]");
          let passwordEl = apiEl.querySelector("input[name=password]");
          if (userNameEl && passwordEl){
            this.keyValue = 'Basic '+ btoa(userNameEl.value+":"+passwordEl.value);
          }
    
        }
        else if (securityScheme==="bearer"){
          let tokenEl = apiEl.querySelector("input[name=token]");
          if (tokenEl){
            this.keyValue = "Bearer " + tokenEl.value;
          }
        }
      }
    }


    let event = new CustomEvent("change", {
      detail: {
        keyType:keyType,
        keyName:keyName,
        keyValue:this.keyValue,
        keyLocation:keyLocation,
      }
    });
    this.dispatchEvent(event);
      
  }


}
// Register the element with the browser
customElements.define('security-schemes', SecuritySchemes);
