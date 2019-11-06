import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';

import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import SetTheme from '@/utils/theme';
import ProcessSpec from '@/utils/spec-parser';

import '@/components/m-logo';
import '@/components/end-point';
import '@/components/end-points-expanded';
import '@/components/security-schemes';

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
      // Logo & Heading
      headingText: { type: String, attribute: 'heading-text' },
      logoUrl: { type: String, attribute: 'logo-url' },

      // Spec
      specUrl: { type: String, attribute: 'spec-url' },
      sortTags: { type: String, attribute: 'sort-tags' },
      specFile: { type: String, attribute: false },

      // UI Layouts
      layout: { type: String },
      renderStyle: { type: String, attribute: 'render-style' },
      schemaStyle: { type: String, attribute: 'schema-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },

      // API Server
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      selectedServer: { type: String, attribute: 'default-api-server' },
      serverUrl: { type: String, attribute: 'server-url' },

      // Hide/Show Sections & Enable Disable actions
      showHeader: { type: String, attribute: 'show-header' },
      showInfo: { type: String, attribute: 'show-info' },
      allowAuthentication: { type: String, attribute: 'allow-authentication' },
      allowTry: { type: String, attribute: 'allow-try' },
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSearch: { type: String, attribute: 'allow-search' },
      allowServerSelection: { type: String, attribute: 'allow-server-selection' },

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

      // Filters
      matchPaths: { type: String, attribute: 'match-paths' },

    };
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    if (!this.renderStyle || !'read view'.includes(this.renderStyle)) { this.renderStyle = 'view'; }
    if (!this.schemaStyle || !'tree table'.includes(this.schemaStyle)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light dark'.includes(this.theme)) { this.theme = 'light'; }
    if (!this.defaultSchemaTab || !'example model'.includes(this.defaultSchemaTab)) { this.defaultSchemaTab = 'model'; }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.sortTags || !'true false'.includes(this.sortTags)) { this.sortTags = 'false'; }
  }

  // Cleanup
  disconnectedCallback() {
    super.connectedCallback();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /* eslint-disable indent */
  render() {
    const newTheme = {
      bg1: this.bgColor,
      fg1: this.textColor,
      headerColor: this.headerColor,
      primaryColor: this.primaryColor,
      navBgColor: this.navBgColor,
      navTextColor: this.navTextColor,
      navHoverBgColor: this.navHoverBgColor,
      navHoverTextColor: this.navHoverTextColor,
      navAccentColor: this.navAccentColor,
    };
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
      ${TableStyles}
      ${this.theme === 'dark' ? SetTheme('dark', newTheme) : SetTheme('light', newTheme)}

      <style>
        :host {
          --layout:${this.layout ? `${this.layout}` : 'row'};
          --font-mono:${this.monoFont ? `${this.monoFont}` : 'Monaco, "Andale Mono", "Roboto Mono", Consolas'}; 
          --font-regular:${this.regularFont ? `${this.regularFont}` : 'rapidoc, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'};

          --font-size-mono:13px;
          --font-size-regular:14px;
          --font-size-small:12px;
          --border-radius:2px;

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
        ::selection { background: var(--bg3); }
        .body {
          display:flex;
          height:100%;
          width:100%;
          box-sizing: border-box;
          overflow:hidden;
        }
        .nav-bar {
          width:0;
          height:100%;
          overflow: hidden;
          color:var(--nav-text-color);
          background-color: var(--nav-bg-color);
          box-sizing:border-box;
          line-height: 16px;
          display:none;
          position:relative;
          flex-direction:column;
          flex-wrap:nowrap;
          word-break:break-word;
        }
        .nav-scroll {
          overflow-x:hidden;
          overflow-y:auto;
        }
        .nav-bar:hover .cover-scroll-bar {
          opacity: 0;
        }

        .cover-scroll-bar {
          position: absolute;
          background: var(--nav-bg-color);
          height: 100%;  
          top: 0;
          right: 0;
          width: 20px;
          transition: all .3s;
          opacity: 1;
        }

        .nav-scroll:hover::-webkit-scrollbar {
          width: 24px;
        }

        .nav-bar-tag {
          font-size: var(--font-size-regular);
          border-left:4px solid transparent;
          font-weight:bold;
          padding: 30px 30px 5px 10px;
          text-transform: capitalize;
        }

        .nav-bar-info,
        .nav-bar-tag,
        .nav-bar-path {
          display:flex;
          cursor:pointer;
          border-left:4px solid transparent;
        }

        .nav-bar-path {
          font-size: var(--font-size-small);
          padding: 10px 30px 10px 10px;
        }
        .nav-bar-info {
          font-size: var(--font-size-regular);
          padding: 16px 10px;
          font-weight:bold;
        }

        .nav-bar-info.active,
        .nav-bar-tag.active,
        .nav-bar-path.active {
          font-weight:bold;
          border-left:4px solid var(--nav-accent-color);
          color:var(--nav-hover-text-color);
          background-color:var(--nav-hover-bg-color);
        }

        .nav-bar-info:hover,
        .nav-bar-tag:hover,
        .nav-bar-path:hover {
          color:var(--nav-hover-text-color);
          background-color:var(--nav-hover-bg-color);
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
        .section-gap,
        .section-gap--read-mode { 
          padding: 24px 8px 12px 8px; 
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
        .tag{
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
            padding: 24px 24px 8px 24px; 
          }
          .section-gap--read-mode { 
            padding: 48px 24px 24px 24px; 
          }

        }

        @media only screen and (min-width: 1000px) {
          .nav-bar {
            width: 280px;
            display:flex;
          }
          .section-gap--read-mode { 
            padding: 48px 120px 24px 100px; 
          }
        }
        
      </style>
      
      ${this.showHeader === 'false' ? '' : this.headerTemplate()}
      <div class="body">
        ${this.renderStyle === 'read' && this.resolvedSpec ? this.navBarTemplate() : ''}
        
        <div class="main-content regular-font ${this.renderStyle === 'read' ? 'main-content--read-mode' : ''} " style = "${this.renderStyle === 'read' ? 'padding:0' : ''}">
          <slot></slot>
          ${this.loading === true ? html`<div class="loader"></div>` : ''}
          ${this.loadFailed === true ? html`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>` : ''}
          ${this.resolvedSpec
            ? html`
              ${(this.showInfo === 'false' || !this.resolvedSpec.info) ? '' : html`
              <div id = 'content-overview' class = 'anchor ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
                <div style = 'font-size:32px'>
                  ${this.resolvedSpec.info.title}
                  ${!this.resolvedSpec.info.version ? '' : html`
                    <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                      ${this.resolvedSpec.info.version}
                    </span>`
                  }
                </div>

                ${this.resolvedSpec.info.description
                  ? html`${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description)}</div>`)}`
                  : ''
                }
                ${this.resolvedSpec.info.termsOfService
                  ? html`${unsafeHTML(`<div class='tiny-title' style="margin-top:8px"> Terms: </div> <span class='m-markdown regular-font'>${marked(this.resolvedSpec.info.termsOfService)}</span>`)}`
                  : ''
                }
                ${this.resolvedSpec.info.contact ? this.contactInfoTemplate() : ''}
              </div>`
              }

              ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
                ? ''
                : this.apiServerListTemplate()
              } 
              ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
                ? ''
                : this.securitySchemeTemplate()
              }

              ${this.resolvedSpec.tags
                ? this.renderStyle === 'read'
                  ? this.endpointsExpandedTemplate()
                  : this.endpointsGroupedByTagTemplate()
                : ''
              }`
            : ''
          }
          <slot name="footer"></slot>
        </div>
      </div>  
    `;
  }

  headerTemplate() {
    return html`
      <div class="row header regular-font" style="padding:8px 4px 8px 4px;min-height:48px;">
        <div class="only-large-screen-flex" style="align-items: center;">
          <slot name="logo" class="logo">
            <m-logo style="height:36px;width:36px;margin-left:5px"></m-logo>
          </slot>  
          <div class="header-title">${this.headingText}</div>
        </div>  
        <div style="margin: 0px 8px;display:flex;flex:1">
          ${(this.allowSpecUrlLoad === 'false')
            ? ''
            : html`
              <input id="spec-url" type="text" class="header-input" placeholder="Spec URL" value="${this.specUrl ? this.specUrl : ''}" @change="${this.onSepcUrlChange}" spellcheck="false" >
              <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div> 
            `
          } 
          ${(this.allowSpecFileLoad === 'false')
            ? ''
            : html`
              <input id="spec-file" type="file" style="display:none" value="${this.specFile ? this.specFile : ''}" @change="${this.onSepcFileChange}" spellcheck="false" >
              <button class="m-btn primary only-large-screen" style="margin-left:10px;"  @click="${this.onFileLoadClick}"> LOCAL JSON FILE </button>
            `
          }
          <slot name="header"></slot>
          ${(this.allowSearch === 'false' || this.renderStyle === 'read')
            ? ''
            : html`  
              <input id="search" class="header-input" type="text"  placeholder="search" @change="${this.onSearchChange}" style="max-width:130px;margin-left:10px;" spellcheck="false" >
              <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div>
            `
          }
        </div>
      </div>`;
  }

 navBarTemplate() {
  return html`
    <div class='nav-bar'>
      ${(this.allowSearch === 'false')
        ? ''
        : html`
          <div style="position:sticky; top:0; display:flex; flex-direction:row; align-items: stretch; padding:16px 30px 16px 16px; background: var(--nav-bg-color);"> 
            <slot name="nav-logo" class="logo"></slot>
            <div style="display:flex; flex:1">
              <input id="nav-bar-search" style="width:100%; padding-right:20px; color:var(--nav-hover-text-color); border-color:var(--nav-accent-color); background-color:var(--nav-hover-bg-color)" type="text" placeholder="search" @change="${this.onSearchChange}"  spellcheck="false" >
              <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div>
            </div>  
            ${this.matchPaths
              ? html`
                <div style='margin-left:5px; cursor:pointer; align-self:center; color:var(--nav-text-color)' class='small-font-size primary-text bold-text' @click = '${this.onClearSearch}'> CLEAR </div>`
              : ''
            }
          </div>
        `
      }
      ${html`<div class='nav-scroll'>
        ${(this.showInfo === 'false' || !this.resolvedSpec.info)
          ? ''
          : html`<div id = 'overview' class = 'nav-bar-info'  @click = '${(e) => this.scrollToEl(e)}' > Overview </div>`
        }
        ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
          ? ''
          : html`<div id = 'api-servers' class='nav-bar-info' @click = '${(e) => this.scrollToEl(e)}' > API Servers </div>`
        }
        ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
          ? ''
          : html`<div id = 'authentication'  class='nav-bar-info' @click = '${(e) => this.scrollToEl(e)}' > Authentication </div>`
        }

        ${this.resolvedSpec.tags.map((tag) => html`
          <div class='nav-bar-tag' id="${tag.name.replace(/\s/g, '')}" @click='${(e) => this.scrollToEl(e)}'>
            ${tag.name}
          </div>
          ${tag.paths.filter((v) => {
            if (this.matchPaths) {
              return `${v.method} ${v.path} ${v.summary}`.toLowerCase().includes(this.matchPaths.toLowerCase());
            }
            return true;
          }).map((p) => html`
          <div class='nav-bar-path' data-goto_container='element-${tag.name.replace(/\s/g, '')}' id='${p.method}${p.path.replace(/\//g, '')}' @click='${(e) => this.scrollToEl(e)}'> 
            <span> ${p.summary || p.path} </span>
          </div>`)}
        `)}
        </div>`
      }
      <div class="cover-scroll-bar"></div>
    </div>
  `;
}

  contactInfoTemplate() {
    return html`
    <div style="font-size:13px; margin-top:8px; line-height: 18px;">
      ${this.resolvedSpec.info.contact.email
        ? html`
          <div>
            <span class='tiny-title' style="display:inline-block; width:50px"> Email: </span> 
            <span class='regular-font'> ${this.resolvedSpec.info.contact.email}</span> 
          </div>`
        : ''
      }
      ${this.resolvedSpec.info.contact.name
        ? html`
          <div>
            <span class='tiny-title' style="display:inline-block; width:50px"> Name: </span> 
            <span class='regular-font'> ${this.resolvedSpec.info.contact.name}</span> 
          </div>`
        : ''
      }
      ${this.resolvedSpec.info.contact.url
        ? html`
          <div>
            <span class='tiny-title' style="display:inline-block; width:50px"> URL: </span> 
            <span class='regular-font'> ${this.resolvedSpec.info.contact.url}</span> 
          </div>`
        : ''
      }
    </div>`;
  }

  apiServerListTemplate() {
    return html`
    <div id = 'content-api-servers' class='regular-font anchor ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
      <div class = 'sub-title'> API SERVER: </div>
      <div class = 'mono-font' style='margin: 12px 0; font-size:calc(var(--font-size-small) + 1px);'>
        ${!this.resolvedSpec.servers || (this.resolvedSpec.servers.length === 0)
          ? ''
          : html`
            ${this.resolvedSpec.servers.map((server) => html`
              <input type = 'radio' 
                name = 'api_server' 
                value = '${server.url}' 
                @change = '${(e) => this.onApiServerChange(e, server.url)}'
                .checked = '${this.selectedServer === server.url}'
                style = 'margin:4px 0'
              />
                ${server.url} ${server.description ? html`- ${server.description}` : ''}
              <br/>
            `)}
        `}
        ${(this.serverUrl)
          ? html`
            <input type='radio' 
              name = 'api_server' 
              value = '${this.serverUrl}' 
              @change = '${(e) => this.onApiServerChange(e, this.serverUrl)}'
              .checked = '${this.selectedServer === this.serverUrl}'
              style = 'margin:4px 0'
            />
              ${this.serverUrl}
            <br/>`
          : ''
        }
      </div>
    </div>`;
  }

  securitySchemeTemplate() {
    return html`
      <div id='content-authentication' class = 'anchor ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap '}'>
        <div class='sub-title regular-font'> AUTHENTICATION </div>
        <security-schemes 
          .schemes="${this.resolvedSpec.securitySchemes}"
          selected-api-key-name  = "${this.apiKeyName ? this.apiKeyName : ''}"
          selected-api-key-value = "${this.apiKeyValue ? this.apiKeyValue : ''}"
          @change="${this.onSecurityChange}"
        ></security-schemes>
      </div>  
    `;
  }

  endpointsGroupedByTagTemplate() {
    return html`
      ${this.resolvedSpec.tags.map((tag) => html`
        <div class='regular-font section-gap'> 
          <div class="sub-title tag">${tag.name}</div>
          <div class="regular-font-size">
            ${tag.description
              ? html`
                ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description)}</div>`)}`
              : ''
            }
          </div>
        </div>
        ${tag.paths.filter((v) => {
          if (this.matchPaths) {
            return `${v.method} ${v.path}`.includes(this.matchPaths);
          }
          return true;
        }).map((path) => html`
          <end-point
            selected-server= "${this.selectedServer}" 
            api-key-name = "${this.apiKeyName ? this.apiKeyName : ''}" 
            api-key-value = "${this.apiKeyValue ? this.apiKeyValue : ''}" 
            api-key-location = "${this.apiKeyLocation}" 
            layout = "${this.layout}" 
            .path = ${path}
            allow-try="${this.allowTry ? this.allowTry : 'true'}"
            render-style = "${this.renderStyle}" 
            schema-style = "${this.schemaStyle}" 
            default-schema-tab = "${this.defaultSchemaTab}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
          > 
          </end-point>`)
        }`)
      }`;
  }

  endpointsExpandedTemplate() {
    return html`
      ${this.resolvedSpec.tags.map((tag) => html`
        <div id="tag-${tag.name.replace(/\s/g, '')}" class='regular-font section-gap--read-mode anchor' style="border-top:1px solid var(--primary-color);">
          <div class="title tag">${tag.name}</div>
          <div class="regular-font-size">
            ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
          </div>
        </div>
        <div class='regular-font section-gap--read-mode'>
          <end-points-expanded
            id = 'element-${tag.name.replace(/\s/g, '')}'
            selected-server  = "${this.selectedServer ? this.selectedServer : ''}"  
            api-key-name     = "${this.apiKeyName ? this.apiKeyName : ''}"
            api-key-value    = "${this.apiKeyValue ? this.apiKeyValue : ''}"
            api-key-location = "${this.apiKeyLocation ? this.apiKeyLocation : ''}"
            layout           = "${this.layout ? this.layout : 'row'}"
            .paths           = "${tag.paths}" 
            allow-try        = "${this.allowTry ? this.allowTry : 'true'}"
            match-paths      = "${this.matchPaths}"
            schema-style     = "${this.schemaStyle}"
            render-style     = "${this.renderStyle}"
            default-schema-tab  = "${this.defaultSchemaTab}"
            schema-expand-level = "${this.schemaExpandLevel}"
            schema-description-expanded = "${this.schemaDescriptionExpanded}"
          ></end-points-expanded>
        </div>
        `)
      }
    `;
  }
  /* eslint-enable indent */

  observeExpandedContent() {
    // Main Container
    const observeOverviewEls = this.shadowRoot.querySelectorAll('.anchor');
    observeOverviewEls.forEach((targetEl) => {
      this.intersectionObserver.observe(targetEl);
    });

    // For each shadowroot
    const containerEls = this.shadowRoot.querySelectorAll('end-points-expanded');
    containerEls.forEach((el) => {
      const observeTargetEls = el.shadowRoot.querySelectorAll('.anchor');
      observeTargetEls.forEach((targetEl) => {
        this.intersectionObserver.observe(targetEl);
      });
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(() => {
          this.loadSpec(newVal);
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
        console.log('Unable to read or parse json'); // eslint-disable-line no-console
      }
    };
    // Read the Text file
    reader.readAsText(specFile);
  }

  onFileLoadClick() {
    this.shadowRoot.getElementById('spec-file').click();
  }

  onApiServerChange(e, selectedServer) {
    if (e && e.target.checked) {
      this.selectedServer = selectedServer;
    }
  }

  onSecurityChange(e) {
    this.apiKeyName = e.detail.keyName;
    this.apiKeyValue = e.detail.keyValue;
    this.apiKeyLocation = e.detail.keyLocation;
  }

  onSearchChange(e) {
    this.matchPaths = e.target.value;
  }

  onClearSearch() {
    const searchEl = this.shadowRoot.getElementById('nav-bar-search');
    searchEl.value = '';
    this.matchPaths = '';
  }

  // Public Method
  updateTheme(baseTheme, objTheme = {}) {
    SetTheme(baseTheme, objTheme);
    this.render();
  }

  // Public Method
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }

    /*
    this.apiKeyName = '';
    this.apiKeyValue = '';
    this.apiKeyLocation = '';
    this.selectedServer = '';
    */
    this.matchPaths = '';
    try {
      this.loading = true;
      this.loadFailed = false;
      const spec = await ProcessSpec(specUrl, this.sortTags === 'true');
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
      console.error(`Unable to resolve the API spec..  ${err.message}`); // eslint-disable-line no-console
    }
  }

  afterSpecParsedAndValidated(spec) {
    this.resolvedSpec = spec;
    let isSelectedServerValid = false;
    if (this.selectedServer) {
      isSelectedServerValid = (this.selectedServer === this.serverUrl || this.resolvedSpec.servers.find((v) => (v.url === this.selectedServer)));
    }
    if (!isSelectedServerValid) {
      if (this.serverUrl) {
        this.selectedServer = this.serverUrl;
      } else if (this.resolvedSpec && this.resolvedSpec.servers && this.resolvedSpec.servers.length > 0) {
        this.selectedServer = this.resolvedSpec.servers[0].url;
      }
    }

    this.requestUpdate();
    // Put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    if (this.renderStyle === 'read') {
      window.setTimeout(() => {
        this.observeExpandedContent();
      }, 100);
    }
  }

  onIntersect(entries) {
    if (this.isIntersectionObserverActive === false) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        const oldNavEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active');
        let newNavEl;
        if (entry.target.id.startsWith('content-')) {
          newNavEl = this.shadowRoot.getElementById(entry.target.id.replace('content-', ''));
        } else if (entry.target.id.startsWith('tag-')) {
          newNavEl = this.shadowRoot.getElementById(entry.target.id.replace('tag-', ''));
        } else {
          newNavEl = this.shadowRoot.getElementById(entry.target.id);
        }

        // Add active class in the new element
        if (newNavEl) {
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

  scrollToEl(e) {
    const containerElId = e.currentTarget.dataset.goto_container;
    const navEl = e.currentTarget;
    let contentEl;
    if (['overview', 'api-servers', 'authentication'].includes(navEl.id)) {
      contentEl = this.shadowRoot.getElementById(`content-${navEl.id}`);
    } else if (navEl.classList.contains('nav-bar-tag')) {
      contentEl = this.shadowRoot.getElementById(`tag-${navEl.id}`);
    } else {
      const containerEl = this.shadowRoot.getElementById(containerElId);
      contentEl = containerEl.shadowRoot.getElementById(navEl.id);
    }

    if (contentEl) {
      this.isIntersectionObserverActive = false;
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      const oldEl = this.shadowRoot.querySelector('.nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active');
      if (oldEl) {
        oldEl.classList.remove('active');
      }
      e.currentTarget.classList.add('active');
      setTimeout(() => {
        this.isIntersectionObserverActive = true;
      }, 300);
    }
  }
}
customElements.define('rapi-doc', RapiDoc);
