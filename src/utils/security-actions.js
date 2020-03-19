import parseUrl from 'url-parse';

const scopeSeparator = ' ';

export const buildFormData = (data) => {
  const formArr = [];
  for (const name in data) {
    const val = data[name];
    if (val !== undefined && val !== '') {
      // formArr.push([name, '=', encodeURIComponent(val).replace(/%20/g, '+')].join(''));
      formArr.push([name, '=', encodeURIComponent(val)].join(''));
    }
  }
  return formArr.join('&');
};

const authorizeRequest = (payload) => {
  const {
    url,
    body,
    query = {},
    headers = {},
    additionalQueryStringParams,
  } = payload;

  const parsedUrl = parseUrl(url, true);
  if (typeof additionalQueryStringParams === 'object') {
    parsedUrl.query = { ...parsedUrl.query, ...additionalQueryStringParams, ...query };
  }

  const fetchUrl = parsedUrl.toString();

  const headersExpanded = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest RapiDoc',
    ...headers,
  };

  return fetch(fetchUrl, {
    url: fetchUrl,
    method: 'post',
    headers: headersExpanded,
    body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      console.error(response.statusText);
    })
    .then((json) => json)
    .catch((e) => {
      const err = new Error(e);
      let message = err.message;
      // investigate to check whether there are more details on why the authorization
      // request failed (according to RFC 6479).
      if (e.response && e.response.data) {
        const errData = e.response.data;
        try {
          const jsonResponse = typeof errData === 'string' ? JSON.parse(errData) : errData;
          if (jsonResponse.error) message += `, error: ${jsonResponse.error}`;
          if (jsonResponse.error_description) message += `, description: ${jsonResponse.error_description}`;
        } catch (jsonError) {
          // Ignore
        }
      }
      console.error(message);
    });
};

export const preAuthorizeImplicit = (payload) => {
  // @todo this is not tested, how should this work?
  const {
    token, isValid, flow,
  } = payload;

  // remove oauth2 property from window after redirect from authentication
  delete window.Oauth2UIRedirect;

  if (flow !== 'accessCode' && !isValid) {
    console.error("Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server");
  }

  if (token.error) {
    console.error(JSON.stringify(token));
  }

  // are we done here and return value? token?
  return 'crash';
};

export const authorizePassword = (authConfigs) => {
  // @todo, not tested yet
  const {
    scopesSelected, username, password, passwordType, clientId, clientSecret, tokenUrl,
  } = authConfigs;
  let form = {
    grant_type: 'password',
    scope: scopesSelected.join(scopeSeparator),
    username,
    password,
  };
  const query = {};
  const headers = {};

  switch (passwordType) {
    case 'request-body':
      if (clientId) {
        form = Object.assign(form, { client_id: clientId });
      }
      if (clientSecret) {
        form = Object.assign(form, { client_secret: clientSecret });
      }
      break;

    case 'basic':
      headers.Authorization = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
      break;

    default:
      console.warn(`Warning: invalid passwordType ${passwordType} was passed, not including client id and secret`);
  }

  return authorizeRequest({
    body: buildFormData(form), url: tokenUrl, headers, query, authConfigs,
  });
};


export const authorizeApplication = (auth) => {
  const {
    scopesSelected, clientId, clientSecret, tokenUrl,
  } = auth;
  const headers = {
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  };
  const form = {
    grant_type: 'client_credentials',
    scope: scopesSelected.join(scopeSeparator),
  };

  return authorizeRequest({
    body: buildFormData(form),
    url: tokenUrl,
    auth,
    headers,
  });
};

export const authorizeAccessCodeWithFormParams = (payload) => {
  const { authConfigs, redirectUrl } = payload;
  const {
    code, clientId, clientSecret, codeVerifier, tokenUrl,
  } = authConfigs;

  // remove oauth2 property from window after redirect from authentication
  delete window.Oauth2UIRedirect;

  const form = {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    code_verifier: codeVerifier,
  };

  return authorizeRequest({ body: buildFormData(form), url: tokenUrl, authConfigs });
};

export const authorizeAccessCodeWithBasicAuthentication = (payload) => {
  // @todo this is not tested
  const { authConfigs, redirectUrl } = payload;
  const {
    code, clientId, clientSecret, tokenUrl,
  } = authConfigs;

  // remove oauth2 property from window after redirect from authentication
  delete window.Oauth2UIRedirect;

  const headers = {
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  };
  const form = {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    redirect_uri: redirectUrl,
  };

  return authorizeRequest({
    body: buildFormData(form), url: tokenUrl, authConfigs, headers,
  });
};
