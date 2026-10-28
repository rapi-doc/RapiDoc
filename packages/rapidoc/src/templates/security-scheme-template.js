/**
 * Renders the authentication modal dialog supporting API Keys, HTTP Basic/Bearer, OAuth2 flows, and OpenID Connect.
 */
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { sanitizeHTML } from '../utils/sanitize.js';
import { oauthReceiverUrl } from '../utils/url-utils.js';
import { OAUTH_CHANNEL, isExpectedOAuthReply, pkceChallenge, randomUrlSafe } from '../utils/oauth-utils.js';
import { marked } from 'marked';

const localStorageKey = 'rapidoc';

function toBase64(str) {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return btoa(str);
  }
}

function normalizeParams(params) {
  const result = new URLSearchParams();
  if (!params) {
    return result;
  }
  if (params instanceof URLSearchParams) {
    for (const [k, v] of params.entries()) {
      result.set(k, v);
    }
    return result;
  }
  if (typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        result.set(k, String(v));
      }
    });
    return result;
  }
  if (typeof params === 'string') {
    const trimmed = params.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const obj = JSON.parse(trimmed);
        if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              result.set(k, String(v));
            }
          });
          return result;
        }
      } catch {
        // Not valid JSON, fall back to URLSearchParams
      }
    }
    const cleanStr = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;
    const parsed = new URLSearchParams(cleanStr);
    for (const [k, v] of parsed.entries()) {
      result.set(k, v);
    }
    return result;
  }
  return result;
}

/**
 * Applies a key to a security scheme so Try sends it. `note` (from the page hosting RapiDoc, through setApiKey) says
 * where the key came from, e.g. the reader's sign-in: the scheme then shows the note instead of its own form until
 * the reader asks for the form. Any later change of the key (form, GET TOKEN, REMOVE, CLEAR ALL) drops the note.
 */
