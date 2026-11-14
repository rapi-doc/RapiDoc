import { css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { scheduleHighlight } from "~/utils/highlighter";

// Styles
import FontStyles from "~/styles/font-styles";
import InputStyles from "~/styles/input-styles";
import FlexStyles from "~/styles/flex-styles";
import AuthStyles from "~/styles/auth-styles";
import ParamListStyles from "~/styles/param-list-styles";
import MicrolighterStyles from "~/styles/microlighter-styles";
import TabStyles from "~/styles/tab-styles";
import NavStyles from "~/styles/nav-styles";
import InfoStyles from "~/styles/info-styles";

import EndpointStyles from "~/styles/endpoint-styles";
import ThemeTokens, {
  DEFAULT_THEME,
  applyCustomTheme,
  isValidHexColor,
  normalizeTheme,
} from "~/styles/theme-tokens";
import { rapidocApiKey } from "~/utils/common-utils";
import ProcessSpec from "~/utils/spec-parser";
import { enableMockServer, disableMockServer, updateMockConfig } from "~/utils/mock-interceptor";
import mainBodyTemplate from "~/templates/main-body-template";
import { applyApiKey, onClearAllApiKeys } from "~/templates/security-scheme-template";
import { setApiServer } from "~/templates/server-template";
import "~/utils/markdown-utils";
import { AutoColorSchemeController } from "~/utils/auto-color-scheme";

const paramsConverter = {
  fromAttribute: (attr: string | null) => {
    if (!attr) {
      return null;
    }
    const trimmed = attr.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  },
  toAttribute: (prop: any) => {
    if (typeof prop === "object" && prop !== null) {
      return JSON.stringify(prop);
    }
    return prop;
  },
};

/**
 * `<rapi-doc-mini>`: the operations you pick from an OpenAPI document, with their parameters,
 * schemas and Try console, without navigation or search. Its doc comments are read like those of
 * `<rapi-doc>` (see the class comment in rapidoc.ts) into the custom elements manifest and the
 * types in dist/.
 *
 * @fires spec-loaded - Dispatched after the OpenAPI specification has been fully fetched, parsed,
 * resolved, and rendered into the DOM. Provides the resolved spec object in <span class="mono
 * yellow">e.detail</span>.
 *
 * @deprecatedAttr match-paths | Spec & Content | | | <span class="red bold">[REMOVED]</span> Use
 * <span class="mono yellow">filter-operations</span>: a path glob (<span class="mono
 * yellow">/pet/**</span>), a method and path, or operationIds.
 * @deprecatedAttr match-type | Spec & Content | includes, regex | includes | <span class="red
 * bold">[REMOVED]</span> <span class="mono yellow">filter-operations</span> matches exact terms and
 * path globs, not substrings or regular expressions.
 * @deprecatedAttr remove-endpoints-with-badge-label-as | Spec & Content | | | <span class="red
 * bold">[REMOVED]</span> Use <span class="mono yellow">filter-operations="!badge:Beta"</span>.
 */
@customElement("rapi-doc-mini")
export default class RapiDocMini extends LitElement {
  /**
   * URL of the OpenAPI specification file (JSON or YAML) to load and render.
   * @group Spec & Content
   */
  @property({ type: String, attribute: "spec-url" })
  specUrl = "";
  /**
   * Sorts endpoints within each tag group by path, HTTP method, or summary. 'none' leaves the sort
   * order unmodified.<br/> <span class="green">ⓘ This is a static initialization attribute. It will
   * not have any effect if modified using JavaScript after the spec is rendered.</span>
   * @group Spec & Content
   */
  @property({ type: String, attribute: "sort-endpoints-by" })
  sortEndpointsBy: "path" | "method" | "summary" | "none" = "path";

  /**
   * Request and response side by side (<span class="mono yellow">row</span>), or one above the
   * other (<span class="mono yellow">column</span>).
   * @group Layout & Scrolling
   */
  @property({ type: String })
  layout: "row" | "column" = "row";
  /**
   * Shows operations open instead of collapsed.
   * @group Layout & Scrolling
   */
  @property({ type: String, attribute: "paths-expanded" })
  pathsExpanded: "true" | "false" | boolean = "false";
  /**
   * Selects which tab is active by default, and listed first, for request bodies, responses and
   * object parameters: 'schema' (data contract model) or 'example' (sample JSON payload).
   * @summary Default active tab in request and response bodies
   * @group Schemas
   */
  @property({ type: String, attribute: "default-schema-tab" })
  defaultSchemaTab: "schema" | "example" = "example";
  /**
   * Height of the response panel, as a CSS length.
   * @group Layout & Scrolling
   */
  @property({ type: String, attribute: "response-area-height" })
  responseAreaHeight = "300px";
  /**
   * Shows the summary on a collapsed operation.
   * @group Layout & Scrolling
   */
  @property({ type: String, attribute: "show-summary-when-collapsed" })
  showSummaryWhenCollapsed: "true" | "false" = "true";
  /**
   * Pre-populates interactive request parameter inputs and request body fields using example values
   * defined in the OpenAPI spec.
   * @summary Pre-populate "Try" console parameters with sample values
   * @group Try & Servers
   */
  @property({ type: String, attribute: "fill-request-fields-with-example" })
  fillRequestFieldsWithExample: "true" | "false" = "true";
  /**
   * Keeps API keys, bearer tokens and OAuth access tokens in localStorage across page reloads; an
   * OAuth token is dropped once it expires. Basic credentials and OAuth client secrets are never
   * stored.
   * @summary Persist API keys and tokens in browser localStorage
   * @group Authentication
   */
  @property({ type: String, attribute: "persist-auth" })
  persistAuth: "true" | "false" = "false";

  /**
   * Controls the visual representation of complex JSON schemas in request and response panels.
   * 'tree' provides an interactive collapsible tree view; 'table' renders structured tabular rows.
   * @summary Display schemas as visual table or tree hierarchy
   * @group Schemas
   */
  @property({ type: String, attribute: "schema-style" })
  schemaStyle: "tree" | "table" = "tree";
  /**
   * Initial depth level for auto-expanding complex nested schema properties and sub-objects (the
   * default expands all levels).
   * @summary Initial expansion depth for nested schemas
   * @group Schemas
   */
  @property({ type: Number, attribute: "schema-expand-level" })
  schemaExpandLevel = 99999;
  /**
   * Controls whether schema field constraints, validation rules, and descriptions are fully
   * expanded by default or collapsed to a single line.
   * @summary Display full multiline schema property descriptions by default
   * @group Schemas
   */
  @property({ type: String, attribute: "schema-description-expanded" })
  schemaDescriptionExpanded: "true" | "false" = "false";

  /**
   * Name of the header or query parameter used when transmitting the API key in interactive console
   * requests.
   * @group Authentication
   */
  @property({ type: String, attribute: "api-key-name" })
  apiKeyName = "";
  /**
   * Specifies whether the API key is passed as an HTTP request header or query parameter.
   * @group Authentication
   */
  @property({ type: String, attribute: "api-key-location" })
  apiKeyLocation: "header" | "query" = "header";
  /**
   * Pre-configured API key value sent during interactive console requests. Can also be set or
   * overwritten directly in the UI.
   * @group Authentication
   * @default (empty)
   */
  @property({ type: String, attribute: "api-key-value" })
  apiKeyValue = "-";
  /**
   * Selects which server URL from the spec's servers list should be selected by default.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "default-api-server" })
  defaultApiServerUrl = "";
  /**
   * Custom API server base URL. Overrides the servers array defined in the OpenAPI specification.
   * Particularly useful when sharing a single spec across development, staging, and production
   * environments.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "server-url" })
  serverUrl = "";
  /**
   * Relative or absolute path to the OAuth receiver HTML file for handling authorization
   * redirection callbacks.
   * @group Authentication
   */
  @property({ type: String, attribute: "oauth-receiver" })
  oauthReceiver = "oauth-receiver.html";
  /**
   * Custom query parameters appended to the OAuth2 authorization URL query string (e.g. proxy
   * launch tokens, prompt, audience).<br/><br/> <strong>Supported Formats:</strong> <ul>
   * <li><strong>JSON String</strong> (recommended for HTML
   * attributes):<br/><code>additional-authorize-params='{"launch": "xyz123", "prompt":
   * "consent"}'</code></li> <li><strong>URL Query
   * String</strong>:<br/><code>additional-authorize-params="launch=xyz123&amp;prompt=consent"</code></li>
   * <li><strong>JavaScript Object</strong> (via
   * property):<br/><code>rapidocEl.additionalAuthorizeParams = { launch: 'xyz123', prompt:
   * 'consent' };</code></li> </ul>
   * @group Authentication
   * @default (empty)
   */
  @property({ type: Object, attribute: "additional-authorize-params", converter: paramsConverter })
  additionalAuthorizeParams: any;
  /**
   * Custom parameters included in the POST request body sent to the OAuth2 token endpoint (e.g.
   * custom proxy parameters, resource, audience).<br/><br/> <strong>Supported Formats:</strong>
   * <ul> <li><strong>JSON String</strong> (recommended for HTML
   * attributes):<br/><code>additional-token-params='{"audience": "https://api.example.com",
   * "resource": "urn:my:api"}'</code></li> <li><strong>URL-Encoded
   * String</strong>:<br/><code>additional-token-params="audience=https%3A%2F%2Fapi.example.com"</code></li>
   * <li><strong>JavaScript Object</strong> (via
   * property):<br/><code>rapidocEl.additionalTokenParams = { audience: 'https://api.example.com'
   * };</code></li> </ul>
   * @group Authentication
   * @default (empty)
   */
  @property({ type: Object, attribute: "additional-token-params", converter: paramsConverter })
  additionalTokenParams: any;

  /**
   * Enables the built-in, zero-dependency in-browser mock server. Transparently intercepts outgoing
   * network requests (both RapiDoc's Try console and host application fetch/XHR calls) and serves
   * mock responses based on OpenAPI examples or generated from schemas.
   * @summary Answer Try requests from the in-browser mock server
   * @group Mock Server
   */
  @property({ type: String, attribute: "mock-server" })
  mockServer: "true" | "false" = "false";
  // A string of codes for every operation, or a map by operation (`{ "POST /orders": "503, 200", "*": "200" }`)
  /**
   * HTTP status code (or comma-separated list of codes, e.g. "200, 404, 500") to answer with, or a
   * JSON map by operation (<span class="mono yellow">{ "POST /orders": "503, 200", "*": "200"
   * }</span>). Set it to an empty string to use the first 2xx response in the spec.
   * @group Mock Server
   */
  @property({ type: String, attribute: "mock-server-status-code" })
  mockServerStatusCode: string | Record<string, string> = "200";
  /**
   * Selection strategy when multiple status codes are specified in <span class="mono
   * yellow">mock-server-status-code</span>. 'first' always returns the first code; 'cycle'
   * round-robins sequentially per endpoint (ideal for testing retry and backoff logic); 'random'
   * selects a code randomly for chaos and resilience testing.
   * @group Mock Server
   */
  @property({ type: String, attribute: "mock-server-status-strategy" })
  mockServerStatusStrategy: "first" | "cycle" | "random" = "first";
  /**
   * Simulated network latency in milliseconds before resolving mock responses. Useful for testing
   * client loading spinners and optimistic UI updates.
   * @group Mock Server
   */
  @property({ type: Number, attribute: "mock-server-delay" })
  mockServerDelay = 0;
  /**
   * Logs one line per answered request (method, path and status code) to the browser console.
   * @group Mock Server
   */
  @property({ type: String, attribute: "mock-server-log" })
  mockServerLog: "true" | "false" = "false";

  /**
   * Enables the interactive "TRY" console allowing users to test live API calls directly from their
   * browser.
   * @summary Live interactive endpoint testing console
   * @group Try & Servers
   */
  @property({ type: String, attribute: "allow-try" })
  allowTry: "true" | "false" = "true";
  /**
   * When set to <span class="mono fg-color">true</span>, generates and displays copyable cURL
   * commands directly within the endpoint documentation prior to clicking "TRY".
   * @summary Display cURL command before invoking API
   * @group Try & Servers
   */
  @property({ type: String, attribute: "show-curl-before-try" })
  showCurlBeforeTry: "true" | "false" = "false";

  /**
   * Brand color preset, or a custom brand color as a hex code. Each preset defines a dark and a
   * light palette.
   * @summary Color palette preset
   * @group Theme
   * @allowedNote (or custom hex color e.g. #2563eb)
   * @default ember
   */
  @property({ type: String, reflect: true })
  theme: "ember" | "carbon" | "cobalt" | "jade" | "indigo" | (string & {}) = DEFAULT_THEME;
  /**
   * A custom brand color as a hex code. Same as passing the hex code to <span class="mono
   * yellow">theme</span>.
   * @group Theme
   * @hidden
   */
  @property({ type: String, attribute: "primary-color" })
  primaryColor = "";
  /**
   * Base color scheme mode. 'system' automatically matches the user's OS preference. 'auto' follows
   * the host page: it reads the page's CSS <code>color-scheme</code> (for example
   * <code>:root[data-theme='light'] { color-scheme: light }</code>, as Starlight sets it) and
   * updates when the page switches theme; when the page declares none, it falls back to the OS
   * preference.
   * @summary Dark, light, or follow the system or the page
   * @group Theme
   */
  @property({ type: String, attribute: "color-scheme", reflect: true })
  colorScheme: "dark" | "light" | "system" | "auto" = "dark";
  // color-scheme="auto": follows the page's theme (see utils/auto-color-scheme.js)
  _autoColorScheme = new AutoColorSchemeController(this);
  /**
   * Corner radius scale applied across cards, buttons, badges, inputs, and dialogs.
   * @summary Border radius for cards, inputs, and buttons
   * @group Theme
   */
  @property({ type: String, reflect: true })
  radius: "none" | "sm" | "md" | "lg" | "full" = "sm";
  /**
   * Relative scale factor for typography and UI elements across the documentation portal.
   * @summary Global scale for typography and spacing
   * @group Theme
   */
  @property({ type: String, reflect: true })
  scale: "sm" | "default" | "lg" = "default";

  /**
   * Configures credentials mode for cross-origin browser Fetch requests as defined in the <a
   * href="https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials" target="_blank"
   * rel="noopener">Fetch Standard</a>, enabling transmission of cookies and Authorization headers
   * in CORS requests.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "fetch-credentials" })
  fetchCredentials: "" | "omit" | "same-origin" | "include" = "";

  /**
   * Which operations to show: a space- or comma-separated list of terms. An operation is shown when
   * it matches any include term (every one is, without one) and no <span class="mono
   * yellow">!</span> term. A term is an operationId (<span class="mono yellow">getPetById</span>), a
   * method and path (<span class="mono yellow">GET /pet/{petId}</span>), a path for all its methods,
   * a path glob (<span class="mono yellow">/pet/**</span>; <span class="mono yellow">*</span> is one
   * segment, <span class="mono yellow">**</span> any number), <span class="mono
   * yellow">tag:store</span>, <span class="mono yellow">badge:Beta</span> (an x-badges label) or
   * <span class="mono yellow">deprecated</span>; <span class="mono yellow">!</span> before a term
   * leaves out what it matches (<span class="mono yellow">!badge:Internal</span>). Shown operations
   * keep the order of the first term they match, so a list of operationIds shows them in that
   * order (unless sort-endpoints-by is set).
   * @summary Show only some operations
   * @group Spec & Content
   */
  @property({ type: String, attribute: "filter-operations" })
  filterOperations = "";

  /** @internal */
  @property({ type: Boolean }) loading = false;

  isMini: boolean;
  _specLoadSeq: number;
  _lastLoadedSpec: any;
  updateRoute: string;
  renderStyle: string;
  showHeader: string;
  allowAdvancedSearch: string;
  resolvedSpec: any;
  selectedServer: any;
  loadFailed: boolean;
  sortTags: any;
  generateMissingTags: any;
  sortSchemas: any;
  allowSchemaDescriptionExpandToggle: any;

  constructor() {
    super();
    this.isMini = true;
    // Spec loads carry a token; only the latest load may apply its result (see loadSpec)
    this._specLoadSeq = 0;
    this.updateRoute = "false";
    this.renderStyle = "view";
    this.showHeader = "false";
    this.allowAdvancedSearch = "false";
    this.loadFailed = false;
  }

  static get styles() {
    return [
      ThemeTokens,
      FontStyles,
      InputStyles,
      FlexStyles,
      AuthStyles,
      ParamListStyles,
      EndpointStyles,
      MicrolighterStyles,
      TabStyles,
      NavStyles,
      InfoStyles,
      css`
        :host {
          all: initial;
          /* Same crisp text rendering as <rapi-doc> (see layout-styles.js) */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          display: flex;
          flex-direction: column;
          min-width: 360px;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          letter-spacing: normal;
          color: var(--foreground);
          background: var(--background);
          font-family: var(--font-sans);
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
  connectedCallback() {
    super.connectedCallback();

    if (
      !this.showSummaryWhenCollapsed ||
      !"true, false,".includes(`${this.showSummaryWhenCollapsed},`)
    ) {
      this.showSummaryWhenCollapsed = "true";
    }
    if (!this.layout || !"row, column,".includes(`${this.layout},`)) {
      this.layout = "row";
    }
    if (!this.schemaStyle || !"tree, table,".includes(`${this.schemaStyle},`)) {
      this.schemaStyle = "tree";
    }
    if (this.primaryColor && isValidHexColor(this.primaryColor)) {
      this.theme = this.primaryColor;
    }
    const normalizedTheme = normalizeTheme(this.theme);
    this.theme = normalizedTheme.theme;
    this.setAttribute("theme", this.theme);
    if (!this.colorScheme || !"dark, light, system,".includes(`${this.colorScheme},`)) {
      this.colorScheme = "dark";
    }
    if (!this.radius || !"none, sm, md, lg, full,".includes(`${this.radius},`)) {
      this.radius = "sm";
    }
    if (!this.scale || !"sm, default, lg,".includes(`${this.scale},`)) {
      this.scale = "default";
    }
    if (!this.getAttribute("theme")) {
      this.setAttribute("theme", this.theme);
    }
    if (!this.getAttribute("color-scheme")) {
      this.setAttribute("color-scheme", this.colorScheme);
    }
    if (!this.getAttribute("radius")) {
      this.setAttribute("radius", this.radius);
    }
    if (!this.getAttribute("scale")) {
      this.setAttribute("scale", this.scale);
    }
    applyCustomTheme(this, this.theme);
    if (
      !this.defaultSchemaTab ||
      !"example, schema, model,".includes(`${this.defaultSchemaTab},`)
    ) {
      this.defaultSchemaTab = "example";
    } else if ((this.defaultSchemaTab as string) === "model") {
      this.defaultSchemaTab = "schema";
    }
    this.pathsExpanded = this.pathsExpanded === "true";
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (
      !this.schemaDescriptionExpanded ||
      !"true, false,".includes(`${this.schemaDescriptionExpanded},`)
    ) {
      this.schemaDescriptionExpanded = "false";
    }
    if (
      !this.fillRequestFieldsWithExample ||
      !"true, false,".includes(`${this.fillRequestFieldsWithExample},`)
    ) {
      this.fillRequestFieldsWithExample = "true";
    }
    if (!this.persistAuth || !"true, false,".includes(`${this.persistAuth},`)) {
      this.persistAuth = "false";
    }
    if (!this.responseAreaHeight) {
      this.responseAreaHeight = "300px";
    }

    if (!this.allowTry || !"true, false,".includes(`${this.allowTry},`)) {
      this.allowTry = "true";
    }
    if (!this.apiKeyValue) {
      this.apiKeyValue = "-";
    }
    if (!this.apiKeyLocation) {
      this.apiKeyLocation = "header";
    }
    if (!this.apiKeyName) {
      this.apiKeyName = "";
    }

    if (!this.oauthReceiver) {
      this.oauthReceiver = "oauth-receiver.html";
    }
    if (!this.sortTags || !"true, false,".includes(`${this.sortTags},`)) {
      this.sortTags = "false";
    }
    if (!this.sortEndpointsBy || !"method, path, summary,".includes(`${this.sortEndpointsBy},`)) {
      this.sortEndpointsBy = "path";
    }

    if (
      !this.allowSchemaDescriptionExpandToggle ||
      !"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)
    ) {
      this.allowSchemaDescriptionExpandToggle = "true";
    }
    if (
      !this.fetchCredentials ||
      !"omit, same-origin, include,".includes(`${this.fetchCredentials},`)
    ) {
      this.fetchCredentials = "";
    }
  }

  disconnectedCallback() {
    if (this.mockServer === "true") {
      disableMockServer(this);
    }
    super.disconnectedCallback();
  }

  render() {
    return mainBodyTemplate.call(this, true, this.pathsExpanded);
  }

  get config() {
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

  updated(changedProperties) {
    super.updated?.(changedProperties);
    scheduleHighlight(this.shadowRoot);

    if (changedProperties.has("theme")) {
      const normalizedTheme = normalizeTheme(this.theme);
      if (this.theme !== normalizedTheme.theme) {
        this.theme = normalizedTheme.theme;
        this.setAttribute("theme", this.theme);
      }
      applyCustomTheme(this, this.theme);
    }

    if (
      changedProperties.has("primaryColor") &&
      this.primaryColor &&
      isValidHexColor(this.primaryColor)
    ) {
      this.theme = normalizeTheme(this.primaryColor).theme;
      this.setAttribute("theme", this.theme);
      applyCustomTheme(this, this.theme);
    }

    if (changedProperties.has("mockServer")) {
      if (this.mockServer === "true" && this.resolvedSpec) {
        enableMockServer(this.resolvedSpec, {
          owner: this,
          statusCode: this.mockServerStatusCode,
          statusStrategy: this.mockServerStatusStrategy,
          delay: this.mockServerDelay,
          log: this.mockServerLog,
        });
      } else if (this.mockServer !== "true") {
        disableMockServer(this);
      }
    }
    if (
      changedProperties.has("mockServerStatusCode") ||
      changedProperties.has("mockServerStatusStrategy") ||
      changedProperties.has("mockServerDelay") ||
      changedProperties.has("mockServerLog")
    ) {
      updateMockConfig({
        owner: this,
        statusCode: this.mockServerStatusCode,
        statusStrategy: this.mockServerStatusStrategy,
        delay: this.mockServerDelay,
        log: this.mockServerLog,
      });
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "spec-url") {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          await this.loadSpec(newVal);
        }, 0);
      }
    }
    if (name === "filter-operations") {
      if (oldVal !== newVal) {
        window.setTimeout(async () => {
          await this.loadSpec(this._lastLoadedSpec || this.specUrl);
        }, 0);
      }
    }
    if (name === "api-key-name" || name === "api-key-location" || name === "api-key-value") {
      let updateSelectedApiKey = false;
      let apiKeyName = "";
      let apiKeyLocation = "";
      let apiKeyValue = "";

      if (name === "api-key-name") {
        if (this.getAttribute("api-key-location") && this.getAttribute("api-key-value")) {
          apiKeyName = newVal;
          apiKeyLocation = this.getAttribute("api-key-location");
          apiKeyValue = this.getAttribute("api-key-value");
          updateSelectedApiKey = true;
        }
      } else if (name === "api-key-location") {
        if (this.getAttribute("api-key-name") && this.getAttribute("api-key-value")) {
          apiKeyLocation = newVal;
          apiKeyName = this.getAttribute("api-key-name");
          apiKeyValue = this.getAttribute("api-key-value");
          updateSelectedApiKey = true;
        }
      } else if (name === "api-key-value") {
        if (this.getAttribute("api-key-name") && this.getAttribute("api-key-location")) {
          apiKeyValue = newVal;
          apiKeyLocation = this.getAttribute("api-key-location");
          apiKeyName = this.getAttribute("api-key-name");
          updateSelectedApiKey = true;
        }
      }

      if (updateSelectedApiKey) {
        // While the spec is loading, resolvedSpec is a placeholder without securitySchemes
        if (this.resolvedSpec?.securitySchemes) {
          const rapiDocApiKey = this.resolvedSpec.securitySchemes.find(
            (v: any) => v.securitySchemeId === rapidocApiKey,
          );
          if (!rapiDocApiKey) {
            this.resolvedSpec.securitySchemes.push({
              securitySchemeId: rapidocApiKey,
              description: "api-key provided in rapidoc element attributes",
              type: "apiKey",
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
    this.setAttribute("spec-url", (this.shadowRoot.getElementById("spec-url") as any).value);
  }

  /**
   * Programmatically loads a new OpenAPI specification. Accepts either a string URL or a valid
   * in-memory JSON/JavaScript spec object. The download and view buttons and the header's spec URL
   * box follow the spec loaded: its URL, or none for a spec object (the spec download buttons are
   * then hidden).
   * @public loadSpec(spec)
   */
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    // The spec (URL or object) of the latest load: a filter-operations change re-filters this one
    this._lastLoadedSpec = specUrl;
    // Each load gets a token; a load whose token is no longer current never applies its result
    const token = ++this._specLoadSeq;
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
        this.generateMissingTags === "true",
        this.sortTags === "true",
        this.sortSchemas === "true",
        this.getAttribute("sort-endpoints-by"),
        this.getAttribute("api-key-name"),
        this.getAttribute("api-key-location"),
        this.getAttribute("api-key-value"),
        this.getAttribute("server-url"),
        this.filterOperations,
      );
      if (token !== this._specLoadSeq) {
        return; // a newer load started while this one was parsing
      }
      this.loading = false;
      this.afterSpecParsedAndValidated(spec, token);
    } catch (err: any) {
      if (token !== this._specLoadSeq) {
        return;
      }
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`);
    }
  }

  /**
   * Programmatically supplies username and password credentials for an HTTP Basic security scheme
   * declared in the spec.
   * @public
   */
  setHttpUserNameAndPassword(securitySchemeId, username, password) {
    return applyApiKey.call(this, securitySchemeId, username, password);
  }

  /**
   * Programmatically provides the token or key for a declared API Key, Bearer Token or OAuth
   * security scheme. Optional <span class="mono fg-color">options.note</span> says where the key
   * came from (for example the reader's sign-in); the Authentication section shows it in place of
   * that scheme's form, with a link to open the form. Changing or removing the key drops the note.
   * @public setApiKey(securitySchemeId, token, options)
   */
  setApiKey(securitySchemeId, apiKeyValue, options: { note?: string } = {}) {
    return applyApiKey.call(this, securitySchemeId, "", "", apiKeyValue, options?.note || "");
  }

  /**
   * Removes every API key, token and credential set on the element.
   * @public
   */
  removeAllSecurityKeys() {
    return onClearAllApiKeys.call(this);
  }

  /**
   * Programmatically switches the active target API server URL.
   * @public
   */
  setApiServer(apiServerUrl) {
    // return apiServerUrl;
    return setApiServer.call(this, apiServerUrl);
  }

  async afterSpecParsedAndValidated(spec, token = this._specLoadSeq) {
    this.resolvedSpec = spec;
    this.selectedServer = undefined;
    if (this.defaultApiServerUrl) {
      if (this.defaultApiServerUrl === this.serverUrl) {
        this.selectedServer = {
          url: this.serverUrl,
          computedUrl: this.serverUrl,
        };
      } else if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers.find(
          (v: any) => v.url === this.defaultApiServerUrl,
        );
      }
    }
    if (!this.selectedServer) {
      if (this.resolvedSpec.servers) {
        this.selectedServer = this.resolvedSpec.servers[0];
      }
    }
    this.requestUpdate();

    while (!(await this.updateComplete));
    if (token !== this._specLoadSeq) {
      return; // a newer load took over while this one was rendering; it fires its own spec-loaded
    }
    const specLoadedEvent = new CustomEvent("spec-loaded", { detail: spec });
    this.dispatchEvent(specLoadedEvent);

    if (this.mockServer === "true") {
      enableMockServer(this.resolvedSpec, {
        owner: this,
        statusCode: this.mockServerStatusCode,
        statusStrategy: this.mockServerStatusStrategy,
        delay: this.mockServerDelay,
        log: this.mockServerLog,
      });
    }
  }

  // Called by anchor tags created using markdown
  handleHref(e) {
    if (e.target.tagName.toLowerCase() === "a") {
      if (e.target.getAttribute("href").startsWith("#")) {
        const gotoEl = this.shadowRoot.getElementById(
          e.target.getAttribute("href").replace("#", ""),
        );
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    }
  }
}
