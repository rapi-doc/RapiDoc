import { css, LitElement } from 'lit';
import type { PropertyValues } from 'lit';
import { scheduleHighlight } from '~/utils/highlighter';

// Styles
import FontStyles from '~/styles/font-styles';
import InputStyles from '~/styles/input-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import MicrolighterStyles from '~/styles/microlighter-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';

import EndpointStyles from '~/styles/endpoint-styles';
import type { RapiDocConfig, AuthParams, RapiDocElement } from '~/types/element';
import type { ResolvedSecurityScheme, ResolvedServer, ResolvedSpecState, ResolvedSpec } from '~/types/spec';
import { rapidocApiKey } from '~/utils/common-utils';
import ProcessSpec from '~/utils/spec-parser';
import { enableMockServer, disableMockServer, updateMockConfig } from '~/utils/mock-interceptor';
import mainBodyTemplate from '~/templates/main-body-template';
import { applyApiKey, onClearAllApiKeys } from '~/templates/security-scheme-template';
import { setApiServer } from '~/templates/server-template';
import '~/utils/markdown-utils';

const paramsConverter = {
  fromAttribute: (attr: string | null): AuthParams => {
    if (!attr) {
      return null;
    }
    const trimmed = attr.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  },
  toAttribute: (prop: AuthParams) => {
    if (typeof prop === 'object' && prop !== null) {
      return JSON.stringify(prop);
    }
    return prop;
  },
};

export default class RapiDocMini extends LitElement {
  // Spec
  specUrl?: string;
  sortEndpointsBy!: string;
  sortTags!: string;
  sortSchemas?: string;
  generateMissingTags?: string;

  // UI Layouts
  layout!: string;
  pathsExpanded!: string | boolean;
  defaultSchemaTab!: string;
  responseAreaHeight!: string;
  showSummaryWhenCollapsed!: string;
  fillRequestFieldsWithExample!: string;
  persistAuth!: string;

  // Schema Styles
  schemaStyle!: string;
  schemaExpandLevel!: number;
  schemaDescriptionExpanded!: string;
  schemaHideReadOnly!: string;
  schemaHideWriteOnly!: string;

  // API Server
  apiKeyName!: string;
  apiKeyLocation!: string;
  apiKeyValue!: string;
  defaultApiServerUrl?: string;
  serverUrl?: string;
  oauthReceiver!: string;
  additionalAuthorizeParams?: AuthParams;
  additionalTokenParams?: AuthParams;

  // Mock Server
  mockServer?: string;
  mockServerStatusCode?: string;
  mockServerStatusStrategy?: string;
  mockServerDelay?: number;
  mockServerLog?: string;

  allowTry!: string;
  showCurlBeforeTry?: string;

  // Main Colors and Font
  theme!: string;
  bgColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontSize!: string;
  regularFont?: string;
  monoFont?: string;
  loadFonts?: string;

  // Fetch Options
  fetchCredentials!: string;

  // Filters
  matchPaths!: string;
  matchType!: string;
  removeEndpointsWithBadgeLabelAs!: string;
  allowSchemaDescriptionExpandToggle!: string;

  // Internal Properties
  loading?: boolean;

  // Not reactive properties (never declared in `properties`)
  isMini: boolean;
  updateRoute: string;
  renderStyle: string;
  showHeader: string;
  allowAdvancedSearch: string;
  loadFailed?: boolean;
  resolvedSpec?: ResolvedSpecState;
  selectedServer?: ResolvedServer;

  constructor() {
    super();
    this.isMini = true;
    this.updateRoute = 'false';
    this.renderStyle = 'view';
    this.showHeader = 'false';
    this.allowAdvancedSearch = 'false';
  }