export function applyApiKey(securitySchemeId, username = '', password = '', providedApikeyVal = '', note = '') {
  const securityObj = this.resolvedSpec.securitySchemes?.find((v) => v.securitySchemeId === securitySchemeId);
  if (!securityObj) {
    return false;
  }
  let finalApiKeyValue = '';
  if (securityObj.scheme?.toLowerCase() === 'basic') {
    if (username) {
      finalApiKeyValue = `Basic ${toBase64(`${username}:${password}`)}`;
    }
  } else if (providedApikeyVal) {
    securityObj.value = providedApikeyVal;
    finalApiKeyValue = `${securityObj.scheme?.toLowerCase() === 'bearer' ? 'Bearer ' : ''}${providedApikeyVal}`;
  }
  if (finalApiKeyValue) {
    securityObj.finalKeyValue = finalApiKeyValue;
    securityObj.hostNote = note ? String(note) : '';
    securityObj.hostFormOpen = false;
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
    v.hostNote = '';
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
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => v.securitySchemeId === securitySchemeId);
  if (securityObj) {
    const schemeEl = this.shadowRoot.getElementById(`security-scheme-${securitySchemeId}`);
    if (schemeEl) {
      if (securityObj.type && securityObj.scheme && securityObj.type === 'http' && securityObj.scheme.toLowerCase() === 'basic') {
        const userVal = schemeEl.querySelector('.api-key-user').value.trim();
        const passwordVal = schemeEl.querySelector('.api-key-password').value.trim();
        applyApiKey.call(this, securitySchemeId, userVal, passwordVal);
      } else {
        apiKeyValue = schemeEl.querySelector('.api-key-input').value.trim();
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

/** Shows a status line under an OAuth flow. Always as text: provider error messages are never HTML. */
function showOAuthStatus(el, text, colorVar) {
  if (!el) {
    return;
  }
  const span = document.createElement('span');
  span.style.color = `var(${colorVar})`;
  span.textContent = text;
  el.replaceChildren(span);
}

// Updates the OAuth Access Token (API key), so it reflects in UI and gets used in TRY calls
function updateOAuthKey(securitySchemeId, accessToken, tokenType = 'Bearer') {
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => v.securitySchemeId === securitySchemeId);
  securityObj.finalKeyValue = `${tokenType.toLowerCase() === 'bearer' ? 'Bearer' : tokenType.toLowerCase() === 'mac' ? 'MAC' : tokenType} ${accessToken}`;
  securityObj.hostNote = '';
  this.requestUpdate();
}

// Gets Access-Token in exchange of Authorization Code
async function fetchAccessToken(
  tokenUrl,
  clientId,
  clientSecret,
  redirectUrl,
  grantType,
  authCode,
  securitySchemeId,
  authFlowDivEl,
  sendClientSecretIn = 'request-body',
  scopes = null,
  username = null,
  password = null,
  tokenParamsSpec = null,
  codeVerifier = null
) {
  const respDisplayEl = authFlowDivEl ? authFlowDivEl.querySelector('.oauth-resp-display') : undefined;
  const urlFormParams = new URLSearchParams();
  const headers = new Headers();

  // Merge vendor extension x-token-params (if any)
  const specTokenParams = normalizeParams(tokenParamsSpec);
  for (const [k, v] of specTokenParams.entries()) {
    urlFormParams.set(k, v);
  }

  // Merge additional-token-params property/attribute on <rapi-doc> (if any)
  const attrTokenParams = normalizeParams(this.additionalTokenParams);
  for (const [k, v] of attrTokenParams.entries()) {
    urlFormParams.set(k, v);
  }

  urlFormParams.set('grant_type', grantType);
  if (grantType !== 'client_credentials' && grantType !== 'password') {
    urlFormParams.set('redirect_uri', redirectUrl);
  }
  if (authCode) {
    urlFormParams.set('code', authCode);
    if (codeVerifier) {
      urlFormParams.set('code_verifier', codeVerifier); // PKCE: proves this page started the sign-in
    }
  }
  if (sendClientSecretIn === 'header' && clientSecret) {
    headers.set('Authorization', `Basic ${toBase64(`${clientId}:${clientSecret}`)}`);
  } else {
    if (clientId) {
      urlFormParams.set('client_id', clientId);
    }
    if (clientSecret) {
      urlFormParams.set('client_secret', clientSecret);
    }
  }
  if (grantType === 'password') {
    urlFormParams.set('username', username);
    urlFormParams.set('password', password);
  }
  if (scopes) {
    urlFormParams.set('scope', scopes);
  }

  const requestDetail = {
    method: 'POST',
    headers,
    body: urlFormParams,
  };
  const beforeTokenEvent = new CustomEvent('before-token-request', {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: {
      securitySchemeId,
      grantType,
      tokenUrl,
      params: urlFormParams,
      headers,
      request: requestDetail,
    },
  });
  const notCancelled = this.dispatchEvent(beforeTokenEvent);
  if (!notCancelled) {
    return false;
  }

  try {
    const resp = await fetch(tokenUrl, {
      method: requestDetail.method || 'POST',
      headers: requestDetail.headers || headers,
      body: requestDetail.body || urlFormParams,
    });
    const tokenResp = await resp.json();
    if (resp.ok) {
      if (tokenResp.token_type && tokenResp.access_token) {
        updateOAuthKey.call(this, securitySchemeId, tokenResp.access_token, tokenResp.token_type);
        showOAuthStatus(respDisplayEl, 'Access Token Received', '--green');
        return true;
      }
    } else {
      showOAuthStatus(respDisplayEl, tokenResp.error_description || tokenResp.error || 'Unable to get access token', '--destructive');
      return false;
    }
  } catch {
    showOAuthStatus(respDisplayEl, 'Failed to get access token', '--destructive');
    return false;
  }
}

/**
 * Handles the provider's reply to this sign-in (already checked by waitForOAuthReply): exchanges a code for a
 * token, or applies a token (implicit flow). Accepts the older receiver's key names too.
 */
function onOAuthReply(reply, flow) {
  const respDisplayEl = flow.authFlowDivEl ? flow.authFlowDivEl.querySelector('.oauth-resp-display') : undefined;
  if (reply.error) {
    showOAuthStatus(respDisplayEl, reply.errorDescription || reply.error, '--destructive');
    return;
  }
  if (reply.responseType === 'code') {
    fetchAccessToken.call(
      this,
      flow.tokenUrl,
      flow.clientId,
      flow.clientSecret,
      flow.redirectUrl,
      flow.grantType,
      reply.code,
      flow.securitySchemeId,
      flow.authFlowDivEl,
      flow.sendClientSecretIn,
      null,
      null,
      null,
      flow.tokenParamsSpec,
      flow.codeVerifier
    );
  } else {
    const accessToken = reply.accessToken || reply.access_token;
    if (accessToken) {
      updateOAuthKey.call(this, flow.securitySchemeId, accessToken, reply.tokenType || reply.token_type || 'Bearer');
    }
  }
}

/**
 * Waits for the return page's reply to this sign-in: a window message from the popup, or a BroadcastChannel
 * message when the provider's page cut the popup's link to this window (Cross-Origin-Opener-Policy). Anything
 * that isn't the reply to this sign-in (other origin, other window, other state) is ignored, so it can neither
 * inject a code or token nor end the wait. Starting another sign-in stops the previous wait.
 */
function waitForOAuthReply(popup, state, onReply) {
  if (typeof this.stopOAuthWait === 'function') {
    this.stopOAuthWait();
  }
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(OAUTH_CHANNEL) : null;
  let onMessage;
  const stop = () => {
    window.removeEventListener('message', onMessage);
    if (channel) {
      channel.close();
    }
    if (this.stopOAuthWait === stop) {
      this.stopOAuthWait = null;
    }
  };
  const finish = (reply) => {
    stop();
    try {
      popup.close();
    } catch {
      // already closed
    }
    onReply(reply);
  };
  onMessage = (msgEvent) => {
    if (isExpectedOAuthReply(msgEvent.data, { state, origin: window.location.origin }, msgEvent.origin, msgEvent.source, popup)) {
      finish(msgEvent.data);
    }
  };
  window.addEventListener('message', onMessage);
  if (channel) {
    channel.onmessage = (msgEvent) => {
      if (isExpectedOAuthReply(msgEvent.data, { state })) {
        finish(msgEvent.data);
      }
    };
  }
  this.stopOAuthWait = stop;
}

async function onInvokeOAuthFlow(securitySchemeId, flowType, authUrl, tokenUrl, e, authorizeParamsSpec = null, tokenParamsSpec = null) {
  const authFlowDivEl = e.target.closest('.oauth-flow');
  const clientId = authFlowDivEl.querySelector('.oauth-client-id') ? authFlowDivEl.querySelector('.oauth-client-id').value.trim() : '';
  const clientSecret = authFlowDivEl.querySelector('.oauth-client-secret')
    ? authFlowDivEl.querySelector('.oauth-client-secret').value.trim()
    : '';
  const username = authFlowDivEl.querySelector('.api-key-user') ? authFlowDivEl.querySelector('.api-key-user').value.trim() : '';
  const password = authFlowDivEl.querySelector('.api-key-password') ? authFlowDivEl.querySelector('.api-key-password').value.trim() : '';
  const sendClientSecretIn = authFlowDivEl.querySelector('.oauth-send-client-secret-in')
    ? authFlowDivEl.querySelector('.oauth-send-client-secret-in').value.trim()
    : 'request-body';
  const checkedScopeEls = [...authFlowDivEl.querySelectorAll('.scope-checkbox:checked')];
  const pkceCheckboxEl = authFlowDivEl.querySelector(`#${securitySchemeId}-pkce`);
  // Unguessable per sign-in: state ties the reply to this sign-in, the PKCE verifier proves it at the token endpoint.
  const state = randomUrlSafe(16);
  const nonce = randomUrlSafe(16);
  const usePkce = Boolean(pkceCheckboxEl && pkceCheckboxEl.checked);
  const codeVerifier = usePkce ? randomUrlSafe(32) : null;
  const redirectUrlObj = oauthReceiverUrl(window.location, this.oauthReceiver);
  let grantType = '';
  let responseType = '';
  let newWindow;

  // clear previous error messages
  const errEls = [...authFlowDivEl.parentNode.querySelectorAll('.oauth-resp-display')];
  errEls.forEach((v) => {
    v.replaceChildren();
  });

  if (flowType === 'authorizationCode' || flowType === 'implicit') {
    const authUrlObj = new URL(authUrl);
    if (flowType === 'authorizationCode') {
      grantType = 'authorization_code';
      responseType = 'code';
    } else if (flowType === 'implicit') {
      responseType = 'token';
    }
    const authCodeParams = new URLSearchParams(authUrlObj.search);

    // Merge vendor extension x-authorize-params (if any)
    const specAuthParams = normalizeParams(authorizeParamsSpec);
    for (const [k, v] of specAuthParams.entries()) {
      authCodeParams.set(k, v);
    }

    // Merge additional-authorize-params property/attribute on <rapi-doc> (if any)
    const attrAuthParams = normalizeParams(this.additionalAuthorizeParams);
    for (const [k, v] of attrAuthParams.entries()) {
      authCodeParams.set(k, v);
    }

    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    if (selectedScopes) {
      authCodeParams.set('scope', selectedScopes);
    }
    authCodeParams.set('client_id', clientId);
    authCodeParams.set('redirect_uri', redirectUrlObj.toString());
    authCodeParams.set('response_type', responseType);
    authCodeParams.set('state', state);
    authCodeParams.set('nonce', nonce);
    if (codeVerifier) {
      authCodeParams.set('code_challenge', await pkceChallenge(codeVerifier));
      authCodeParams.set('code_challenge_method', 'S256');
    }

    const beforeAuthorizeEvent = new CustomEvent('before-authorize', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        securitySchemeId,
        flowType,
        authUrl,
        authParams: authCodeParams,
      },
    });
    const notCancelled = this.dispatchEvent(beforeAuthorizeEvent);
    if (!notCancelled) {
      return;
    }

    authUrlObj.search = authCodeParams.toString();
    newWindow = window.open(authUrlObj.toString());
    if (!newWindow) {
      console.error(`RapiDoc: Unable to open ${authUrlObj.toString()} in a new window`);
      showOAuthStatus(authFlowDivEl.querySelector('.oauth-resp-display'), 'The sign-in window was blocked', '--destructive');
      return;
    }
    waitForOAuthReply.call(this, newWindow, state, (reply) =>
      onOAuthReply.call(this, reply, {
        tokenUrl,
        clientId,
        clientSecret,
        redirectUrl: redirectUrlObj.toString(),
        grantType,
        sendClientSecretIn,
        securitySchemeId,
        authFlowDivEl,
        tokenParamsSpec,
        codeVerifier,
      })
    );
  } else if (flowType === 'clientCredentials') {
    grantType = 'client_credentials';
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    fetchAccessToken.call(
      this,
      tokenUrl,
      clientId,
      clientSecret,
      redirectUrlObj.toString(),
      grantType,
      '',
      securitySchemeId,
      authFlowDivEl,
      sendClientSecretIn,
      selectedScopes,
      null,
      null,
      tokenParamsSpec
    );
  } else if (flowType === 'password') {
    grantType = 'password';
    const selectedScopes = checkedScopeEls.map((v) => v.value).join(' ');
    fetchAccessToken.call(
      this,
      tokenUrl,
      clientId,
      clientSecret,
      redirectUrlObj.toString(),
      grantType,
      '',
      securitySchemeId,
      authFlowDivEl,
      sendClientSecretIn,
      selectedScopes,
      username,
      password,
      tokenParamsSpec
    );
  }
}

function oAuthFlowTemplate(
  flowName,
  clientId,
  clientSecret,
  securitySchemeId,
  authFlow,
  defaultScopes = [],
  receiveTokenIn = 'request-body',
  receiveTokenInOptions = undefined,
  allowTry = 'true',
  authorizeParams = null,
  tokenParams = null
) {
  let { authorizationUrl, tokenUrl, refreshUrl } = authFlow;
  const pkceOnly = authFlow['x-pkce-only'] || false;
  const isUrlAbsolute = (url) => url.indexOf('://') > 0 || url.indexOf('//') === 0;
  /*
  Calculcate Relative URL based on the following logic
  IF this.selectedServer?.computedUrl ends with slash and the refreshUrl / tokenUrl / authorizationUrl do not start with slash
  THEN Relative URL is concatenate else use this.selectedServer?.computedUrl + refreshUrl / tokenUrl / authorizationUrl
  ELSE Relative URL is concatenate else use (origin of this.selectedServer?.computedUrl) + refreshUrl / tokenUrl / authorizationUrl
  */
  const url = new URL(this.selectedServer?.computedUrl);
  const originUrl = url.origin;
  if (refreshUrl && !isUrlAbsolute(refreshUrl)) {
    if (this.selectedServer?.computedUrl.trim().endsWith('/') && !refreshUrl.trim().startsWith('/')) {
      refreshUrl = `${this.selectedServer?.computedUrl.trim()}${refreshUrl.trim()}`;
    } else {
      refreshUrl = `${originUrl}/${refreshUrl.replace(/^\//, '')}`;
    }
  }
  if (tokenUrl && !isUrlAbsolute(tokenUrl)) {
    if (this.selectedServer?.computedUrl.trim().endsWith('/') && !tokenUrl.trim().startsWith('/')) {
      tokenUrl = `${this.selectedServer?.computedUrl.trim()}${tokenUrl.trim()}`;
    } else {
      tokenUrl = `${originUrl}/${tokenUrl.replace(/^\//, '')}`;
    }
  }
  if (authorizationUrl && !isUrlAbsolute(authorizationUrl)) {
    if (this.selectedServer?.computedUrl.trim().endsWith('/') && !authorizationUrl.trim().startsWith('/')) {
      authorizationUrl = `${this.selectedServer?.computedUrl.trim()}${authorizationUrl.trim()}`;
    } else {
      authorizationUrl = `${originUrl}/${authorizationUrl.replace(/^\//, '')}`;
    }
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
  const showCredentials = flowName === 'authorizationCode' || flowName === 'clientCredentials' || flowName === 'password';
  const isKnownFlow = showCredentials || flowName === 'implicit';
  return html`
    <div class="oauth-flow ${flowName}">
      <h3 class="rapidoc-heading label-heading tiny-title upper" part="heading heading-3">${flowNameDisplay}</h3>
      ${
        authorizationUrl || tokenUrl || refreshUrl
          ? html`<dl class="oauth-urls">
              ${
                authorizationUrl
                  ? html`<dt>Auth URL</dt>
                      <dd class="mono-font">${authorizationUrl}</dd>`
                  : ''
              }
              ${
                tokenUrl
                  ? html`<dt>Token URL</dt>
                      <dd class="mono-font">${tokenUrl}</dd>`
                  : ''
              }
              ${
                refreshUrl
                  ? html`<dt>Refresh URL</dt>
                      <dd class="mono-font">${refreshUrl}</dd>`
                  : ''
              }
            </dl>`
          : ''
      }
      ${
        isKnownFlow && authFlow.scopes
          ? html`<div class="oauth-scopes-label">Scopes</div>
              <div class="oauth-scopes" part="section-auth-scopes">
                ${Object.entries(authFlow.scopes).map(
                  ([scope, scopeDescr], index) =>
                    html`<label class="auth-toggle" for="${securitySchemeId}${flowName}${index}">
                      <input
                        type="checkbox"
                        part="checkbox checkbox-auth-scope"
                        class="scope-checkbox"
                        id="${securitySchemeId}${flowName}${index}"
                        ?checked="${defaultScopes.includes(scope)}"
                        value="${scope}"
                      />
                      <span
                        ><span class="oauth-scope-name mono-font">${scope}</span>${
                          scope !== scopeDescr && scopeDescr ? html` <span class="oauth-scope-descr">${scopeDescr}</span>` : ''
                        }</span
                      >
                    </label>`
                )}
              </div>`
          : ''
      }
      ${
        isKnownFlow && allowTry === 'true'
          ? html`${
                flowName === 'authorizationCode'
                  ? html`<label class="auth-toggle oauth-pkce" for="${securitySchemeId}-pkce">
                      <input
                        type="checkbox"
                        part="checkbox checkbox-auth-scope"
                        id="${securitySchemeId}-pkce"
                        checked
                        ?disabled=${pkceOnly}
                      />
                      <span>Send Proof Key for Code Exchange (PKCE)</span>
                    </label>`
                  : ''
              }
              ${
                flowName === 'password'
                  ? html`<div class="auth-controls">
                      <input
                        type="text"
                        value=""
                        placeholder="username"
                        spellcheck="false"
                        class="oauth2 ${flowName} ${securitySchemeId} api-key-user"
                        part="textbox textbox-username"
                        id="input-${securitySchemeId}-${flowName}-api-key-user"
                      />
                      <input
                        type="password"
                        value=""
                        placeholder="password"
                        spellcheck="false"
                        class="oauth2 ${flowName} ${securitySchemeId} api-key-password"
                        part="textbox textbox-password"
                        id="input-${securitySchemeId}-${flowName}-api-key-password"
                      />
                    </div>`
                  : ''
              }
              <div class="auth-controls">
                <input
                  type="text"
                  part="textbox textbox-auth-client-id"
                  value="${clientId || ''}"
                  placeholder="client-id"
                  spellcheck="false"
                  class="oauth2 ${flowName} ${securitySchemeId} oauth-client-id"
                />
                ${
                  showCredentials
                    ? html`<input
                          id="${securitySchemeId}-${flowName}-oauth-client-secret"
                          type="password"
                          part="textbox textbox-auth-client-secret"
                          value="${clientSecret || ''}"
                          placeholder="client-secret"
                          spellcheck="false"
                          class="oauth2 ${flowName} ${securitySchemeId} oauth-client-secret"
                          ?hidden=${pkceOnly}
                        />
                        <select
                          class="${flowName} ${securitySchemeId} oauth-send-client-secret-in"
                          aria-label="Send client secret in"
                          ?hidden=${pkceOnly}
                        >
                          ${
                            !receiveTokenInOptions || receiveTokenInOptions.includes('request-body')
                              ? html`<option value="request-body" .selected=${receiveTokenIn === 'request-body'}>Request Body</option>`
                              : ''
                          }
                          ${
                            !receiveTokenInOptions || receiveTokenInOptions.includes('header')
                              ? html`<option value="header" .selected=${receiveTokenIn === 'header'}>Authorization Header</option>`
                              : ''
                          }
                        </select>`
                    : ''
                }
                <button
                  class="btn btn-outline"
                  part="btn btn-outline"
                  @click="${(e) => {
                    onInvokeOAuthFlow.call(this, securitySchemeId, flowName, authorizationUrl, tokenUrl, e, authorizeParams, tokenParams);
                  }}"
                >
                  GET TOKEN
                </button>
              </div>
              <div class="oauth-resp-display red-text small-font-size"></div>`
          : ''
      }
    </div>
  `;
}

