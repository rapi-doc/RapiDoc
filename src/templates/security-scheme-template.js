/* eslint-disable arrow-body-style */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';

const codeVerifier = '731DB1C3F7EA533B85E29492D26AA-1234567890-1234567890';
const codeChallenge = '4FatVDBJKPAo4JgLLaaQFMUcQPn5CrPRvLlaob9PTYc'; // Base64 encoded SHA-256

const localStorageKey = 'rapidoc';

export function applyApiKey(securitySchemeId, username = '', password = '', providedApikeyVal = '') {
  const securityObj = this.resolvedSpec.securitySchemes?.find((v) => (v.securitySchemeId === securitySchemeId));
  if (!securityObj) {
    return false;
  }
  let finalApiKeyValue = '';
  if (securityObj.scheme?.toLowerCase() === 'basic') {
    if (username) {
      finalApiKeyValue = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
      // finalApiKeyValue = `Basic ${btoa(`${username}:${password}`)}`;
    }
  } else if (providedApikeyVal) {
    securityObj.value = providedApikeyVal;
    finalApiKeyValue = `${securityObj.scheme?.toLowerCase() === 'bearer' ? 'Bearer ' : ''}${providedApikeyVal}`;
  }
  if (finalApiKeyValue) {
    securityObj.finalKeyValue = finalApiKeyValue;
    this.requestUpdate();
    return true;
  }
  return false;
}

export function onClearAllApiKeys() {
  this.resolvedSpec.securitySchemes?.forEach((v) => {
    v.user = '';
    v.password = '';
    v.value = '';
    v.finalKeyValue = '';
  });
  this.requestUpdate();
}

function getPersistedApiKeys() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || {};
}

function setPersistedApiKeys(obj) {
  localStorage.setItem(localStorageKey, JSON.stringify(obj));
}

export function recoverPersistedApiKeys() {
  const rapidocLs = getPersistedApiKeys.call(this);
  Object.values(rapidocLs).forEach((p) => {
    applyApiKey.call(this, p.securitySchemeId, p.username, p.password, p.value);
  });
}

function onApiKeyChange(securitySchemeId) {
  let apiKeyValue = '';
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.securitySchemeId === securitySchemeId));
  if (securityObj) {
    const trEl = this.shadowRoot.getElementById(`security-scheme-${securitySchemeId}`);
    if (trEl) {
      if (securityObj.type && securityObj.scheme && securityObj.type === 'http' && securityObj.scheme.toLowerCase() === 'basic') {
        const userVal = trEl.querySelector('.api-key-user').value.trim();
        const passwordVal = trEl.querySelector('.api-key-password').value.trim();
        applyApiKey.call(this, securitySchemeId, userVal, passwordVal);
      } else {
        apiKeyValue = trEl.querySelector('.api-key-input').value.trim();
        applyApiKey.call(this, securitySchemeId, '', '', apiKeyValue);
      }
      if (this.persistAuth === 'true') {
        const rapidocLs = getPersistedApiKeys.call(this);
        rapidocLs[securitySchemeId] = securityObj;
        setPersistedApiKeys.call(this, rapidocLs);
      }
    }
  }
}

// Updates the OAuth Access Token (API key), so it reflects in UI and gets used in TRY calls
function updateOAuthKey(securitySchemeId, accessToken, tokenType = 'Bearer') {
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.securitySchemeId === securitySchemeId));
  securityObj.finalKeyValue = `${(tokenType.toLowerCase() === 'bearer' ? 'Bearer' : (tokenType.toLowerCase() === 'mac' ? 'MAC' : tokenType))} ${accessToken}`;
  this.requestUpdate();
}

