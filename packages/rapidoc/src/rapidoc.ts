import { LitElement, noChange } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fixRenderedAnchorLinks } from '~/utils/markdown-utils';
import { marked } from 'marked';
import Slugger from 'github-slugger';
import { scheduleHighlight } from '~/utils/highlighter';

// Styles
import FontStyles from '~/styles/font-styles';
import InputStyles from '~/styles/input-styles';
import FlexStyles from '~/styles/flex-styles';
import AuthStyles from '~/styles/auth-styles';
import ParamListStyles from '~/styles/param-list-styles';
import EndpointStyles from '~/styles/endpoint-styles';
import MicrolighterStyles from '~/styles/microlighter-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';
import CustomStyles from '~/styles/custom-styles';
import DialogBoxStyles from '~/styles/dialog-box-styles';
import LayoutStyles from '~/styles/layout-styles';
import ThemeTokens, { applyCustomTheme, isValidHexColor, normalizeTheme } from '~/styles/theme-tokens';

import { advancedSearch, getMatchedPaths, getMatchedComponents, rapidocApiKey, sleep } from '~/utils/common-utils';
import ProcessSpec from '~/utils/spec-parser';
import { enableMockServer, disableMockServer, updateMockConfig } from '~/utils/mock-interceptor';
import mainBodyTemplate from '~/templates/main-body-template';
import { expandParentNavContainers } from '~/templates/navbar-template';
import { applyApiKey, onClearAllApiKeys } from '~/templates/security-scheme-template';
import { setApiServer } from '~/templates/server-template';
import { generateMcpServer as mcpServerGenerator, extractMcpOperations, estimateTokenCost, parseMcpTargets } from '~/utils/mcp-generator';
import { bindNavBar } from '~/utils/bind-navbar';
import { methodPathSlug } from '~/utils/slugger';
import { AutoColorSchemeController } from '~/utils/auto-color-scheme';

