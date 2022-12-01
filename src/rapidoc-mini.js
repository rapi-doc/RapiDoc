import { css, LitElement } from 'lit';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-csharp';

// Styles
import FontStyles from '~/styles/font-styles';
import InputStyles from '~/styles/input-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import PrismStyles from '~/styles/prism-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';

import EndpointStyles from '~/styles/endpoint-styles';
import { rapidocApiKey } from '~/utils/common-utils';
import ProcessSpec from '~/utils/spec-parser';
import mainBodyTemplate from '~/templates/main-body-template';
import { applyApiKey, onClearAllApiKeys } from '~/templates/security-scheme-template';
import { setApiServer } from '~/templates/server-template';

export default class RapiDocMini extends LitElement {
  constructor() {
    super();
    this.isMini = true;
    this.updateRoute = 'false';
    this.renderStyle = 'view';
    this.showHeader = 'false';
    this.allowAdvancedSearch = 'false';
  }

  static get properties() {
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

      allowTry: { type: String, attribute: 'allow-try' },

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

      // Internal Properties
      loading: { type: Boolean }, // indicates spec is being loaded
    };
  }

  static get styles() {
    return [
      FontStyles,
      InputStyles,
      FlexStyles,
      TableStyles,
      EndpointStyles,
      PrismStyles,
      TabStyles,
      NavStyles,
      InfoStyles,
      css`
      :host {
        display:flex;
        flex-direction: column;
        min-width:360px;
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        overflow: hidden;
        letter-spacing:normal;
        color:var(--fg);
        background-color:var(--bg);
        font-family:var(--font-regular);
      }

      @media only screen and (min-width: 768px) {
        .only-large-screen{
          display:block;
        }
        .only-large-screen-flex{
          display:flex;
        }
      }`,
    ];
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();

    if (this.loadFonts !== 'false') {
      const fontDescriptor = {
        family: 'Open Sans',
        style: 'normal',
        weight: '300',
        unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      };
      const fontWeight300 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor,
      );
      fontDescriptor.weight = '600';
      const fontWeight600 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor,
      );
      fontWeight300.load().then((font) => { document.fonts.add(font); });
      fontWeight600.load().then((font) => { document.fonts.add(font); });
    }

    if (!this.showSummaryWhenCollapsed || !'true, false,'.includes(`${this.showSummaryWhenCollapsed},`)) { this.showSummaryWhenCollapsed = 'true'; }
    if (!this.layout || !'row, column,'.includes(`${this.layout},`)) { this.layout = 'row'; }
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (!this.defaultSchemaTab || !'example, schema, model,'.includes(`${this.defaultSchemaTab},`)) {
      this.defaultSchemaTab = 'example';
    } else if (this.defaultSchemaTab === 'model') {
      this.defaultSchemaTab = 'schema';
    }
    this.pathsExpanded = this.pathsExpanded === 'true';
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.fillRequestFieldsWithExample || !'true, false,'.includes(`${this.fillRequestFieldsWithExample},`)) { this.fillRequestFieldsWithExample = 'true'; }
    if (!this.persistAuth || !'true, false,'.includes(`${this.persistAuth},`)) { this.persistAuth = 'false'; }
    if (!this.responseAreaHeight) { this.responseAreaHeight = '300px'; }

    if (!this.allowTry || !'true, false,'.includes(`${this.allowTry},`)) { this.allowTry = 'true'; }
    if (!this.apiKeyValue) { this.apiKeyValue = '-'; }
    if (!this.apiKeyLocation) { this.apiKeyLocation = 'header'; }
    if (!this.apiKeyName) { this.apiKeyName = ''; }

    if (!this.oauthReceiver) { this.oauthReceiver = 'oauth-receiver.html'; }
    if (!this.sortTags || !'true, false,'.includes(`${this.sortTags},`)) { this.sortTags = 'false'; }
    if (!this.sortEndpointsBy || !'method, path, summary,'.includes(`${this.sortEndpointsBy},`)) { this.sortEndpointsBy = 'path'; }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) { this.fontSize = 'default'; }
    if (!this.matchType || !'includes regex'.includes(this.matchType)) { this.matchType = 'includes'; }

    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) { this.allowSchemaDescriptionExpandToggle = 'true'; }
    if (!this.fetchCredentials || !'omit, same-origin, include,'.includes(`${this.fetchCredentials},`)) { this.fetchCredentials = ''; }

    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });
  }

  render() {
    return mainBodyTemplate.call(this, true, false, false, this.pathsExpanded);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          await this.loadSpec(newVal);
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
          apiKeyName = newVal;
          apiKeyLocation = this.getAttribute('api-key-location');
          apiKeyValue = this.getAttribute('api-key-value');
          updateSelectedApiKey = true;
        }
      } else if (name === 'api-key-location') {
        if (this.getAttribute('api-key-name') && this.getAttribute('api-key-value')) {
          apiKeyLocation = newVal;
          apiKeyName = this.getAttribute('api-key-name');
          apiKeyValue = this.getAttribute('api-key-value');
          updateSelectedApiKey = true;
        }
      } else if (name === 'api-key-value') {
        if (this.getAttribute('api-key-name') && this.getAttribute('api-key-location')) {
          apiKeyValue = newVal;
          apiKeyLocation = this.getAttribute('api-key-location');
          apiKeyName = this.getAttribute('api-key-name');
          updateSelectedApiKey = true;
        }
      }

      if (updateSelectedApiKey) {
        if (this.resolvedSpec) {
          const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => v.securitySchemeId === rapidocApiKey);
          if (!rapiDocApiKey) {
            this.resolvedSpec.securitySchemes.push({
              apiKeyId: rapidocApiKey,
              description: 'api-key provided in rapidoc element attributes',
              type: 'apiKey',
              name: apiKeyName,
              in: apiKeyLocation,
              value: apiKeyValue,
              finalKeyValue: apiKeyValue,
            });
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
    this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
  }

  // Public Method
  async loadSpec(specUrl) {
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
        specUrl,
        this.generateMissingTags === 'true',
        this.sortTags === 'true',
        this.getAttribute('sort-endpoints-by'),
        this.getAttribute('api-key-name'),
        this.getAttribute('api-key-location'),
        this.getAttribute('api-key-value'),
        this.getAttribute('server-url'),
      );
      this.loading = false;
      this.afterSpecParsedAndValidated(spec);
    } catch (err) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`); // eslint-disable-line no-console
    }
  }

  // Public Method - to update security-scheme of type http
  setHttpUserNameAndPassword(securitySchemeId, username, password) {
    return applyApiKey.call(this, securitySchemeId, username, password);
  }

  // Public Method - to update security-scheme of type apiKey or OAuth
  setApiKey(securitySchemeId, apiKeyValue) {
    return applyApiKey.call(this, securitySchemeId, '', '', apiKeyValue);
  }

  // Public Method
  removeAllSecurityKeys() {
    return onClearAllApiKeys.call(this);
  }

  // Public Method
  setApiServer(apiServerUrl) {
    // return apiServerUrl;
    return setApiServer.call(this, apiServerUrl);
  }

  async afterSpecParsedAndValidated(spec) {
    this.resolvedSpec = spec;
    this.selectedServer = undefined;
    if (this.defaultApiServerUrl) {
      if (this.defaultApiServerUrl === this.serverUrl) {
        this.selectedServer = {
          url: this.serverUrl,
          computedUrl: this.serverUrl,
        };
      } else if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers.find((v) => (v.url === this.defaultApiServerUrl));
      }
    }
    if (!this.selectedServer) {
      if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers[0]; // eslint-disable-line prefer-destructuring
      }
    }
    this.requestUpdate();
    // eslint-disable-next-line no-await-in-loop
    while (!await this.updateComplete);
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);
  }

  // Called by anchor tags created using markdown
  handleHref(e) {
    if (e.target.tagName.toLowerCase() === 'a') {
      if (e.target.getAttribute('href').startsWith('#')) {
        const gotoEl = this.shadowRoot.getElementById(e.target.getAttribute('href').replace('#', ''));
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }
}
customElements.define('rapi-doc-mini', RapiDocMini);