/* eslint-disable no-console */
// Gets Access-Token in exchange of Authorization Code
async function fetchAccessToken(tokenUrl, clientId, clientSecret, redirectUrl, grantType, authCode, securitySchemeId, authFlowDivEl, sendClientSecretIn = 'header', scopes = null, username = null, password = null) {
  const respDisplayEl = authFlowDivEl ? authFlowDivEl.querySelector('.oauth-resp-display') : undefined;
  const urlFormParams = new URLSearchParams();
  const headers = new Headers();
  urlFormParams.append('grant_type', grantType);
  if (grantType === 'authorization_code') {
    urlFormParams.append('client_id', clientId);
    urlFormParams.append('client_secret', clientSecret);
  }
  if (grantType !== 'client_credentials' && grantType !== 'password') {
    urlFormParams.append('redirect_uri', redirectUrl);
  }
  if (authCode) {
    urlFormParams.append('code', authCode);
    urlFormParams.append('code_verifier', codeVerifier); // for PKCE
  }
  if (sendClientSecretIn === 'header') {
    // headers.set('Authorization', `Basic ${btoa(`${clientId}:${clientSecret}`)}`);
    headers.set('Authorization', `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`);
  } else {
    urlFormParams.append('client_id', clientId);
    urlFormParams.append('client_secret', clientSecret);
  }
  if (grantType === 'password') {
    urlFormParams.append('username', username);
    urlFormParams.append('password', password);
  }
  if (scopes) {
    urlFormParams.append('scope', scopes);
  }

  try {
    const resp = await fetch(tokenUrl, { method: 'POST', headers, body: urlFormParams });
    const tokenResp = await resp.json();
    if (resp.ok) {
      if (tokenResp.token_type && tokenResp.access_token) {
        updateOAuthKey.call(this, securitySchemeId, tokenResp.access_token, tokenResp.token_type);
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
async function onWindowMessageEvent(msgEvent, winObj, tokenUrl, clientId, clientSecret, redirectUrl, grantType, sendClientSecretIn, securitySchemeId, authFlowDivEl) {
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
      fetchAccessToken.call(this, tokenUrl, clientId, clientSecret, redirectUrl, grantType, msgEvent.data.code, securitySchemeId, authFlowDivEl, sendClientSecretIn);
    } else if (msgEvent.data.responseType === 'token') {
      // Implicit flow
      updateOAuthKey.call(this, securitySchemeId, msgEvent.data.access_token, msgEvent.data.token_type);
    }
  }
}

// code_challenge generator for PKCE flow
// TODO: Implement dynamic generation of code-challenge based on code-verifier
/*
async function generateCodeChallenge() {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const sha256Hash = await window.crypto.subtle.digest('SHA-256', data); // returns Unit8Array
  // const utf8Decoder = new TextDecoder();
  // const b64EncodedSha256 = btoa(utf8Decoder.decode(sha256Hash));
  const b64EncodedSha256 = base64encode(sha256Hash);
  return b64EncodedSha256;
}
*/

async function onInvokeOAuthFlow(securitySchemeId, flowType, authUrl, tokenUrl, e) {
  const authFlowDivEl = e.target.closest('.oauth-flow');
  const clientId = authFlowDivEl.querySelector('.oauth-client-id') ? authFlowDivEl.querySelector('.oauth-client-id').value.trim() : '';
  const clientSecret = authFlowDivEl.querySelector('.oauth-client-secret') ? authFlowDivEl.querySelector('.oauth-client-secret').value.trim() : '';
  const username = authFlowDivEl.querySelector('.api-key-user') ? authFlowDivEl.querySelector('.api-key-user').value.trim() : '';
  const password = authFlowDivEl.querySelector('.api-key-password') ? authFlowDivEl.querySelector('.api-key-password').value.trim() : '';
  const sendClientSecretIn = authFlowDivEl.querySelector('.oauth-send-client-secret-in') ? authFlowDivEl.querySelector('.oauth-send-client-secret-in').value.trim() : 'header';
  const checkedScopeEls = [...authFlowDivEl.querySelectorAll('.scope-checkbox:checked')];
  const pkceCheckboxEl = authFlowDivEl.querySelector(`#${securitySchemeId}-pkce`);
  const state = (`${Math.random().toString(36).slice(2, 9)}random${Math.random().toString(36).slice(2, 9)}`);
  const nonce = (`${Math.random().toString(36).slice(2, 9)}random${Math.random().toString(36).slice(2, 9)}`);
  // const codeChallenge = await generateCodeChallenge(codeVerifier);
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
    const authCodeParams = new URLSearchParams(authUrlObj.search);
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    if (selectedScopes) {
      authCodeParams.set('scope', selectedScopes);
    }
    authCodeParams.set('client_id', clientId);
    authCodeParams.set('redirect_uri', redirectUrlObj.toString());
    authCodeParams.set('response_type', responseType);
    authCodeParams.set('state', state);
    authCodeParams.set('nonce', nonce);
    if (pkceCheckboxEl && pkceCheckboxEl.checked) {
      authCodeParams.set('code_challenge', codeChallenge);
      authCodeParams.set('code_challenge_method', 'S256');
    }
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
          (msgEvent) => onWindowMessageEvent.call(this, msgEvent, newWindow, tokenUrl, clientId, clientSecret, redirectUrlObj.toString(), grantType, sendClientSecretIn, securitySchemeId, authFlowDivEl),
          { once: true },
        );
      }
    }, 10);
  } else if (flowType === 'clientCredentials') {
    grantType = 'client_credentials';
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    fetchAccessToken.call(this, tokenUrl, clientId, clientSecret, redirectUrlObj.toString(), grantType, '', securitySchemeId, authFlowDivEl, sendClientSecretIn, selectedScopes);
  } else if (flowType === 'password') {
    grantType = 'password';
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    fetchAccessToken.call(this, tokenUrl, clientId, clientSecret, redirectUrlObj.toString(), grantType, '', securitySchemeId, authFlowDivEl, sendClientSecretIn, selectedScopes, username, password);
  }
}
/* eslint-enable no-console */

