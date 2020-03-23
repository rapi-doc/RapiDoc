export const buildFormData = (data) => {
  const params = new URLSearchParams();
  for (const name in data) {
    const value = data[name];
    if (value !== undefined && value !== '') {
      params.set(name, value);
    }
  }
  return params.toString();
};

const authorizeRequest = (payload) => {
  const {
    url,
    body,
    query = {},
    headers = {},
    additionalQueryStringParams,
  } = payload;

  const parsedUrl = new URL(url);
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
      throw Error(response.statusText);
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
      throw Error(message);
    });
};

export const preAuthorizeImplicit = (payload) => {
  // @todo this is not tested, how should this work?
  const {
    token, isValid, flow,
  } = payload;

  if (flow !== 'accessCode' && !isValid) {
    throw Error("Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server");
  }

  if (token.error) {
    throw Error(JSON.stringify(payload));
  }

  // are we done here and return value? token?
  return 'crash';
};

export const authorizePassword = (authConfigs) => {
  // @todo, not tested yet
  const {
    scope,
    username,
    password,
    passwordType,
    clientId,
    clientSecret,
    tokenUrl,
  } = authConfigs;

  let form = {
    grant_type: 'password',
    scope,
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
      throw new Error(`Invalid passwordType ${passwordType} was passed, not including client id and secret`);
  }

  return authorizeRequest({
    body: buildFormData(form),
    url: tokenUrl,
    headers,
    query,
  });
};


export const authorizeApplication = (authConfigs) => {
  const {
    scope,
    clientId,
    clientSecret,
    tokenUrl,
  } = authConfigs;

  const headers = {
    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
  };

  const form = {
    grant_type: 'client_credentials',
    scope,
  };

  return authorizeRequest({
    body: buildFormData(form),
    url: tokenUrl,
    headers,
  });
};


export const authorizeAccessCodeWithFormParams = (payload) => {
  const {
    clientId, clientSecret, redirectUrl, code, tokenUrl,
  } = payload;

  const form = {
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    // code_verifier: codeVerifier, we dont have this until crypto library or other
  };

  return authorizeRequest({
    body: buildFormData(form),
    url: tokenUrl,
  });
};

export const authorizeAccessCodeWithBasicAuthentication = (payload) => {
  // @todo this is not tested
  const {
    clientId, clientSecret, redirectUrl, code, tokenUrl,
  } = payload;

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
    body: buildFormData(form),
    url: tokenUrl,
    headers,
  });
};
