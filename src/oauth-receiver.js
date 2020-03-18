export default class OauthReceiver extends HTMLElement {
  connectedCallback() {
    this.receiveAuthParms();
    window.addEventListener('storage', (e) => this.receiveStorage(e), true);
  }

  /**
   * Read OAuth2 parameters and sends them off
   * to the window opener through `window.postMessage`.
   */
  receiveAuthParms() {
    const params = new URLSearchParams(document.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');
    if (!code) {
      return;
    }

    const authData = { code, error, state };
    if (window.opener) {
      window.opener.postMessage(authData, this.target);
      return;
    }
    // Fallback to session storage if window.opener dont exist
    sessionStorage.setItem('rapidoc-oauth-data', JSON.stringify(authData));
  }

  relayAuthParams(e) {
    if (window.parent) {
      if (e.key === 'rapidoc-oauth-data') {
        const authData = JSON.parse(e.newValue);
        window.parent.postMessage(authData, this.target);
      }
    }
  }
}
customElements.define('oauth-receiver', OauthReceiver);