/* eslint-disable indent */

function oAuthFlowTemplate(flowName, clientId, clientSecret, securitySchemeId, authFlow, defaultScopes = [], receiveTokenIn = 'header') {
  let { authorizationUrl, tokenUrl, refreshUrl } = authFlow;
  const pkceOnly = authFlow['x-pkce-only'] || false;
  const isUrlAbsolute = (url) => (url.indexOf('://') > 0 || url.indexOf('//') === 0);
  if (refreshUrl && !isUrlAbsolute(refreshUrl)) {
    refreshUrl = `${this.selectedServer.computedUrl}/${refreshUrl.replace(/^\//, '')}`;
  }
  if (tokenUrl && !isUrlAbsolute(tokenUrl)) {
    tokenUrl = `${this.selectedServer.computedUrl}/${tokenUrl.replace(/^\//, '')}`;
  }
  if (authorizationUrl && !isUrlAbsolute(authorizationUrl)) {
    authorizationUrl = `${this.selectedServer.computedUrl}/${authorizationUrl.replace(/^\//, '')}`;
  }
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
    <div class="oauth-flow ${flowName}" style="padding: 12px 0; margin-bottom:12px;">
      <div class="tiny-title upper" style="margin-bottom:8px;">${flowNameDisplay}</div>
      ${authorizationUrl
        ? html`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Auth URL</span> <span class="mono-font"> ${authorizationUrl} </span></div>`
        : ''
      }
      ${tokenUrl
        ? html`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Token URL</span> <span class="mono-font">${tokenUrl}</span></div>`
        : ''
      }
      ${refreshUrl
        ? html`<div style="margin-bottom:5px"><span style="width:75px; display: inline-block;">Refresh URL</span> <span class="mono-font">${refreshUrl}</span></div>`
        : ''
      }
      ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'implicit' || flowName === 'password'
        ? html`
          ${authFlow.scopes
            ? html`
              <span> Scopes </span>
              <div class= "oauth-scopes" part="section-auth-scopes" style = "width:100%; display:flex; flex-direction:column; flex-wrap:wrap; margin:0 0 10px 24px">
                ${Object.entries(authFlow.scopes).map((scopeAndDescr, index) => html`
                  <div class="m-checkbox" style="display:inline-flex; align-items:center">
                    <input type="checkbox" part="checkbox checkbox-auth-scope" class="scope-checkbox" id="${securitySchemeId}${flowName}${index}" ?checked="${defaultScopes.includes(scopeAndDescr[0])}" value="${scopeAndDescr[0]}">
                    <label for="${securitySchemeId}${flowName}${index}" style="margin-left:5px; cursor:pointer">
                      <span class="mono-font">${scopeAndDescr[0]}</span>
                        ${scopeAndDescr[0] !== scopeAndDescr[1] ? ` - ${scopeAndDescr[1] || ''}` : ''}
                    </label>
                  </div>
                `)}
              </div>
            `
            : ''
          }
          ${flowName === 'password'
            ? html`
              <div style="margin:5px 0">
                <input type="text" value = "" placeholder="username" spellcheck="false" class="oauth2 ${flowName} ${securitySchemeId} api-key-user" part="textbox textbox-username">
                <input type="password" value = "" placeholder="password" spellcheck="false" class="oauth2 ${flowName} ${securitySchemeId} api-key-password" style = "margin:0 5px;" part="textbox textbox-password">
              </div>`
            : ''
          }
          <div>
            ${flowName === 'authorizationCode'
              ? html`
                <div style="margin: 16px 0 4px">
                  <input type="checkbox" part="checkbox checkbox-auth-scope" id="${securitySchemeId}-pkce" checked ?disabled=${pkceOnly}>
                  <label for="${securitySchemeId}-pkce" style="margin:0 16px 0 4px; line-height:24px; cursor:pointer">
                   Send Proof Key for Code Exchange (PKCE)
                  </label>
                </div>
              `
              : ''
            }
            <input type="text" part="textbox textbox-auth-client-id" value = "${clientId || ''}" placeholder="client-id" spellcheck="false" class="oauth2 ${flowName} ${securitySchemeId} oauth-client-id">
            ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'password'
              ? html`
                <input 
                  type="password" part="textbox textbox-auth-client-secret" 
                  value = "${clientSecret || ''}" placeholder="client-secret" spellcheck="false" 
                  class="oauth2 ${flowName} ${securitySchemeId} 
                  oauth-client-secret" 
                  style = "margin:0 5px;${pkceOnly ? 'display:none;' : ''}"
                >
                <select style="margin-right:5px;${pkceOnly ? 'display:none;' : ''}" class="${flowName} ${securitySchemeId} oauth-send-client-secret-in">
                  <option value = 'header' .selected = ${receiveTokenIn === 'header'} > Authorization Header </option>
                  <option value = 'request-body' .selected = ${receiveTokenIn === 'request-body'}> Request Body </option>
                </select>`
              : ''
            }
            ${flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'implicit' || flowName === 'password'
              ? html`
                <button class="m-btn thin-border" part="btn btn-outline"
                  @click="${(e) => { onInvokeOAuthFlow.call(this, securitySchemeId, flowName, authorizationUrl, tokenUrl, e); }}"
                > GET TOKEN </button>`
              : ''
            }
          </div>
          <div class="oauth-resp-display red-text small-font-size"></div>
          `
        : ''
      }
    </div>
  `;
}

function removeApiKey(securitySchemeId) {
  const securityObj = this.resolvedSpec.securitySchemes?.find((v) => (v.securitySchemeId === securitySchemeId));
  securityObj.user = '';
  securityObj.password = '';
  securityObj.value = '';
  securityObj.finalKeyValue = '';
  if (this.persistAuth === 'true') {
    const rapidocLs = getPersistedApiKeys.call(this);
    delete rapidocLs[securityObj.securitySchemeId];
    setPersistedApiKeys.call(this, rapidocLs);
  }
  this.requestUpdate();
}

export default function securitySchemeTemplate() {
  if (!this.resolvedSpec) { return ''; }
  const providedApiKeys = this.resolvedSpec.securitySchemes?.filter((v) => (v.finalKeyValue));
  if (!providedApiKeys) {
    return;
  }
  return html`
  <section id='auth' part="section-auth" style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;" class = 'observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap '}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>

    <div class="small-font-size" style="display:flex; align-items: center; min-height:30px">
      ${providedApiKeys.length > 0
        ? html`
          <div class="blue-text"> ${providedApiKeys.length} API key applied </div>
          <div style="flex:1"></div>
          <button class="m-btn thin-border" part="btn btn-outline" @click=${() => { onClearAllApiKeys.call(this); }}>CLEAR ALL API KEYS</button>`
        : html`<div class="red-text">No API key applied</div>`
      }
    </div>
    ${this.resolvedSpec.securitySchemes && this.resolvedSpec.securitySchemes.length > 0
      ? html`
        <table role="presentation" id="auth-table" class='m-table padded-12' style="width:100%;">
          ${this.resolvedSpec.securitySchemes.map((v) => html`
            <tr id="security-scheme-${v.securitySchemeId}" class="${v.type.toLowerCase()}">
              <td style="max-width:500px; overflow-wrap: break-word;">
                <div style="line-height:28px; margin-bottom:5px;">
                  <span style="font-weight:bold; font-size:var(--font-size-regular)">${v.typeDisplay}</span>
                  ${v.finalKeyValue
                    ? html`
                      <span class='blue-text'>  ${v.finalKeyValue ? 'Key Applied' : ''} </span>
                      <button class="m-btn thin-border small" part="btn btn-outline" @click=${() => { removeApiKey.call(this, v.securitySchemeId); }}>REMOVE</button>
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

                ${(v.type.toLowerCase() === 'apikey') || (v.type.toLowerCase() === 'http' && v.scheme.toLowerCase() === 'bearer')
                  ? html`
                    <div style="margin-bottom:5px">
                      ${v.type.toLowerCase() === 'apikey'
                        ? html`Send <code>${v.name}</code> in <code>${v.in}</code>`
                        : html`Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by a space and a Token String.`
                      }
                    </div>
                    <div style="max-height:28px;">
                      ${v.in !== 'cookie'
                        ? html`
                          <input type = "text" value = "${v.value}" class="${v.type} ${v.securitySchemeId} api-key-input" placeholder = "api-token" spellcheck = "false">
                          <button class="m-btn thin-border" style = "margin-left:5px;"
                            part = "btn btn-outline"
                            @click="${(e) => { onApiKeyChange.call(this, v.securitySchemeId, e); }}">
                            ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                          </button>`
                        : html`<span class="gray-text" style="font-size::var(--font-size-small)"> cookies cannot be set from here</span>`
                      }
                    </div>`
                  : ''
                }
                ${v.type.toLowerCase() === 'http' && v.scheme.toLowerCase() === 'basic'
                  ? html`
                    <div style="margin-bottom:5px">
                      Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by a space and a base64 encoded string of <code>username:password</code>.
                    </div>
                    <div>
                      <input type="text" value = "${v.user}" placeholder="username" spellcheck="false" class="${v.type} ${v.securitySchemeId} api-key-user" style="width:100px">
                      <input type="password" value = "${v.password}" placeholder="password" spellcheck="false" class="${v.type} ${v.securitySchemeId} api-key-password" style = "width:100px; margin:0 5px;">
                      <button class="m-btn thin-border"
                        @click="${(e) => { onApiKeyChange.call(this, v.securitySchemeId, e); }}"
                        part = "btn btn-outline"
                      >
                        ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                      </button>
                    </div>`
                  : ''
                }
              </td>
            </tr>
            ${v.type.toLowerCase() === 'oauth2'
              ? html`
                <tr>
                  <td style="border:none; padding-left:48px">
                    ${Object.keys(v.flows).map((f) => oAuthFlowTemplate
                      .call(
                        this,
                        f,
                        (v.flows[f]['x-client-id'] || v['x-client-id'] || ''),
                        (v.flows[f]['x-client-secret'] || v['x-client-secret'] || ''),
                        v.securitySchemeId,
                        v.flows[f],
                        (v.flows[f]['x-default-scopes'] || v['x-default-scopes']),
                        (v.flows[f]['x-receive-token-in'] || v['x-receive-token-in']),
                      ))}
                  </td>
                </tr>
                `
              : ''
            }
          `)}
        </table>`
      : ''
    }
    <slot name="auth"></slot>
  </section>
`;
}

