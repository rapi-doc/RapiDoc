export default class OauthReceiver extends HTMLElement {
  constructor() {
    super();

    const oauth2 = window.opener.Oauth2UIRedirect;
    const sentState = oauth2.state;
    let qp;

    if (/code|token|error/.test(window.location.hash)) {
      qp = window.location.hash.substring(1);
    } else {
      qp = window.location.search.substring(1);
    }

    const arr = qp.split('&');
    arr.forEach((v, i, _arr) => { _arr[i] = `"${v.replace('=', '":"')}"`; });
    qp = qp ? JSON.parse(`{${arr.join()}}`,
      (key, value) => (key === '' ? value : decodeURIComponent(value))) : {};

    const isValid = qp.state === sentState;

    if ((
      oauth2.flow === 'accessCode'
      || oauth2.flow === 'authorizationCode'
    ) && !oauth2.authConfigs.code) {
      if (!isValid) {
        oauth2.error("Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server");
      }

      if (qp.code) {
        delete oauth2.state;
        oauth2.authConfigs.code = qp.code;
        oauth2.callback({
          authConfigs: oauth2.authConfigs,
          redirectUrl: oauth2.redirectUrl,
        });
      } else {
        let oauthErrorMsg;
        if (qp.error) {
          oauthErrorMsg = `[${qp.error}]: ${
            qp.error_description ? `${qp.error_description}. ` : 'no accessCode received from the server. '
          }${qp.error_uri ? `More info: ${qp.error_uri}` : ''}`;
        }

        oauth2.error(oauthErrorMsg || '[Authorization failed]: no accessCode received from the server');
      }
    } else {
      oauth2.callback({
        authConfigs: oauth2.authConfigs,
        redirectUrl: oauth2.redirectUrl,
        token: qp,
        isValid,
      });
    }
    window.close();
  }

  parseQueryString(queryString, key) {
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