function removeApiKey(securitySchemeId) {
  const securityObj = this.resolvedSpec.securitySchemes?.find((v) => v.securitySchemeId === securitySchemeId);
  securityObj.user = '';
  securityObj.password = '';
  securityObj.value = '';
  securityObj.finalKeyValue = '';
  securityObj.hostNote = '';
  if (this.persistAuth === 'true') {
    const rapidocLs = getPersistedApiKeys.call(this);
    delete rapidocLs[securityObj.securitySchemeId];
    setPersistedApiKeys.call(this, rapidocLs);
  }
  this.requestUpdate();
}

export default function securitySchemeTemplate(allowTry = 'true') {
  if (!this.resolvedSpec) {
    return '';
  }

  const providedApiKeys = this.resolvedSpec.securitySchemes?.filter((v) => v.finalKeyValue);
  if (!providedApiKeys) {
    return;
  }
  return html`
    <section
      id="auth"
      part="section-auth"
      style="text-align:left; direction:ltr; margin-top:24px; margin-bottom:24px;"
      class="observe-me ${'read focused'.includes(this.renderStyle) ? 'section-gap--read-mode' : 'section-gap '}"
    >
      <h2 class="rapidoc-heading sub-title regular-font" part="section-auth-title heading heading-2">Authentication</h2>
      ${
        allowTry === 'true'
          ? html`<div class="auth-status small-font-size">
              ${
                providedApiKeys.length > 0
                  ? html`<div class="blue-text">${providedApiKeys.length} API key applied</div>
                      <button
                        class="btn btn-outline"
                        part="btn btn-outline"
                        @click=${() => {
                          onClearAllApiKeys.call(this);
                        }}
                      >
                        CLEAR ALL API KEYS
                      </button>`
                  : html`<div class="red-text">No API key applied</div>`
              }
            </div>`
          : ''
      }
      ${
        this.resolvedSpec.securitySchemes && this.resolvedSpec.securitySchemes.length > 0
          ? html` <ul class="auth-list" id="auth-list" part="auth-list" role="list">
              ${this.resolvedSpec.securitySchemes
                .filter((v) => v.type)
                .map((v) => {
                  // A key the host page applied with a note (e.g. the reader's sign-in): the note replaces the
                  // scheme's form, which stays one click away
                  const hostNote = allowTry === 'true' && v.finalKeyValue ? v.hostNote : '';
                  const folded = hostNote && !v.hostFormOpen;
                  return html`
                    <li id="security-scheme-${v.securitySchemeId}" class="auth-scheme ${v.type.toLowerCase()}" part="auth-scheme">
                      <div class="auth-scheme-body">
                        <div class="auth-scheme-header">
                          <span class="auth-scheme-title">${v.typeDisplay}</span>
                          ${
                            v.finalKeyValue
                              ? html`<span class="blue-text">Key Applied</span>
                                  <button
                                    class="btn btn-outline btn-sm"
                                    part="btn btn-outline"
                                    @click=${() => {
                                      removeApiKey.call(this, v.securitySchemeId);
                                    }}
                                  >
                                    REMOVE
                                  </button>`
                              : ''
                          }
                        </div>
                        ${v.description ? html`<div class="m-markdown">${unsafeHTML(sanitizeHTML(marked(v.description || '')))}</div>` : ''}
                        ${
                          hostNote
                            ? html`<div class="auth-host-note" part="auth-host-note">${hostNote}</div>
                                <button
                                  class="btn btn-link auth-host-toggle"
                                  part="btn btn-link"
                                  aria-expanded="${folded ? 'false' : 'true'}"
                                  @click=${() => {
                                    v.hostFormOpen = !v.hostFormOpen;
                                    this.requestUpdate();
                                  }}
                                >
                                  ${folded ? 'Use a different token' : 'Hide token form'}
                                </button>`
                            : ''
                        }
                        ${
                          !folded && v.type.toLowerCase() === 'apikey'
                            ? html`<div class="auth-hint">Send <code>${v.name}</code> in <code>${v.in}</code></div>
                                ${
                                  allowTry === 'true'
                                    ? v.in !== 'cookie'
                                      ? html`<div class="auth-controls">
                                          <input
                                            type="text"
                                            value="${v.value}"
                                            class="${v.type} ${v.securitySchemeId} api-key-input"
                                            placeholder="api-token"
                                            spellcheck="false"
                                            id="${v.type}-${v.securitySchemeId}-api-key-input"
                                          />
                                          <button
                                            class="btn btn-outline"
                                            part="btn btn-outline"
                                            @click="${() => {
                                              onApiKeyChange.call(this, v.securitySchemeId);
                                            }}"
                                          >
                                            ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                                          </button>
                                        </div>`
                                      : html`<div class="auth-hint gray-text">Cookies cannot be set from here</div>`
                                    : ''
                                }`
                            : ''
                        }
                        ${
                          !folded && v.type.toLowerCase() === 'http' && v.scheme?.toLowerCase() === 'basic'
                            ? html`<div class="auth-hint">
                                  Send <code>Authorization</code> in <code>header</code> containing the word <code>Basic</code> followed by
                                  a space and a base64 encoded string of <code>username:password</code>.
                                </div>
                                ${
                                  allowTry === 'true'
                                    ? html`<div class="auth-controls">
                                        <input
                                          type="text"
                                          value="${v.user}"
                                          placeholder="username"
                                          spellcheck="false"
                                          class="${v.type} ${v.securitySchemeId} api-key-user"
                                          id="input-${v.type}-${v.securitySchemeId}-api-key-user"
                                        />
                                        <input
                                          type="password"
                                          value="${v.password}"
                                          placeholder="password"
                                          spellcheck="false"
                                          class="${v.type} ${v.securitySchemeId} api-key-password"
                                          id="input-${v.type}-${v.securitySchemeId}-api-key-password"
                                        />
                                        <button
                                          class="btn btn-outline"
                                          @click="${() => {
                                            onApiKeyChange.call(this, v.securitySchemeId);
                                          }}"
                                          part="btn btn-outline"
                                        >
                                          ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                                        </button>
                                      </div>`
                                    : ''
                                }`
                            : ''
                        }
                        ${
                          !folded && v.type.toLowerCase() === 'http' && v.scheme?.toLowerCase() === 'bearer'
                            ? html`<div class="auth-hint">
                                  Send <code>Authorization</code> in <code>header</code> containing the word <code>Bearer</code> followed by
                                  a space and token value
                                </div>
                                ${
                                  allowTry === 'true'
                                    ? html`<div class="auth-controls">
                                        <input
                                          type="text"
                                          value="${v.value}"
                                          class="${v.type} ${v.securitySchemeId} api-key-input"
                                          placeholder="api-token"
                                          spellcheck="false"
                                          id="${v.type}-${v.securitySchemeId}-api-key-input"
                                        />
                                        <button
                                          class="btn btn-outline"
                                          part="btn btn-outline"
                                          @click="${() => {
                                            onApiKeyChange.call(this, v.securitySchemeId);
                                          }}"
                                        >
                                          ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                                        </button>
                                      </div>`
                                    : ''
                                }`
                            : ''
                        }
                      </div>
                      ${
                        !folded && v.type.toLowerCase() === 'oauth2'
                          ? html`<div class="auth-flows" part="auth-flows">
                              ${Object.keys(v.flows).map((f) =>
                                oAuthFlowTemplate.call(
                                  this,
                                  f,
                                  v.flows[f]['x-client-id'] || v['x-client-id'] || '',
                                  v.flows[f]['x-client-secret'] || v['x-client-secret'] || '',
                                  v.securitySchemeId,
                                  v.flows[f],
                                  v.flows[f]['x-default-scopes'] || v['x-default-scopes'],
                                  v.flows[f]['x-receive-token-in'] || v['x-receive-token-in'],
                                  v.flows[f]['x-receive-token-in-options'] || v['x-receive-token-in-options'],
                                  allowTry,
                                  v.flows[f]['x-authorize-params'] || v['x-authorize-params'] || null,
                                  v.flows[f]['x-token-params'] || v['x-token-params'] || null
                                )
                              )}
                            </div>`
                          : ''
                      }
                    </li>
                  `;
                })}
            </ul>`
          : ''
      }
      <slot name="auth"></slot>
    </section>
  `;
}

