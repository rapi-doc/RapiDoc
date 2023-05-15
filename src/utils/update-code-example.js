import HTTPSnippet from 'httpsnippet';
import { json2xml } from './schema-utils';

function buildFetchURL(requestPanelEl) {
  let fetchUrl = this.path;
  const queryString = [];

  const pathParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='path']")];
  const queryParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='query']")];
  const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll("[data-ptype='query-object']")];

  // Generate URL using Path Params
  pathParamEls.map((el) => {
    fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, encodeURIComponent(el.value));
  });

  // Query Params
  const urlQueryParamsMap = new Map();
  const queryParamsWithReservedCharsAllowed = [];
  if (queryParamEls.length > 0) {
    queryParamEls.forEach((el) => {
      const queryParam = new URLSearchParams();
      if (el.dataset.paramAllowReserved === 'true') {
        queryParamsWithReservedCharsAllowed.push(el.dataset.pname);
      }
      if (el.dataset.array === 'false') {
        if (el.value !== '') {
          queryString.push({ name: el.dataset.pname, value: el.value });
          queryParam.append(el.dataset.pname, el.value);
        }
      } else {
        const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
        let vals = el.value && Array.isArray(el.value) ? el.value : [];
        vals = Array.isArray(vals) ? vals.filter((v) => v !== '') : [];
        if (vals.length > 0) {
          if (paramSerializeStyle === 'spaceDelimited') {
            queryString.push({
              name: el.dataset.pname,
              value: vals.join(' ').replace(/^\s|\s$/g, ''),
            });
            queryParam.append(el.dataset.pname, vals.join(' ').replace(/^\s|\s$/g, ''));
          } else if (paramSerializeStyle === 'pipeDelimited') {
            queryString.push({
              name: el.dataset.pname,
              value: vals.join('|').replace(/^\||\|$/g, ''),
            });
            queryParam.append(el.dataset.pname, vals.join('|').replace(/^\||\|$/g, ''));
          } else if (paramSerializeExplode === 'true') {
            vals.forEach((v) => {
              queryString.push({ name: el.dataset.pname, value: v });
              queryParam.append(el.dataset.pname, v);
            });
          } else {
            queryString.push({
              name: el.dataset.pname,
              value: vals.join(',').replace(/^,|,$/g, ''),
            });
            queryParam.append(el.dataset.pname, vals.join(',').replace(/^,|,$/g, ''));
          }
        }
      }
      if (queryParam.toString()) {
        urlQueryParamsMap.set(el.dataset.pname, queryParam);
      }
    });
  }

  // Query Params (Dynamic - create from JSON)
  if (queryParamObjTypeEls.length > 0) {
    queryParamObjTypeEls.map((el) => {
      const queryParam = new URLSearchParams();
      try {
        let queryParamObj = {};
        const { paramSerializeStyle, paramSerializeExplode, pname } = el.dataset;
        queryParamObj = Object.assign(
          queryParamObj,
          JSON.parse(el.value.replace(/\s+/g, ' ')),
        );
        if (el.dataset.paramAllowReserved === 'true') {
          queryParamsWithReservedCharsAllowed.push(el.dataset.pname);
        }
        if ('json xml'.includes(paramSerializeStyle)) {
          if (paramSerializeStyle === 'json') {
            queryString.push({ name: el.dataset.pname, value: JSON.stringify(queryParamObj) });
            queryParam.append(el.dataset.pname, JSON.stringify(queryParamObj));
          } else if (paramSerializeStyle === 'xml') {
            queryString.push({ name: el.dataset.pname, value: json2xml(queryParamObj) });
            queryParam.append(el.dataset.pname, json2xml(queryParamObj));
          }
        } else {
          for (const key in queryParamObj) {
            const pKey = `${pname}[${key}]`;
            if (typeof queryParamObj[key] === 'object') {
              if (Array.isArray(queryParamObj[key])) {
                if (paramSerializeStyle === 'spaceDelimited') {
                  queryString.push({ name: pKey, value: queryParamObj[key].join(' ') });
                  queryParam.append(pKey, queryParamObj[key].join(' '));
                } else if (paramSerializeStyle === 'pipeDelimited') {
                  queryString.push({ name: pKey, value: queryParamObj[key].join('|') });
                  queryParam.append(pKey, queryParamObj[key].join('|'));
                } else if (paramSerializeExplode === 'true') {
                  queryParamObj[key].forEach((v) => {
                    queryString.push({ name: pKey, value: v });
                    queryParam.append(pKey, v);
                  });
                } else {
                  queryString.push({ name: pKey, value: queryParamObj[key] });
                  queryParam.append(pKey, queryParamObj[key]);
                }
              }
            } else {
              queryString.push({ name: pKey, value: queryParamObj[key] });
              queryParam.append(pKey, queryParamObj[key]);
            }
          }
        }
      } catch (err) {
        console.log('RapiDoc: unable to parse %s into object', el.value); // eslint-disable-line no-console
      }
      if (queryParam.toString()) {
        urlQueryParamsMap.set(el.dataset.pname, queryParam);
      }
    });
  }

  let urlQueryParamString = '';
  if (urlQueryParamsMap.size) {
    urlQueryParamsMap.forEach((val, pname) => {
      if (queryParamsWithReservedCharsAllowed.includes(pname)) {
        urlQueryParamString += `${pname}=`;
        urlQueryParamString += val.getAll(pname).join(`&${pname}=`);
        urlQueryParamString += '&';
      } else {
        urlQueryParamString += `${val.toString()}&`;
      }
    });
    urlQueryParamString = urlQueryParamString.slice(0, -1);
  }
  if (urlQueryParamString.length !== 0) {
    fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${urlQueryParamString}`;
  }

  // Add authentication Query-Param if provided
  this.api_keys
    .filter((v) => v.in === 'query')
    .forEach((v) => {
      fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${
        v.name
      }=${encodeURIComponent(v.finalKeyValue)}`;
    });

  // Final URL for API call
  fetchUrl = `${this.selectedServer.computedUrl.replace(/\/$/, '')}${fetchUrl}`;

  return { fetchUrl, queryString };
}

