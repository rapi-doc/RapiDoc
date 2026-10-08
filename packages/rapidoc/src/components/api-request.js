import { LitElement, html, css } from 'lit';
import { guard } from 'lit/directives/guard.js';
import { scheduleHighlight } from '~/utils/highlighter';
import TableStyles from '~/styles/table-styles';
import FlexStyles from '~/styles/flex-styles';
import InputStyles from '~/styles/input-styles';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import TabStyles from '~/styles/tab-styles';
import MicrolighterStyles from '~/styles/microlighter-styles';
import CustomStyles from '~/styles/custom-styles';
import { json2xml } from '~/utils/schema-utils';
import { processFetchResponse } from '../utils/response-utils.js';
import { inputParametersTemplate } from '~/templates/request-params-template';
import requestBodyTemplate from '~/templates/request-body-template';
import apiCallTemplate from '~/templates/api-response-template';

export default class ApiRequest extends LitElement {
  constructor() {
    super();
    this.responseMessage = '';
    this.responseStatus = 'success';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseUrl = '';
    this.curlSyntax = '';
    this.responseIsBlob = false;
    this.responseBlobType = '';
    this.responseBlobUrl = '';
    this.respContentDisposition = '';
    this.activeResponseTab = 'response'; // allowed values: response, headers, curl
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.activeParameterSchemaTabs = {};
    this.fileInputKeys = {};
    this.loading = false;
  }

  static get properties() {
    return {
      config: { type: Object },
      serverUrl: { type: String, attribute: 'server-url' },
      servers: { type: Array },
      method: { type: String },
      path: { type: String },
      security: { type: Array },
      parameters: { type: Array },
      request_body: { type: Object },
      api_keys: { type: Array },
      parser: { type: Object },
      accept: { type: String },
      callback: { type: String },
      webhook: { type: String },
      fillRequestFieldsWithExample: { type: String, attribute: 'fill-request-fields-with-example' },
      allowTry: { type: String, attribute: 'allow-try' },
      showCurlBeforeTry: { type: String, attribute: 'show-curl-before-try' },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      activeSchemaTab: { type: String, attribute: 'active-schema-tab' },
      activeParameterSchemaTabs: {
        type: Object,
        converter: {
          fromAttribute: (attr) => JSON.parse(attr),
          toAttribute: (prop) => JSON.stringify(prop),
        },
        attribute: 'active-parameter-schema-tabs',
      },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      fetchCredentials: { type: String, attribute: 'fetch-credentials' },

      // Internal reactive state
      responseMessage: { state: true },
      responseText: { state: true },
      responseHeaders: { state: true },
      responseStatus: { state: true },
      responseUrl: { state: true },
      curlSyntax: { state: true },
      responseIsBlob: { state: true },
      responseBlobType: { state: true },
      responseBlobUrl: { state: true },
      respContentDisposition: { state: true },
      activeResponseTab: { state: true },
      selectedRequestBodyType: { state: true },
      selectedRequestBodyExample: { state: true },
      fileInputKeys: { state: true },
      loading: { state: true },
    };
  }