function renderSecuritySchemeDetail(andSecurityItem, isMultiple, j) {
  const scopeHtml = andSecurityItem.scopes
    ? html` <div>
        <b>Required scopes:</b><br />
        <div style="margin-left:8px">
          ${andSecurityItem.scopes.split(',').map((scope, cnt) => html`${cnt === 0 ? '' : '┃'}<span>${scope.trim()}</span>`)}
        </div>
      </div>`
    : '';

  if (andSecurityItem.type === 'oauth2') {
    return html` <div>
      ${isMultiple ? html`<b>${j + 1}.</b> &nbsp;` : 'Needs '}OAuth Token
      <span style="font-family:var(--font-mono); color:var(--primary);">${andSecurityItem.securitySchemeId}</span>
      in <b>Authorization header</b>
      ${scopeHtml}
    </div>`;
  }

  if (andSecurityItem.type === 'http') {
    return html` <div>
      ${isMultiple ? html`<b>${j + 1}.</b> &nbsp;` : 'Requires '}
      ${andSecurityItem.scheme === 'basic' ? 'Base 64 encoded username:password' : html`Bearer Token <b>${andSecurityItem.nameId}</b>`} in
      <b>Authorization header</b>
      ${scopeHtml}
    </div>`;
  }

  return html` <div>
    ${isMultiple ? html`<b>${j + 1}.</b> &nbsp;` : 'Requires '} Token in <b>${andSecurityItem.name} ${andSecurityItem.in}</b>
    ${scopeHtml}
  </div>`;
}