function buildFetchOptions(requestPanelEl) {
  const fetchOptions = { method: this.method.toUpperCase() };
  const postData = { mimeType: '' };

  const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
  const requestBodyType = requestBodyContainerEl
    ? requestBodyContainerEl.dataset.selectedRequestBodyType
    : '';

  // Request Body Params
  if (requestBodyContainerEl) {
    if (requestBodyType.includes('form-urlencoded')) {
      // url-encoded Form Params (dynamic) - Parse JSON and generate Params
      const formUrlDynamicTextAreaEl = requestPanelEl.querySelector(
        "[data-ptype='dynamic-form']",
      );
      if (formUrlDynamicTextAreaEl) {
        const val = formUrlDynamicTextAreaEl.value;
        const formUrlDynParams = new URLSearchParams();
        let proceed = true;
        let tmpObj;
        if (val) {
          try {
            tmpObj = JSON.parse(val);
          } catch (err) {
            proceed = false;
            console.warn('RapiDoc: Invalid JSON provided', err); // eslint-disable-line no-console
          }
        } else {
          proceed = false;
        }
        if (proceed) {
          for (const prop in tmpObj) {
            formUrlDynParams.append(prop, JSON.stringify(tmpObj[prop]));
          }
          fetchOptions.body = formUrlDynParams;
          postData.params = formUrlDynParams;
        }
      } else {
        // url-encoded Form Params (regular)
        const formUrlEls = [
          ...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']"),
        ];
        const formUrlParams = new URLSearchParams();
        const params = [];
        formUrlEls
          .filter((v) => v.type !== 'file')
          .forEach((el) => {
            if (el.dataset.array === 'false') {
              if (el.value) {
                formUrlParams.append(el.dataset.pname, el.value);
                params.push({ name: el.dataset.pname, value: el.value });
              }
            } else {
              const vals = el.value && Array.isArray(el.value) ? el.value.join(',') : '';
              formUrlParams.append(el.dataset.pname, vals);
              params.push({ name: el.dataset.pname, value: vals });
            }
          });
        fetchOptions.body = formUrlParams;
        postData.params = params;
      }
    } else if (requestBodyType.includes('form-data')) {
      const formDataParams = new FormData();
      const params = [];
      const formDataEls = [
        ...requestPanelEl.querySelectorAll("[data-ptype='form-data']"),
      ];
      formDataEls.forEach((el) => {
        if (el.dataset.array === 'false') {
          if (el.type === 'file' && el.files[0]) {
            formDataParams.append(
              el.dataset.pname,
              el.files[0],
              el.files[0].name,
            );
            params.push({ name: el.dataset.pname, value: el.files[0], fileName: el.files[0].name });
          } else if (el.value) {
            formDataParams.append(el.dataset.pname, el.value);
            params.push({ name: el.dataset.pname, value: el.value });
          }
        } else if (el.value && Array.isArray(el.value)) {
          formDataParams.append(el.dataset.pname, el.value.join(','));
          params.push({ name: el.dataset.pname, value: el.value.join(',') });
        }
      });
      fetchOptions.body = formDataParams;
      postData.params = params;
    } else if (
      /^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(
        requestBodyType,
      )
    ) {
      const bodyParamFileEl = requestPanelEl.querySelector(
        '.request-body-param-file',
      );
      if (bodyParamFileEl?.files[0]) {
        fetchOptions.body = bodyParamFileEl.files[0]; // eslint-disable-line prefer-destructuring
        // postData.text.push(bodyParamFileEl.files[0].name);
      }
    } else if (
      requestBodyType.includes('json')
      || requestBodyType.includes('xml')
      || requestBodyType.includes('text')
    ) {
      const exampleTextAreaEl = requestPanelEl.querySelector(
        '.request-body-param-user-input',
      );
      if (exampleTextAreaEl?.value) {
        fetchOptions.body = exampleTextAreaEl.value;
        if (requestBodyType.includes('json')) {
          try {
            postData.text = JSON.stringify(JSON.parse(exampleTextAreaEl.value));
          } catch (err) {
            // Ignore.
          }
        }
        if (postData.text && postData.text.length === 0) {
          postData.text = (exampleTextAreaEl.value.replace(
            /'/g,
            "'\"'\"'",
          ));
        }
      }
    }
  }

  if (requestBodyContainerEl) {
    postData.mimeType = requestBodyType;
  }

  return { fetchOptions, postData };
}

