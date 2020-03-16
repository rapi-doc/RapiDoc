import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
import OAuth2 from 'client-oauth2';

function onApiKeyChange(apiKeyId, e) {
  let apiKeyValue = '';
  const securityObj = this.resolvedSpec.securitySchemes.find((v) => (v.apiKeyId === apiKeyId));
  if (securityObj) {
    const trEl = e.target.closest('tr');
    if (securityObj.type === 'oauth2') {
      const userVal = trEl.querySelector('.api-key-user').value.trim();
      const passwordVal = trEl.querySelector('.api-key-password').value.trim();
      const state = btoa(new Date());
      const authClient = new OAuth2({
        clientId: userVal,
        clientSecret: passwordVal,
        accessTokenUri: securityObj.oauth.tokenUrl,
        authorizationUri: securityObj.oauth.authorizationUrl,
        redirectUri: securityObj.oauth.redirectUrl,
        scopes: securityObj.oauth.scopesParsed,
        state,
      });
      if (securityObj.oauthType === 'clientCredentials') {
        authClient.credentials.getToken()
          .then((token) => {
            securityObj.finalKeyValue = `bearer ${token.accessToken}`;
            this.requestUpdate();
          }).catch((eToken) => {
            alert(eToken.message);
          });
      } else if (securityObj.oauthType === 'authorizationCode') {
        window.OAuthLoginRedirect = {
          ...securityObj,
          state,
          callback: (callbackItem) => {
            const { isValid, redirectUrl } = callbackItem;
            if (!isValid) {
              alert('State not matching sent value');
            } else {
              authClient.code.getToken(redirectUrl).then((user) => {
                securityObj.finalKeyValue = `bearer ${user.data.access_token}`;
                this.requestUpdate();
              }).catch((eUser) => { alert(`error orrcured${eUser}`); });
            }
          },
          error: (eToken) => {
            alert(`error orrcured ${eToken}`);
          },
        };

        window.open(authClient.code.getUri(), 'OAuth 2 Login', 'toolbar=0,menubar=0,location=0');
      }
    } else if (securityObj.type && securityObj.scheme && securityObj.type === 'http' && securityObj.scheme.toLowerCase() === 'basic') {
      const userVal = trEl.querySelector('.api-key-user').value.trim();
      const passwordVal = trEl.querySelector('.api-key-password').value.trim();
      if (userVal && passwordVal) apiKeyValue = `Basic ${btoa(`${userVal}:${passwordVal}`)}`;
      securityObj.finalKeyValue = apiKeyValue;
      this.requestUpdate();
    } else {
      apiKeyValue = trEl.querySelector('.api-key-input').value.trim();
      if (apiKeyValue) {
        if (securityObj.scheme && securityObj.scheme.toLowerCase() === 'bearer') {
          apiKeyValue = `Bearer ${apiKeyValue}`;
        }
      }
      securityObj.finalKeyValue = apiKeyValue;
      this.requestUpdate();
    }
  }
}

function onClearAllApiKeys() {
  this.resolvedSpec.securitySchemes.forEach((v) => {
    v.user = '';
    v.password = '';
    v.value = '';
    v.finalKeyValue = '';
    v.oauth = null;
    v.typeOfAuthentication = '';
  });
  this.requestUpdate();
}

/* eslint-disable indent */
export default function securitySchemeTemplate() {
  const providedApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue));
  const renderAuthDescription = (list) => html`<div style="font-weight:bold;color:var(--blue); overflow:hidden;"> 
    ${list.length === 1
      ? `${list[0].apiKeyId} '${list[0].typeOfAuthentication}' in ${list[0].in}`
      : `${list.length} API keys applied`
    } 
  </div>
  <div style="flex:1"></div>
  <button class="m-btn thin-border" @click=${() => { onClearAllApiKeys.call(this); }}>CLEAR ALL API KEYS</button>`;

  return html`
  <div id='authentication' class = 'observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap '}'>
    <div class='sub-title regular-font'> AUTHENTICATION </div>
    <div class="regular-font-size" style="display:flex;margin: 16px 0 4px 0; align-items: center;">
      ${providedApiKeys.length > 0
        ? renderAuthDescription(providedApiKeys)
        : html`<div style="font-weight:bold; color:var(--red)">No API key applied</div>`
      }
    </div>
    ${this.resolvedSpec.securitySchemes && this.resolvedSpec.securitySchemes.length > 0
      ? html`  
        <table class='m-table' style="width:100%">
        <tr><th>Id and Type </th><th>Authentication Procedure</th></tr>
          ${this.resolvedSpec.securitySchemes.map((v) => html`
            <tr>  
              <td>
                <div><span style="font-weight:bold">${v.apiKeyId}</span> (${v.typeOfAuthentication})</div>
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
                      <input type="text" value = "${v.password}" placeholder="password" spellcheck="false" class="api-key-password">
                      <button class="m-btn thin-border" style = "margin-left:5px;"
                        @click="${(e) => { onApiKeyChange.call(this, v.apiKeyId, e); }}"> 
                        ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                      </button>
                    </div>`
                  : ''
                }
                ${v.type === 'oauth2'
                  ? html`
                    <div>
                      <div>Get <code>'${v.oauthType}'</code> bearer token with scopes <code>'${v.oauth.scopesParsed.join(', ')}'</code>.</div>
                      ${v.oauth.tokenUrl
                        ? html`<div><b>Token URL:</b> <code class="url"> ${v.oauth.tokenUrl}</code></div>`
                        : ''
                      }
                      ${v.oauth.authorizationUrl
                        ? html`<div><b>Auth URL:</b> <code class="url"> ${v.oauth.authorizationUrl}</code></div>`
                        : ''
                      }
                      ${v.oauth.refreshUrl
                        ? html`<div><b>Refresh URL:</b> <code class="url"> ${v.oauth.refreshUrl}</code></div>`
                        : ''
                      }
                      ${v.oauth.redirectUrl
                        ? html`<div><b>Redirect URL:</b> <code class="url"> ${v.oauth.redirectUrl}</code></div>`
                        : ''
                      }
                      <div style="display:flex; max-height:28px;">
                        <input type="text" value = "${v.user}" placeholder="client_id" spellcheck="false" class="api-key-user">
                        <input type="text" value = "${v.password}" placeholder="client_secret" spellcheck="false" class="api-key-password">
                        <button class="m-btn thin-border"
                          @click="${(e) => {
                            onApiKeyChange.call(this, v.apiKeyId, e);
                          }}"> 
                          ${v.finalKeyValue ? 'UPDATE' : 'SET'}
                        </button>
                      </div>
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
