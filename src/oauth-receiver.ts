import { LitElement } from 'lit';

export default class OauthReceiver extends LitElement {
  override connectedCallback() {
    this.receiveAuthParms();
      // TODO: Typescript migration : `this.receiveStorage` does not exists on OauthReceiver
    // window.addEventListener('storage', (e) => this.receiveStorage(e), true);
  }

  /**
   * Read OAuth2 parameters and sends them off
   * to the window opener through `window.postMessage`.
   */
  receiveAuthParms() {
    let authData = {};
    if (document.location.search) { // Applies to authorizationCode flow
      const params = new URLSearchParams(document.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const state = params.get('state');
      authData = {
        code,
        error,
        state,
        responseType: 'code',
      };
    } else if (window.location.hash) { // Applies to Implicit flow
      const token_type = this.parseQueryString(window.location.hash.substring(1), 'token_type'); // eslint-disable-line camelcase
      const access_token = this.parseQueryString(window.location.hash.substring(1), 'access_token'); // eslint-disable-line camelcase
      authData = { token_type, access_token, responseType: 'token' }; // eslint-disable-line camelcase
    }

    if (window.opener) {
      // TODO: Typescript migration : `this.target` does not exists on OauthReceiver
      window.opener.postMessage(authData/* , this.target */);
      return;
    }
    sessionStorage.setItem('rapidoc-oauth-data', JSON.stringify(authData)); // Fallback to session storage if window.opener dont exist
  }

  relayAuthParams(e: any) {
    if (window.parent) {
      if (e.key === 'rapidoc-oauth-data') {
        const authData = JSON.parse(e.newValue);
      // TODO: Typescript migration : `this.target` does not exists on OauthReceiver
        window.parent.postMessage(authData/* , this.target */);
      }
    }
  }

  parseQueryString(queryString: string, key: string) {
    const vars = queryString.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }

    return '';
  }
}
customElements.define('oauth-receiver', OauthReceiver);
