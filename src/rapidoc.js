import { css, LitElement, unsafeCSS } from 'lit';
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
import EndpointStyles from '~/styles/endpoint-styles';
import PrismStyles from '~/styles/prism-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';
import CustomStyles from '~/styles/custom-styles';
// import { expandCollapseNavBarTag } from '@/templates/navbar-template';
import { advancedSearch, pathIsInSearch, componentIsInSearch, rapidocApiKey, sleep } from '~/utils/common-utils';
import ProcessSpec from '~/utils/spec-parser';
import mainBodyTemplate from '~/templates/main-body-template';
import { applyApiKey, onClearAllApiKeys } from '~/templates/security-scheme-template';
import { setApiServer } from '~/templates/server-template';

export default class RapiDoc extends LitElement {
  constructor() {
    super();
    const intersectionObserverOptions = {
      root: this.getRootNode().host,
      rootMargin: '-50px 0px -50px 0px', // when the element is visible 100px from bottom
      threshold: 0,
    };
    this.showSummaryWhenCollapsed = true;
    this.isIntersectionObserverActive = true;
    this.intersectionObserver = new IntersectionObserver((entries) => { this.onIntersect(entries); }, intersectionObserverOptions);
  }

  static get properties() {
    return {
      // Heading
      headingText: { type: String, attribute: 'heading-text' },
      gotoPath: { type: String, attribute: 'goto-path' },

      // Spec
      updateRoute: { type: String, attribute: 'update-route' },
      routePrefix: { type: String, attribute: 'route-prefix' },
      specUrl: { type: String, attribute: 'spec-url' },
      sortTags: { type: String, attribute: 'sort-tags' },
      generateMissingTags: { type: String, attribute: 'generate-missing-tags' },
      sortEndpointsBy: { type: String, attribute: 'sort-endpoints-by' },
      specFile: { type: String, attribute: false },

      // UI Layouts
      layout: { type: String },
      renderStyle: { type: String, attribute: 'render-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      responseAreaHeight: { type: String, attribute: 'response-area-height' },
      fillRequestFieldsWithExample: { type: String, attribute: 'fill-request-fields-with-example' },
      persistAuth: { type: String, attribute: 'persist-auth' },
      onNavTagClick: { type: String, attribute: 'on-nav-tag-click' },

      // Schema Styles
      schemaStyle: { type: String, attribute: 'schema-style' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },

      // API Server
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      defaultApiServerUrl: { type: String, attribute: 'default-api-server' },
      serverUrl: { type: String, attribute: 'server-url' },
      oauthReceiver: { type: String, attribute: 'oauth-receiver' },

      // Hide/Show Sections & Enable Disable actions
      showHeader: { type: String, attribute: 'show-header' },
      showSideNav: { type: String, attribute: 'show-side-nav' },
      showInfo: { type: String, attribute: 'show-info' },
      allowAuthentication: { type: String, attribute: 'allow-authentication' },
      allowTry: { type: String, attribute: 'allow-try' },
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSpecFileDownload: { type: String, attribute: 'allow-spec-file-download' },
      allowSearch: { type: String, attribute: 'allow-search' },
      allowAdvancedSearch: { type: String, attribute: 'allow-advanced-search' },
      allowServerSelection: { type: String, attribute: 'allow-server-selection' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      showComponents: { type: String, attribute: 'show-components' },
      pageDirection: { type: String, attribute: 'page-direction' },

      // Main Colors and Font
      theme: { type: String },
      bgColor: { type: String, attribute: 'bg-color' },
      textColor: { type: String, attribute: 'text-color' },
      headerColor: { type: String, attribute: 'header-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      fontSize: { type: String, attribute: 'font-size' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },
      loadFonts: { type: String, attribute: 'load-fonts' },
      cssFile: { type: String, attribute: 'css-file' },
      cssClasses: { type: String, attribute: 'css-classes' },

      // Nav Bar Colors
      navBgColor: { type: String, attribute: 'nav-bg-color' },
      navTextColor: { type: String, attribute: 'nav-text-color' },
      navHoverBgColor: { type: String, attribute: 'nav-hover-bg-color' },
      navHoverTextColor: { type: String, attribute: 'nav-hover-text-color' },
      navAccentColor: { type: String, attribute: 'nav-accent-color' },
      navItemSpacing: { type: String, attribute: 'nav-item-spacing' },
      showMethodInNavBar: { type: String, attribute: 'show-method-in-nav-bar' },
      usePathInNavBar: { type: String, attribute: 'use-path-in-nav-bar' },
      infoDescriptionHeadingsInNavBar: { type: String, attribute: 'info-description-headings-in-navbar' },

      // Fetch Options
      fetchCredentials: { type: String, attribute: 'fetch-credentials' },

      // Filters
      matchPaths: { type: String, attribute: 'match-paths' },
      matchType: { type: String, attribute: 'match-type' },

      // Internal Properties
      loading: { type: Boolean }, // indicates spec is being loaded
      focusedElementId: { type: String }, // updating the focusedElementId will automatically render appropriate section in focused mode
      showAdvancedSearchDialog: { type: Boolean },
      advancedSearchMatches: { type: Object },
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
      .body {
        display:flex;
        height:100%;
        width:100%;
        overflow:hidden;
      }

      .main-content { 
        margin:0;
        padding: 0; 
        display:block;
        flex:1;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--border-color) transparent;
      }

      .main-content-inner--view-mode {
        padding: 0 8px;
      }
      .main-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .main-content::-webkit-scrollbar-track {
        background:transparent;
      }
      .main-content::-webkit-scrollbar-thumb {
        background-color: var(--border-color);
      }

      .section-gap.section-tag {
        border-bottom:1px solid var(--border-color);
      }
      .section-gap,
      .section-gap--focused-mode,
      .section-gap--read-mode { 
        padding: 0px 4px; 
      }
      .section-tag-header {
        position:relative;
        cursor: n-resize;
        padding: 12px 0;
      }
      .collapsed .section-tag-header:hover{
        cursor: s-resize;
      }

      .section-tag-header:hover{
        background-image: linear-gradient(to right, rgba(0,0,0,0), var(--border-color), rgba(0,0,0,0));
      }

      .section-tag-header:hover::after {
        position:absolute;
        margin-left:-24px;
        font-size:20px;
        top: calc(50% - 14px);
        color:var(--primary-color);
        content: '⬆'; 
      }

      .collapsed .section-tag-header::after {
        position:absolute;
        margin-left:-24px;
        font-size:20px;
        top: calc(50% - 14px);
        color: var(--border-color);
        content: '⬇'; 
      }
      .collapsed .section-tag-header:hover::after {
        color:var(--primary-color);
      }

      .collapsed .section-tag-body {
        display:none;
      }

      .logo {
        height:36px;
        width:36px;
        margin-left:5px; 
      }
      .only-large-screen-flex,
      .only-large-screen{
        display:none;
      }
      .tag.title {
        text-transform: uppercase;
      }
      .main-header {
        background-color:var(--header-bg);
        color:var(--header-fg);
        width:100%;
      }
      .header-title {
        font-size:calc(var(--font-size-regular) + 8px); 
        padding:0 8px;
      }
      input.header-input{
        background:var(--header-color-darker);
        color:var(--header-fg);
        border:1px solid var(--header-color-border);
        flex:1; 
        padding-right:24px;
        border-radius:3px;
      }
      input.header-input::placeholder {
        opacity:0.4;
      }
      .loader {
        margin: 16px auto 16px auto; 
        border: 4px solid var(--bg3);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 36px;
        height: 36px;
        animation: spin 2s linear infinite;
      }
      .expanded-endpoint-body{ 
        position: relative;
        padding: 6px 0px; 
      }
      .expanded-endpoint-body.deprecated{ filter:opacity(0.6); }
      .divider { 
        border-top: 2px solid var(--border-color);
        margin: 24px 0;
        width:100%;
      }

      .tooltip {
        cursor:pointer;
        border: 1px solid var(--border-color);
        border-left-width: 4px;
        margin-left:2px;
      }
      .tooltip a {
        color: var(--fg2);
        text-decoration: none;
      }
      .tooltip-text {
        color: var(--fg2);
        max-width: 400px;
        position: absolute;
        z-index:1;
        background-color: var(--bg2);
        visibility: hidden;

        overflow-wrap: break-word;
      }
      .tooltip:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
      .tooltip:hover a:hover {
        color: var(--primary-color);
      }

      .tooltip:hover .tooltip-text {
        visibility: visible;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .nav-method { font-weight: bold; margin-right: 4px; font-size: calc(var(--font-size-small) - 2px); white-space: nowrap; }
      .nav-method.false { display: none; }

      .nav-method.as-colored-text.get { color:var(--nav-get-color); }
      .nav-method.as-colored-text.put { color:var(--nav-put-color); }
      .nav-method.as-colored-text.post { color:var(--nav-post-color); }
      .nav-method.as-colored-text.delete { color:var(--nav-delete-color); }
      .nav-method.as-colored-text.head, .nav-method.as-colored-text.patch, .nav-method.as-colored-text.options { color:var(--nav-head-color); }
      
      .nav-method.as-colored-block {
        padding: 1px 4px;
        min-width: 30px;
        border-radius: 4px 0 0 4px;
        color: #000;
      }

      .nav-method.as-colored-block.get { background-color: var(--blue); }
      .nav-method.as-colored-block.put { background-color: var(--orange); }
      .nav-method.as-colored-block.post { background-color: var(--green); }
      .nav-method.as-colored-block.delete { background-color: var(--red); }
      .nav-method.as-colored-block.head, .nav-method.as-colored-block.patch , .nav-method.as-colored-block.options { 
        background-color: var(--yellow); 
      }

      @media only screen and (min-width: 768px) {
        .nav-bar {
          width: 260px;
          display:flex;
        }
        .only-large-screen{
          display:block;
        }
        .only-large-screen-flex{
          display:flex;
        }
        .section-gap { 
          padding: 0 0 0 24px; 
        }
        .section-gap--focused-mode {
          padding: 24px 8px; 
        }
        .section-gap--read-mode { 
          padding: 24px 8px; 
        }
        .endpoint-body {
          position: relative;
          padding:36px 0 48px 0;
        }
      }

      @media only screen and (min-width: 1024px) {
        .nav-bar {
          width: ${unsafeCSS(this.fontSize === 'default' ? '300px' : this.fontSize === 'large' ? '315px' : '330px')};
          display:flex;
        }
        .section-gap--focused-mode { 
          padding: 12px 80px 12px 80px; 
        }
        .section-gap--read-mode { 
          padding: 24px 80px 12px 80px; 
        }
      }`,
      CustomStyles,
    ];
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    const parent = this.parentElement;
    if (parent) {
      if (parent.offsetWidth === 0 && parent.style.width === '') {
        parent.style.width = '100vw';
      }
      if (parent.offsetHeight === 0 && parent.style.height === '') {
        parent.style.height = '100vh';
      }
      if (parent.tagName === 'BODY') {
        if (!parent.style.marginTop) { parent.style.marginTop = '0'; }
        if (!parent.style.marginRight) { parent.style.marginRight = '0'; }
        if (!parent.style.marginBottom) { parent.style.marginBottom = '0'; }
        if (!parent.style.marginLeft) { parent.style.marginLeft = '0'; }
      }
    }

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

    if (!this.layout || !'row, column,'.includes(`${this.layout},`)) { this.layout = 'row'; }
    if (!this.renderStyle || !'read, view, focused,'.includes(`${this.renderStyle},`)) { this.renderStyle = 'read'; }
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (!this.defaultSchemaTab || !'example, schema, model,'.includes(`${this.defaultSchemaTab},`)) {
      this.defaultSchemaTab = 'example';
    } else if (this.defaultSchemaTab === 'model') {
      this.defaultSchemaTab = 'schema';
    }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) { this.schemaDescriptionExpanded = 'false'; }

    if (!this.schemaHideReadOnly || !'default, never,'.includes(`${this.schemaHideReadOnly},`)) { this.schemaHideReadOnly = 'default'; }
    if (!this.schemaHideWriteOnly || !'default, never,'.includes(`${this.schemaHideWriteOnly},`)) { this.schemaHideWriteOnly = 'default'; }

    if (!this.fillRequestFieldsWithExample || !'true, false,'.includes(`${this.fillRequestFieldsWithExample},`)) { this.fillRequestFieldsWithExample = 'true'; }
    if (!this.persistAuth || !'true, false,'.includes(`${this.persistAuth},`)) { this.persistAuth = 'false'; }
    if (!this.onNavTagClick || !'expand-collapse, show-description,'.includes(`${this.onNavTagClick},`)) { this.onNavTagClick = 'expand-collapse'; }
    if (!this.responseAreaHeight) {
      this.responseAreaHeight = '400px';
    }

    if (!this.allowSearch || !'true, false,'.includes(`${this.allowSearch},`)) { this.allowSearch = 'true'; }
    if (!this.allowAdvancedSearch || !'true, false,'.includes(`${this.allowAdvancedSearch},`)) { this.allowAdvancedSearch = 'true'; }

    if (!this.allowTry || !'true, false,'.includes(`${this.allowTry},`)) { this.allowTry = 'true'; }
    if (!this.apiKeyValue) { this.apiKeyValue = '-'; }
    if (!this.apiKeyLocation) { this.apiKeyLocation = 'header'; }
    if (!this.apiKeyName) { this.apiKeyName = ''; }

    if (!this.oauthReceiver) { this.oauthReceiver = 'oauth-receiver.html'; }
    if (!this.updateRoute || !'true, false,'.includes(`${this.updateRoute},`)) { this.updateRoute = 'true'; }
    if (!this.routePrefix) { this.routePrefix = '#'; }
    if (!this.sortTags || !'true, false,'.includes(`${this.sortTags},`)) { this.sortTags = 'false'; }
    if (!this.generateMissingTags || !'true, false,'.includes(`${this.generateMissingTags},`)) { this.generateMissingTags = 'false'; }
    if (!this.sortEndpointsBy || !'method, path, summary, none,'.includes(`${this.sortEndpointsBy},`)) { this.sortEndpointsBy = 'path'; }
    if (!this.navItemSpacing || !'compact, relaxed, default,'.includes(`${this.navItemSpacing},`)) { this.navItemSpacing = 'default'; }
    if (!this.showMethodInNavBar || !'false, as-plain-text, as-colored-text, as-colored-block,'.includes(`${this.showMethodInNavBar},`)) { this.showMethodInNavBar = 'false'; }
    if (!this.usePathInNavBar || !'true, false,'.includes(`${this.usePathInNavBar},`)) { this.usePathInNavBar = 'false'; }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) { this.fontSize = 'default'; }

    if (!this.showInfo || !'true, false,'.includes(`${this.showInfo},`)) { this.showInfo = 'true'; }
    if (!this.allowServerSelection || !'true, false,'.includes(`${this.allowServerSelection},`)) { this.allowServerSelection = 'true'; }
    if (!this.allowAuthentication || !'true, false,'.includes(`${this.allowAuthentication},`)) { this.allowAuthentication = 'true'; }
    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) { this.allowSchemaDescriptionExpandToggle = 'true'; }

    if (!this.showSideNav || !'true false'.includes(this.showSideNav)) { this.showSideNav = 'true'; }
    if (!this.showComponents || !'true false'.includes(this.showComponents)) { this.showComponents = 'false'; }
    if (!this.infoDescriptionHeadingsInNavBar || !'true, false,'.includes(`${this.infoDescriptionHeadingsInNavBar},`)) { this.infoDescriptionHeadingsInNavBar = 'false'; }
    if (!this.fetchCredentials || !'omit, same-origin, include,'.includes(`${this.fetchCredentials},`)) { this.fetchCredentials = ''; }
    if (!this.matchType || !'includes regex'.includes(this.matchType)) { this.matchType = 'includes'; }

    if (!this.showAdvancedSearchDialog) { this.showAdvancedSearchDialog = false; }

    if (!this.cssFile) { this.cssFile = null; }
    if (!this.cssClasses) { this.cssClasses = ''; }

    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });

    window.addEventListener('hashchange', () => {
      const regEx = new RegExp(`^${this.routePrefix}`, 'i');
      const elementId = window.location.hash.replace(regEx, '');
      this.scrollTo(elementId);
    }, true);
  }

  // Cleanup
  disconnectedCallback() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    super.disconnectedCallback();
  }

  infoDescriptionHeadingRenderer() {
    const renderer = new marked.Renderer();
    renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="${slugger.slug(raw)}">${text}</h${level}>`);
    return renderer;
  }

  render() {
    // return render(mainBodyTemplate(this), this.shadowRoot, { eventContext: this });
    const cssLinkEl = document.querySelector(`link[href*="${this.cssFile}"]`);
    // adding custom style for RapiDoc
    if (cssLinkEl) {
      this.shadowRoot.appendChild(cssLinkEl.cloneNode());
    }
    return mainBodyTemplate.call(this);
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
            this.scrollTo(this.gotoPath);
          }
        }, 0);
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

  onSepcUrlChange() {
    this.setAttribute('spec-url', this.shadowRoot.getElementById('spec-url').value);
  }

  onSepcFileChange(e) {
    this.setAttribute('spec-file', this.shadowRoot.getElementById('spec-file').value);
    const specFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const specObj = JSON.parse(reader.result);
        this.loadSpec(specObj);
        this.shadowRoot.getElementById('spec-url').value = '';
      } catch (err) {
        console.error('RapiDoc: Unable to read or parse json'); // eslint-disable-line no-console
      }
    };
    // Read the Text file
    reader.readAsText(specFile);
  }

  onFileLoadClick() {
    this.shadowRoot.getElementById('spec-file').click();
  }

  onSearchChange(e) {
    this.matchPaths = e.target.value;
    this.resolvedSpec.tags.forEach((tag) => tag.paths.filter((v) => {
      if (this.matchPaths) {
        // v.expanded = false;
        if (pathIsInSearch(this.matchPaths, v, this.matchType)) {
          tag.expanded = true;
        }
      }
    }));
    this.resolvedSpec.components.forEach((component) => component.subComponents.filter((v) => {
      v.expanded = false;
      if (!this.matchPaths || componentIsInSearch(this.matchPaths, v)) {
        v.expanded = true;
      }
    }));
    this.requestUpdate();
  }

  onClearSearch() {
    const searchEl = this.shadowRoot.getElementById('nav-bar-search');
    searchEl.value = '';
    this.matchPaths = '';
    this.resolvedSpec.components.forEach((component) => component.subComponents.filter((v) => {
      v.expanded = true;
    }));
  }

  onShowSearchModalClicked() {
    this.showAdvancedSearchDialog = true;
  }

  // Event Handler on Dialog-Box is opened
  async onOpenSearchDialog(e) {
    // Set focus to text input
    const inputEl = e.detail.querySelector('input');
    await sleep(0);
    if (inputEl) {
      inputEl.focus();
    }
  }

  // Public Method
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    this.matchPaths = '';
    try {
      this.resolvedSpec = {
        specLoadError: false,
        isSpecLoading: true,
        tags: [],
      };
      this.loading = true;
      this.loadFailed = false;
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

    // Initiate IntersectionObserver and put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    if (this.renderStyle === 'read') {
      await sleep(100);
      this.observeExpandedContent(); // This will auto-highlight the selected nav-item in read-mode
    }

    // On first time Spec load, try to navigate to location hash if provided
    const locationHash = window.location.hash?.substring(1);
    if (locationHash) {
      const regEx = new RegExp(`^${this.routePrefix}`, 'i');
      const elementId = window.location.hash.replace(regEx, '');
      if (this.renderStyle === 'view') {
        this.expandAndGotoOperation(elementId, true, true);
      } else {
        this.scrollTo(elementId);
      }
    } else if (this.renderStyle === 'focused') {
      // If goto-path is provided and no location-hash is present then try to scroll to default element
      if (!this.gotoPath) {
        const defaultElementId = this.showInfo ? 'overview' : this.resolvedSpec.tags[0]?.paths[0];
        this.scrollTo(defaultElementId);
      }
    }
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
    }
    if (scrollToElement) {
      // requestUpdate() and delay required, else we cant find element
      if (isExpandingNeeded) {
        this.requestUpdate();
      }
      window.setTimeout(() => {
        const gotoEl = this.shadowRoot.getElementById(tmpElementId);
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
          if (this.updateRoute === 'true') {
            window.history.replaceState(null, null, `${this.routePrefix || '#'}${tmpElementId}`);
          }
        }
      }, isExpandingNeeded ? 150 : 0);
    }
  }

  isValidTopId(id) {
    return (id.startsWith('overview') || id === 'servers' || id === 'auth');
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

  onIntersect(entries) {
    if (this.isIntersectionObserverActive === false) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        const oldNavEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active');
        const newNavEl = this.shadowRoot.getElementById(`link-${entry.target.id}`);

        // Add active class in the new element
        if (newNavEl) {
          if (this.updateRoute === 'true') {
            window.history.replaceState(null, null, `${window.location.href.split('#')[0]}${this.routePrefix || '#'}${entry.target.id}`);
          }
          newNavEl.scrollIntoView({ behavior: 'auto', block: 'center' });
          newNavEl.classList.add('active');
        }
        // Remove active class from previous element
        if (oldNavEl) {
          oldNavEl.classList.remove('active');
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
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }

  /**
   * Called by
   *  - onClick of Navigation Bar
   *  - onClick of Advanced Search items
   *
   * Functionality:
   *  1. First deactivate IntersectionObserver
   *  2. Scroll to the element
   *  3. Activate IntersectionObserver (after little delay)
   *
  */
  async scrollToEventTarget(event, scrollNavItemToView = true) {
    const navEl = event.currentTarget;
    if (!navEl.dataset.contentId) {
      return;
    }
    this.isIntersectionObserverActive = false;
    if (this.renderStyle === 'focused') {
      const requestEl = this.shadowRoot.querySelector('api-request');
      if (requestEl) {
        requestEl.beforerNavigationFocusedMode();
      }
    }
    this.scrollTo(navEl.dataset.contentId, true, scrollNavItemToView);
    setTimeout(() => {
      this.isIntersectionObserverActive = true;
    }, 300);
  }

  // Public Method (scrolls to a given path and highlights the left-nav selection)
  async scrollTo(elementId, expandPath = true, scrollNavItemToView = true) {
    if (this.renderStyle === 'focused') {
      // for focused mode update this.focusedElementId to update the rendering, else it wont find the needed html elements
      // focusedElementId will get validated in the template
      this.focusedElementId = elementId;
    }
    if (this.renderStyle === 'view') {
      this.expandAndGotoOperation(elementId, expandPath, true);
    } else {
      let isValidElementId = false;
      const contentEl = this.shadowRoot.getElementById(elementId);
      if (contentEl) {
        isValidElementId = true;
        contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else {
        isValidElementId = false;
      }
      if (isValidElementId) {
        // for focused style it is important to reset request-body-selection and response selection which maintains the state for in case of multiple req-body or multiple response mime-type
        if (this.renderStyle === 'focused') {
          const requestEl = this.shadowRoot.querySelector('api-request');
          if (requestEl) {
            requestEl.afterNavigationFocusedMode();
          }
          const responseEl = this.shadowRoot.querySelector('api-response');
          if (responseEl) {
            responseEl.resetSelection();
          }
        }

        // Update Location Hash
        if (this.updateRoute === 'true') {
          window.history.replaceState(null, null, `${this.routePrefix || '#'}${elementId}`);
        }

        // Update NavBar View and Styles
        const newNavEl = this.shadowRoot.getElementById(`link-${elementId}`);

        if (newNavEl) {
          if (scrollNavItemToView) {
            newNavEl.scrollIntoView({ behavior: 'auto', block: 'center' });
          }
          await sleep(0);
          const oldNavEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active');
          if (oldNavEl) {
            oldNavEl.classList.remove('active');
          }
          newNavEl.classList.add('active'); // must add the class after scrolling
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
      const searcOptions = [...eventTargetEl.closest('.advanced-search-options').querySelectorAll('input:checked')].map((v) => v.id);
      this.advancedSearchMatches = advancedSearch(searchInputEl.value, this.resolvedSpec.tags, searcOptions);
    }, delay);
  }
}
customElements.define('rapi-doc', RapiDoc);
