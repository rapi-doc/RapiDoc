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

function onInvokeOAuth(authUrl, scopes, e) {
  const authFlowDivEl = e.target.closest('.oauth-flow');
  const clientId = authFlowDivEl.querySelector('.oauth-client-id').value.trim();
  // const clientSecret = authFlowDivEl.querySelector('.oauth-client-secret').value.trim();

  const state = (`${Math.random().toString(36)}random`).slice(2, 9);
  const authUrlObj = new URL(authUrl);
  const receiveUrlObj = new URL(`${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))}/${this.oauthReceiver}}`);
  const params = new URLSearchParams(authUrl.search);
  params.set('client_id', clientId);
  params.set('redirect_uri', receiveUrlObj.toString());
  params.set('response_type', 'code'); // can be token (for implicit grant)
  params.set('scope', Object.keys(scopes).join(' '));
  params.set('state', state);
  params.set('show_dialog', true);
  authUrlObj.search = params.toString();
  const w = window.open(authUrlObj.toString());
  if (!w) {
    // eslint-disable-next-line no-console
    console.error(`RapiDoc: Unable to open ${authUrlObj.toString()} in a new window`);
  }

  const removeMessageEventListenerFn = () => {
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('message', handleMessageEventFn);
  };

  const handleMessageEventFn = (ev) => {
    /*
    if (ev.origin !== receiveUrlObj.origin) {
      console.warn(`Received message from invalid domain ${ev.origin}.`);
      return;
    }
    */
    removeMessageEventListenerFn();
    w.close();
    if (!ev.data) {
      // eslint-disable-next-line no-console
      console.warn('RapiDoc: Received no data with authorization message');
    }
    if (ev.data.state !== state) {
      // eslint-disable-next-line no-console
      console.warn('RapiDoc: State value did not match.');
    }
    if (ev.data.error) {
      // eslint-disable-next-line no-console
      console.warn('RapiDoc: Error while receving data');
    }

    // eslint-disable-next-line no-console
    console.log(`RapiDoc: AUTH CODE RECEIVED - ${ev.data.code}`);
    // return res(ev.data.code);
  };

  window.addEventListener('message', handleMessageEventFn);
}

/* eslint-disable indent */
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
                          ${f.toLowerCase() === 'authorizationcode'
                            ? html`
                              <div style="display:flex; max-height:28px;">
                                <input type="text" value = "${v.clientId}" placeholder="client-id" spellcheck="false" class="oauth-client-id">
                                <input type="password" value = "${v.clientSecret}" placeholder="client-secret" spellcheck="false" class="oauth-client-secret" style = "margin:0 5px;">
                                <button class="m-btn thin-border"
                                  @click="${(e) => { onInvokeOAuth.call(this, v.flows[f].authorizationUrl, v.flows[f].scopes, e); }}"> 
                                  AUTHORIZE
                                </button>
                              </div>
                              <div style="margin-top:8px">
                                <ul>
                                  ${v.flows[f].authorizationUrl
                                    ? html`
                                      <li> Register this client (${window.location.origin}) with ${v.flows[f].authorizationUrl} </li>
                                      <li> During registration, Specify callback/redirect url pointing to <b>${this.oauthReceiver}</b> </li>
                                      <li> Create <b>${this.oauthReceiver}</b> which will receive auth-code from oAuth provider</li>
                                      <li> <b>${this.oauthReceiver}</b> should contain custom-element <span class="mono-font"> &lt;oauth-receiver&gt; </span>, this element receives the auth-code and passes it to this document </li>
                                      <li> After receiving auth-code, it will request for an access-token using 
                                        <span class="mono-font"> POST ${v.flows[f].authorizationUrl}</span> and providing 
                                        <span class="mono-font"> grant_type='authorization_code', code={auth-code}, client_id={client-id}, client_secret={client-secret} and redirect_uri={redirect-url} <span>
                                      </li>
                                    `
                                    : ''
                                  }
                                </ul>
                              </div>`
                            : ''
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