export function pathSecurityTemplate(pathSecurity) {
  if (this.resolvedSpec.securitySchemes && pathSecurity) {
    const orSecurityKeys1 = [];
    if (Array.isArray(pathSecurity)) {
      if (pathSecurity.length === 0) {
        return '';
      }
    } else {
      return '';
    }
    pathSecurity.forEach((pSecurity) => {
      const andSecurityKeys1 = [];
      const andKeyTypes = [];
      if (Object.keys(pSecurity).length === 0) {
        orSecurityKeys1.push({
          securityTypes: 'None',
          securityDefs: [],
        });
      } else {
        Object.keys(pSecurity).forEach((pathSecurityKey) => {
          let pathScopes = '';
          const s = this.resolvedSpec.securitySchemes.find((ss) => ss.securitySchemeId === pathSecurityKey);
          if (pSecurity[pathSecurityKey] && Array.isArray(pSecurity[pathSecurityKey])) {
            pathScopes = pSecurity[pathSecurityKey].join(', ');
          }
          if (s) {
            andKeyTypes.push(s.typeDisplay);
            andSecurityKeys1.push({ ...s, ...({ scopes: pathScopes }) });
          }
        });
        orSecurityKeys1.push({
          securityTypes: andKeyTypes.length > 1 ? `${andKeyTypes[0]} + ${andKeyTypes.length - 1} more` : andKeyTypes[0],
          securityDefs: andSecurityKeys1,
        });
      }
    });
    return html`<div style="position:absolute; top:3px; right:2px; font-size:var(--font-size-small); line-height: 1.5;">
      <div style="position:relative; display:flex; min-width:350px; max-width:700px; justify-content: flex-end;">
        <svg width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" fill="none" style="stroke:var(--fg3)"> <rect x="5" y="11" width="14" height="10" rx="2" /> <circle cx="12" cy="16" r="1" /> <path d="M8 11v-4a4 4 0 0 1 8 0v4" /></svg>
          ${orSecurityKeys1.map((orSecurityItem1, i) => html`
          ${orSecurityItem1.securityTypes
            ? html`
              ${i !== 0 ? html`<div style="padding:3px 4px;"> OR </div>` : ''}
              <div class="tooltip">
                <div style = "padding:2px 4px; white-space:nowrap; text-overflow:ellipsis;max-width:150px; overflow:hidden;">
                  ${this.updateRoute === 'true' && this.allowAuthentication === 'true'
                    ? html`<a part="anchor anchor-operation-security" href="#auth"> ${orSecurityItem1.securityTypes} </a>`
                    : html`${orSecurityItem1.securityTypes}`
                  }
                </div>
                <div class="tooltip-text" style="position:absolute; color: var(--fg); top:26px; right:0; border:1px solid var(--border-color);padding:2px 4px; display:block;">
                  ${orSecurityItem1.securityDefs.length > 1 ? html`<div>Requires <b>all</b> of the following </div>` : ''}
                  <div style="padding-left: 8px">
                    ${orSecurityItem1.securityDefs.map((andSecurityItem, j) => {
                      const scopeHtml = html`${andSecurityItem.scopes !== ''
                        ? html`
                          <div>
                            <b>Required scopes:</b>
                            <br/>
                            <div style="margin-left:8px">
                              ${andSecurityItem.scopes.split(',').map((scope, cnt) => html`${cnt === 0 ? '' : '┃'}<span>${scope}</span>`)}
                            </div>
                          </div>`
                        : ''
                      }`;

                      return html`
                      ${andSecurityItem.type === 'oauth2'
                        ? html`
                          <div>
                            ${orSecurityItem1.securityDefs.length > 1
                              ? html`<b>${j + 1}.</b> &nbsp;`
                              : 'Needs'
                            }
                            OAuth Token <span style="font-family:var(--font-mono); color:var(--primary-color);">${andSecurityItem.securitySchemeId}</span> in <b>Authorization header</b>
                            ${scopeHtml}
                          </div>`
                        : andSecurityItem.type === 'http'
                          ? html`
                            <div>
                              ${orSecurityItem1.securityDefs.length > 1 ? html`<b>${j + 1}.</b> &nbsp;` : html`Requires`}
                              ${andSecurityItem.scheme === 'basic' ? 'Base 64 encoded username:password' : 'Bearer Token'} in <b>Authorization header</b>
                              ${scopeHtml}
                            </div>`
                          : html`
                            <div>
                              ${orSecurityItem1.securityDefs.length > 1 ? html`<b>${j + 1}.</b> &nbsp;` : html`Requires`}
                              Token in <b>${andSecurityItem.name} ${andSecurityItem.in}</b>
                              ${scopeHtml}
                            </div>`
                      }`;
                    })}
                  </div>
                </div>
              </div>
            `
            : ''
          }
        `)
        }
      </div>
    `;
  }
  return '';
}

/* eslint-enable indent */