  static get styles() {
    return [
      TableStyles,
      InputStyles,
      FontStyles,
      FlexStyles,
      BorderStyles,
      TabStyles,
      MicrolighterStyles,
      css`
        *,
        *:before,
        *:after {
          box-sizing: border-box;
        }
        :where(button, input[type='checkbox'], [tabindex='0']):focus-visible {
          box-shadow: var(--focus-shadow);
        }
        :where(input[type='text'], input[type='password'], select, textarea):focus-visible {
          border-color: var(--primary);
        }
        tag-input:focus-within {
          outline: 1px solid;
        }
        .param-name,
        .param-type {
          margin: 1px 0;
          text-align: right;
          line-height: var(--font-size-small);
        }
        .param-name {
          color: var(--foreground);
          font-family: var(--font-mono);
        }
        .param-name.deprecated {
          color: var(--red);
        }
        .param-type {
          color: var(--muted-foreground);
          font-family: var(--font-regular);
        }
        .param-constraint {
          min-width: 100px;
        }
        .param-constraint:empty {
          display: none;
        }
        .top-gap {
          margin-top: 24px;
        }

        .textarea {
          min-height: 220px;
          padding: 5px;
          resize: vertical;
          direction: ltr;
        }
        .example:first-child {
          margin-top: -9px;
        }

        .response-message {
          font-weight: bold;
          text-overflow: ellipsis;
        }
        .response-message.error {
          color: var(--red);
        }
        .response-message.success {
          color: var(--blue);
        }

        .file-input-container {
          align-items: flex-start;
          width: 100%;
        }
        .file-input-container .input-set {
          width: 100%;
          display: flex;
          align-items: center;
        }
        .file-input-container .input-set:first-child .file-input-remove-btn {
          visibility: hidden;
        }

        .file-input-remove-btn {
          font-size: 16px;
          color: var(--red);
          outline: none;
          border: none;
          background: none;
          cursor: pointer;
        }

        .v-tab-btn {
          font-size: var(--smal-font-size);
          height: 24px;
          border: none;
          background: none;
          opacity: 0.3;
          cursor: pointer;
          padding: 4px 8px;
        }
        .v-tab-btn.active {
          font-weight: bold;
          background: var(--background);
          opacity: 1;
        }

        @container (min-width: 768px) {
          .textarea {
            padding: 8px;
          }
        }

        @container (max-width: 470px) {
          .hide-in-small-screen {
            display: none;
          }
        }
      `,
      CustomStyles,
    ];
  }

  render() {
    return html`<div
      class="col regular-font request-panel ${
        'read focused'.includes(this.renderStyle) || this.callback === 'true' ? 'read-mode' : 'view-mode'
      }"
    >
      <div class=" ${this.callback === 'true' ? 'tiny-title' : 'req-res-title'} ">
        ${this.callback === 'true' ? 'CALLBACK REQUEST' : 'REQUEST'}
      </div>
      <div>
        ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () =>
          inputParametersTemplate.call(this, 'path')
        )}
        ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () =>
          inputParametersTemplate.call(this, 'query')
        )}
        ${requestBodyTemplate.call(this)}
        ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () =>
          inputParametersTemplate.call(this, 'header')
        )}
        ${guard([this.method, this.path, this.allowTry, this.parameters, this.activeParameterSchemaTabs], () =>
          inputParametersTemplate.call(this, 'cookie')
        )}
        ${this.allowTry === 'false' ? '' : html`${apiCallTemplate.call(this)}`}
      </div>
    </div>`;
  }

  async updated(changedProperties) {
    if (this.showCurlBeforeTry === 'true') {
      if (!changedProperties || !changedProperties.has('curlSyntax') || changedProperties.size > 1) {
        this.applyCURLSyntax(this.shadowRoot);
      }
    }
    scheduleHighlight(this.getRootNode()?.host?.shadowRoot || this.shadowRoot);

    if (this.webhook === 'true') {
      this.allowTry = 'false';
    }
  }

  // This method is called before navigation change in focused mode
  async beforeNavigationFocusedMode() {}

  // This method is called after navigation change in focused mode
  async afterNavigationFocusedMode() {
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.clearResponseData();
  }

  // Request-Body Event Handlers
  onSelectExample(e) {
    this.selectedRequestBodyExample = e.target.value;
    const exampleDropdownEl = e.target;
    window.setTimeout(
      (selectEl) => {
        const readOnlyExampleEl = selectEl.closest('.example-panel').querySelector('.request-body-param');
        const userInputExampleTextareaEl = selectEl.closest('.example-panel').querySelector('.request-body-param-user-input');
        userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;

        const requestPanelEl = this.getRequestPanel({ target: selectEl });
        this.liveCURLSyntaxUpdate(requestPanelEl);
      },
      0,
      exampleDropdownEl
    );
  }

  onMimeTypeChange(e) {
    this.selectedRequestBodyType = e.target.value;
    const mimeDropdownEl = e.target;
    this.selectedRequestBodyExample = '';
    window.setTimeout(
      (selectEl) => {
        const readOnlyExampleEl = selectEl.closest('.request-body-container').querySelector('.request-body-param');
        if (readOnlyExampleEl) {
          const userInputExampleTextareaEl = selectEl.closest('.request-body-container').querySelector('.request-body-param-user-input');
          userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
        }
      },
      0,
      mimeDropdownEl
    );
  }

