import { json2xml } from '~/utils/schema-utils';

export default function updateCurl(tryBtnEl) {
  let curlUrl;
  let fetchUrl;
  let curl = '';
  let curlHeaders = '';
  let curlData = '';
  let curlForm = '';
  let acceptValue = '';
  let contentTypeValue = '';
  const fetchOptions = {
    method: this.method.toUpperCase(),
  };
  // Generate URL using Path Params
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
          queryParam.append(el.dataset.pname, el.value);
        }
      } else {
        const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
        let vals = el.value && Array.isArray(el.value) ? el.value : [];
        vals = Array.isArray(vals) ? vals.filter((v) => v !== '') : [];
        if (vals.length > 0) {
          if (paramSerializeStyle === 'spaceDelimited') {
            queryParam.append(
              el.dataset.pname,
              vals.join(' ').replace(/^\s|\s$/g, ''),
            );
          } else if (paramSerializeStyle === 'pipeDelimited') {
            queryParam.append(
              el.dataset.pname,
              vals.join('|').replace(/^\||\|$/g, ''),
            );
          } else if (paramSerializeExplode === 'true') {
            vals.forEach((v) => {
              queryParam.append(el.dataset.pname, v);
            });
          } else {
            queryParam.append(
              el.dataset.pname,
              vals.join(',').replace(/^,|,$/g, ''),
            );
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
            queryParam.append(el.dataset.pname, JSON.stringify(queryParamObj));
          } else if (paramSerializeStyle === 'xml') {
            queryParam.append(el.dataset.pname, json2xml(queryParamObj));
          }
        } else {
          for (const key in queryParamObj) {
            if (typeof queryParamObj[key] === 'object') {
              if (Array.isArray(queryParamObj[key])) {
                if (paramSerializeStyle === 'spaceDelimited') {
                  queryParam.append(key, queryParamObj[key].join(' '));
                } else if (paramSerializeStyle === 'pipeDelimited') {
                  queryParam.append(key, queryParamObj[key].join('|'));
                } else if (paramSerializeExplode === 'true') {
                  // eslint-disable-line no-lonely-if
                  queryParamObj[key].forEach((v) => {
                    queryParam.append(key, v);
                  });
                } else {
                  queryParam.append(key, queryParamObj[key]);
                }
              }
            } else {
              queryParam.append(key, queryParamObj[key]);
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
    urlQueryParamString = '?';
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
  fetchUrl = `${fetchUrl}${urlQueryParamString}`;

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
  if (fetchUrl.startsWith('http') === false) {
    const url = new URL(fetchUrl, window.location.href);
    curlUrl = url.href;
  } else {
    curlUrl = fetchUrl;
  }
  curl = `curl --request ${this.method.toUpperCase()} \\\n --url '${curlUrl}' \\\n`;

  // Add Header Params
  let headerParams = '';
  const requestBodyType = requestBodyContainerEl
    ? requestBodyContainerEl.dataset.selectedRequestBodyType
    : '';
  headerParamEls.map((el) => {
    if (el.value) {
      if (el.dataset.pname === 'Accept') acceptValue = el.value;
      else if (el.dataset.pname === 'Content-Type') contentTypeValue = el.value;
      else {
        reqHeaders.append(el.dataset.pname, el.value);
        headerParams += ` --header '${el.dataset.pname}: ${el.value}' \\\n`;
      }
    }
  });

  if (acceptValue) {
    reqHeaders.append('Accept', acceptValue);
    curlHeaders += ` --header "Accept: ${acceptValue}" \\\n`;
  } else if (acceptHeader) {
    // Uses the acceptHeader from Response panel
    reqHeaders.append('Accept', acceptHeader);
    curlHeaders += ` --header "Accept: ${acceptHeader}" \\\n`;
  } else if (this.accept) {
    reqHeaders.append('Accept', this.accept);
    curlHeaders += ` --header "Accept: ${this.accept}" \\\n`;
  }

  if (contentTypeValue) {
    reqHeaders.append('Content-Type', contentTypeValue);
    curlHeaders += ` --header 'Content-Type: ${contentTypeValue}' \\\n`;
  } else if (requestBodyContainerEl) {
    curlHeaders += ` --header "Content-Type: ${requestBodyType}" \\\n`;
  }

  // Add Authentication Header if provided
  this.resolvedSpec.securitySchemes.forEach((key) => {
    headerParams += ` --header '${key.name}: ${key.value}' \\\n`;
  });

  curlHeaders += headerParams;

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
          curlData = ` --data ${formUrlDynParams.toString()} \\\n`;
        }
      } else {
        // url-encoded Form Params (regular)
        const formUrlEls = [
          ...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']"),
        ];
        const formUrlParams = new URLSearchParams();
        formUrlEls
          .filter((v) => v.type !== 'file')
          .forEach((el) => {
            if (el.dataset.array === 'false') {
              if (el.value) {
                formUrlParams.append(el.dataset.pname, el.value);
              }
            } else {
              const vals = el.value && Array.isArray(el.value) ? el.value.join(',') : '';
              formUrlParams.append(el.dataset.pname, vals);
            }
          });
        fetchOptions.body = formUrlParams;
        curlData = ` -d ${formUrlParams.toString()} \\\n`;
      }
    } else if (requestBodyType.includes('form-data')) {
      const formDataParams = new FormData();
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
            curlForm += ` -F "${el.dataset.pname}=@${el.files[0].name}" \\\n`;
          } else if (el.value) {
            formDataParams.append(el.dataset.pname, el.value);
            curlForm += ` -F "${el.dataset.pname}=${el.value}" \\\n`;
          }
        } else if (el.value && Array.isArray(el.value)) {
          el.value.forEach((v) => {
            curlForm = `${curlForm} -F "${el.dataset.pname}[]=${v}" \\\n`;
          });
          formDataParams.append(el.dataset.pname, el.value.join(','));
        }
      });
      fetchOptions.body = formDataParams;
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
        curlData = ` --data-binary @${bodyParamFileEl.files[0].name} \\\n`;
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
            curlData = ` --data '${JSON.stringify(
              JSON.parse(exampleTextAreaEl.value),
            )}' \\\n`;
          } catch (err) {
            // Ignore.
          }
        }
        if (!curlData) {
          curlData = ` --data '${exampleTextAreaEl.value.replace(
            /'/g,
            "'\"'\"'",
          )}' \\\n`;
        }
      }
    }
    // Common for all request-body
    if (!requestBodyType.includes('form-data')) {
      // For multipart/form-data dont set the content-type to allow creation of browser generated part boundaries
      reqHeaders.append('Content-Type', requestBodyType);
    }
  }

  this.curlSyntax = `${curl}${curlHeaders}${curlData}${curlForm}`;

  return { fetchUrl, fetchOptions, reqHeaders };
}
