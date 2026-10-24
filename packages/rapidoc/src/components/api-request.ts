import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { scheduleHighlight } from '~/utils/highlighter';
import ParamListStyles from '~/styles/param-list-styles';
import FlexStyles from '~/styles/flex-styles';
import InputStyles from '~/styles/input-styles';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import TabStyles from '~/styles/tab-styles';
import MicrolighterStyles from '~/styles/microlighter-styles';
import CustomStyles from '~/styles/custom-styles';
import { constructFetchURL } from '~/utils/url-utils';
import { generateCurlCommand } from '~/utils/curl-utils';
import { constructFetchHeaders, buildUrlEncodedBody, buildMultipartFormData } from '~/utils/request-utils';
import { processFetchResponse } from '../utils/response-utils.js';
import { inputParametersTemplate } from '~/templates/request-params-template';
import requestBodyTemplate from '~/templates/request-body-template';
import apiCallTemplate from '~/templates/api-response-template';

@customElement('api-request')
export default class ApiRequest extends LitElement {
  @property({ type: Object }) config: any;
  @property({ type: String, attribute: 'server-url' }) serverUrl = '';
  @property({ type: Array }) servers: any = [];
  @property({ type: String }) method = '';
  @property({ type: String }) path = '';
  @property({ type: Array }) security: any = [];
  @property({ type: Array }) parameters: any = [];
  @property({ type: Object }) request_body: any;
  @property({ type: Array }) api_keys: any = [];
  @property({ type: Object }) parser: any;
  @property({ type: String }) accept = '';
  @property({ type: String }) callback = '';
  @property({ type: String }) webhook = '';
  @property({ type: String, attribute: 'fill-request-fields-with-example' }) fillRequestFieldsWithExample = '';
  @property({ type: String, attribute: 'allow-try' }) allowTry = 'true';
  @property({ type: String, attribute: 'show-curl-before-try' }) showCurlBeforeTry = 'false';
  @property({ type: String, attribute: 'render-style' }) renderStyle = 'view';
  @property({ type: String, attribute: 'schema-style' }) schemaStyle = 'tree';
  @property({ type: String, attribute: 'active-schema-tab' }) activeSchemaTab = 'schema';
  @property({
    type: Object,
    converter: {
      fromAttribute: (attr: string) => JSON.parse(attr),
      toAttribute: (prop: any) => JSON.stringify(prop),
    },
    attribute: 'active-parameter-schema-tabs',
  })
  activeParameterSchemaTabs: any = {};
  @property({ type: Number, attribute: 'schema-expand-level' }) schemaExpandLevel = 99999;
  @property({ type: String, attribute: 'schema-description-expanded' }) schemaDescriptionExpanded = 'false';
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' }) allowSchemaDescriptionExpandToggle = 'false';
  @property({ type: String, attribute: 'schema-hide-read-only' }) schemaHideReadOnly = 'true';
  @property({ type: String, attribute: 'schema-hide-write-only' }) schemaHideWriteOnly = 'false';
  @property({ type: String, attribute: 'fetch-credentials' }) fetchCredentials = '';

  // Internal reactive state
  @state() responseMessage: any = '';
  @state() responseText = '';
  @state() responseHeaders: any = '';
  @state() responseStatus = 'success';
  @state() responseUrl = '';
  @state() curlSyntax = '';
  @state() responseIsBlob = false;
  @state() responseBlobType = '';
  @state() responseBlobUrl = '';
  @state() respContentDisposition = '';
  @state() activeResponseTab = 'response'; // allowed values: response, headers, curl
  @state() selectedRequestBodyType = '';
  @state() selectedRequestBodyExample = '';
  @state() fileInputKeys: any = {};
  @state() loading = false;

