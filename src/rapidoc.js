import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';
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

import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import EndpointStyles from '@/styles/endpoint-styles';
import PrismStyles from '@/styles/prism-styles';
import TabStyles from '@/styles/tab-styles';
import NavStyles from '@/styles/nav-styles';

import { isValidHexColor } from '@/utils/color-utils';
import { pathIsInSearch, invalidCharsRegEx } from '@/utils/common-utils';
import SetTheme from '@/utils/theme';
import ProcessSpec from '@/utils/spec-parser';
import expandedEndpointTemplate from '@/templates/expanded-endpoint-template';
import endpointTemplate from '@/templates/endpoint-template';
import serverTemplate from '@/templates/server-template';
import securitySchemeTemplate from '@/templates/security-scheme-template';
import componentsTemplate from '@/templates/components-template';

import contactInfoTemplate from '@/templates/contact-info-template';
import headerTemplate from '@/templates/header-template';
import navbarTemplate from '@/templates/navbar-template';

export default class RapiDoc extends LitElement {
  constructor() {
    super();
    const intersectionObserverOptions = {
      root: this.getRootNode().host,
      rootMargin: '-50px 0px -50px 0px', // when the element is visible 100px from bottom
      threshold: 0,
    };
    this.isIntersectionObserverActive = true;
    this.intersectionObserver = new IntersectionObserver((entries) => { this.onIntersect(entries); }, intersectionObserverOptions);
  }

  static get properties() {
    return {
      // Heading
      headingText: { type: String, attribute: 'heading-text' },
      gotoPath: { type: String, attribute: 'goto-path' },

      // Spec
      specUrl: { type: String, attribute: 'spec-url' },
      sortTags: { type: String, attribute: 'sort-tags' },
      sortEndpointsBy: { type: String, attribute: 'sort-endpoints-by' },
      specFile: { type: String, attribute: false },

      // UI Layouts
      layout: { type: String },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      responseAreaHeight: { type: String, attribute: 'response-area-height' },

      // API Server
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      defaultApiServerUrl: { type: String, attribute: 'default-api-server' },
      serverUrl: { type: String, attribute: 'server-url' },
      oauthReceiver: { type: String, attribute: 'oauth-receiver' },

      // Hide/Show Sections & Enable Disable actions
      showHeader: { type: String, attribute: 'show-header' },
      showInfo: { type: String, attribute: 'show-info' },
      allowAuthentication: { type: String, attribute: 'allow-authentication' },
      allowTry: { type: String, attribute: 'allow-try' },
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSearch: { type: String, attribute: 'allow-search' },
      allowServerSelection: { type: String, attribute: 'allow-server-selection' },
      showComponents: { type: String, attribute: 'show-components' },

      // Main Colors and Font
      theme: { type: String },
      bgColor: { type: String, attribute: 'bg-color' },
      textColor: { type: String, attribute: 'text-color' },
      headerColor: { type: String, attribute: 'header-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },

      // Nav Bar Colors
      navBgColor: { type: String, attribute: 'nav-bg-color' },
      navTextColor: { type: String, attribute: 'nav-text-color' },
      navHoverBgColor: { type: String, attribute: 'nav-hover-bg-color' },
      navHoverTextColor: { type: String, attribute: 'nav-hover-text-color' },
      navAccentColor: { type: String, attribute: 'nav-accent-color' },
      navItemSpacing: { type: String, attribute: 'nav-item-spacing' },
      infoDescriptionHeadingsInNavBar: { type: String, attribute: 'info-description-headings-in-navbar' },

      // Filters
      matchPaths: { type: String, attribute: 'match-paths' },

    };
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    if (!this.renderStyle || !'read, view,'.includes(`${this.renderStyle},`)) { this.renderStyle = 'view'; }
    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) { this.theme = 'light'; }
    if (!this.defaultSchemaTab || !'example, model,'.includes(`${this.defaultSchemaTab},`)) { this.defaultSchemaTab = 'model'; }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.responseAreaHeight) {
      this.responseAreaHeight = '300px';
    }
    if (!this.allowTry || !'true, false,'.includes(`${this.allowTry},`)) { this.allowTry = 'true'; }
    if (!this.apiKeyName) { this.apiKeyName = ''; }
    if (!this.apiKeyValue) { this.apiKeyValue = ''; }
    if (!this.oauthReceiver) { this.oauthReceiver = 'oauth-receiver.html'; }
    if (!this.sortTags || !'true, false,'.includes(`${this.sortTags},`)) { this.sortTags = 'false'; }
    if (!this.sortEndpointsBy || !'method, path,'.includes(`${this.sortEndpointsBy},`)) { this.sortEndpointsBy = 'path'; }
    if (!this.navItemSpacing || !'compact, relaxed, default,'.includes(`${this.navItemSpacing},`)) { this.navItemSpacing = 'default'; }

