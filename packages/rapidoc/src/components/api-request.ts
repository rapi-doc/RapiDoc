import { LitElement, html, css } from 'lit';
import type { PropertyValues } from 'lit';
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
import { processFetchResponse } from '../utils/response-utils.ts';
import { inputParametersTemplate } from '~/templates/request-params-template';
import requestBodyTemplate from '~/templates/request-body-template';
import apiCallTemplate from '~/templates/api-response-template';
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { ApiRequestElement, RapiDocConfig } from '~/types/element';
import type { ResolvedParameter, ResolvedSecurityScheme } from '~/types/spec';

/** An input of the request panel (input, textarea, `<tag-input>`); `value` is an array for `<tag-input>`. */
interface RequestFieldEl extends HTMLElement {
  value: string;
  type: string;
  files: FileList | null;
}

/** The subset of `RequestInit` that RapiDoc builds (headers are added right before the request is made). */
interface FetchOptions {
  method: string;
  body?: BodyInit;
  credentials?: RequestCredentials;
  headers?: Headers;
}

/** What `<api-request>` reads from the sibling `<api-response>` element. */
interface SiblingApiResponse extends HTMLElement {
  selectedMimeType?: string;
}

export default class ApiRequest extends LitElement implements ApiRequestElement {
  // Reactive properties (attributes / bound props)
  config!: RapiDocConfig;
  serverUrl?: string;
  servers?: OpenAPIV3_1.ServerObject[];
  method!: string;
  path!: string;
  security?: OpenAPIV3_1.SecurityRequirementObject[];
  parameters?: ResolvedParameter[];
  request_body?: OpenAPIV3_1.RequestBodyObject;
  api_keys?: ResolvedSecurityScheme[];
  parser?: unknown;
  accept?: string;
  callback?: string;
  webhook?: string;
  fillRequestFieldsWithExample!: string;
  allowTry!: string;
  showCurlBeforeTry?: string;
  renderStyle!: string;
  schemaStyle!: string;
  activeSchemaTab?: string;
  activeParameterSchemaTabs!: Record<string, string>;
  schemaExpandLevel!: number;
  schemaDescriptionExpanded!: string;
  allowSchemaDescriptionExpandToggle!: string;
  schemaHideReadOnly!: string;
  schemaHideWriteOnly!: string;
  fetchCredentials?: string;

  // Internal reactive state
  responseMessage: unknown;
  responseStatus: 'success' | 'error';
  responseHeaders: string | string[];
  responseText: string;
  responseUrl: string;
  curlSyntax: string;
  responseIsBlob: boolean;
  responseBlobType: string;
  responseBlobUrl: string;
  respContentDisposition: string;
  activeResponseTab: string;
  selectedRequestBodyType: string;
  selectedRequestBodyExample: string;
  fileInputKeys: Record<string, number[]>;
  loading: boolean;
  activeAbortController?: AbortController | null;

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