/*
 * Operation security chips: each chip shows its scheme details in a popover="hint" panel (a manual popover
 * where "hint" is unsupported) on hover or keyboard focus. The panel renders in the top layer, so it is never
 * clipped by scroll containers, and is anchored to its chip with CSS anchor positioning (JS fallback below).
 */
const supportsAnchorPositioning = typeof CSS !== 'undefined' && CSS.supports?.('anchor-name: --a');
const securityHideTimers = new WeakMap();
let openSecurityPopover = null;

function onSecurityPopoverKeydown(e) {
  if (e.key === 'Escape' && openSecurityPopover) {
    hideSecurityPopover(openSecurityPopover);
  }
}

function hideSecurityPopover(popover) {
  if (popover.matches(':popover-open')) {
    popover.hidePopover();
  }
  if (openSecurityPopover === popover) {
    openSecurityPopover = null;
    document.removeEventListener('keydown', onSecurityPopoverKeydown);
  }
}

// Fallback without CSS anchor positioning: places the panel below the chip (above when there is no room),
// left-aligned with it and kept inside the viewport
function placeSecurityPopover(chip, popover) {
  const gap = 6;
  const edge = 8;
  const r = chip.getBoundingClientRect();
  const { offsetWidth: w, offsetHeight: h } = popover;
  const left = Math.max(edge, Math.min(r.left, window.innerWidth - w - edge));
  const top = r.bottom + gap + h > window.innerHeight && r.top - gap - h >= 0 ? r.top - gap - h : r.bottom + gap;
  Object.assign(popover.style, { inset: 'auto', margin: '0', left: `${left}px`, top: `${top}px` });
}

