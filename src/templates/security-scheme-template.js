import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';

function onApiKeyChange(data, apiKeyId, e) {
  let apiKeyValue = '';
  const securityObj = data.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
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

function onClearAllApiKeys(data) {
  data.resolvedSpec.securitySchemes.forEach((v) => {
    v.user = '';
    v.password = '';
    v.value = '';
    v.finalKeyValue = '';
  });
  this.requestUpdate();
}

// Updates the OAuth Access Token (API key), so it reflects in UI and gets used in TRY calls
function updateOAuthKey(data, apiKeyId, tokenType = 'Bearer', accessToken) {
  const securityObj = data.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  securityObj.finalKeyValue = `${tokenType} ${accessToken}`;
  this.requestUpdate();
}

/* eslint-disable no-console */
// Gets Access-Token in exchange of Authorization Code
async function fetchAccessToken(data, tokenUrl, clientId, clientSecret, redirectUrl, grantType, authCode, sendClientSecretIn = 'header', apiKeyId, authFlowDivEl) {
  const respDisplayEl = authFlowDivEl ? authFlowDivEl.querySelector('.oauth-resp-display') : undefined;
  const urlFormParams = new URLSearchParams();
  const headers = new Headers();

  urlFormParams.append('redirect_uri', redirectUrl);
  urlFormParams.append('grant_type', grantType);
  if (authCode) {
    urlFormParams.append('code', authCode);
  }
  if (sendClientSecretIn === 'header') {
    headers.set('Authorization', `Basic ${btoa(`${clientId}:${clientSecret}`)}`);
  } else {
    urlFormParams.append('client_id', clientId);
    urlFormParams.append('client_secret', clientSecret);
  }

  try {
    const resp = await fetch(tokenUrl, { method: 'POST', headers, body: urlFormParams });
    const tokenResp = await resp.json();
    if (resp.ok) {
      if (tokenResp.token_type && tokenResp.access_token) {
        updateOAuthKey.call(this, data, apiKeyId, tokenResp.token_type, tokenResp.access_token);
        if (respDisplayEl) {
          respDisplayEl.innerHTML = '<span style="color:var(--green)">Access Token Received</span>';
        }
        return true;
      }
    } else {
      if (respDisplayEl) {
        respDisplayEl.innerHTML = `<span style="color:var(--red)">${tokenResp.error_description || tokenResp.error_description || 'Unable to get access token'}</span>`;
      }
      return false;
    }
  } catch (err) {
    if (respDisplayEl) {
      respDisplayEl.innerHTML = '<span style="color:var(--red)">Failed to get access token</span>';
    }
    return false;
  }
}

// Gets invoked when it receives the Authorization Code from the other window via message-event
async function onWindowMessageEvent(data, msgEvent, winObj, tokenUrl, clientId, clientSecret, redirectUrl, grantType, sendClientSecretIn, apiKeyId, authFlowDivEl) {
  sessionStorage.removeItem('winMessageEventActive');
  winObj.close();
  if (msgEvent.data.fake) {
    return;
  }
  if (!msgEvent.data) {
    console.warn('RapiDoc: Received no data with authorization message');
  }
  if (msgEvent.data.error) {
    console.warn('RapiDoc: Error while receiving data');
  }
  if (msgEvent.data) {
    if (msgEvent.data.responseType === 'code') {
      // Authorization Code flow
      fetchAccessToken.call(this, data, tokenUrl, clientId, clientSecret, redirectUrl, grantType, msgEvent.data.code, sendClientSecretIn, apiKeyId, authFlowDivEl);
    } else if (msgEvent.data.responseType === 'token') {
      // Implicit flow
      updateOAuthKey.call(this, data, apiKeyId, msgEvent.data.token_type, msgEvent.data.access_token);
    }
  }
}


async function onInvokeOAuthFlow(data, apiKeyId, flowType, authUrl, tokenUrl, e) {
  const authFlowDivEl = e.target.closest('.oauth-flow');
  const clientId = authFlowDivEl.querySelector('.oauth-client-id') ? authFlowDivEl.querySelector('.oauth-client-id').value.trim() : '';
  const clientSecret = authFlowDivEl.querySelector('.oauth-client-secret') ? authFlowDivEl.querySelector('.oauth-client-secret').value.trim() : '';
  const sendClientSecretIn = authFlowDivEl.querySelector('.oauth-send-client-secret-in') ? authFlowDivEl.querySelector('.oauth-send-client-secret-in').value.trim() : 'header';

  const checkedScopeEls = [...authFlowDivEl.querySelectorAll('input[type="checkbox"]:checked')];
  const state = (`${Math.random().toString(36)}random`).slice(2, 9);
  const redirectUrlObj = new URL(`${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/${this.oauthReceiver}`);
  let grantType = '';
  let responseType = '';
  let newWindow;

  // clear previous error messages
  const errEls = [...authFlowDivEl.parentNode.querySelectorAll('.oauth-resp-display')];
  errEls.forEach((v) => { v.innerHTML = ''; });

  if (flowType === 'authorizationCode' || flowType === 'implicit') {
    const authUrlObj = new URL(authUrl);
    if (flowType === 'authorizationCode') {
      grantType = 'authorization_code';
      responseType = 'code';
    } else if (flowType === 'implicit') {
      responseType = 'token';
    }
    const authCodeParams = new URLSearchParams(authUrl.search);
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    if (selectedScopes) {
      authCodeParams.set('scope', selectedScopes);
    }
    authCodeParams.set('client_id', clientId);
    authCodeParams.set('redirect_uri', redirectUrlObj.toString());
    authCodeParams.set('response_type', responseType);
    authCodeParams.set('state', state);
    authCodeParams.set('show_dialog', true);
    authUrlObj.search = authCodeParams.toString();
    // If any older message-event-listener is active then fire a fake message to remove it (these are single time listeners)
    if (sessionStorage.getItem('winMessageEventActive') === 'true') {
      window.postMessage({ fake: true }, this);
    }
    setTimeout(() => {
      newWindow = window.open(authUrlObj.toString());
      if (!newWindow) {
        console.error(`RapiDoc: Unable to open ${authUrlObj.toString()} in a new window`);
      } else {
        sessionStorage.setItem('winMessageEventActive', 'true');
        window.addEventListener(
          'message',
          (msgEvent) => onWindowMessageEvent.call(this, data, msgEvent, newWindow, tokenUrl, clientId, clientSecret, redirectUrlObj.toString(), grantType, sendClientSecretIn, apiKeyId, authFlowDivEl),
          { once: true },
        );
      }
    }, 10);
  } else if (flowType === 'clientCredentials') {
    grantType = 'client_credentials';
    fetchAccessToken.call(this, tokenUrl, clientId, clientSecret, redirectUrlObj.toString(), grantType, '', sendClientSecretIn, apiKeyId, authFlowDivEl);
  }
}
/* eslint-enable no-console */

/* eslint-disable indent */

function oAuthFlowTemplate(data, flowName, clientId, clientSecret, apiKeyId, authFlow) {
  let flowNameDisplay;
  if (flowName === 'authorizationCode') {
    flowNameDisplay = 'Authorization Code Flow';
  } else if (flowName === 'clientCredentials') {
    flowNameDisplay = 'Client Credentials Flow';
  } else if (flowName === 'implicit') {
    flowNameDisplay = 'Implicit Flow';
  } else if (flowName === 'password') {
    flowNameDisplay = 'Password Flow';
  } else {
    flowNameDisplay = flowName;
  }
  return html`
    <div class="oauth-flow" style="padding: 10px 0; margin-bottom:10px;"> 
      <div class="tiny-title upper" style="margin-bottom:5px;">${flowNameDisplay}</div> 
      ${authFlow.authorizationUrl
        ? html`<div><span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${authFlow.authorizationUrl} </span></div>`
        : ''
      }
      ${authFlow.tokenUrl
        ? html`<div><span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${authFlow.tokenUrl}</span></div>`
        : ''
      }
      ${authFlow.refreshUrl
        ? html`<div><span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${authFlow.refreshUrl}</span></div>`
        : ''
      }
      ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'implicit' || flowName === 'password'
        ? html`
          ${authFlow.scopes
            ? html`
              <span> Scopes </span>
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
            ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'password'
              ? html`
                <input type="password" value = "${clientSecret}" placeholder="client-secret" spellcheck="false" class="oauth-client-secret" style = "margin:0 5px;">
                ${flowName === 'authorizationCode' || flowName === 'clientCredentials'
                  ? html`
                    <select style="margin-right:5px;" class="oauth-send-client-secret-in">
                      <option value = 'header' selected> Authorization Header </option> 
                      <option value = 'request-body'> Request Body </option> 
                    </select>`
                  : ''
                }`
              : html`<div style='width:5px'></div>`
            }
            ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'implicit'
              ? html`
                <button class="m-btn thin-border"
                  @click="${(e) => { onInvokeOAuthFlow.call(this, data, apiKeyId, flowName, authFlow.authorizationUrl, authFlow.tokenUrl, e); }}"
                > GET TOKEN </button>`
              : ''
            }
          </div>
          ${flowName === 'password'
            ? html`
              <div style="display:flex; max-height:28px; margin-top:2px">
                <input type="text" value = "" placeholder="username" spellcheck="false" class="api-key-user">
                <input type="password" value = "" placeholder="password" spellcheck="false" class="api-key-password" style = "margin:0 5px;">
              </div>`
            : ''
          }  
          <div class="oauth-resp-display red-text small-font-size"></div>
          `
        : ''
      }
    </div>  
  `;
}

export default function securitySchemeTemplate(data) {
  const providedApiKeys = data.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue));
  return html`
  <div id='authentication' style="margin-top:24px; margin-bottom:24px;" class = 'observe-me ${data.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap '}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>

    <div class="small-font-size" style="display:flex; align-items: center; min-height:30px">
      ${providedApiKeys.length > 0
        ? html`
          <div class="blue-text"> ${providedApiKeys.length} API key applied </div>
          <div style="flex:1"></div>
          <button class="m-btn thin-border" @click=${() => { onClearAllApiKeys.call(this, data); }}>CLEAR ALL API KEYS</button>`
        : html`<div class="red-text">No API key applied</div>`
      }
    </div>
    ${data.resolvedSpec.securitySchemes && data.resolvedSpec.securitySchemes.length > 0
      ? html`  
        <table class='m-table' style = "width:100%">
          ${data.resolvedSpec.securitySchemes.map((v) => html`
            <tr>  
              <td style="max-width:500px; overflow-wrap: break-word;">
                <div style="min-height:24px"> 
                  <span style="font-weight:bold">${v.typeDisplay} </span> 
                  ${v.finalKeyValue
                    ? html`
                      <span class='blue-text'>  ${v.finalKeyValue ? 'Key Applied' : ''} </span> 
                      <button class="m-btn thin-border small" @click=${() => { v.finalKeyValue = ''; data.requestUpdate(); }}>REMOVE</button>
                      `
                    : ''
                  }
                </div>
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
                      ? html`Send <code>${v.name}</code> in <code>${v.in}</code> with the given value`
                      : html`Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by a space and a Token String.`
                    }
                    <div style="display:flex;max-height:28px;">
                      <input type = "text" value = "${v.value}" class="api-key-input" placeholder = "api-token" spellcheck = "false">
                      <button class="m-btn thin-border" style = "margin-left:5px;"
                        @click="${(e) => { onApiKeyChange.call(this, data, v.apiKeyId, e); }}"> 
                        ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                      </button>
                    </div>`
                  : ''
                }
                ${v.type === 'http' && v.scheme === 'basic'
                  ? html`
                    Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by a space and a base64 encoded string of <code>username:password</code>.
                    <div style="display:flex; max-height:28px;">
                      <input type="text" value = "${v.user}" placeholder="username" spellcheck="false" class="api-key-user" style="width:100px">
                      <input type="password" value = "${v.password}" placeholder="password" spellcheck="false" class="api-key-password" style = "width:100px; margin:0 5px;">
                      <button class="m-btn thin-border"
                        @click="${(e) => { onApiKeyChange.call(this, data, v.apiKeyId, e); }}"> 
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
                    ${Object.keys(v.flows).map((f) => oAuthFlowTemplate.call(this, data, f, v.clientId, v.clientSecret, v.apiKeyId, v.flows[f]))} 
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

export function pathSecurityTemplate(data, pathSecurity) {
  if (data.resolvedSpec.securitySchemes && pathSecurity) {
    const andSecurityKeys = [];
    pathSecurity.forEach((pSecurity) => {
      const orSecurityKeys = [];
      const orKeyTypes = [];
      let pathScopes = '';
      Object.keys(pSecurity).forEach((pathSecurityKey) => {
        const s = data.resolvedSpec.securitySchemes.find((ss) => ss.apiKeyId === pathSecurityKey);
        if (!pathScopes) {
          pathScopes = pSecurity[pathSecurityKey].join(', ');
        }
        if (s) {
          orKeyTypes.push(s.typeDisplay);
          orSecurityKeys.push(s);
        }
      });
      andSecurityKeys.push({
        pathScopes,
        securityTypes: orKeyTypes.join(' or '),
        securityDefs: orSecurityKeys,
      });
    });
    return html`<div style="position:absolute; top:3px; right:2px; font-size: calc(var(--font-size-small));">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <div style="font-size: calc(var(--font-size-small) + 2px)"> &#128274; </div>
          ${andSecurityKeys.map((andSecurityItem) => html`
          <div class="tooltip">
            <div style = "padding:2px 4px;"> ${andSecurityItem.securityTypes} </div>
            <div class="tooltip-text" style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;">
              ${andSecurityItem.securityDefs.length > 1 ? html`<div>Requires <b>any one</b> of the following </div>` : ''}
              <div style="padding-left: 8px">
                ${andSecurityItem.securityDefs.map((orSecurityItem, i) => html`
                  ${orSecurityItem.type === 'oauth2'
                    ? html`
                      <div>
                        ${andSecurityItem.securityDefs.length > 1 ? html`<b>${i + 1}.</b> &nbsp;` : html`Requires`}
                        OAuth Access Token in <b>Authorization header</b> with <b>Scopes:</b> ${andSecurityItem.pathScopes}
                      </div>`
                    : orSecurityItem.type === 'http'
                      ? html`
                        <div>
                          ${andSecurityItem.securityDefs.length > 1 ? html`<b>${i + 1}.</b> &nbsp;` : html`Requires`} 
                          ${orSecurityItem.scheme === 'basic' ? 'Base 64 encoded username:password' : 'Bearer Token'} in <b>Authorization header</b>
                        </div>`
                      : html`
                        <div>
                          ${andSecurityItem.securityDefs.length > 1 ? html`<b>${i + 1}.</b> &nbsp;` : html`Requires`} 
                          Token in <b>${orSecurityItem.name} ${orSecurityItem.in}</b>
                        </div>`
                  }
                `)}
              </div>  
            </div>
          </div>  
        `)
        }
      </div>
    `;

    /*
    return html`<div style="position:absolute; top:3px; right:2px; font-size: calc(var(--font-size-small));">
      <div style="position:relative; display:flex;">
        <div style="font-size: calc(var(--font-size-small) + 2px)"> &#128274; </div>
          ${pathSecurityDefs.map((v) => html`
          <div class="tooltip">
            <div style = "padding:2px 4px;"> ${v.securityScheme.typeDisplay} </div>
            ${v.securityScheme.type === 'oauth2'
              ? html`
                <div class="tooltip-text" style="position:absolute; color: var(--fg); top:28px; right:0; border:1px solid var(--border-color);padding:2px 4px; min-width:100px; max-width:400px; display:inline-flex;">
                  <b>Scopes:</b> &nbsp; ${v.scopes.join(', ')}
                </div>`
              : ''
            }
          </div>
        `)
        }
      </div>
      `;
    */
  }
  return '';
}

/* eslint-enable indent */
