import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';

function onApiKeyChange(apiKeyId, e) {
  let apiKeyValue = '';
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  if (securityObj) {
    const trEl = e.target.closest('tr');
    if (securityObj.type && securityObj.scheme && securityObj.type === 'http' && securityObj.scheme.toLowerCase() === 'basic') {
      const userVal = trEl.querySelector('.api-key-user').value.trim();
      const passwordVal = trEl.querySelector('.api-key-password').value.trim();
      if (userVal && passwordVal) {
        apiKeyValue = `Basic ${btoa(`${userVal}:${passwordVal}`)}`;
      }
    } else {
      apiKeyValue = trEl.querySelector('.api-key-input').value.trim();
      if (apiKeyValue) {
        if (securityObj.scheme && securityObj.scheme.toLowerCase() === 'bearer') {
          apiKeyValue = `Bearer ${apiKeyValue}`;
        }
      }
    }
    securityObj.finalKeyValue = apiKeyValue;
  }
  this.requestUpdate();
}

function onClearAllApiKeys() {
  this.resolvedSpec.securitySchemes.forEach((v) => {
    v.user = '';
    v.password = '';
    v.value = '';
    v.finalKeyValue = '';
  });
  this.requestUpdate();
}

function onClearOAuthKey(apiKeyId, e) {
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  const authFlowDivEl = e.target.closest('.oauth-flow');
  authFlowDivEl.querySelector('.oauth-client-id').value = '';
  authFlowDivEl.querySelector('.oauth-client-secret').value = '';
  securityObj.finalKeyValue = '';
  this.requestUpdate();
}

/* eslint-disable no-console */
function onInvokeOAuth(apiKeyId, flowType, authUrl, tokenUrl, e) {
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  const authFlowDivEl = e.target.closest('.oauth-flow');
  const clientId = authFlowDivEl.querySelector('.oauth-client-id').value.trim();
  const clientSecret = authFlowDivEl.querySelector('.oauth-client-secret').value.trim();
  const checkedScopeEls = [...authFlowDivEl.querySelectorAll('input[type="checkbox"]:checked')];
  const state = (`${Math.random().toString(36)}random`).slice(2, 9);
  const authUrlObj = new URL(authUrl);
  const receiveUrlObj = new URL(`${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/${this.oauthReceiver}`);
  let oAuthRespType = 'code';
  if (flowType === 'authorizationCode') {
    oAuthRespType = 'code';
  } else if (flowType === 'implicit') {
    oAuthRespType = 'token';
  }

  const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
  const params = new URLSearchParams(authUrl.search);
  params.set('client_id', clientId);
  params.set('redirect_uri', receiveUrlObj.toString());
  params.set('response_type', oAuthRespType);
  if (selectedScopes) {
    params.set('scope', selectedScopes);
  }
  params.set('state', state);
  params.set('show_dialog', true);
  authUrlObj.search = params.toString();
  const w = window.open(authUrlObj.toString());
  if (!w) {
    console.error(`RapiDoc: Unable to open ${authUrlObj.toString()} in a new window`);
  }

  const handleMessageEventFn = async (ev) => {
    /*
    if (ev.origin !== receiveUrlObj.origin) {
      console.warn(`Received message from invalid domain ${ev.origin}.`);
      return;
    }
    */

    // After handeling, remove this listener
    window.removeEventListener('message', handleMessageEventFn, true);
    w.close();
    if (!ev.data) {
      console.error('RapiDoc: Received no data with authorization message');
    }
    if (ev.data.state !== state) {
      console.warn('RapiDoc: State value did not match.');
    }
    if (ev.data.error) {
      console.warn('RapiDoc: Error while receving data');
    }
    if (ev.data) {
      if (ev.data.responseType === 'code') {
        console.log(`RapiDoc: AUTH CODE RECEIVED - ${ev.data.code}`);
        // return res(ev.data.code);
        const formData = new FormData();
        formData.append('grant_type', 'authorization_code');
        formData.append('code', ev.data.code);
        formData.append('client_id', clientId);
        formData.append('client_secret', clientSecret);
        formData.append('redirect_uri', receiveUrlObj.toString());
        try {
          const resp = await fetch(tokenUrl, { method: 'POST', body: formData });
          console.log(`OAUth Token Response Status: ${resp.statusText}:${resp.status}`);
          const respObj = await resp.json();
          console.log('Access Token Response: %o', respObj);
          if (respObj.access_token) {
            securityObj.finalKeyValue = `${respObj.token_type} ${respObj.access_token}`;
            this.requestUpdate();
          }
        } catch (err) {
          console.error('RapiDoc: Unable to get access token');
        }
      } else if (ev.data.responseType === 'token') {
        securityObj.finalKeyValue = `${ev.data.token_type} ${ev.data.access_token}`;
        this.requestUpdate();
      }
    }
  };
  window.addEventListener('message', handleMessageEventFn, true);
}
/* eslint-enable no-console */