function buildFetchHeaders(requestPanelEl) {
  let acceptValue = '';
  let contentTypeValue = '';

  const reqHeaders = new Headers();
  const headers = [];

  const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
  const headerParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='header']")];
  const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0];
  const acceptHeader = respEl?.selectedMimeType;

  // Add Header Params
  headerParamEls.map((el) => {
    if (el.value) {
      if (el.dataset.pname === 'Accept') acceptValue = el.value;
      else if (el.dataset.pname === 'Content-Type') contentTypeValue = el.value;
      else {
        reqHeaders.append(el.dataset.pname, el.value);
        headers.push({ name: el.dataset.pname, value: el.value });
      }
    }
  });

  if (acceptValue) {
    reqHeaders.append('Accept', acceptValue);
    headers.push({ name: 'Accept', value: acceptValue });
  } else if (acceptHeader) {
    // Uses the acceptHeader from Response panel
    reqHeaders.append('Accept', acceptHeader);
    headers.push({ name: 'Accept', value: acceptHeader });
  } else if (this.accept) {
    reqHeaders.append('Accept', this.accept);
    headers.push({ name: 'Accept', value: this.accept });
  }

  if (contentTypeValue) {
    reqHeaders.append('Content-Type', contentTypeValue);
    headers.push({ name: 'Content-Type', value: contentTypeValue });
  } else if (requestBodyContainerEl) {
    reqHeaders.append('Content-Type', requestBodyContainerEl.dataset.selectedRequestBodyType);
    headers.push({ name: 'Content-Type', value: requestBodyContainerEl.dataset.selectedRequestBodyType });
  }

  // Add Authentication Header if provided
  this.resolvedSpec.securitySchemes.forEach((key) => {
    reqHeaders.append(key.name, key.value);
    headers.push({ name: key.name, value: key.value });
  });

  return { reqHeaders, headers };
}

function decodeCurlyBrackets(url) {
  url = url.replace(/\/?%7B/gm, '{').replace(/\/?%7D/gm, '}');
  return url;
}

export default function updateCodeExample(tryBtnEl) {
  const requestPanelEl = tryBtnEl.closest('.request-panel');

  const { fetchUrl, queryString } = buildFetchURL.call(this, requestPanelEl);
  const { fetchOptions, postData } = buildFetchOptions.call(this, requestPanelEl);
  const { reqHeaders, headers } = buildFetchHeaders.call(this, requestPanelEl);

  const snippet = new HTTPSnippet({
    method: this.method,
    url: fetchUrl,
    queryString,
    headers,
    postData,
  });

  snippet.requests[0].url = decodeCurlyBrackets(snippet.requests[0].url);
  snippet.requests[0].fullUrl = decodeCurlyBrackets(snippet.requests[0].fullUrl);

  const options = { indent: '\t' };
  const output = snippet.convert(this.selectedLanguage, options);

  this.codeExample = output;

  return { fetchUrl, fetchOptions, reqHeaders };
}
