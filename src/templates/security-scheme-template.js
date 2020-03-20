import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import { sanitizeUrl } from '@braintree/sanitize-url';
import crypto from 'crypto';
import {
  authorizePassword, authorizeApplication, preAuthorizeImplicit, authorizeAccessCodeWithBasicAuthentication, authorizeAccessCodeWithFormParams,
} from '../utils/security-actions';

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

function toBase64UrlEncoded(str) {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier() {
  return toBase64UrlEncoded(
    crypto.randomBytes(32)
      .toString('base64'),
  );
}

function createCodeChallenge(codeVerifier) {
  return toBase64UrlEncoded(
    crypto.createHash('sha256')
      .update(codeVerifier, 'ascii')
      .digest('base64'),
  );
}

function onInvokeOAuth(apiKeyId, flow, authConfigs, e) {
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  if (!securityObj) {
    console.error(`Cant find api key ${apiKeyId} in security schemes`);
    return;
  }

  const authFlowDivEl = e.target.closest('.oauth-flow');

  const scopesEl = authFlowDivEl.querySelectorAll('input[type="checkbox"]:checked');
  authConfigs.scopesSelected = [];
  scopesEl.forEach((scopesElement) => authConfigs.scopesSelected.push(scopesElement.value));

  authConfigs.clientId = authFlowDivEl.querySelector('.oauth-client-id').value.trim();
  authConfigs.clientSecret = authFlowDivEl.querySelector('.oauth-client-secret').value.trim();

  const query = [];

  switch (flow) {
    case 'password':
      // @todo, not built
      authorizePassword(authConfigs);
      return;

    case 'application':
      // @todo, not tested
      authorizeApplication(authConfigs).then((token) => {
        if (!token) return;
        securityObj.finalKeyValue = `Bearer ${token.access_token}`;
        this.requestUpdate();
      });
      return;

    case 'accessCode':
      query.push('response_type=code');
      break;

    case 'implicit':
      query.push('response_type=token');
      break;

    case 'clientCredentials':
      authorizeApplication(authConfigs).then((token) => {
        if (!token) return;
        securityObj.finalKeyValue = `Bearer ${token.access_token}`;
        this.requestUpdate();
      });
      return;

    case 'authorizationCode':
      query.push('response_type=code');
      break;

    default:
      console.error(`Warning, can not handle authentication type ${flow}`);
      return;
  }

  if (typeof authConfigs.clientId === 'string') {
    query.push(`client_id=${encodeURIComponent(authConfigs.clientId)}`);
  }

  let redirectUrl = authConfigs.redirectUrl;
  if (!redirectUrl) {
    redirectUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/examples/oauth-receiver.html`;
  }

  query.push(`redirect_uri=${encodeURIComponent(redirectUrl)}`);

  if (authConfigs.scopesSelected.length) {
    query.push(`scope=${encodeURIComponent(authConfigs.scopesSelected.join(' '))}`);
  }

  const state = (`${Math.random().toString(36)}random`).slice(2, 9);
  query.push(`state=${encodeURIComponent(state)}`);

  if (typeof authConfigs.realm !== 'undefined') {
    query.push(`realm=${encodeURIComponent(authConfigs.realm)}`);
  }

  if (flow === 'authorizationCode' && authConfigs.usePkceWithAuthorizationCodeGrant) {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);

    query.push(`code_challenge=${codeChallenge}`);
    query.push('code_challenge_method=S256');

    // storing the Code Verifier so it can be sent to the token endpoint
    // when exchanging the Authorization Code for an Access Token
    authConfigs.codeVerifier = codeVerifier;
  }

  const { additionalQueryStringParams } = authConfigs;
  for (const key in additionalQueryStringParams) {
    if (typeof additionalQueryStringParams[key] !== 'undefined') {
      query.push([key, additionalQueryStringParams[key]].map(encodeURIComponent).join('='));
    }
  }

  const authorizationUrl = authConfigs.authorizationUrl;
  const sanitizedAuthorizationUrl = sanitizeUrl(authorizationUrl);
  const url = [sanitizedAuthorizationUrl, query.join('&')].join(authorizationUrl.indexOf('?') === -1 ? '?' : '&');

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2

  let callback;
  if (flow === 'implicit') {
    callback = (payload) => preAuthorizeImplicit(payload).then((token) => {
      // @todo not built yet
      console.log('Missing functionality to handle token', token);
    });
  } else if (authConfigs.useBasicAuthenticationWithAccessCodeGrant) {
    callback = (payload) => authorizeAccessCodeWithBasicAuthentication(payload).then((token) => {
      // @todo not built yet
      console.log('Missing functionality to handle token', token);
    });
  } else {
    callback = (payload) => authorizeAccessCodeWithFormParams(payload).then((token) => {
      if (!token) return;
      securityObj.finalKeyValue = `Bearer ${token.access_token}`;
      this.requestUpdate();
    });
  }

  window.Oauth2UIRedirect = {
    flow,
    state,
    redirectUrl,
    callback,
    authConfigs,
    error: (err) => console.error(err),
  };

  window.open(url);
}
/* eslint-enable no-console */

/* eslint-disable indent */
export default function securitySchemeTemplate(showAuthenticationInfo) {
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
                ${v.type === 'oauth2'
                  ? html`
                    <div>
                      ${Object.keys(v.flows).map((f) => html`
                        <div class="oauth-flow" style="padding: 10px 0; margin-bottom:10px; border-bottom:1px solid var(--border-color)"> 
                          <b style="width:75px; display: inline-block;">Flow:</b> ${f} <div>
                          ${v.flows[f].authorizationUrl
                            ? html`<div><b style="width:75px; display: inline-block;">Auth URL:</b> <span class="mono-font gray-text"> ${v.flows[f].authorizationUrl} </span></div>`
                            : ''
                          }
                          ${v.flows[f].tokenUrl
                            ? html`<div><b style="width:75px; display: inline-block;">Token URL:</b> <span class="mono-font gray-text">${v.flows[f].tokenUrl}</span></div>`
                            : ''
                          }
                          ${v.flows[f].refreshUrl
                            ? html`<div><b style="width:75px; display: inline-block;">Refresh URL:</b> <span class="mono-font gray-text">${v.flows[f].refreshUrl}</span></div>`
                            : ''
                          }
                          ${v.flows[f].redirectUrl
                            ? html`<div><b style="width:75px; display: inline-block;">Redirect URL:</b> <span class="mono-font gray-text">${v.flows[f].redirectUrl}</span></div>`
                            : ''
                          }
                          ${f === 'authorizationCode' || f === 'clientCredentials'
                            ? html`
                              <div style="display:flex; max-height:28px;">
                                <input type="text" value = "${v.clientId}" placeholder="client-id" spellcheck="false" class="oauth-client-id">
                                <input type="password" value = "${v.clientSecret}" placeholder="client-secret" spellcheck="false" class="oauth-client-secret" style = "margin:0 5px;">
                              </div>
                              <div>
                                ${Object.keys(v.flows[f].scopes).map((s) => {
                                  const itemId = `${f}_${s}`;
                                  const d = v.flows[f].scopes[s];
                                  return html`<input style="margin: 6px" id="${itemId}" type="checkbox" value="${s}" />
                                    <label style="margin-right: 5px" class="mono-font" for="${itemId}">${s}: <span class="gray-text">${d}</span></label>`;
                                })}
                              </div>
                              <div style="margin-top:8px">
                                <button class="m-btn thin-border"
                                  @click="${(e) => { onInvokeOAuth.call(this, v.apiKeyId, f, v.flows[f], e); }}"> 
                                  AUTHORIZE
                                </button>
                              </div>
                              ${v.flows[f].authorizationUrl && showAuthenticationInfo
                                ? html`
                                  <div style="margin-top:8px">
                                    <ul>
                                      <li> Register this client (${window.location.origin}) with ${v.flows[f].authorizationUrl} </li>
                                      <li> During registration, Specify callback/redirect url pointing to <b>${this.oauthReceiver}</b> </li>
                                      <li> Create <b>${this.oauthReceiver}</b> which will receive auth-code from oAuth provider</li>
                                      <li> <b>${this.oauthReceiver}</b> should contain custom-element <span class="mono-font"> &lt;oauth-receiver&gt; </span>, this element receives the auth-code and passes it to this document </li>
                                      <li> After receiving auth-code, it will request access-token at <span class="mono-font"> POST ${v.flows[f].tokenUrl}</span>
                                        <ul>
                                          <li> grant_type = 'authorization_code'</li>
                                          <li> code = {auth-code}</li>
                                          <li> client_id = {client-id}</li>
                                          <li> client_secret = {client-secret}</li>
                                          <li> redirect_uri = {redirect-url}</li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </div>
                                ` : ''
                              }
                            ` : ''
                          }
                        </div>  
                      `)}
                    </div>`
                  : ''
                }
              </td>
            </tr>
          `)}
        </table>`
      : ''}
  </div>
`;
}
/* eslint-enable indent */