  static override get properties() {
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
          fromAttribute: (attr: string | null) => JSON.parse(attr as string),
          toAttribute: (prop: unknown) => JSON.stringify(prop),
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

  static override get styles() {
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
          border-color: var(--primary-color);
        }
        tag-input:focus-within {
          outline: 1px solid;
        }
        .read-mode {
          margin-top: 24px;
        }
        .param-name,
        .param-type {
          margin: 1px 0;
          text-align: right;
          line-height: var(--font-size-small);
        }
        .param-name {
          color: var(--fg);
          font-family: var(--font-mono);
        }
        .param-name.deprecated {
          color: var(--red);
        }
        .param-type {
          color: var(--light-fg);
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
          background: var(--bg);
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

  override render() {
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

  override async updated(changedProperties: PropertyValues) {
    if (this.showCurlBeforeTry === 'true') {
      if (!changedProperties || !changedProperties.has('curlSyntax') || changedProperties.size > 1) {
        this.applyCURLSyntax(this.shadowRoot as unknown as HTMLElement);
      }
    }
    scheduleHighlight(((this.getRootNode() as ShadowRoot | undefined)?.host?.shadowRoot || this.shadowRoot) as ShadowRoot | undefined);

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
  onSelectExample(e: Event) {
    this.selectedRequestBodyExample = (e.target as HTMLSelectElement).value;
    const exampleDropdownEl = e.target as HTMLSelectElement;
    window.setTimeout(
      (selectEl: HTMLSelectElement) => {
        const readOnlyExampleEl = selectEl.closest('.example-panel')!.querySelector<HTMLElement>('.request-body-param')!;
        const userInputExampleTextareaEl = selectEl
          .closest('.example-panel')!
          .querySelector<HTMLTextAreaElement>('.request-body-param-user-input')!;
        userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;

        const requestPanelEl = this.getRequestPanel({ target: selectEl } as unknown as Event)!;
        this.liveCURLSyntaxUpdate(requestPanelEl);
      },
      0,
      exampleDropdownEl
    );
  }

  onMimeTypeChange(e: Event) {
    this.selectedRequestBodyType = (e.target as HTMLSelectElement).value;
    const mimeDropdownEl = e.target as HTMLSelectElement;
    this.selectedRequestBodyExample = '';
    window.setTimeout(
      (selectEl: HTMLSelectElement) => {
        const readOnlyExampleEl = selectEl.closest('.request-body-container')!.querySelector<HTMLElement>('.request-body-param');
        if (readOnlyExampleEl) {
          const userInputExampleTextareaEl = selectEl
            .closest('.request-body-container')!
            .querySelector<HTMLTextAreaElement>('.request-body-param-user-input')!;
          userInputExampleTextareaEl.value = readOnlyExampleEl.innerText;
        }
      },
      0,
      mimeDropdownEl
    );
  }

  async onFillRequestData(e: Event) {
    const requestPanelEl = (e.target as HTMLElement).closest('.request-panel')!;
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      if (el.dataset.example) {
        if (el.tagName.toUpperCase() === 'TAG-INPUT') {
          (el as unknown as { value: string[] }).value = el.dataset.example.split('~|~');
        } else {
          el.value = el.dataset.example;
        }
      }
    });
    this.liveCURLSyntaxUpdate(requestPanelEl as HTMLElement);
  }

  async onClearRequestData(e: Event) {
    const requestPanelEl = (e.target as HTMLElement).closest('.request-panel')!;
    const requestPanelInputEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>('input, tag-input, textarea:not(.is-hidden)')];
    requestPanelInputEls.forEach((el) => {
      el.value = '';
    });
    this.liveCURLSyntaxUpdate(requestPanelEl as HTMLElement);
  }

  buildFetchURL(requestPanelEl: HTMLElement) {
    let fetchUrl: string;
    const pathParamEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='query-object']")];
    fetchUrl = this.path;
    // Generate URL using Path Params
    pathParamEls.map((el) => {
      fetchUrl = fetchUrl.replace(`{${el.dataset.pname}}`, encodeURIComponent(el.value));
    });

    // Query Params
    const urlQueryParamsMap = new Map<string, URLSearchParams>();
    const queryParamsWithReservedCharsAllowed: string[] = [];
    if (queryParamEls.length > 0) {
      queryParamEls.forEach((el) => {
        const queryParam = new URLSearchParams();
        if (el.dataset.paramAllowReserved === 'true') {
          queryParamsWithReservedCharsAllowed.push(el.dataset.pname as string);
        }
        if (el.dataset.array === 'false') {
          if (el.value !== '') {
            queryParam.append(el.dataset.pname as string, el.value);
          }
        } else {
          const { paramSerializeStyle, paramSerializeExplode } = el.dataset;
          let vals: string[] = el.value && Array.isArray(el.value) ? el.value : [];
          vals = Array.isArray(vals) ? vals.filter((v: string) => v !== '') : [];
          if (vals.length > 0) {
            if (paramSerializeStyle === 'spaceDelimited') {
              queryParam.append(el.dataset.pname as string, vals.join(' ').replace(/^\s|\s$/g, ''));
            } else if (paramSerializeStyle === 'pipeDelimited') {
              queryParam.append(el.dataset.pname as string, vals.join('|').replace(/^\||\|$/g, ''));
            } else {
              if (paramSerializeExplode === 'true') {
                vals.forEach((v) => {
                  queryParam.append(el.dataset.pname as string, v);
                });
              } else {
                queryParam.append(el.dataset.pname as string, vals.join(',').replace(/^,|,$/g, ''));
              }
            }
          }
        }
        if (queryParam.toString()) {
          urlQueryParamsMap.set(el.dataset.pname as string, queryParam);
        }
      });
    }

    // Query Params (Dynamic - create from JSON)
    if (queryParamObjTypeEls.length > 0) {
      queryParamObjTypeEls.map((el) => {
        const queryParam = new URLSearchParams();
        try {
          let queryParamObj: Record<string, any> = {};
          const { paramSerializeStyle, paramSerializeExplode, pname } = el.dataset;
          queryParamObj = Object.assign(queryParamObj, JSON.parse(el.value.replace(/\s+/g, ' ')));
          if (el.dataset.paramAllowReserved === 'true') {
            queryParamsWithReservedCharsAllowed.push(el.dataset.pname as string);
          }
          if ('json xml'.includes(paramSerializeStyle as string)) {
            if (paramSerializeStyle === 'json') {
              queryParam.append(el.dataset.pname as string, JSON.stringify(queryParamObj));
            } else if (paramSerializeStyle === 'xml') {
              queryParam.append(el.dataset.pname as string, json2xml(queryParamObj));
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
                      queryParamObj[key].forEach((v: string) => {
                        queryParam.append(pKey, v);
                      });
                    } else {
                      queryParam.append(pKey, queryParamObj[key] as unknown as string);
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
          urlQueryParamsMap.set(el.dataset.pname as string, queryParam);
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
    this.api_keys!.filter((v) => v.in === 'query').forEach((v) => {
      fetchUrl = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}${v.name}=${encodeURIComponent(v.finalKeyValue as string)}`;
    });

    fetchUrl = `${this.serverUrl!.replace(/\/$/, '')}${fetchUrl}`;
    return fetchUrl;
  }

  buildFetchHeaders(requestPanelEl: HTMLElement) {
    const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0] as
      SiblingApiResponse | undefined;
    const headerParamEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='header'], [data-ptype='header-object']")];
    const requestBodyContainerEl = requestPanelEl.querySelector<HTMLElement>('.request-body-container');
    const acceptHeader = respEl?.selectedMimeType;
    const reqHeaders = new Headers();
    if (acceptHeader) {
      // Uses the acceptHeader from Response panel
      reqHeaders.append('Accept', acceptHeader);
    } else if (this.accept) {
      reqHeaders.append('Accept', this.accept);
    }

    // Add Authentication Header if provided
    this.api_keys!.filter((v) => v.in === 'header').forEach((v) => {
      reqHeaders.append(v.name as string, v.finalKeyValue as string);
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
          reqHeaders.append(el.dataset.pname as string, headerStrVal);
        } else {
          reqHeaders.append(el.dataset.pname as string, el.value);
        }
      }
    });

    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType as string;
      // Common for all request-body
      if (!requestBodyType.includes('form-data')) {
        // For multipart/form-data dont set the content-type to allow creation of browser generated part boundaries
        reqHeaders.append('Content-Type', requestBodyType);
      }
    }
    return reqHeaders;
  }

  buildFetchBodyOptions(requestPanelEl: HTMLElement) {
    const requestBodyContainerEl = requestPanelEl.querySelector<HTMLElement>('.request-body-container');
    const fetchOptions: FetchOptions = {
      method: this.method.toUpperCase(),
    };
    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType as string;
      if (requestBodyType.includes('form-urlencoded')) {
        // url-encoded Form Params (dynamic) - Parse JSON and generate Params
        const formUrlDynamicTextAreaEl = requestPanelEl.querySelector<HTMLTextAreaElement>("[data-ptype='dynamic-form']");
        if (formUrlDynamicTextAreaEl) {
          const val = formUrlDynamicTextAreaEl.value;
          const formUrlDynParams = new URLSearchParams();
          let proceed = true;
          let tmpObj: Record<string, unknown> | undefined;
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
          const formUrlEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='form-urlencode']")];
          const formUrlParams = new URLSearchParams();
          formUrlEls
            .filter((v) => v.type !== 'file')
            .forEach((el) => {
              if (el.dataset.array === 'false') {
                if (el.value) {
                  formUrlParams.append(el.dataset.pname as string, el.value);
                }
              } else {
                const vals = el.value && Array.isArray(el.value) ? el.value.join(',') : '';
                formUrlParams.append(el.dataset.pname as string, vals);
              }
            });
          fetchOptions.body = formUrlParams;
        }
      } else if (requestBodyType.includes('form-data')) {
        const formDataParams = new FormData();
        const formDataEls = [...requestPanelEl.querySelectorAll<RequestFieldEl>("[data-ptype='form-data']")];
        formDataEls.forEach((el) => {
          if (el.dataset.array === 'false') {
            if (el.type === 'file' && el.files![0]) {
              formDataParams.append(el.dataset.pname as string, el.files![0], el.files![0].name);
            } else if (el.value) {
              formDataParams.append(el.dataset.pname as string, el.value);
            }
          } else if (el.value && Array.isArray(el.value)) {
            formDataParams.append(el.dataset.pname as string, el.value.join(','));
          }
        });
        fetchOptions.body = formDataParams;
      } else if (/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(requestBodyType)) {
        const bodyParamFileEl = requestPanelEl.querySelector<HTMLInputElement>('.request-body-param-file');
        if (bodyParamFileEl?.files![0]) {
          fetchOptions.body = bodyParamFileEl.files[0];
        }
      } else if (requestBodyType.includes('json') || requestBodyType.includes('xml') || requestBodyType.includes('text')) {
        const exampleTextAreaEl = requestPanelEl.querySelector<HTMLTextAreaElement>('.request-body-param-user-input');
        if (exampleTextAreaEl?.value) {
          fetchOptions.body = exampleTextAreaEl.value;
        }
      }
    }

    return fetchOptions;
  }

  async onTryClick(e: Event) {
    const tryBtnEl = e?.target;
    const requestPanelEl = (tryBtnEl ? this.getRequestPanel(e) : this.shadowRoot!.querySelector('.request-panel')) as HTMLElement;
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
      fetchOptions.credentials = this.fetchCredentials as RequestCredentials;
    }
    const controller = new AbortController();
    this.activeAbortController = controller;
    const { signal } = controller;
    fetchOptions.headers = reqHeaders;
    const tempRequest: FetchOptions & { url: string } = { url: fetchUrl, ...fetchOptions };
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

    let fetchResponse: Response;
    let responseClone: Response;
    try {
      this.loading = true;
      this.responseText = '⌛';
      this.responseMessage = '';
      const startTime = performance.now();
      fetchResponse = await fetch(fetchRequest, { signal });
      const endTime = performance.now();
      responseClone = fetchResponse.clone(); // create a response clone to allow reading response body again (response.json, response.text etc)
      this.responseMessage = html`${fetchResponse.statusText ? `${fetchResponse.statusText}:${fetchResponse.status}` : fetchResponse.status}
        <div style="color:var(--light-fg)">Took ${Math.round(endTime - startTime)} milliseconds</div>`;
      this.responseUrl = fetchResponse.url;
      const respHeadersObj: Record<string, string> = {};
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
      this.responseStatus = 'error';
      if ((err as Error).name === 'AbortError') {
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
        this.responseMessage = `${(err as Error).message} (CORS or Network Issue)`;
      }
    } finally {
      this.loading = false;
      this.activeAbortController = null;
    }
  }

  liveCURLSyntaxUpdate(requestPanelEl: HTMLElement) {
    this.applyCURLSyntax(requestPanelEl);
  }

  onGenerateCURLClick(e: Event) {
    const requestPanelEl = this.getRequestPanel(e)!;
    this.applyCURLSyntax(requestPanelEl);
  }

  getRequestPanel(e: Event): HTMLElement | null {
    return (e.target as HTMLElement).closest('.request-panel');
  }

  applyCURLSyntax(requestPanelEl: HTMLElement) {
    const fetchUrl = this.buildFetchURL(requestPanelEl);
    const fetchOptions = this.buildFetchBodyOptions(requestPanelEl);
    const fetchHeaders = this.buildFetchHeaders(requestPanelEl);

    const newCurlSyntax = this.generateCURLSyntax(fetchUrl, fetchHeaders, fetchOptions, requestPanelEl);
    if (this.curlSyntax !== newCurlSyntax) {
      this.curlSyntax = newCurlSyntax;
    }
  }

  generateCURLSyntax(fetchUrl: string, fetchHeaders: Headers, fetchOptions: FetchOptions, requestPanelEl: HTMLElement) {
    let curlUrl: string;
    let curl = '';
    let curlHeaders = '';
    let curlData = '';
    let curlForm = '';
    const requestBodyContainerEl = requestPanelEl.querySelector<HTMLElement>('.request-body-container');

    if (fetchUrl.startsWith('http') === false) {
      const url = new URL(fetchUrl, window.location.href);
      curlUrl = url.href;
    } else {
      curlUrl = fetchUrl;
    }

    curl = `curl -X ${this.method.toUpperCase()} "${curlUrl}" \\\n`;

    fetchHeaders.forEach((value, key) => {
      const seenValues: string[] = [];
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
        .reduce((aggregator: string[], [key, value]) => {
          if (value instanceof File) {
            return [...aggregator, ` -F "${key}=@${value.name}"`];
          }

          const multiple = (value as string).match(/([^,],)/gm);

          if (multiple) {
            const multipleResults = multiple.map((one: string) => `-F "${key}[]=${one}"`);

            return [...aggregator, ...multipleResults];
          }

          return [...aggregator, ` -F "${key}=${value}"`];
        }, [])
        .join('\\\n');
    } else if (requestBodyContainerEl && requestBodyContainerEl.dataset.selectedRequestBodyType) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType;
      const exampleTextAreaEl = requestPanelEl.querySelector<HTMLTextAreaElement>('.request-body-param-user-input');
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

  onAddFileInput(fieldName: string) {
    const currentKeys = this.fileInputKeys[fieldName] ?? [0];
    const nextKey = currentKeys.length > 0 ? Math.max(...currentKeys) + 1 : 0;
    this.fileInputKeys = {
      ...this.fileInputKeys,
      [fieldName]: [...currentKeys, nextKey],
    };
  }

  onRemoveFileInput(fieldName: string, keyToRemove: number) {
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

  override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate?.(changedProperties);
    if (this.config) {
      this.renderStyle ??= this.config.renderStyle;
      this.schemaStyle ??= this.config.schemaStyle;
      this.schemaExpandLevel ??= this.config.schemaExpandLevel;
      this.schemaDescriptionExpanded ??= this.config.schemaDescriptionExpanded;
      this.allowSchemaDescriptionExpandToggle ??= this.config.allowSchemaDescriptionExpandToggle;
      this.schemaHideReadOnly ??= this.config.schemaHideReadOnly === 'never' ? 'false' : this.webhook === 'true' ? 'false' : 'true';
      this.schemaHideWriteOnly ??= this.config.schemaHideWriteOnly === 'never' ? 'false' : this.webhook === 'true' ? 'true' : 'false';
      this.fillRequestFieldsWithExample ??= this.config.fillRequestFieldsWithExample;
      this.allowTry ??= this.config.allowTry;
      this.showCurlBeforeTry ??= this.config.showCurlBeforeTry;
      this.fetchCredentials ??= this.config.fetchCredentials;
      this.activeSchemaTab ??= this.config.defaultSchemaTab || 'example';
    }
  }

  override disconnectedCallback() {
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