function showSecurityPopover(e) {
  const chip = e.currentTarget.closest('.security-chip');
  const popover = chip?.querySelector('.security-popover');
  if (!popover || typeof popover.showPopover !== 'function') {
    return;
  }
  clearTimeout(securityHideTimers.get(chip));
  if (openSecurityPopover && openSecurityPopover !== popover) {
    hideSecurityPopover(openSecurityPopover);
  }
  if (!popover.matches(':popover-open')) {
    popover.showPopover();
  }
  if (!supportsAnchorPositioning) {
    placeSecurityPopover(chip, popover);
  }
  if (openSecurityPopover !== popover) {
    openSecurityPopover = popover;
    document.addEventListener('keydown', onSecurityPopoverKeydown);
  }
}

// Delayed so the pointer can cross the gap into the panel; the panel stays open while the chip is hovered or focused
function scheduleHideSecurityPopover(e) {
  const chip = e.currentTarget;
  clearTimeout(securityHideTimers.get(chip));
  securityHideTimers.set(
    chip,
    setTimeout(() => {
      const popover = chip.querySelector('.security-popover');
      if (popover && !chip.matches(':hover, :focus-within')) {
        hideSecurityPopover(popover);
      }
    }, 150)
  );
}

const lockIcon = html`<svg class="security-lock" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="1.75">
  <rect x="5" y="11" width="14" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
</svg>`;