const paramsConverter = {
  fromAttribute: (attr) => {
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
  toAttribute: (prop) => {
    if (typeof prop === 'object' && prop !== null) {
      return JSON.stringify(prop);
    }
    return prop;
  },
};

@customElement('rapi-doc')
export default class RapiDoc extends LitElement {
  constructor() {
    super();
    this.showSummaryWhenCollapsed = true;
    this._intersectingElements = new Map();
    // Will activate intersection observer only after spec load and hash analyze
    // to scroll to the proper element without being reverted by observer behavior
    this.isIntersectionObserverActive = false;
    this._userSetLayout = false;
    this._isDefaultingLayout = false;
    this._observerLockTimeout = null;
    this._observerLockCleanup = null;
    this.initIntersectionObserver();
  }

  // Heading
  @property({ type: String, attribute: 'heading-text' }) headingText = '';
  @property({ type: String, attribute: 'goto-path' }) gotoPath = '';

  // Spec
  @property({ type: String, attribute: 'update-route' }) updateRoute = 'true';
  @property({ type: String, attribute: 'spec-url' }) specUrl = '';
  @property({ type: String, attribute: 'sort-tags' }) sortTags = 'false';
  @property({ type: String, attribute: 'sort-schemas' }) sortSchemas = 'false';
  @property({ type: String, attribute: 'generate-missing-tags' }) generateMissingTags = 'false';
  @property({ type: String, attribute: 'sort-endpoints-by' }) sortEndpointsBy = 'path';
  @property({ type: String, attribute: false }) specFile: any;

  // UI Layouts
  @property({ type: String, reflect: true }) layout = 'row';
  @property({ type: String, attribute: 'render-style' }) renderStyle = 'read';
  @property({ type: String, attribute: 'default-schema-tab' }) defaultSchemaTab = 'example';
  @property({ type: String, attribute: 'response-area-height' }) responseAreaHeight = '400px';
  @property({ type: String, attribute: 'fill-request-fields-with-example' }) fillRequestFieldsWithExample = 'true';
  @property({ type: String, attribute: 'persist-auth' }) persistAuth = 'false';

  // Schema Styles
  @property({ type: String, attribute: 'schema-style' }) schemaStyle = 'tree';
  @property({ type: Number, attribute: 'schema-expand-level' }) schemaExpandLevel = 99999;
  @property({ type: String, attribute: 'schema-description-expanded' }) schemaDescriptionExpanded = 'false';
  @property({ type: String, attribute: 'schema-hide-read-only' }) schemaHideReadOnly = 'true';
  @property({ type: String, attribute: 'schema-hide-write-only' }) schemaHideWriteOnly = 'true';

  // API Server
  @property({ type: String, attribute: 'api-key-name' }) apiKeyName = '';
  @property({ type: String, attribute: 'api-key-location' }) apiKeyLocation = 'header';
  @property({ type: String, attribute: 'api-key-value' }) apiKeyValue = '-';
  @property({ type: String, attribute: 'default-api-server' }) defaultApiServerUrl = '';
  @property({ type: String, attribute: 'server-url' }) serverUrl = '';
  @property({ type: String, attribute: 'oauth-receiver' }) oauthReceiver = 'oauth-receiver.html';
  @property({ type: Object, attribute: 'additional-authorize-params', converter: paramsConverter }) additionalAuthorizeParams: any;
  @property({ type: Object, attribute: 'additional-token-params', converter: paramsConverter }) additionalTokenParams: any;

  // Mock Server
  @property({ type: String, attribute: 'mock-server' }) mockServer = 'false';
  @property({ type: String, attribute: 'mock-server-status-code' }) mockServerStatusCode = '200';
  @property({ type: String, attribute: 'mock-server-status-strategy' }) mockServerStatusStrategy = 'example';
  @property({ type: Number, attribute: 'mock-server-delay' }) mockServerDelay = 0;
  @property({ type: String, attribute: 'mock-server-log' }) mockServerLog = 'false';

  // Hide/Show Sections & Enable Disable actions
  @property({ type: String, attribute: 'show-header' }) showHeader = 'true';
  @property({ type: String, attribute: 'show-side-nav' }) showSideNav = 'true';
  @property({ type: String, attribute: 'show-info' }) showInfo = 'true';
  @property({ type: String, attribute: 'allow-authentication' }) allowAuthentication = 'true';
  @property({ type: String, attribute: 'allow-try' }) allowTry = 'true';
  @property({ type: String, attribute: 'show-curl-before-try' }) showCurlBeforeTry = 'false';
  @property({ type: String, attribute: 'allow-spec-url-load' }) allowSpecUrlLoad = 'true';
  @property({ type: String, attribute: 'allow-spec-file-load' }) allowSpecFileLoad = 'true';
  @property({ type: String, attribute: 'allow-spec-file-download' }) allowSpecFileDownload = 'false';
  @property({ type: String, attribute: 'allow-search' }) allowSearch = 'true';
  @property({ type: String, attribute: 'allow-advanced-search' }) allowAdvancedSearch = 'true';
  @property({ type: String, attribute: 'allow-server-selection' }) allowServerSelection = 'true';
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' }) allowSchemaDescriptionExpandToggle = 'true';
  @property({ type: String, attribute: 'mcp' }) mcp = 'true';
  @property({ type: String, attribute: 'mcp-server-name' }) mcpServerName = '';
  @property({ type: String, attribute: 'show-components' }) showComponents = 'false';
  @property({ type: String, attribute: 'page-direction' }) pageDirection = 'ltr';
  @property({ type: String, attribute: 'scroll-behavior' }) scrollBehavior = 'smooth';
  @property({ type: String, attribute: 'auto-height' }) autoHeight = 'false';
  @property({ type: String, attribute: 'scroll-container' }) scrollContainer = '';
  @property({ type: String, attribute: 'scroll-offset' }) scrollOffset = '';

  // Main Colors and Font
  @property({ type: String, reflect: true }) theme = 'amber';
  @property({ type: String, attribute: 'primary-color' }) primaryColor = '';
  @property({ type: String, attribute: 'color-scheme', reflect: true }) colorScheme = 'dark';
  // color-scheme="auto": follows the page's theme (see utils/auto-color-scheme.js)
  _autoColorScheme = new AutoColorSchemeController(this);
  @property({ type: String, reflect: true }) radius = 'sm';
  @property({ type: String, reflect: true }) scale = 'default';
  @property({ type: String, attribute: 'css-file' }) cssFile = '';
  @property({ type: String, attribute: 'css-classes' }) cssClasses = '';

  // Nav Bar
  @property({ type: String, attribute: 'nav-item-spacing', reflect: true }) navItemSpacing = 'default';
  @property({ type: String, attribute: 'nav-item-overflow', reflect: true }) navItemOverflow = 'ellipsis';
  @property({ type: String, attribute: 'show-method-in-nav-bar' }) showMethodInNavBar = 'false';
  @property({ type: String, attribute: 'use-path-in-nav-bar' }) usePathInNavBar = 'false';
  @property({ type: String, attribute: 'info-description-headings-in-navbar' }) infoDescriptionHeadingsInNavBar = 'false';

  // Fetch Options
  @property({ type: String, attribute: 'fetch-credentials' }) fetchCredentials = '';

  // Filters
  @property({ type: String, attribute: 'match-paths' }) matchPaths = '';
  @property({ type: String, attribute: 'match-type' }) matchType = 'includes';
  @property({ type: String, attribute: 'remove-endpoints-with-badge-label-as' }) removeEndpointsWithBadgeLabelAs = '';

  // Internal Properties
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) focusedElementId = '';
  @property({ type: Object }) advancedSearchMatches: any;
  @property({ type: String }) searchVal = '';

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
      DialogBoxStyles,
      LayoutStyles,
      CustomStyles,
    ];
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    this.initIntersectionObserver();
    if (this.shadowRoot && this.shadowRoot.querySelector('.main-content')) {
      this._hasDsd = true;
    }
    const parent = this.parentElement;
    if (parent && parent.tagName === 'BODY') {
      if (parent.offsetWidth === 0 && parent.style.width === '') {
        parent.style.width = '100vw';
      }
      if (parent.offsetHeight === 0 && parent.style.height === '') {
        parent.style.height = '100vh';
      }
      if (!parent.style.marginTop) {
        parent.style.marginTop = '0';
      }
      if (!parent.style.marginRight) {
        parent.style.marginRight = '0';
      }
      if (!parent.style.marginBottom) {
        parent.style.marginBottom = '0';
      }
      if (!parent.style.marginLeft) {
        parent.style.marginLeft = '0';
      }
    }

    if (!this.renderStyle || !'read, view, focused,'.includes(`${this.renderStyle},`)) {
      this.renderStyle = 'focused';
    }

    if (this.hasAttribute('layout')) {
      const attrLayout = this.getAttribute('layout');
      if ('row, column,'.includes(`${attrLayout},`)) {
        this.layout = attrLayout;
        this._userSetLayout = true;
      }
    }

    if (!this._userSetLayout) {
      const defaultLayout = this.renderStyle === 'read' || this.renderStyle === 'focused' ? 'column' : 'row';
      this._isDefaultingLayout = true;
      this.layout = defaultLayout;
      this.setAttribute('layout', defaultLayout);
      this._isDefaultingLayout = false;
    } else if (!this.layout || !'row, column,'.includes(`${this.layout},`)) {
      this.layout = this.renderStyle === 'read' || this.renderStyle === 'focused' ? 'column' : 'row';
      this.setAttribute('layout', this.layout);
    }
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) {
      this.schemaStyle = 'tree';
    }
    if (this.theme === 'light' || this.theme === 'dark') {
      this.colorScheme = this.theme;
      this.theme = 'amber';
    }
    if (this.primaryColor && isValidHexColor(this.primaryColor)) {
      this.theme = this.primaryColor;
    }
    const normalizedTheme = normalizeTheme(this.theme);
    this.theme = normalizedTheme.theme;
    this.setAttribute('theme', this.theme);
    if (!this.colorScheme || !'dark, light, system,'.includes(`${this.colorScheme},`)) {
      this.colorScheme = 'dark';
    }
    if (!this.radius || !'none, sm, md, lg, full,'.includes(`${this.radius},`)) {
      this.radius = 'sm';
    }
    if (!this.scale || !'sm, default, lg,'.includes(`${this.scale},`)) {
      this.scale = 'default';
    }
    if (!this.navItemSpacing || !'compact, default, relaxed,'.includes(`${this.navItemSpacing},`)) {
      this.navItemSpacing = 'default';
    }
    if (!this.getAttribute('theme')) {
      this.setAttribute('theme', this.theme);
    }
    if (!this.getAttribute('color-scheme')) {
      this.setAttribute('color-scheme', this.colorScheme);
    }
    if (!this.getAttribute('radius')) {
      this.setAttribute('radius', this.radius);
    }
    if (!this.getAttribute('scale')) {
      this.setAttribute('scale', this.scale);
    }
    applyCustomTheme(this, this.theme);
    if (!this.defaultSchemaTab || !'example, schema, model,'.includes(`${this.defaultSchemaTab},`)) {
      this.defaultSchemaTab = 'example';
    } else if (this.defaultSchemaTab === 'model') {
      this.defaultSchemaTab = 'schema';
    }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) {
      this.schemaDescriptionExpanded = 'false';
    }

    if (!this.schemaHideReadOnly || !'default, never,'.includes(`${this.schemaHideReadOnly},`)) {
      this.schemaHideReadOnly = 'default';
    }
    if (!this.schemaHideWriteOnly || !'default, never,'.includes(`${this.schemaHideWriteOnly},`)) {
      this.schemaHideWriteOnly = 'default';
    }

    if (!this.fillRequestFieldsWithExample || !'true, false,'.includes(`${this.fillRequestFieldsWithExample},`)) {
      this.fillRequestFieldsWithExample = 'true';
    }
    if (!this.persistAuth || !'true, false,'.includes(`${this.persistAuth},`)) {
      this.persistAuth = 'false';
    }
    if (!this.responseAreaHeight) {
      this.responseAreaHeight = '400px';
    }

    if (!this.allowSearch || !'true, false,'.includes(`${this.allowSearch},`)) {
      this.allowSearch = 'true';
    }
    if (!this.allowAdvancedSearch || !'true, false,'.includes(`${this.allowAdvancedSearch},`)) {
      this.allowAdvancedSearch = 'true';
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
    if (!this.updateRoute || !'true, false,'.includes(`${this.updateRoute},`)) {
      this.updateRoute = 'true';
    }
    if (!this.sortTags || !'true, false,'.includes(`${this.sortTags},`)) {
      this.sortTags = 'false';
    }
    if (!this.sortSchemas || !'true, false,'.includes(`${this.sortSchemas},`)) {
      this.sortSchemas = 'false';
    }
    if (!this.generateMissingTags || !'true, false,'.includes(`${this.generateMissingTags},`)) {
      this.generateMissingTags = 'false';
    }
    if (!this.sortEndpointsBy || !'method, path, summary, none,'.includes(`${this.sortEndpointsBy},`)) {
      this.sortEndpointsBy = 'path';
    }

    if (!this.navItemSpacing || !'compact, relaxed, default,'.includes(`${this.navItemSpacing},`)) {
      this.navItemSpacing = 'default';
    }
    if (!this.showMethodInNavBar || !'false, as-plain-text, as-colored-text, as-colored-block,'.includes(`${this.showMethodInNavBar},`)) {
      this.showMethodInNavBar = 'false';
    }
    if (!this.usePathInNavBar || !'true, false,'.includes(`${this.usePathInNavBar},`)) {
      this.usePathInNavBar = 'false';
    }
    if (!this.navItemOverflow || !'ellipsis, wrap,'.includes(`${this.navItemOverflow},`)) {
      this.navItemOverflow = 'ellipsis';
    }
    this.getAttribute('nav-item-overflow') || this.setAttribute('nav-item-overflow', this.navItemOverflow);
    if (!this.showInfo || !'true, false,'.includes(`${this.showInfo},`)) {
      this.showInfo = 'true';
    }
    if (!this.allowServerSelection || !'true, false,'.includes(`${this.allowServerSelection},`)) {
      this.allowServerSelection = 'true';
    }
    if (!this.allowAuthentication || !'true, false,'.includes(`${this.allowAuthentication},`)) {
      this.allowAuthentication = 'true';
    }
    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) {
      this.allowSchemaDescriptionExpandToggle = 'true';
    }

    if (!this.showSideNav || !'true false'.includes(this.showSideNav)) {
      this.showSideNav = 'true';
    }
    if (!this.showComponents || !'true false'.includes(this.showComponents)) {
      this.showComponents = 'false';
    }
    if (!this.infoDescriptionHeadingsInNavBar || !'true, false,'.includes(`${this.infoDescriptionHeadingsInNavBar},`)) {
      this.infoDescriptionHeadingsInNavBar = 'false';
    }
    if (!this.fetchCredentials || !'omit, same-origin, include,'.includes(`${this.fetchCredentials},`)) {
      this.fetchCredentials = '';
    }
    if (!this.scrollBehavior || !'smooth, auto,'.includes(`${this.scrollBehavior},`)) {
      this.scrollBehavior = 'auto';
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
    if (!this.cssFile) {
      this.cssFile = null;
    }
    if (!this.cssClasses) {
      this.cssClasses = '';
    }
    if (!this.mcp) {
      this.mcp = 'none';
    }

    window.addEventListener(
      'hashchange',
      () => {
        this.scrollToPath(this.getElementIDFromURL());
      },
      true
    );

    // Auto-hydrate from inlined spec or spec-url attribute if not already loaded
    if (!this.resolvedSpec) {
      const inlinedSpecEl = this.querySelector('script[type="application/json"][slot="rapidoc-spec"]');
      if (inlinedSpecEl?.textContent) {
        try {
          const parsed = JSON.parse(inlinedSpecEl.textContent);
          this.loadSpec(parsed);
        } catch {
          // ignore parse error
        }
      } else if (this.getAttribute('spec-url')) {
        this.loadSpec(this.getAttribute('spec-url'));
      }
    }
  }

  // Cleanup
  disconnectedCallback() {
    if (this._intersectionRaf) {
      cancelAnimationFrame(this._intersectionRaf);
    }
    if (typeof this._observerLockCleanup === 'function') {
      this._observerLockCleanup();
      this._observerLockCleanup = null;
    }
    if (this._observerLockTimeout) {
      clearTimeout(this._observerLockTimeout);
      this._observerLockTimeout = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.mockServer === 'true') {
      disableMockServer();
    }
    super.disconnectedCallback();
  }

  infoDescriptionHeadingRenderer() {
    const renderer = new marked.Renderer();
    const slugger = new Slugger();
    renderer.heading = ({ text, depth }) => `<h${depth} class="observe-me" id="${slugger.slug(text)}">${text}</h${depth}>`;
    fixRenderedAnchorLinks(renderer);
    return renderer;
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    if (this.defaultSchemaTab === 'model') {
      this.defaultSchemaTab = 'schema';
    }
    if (changedProperties.has('layout') && !this._isDefaultingLayout) {
      this._userSetLayout = Boolean(this.layout && 'row, column,'.includes(`${this.layout},`));
    }
    if (changedProperties.has('renderStyle') && !this._userSetLayout) {
      const targetLayout = this.renderStyle === 'read' || this.renderStyle === 'focused' ? 'column' : 'row';
      if (this.layout !== targetLayout) {
        this._isDefaultingLayout = true;
        this.layout = targetLayout;
        this.setAttribute('layout', targetLayout);
        this._isDefaultingLayout = false;
      }
    }
  }

  _clearDsdIfNeeded() {
    if (this._hasDsd && this.shadowRoot) {
      this.shadowRoot.replaceChildren();
      if (this.renderOptions) {
        delete this.renderOptions.renderBefore;
      }
      this._hasDsd = false;
    }
  }

  render() {
    if (this._hasDsd && !this.resolvedSpec) {
      return noChange;
    }
    this._clearDsdIfNeeded();

    // return render(mainBodyTemplate(this), this.shadowRoot, { eventContext: this });
    const cssLinkEl = document.querySelector(`link[href*="${this.cssFile}"]`);
    // adding custom style for RapiDoc
    if (cssLinkEl) {
      this.shadowRoot.appendChild(cssLinkEl.cloneNode());
    }
    return mainBodyTemplate.call(this);
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

    if (changedProperties.has('theme')) {
      if (this.theme === 'light' || this.theme === 'dark') {
        this.colorScheme = this.theme;
        this.setAttribute('color-scheme', this.colorScheme);
        this.theme = 'amber';
        this.setAttribute('theme', 'amber');
      }
      const normalizedTheme = normalizeTheme(this.theme);
      if (this.theme !== normalizedTheme.theme) {
        this.theme = normalizedTheme.theme;
        this.setAttribute('theme', this.theme);
      }
      applyCustomTheme(this, this.theme);
    }

    if (changedProperties.has('primaryColor') && this.primaryColor && isValidHexColor(this.primaryColor)) {
      this.theme = normalizeTheme(this.primaryColor).theme;
      this.setAttribute('theme', this.theme);
      applyCustomTheme(this, this.theme);
    }

    if (changedProperties.has('colorScheme')) {
      if (!this.colorScheme || !'dark, light, system,'.includes(`${this.colorScheme},`)) {
        this.colorScheme = 'dark';
      }
      if (this.getAttribute('color-scheme') !== this.colorScheme) {
        this.setAttribute('color-scheme', this.colorScheme);
      }
    }

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
    if (changedProperties.has('scrollContainer')) {
      this.initIntersectionObserver();
    }
  }

  observeExpandedContent() {
    // Main Container
    const observeOverviewEls = this.shadowRoot.querySelectorAll('.observe-me');
    observeOverviewEls.forEach((targetEl) => {
      this.intersectionObserver.observe(targetEl);
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          await this.loadSpec(newVal);
          // If goto-path is provided and no location-hash is present then try to scroll there
          if (this.gotoPath && !window.location.hash) {
            this.scrollToPath(this.gotoPath);
          }
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
    if (name === 'scroll-offset' && oldVal !== newVal) {
      window.setTimeout(() => this.initIntersectionObserver(), 0);
    }
    if (name === 'layout') {
      if (!this._isDefaultingLayout) {
        if (newVal !== null && 'row, column,'.includes(`${newVal},`)) {
          this._userSetLayout = true;
          this.layout = newVal;
        } else if (newVal === null) {
          this._userSetLayout = false;
          const defaultLayout = this.renderStyle === 'read' || this.renderStyle === 'focused' ? 'column' : 'row';
          this._isDefaultingLayout = true;
          this.layout = defaultLayout;
          this.setAttribute('layout', defaultLayout);
          this._isDefaultingLayout = false;
        }
      }
    }
    if (name === 'render-style') {
      if (newVal === 'read') {
        window.setTimeout(() => {
          this.observeExpandedContent();
        }, 100);
      } else {
        this.intersectionObserver.disconnect();
      }
      if (!this._userSetLayout) {
        const defaultLayout = newVal === 'read' || newVal === 'focused' ? 'column' : 'row';
        this._isDefaultingLayout = true;
        this.layout = defaultLayout;
        this.setAttribute('layout', defaultLayout);
        this._isDefaultingLayout = false;
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
        // While the spec is loading, resolvedSpec is a placeholder without securitySchemes
        if (this.resolvedSpec?.securitySchemes) {
          const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => v.securitySchemeId === rapidocApiKey);
          if (!rapiDocApiKey) {
            this.resolvedSpec.securitySchemes.push({
              securitySchemeId: rapidocApiKey,
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

  onSpecFileChange(e) {
    this.setAttribute('spec-file', this.shadowRoot.getElementById('spec-file').value);
    const specFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const specObj = JSON.parse(reader.result);
        this.loadSpec(specObj);
        this.shadowRoot.getElementById('spec-url').value = '';
      } catch {
        console.error('RapiDoc: Unable to read or parse json');
      }
    };
    // Read the Text file
    reader.readAsText(specFile);
  }

  onFileLoadClick() {
    this.shadowRoot.getElementById('spec-file').click();
  }

  onSearchChange(e) {
    // The event may come from the ↩ icon (a div without `value`): read the nav-bar input instead
    const input = e.target instanceof HTMLInputElement ? e.target : this.shadowRoot.getElementById('nav-bar-search');
    this.searchVal = input?.value ?? '';
    this.resolvedSpec.tags.forEach((tag) =>
      tag.paths.filter((path) => {
        if (this.searchVal) {
          if (getMatchedPaths(this.searchVal, path, tag.name)) {
            tag.expanded = true;
          }
        }
      })
    );
    this.resolvedSpec.components.forEach((component) =>
      component.subComponents.filter((v) => {
        v.expanded = false;
        if (getMatchedComponents(this.searchVal, v)) {
          v.expanded = true;
        }
      })
    );
    this.requestUpdate();
  }

  onClearSearch() {
    const searchEl = this.shadowRoot.getElementById('nav-bar-search');
    searchEl.value = '';
    this.searchVal = '';
    this.resolvedSpec.components.forEach((component) =>
      component.subComponents.filter((v) => {
        v.expanded = true;
      })
    );
  }

  onOpenNavBarToggle() {
    const navBarEL = this.shadowRoot.getElementById('nav-bar');
    navBarEL.classList.toggle('floating-nav');
  }

  onShowAdvancedSearchClicked() {
    this.shadowRoot.getElementById('advanced-search-dialog').showModal();
  }
  onAdvancedSearchClose() {
    this.shadowRoot.getElementById('advanced-search-dialog').close();
  }

  // Public Method
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    this.searchVal = '';
    try {
      if (!this._hasDsd) {
        this.resolvedSpec = {
          specLoadError: false,
          isSpecLoading: true,
          tags: [],
        };
        this.loading = true;
      }
      this.loadFailed = false;
      const spec = await ProcessSpec.call(
        this,
        specUrl,
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
      this._clearDsdIfNeeded();
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`);
    }
  }

  async afterSpecParsedAndValidated(spec) {
    this._clearDsdIfNeeded();
    this.resolvedSpec = spec;
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

    // Initiate IntersectionObserver and put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    if (this._intersectingElements) {
      this._intersectingElements.clear();
    }
    if (this.renderStyle === 'read') {
      await sleep(100);
      this.observeExpandedContent(); // This will auto-highlight the selected nav-item in read-mode
    }

    this.isIntersectionObserverActive = true;

    // On first time Spec load, try to navigate to location hash if provided
    const elementId = this.getElementIDFromURL();

    if (elementId) {
      if (this.renderStyle === 'view') {
        this.expandAndGotoOperation(elementId, true, true);
      } else {
        this.scrollToPath(elementId);
      }
    } else if (this.gotoPath) {
      this.scrollToPath(this.gotoPath);
    } else if (this.renderStyle === 'focused') {
      // If goto-path is provided and no location-hash is present then try to scroll to default element
      if (!this.gotoPath) {
        const defaultElementId = this.showInfo === 'true' ? 'overview' : this.resolvedSpec.tags[0]?.paths[0]?.elementId;
        if (defaultElementId) {
          this.scrollToPath(defaultElementId);
        }
      }
    }
  }

  /**
   * Return the URL from where is served the RapiDoc component, removing any hash
   */
  getComponentBaseURL() {
    return window.location.href.split('#')[0];
  }

  /**
   * From the URL return the ID of the element from the location hash
   */
  getElementIDFromURL() {
    return window.location.hash ? window.location.hash.substring(1) : '';
  }

  replaceHistoryState(hashId) {
    const baseURL = this.getComponentBaseURL();
    window.history.replaceState(null, null, hashId ? `${baseURL}#${hashId}` : baseURL);
  }

  expandAndGotoOperation(elementId, scrollToElement = true) {
    if (!this.resolvedSpec) {
      return;
    }
    // Expand full operation and tag
    let isExpandingNeeded = true;
    const tmpElementId = elementId.indexOf('#') === -1 ? elementId : elementId.substring(1);
    if (tmpElementId.startsWith('overview') || tmpElementId === 'servers' || tmpElementId === 'auth') {
      isExpandingNeeded = false;
    } else {
      for (let i = 0; i < this.resolvedSpec.tags?.length; i++) {
        const tag = this.resolvedSpec.tags[i];
        const path = tag.paths?.find((p) => p.elementId === elementId);
        if (path) {
          if (path.expanded && tag.expanded) {
            isExpandingNeeded = false;
          } else {
            path.expanded = true;
            tag.expanded = true;
          }
        }
      }
      if (this.resolvedSpec.tagGroups) {
        for (let g = 0; g < this.resolvedSpec.tagGroups.length; g++) {
          const group = this.resolvedSpec.tagGroups[g];
          const hasPath = group.tags?.some((t) => t.paths?.some((p) => p.elementId === elementId));
          if (hasPath && !group.expanded) {
            group.expanded = true;
            isExpandingNeeded = true;
          }
        }
      }
    }
    if (scrollToElement) {
      // requestUpdate() and delay required, else we cant find element
      if (isExpandingNeeded) {
        this.requestUpdate();
      }
      window.setTimeout(
        () => {
          const firstNavEl = this.shadowRoot.querySelector('.first-nav-item');
          const isFirst = firstNavEl && firstNavEl.dataset.contentId === tmpElementId;
          const gotoEl = this.shadowRoot.getElementById(tmpElementId);
          if (gotoEl) {
            const mainContentEl = this.shadowRoot.querySelector('.main-content');
            let targetTop: number;
            if (this.autoHeight === 'true') {
              this.scrollAutoHeightTarget(gotoEl, tmpElementId);
            } else if (isFirst) {
              targetTop = 0;
              this.lockObserverDuringScroll(gotoEl, tmpElementId, targetTop);
              if (mainContentEl) {
                mainContentEl.scrollTo({ top: 0, behavior: this.scrollBehavior });
              } else {
                gotoEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'start' });
              }
            } else if (mainContentEl) {
              const containerRect = mainContentEl.getBoundingClientRect();
              const targetRect = gotoEl.getBoundingClientRect();
              targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
              this.lockObserverDuringScroll(gotoEl, tmpElementId, targetTop);
              mainContentEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
            } else {
              this.lockObserverDuringScroll(gotoEl, tmpElementId);
              gotoEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'start' });
            }
            this._activeElementId = tmpElementId;
            this.dispatchEvent(
              new CustomEvent('nav-active-change', {
                detail: {
                  id: tmpElementId,
                  elementId: tmpElementId,
                },
                bubbles: true,
                composed: true,
              })
            );
            if (this.updateRoute === 'true') {
              this.replaceHistoryState(tmpElementId);
            }
          }
        },
        isExpandingNeeded ? 150 : 0
      );
    }
  }

  isValidTopId(id) {
    return id.startsWith('overview') || id === 'servers' || id === 'auth';
  }

  isValidPathId(id) {
    if (id === 'overview' && this.showInfo) {
      return true;
    }
    if (id === 'servers' && this.allowServerSelection) {
      return true;
    }
    if (id === 'auth' && this.allowAuthentication) {
      return true;
    }
    if (id.startsWith('tag--')) {
      return this.resolvedSpec?.tags?.find((tag) => tag.elementId === id);
    }
    return this.resolvedSpec?.tags?.find((tag) => tag.paths.find((path) => path.elementId === id));
  }

  initIntersectionObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    let container = null;
    if (this.scrollContainer && typeof document !== 'undefined') {
      try {
        container = document.querySelector(this.scrollContainer);
        const isAncestor = Boolean(
          container &&
          (container.contains(this) ||
            (this.assignedSlot && container.contains(this.assignedSlot)) ||
            (container.shadowRoot && container.shadowRoot.contains(this.assignedSlot)))
        );
        if (container && !isAncestor) {
          // If the specified element is not an ancestor of <rapi-doc>, IntersectionObserver cannot observe inside it
          console.warn(
            `RapiDoc: The element specified by scroll-container ("${this.scrollContainer}") is not an ancestor of <rapi-doc>. Falling back to auto-detection.`
          );
          container = null;
        }
      } catch {
        // Ignore invalid query selector
      }
    }
    if (!container && typeof window !== 'undefined') {
      let parent: any = this.assignedSlot ? this.assignedSlot.parentElement : this.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          container = parent;
          break;
        }
        parent =
          parent.parentElement ||
          (parent.getRootNode && parent.getRootNode() instanceof ShadowRoot ? (parent.getRootNode() as ShadowRoot).host : null);
      }
    }
    this._scrollRootContainer = container;
    const intersectionObserverOptions = {
      root: container,
      // Headings that slide under a sticky page header (getScrollOffset) count as scrolled past.
      rootMargin: `-${this.getScrollOffset()}px 0px -50% 0px`,
      threshold: 0,
    };
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.onIntersect(entries);
    }, intersectionObserverOptions);
    if (this.isIntersectionObserverActive) {
      this.observeExpandedContent();
    }
  }

  onIntersect(entries) {
    if (this.isIntersectionObserverActive === false) {
      return;
    }

    if (!this._intersectingElements) {
      this._intersectingElements = new Map();
    }

    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        this._intersectingElements.set(entry.target.id, entry.target);
      } else {
        this._intersectingElements.delete(entry.target.id);
      }
    }

    if (this._intersectingElements.size === 0) {
      return;
    }

    const activeCandidates = Array.from(this._intersectingElements.values()).filter((el) => el.isConnected);
    if (activeCandidates.length === 0) {
      return;
    }

    const containerTop = (this._scrollRootContainer ? this._scrollRootContainer.getBoundingClientRect().top : 0) + this.getScrollOffset();
    const visibleHeadings = [];
    const scrolledPast = [];

    for (const el of activeCandidates) {
      const top = el.getBoundingClientRect().top - containerTop;
      if (top >= 0) {
        visibleHeadings.push({ el, top });
      } else {
        scrolledPast.push({ el, top });
      }
    }

    let bestEl;
    if (visibleHeadings.length > 0) {
      // Preference to the topmost heading visible in the viewport/reading zone
      visibleHeadings.sort((a, b) => a.top - b.top);
      bestEl = visibleHeadings[0].el;
    } else {
      // If all visible candidates have their headings scrolled past top (< 0),
      // pick the one whose top is closest to 0 (the section currently filling the reading area)
      scrolledPast.sort((a, b) => b.top - a.top);
      bestEl = scrolledPast[0].el;
    }

    const targetId = bestEl.id;
    if (this._activeElementId === targetId) {
      return;
    }
    this._activeElementId = targetId;

    if (this._intersectionRaf) {
      cancelAnimationFrame(this._intersectionRaf);
    }

    this._intersectionRaf = requestAnimationFrame(() => {
      // 1. Dispatch custom event so outer portals/host apps can sync active state
      let resolvedOperationId = targetId;
      if (targetId.startsWith('tag--') && this.resolvedSpec?.tags) {
        const matchingTag = this.resolvedSpec.tags.find((t) => t.elementId === targetId);
        if (matchingTag?.paths?.[0]?.elementId) {
          resolvedOperationId = matchingTag.paths[0].elementId;
        }
      }

      this.dispatchEvent(
        new CustomEvent('nav-active-change', {
          detail: {
            id: targetId,
            elementId: targetId,
            operationId: resolvedOperationId,
          },
          bubbles: true,
          composed: true,
        })
      );

      if (this.updateRoute === 'true') {
        this.replaceHistoryState(targetId);
      }

      // 2. If internal navbar is active (show-side-nav="true"), update Shadow DOM elements
      const newNavEl = this.shadowRoot.getElementById(`link-${targetId}`);
      if (newNavEl) {
        const oldNavEl = this.shadowRoot.querySelector(
          '.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active'
        );

        if (oldNavEl && oldNavEl !== newNavEl) {
          oldNavEl.classList.remove('active');
          oldNavEl.part.remove('section-navbar-active-item');
        }

        expandParentNavContainers(newNavEl);
        newNavEl.classList.add('active');
        newNavEl.part.add('section-navbar-active-item');

        // Scroll sidebar only if the active item is out of view
        const navScrollEl = newNavEl.closest('.nav-scroll');
        if (navScrollEl) {
          const headerEl = navScrollEl.querySelector('.nav-bar-header') || navScrollEl.querySelector('.nav-bar-search-container');
          const topOffset = headerEl ? headerEl.offsetHeight : 0;

          if (newNavEl.offsetTop <= topOffset + 30) {
            if (navScrollEl.scrollTop > 0) {
              const behavior = this.scrollBehavior === 'auto' ? 'auto' : 'smooth';
              navScrollEl.scrollTo({ top: 0, behavior });
            }
          } else {
            const scrollRect = navScrollEl.getBoundingClientRect();
            const itemRect = newNavEl.getBoundingClientRect();
            const isOutOfView = itemRect.top < scrollRect.top + topOffset + 15 || itemRect.bottom > scrollRect.bottom - 40;
            if (isOutOfView) {
              const behavior = this.scrollBehavior === 'auto' ? 'auto' : 'smooth';
              // Land the item below the sticky search header (which sits inside the scroll area), not under it
              const targetTop = itemRect.top - scrollRect.top + navScrollEl.scrollTop - topOffset - 20;
              navScrollEl.scrollTo({ top: targetTop, behavior });
            }
          }
        }
      }
    });
  }

  // Called by anchor tags created using markdown
  handleHref(e) {
    if (e.target.tagName.toLowerCase() === 'a') {
      if (e.target.getAttribute('href').startsWith('#')) {
        const gotoEl = this.shadowRoot.getElementById(e.target.getAttribute('href').replace('#', ''));
        if (gotoEl) {
          const mainContentEl = this.shadowRoot.querySelector('.main-content');
          if (this.autoHeight === 'true' || this.hasAttribute('auto-height')) {
            this.scrollAutoHeightTarget(gotoEl, gotoEl.id);
          } else if (mainContentEl) {
            const containerRect = mainContentEl.getBoundingClientRect();
            const targetRect = gotoEl.getBoundingClientRect();
            const targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
            mainContentEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
          } else {
            gotoEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'start' });
          }
        }
      }
    }
  }

  /**
   * Height of the area at the top of the scroll root that sticky or fixed page headers cover, in px.
   * Only applies with auto-height, where the page (or `scroll-container`) scrolls instead of RapiDoc.
   * Uses the `scroll-offset` attribute when set, otherwise the scroll root's `scroll-padding-top`,
   * so pages that already reserve space for their header need no extra configuration.
   */
  getScrollOffset(): number {
    if (!(this.autoHeight === 'true' || this.hasAttribute('auto-height')) || typeof window === 'undefined') {
      return 0;
    }
    const explicit = parseFloat(this.scrollOffset);
    if (Number.isFinite(explicit)) {
      return explicit;
    }
    const root: HTMLElement = this._scrollRootContainer || (document.scrollingElement as HTMLElement) || document.documentElement;
    const padding = getComputedStyle(root).scrollPaddingTop;
    const value = parseFloat(padding);
    if (!Number.isFinite(value)) {
      return 0;
    }
    return padding.endsWith('%') ? (value / 100) * root.clientHeight : value;
  }

  /**
   * auto-height: scrolls the page, or the `scroll-container`, so that `targetEl` starts just below
   * the area covered by sticky headers (see getScrollOffset).
   */
  scrollAutoHeightTarget(targetEl: HTMLElement, targetId: string) {
    const top = targetEl.getBoundingClientRect().top - this.getScrollOffset();
    const container = this._scrollRootContainer;
    if (container) {
      const targetTop = top - container.getBoundingClientRect().top + container.scrollTop;
      this.lockObserverDuringScroll(targetEl, targetId, targetTop);
      container.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
    } else {
      const targetTop = top + window.scrollY;
      this.lockObserverDuringScroll(targetEl, targetId, targetTop);
      window.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
    }
  }

  /**
   * Temporarily deactivates the IntersectionObserver during navigation/programmatic scrolling,
   * preventing intermediate elements from hijacking the active navbar item while smooth scrolling.
   * Re-activates the observer once scrolling finishes (via 'scrollend', debounced scroll fallback, or safety timeout).
   *
   * @param {HTMLElement | null} targetEl - The element being scrolled to
   * @param {string} targetId - Element / operation identifier
   * @param {number} [targetTop] - Target scroll offset if known
   */
  lockObserverDuringScroll(targetEl: HTMLElement | null, targetId: string = '', targetTop?: number) {
    if (this._intersectionRaf) {
      cancelAnimationFrame(this._intersectionRaf);
      this._intersectionRaf = null;
    }

    if (typeof this._observerLockCleanup === 'function') {
      this._observerLockCleanup();
      this._observerLockCleanup = null;
    }
    if (this._observerLockTimeout) {
      clearTimeout(this._observerLockTimeout);
      this._observerLockTimeout = null;
    }

    // onIntersect tracks elements by their DOM id; targetId can be a shorter slug of the same element
    // (e.g. "get-route-estimate" for "route-planning--get-route-estimate"). Keying by the slug would leave
    // an entry the observer never removes, pinning the active item to this element.
    const observedId = targetEl?.id || targetId;
    this.isIntersectionObserverActive = false;
    if (this._intersectingElements) {
      this._intersectingElements.clear();
      if (targetEl && observedId) {
        this._intersectingElements.set(observedId, targetEl);
      }
    }
    if (observedId) {
      this._activeElementId = observedId;
    }

    const isAutoHeight = this.autoHeight === 'true' || this.hasAttribute('auto-height');
    const scrollContainer: any = isAutoHeight
      ? this._scrollRootContainer || (typeof window !== 'undefined' ? window : null)
      : this.shadowRoot?.querySelector('.main-content') || (typeof window !== 'undefined' ? window : null);

    if (!scrollContainer || typeof window === 'undefined') {
      this.isIntersectionObserverActive = true;
      return;
    }

    let isUnlocked = false;
    const unlock = () => {
      if (isUnlocked) return;
      isUnlocked = true;
      if (cleanup) {
        cleanup();
        cleanup = null;
        this._observerLockCleanup = null;
      }
      if (this._observerLockTimeout) {
        clearTimeout(this._observerLockTimeout);
        this._observerLockTimeout = null;
      }

      if (targetEl && observedId && this._intersectingElements) {
        this._intersectingElements.set(observedId, targetEl);
      }
      this.isIntersectionObserverActive = true;
    };

    let debounceTimer: any = null;
    const onScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(unlock, 120);
    };

    const onScrollEnd = () => {
      unlock();
    };

    let cleanup: any = () => {
      scrollContainer.removeEventListener?.('scrollend', onScrollEnd);
      window.removeEventListener?.('scrollend', onScrollEnd);
      scrollContainer.removeEventListener?.('scroll', onScroll);
      window.removeEventListener?.('scroll', onScroll);
      clearTimeout(debounceTimer);
    };
    this._observerLockCleanup = cleanup;

    if ('onscrollend' in window) {
      scrollContainer.addEventListener?.('scrollend', onScrollEnd, { once: true, passive: true });
      window.addEventListener?.('scrollend', onScrollEnd, { once: true, passive: true });
    }
    scrollContainer.addEventListener?.('scroll', onScroll, { passive: true });
    window.addEventListener?.('scroll', onScroll, { passive: true });

    const currentScrollTop = scrollContainer === window ? window.scrollY : scrollContainer.scrollTop || 0;
    const isZeroDistance = typeof targetTop === 'number' && Math.abs(targetTop - currentScrollTop) < 3;
    const maxSafetyDelay = isZeroDistance ? 60 : this.scrollBehavior === 'auto' ? 100 : 1200;
    this._observerLockTimeout = setTimeout(unlock, maxSafetyDelay);
  }

  /**
   * Called by
   *  - onClick of Navigation Bar
   *  - onClick of Advanced Search items
   *
   * Functionality:
   *  1. First deactivate IntersectionObserver
   *  2. Scroll to the element
   *  3. Activate IntersectionObserver (after scroll completes)
   */
  async scrollToEventTarget(event, scrollNavItemToView = true) {
    if (!(event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13))) {
      return;
    }
    const navEl = ((event.target as HTMLElement)?.closest?.('[data-content-id]') || event.target) as HTMLElement;
    if (!navEl?.dataset?.contentId) {
      return;
    }
    if (this.renderStyle === 'focused') {
      const requestEl = this.shadowRoot.querySelector('api-request');
      if (typeof requestEl?.beforeNavigationFocusedMode === 'function') {
        requestEl.beforeNavigationFocusedMode();
      }
    }
    const isFirstNavItem = navEl.dataset.firstNavItem === 'true';
    this.scrollToPath(navEl.dataset.contentId, true, scrollNavItemToView, isFirstNavItem);
  }

  // Public Method - Returns the DOM element in ShadowRoot matching elementId, operationId, or slug
  getTargetElement(elementId: string): HTMLElement | null {
    if (!elementId || !this.shadowRoot) return null;
    return (this.shadowRoot.getElementById(elementId) ||
      this.shadowRoot.querySelector(`[data-op-slug="${CSS.escape(elementId)}"]`) ||
      this.shadowRoot.querySelector(`[id$="--${CSS.escape(elementId)}"]`) ||
      this.shadowRoot.getElementById(elementId.replace(/^[a-z0-9_-]+--/, ''))) as HTMLElement | null;
  }

  /**
   * Every operation can also be reached by its method + path anchor (methodPathSlug, e.g.
   * "get-routes-id-estimate"), which stays the same when its operationId or summary changes. The
   * comparison ignores case and punctuation, so older RapiDoc anchors ("get-/routes/-id-/estimate") work too.
   * Returns the operation's own element id for such an anchor, otherwise elementId unchanged.
   */
  resolveOperationAlias(elementId: string): string {
    if (!elementId || this.getTargetElement(elementId)) return elementId;
    const normalize = (id: string) =>
      id
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const wanted = normalize(elementId);
    for (const tag of this.resolvedSpec?.tags || []) {
      const op = tag.paths?.find((p) => normalize(methodPathSlug(p.method, p.path)) === wanted);
      if (op) return op.elementId;
    }
    return elementId;
  }

  // Public Method - Binds an external navbar to this <rapi-doc> element
  bindNavBar(sidebar: HTMLElement | string, options?: any) {
    return bindNavBar(sidebar, this, options);
  }

  // Public Method (scrolls to a given path and highlights the left-nav selection)
  async scrollTo(elementId) {
    return this.scrollToPath(elementId);
  }

  // Public Method (scrolls to a given path and highlights the left-nav selection)
  async scrollToPath(elementId, expandPath = true, scrollNavItemToView = true, isFirstNavItem = false) {
    elementId = this.resolveOperationAlias(elementId);
    if (this.renderStyle === 'focused') {
      // for focused mode update this.focusedElementId to update the rendering, else it wont find the needed html elements
      // focusedElementId will get validated in the template
      this.focusedElementId = elementId;
      await sleep(0);
    }
    if (this.renderStyle === 'view') {
      this.expandAndGotoOperation(elementId, expandPath, true);
    } else {
      const contentEl = this.getTargetElement(elementId);
      const isValidElementId = Boolean(contentEl);
      if (contentEl) {
        const firstNavEl = this.shadowRoot.querySelector('.first-nav-item');
        const isFirst = isFirstNavItem || (firstNavEl && firstNavEl.dataset.contentId === elementId);
        const mainContentEl = this.shadowRoot.querySelector('.main-content');
        let targetTop: number;

        if (this.autoHeight === 'true' || this.hasAttribute('auto-height')) {
          this.scrollAutoHeightTarget(contentEl, elementId);
        } else if (isFirst) {
          targetTop = 0;
          this.lockObserverDuringScroll(contentEl, elementId, targetTop);
          if (mainContentEl) {
            mainContentEl.scrollTo({ top: 0, behavior: this.scrollBehavior });
          } else {
            contentEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'start' });
          }
        } else if (mainContentEl) {
          const containerRect = mainContentEl.getBoundingClientRect();
          const targetRect = contentEl.getBoundingClientRect();
          targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
          this.lockObserverDuringScroll(contentEl, elementId, targetTop);
          mainContentEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
        } else {
          this.lockObserverDuringScroll(contentEl, elementId);
          contentEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'start' });
        }
      }
      if (isValidElementId) {
        // In focused mode, <api-request> and <api-response> component instances are reused across endpoint switches
        // to avoid expensive DOM re-creation. Reset their selection state so selections from the previous operation
        // (such as alternative request bodies or non-default status codes) do not persist into the new operation.
        if (this.renderStyle === 'focused') {
          const requestEl = this.shadowRoot.querySelector('api-request');
          if (typeof requestEl?.afterNavigationFocusedMode === 'function') {
            requestEl.afterNavigationFocusedMode();
          }
          const responseEl = this.shadowRoot.querySelector('api-response');
          if (typeof responseEl?.resetSelection === 'function') {
            responseEl.resetSelection();
          }
        }

        // Update Location Hash
        this._activeElementId = contentEl?.id || elementId;
        this.dispatchEvent(
          new CustomEvent('nav-active-change', {
            detail: {
              id: elementId,
              elementId,
            },
            bubbles: true,
            composed: true,
          })
        );
        if (this.updateRoute === 'true') {
          this.replaceHistoryState(elementId);
        }

        // Update NavBar View and Styles
        const newNavEl = this.shadowRoot.getElementById(`link-${elementId}`);

        if (newNavEl) {
          expandParentNavContainers(newNavEl);
          if (scrollNavItemToView) {
            const navScrollEl = this.shadowRoot.querySelector('.nav-scroll');
            if (navScrollEl) {
              const scrollRect = navScrollEl.getBoundingClientRect();
              const itemRect = newNavEl.getBoundingClientRect();
              const targetTop = itemRect.top - scrollRect.top + navScrollEl.scrollTop - navScrollEl.clientHeight / 2;
              navScrollEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
            } else {
              newNavEl.scrollIntoView({ behavior: this.scrollBehavior, block: 'center' });
            }
          }
          await sleep(0);
          const oldNavEl = this.shadowRoot.querySelector(
            '.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active'
          );
          if (oldNavEl) {
            oldNavEl.classList.remove('active');
            oldNavEl.part.remove('active');
            oldNavEl.part.remove('section-navbar-active-item');
          }
          newNavEl.classList.add('active'); // must add the class after scrolling
          newNavEl.part.add('section-navbar-active-item');
          // this.requestUpdate();
        }
      }
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

  // Getter for normalized active MCP targets
  get mcpTargets() {
    return parseMcpTargets(this.mcp);
  }

  // Public Method - Generates MCP Server code and configuration in memory
  generateMcpServer(target, options = {}) {
    const spec = this.resolvedSpec || this.openApiSpec;
    if (!spec) return null;
    const defaultTarget = this.mcpTargets[0] || 'typescript';
    return mcpServerGenerator(spec, {
      target: target || defaultTarget,
      serverName: this.mcpServerName,
      ...options,
    });
  }

  // Public Method - Triggers browser download of generated MCP server file
  downloadMcpServer(target, options = {}) {
    const defaultTarget = this.mcpTargets[0] || 'typescript';
    const result = this.generateMcpServer(target || defaultTarget, options);
    if (!result || !result.serverCode) return;
    const t = result.target;
    let filename = 'server.ts';
    let mime = 'text/typescript';

    if (t === 'python') {
      filename = 'server.py';
      mime = 'text/x-python';
    } else if (t === 'go') {
      filename = 'main.go';
      mime = 'text/x-go';
    } else if (t === 'csharp' || t === 'c#') {
      filename = 'Program.cs';
      mime = 'text/plain';
    } else if (t === 'rust') {
      filename = 'main.rs';
      mime = 'text/x-rust';
    } else if (t === 'java') {
      filename = 'RapiDocMcpServer.java';
      mime = 'text/x-java-source';
    }

    const blob = new Blob([result.serverCode], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // Public Method - Returns token budget diagnostics for MCP tooling
  getMcpBudget(options = {}) {
    const spec = this.resolvedSpec || this.openApiSpec;
    if (!spec) return null;
    const extracted = extractMcpOperations(spec, options);
    return estimateTokenCost(extracted.tools, extracted.resources, extracted.workflows);
  }

  // Event handler for Advanced Search text-inputs and checkboxes
  onAdvancedSearch(ev, delay) {
    const eventTargetEl = ev.target;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      let searchInputEl;
      if (eventTargetEl.type === 'text') {
        searchInputEl = eventTargetEl;
      } else {
        searchInputEl = eventTargetEl.closest('.advanced-search-options').querySelector('input[type=text]');
      }
      const searchOptions = [...eventTargetEl.closest('.advanced-search-options').querySelectorAll('input:checked')].map((v) => v.id);
      this.advancedSearchMatches = advancedSearch(searchInputEl.value, this.resolvedSpec.tags, searchOptions);
    }, delay);
  }
}