  activeAbortController: any = null;

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
    this.activeResponseTab = 'response';
    this.selectedRequestBodyType = '';
    this.selectedRequestBodyExample = '';
    this.activeParameterSchemaTabs = {};
    this.fileInputKeys = {};
    this.loading = false;
  }

  static get styles() {
    return [
      ParamListStyles,
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
        .top-gap {
          margin-top: 24px;
        }

        .textarea {
          min-height: 220px;
          padding: 5px;
          resize: vertical;
          direction: ltr;
        }

        .response-message {
          font-weight: bold;
          text-overflow: ellipsis;

          &.error {
            color: var(--destructive);
          }
          &.success {
            color: var(--blue);
          }
        }

        .file-input-container {
          align-items: flex-start;
          width: 100%;

          & .input-set {
            width: 100%;
            display: flex;
            align-items: center;

            &:first-child .file-input-remove-btn {
              visibility: hidden;
            }
          }
        }

        .file-input-remove-btn {
          font-size: 16px;
          color: var(--destructive);
          outline: none;
          border: none;
          background: none;
          cursor: pointer;
        }

        .v-tab-btn {
          font-size: var(--font-size-small);
          height: 24px;
          border: none;
          background: none;
          opacity: 0.3;
          cursor: pointer;
          padding: 4px 8px;

          &.active {
            font-weight: bold;
            background: var(--background);
            opacity: 1;
          }
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

  /** Shared schema & display configurations that affect both parameters and request body */
  get commonConfigDeps() {
    return [
      this.schemaStyle,
      this.schemaExpandLevel,
      this.schemaDescriptionExpanded,
      this.allowSchemaDescriptionExpandToggle,
      this.schemaHideReadOnly,
      this.schemaHideWriteOnly,
      this.fillRequestFieldsWithExample,
      this.renderStyle,
      this.allowTry,
      this.callback,
      this.webhook,
    ];
  }

  /** Dependencies for query/path/header/cookie parameters */
  get parameterGuardDeps() {
    return [this.method, this.path, this.parameters, this.activeParameterSchemaTabs, ...this.commonConfigDeps];
  }

  /** Dependencies for the request body template */
  get requestBodyGuardDeps() {
    return [
      this.method,
      this.path,
      this.request_body,
      this.selectedRequestBodyType,
      this.selectedRequestBodyExample,
      this.activeSchemaTab,
      this.fileInputKeys,
      ...this.commonConfigDeps,
    ];
  }

  render() {
    return html`<div
      class="col regular-font request-panel ${
        'read focused'.includes(this.renderStyle) || this.callback === 'true' ? 'read-mode' : 'view-mode'
      }"
    >
      ${
        this.callback === 'true'
          ? html`<h6 class="rapidoc-heading label-heading tiny-title" part="section-request-title heading heading-6">Callback request</h6>`
          : html`<h4 class="rapidoc-heading label-heading req-res-title" part="section-request-title heading heading-4">Request</h4>`
      }
      <div>
        ${guard(this.parameterGuardDeps, () => inputParametersTemplate.call(this, 'path'))}
        ${guard(this.parameterGuardDeps, () => inputParametersTemplate.call(this, 'query'))}
        ${guard(this.requestBodyGuardDeps, () => requestBodyTemplate.call(this))}
        ${guard(this.parameterGuardDeps, () => inputParametersTemplate.call(this, 'header'))}
        ${guard(this.parameterGuardDeps, () => inputParametersTemplate.call(this, 'cookie'))}
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

  // Called by rapi-doc after navigating to a new endpoint in focused renderStyle.
  // In focused mode, the single <api-request> element instance is reused across operations.
  // We reset selectedRequestBodyType and selectedRequestBodyExample so stale MIME type/example selections
  // from a previous endpoint don't carry over to an endpoint that may not support them.
  // The first valid MIME type will be automatically selected by request-body-template during render.
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
    const pathParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='path']")];
    const queryParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='query']")];
    const queryParamObjTypeEls = [...requestPanelEl.querySelectorAll("[data-ptype='query-object']")];

    const pathParams = {};
    pathParamEls.forEach((el) => {
      pathParams[el.dataset.pname] = el.value;
    });

    const queryParams = [];
    queryParamEls.forEach((el) => {
      const isArray = el.dataset.array !== 'false';
      const style = el.dataset.paramSerializeStyle || 'form';
      const explode = el.dataset.paramSerializeExplode !== undefined ? el.dataset.paramSerializeExplode === 'true' : style === 'form';
      const allowReserved = el.dataset.paramAllowReserved === 'true';

      queryParams.push({
        name: el.dataset.pname,
        value: el.value,
        style,
        explode,
        allowReserved,
        isArray,
      });
    });

    queryParamObjTypeEls.forEach((el) => {
      const style = el.dataset.paramSerializeStyle || 'form';
      const explode = el.dataset.paramSerializeExplode !== undefined ? el.dataset.paramSerializeExplode === 'true' : style === 'form';
      const allowReserved = el.dataset.paramAllowReserved === 'true';

      queryParams.push({
        name: el.dataset.pname,
        value: el.value,
        style,
        explode,
        allowReserved,
        isObject: true,
      });
    });

    return constructFetchURL({
      serverUrl: this.serverUrl,
      path: this.path,
      pathParams,
      queryParams,
      apiKeys: this.api_keys,
    });
  }

  buildFetchHeaders(requestPanelEl) {
    const respEl = this.closest('.expanded-req-resp-container, .req-resp-container')?.getElementsByTagName('api-response')[0];
    const headerParamEls = [...requestPanelEl.querySelectorAll("[data-ptype='header'], [data-ptype='header-object']")];
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
    const accept = respEl?.selectedMimeType || this.accept || '';
    const contentType = requestBodyContainerEl?.dataset?.selectedRequestBodyType || '';

    const headerParams = headerParamEls.map((el) => ({
      name: el.dataset.pname,
      value: el.value,
      explode: el.dataset.paramSerializeExplode === 'true',
      isObject: el.dataset.ptype === 'header-object',
    }));

    return constructFetchHeaders({
      accept,
      apiKeys: this.api_keys,
      headerParams,
      contentType,
    });
  }

  buildFetchBodyOptions(requestPanelEl) {
    const requestBodyContainerEl = requestPanelEl.querySelector('.request-body-container');
    const fetchOptions: any = {
      method: this.method.toUpperCase(),
    };
    if (requestBodyContainerEl) {
      const requestBodyType = requestBodyContainerEl.dataset.selectedRequestBodyType || '';
      if (requestBodyType.includes('form-urlencoded')) {
        const formUrlDynamicTextAreaEl = requestPanelEl.querySelector("[data-ptype='dynamic-form']");
        if (formUrlDynamicTextAreaEl) {
          fetchOptions.body = buildUrlEncodedBody([], formUrlDynamicTextAreaEl.value);
        } else {
          const formUrlEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-urlencode']")];
          const fields = formUrlEls
            .filter((v: any) => v.type !== 'file')
            .map((el: any) => ({
              name: el.dataset.pname,
              value: el.value,
              isArray: el.dataset.array !== 'false',
            }));
          fetchOptions.body = buildUrlEncodedBody(fields);
        }
      } else if (requestBodyType.includes('form-data')) {
        const formDataEls = [...requestPanelEl.querySelectorAll("[data-ptype='form-data']")];
        const fields = formDataEls.map((el: any) => ({
          name: el.dataset.pname,
          value: el.value,
          file: el.type === 'file' ? el.files?.[0] : undefined,
          isArray: el.dataset.array !== 'false',
        }));
        fetchOptions.body = buildMultipartFormData(fields);
      } else if (/^audio\/|^image\/|^video\/|^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$/.test(requestBodyType)) {
        const bodyParamFileEl: any = requestPanelEl.querySelector('.request-body-param-file');
        if (bodyParamFileEl?.files[0]) {
          fetchOptions.body = bodyParamFileEl.files[0];
        }
      } else if (requestBodyType.includes('json') || requestBodyType.includes('xml') || requestBodyType.includes('text')) {
        const exampleTextAreaEl: any = requestPanelEl.querySelector('.request-body-param-user-input');
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
    let fetchRequest;
    let fetchResponse;
    let responseClone;
    try {
      this.loading = true;
      this.responseText = '⌛';
      this.responseMessage = '';
      fetchRequest = new Request(tempRequest.url, updatedFetchOptions);
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
        if (tempRequest.method?.toUpperCase() === 'TRACE') {
          this.responseMessage = `${err.message} (Browser security restricts TRACE requests in fetch. Use the cURL snippet below.)`;
        } else {
          this.responseMessage = `${err.message} (CORS or Network Issue)`;
        }
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
    const requestBodyContainerEl = requestPanelEl?.querySelector('.request-body-container');
    const requestBodyType = requestBodyContainerEl?.dataset?.selectedRequestBodyType || '';
    let body = fetchOptions?.body;

    if (!body && requestBodyContainerEl) {
      const exampleTextAreaEl: any = requestPanelEl.querySelector('.request-body-param-user-input');
      if (exampleTextAreaEl?.value) {
        body = exampleTextAreaEl.value;
      }
    }

    return generateCurlCommand({
      method: this.method,
      url: fetchUrl,
      headers: fetchHeaders,
      body,
      contentType: requestBodyType,
    });
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
    // Sync configuration options passed down from parent <rapi-doc>
    if (this.config && changedProperties.has('config')) {
      if (this.config.renderStyle) this.renderStyle = this.config.renderStyle;
      if (this.config.schemaStyle) this.schemaStyle = this.config.schemaStyle;
      if (this.config.schemaExpandLevel !== undefined) this.schemaExpandLevel = this.config.schemaExpandLevel;
      if (this.config.schemaDescriptionExpanded !== undefined) this.schemaDescriptionExpanded = this.config.schemaDescriptionExpanded;
      if (this.config.allowSchemaDescriptionExpandToggle !== undefined)
        this.allowSchemaDescriptionExpandToggle = this.config.allowSchemaDescriptionExpandToggle;
      // In incoming requests, readOnly fields are hidden by default ('true') unless configured to 'never'.
      // For incoming webhooks, the direction is inverted (the external caller sends the payload), so readOnly fields are shown ('false').
      if (this.config.schemaHideReadOnly !== undefined)
        this.schemaHideReadOnly = this.config.schemaHideReadOnly === 'never' ? 'false' : this.webhook === 'true' ? 'false' : 'true';
      // In incoming requests, writeOnly fields are shown by default ('false').
      // For webhooks, writeOnly fields are hidden ('true') unless configured to 'never'.
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