    if (!this.showComponents || !'true false'.includes(this.showComponents)) { this.showComponents = 'false'; }
    if (!this.infoDescriptionHeadingsInNavBar || !'true, false,'.includes(`${this.infoDescriptionHeadingsInNavBar},`)) { this.infoDescriptionHeadingsInNavBar = 'false'; }

    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });

    window.addEventListener('hashchange', () => {
      this.scrollTo(window.location.hash.substring(1));
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
    renderer.heading = (text, level, raw, slugger) => `<h${level} class="observe-me" id="${slugger.slug(text)}">${text}</h${level}>`;
    return renderer;
  }

  /* eslint-disable indent */
  render() {
    const newTheme = {
      bg1: isValidHexColor(this.bgColor) ? this.bgColor : '',
      fg1: isValidHexColor(this.textColor) ? this.textColor : '',
      headerColor: isValidHexColor(this.headerColor) ? this.headerColor : '',
      primaryColor: isValidHexColor(this.primaryColor) ? this.primaryColor : '',
      navBgColor: isValidHexColor(this.navBgColor) ? this.navBgColor : '',
      navTextColor: isValidHexColor(this.navTextColor) ? this.navTextColor : '',
      navHoverBgColor: isValidHexColor(this.navHoverBgColor) ? this.navHoverBgColor : '',
      navHoverTextColor: isValidHexColor(this.navHoverTextColor) ? this.navHoverTextColor : '',
      navAccentColor: isValidHexColor(this.navAccentColor) ? this.navAccentColor : '',
    };
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
      ${TableStyles}
      ${EndpointStyles}
      ${PrismStyles}
      ${TabStyles}
      ${NavStyles}
      ${this.theme === 'dark' ? SetTheme('dark', newTheme) : SetTheme('light', newTheme)}

      <style>
        :host {
          --layout:${this.layout ? `${this.layout}` : 'row'};
          --font-mono:${this.monoFont ? `${this.monoFont}` : 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'}; 
          --font-regular:${this.regularFont ? `${this.regularFont}` : 'rapidoc, "Open Sans", BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

          --font-size-mono: 13px;
          --font-size-regular: 14px;
          --font-size-small: 12px;
          --border-radius: 2px;
          --resp-area-height: ${this.responseAreaHeight};
          --nav-item-padding: ${this.navItemSpacing === 'relaxed' ? '10px' : this.navItemSpacing === 'compact' ? '3px 10px' : '6px 10px'};

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
          box-sizing: border-box;
          overflow:hidden;
        }

        .main-content { 
          margin:0;
          padding: 0; 
          display:block;
          flex:1;
          height:100%;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        .main-content--read-mode{
          color: var(--fg3)
        }
        .main-content::-webkit-scrollbar-track{
          background:transparent;
        }
        .main-content::-webkit-scrollbar{
          width: 8px;
          height: 8px;
          background-color: transparent;
        }
        .main-content::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
        }

        .section-gap.section-tag {
          border-bottom:1px solid var(--border-color);
        }
        .section-gap,
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
        .header-title{
          font-size:calc(var(--title-font-size) + 8px); 
          padding:0 8px;
        }
        .tag.title {
          text-transform: uppercase;
        }
        .header{
          background-color:var(--header-bg);
          color:var(--header-fg);
          box-sizing:border-box;
          width:100%;
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
        .divider { border-top:2px solid var(--primary-color); width:100%; }

        .tooltip {
          cursor:pointer;
          border: 1px solid var(--border-color);
          border-left-width: 4px;
          margin-left:2px;
        }
        .tooltip-text {
          color: var(--fg2);
          background-color: var(--bg2);
          visibility: hidden;
          overflow-wrap: break-word;
        }
        .tooltip:hover{
          color: var(--primary-color);
          border-color: var(--primary-color);

        }
        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
          .main-content { 
            padding:0 16px;
          }
          .section-gap { 
            padding: 0 24px; 
          }
          .section-gap--read-mode { 
            padding: 48px 24px 24px 24px; 
          }
          .endpoint-body {
            position: relative;
            padding:36px 0 48px 0;
          }
        }

        @media only screen and (min-width: 1000px) {
          .nav-bar {
            width: 280px;
            display:flex;
          }
          .section-gap--read-mode { 
            padding: 24px 100px 12px 100px; 
          }
        }
      </style>
      
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}
    <div class="body">
      ${this.renderStyle === 'read' && this.resolvedSpec ? navbarTemplate.call(this) : ''}
      
      <div class="main-content regular-font ${this.renderStyle === 'read' ? 'main-content--read-mode' : ''} " style = "${this.renderStyle === 'read' ? 'padding:0' : ''}">
        <slot></slot>
        ${this.loading === true ? html`<div class="loader"></div>` : ''}
        ${this.loadFailed === true ? html`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>` : ''}
        ${this.resolvedSpec
          ? html`
            ${(this.showInfo === 'false' || !this.resolvedSpec.info) ? '' : html`
            <div id = 'overview' class = 'observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
              <div style = 'font-size:32px'>
                ${this.resolvedSpec.info.title}
                ${!this.resolvedSpec.info.version ? '' : html`
                  <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                    ${this.resolvedSpec.info.version}
                  </span>`
                }
              </div>

              ${this.resolvedSpec.info.description
                ? html`${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description, { renderer: this.infoDescriptionHeadingRenderer() })}</div>`)}`
                : ''
              }
              ${this.resolvedSpec.info.termsOfService
                ? html`${unsafeHTML(`<div class='tiny-title' style="margin-top:8px"> Terms: </div> <span class='m-markdown regular-font'>${marked(this.resolvedSpec.info.termsOfService)}</span>`)}`
                : ''
              }
              ${this.resolvedSpec.info.contact ? contactInfoTemplate.call(this) : ''}
            </div>`
            }

            ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
              ? ''
              : serverTemplate.call(this)
            } 

            ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
              ? ''
              : securitySchemeTemplate.call(this)
            }
            <div @click="${(e) => { this.handleHref(e); }}">
              ${this.resolvedSpec.tags
                ? this.renderStyle === 'read'
                  ? expandedEndpointTemplate.call(this)
                  : endpointTemplate.call(this)
                : ''
              }
            </div>

            ${this.showComponents === 'true' ? componentsTemplate.call(this) : ''}
          `
          : ''
        }
        <slot name="footer"></slot>
      </div>
    </div>  
  `;
  }

  /* eslint-enable indent */

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
          // If goto-path is provided then try to scroll there
          if (this.gotoPath) {
            this.scrollTo(this.gotoPath.replace(invalidCharsRegEx, '-').toLowerCase());
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
          const rapiDocApiKey = this.resolvedSpec.securitySchemes.find((v) => v.apiKeyId === '_rapidoc_api_key');
          if (!rapiDocApiKey) {
            this.resolvedSpec.securitySchemes.push({
              apiKeyId: '_rapidoc_api_key',
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
    this.matchPaths = e.target.value.toLowerCase();

    let didFindAnything = false;
    this.resolvedSpec.tags.forEach((tag) => tag.paths.filter((v) => {
      if (this.matchPaths) {
        v.expanded = false;
        if (pathIsInSearch(this.matchPaths, v)) {
          didFindAnything = true;
          tag.expanded = true;
        }
      }
    }));
    if (didFindAnything) this.requestUpdate();
  }

  onClearSearch() {
    const searchEl = this.shadowRoot.getElementById('nav-bar-search');
    searchEl.value = '';
    this.matchPaths = '';
  }

  // Public Method
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }

    this.matchPaths = '';
    try {
      this.loading = true;
      this.loadFailed = false;
      const spec = await ProcessSpec(
        specUrl,
        this.sortTags === 'true',
        this.getAttribute('sort-endpoints-by'),
        this.getAttribute('api-key-name'),
        this.getAttribute('api-key-location'),
        this.getAttribute('api-key-value'),
        this.getAttribute('server-url'),
      );
      this.loading = false;
      if (spec === undefined || spec === null) {
        console.error('Unable to resolve the API spec. '); // eslint-disable-line no-console
      }
      this.afterSpecParsedAndValidated(spec);
    } catch (err) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      this.requestUpdate();
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`); // eslint-disable-line no-console
    }
  }

  afterSpecParsedAndValidated(spec) {
    this.resolvedSpec = spec;
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
        this.selectedServer = this.resolvedSpec.servers[0];
      }
    }
    this.requestUpdate();
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);

    // Initiate IntersectionObserver and put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    if (this.renderStyle === 'read') {
      window.setTimeout(() => {
        this.observeExpandedContent();
      }, 100);
    }
    // On first time Spec load, try to navigate to location hash if provided
    if (window.location.hash) {
      if (!this.gotoPath) {
        this.expandTreeToPath(window.location.hash, true, true);
      }
    }
  }

  expandTreeToPath(pathInput, expandOperation = true, scrollToElement = true) {
    // Expand full operation and tag
    if (pathInput.indexOf('#') === 0) pathInput = pathInput.substring(1);
    let path;

    this.resolvedSpec.tags.map((tag) => tag.paths.filter((v) => {
      const method = pathInput.match(new RegExp('(.*?)-'));
      const methodType = (method && method.length === 2) ? method[1] : null;
      path = pathInput.match(new RegExp('/([^/]+)/?$'));
      const pathValue = (path && path.length === 2) ? path[0] : null;

      if (methodType && pathValue && methodType === v.method && pathValue === v.path) {
        v.expanded = expandOperation;
        tag.expanded = true;
      }
    }));
    this.requestUpdate();

    if (scrollToElement) {
      // delay required, else we cant find element
      window.setTimeout(() => {
        const gotoEl = this.shadowRoot.getElementById(pathInput);
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 150);
    }
  }

  onIntersect(entries) {
    if (this.isIntersectionObserverActive === false) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        const oldNavEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active');
        const newNavEl = this.shadowRoot.getElementById(`link-${entry.target.id}`);

        // Add active class in the new element
        if (newNavEl) {
          window.history.replaceState(null, null, `${window.location.href.split('#')[0]}#${entry.target.id}`);
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

  // Called by onClick of Left-Navigation Bar items
  scrollToEl(e) {
    const navEl = e.currentTarget;
    if (!navEl.id || !navEl.id.startsWith('link-')) {
      return;
    }
    const locationHash = `${navEl.id.replace('link-', '')}`;
    const contentEl = this.shadowRoot.getElementById(locationHash);

    if (contentEl) {
      // Disable IntersectionObserver before scrolling into the view, else it will try to scroll the navbar which is not needed here
      this.isIntersectionObserverActive = false;
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      const oldEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active');
      if (oldEl) {
        oldEl.classList.remove('active');
      }
      e.currentTarget.classList.add('active');
      window.history.replaceState(null, null, `${window.location.href.split('#')[0]}#${locationHash}`);
      setTimeout(() => {
        this.isIntersectionObserverActive = true;
      }, 300);
    }
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

  // Public Method
  scrollTo(path, expandPath = true) {
    const gotoEl = this.shadowRoot.getElementById(path);
    if (gotoEl) {
      this.expandTreeToPath(path, expandPath, true);
    }
  }
}
customElements.define('rapi-doc', RapiDoc);
