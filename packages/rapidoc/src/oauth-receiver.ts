export default class OauthReceiver extends HTMLElement {
  /** Never declared upstream: `postMessage` therefore receives `undefined` as target origin. */
  target?: string;

  connectedCallback() {
    this.receiveAuthParms();
    window.addEventListener('storage', (e) => this.relayAuthParams(e), true);
  }

  /**
   * Read OAuth2 parameters and sends them off
   * to the window opener through `window.postMessage`.
   */
  receiveAuthParms() {
    let authData: Record<string, unknown> = {};
    if (document.location.search) {
      // Applies to authorizationCode flow
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
    } else if (window.location.hash) {
      // Applies to Implicit flow
      const token_type = this.parseQueryString(window.location.hash.substring(1), 'token_type');
      const access_token = this.parseQueryString(window.location.hash.substring(1), 'access_token');
      authData = { token_type, access_token, responseType: 'token' };
    }

    if (window.opener) {
      window.opener.postMessage(authData, this.target as string);
      return;
    }
    sessionStorage.setItem('rapidoc-oauth-data', JSON.stringify(authData)); // Fallback to session storage if window.opener dont exist
  }

  relayAuthParams(e: StorageEvent) {
    if (window.parent) {
      if (e.key === 'rapidoc-oauth-data') {
        const authData = JSON.parse(e.newValue as string);
        window.parent.postMessage(authData, this.target as string);
      }
    }
  }

  parseQueryString(queryString: string, key: string): string | undefined {
    const vars = queryString.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }
  }
}
customElements.define('oauth-receiver', OauthReceiver);
