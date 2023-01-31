import { json2xml } from '~/utils/schema-utils';
import HTTPSnippet from 'httpsnippet';

export default function updateCodeExample(tryBtnEl) {
  let fetchUrl;
  let acceptValue = '';
  let contentTypeValue = '';
  const fetchOptions = {
    method: this.method.toUpperCase(),
  };
  const reqHeaders = new Headers();

  const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0];
  const acceptHeader = respEl?.selectedMimeType;
  const requestPanelEl = tryBtnEl.closest('.request-panel');
  const pathParamEls = [
    ...requestPanelEl.querySelectorAll("[data-ptype='path']"),
  ];
  const queryParamEls = [
    ...requestPanelEl.querySelectorAll("[data-ptype='query']"),
  ];
  const queryParamObjTypeEls = [
    ...requestPanelEl.querySelectorAll("[data-ptype='query-object']"),
  ];
  const headerParamEls = [
    ...requestPanelEl.querySelectorAll("[data-ptype='header']"),
  ];
  const requestBodyContainerEl = requestPanelEl.querySelector(
    '.request-body-container',
  );
  fetchUrl = this.path;
  // Generate URL using Path Params
  pathParamEls.map((el) => {
    fetchUrl = fetchUrl.replace(
      `{${el.dataset.pname}}`,
      encodeURIComponent(el.value),
    );
  });

  const headers = [];
  const queryString = [];
  const postData = { mimeType: '' };

  // Query Params
  const queryParamsWithReservedCharsAllowed = [];
  if (queryParamEls.length > 0) {
    queryParamEls.forEach((el) => {
      if (el.dataset.paramAllowReserved === 'true') {
        queryParamsWithReservedCharsAllowed.push(el.dataset.pname);
      }
      if (el.dataset.array === 'false') {
        if (el.value !== '') {
          queryString.push({ name: el.dataset.pname, value: el.value });
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
          } else if (paramSerializeStyle === 'pipeDelimited') {
            queryString.pus({
              name: el.dataset.pname,
              value: vals.join('|').replace(/^\||\|$/g, ''),
            });
          } else if (paramSerializeExplode === 'true') {
            vals.forEach((v) => {
              queryString.push({ name: el.dataset.pname, value: v });
            });
          } else {
            queryString.push({
              name: el.dataset.pname,
              value: vals.join(',').replace(/^,|,$/g, ''),
            });
          }
        }
      }
    });
  }

  // Query Params (Dynamic - create from JSON)
  if (queryParamObjTypeEls.length > 0) {
    queryParamObjTypeEls.map((el) => {
      try {
        let queryParamObj = {};
        const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
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
          } else if (paramSerializeStyle === 'xml') {
            queryString.push({ name: el.dataset.pname, value: json2xml(queryParamObj) });
          }
        } else {
          for (const key in queryParamObj) {
            if (typeof queryParamObj[key] === 'object') {
              if (Array.isArray(queryParamObj[key])) {
                if (paramSerializeStyle === 'spaceDelimited') {
                  queryString.push({ name: key, value: queryParamObj[key].join(' ') });
                } else if (paramSerializeStyle === 'pipeDelimited') {
                  queryString.push({ name: key, value: queryParamObj[key].join('|') });
                } else if (paramSerializeExplode === 'true') {
                  // eslint-disable-line no-lonely-if
                  queryParamObj[key].forEach((v) => {
                    queryString.push({ name: key, value: v });
                  });
                } else {
                  queryString.push({ name: key, value: queryParamObj[key] });
                }
              }
            } else {
              queryString.push({ name: key, value: queryParamObj[key] });
            }
          }
        }
      } catch (err) {
        console.log('RapiDoc: unable to parse %s into object', el.value); // eslint-disable-line no-console
      }
    });
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
  // fetchUrl = `${this.serverUrl.replace(/\/$/, '')}${fetchUrl}`;
  fetchUrl = `${this.selectedServer.computedUrl.replace(/\/$/, '')}${fetchUrl}`;

  // Add Header Params
  const requestBodyType = requestBodyContainerEl
    ? requestBodyContainerEl.dataset.selectedRequestBodyType
    : '';
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
    postData.mimeType = contentTypeValue;
    reqHeaders.append('Content-Type', contentTypeValue);
    headers.push({ name: 'Content-Type', value: contentTypeValue });
  } else if (requestBodyContainerEl) {
    postData.mimeType = requestBodyType;
    reqHeaders.append('Content-Type', requestBodyType);
    headers.push({ name: 'Content-Type', value: requestBodyType });
  }

  // Add Authentication Header if provided
  this.resolvedSpec.securitySchemes.forEach((key) => {
    reqHeaders.append(key.name, key.value);
    headers.push({ name: key.name, value: key.value });
  });

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
        if (postData.text.length === 0) {
          postData.text = (exampleTextAreaEl.value.replace(
            /'/g,
            "'\"'\"'",
          ));
        }
      }
    }
  }

  const snippet = new HTTPSnippet({
    method: this.method,
    url: fetchUrl,
    queryString,
    headers,
    postData,
  });

  const options = { indent: '\t' };
  const output = snippet.convert(this.selectedLanguage, options);

  this.codePreview = output;

  return { fetchUrl, fetchOptions, reqHeaders };
}