  static override get properties() {
    return {
      // Spec
      specUrl: { type: String, attribute: 'spec-url' },
      sortEndpointsBy: { type: String, attribute: 'sort-endpoints-by' },

      // UI Layouts
      layout: { type: String },
      pathsExpanded: { type: String, attribute: 'paths-expanded' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      responseAreaHeight: { type: String, attribute: 'response-area-height' },
      showSummaryWhenCollapsed: { type: String, attribute: 'show-summary-when-collapsed' },
      fillRequestFieldsWithExample: { type: String, attribute: 'fill-request-fields-with-example' },
      persistAuth: { type: String, attribute: 'persist-auth' },

      // Schema Styles
      schemaStyle: { type: String, attribute: 'schema-style' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },

      // API Server
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      defaultApiServerUrl: { type: String, attribute: 'default-api-server' },
      serverUrl: { type: String, attribute: 'server-url' },
      oauthReceiver: { type: String, attribute: 'oauth-receiver' },
      additionalAuthorizeParams: { type: Object, attribute: 'additional-authorize-params', converter: paramsConverter },
      additionalTokenParams: { type: Object, attribute: 'additional-token-params', converter: paramsConverter },

      // Mock Server
      mockServer: { type: String, attribute: 'mock-server' },
      mockServerStatusCode: { type: String, attribute: 'mock-server-status-code' },
      mockServerStatusStrategy: { type: String, attribute: 'mock-server-status-strategy' },
      mockServerDelay: { type: Number, attribute: 'mock-server-delay' },
      mockServerLog: { type: String, attribute: 'mock-server-log' },

      allowTry: { type: String, attribute: 'allow-try' },
      showCurlBeforeTry: { type: String, attribute: 'show-curl-before-try' },

      // Main Colors and Font
      theme: { type: String },
      bgColor: { type: String, attribute: 'bg-color' },
      textColor: { type: String, attribute: 'text-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      fontSize: { type: String, attribute: 'font-size' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },
      loadFonts: { type: String, attribute: 'load-fonts' },

      // Fetch Options
      fetchCredentials: { type: String, attribute: 'fetch-credentials' },

      // Filters
      matchPaths: { type: String, attribute: 'match-paths' },
      matchType: { type: String, attribute: 'match-type' },
      removeEndpointsWithBadgeLabelAs: { type: String, attribute: 'remove-endpoints-with-badge-label-as' },

      // Internal Properties
      loading: { type: Boolean }, // indicates spec is being loaded
    };
  }

  static override get styles() {
    return [
      FontStyles,
      InputStyles,
      FlexStyles,
      TableStyles,
      EndpointStyles,
      MicrolighterStyles,
      TabStyles,
      NavStyles,
      InfoStyles,
      css`
        :host {
          all: initial;
          display: flex;
          flex-direction: column;
          min-width: 360px;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          letter-spacing: normal;
          color: var(--fg);
          background: var(--bg);
          font-family: var(--font-regular);
          container-type: inline-size;
        }

        @container (min-width: 768px) {
          .only-large-screen {
            display: block;
          }
          .only-large-screen-flex {
            display: flex;
          }
        }
      `,
    ];
  }

  // Startup
  override connectedCallback() {
    super.connectedCallback();

    if (this.loadFonts !== 'false') {
      const fontDescriptor = {
        family: 'Open Sans',
        style: 'normal',
        weight: '300',
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      };
      const fontWeight300 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor
      );
      fontDescriptor.weight = '600';
      const fontWeight600 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor
      );
      fontWeight300.load().then((font) => {
        document.fonts.add(font);
      });
      fontWeight600.load().then((font) => {
        document.fonts.add(font);
      });
    }

    if (!this.showSummaryWhenCollapsed || !'true, false,'.includes(`${this.showSummaryWhenCollapsed},`)) {
      this.showSummaryWhenCollapsed = 'true';
    }
    if (!this.layout || !'row, column,'.includes(`${this.layout},`)) {
      this.layout = 'row';
    }
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) {
      this.schemaStyle = 'tree';
    }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (!this.defaultSchemaTab || !'example, schema, model,'.includes(`${this.defaultSchemaTab},`)) {
      this.defaultSchemaTab = 'example';
    } else if (this.defaultSchemaTab === 'model') {
      this.defaultSchemaTab = 'schema';
    }
    this.pathsExpanded = this.pathsExpanded === 'true';
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) {
      this.schemaDescriptionExpanded = 'false';
    }
    if (!this.fillRequestFieldsWithExample || !'true, false,'.includes(`${this.fillRequestFieldsWithExample},`)) {
      this.fillRequestFieldsWithExample = 'true';
    }
    if (!this.persistAuth || !'true, false,'.includes(`${this.persistAuth},`)) {
      this.persistAuth = 'false';
    }
    if (!this.responseAreaHeight) {
      this.responseAreaHeight = '300px';
    }

    if (!this.allowTry || !'true, false,'.includes(`${this.allowTry},`)) {
      this.allowTry = 'true';
    }
    if (!this.apiKeyValue) {
      this.apiKeyValue = '-';
    }
    if (!this.apiKeyLocation) {
      this.apiKeyLocation = 'header';
    }
    if (!this.apiKeyName) {
      this.apiKeyName = '';
    }

    if (!this.oauthReceiver) {
      this.oauthReceiver = 'oauth-receiver.html';
    }
    if (!this.sortTags || !'true, false,'.includes(`${this.sortTags},`)) {
      this.sortTags = 'false';
    }
    if (!this.sortEndpointsBy || !'method, path, summary,'.includes(`${this.sortEndpointsBy},`)) {
      this.sortEndpointsBy = 'path';
    }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) {
      this.fontSize = 'default';
    }

    if (!this.matchType || !'includes regex'.includes(this.matchType)) {
      this.matchType = 'includes';
    }
    if (!this.matchPaths) {
      this.matchPaths = '';
    }
    if (!this.removeEndpointsWithBadgeLabelAs) {
      this.removeEndpointsWithBadgeLabelAs = '';
    }

    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) {
      this.allowSchemaDescriptionExpandToggle = 'true';
    }
    if (!this.fetchCredentials || !'omit, same-origin, include,'.includes(`${this.fetchCredentials},`)) {
      this.fetchCredentials = '';
    }
  }

  override disconnectedCallback() {
    if (this.mockServer === 'true') {
      disableMockServer();
    }
    super.disconnectedCallback();
  }

  override render() {
    return mainBodyTemplate.call(this as unknown as RapiDocElement, true, this.pathsExpanded as boolean);
  }

  get config(): RapiDocConfig {
    return {
      renderStyle: this.renderStyle,
      schemaStyle: this.schemaStyle,
      defaultSchemaTab: this.defaultSchemaTab,
      schemaExpandLevel: this.schemaExpandLevel,
      schemaDescriptionExpanded: this.schemaDescriptionExpanded,
      allowSchemaDescriptionExpandToggle: this.allowSchemaDescriptionExpandToggle,
      schemaHideReadOnly: this.schemaHideReadOnly,
      schemaHideWriteOnly: this.schemaHideWriteOnly,
      fillRequestFieldsWithExample: this.fillRequestFieldsWithExample,
      allowTry: this.allowTry,
      showCurlBeforeTry: this.showCurlBeforeTry,
      fetchCredentials: this.fetchCredentials,
    };
  }

  override updated(changedProperties: PropertyValues) {
    super.updated?.(changedProperties);
    scheduleHighlight(this.shadowRoot!);

    if (changedProperties.has('mockServer')) {
      if (this.mockServer === 'true' && this.resolvedSpec) {
        enableMockServer(this.resolvedSpec, {
          statusCode: this.mockServerStatusCode,
          statusStrategy: this.mockServerStatusStrategy,
          delay: this.mockServerDelay,
          log: this.mockServerLog,
        });
      } else if (this.mockServer !== 'true') {
        disableMockServer();
      }
    }
    if (
      changedProperties.has('mockServerStatusCode') ||
      changedProperties.has('mockServerStatusStrategy') ||
      changedProperties.has('mockServerDelay') ||
      changedProperties.has('mockServerLog')
    ) {
      updateMockConfig({
        statusCode: this.mockServerStatusCode,
        statusStrategy: this.mockServerStatusStrategy,
        delay: this.mockServerDelay,
        log: this.mockServerLog,
      });
    }
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          await this.loadSpec(newVal);
        }, 0);
      }
    }
    if (name === 'match-paths' || name === 'match-type' || name === 'remove-endpoints-with-badge-label-as') {
      if (oldVal !== newVal) {
        window.setTimeout(async () => {
          await this.loadSpec(this.specUrl);
        }, 0);
      }
    }
    if (name === 'api-key-name' || name === 'api-key-location' || name === 'api-key-value') {
      let updateSelectedApiKey = false;
      let apiKeyName = '';
      let apiKeyLocation = '';
      let apiKeyValue = '';

      if (name === 'api-key-name') {
        if (this.getAttribute('api-key-location') && this.getAttribute('api-key-value')) {
          apiKeyName = newVal!;
          apiKeyLocation = this.getAttribute('api-key-location')!;
          apiKeyValue = this.getAttribute('api-key-value')!;
          updateSelectedApiKey = true;
        }
      } else if (name === 'api-key-location') {
        if (this.getAttribute('api-key-name') && this.getAttribute('api-key-value')) {
          apiKeyLocation = newVal!;
          apiKeyName = this.getAttribute('api-key-name')!;
          apiKeyValue = this.getAttribute('api-key-value')!;
          updateSelectedApiKey = true;
        }
      } else if (name === 'api-key-value') {
        if (this.getAttribute('api-key-name') && this.getAttribute('api-key-location')) {
          apiKeyValue = newVal!;
          apiKeyLocation = this.getAttribute('api-key-location')!;
          apiKeyName = this.getAttribute('api-key-name')!;
          updateSelectedApiKey = true;
        }
      }

      if (updateSelectedApiKey) {
        if (this.resolvedSpec) {
          const rapiDocApiKey = (this.resolvedSpec as ResolvedSpec).securitySchemes.find((v) => v.securitySchemeId === rapidocApiKey);
          if (!rapiDocApiKey) {
            // TODO(ts-migration): the `find` above matches on `securitySchemeId` but the pushed entry has `apiKeyId` (not a
            // ResolvedSecurityScheme field), so the scheme is never found again and duplicates may be pushed. Left as-is.
            (this.resolvedSpec as ResolvedSpec).securitySchemes.push({
              apiKeyId: rapidocApiKey,
              description: 'api-key provided in rapidoc element attributes',
              type: 'apiKey',
              name: apiKeyName,
              in: apiKeyLocation,
              value: apiKeyValue,
              finalKeyValue: apiKeyValue,
            } as unknown as ResolvedSecurityScheme);
          } else {
            rapiDocApiKey.name = apiKeyName;
            rapiDocApiKey.in = apiKeyLocation;
            rapiDocApiKey.value = apiKeyValue;
            rapiDocApiKey.finalKeyValue = apiKeyValue;
          }
          this.requestUpdate();
        }
      }
    }
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  onSpecUrlChange() {
    this.setAttribute('spec-url', (this.shadowRoot!.getElementById('spec-url') as HTMLInputElement).value);
  }

  // Public Method
  async loadSpec(specUrl: unknown) {
    if (!specUrl) {
      return;
    }
    try {
      this.resolvedSpec = {
        specLoadError: false,
        isSpecLoading: true,
        tags: [],
      };
      this.loading = true;
      this.loadFailed = false;
      this.requestUpdate();
      const spec = await ProcessSpec.call(
        this,
        specUrl as Parameters<typeof ProcessSpec>[0],
        this.generateMissingTags === 'true',
        this.sortTags === 'true',
        this.sortSchemas === 'true',
        this.getAttribute('sort-endpoints-by'),
        this.getAttribute('api-key-name'),
        this.getAttribute('api-key-location'),
        this.getAttribute('api-key-value'),
        this.getAttribute('server-url'),
        this.matchPaths,
        this.matchType,
        this.removeEndpointsWithBadgeLabelAs
      );
      this.loading = false;
      this.afterSpecParsedAndValidated(spec);
    } catch (err) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${(err as Error).message}`);
    }
  }

  // Public Method - to update security-scheme of type http
  setHttpUserNameAndPassword(securitySchemeId: string, username: string, password: string) {
    return applyApiKey.call(this, securitySchemeId, username, password);
  }

  // Public Method - to update security-scheme of type apiKey or OAuth
  setApiKey(securitySchemeId: string, apiKeyValue: string) {
    return applyApiKey.call(this, securitySchemeId, '', '', apiKeyValue);
  }

  // Public Method
  removeAllSecurityKeys() {
    return onClearAllApiKeys.call(this);
  }

  // Public Method
  setApiServer(apiServerUrl: string) {
    // return apiServerUrl;
    return setApiServer.call(this, apiServerUrl);
  }

  async afterSpecParsedAndValidated(spec: unknown) {
    this.resolvedSpec = spec as ResolvedSpec;
    this.selectedServer = undefined;
    if (this.defaultApiServerUrl) {
      if (this.defaultApiServerUrl === this.serverUrl) {
        this.selectedServer = {
          url: this.serverUrl,
          computedUrl: this.serverUrl,
        };
      } else if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers.find((v) => v.url === this.defaultApiServerUrl);
      }
    }
    if (!this.selectedServer) {
      if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers[0];
      }
    }
    this.requestUpdate();

    while (!(await this.updateComplete));
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);

    if (this.mockServer === 'true') {
      enableMockServer(this.resolvedSpec, {
        statusCode: this.mockServerStatusCode,
        statusStrategy: this.mockServerStatusStrategy,
        delay: this.mockServerDelay,
        log: this.mockServerLog,
      });
    }
  }

  // Called by anchor tags created using markdown
  handleHref(e: Event) {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'a') {
      if (target.getAttribute('href')!.startsWith('#')) {
        const gotoEl = this.shadowRoot!.getElementById(target.getAttribute('href')!.replace('#', ''));
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }
}
customElements.define('rapi-doc-mini', RapiDocMini);