/* eslint-disable indent */

function oAuthFlowTemplate(flowName, clientId, clientSecret, apiKeyId, finalKeyValue, authFlow) {
  let authSite = '';
  try {
    authSite = new URL(authFlow.authorizationUrl).origin;
  } catch (e) {
    authSite = authFlow.authorizationUrl;
  }
  return html`
    <div class="oauth-flow" style="padding: 10px 0; margin-bottom:10px; border-bottom:1px dashed var(--border-color)"> 
      <b style="width:75px; display: inline-block;">FLOW</b> ${flowName}
      ${authFlow.authorizationUrl
        ? html`<div><b style="width:75px; display: inline-block;">AUTH URL</b> <span class="mono-font"> ${authFlow.authorizationUrl} </span></div>`
        : ''
      }
      ${authFlow.tokenUrl
        ? html`<div><b style="width:75px; display: inline-block;">TOKEN URL</b> <span class="mono-font">${authFlow.tokenUrl}</span></div>`
        : ''
      }
      ${authFlow.refreshUrl
        ? html`<div><b style="width:75px; display: inline-block;">REFRESH URL</b> <span class="mono-font">${authFlow.refreshUrl}</span></div>`
        : ''
      }
      ${flowName.toLowerCase() === 'authorizationcode'
        ? html`
          ${authFlow.scopes
            ? html`
              <b> SCOPES </b>
              <div class= "oauth-scopes" style = "width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px">
                ${Object.entries(authFlow.scopes).map((scopeAndDescr, index) => html`
                  <div class="m-checkbox" style="display:inline-block">
                    <input type="checkbox" id="${flowName}${index}" value="${scopeAndDescr[0]}">
                    <label for="${flowName}${index}">
                      <span class="mono-font">${scopeAndDescr[0]}</span>
                        ${scopeAndDescr[0] !== scopeAndDescr[1] ? ` - ${scopeAndDescr[1] || ''}` : ''}
                    </label>
                  </div>
                `)}
              </div>
            `
            : ''
          }
          <div style="display:flex; max-height:28px;">
            <input type="text" value = "${clientId}" placeholder="client-id" spellcheck="false" class="oauth-client-id">
            <input type="password" value = "${clientSecret}" placeholder="client-secret" spellcheck="false" class="oauth-client-secret" style = "margin:0 5px;">
            ${finalKeyValue
              ? html`
                <button class="m-btn thin-border" @click="${(e) => { onClearOAuthKey.call(this, apiKeyId, e); }}"> CLEAR </button>
              `
              : html`
                <button class="m-btn thin-border"
                  @click="${(e) => { onInvokeOAuth.call(this, apiKeyId, flowName, authFlow.authorizationUrl, authFlow.tokenUrl, e); }}"
                > AUTHORIZE </button>                                    
              `
            }
          </div>
          <div style="margin-top:8px">
            <ul>
              ${authFlow.authorizationUrl
                ? html`
                  <li> Register this client (<span class="mono-font">${window.location.origin}</span>) with <span class="mono-font">${authSite}<span class="mono-font"> </li>
              <li> During registration, Specify redirect url pointing to <span class="mono-font">${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/${this.oauthReceiver}</span> </li>
                  <li> Create <b>${this.oauthReceiver}</b> which will receive auth-code from oAuth provider</li>
                  <li> <b>${this.oauthReceiver}</b> should contain custom-element <span class="mono-font"> &lt;oauth-receiver&gt; </span>, this element receives the auth-code and passes it to this document </li>
                  <li> After receiving auth-code, it will request access-token using <span class="mono-font"> POST ${authFlow.tokenUrl}</span>
                    <ul>
                      <li> grant_type = 'authorization_code'</li>
                      <li> code = {auth-code}</li>
                      <li> client_id = {client-id}</li>
                      <li> client_secret = {client-secret}</li>
                      <li> redirect_uri = {redirect-url}</li>
                    </ul>
                  </li>
                `
                : ''
              }
            </ul>
          </div>`
        : ''
      }
    </div>  
  `;
}