export function pathSecurityTemplate(pathSecurity, elementId = '') {
  if (!this.resolvedSpec.securitySchemes || !Array.isArray(pathSecurity) || pathSecurity.length === 0) {
    return '';
  }

  const isOptional = pathSecurity.some((p) => !p || Object.keys(p).length === 0);
  const activeSecurity = pathSecurity.filter((p) => p && Object.keys(p).length > 0);

  if (activeSecurity.length === 0) {
    return '';
  }

  const orSecurityKeys = [];
  activeSecurity.forEach((pSecurity) => {
    const andSecurityKeys = [];
    const andKeyTypes = [];
    Object.keys(pSecurity).forEach((pathSecurityKey) => {
      let pathScopes = '';
      const s = this.resolvedSpec.securitySchemes.find((ss) => ss.securitySchemeId === pathSecurityKey);
      if (pSecurity[pathSecurityKey] && Array.isArray(pSecurity[pathSecurityKey])) {
        pathScopes = pSecurity[pathSecurityKey].join(', ');
      }
      if (s) {
        andKeyTypes.push(s.typeDisplay);
        andSecurityKeys.push({ ...s, scopes: pathScopes });
      }
    });

    const displayType = andKeyTypes.length > 1 ? `${andKeyTypes[0]} + ${andKeyTypes.length - 1} more` : andKeyTypes[0];
    orSecurityKeys.push({
      securityTypes: isOptional ? `${displayType} (Optional)` : displayType,
      securityDefs: andSecurityKeys,
    });
  });

  const idPrefix = `${elementId || 'operation'}--security`;
  const anchorPrefix = `--${idPrefix.replace(/[^\w-]/g, '_')}`;
  const isLink = this.updateRoute === 'true' && this.allowAuthentication === 'true';

  return html`
    <div class="operation-security" part="section-operation-security" role="group" aria-labelledby="${idPrefix}-label">
      <span id="${idPrefix}-label" class="security-label visually-hidden" part="label-operation-security">Authorization</span>
      ${
        isLink
          ? html`<a
              class="security-lock-btn"
              part="anchor anchor-operation-security"
              href="#auth"
              title="Go to Authentication"
              aria-label="Authorization: go to Authentication section"
              >${lockIcon}</a
            >`
          : html`<span class="security-lock-btn">${lockIcon}</span>`
      }
      <ul class="value-list-items security-chips" role="list">
        ${orSecurityKeys.map((orItem, i) => {
          if (!orItem.securityTypes) {
            return '';
          }
          const isMultiple = orItem.securityDefs.length > 1;
          const hasDetails = orItem.securityDefs.length > 0;
          const popoverId = `${idPrefix}-${i}`;
          const anchorName = `${anchorPrefix}-${i}`;
          // Chips only open their details popover; the lock before them links to the Authentication section
          const labelHtml = hasDetails
            ? html`<button type="button" class="security-chip-label" aria-describedby="${popoverId}" @click="${showSecurityPopover}">
                ${orItem.securityTypes}
              </button>`
            : html`<span class="security-chip-label">${orItem.securityTypes}</span>`;

          return html`
            <li>
              <span
                class="security-chip ${hasDetails ? 'has-details' : ''}"
                part="operation-security-chip"
                style="anchor-name:${anchorName}"
                @mouseenter="${showSecurityPopover}"
                @mouseleave="${scheduleHideSecurityPopover}"
                @focusin="${showSecurityPopover}"
                @focusout="${scheduleHideSecurityPopover}"
              >
                ${labelHtml}
                ${
                  hasDetails
                    ? html`
                        <div
                          id="${popoverId}"
                          class="security-popover"
                          part="operation-security-details"
                          popover="hint"
                          role="tooltip"
                          style="position-anchor:${anchorName}"
                        >
                          ${isMultiple ? html`<div>Requires <b>all</b> of the following:</div>` : ''}
                          <div style="padding-left:${isMultiple ? '8px' : '0'};">
                            ${orItem.securityDefs.map((secDef, j) => renderSecuritySchemeDetail(secDef, isMultiple, j))}
                          </div>
                        </div>
                      `
                    : ''
                }
              </span>
            </li>
          `;
        })}
      </ul>
    </div>
  `;
}