  async onFillRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      if (el.dataset.example) {
        if (el.tagName.toUpperCase() === 'TAG-INPUT') {
          el.value = el.dataset.example.split('~|~');
        } else {
          el.value = el.dataset.example;
        }
      }
    });
  }

  async onClearRequestData(e) {
    const requestPanelEl = e.target.closest('.request-panel');
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      el.value = '';
    });
  }

  buildFetchURL(requestPanelEl) {
    let fetchUrl;
    const pathParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll("[data-ptype='query-object']")];
    fetchUrl = this.path;
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
            queryParam.append(el.dataset.pname, el.value);
          }
        } else {
          const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
          let vals = el.value && Array.isArray(el.value) ? el.value : [];
          vals = Array.isArray(vals) ? vals.filter((v) => v !== '') : [];
          if (vals.length > 0) {
            if (paramSerializeStyle === 'spaceDelimited') {
              queryParam.append(el.dataset.pname, vals.join(' ').replace(/^\s|\s$/g, ''));
            } else if (paramSerializeStyle === 'pipeDelimited') {
              queryParam.append(el.dataset.pname, vals.join('|').replace(/^\||\|$/g, ''));
            } else {
              if (paramSerializeExplode === 'true') {
                vals.forEach((v) => {
                  queryParam.append(el.dataset.pname, v);
                });
              } else {
                queryParam.append(el.dataset.pname, vals.join(',').replace(/^,|,$/g, ''));
              }
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
          queryParamObj = Object.assign(queryParamObj, JSON.parse(el.value.replace(/\s+/g, ' ')));
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
              const pKey = `${pname}[${key}]`;
              if (typeof queryParamObj[key] === 'object') {
                if (Array.isArray(queryParamObj[key])) {
                  if (paramSerializeStyle === 'spaceDelimited') {
                    queryParam.append(pKey, queryParamObj[key].join(' '));
                  } else if (paramSerializeStyle === 'pipeDelimited') {
                    queryParam.append(pKey, queryParamObj[key].join('|'));
                  } else {
                    if (paramSerializeExplode === 'true') {
                      queryParamObj[key].forEach((v) => {
                        queryParam.append(pKey, v);
                      });
                    } else {
                      queryParam.append(pKey, queryParamObj[key]);
                    }
                  }
                }
              } else {
                queryParam.append(pKey, queryParamObj[key]);
              }
            }
          }
        } catch {
          console.error('RapiDoc: unable to parse %s into object', el.value);
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
        fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${v.name}=${encodeURIComponent(v.finalKeyValue)}`;
      });

    fetchUrl = `${this.serverUrl.replace(/\/$/, '')}${fetchUrl}`;
    return fetchUrl;
  }

  buildFetchHeaders(requestPanelEl) {
    const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0];
    const headerParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='header'], [data-ptype='header-object']")];
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
    const acceptHeader = respEl?.selectedMimeType;
    const reqHeaders = new Headers();
    if (acceptHeader) {
      // Uses the acceptHeader from Response panel
      reqHeaders.append('Accept', acceptHeader);
    } else if (this.accept) {
      reqHeaders.append('Accept', this.accept);
    }

    // Add Authentication Header if provided
    this.api_keys
      .filter((v) => v.in === 'header')
      .forEach((v) => {
        reqHeaders.append(v.name, v.finalKeyValue);
      });

    // Add Header Params
    headerParamEls.map((el) => {
      if (el.value) {
        if (el.dataset.ptype === 'header-object') {
          const headerObjVal = JSON.parse(el.value.replace(/\n/g, '').trim());
          const firstLevelKeySeparator = el.dataset.paramSerializeExplode === 'true' ? '=' : ',';
          const headerStrVal = Object.keys(headerObjVal)
            .map((key) => {
              const value = headerObjVal[key];
              if (typeof value === 'object') {
                return `${key}${firstLevelKeySeparator}${JSON.stringify(value)}`;
              }
              return `${key}${firstLevelKeySeparator}${value}`;
            })
            .join(',');
          reqHeaders.append(el.dataset.pname, headerStrVal);
        } else {
          reqHeaders.append(el.dataset.pname, el.value);
        }
      }
    });

    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      // Common for all request-body
      if (!requestBodyType.includes('form-data')) {
        // For multipart/form-data dont set the content-type to allow creation of browser generated part boundaries
        reqHeaders.append('Content-Type', requestBodyType);
      }
    }
    return reqHeaders;
  }

  buildFetchBodyOptions(requestPanelEl) {
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
    const fetchOptions = {
      method: this.method.toUpperCase(),
    };
    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      if (requestBodyType.includes('form-urlencoded')) {
        // url-encoded Form Params (dynamic) - Parse JSON and generate Params
        const formUrlDynamicTextAreaEl = requestPanelEl.querySelector("[data-ptype='dynamic-form']");
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
              console.warn('RapiDoc: Invalid JSON provided', err);
            }
          } else {
            proceed = false;
          }
          if (proceed) {
            for (const prop in tmpObj) {
              formUrlDynParams.append(prop, JSON.stringify(tmpObj[prop]));
            }
            fetchOptions.body = formUrlDynParams;
          }
        } else {
          // url-encoded Form Params (regular)
          const formUrlEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']")];
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
        }
      } else if (requestBodyType.includes('form-data')) {
        const formDataParams = new FormData();
        const formDataEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-data']")];
        formDataEls.forEach((el) => {
          if (el.dataset.array === 'false') {
            if (el.type === 'file' && el.files[0]) {
              formDataParams.append(el.dataset.pname, el.files[0], el.files[0].name);
            } else if (el.value) {
              formDataParams.append(el.dataset.pname, el.value);
            }
          } else if (el.value && Array.isArray(el.value)) {
            formDataParams.append(el.dataset.pname, el.value.join(','));
          }
        });
        fetchOptions.body = formDataParams;
      } else if (/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(requestBodyType)) {
        const bodyParamFileEl = requestPanelEl.querySelector('.request-body-param-file');
        if (bodyParamFileEl?.files[0]) {
          fetchOptions.body = bodyParamFileEl.files[0];
        }
      } else if (requestBodyType.includes('json') || requestBodyType.includes('xml') || requestBodyType.includes('text')) {
        const exampleTextAreaEl = requestPanelEl.querySelector('.request-body-param-user-input');
        if (exampleTextAreaEl?.value) {
          fetchOptions.body = exampleTextAreaEl.value;
        }
      }
    }

    return fetchOptions;
  }

  async onTryClick(e) {
    const tryBtnEl = e?.target;
    const requestPanelEl = tryBtnEl ? this.getRequestPanel(e) : this.shadowRoot.querySelector('.request-panel');
    const fetchUrl = this.buildFetchURL(requestPanelEl);
    const fetchOptions = this.buildFetchBodyOptions(requestPanelEl);
    const reqHeaders = this.buildFetchHeaders(requestPanelEl);
    this.responseUrl = '';
    this.responseHeaders = [];
    this.curlSyntax = this.generateCURLSyntax(fetchUrl, reqHeaders, fetchOptions, requestPanelEl);
    this.responseStatus = 'success';
    this.responseIsBlob = false;

    this.respContentDisposition = '';
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
    if (this.fetchCredentials) {
      fetchOptions.credentials = this.fetchCredentials;
    }
    const controller = new AbortController();
    this.activeAbortController = controller;
    const { signal } = controller;
    fetchOptions.headers = reqHeaders;
    const tempRequest = { url: fetchUrl, ...fetchOptions };
    this.dispatchEvent(
      new CustomEvent('before-try', {
        bubbles: true,
        composed: true,
        detail: {
          request: tempRequest,
          controller,
        },
      })
    );
    const updatedFetchOptions = {
      method: tempRequest.method,
      headers: tempRequest.headers,
      credentials: tempRequest.credentials,
      body: tempRequest.body,
    };
    const fetchRequest = new Request(tempRequest.url, updatedFetchOptions);

    let fetchResponse;
    let responseClone;
    try {
      this.loading = true;
      this.responseText = '⌛';
      this.responseMessage = '';
      const startTime = performance.now();
      fetchResponse = await fetch(fetchRequest, { signal });
      const endTime = performance.now();
      responseClone = fetchResponse.clone(); // create a response clone to allow reading response body again (response.json, response.text etc)
      this.responseMessage = html`${fetchResponse.statusText ? `${fetchResponse.statusText}:${fetchResponse.status}` : fetchResponse.status}
        <div style="color:var(--muted-foreground)">Took ${Math.round(endTime - startTime)} milliseconds</div>`;
      this.responseUrl = fetchResponse.url;
      const respHeadersObj = {};
      fetchResponse.headers.forEach((hdrVal, hdr) => {
        respHeadersObj[hdr] = hdrVal;
        this.responseHeaders = `${this.responseHeaders}${hdr}: ${hdrVal}\n`;
      });

      const processed = await processFetchResponse(fetchResponse);
      this.responseText = processed.responseText;
      this.responseIsBlob = processed.responseIsBlob;
      this.responseBlobType = processed.responseBlobType;
      this.responseBlobUrl = processed.responseBlobUrl;
      this.respContentDisposition = processed.respContentDisposition;

      this.dispatchEvent(
        new CustomEvent('after-try', {
          bubbles: true,
          composed: true,
          detail: {
            request: fetchRequest,
            response: responseClone,
            responseHeaders: respHeadersObj,
            responseBody: processed.respJson || processed.respText || processed.respBlob,
            responseStatus: responseClone.ok,
          },
        })
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        this.dispatchEvent(
          new CustomEvent('request-aborted', {
            bubbles: true,
            composed: true,
            detail: {
              err,
              request: fetchRequest,
            },
          })
        );
        this.responseMessage = 'Request Aborted';
        this.responseText = 'Request Aborted';
      } else {
        this.dispatchEvent(
          new CustomEvent('after-try', {
            bubbles: true,
            composed: true,
            detail: {
              err,
              request: fetchRequest,
            },
          })
        );
        this.responseMessage = `${err.message} (CORS or Network Issue)`;
      }
    } finally {
      this.loading = false;
      this.activeAbortController = null;
    }
  }

  liveCURLSyntaxUpdate(requestPanelEl) {
    this.applyCURLSyntax(requestPanelEl);
  }

  onGenerateCURLClick(e) {
    const requestPanelEl = this.getRequestPanel(e);
    this.applyCURLSyntax(requestPanelEl);
  }

  getRequestPanel(e) {
    return e.target.closest('.request-panel');
  }

  applyCURLSyntax(requestPanelEl) {
    const fetchUrl = this.buildFetchURL(requestPanelEl);
    const fetchOptions = this.buildFetchBodyOptions(requestPanelEl);
    const fetchHeaders = this.buildFetchHeaders(requestPanelEl);

    const newCurlSyntax = this.generateCURLSyntax(fetchUrl, fetchHeaders, fetchOptions, requestPanelEl);
    if (this.curlSyntax !== newCurlSyntax) {
      this.curlSyntax = newCurlSyntax;
    }
  }

  generateCURLSyntax(fetchUrl, fetchHeaders, fetchOptions, requestPanelEl) {
    let curlUrl;
    let curl = '';
    let curlHeaders = '';
    let curlData = '';
    let curlForm = '';
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');

    if (fetchUrl.startsWith('http') === false) {
      const url = new URL(fetchUrl, window.location.href);
      curlUrl = url.href;
    } else {
      curlUrl = fetchUrl;
    }

    curl = `curl -X ${this.method.toUpperCase()} "${curlUrl}" \\\n`;

    fetchHeaders.forEach((value, key) => {
      const seenValues = [];
      const newValue = value
        .split(',')
        .map((val) => {
          const normalizedValue = val.trim().toLowerCase();
          if (seenValues.includes(normalizedValue)) {
            return null;
          } else {
            seenValues.push(normalizedValue);
            return val;
          }
        })
        .filter((val) => val !== null)
        .join(',');
      fetchHeaders.set(key, newValue);
    });

    curlHeaders = Array.from(fetchHeaders)
      .map(([key, value]) => ` -H '${key}: ${value}'`)
      .join('\\\n');
    if (curlHeaders) {
      curlHeaders = `${curlHeaders} \\\n`;
    }
    if (fetchOptions.body instanceof URLSearchParams) {
      curlData = ` -d ${fetchOptions.body.toString()} \\\n`;
    } else if (fetchOptions.body instanceof File) {
      curlData = ` --data-binary @${fetchOptions.body.name} \\\n`;
    } else if (fetchOptions.body instanceof FormData) {
      curlForm = Array.from(fetchOptions.body)
        .reduce((aggregator, [key, value]) => {
          if (value instanceof File) {
            return [...aggregator, ` -F "${key}=@${value.name}"`];
          }

          const multiple = value.match(/([^,],)/gm);

          if (multiple) {
            const multipleResults = multiple.map((one) => `-F "${key}[]=${one}"`);

            return [...aggregator, ...multipleResults];
          }

          return [...aggregator, ` -F "${key}=${value}"`];
        }, [])
        .join('\\\n');
    } else if (requestBodyContainerEl && requestBodyContainerEl.dataset.selectedRequestBodyType) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      const exampleTextAreaEl = requestPanelEl.querySelector('.request-body-param-user-input');
      if (exampleTextAreaEl?.value) {
        fetchOptions.body = exampleTextAreaEl.value;
        if (requestBodyType.includes('json')) {
          try {
            curlData = ` -d '${JSON.stringify(JSON.parse(exampleTextAreaEl.value)).replace(/'/g, "'\\''")}' \\\n`;
          } catch {
            // Ignore.
          }
        }
        if (!curlData) {
          curlData = ` -d '${exampleTextAreaEl.value.replace(/'/g, "'\"'\"'")}' \\\n`;
        }
      }
    }

    return `${curl}${curlHeaders}${curlData}${curlForm}`;
  }

  onAddFileInput(fieldName) {
    const currentKeys = this.fileInputKeys[fieldName] ?? [0];
    const nextKey = currentKeys.length > 0 ? Math.max(...currentKeys) + 1 : 0;
    this.fileInputKeys = {
      ...this.fileInputKeys,
      [fieldName]: [...currentKeys, nextKey],
    };
  }

  onRemoveFileInput(fieldName, keyToRemove) {
    const currentKeys = this.fileInputKeys[fieldName] ?? [0];
    this.fileInputKeys = {
      ...this.fileInputKeys,
      [fieldName]: currentKeys.filter((k) => k !== keyToRemove),
    };
  }

  clearResponseData() {
    this.responseUrl = '';
    this.responseHeaders = '';
    this.responseText = '';
    this.responseStatus = 'success';
    this.responseMessage = '';
    this.responseIsBlob = false;
    this.responseBlobType = '';
    this.respContentDisposition = '';
    this.fileInputKeys = {};
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    if (this.config && changedProperties.has('config')) {
      if (this.config.renderStyle) this.renderStyle = this.config.renderStyle;
      if (this.config.schemaStyle) this.schemaStyle = this.config.schemaStyle;
      if (this.config.schemaExpandLevel !== undefined) this.schemaExpandLevel = this.config.schemaExpandLevel;
      if (this.config.schemaDescriptionExpanded !== undefined) this.schemaDescriptionExpanded = this.config.schemaDescriptionExpanded;
      if (this.config.allowSchemaDescriptionExpandToggle !== undefined)
        this.allowSchemaDescriptionExpandToggle = this.config.allowSchemaDescriptionExpandToggle;
      if (this.config.schemaHideReadOnly !== undefined)
        this.schemaHideReadOnly = this.config.schemaHideReadOnly === 'never' ? 'false' : this.webhook === 'true' ? 'false' : 'true';
      if (this.config.schemaHideWriteOnly !== undefined)
        this.schemaHideWriteOnly = this.config.schemaHideWriteOnly === 'never' ? 'false' : this.webhook === 'true' ? 'true' : 'false';
      if (this.config.fillRequestFieldsWithExample !== undefined)
        this.fillRequestFieldsWithExample = this.config.fillRequestFieldsWithExample;
      if (this.config.allowTry !== undefined) this.allowTry = this.config.allowTry;
      if (this.config.showCurlBeforeTry !== undefined) this.showCurlBeforeTry = this.config.showCurlBeforeTry;
      if (this.config.fetchCredentials !== undefined) this.fetchCredentials = this.config.fetchCredentials;
      if (this.config.defaultSchemaTab) this.activeSchemaTab = this.config.defaultSchemaTab;
    }
  }

  disconnectedCallback() {
    this.curlSyntax = '';
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
    // Cleanup ObjectURL for the blob data if this component created one
    if (this.responseBlobUrl) {
      URL.revokeObjectURL(this.responseBlobUrl);
      this.responseBlobUrl = '';
    }
    super.disconnectedCallback();
  }
}

// Register the element with the browser
customElements.define('api-request', ApiRequest);