export default function securitySchemeTemplate() {
  const providedApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue));
  return html`
  <div id='authentication' class = 'observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap '}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>

    <div class="regular-font-size" style="display:flex;margin: 16px 0 4px 0; align-items: center;">
      ${providedApiKeys.length > 0
        ? html`<div style="font-weight:bold;color:var(--blue); overflow:hidden;"> 
            ${providedApiKeys.length === 1
              ? `API Key '${providedApiKeys[0].name}' in ${providedApiKeys[0].in}`
              : `${providedApiKeys.length} API keys applied`
            } 
          </div>
          <div style="flex:1"></div>
          <button class="m-btn thin-border" @click=${() => { onClearAllApiKeys.call(this); }}>CLEAR ALL API KEYS</button>`
        : html`<div style="font-weight:bold; color:var(--red)">No API key applied</div>`
      }
    </div>
    ${this.resolvedSpec.securitySchemes && this.resolvedSpec.securitySchemes.length > 0
      ? html`  
        <table class='m-table' style = "width:100%">
          <tr> <th >Type </th> <th> Authentication Procedure</th>  </tr>
          ${this.resolvedSpec.securitySchemes.map((v) => html`
            <tr>  
              <td>
                <div style="font-weight:bold">${v.type}: ${v.scheme} </div>
                ${v.description
                  ? html`
                    <div class="m-markdown"> 
                      ${unsafeHTML(marked(v.description || ''))}
                    </div>`
                  : ''
                }
              </td>
              <td>
                ${v.type === 'apiKey' || (v.type === 'http' && v.scheme === 'bearer')
                  ? html`
                    ${v.type === 'apiKey'
                      ? html`Send <code>'${v.name}'</code> in <code>'${v.in}'</code> with the given value`
                      : html`Send <code>'Authorization'</code> in header which will contains the word  <code>'Bearer'</code> followed by a space and a Token String.`
                    }
                    <div style="display:flex;max-height:28px;">
                      <input type = "text" value = "${v.value}" class="api-key-input" placeholder = "api-token" spellcheck = "false">
                      <button class="m-btn thin-border" style = "margin-left:5px;"
                        @click="${(e) => { onApiKeyChange.call(this, v.apiKeyId, e); }}"> 
                        ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                      </button>
                    </div>`
                  : ''
                }
                ${v.type === 'http' && v.scheme === 'basic'
                  ? html`
                    Send <code>'Authorization'</code> in header which will contains the word  <code>'Basic'</code> followed by a space and a base64-encoded string username:password.
                    <div style="display:flex; max-height:28px;">
                      <input type="text" value = "${v.user}" placeholder="username" spellcheck="false" class="api-key-user">
                      <input type="password" value = "${v.password}" placeholder="password" spellcheck="false" class="api-key-password" style = "margin:0 5px;">
                      <button class="m-btn thin-border"
                        @click="${(e) => { onApiKeyChange.call(this, v.apiKeyId, e); }}"> 
                        ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                      </button>
                    </div>`
                  : ''
                }
              </td>
            </tr>
            ${v.type === 'oauth2'
              ? html`
                <tr>
                  <td colspan="2" style="border:none; padding-left:48px">
                    ${Object.keys(v.flows).map((f) => oAuthFlowTemplate.call(this, f, v.clientId, v.clientSecret, v.apiKeyId, v.finalKeyValue, v.flows[f]))} 
                  </td>
                </tr>    
                `
              : ''
            }    
          `)}
        </table>`
      : ''
    }
  </div>
`;
}
/* eslint-enable indent */
