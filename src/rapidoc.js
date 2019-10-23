import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import marked from 'marked';

import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import ColorUtils from '@/utils/color-utils';
import ProcessSpec from '@/utils/spec-parser';

import '@/components/m-logo';
import '@/components/end-point';
import '@/components/end-points-expanded';
import '@/components/path-and-methods';
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
      specUrl: { type: String, attribute: 'spec-url' },
      specFile: { type: String, attribute: false },
      serverUrl: { type: String, attribute: 'server-url' },
      matchPaths: { type: String, attribute: 'match-paths' },
      headingText: { type: String, attribute: 'heading-text' },
      headerColor: { type: String, attribute: 'header-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },
      showHeader: { type: String, attribute: 'show-header' },
      showInfo: { type: String, attribute: 'show-info' },
      allowAuthentication: { type: String, attribute: 'allow-authentication' },
      allowTry: { type: String, attribute: 'allow-try' },
      allowServerSelection: { type: String, attribute: 'allow-server-selection' },
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSearch: { type: String, attribute: 'allow-search' },
      allowApiListStyleSelection: { type: String, attribute: 'allow-api-list-style-selection' },
      layout: { type: String },
      schemaStyle: { type: String, attribute: 'schema-style' },
      theme: { type: String },
      logoUrl: { type: String, attribute: 'logo-url' },
      apiKeyName: { type: String, attribute: 'api-key-name' },
      apiKeyValue: { type: String, attribute: 'api-key-value' },
      apiKeyLocation: { type: String, attribute: 'api-key-location' },
      apiListStyle: { type: String, attribute: 'api-list-style' },
      renderStyle: { type: String, attribute: 'render-style' },
      defaultSchemaTab: { type: String, attribute: 'default-schema-tab' },
      selectedServer: { type: String, attribute: 'default-api-server' },
    };
  }

  // Startup
  connectedCallback() {
    super.connectedCallback();
    if (!this.renderStyle || !'read view'.includes(this.renderStyle)) { this.renderStyle = 'view'; }
    if (!this.schemaStyle || !'tree table'.includes(this.schemaStyle)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light dark'.includes(this.theme)) { this.theme = 'light'; }
    if (!this.defaultSchemaTab || !'example model'.includes(this.defaultSchemaTab)) { this.defaultSchemaTab = 'model'; }
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
    return html`
      ${FontStyles}
      ${InputStyles}
      ${FlexStyles}
      ${TableStyles}
      ${this.theme === 'dark'
        ? html`<style>
          :host{
            --bg:#333;
            --bg2:#383838;
            --bg3:#444;
            --fg:#bbb;
            --fg2:#ababab;
            --fg3:#aaa;
            --light-fg:#777;
            --very-light-fg:#666;
            --pre-border-color:#666;
            --pre-fg:#fff;
            --pre-bg:#272727;
            --code-fg:#ccc;
            --code-bg:transparent;
            --border-color:#666;
            --input-bg:#303030;
            --input-border-color:#297aa2;
            --placeholder-color:#666;
            --light-border-color:#444;
            --light-get-color:#2a2a2a;
            --light-put-color:#2a2a2a;
            --light-post-color:#2a2a2a;
            --light-delete-color:#2a2a2a;
            --light-patch-color:#2a2a2a;
            --hover-color:#2a2a2a;
            --post-color:#99CC00;
          }
          </style>`
        : html`<style>
          :host{
            --bg:#fff;
            --bg2:#fefefe;
            --bg3:#fafafa;
            --fg:#333;
            --fg2:#444;
            --fg3:#565656;
            --light-fg:#999;
            --very-light-fg:#bbb;
            --pre-border-color:#4e575e;
            --pre-fg:#ccc;
            --pre-bg:#4e575e;
            --code-fg:#ccc;
            --code-bg:transparent;
            --border-color:#ccc;
            --input-bg:#fff;
            --input-border-color:#C5D9E8;
            --placeholder-color:#dedede;
            --light-border-color:#eee;
            --light-get-color:#eff8fd;
            --light-put-color:#fff5e6;
            --light-post-color:#fbfff0;
            --light-delete-color:#fff0f0;
            --light-patch-color:#fff5cc;
            --hover-color:#f1f1f1;
            --post-color:#1dae00;
          }
      </style>`}      
      <style>
        :host {
          --error-color:#ff3333;
          --success-color:#47AFE8;
          --hover-bg:#f7f7f7;
          --get-color:#47AFE8;
          --put-color:#FF9900;
          --delete-color:#F06560;
          --patch-color:#fc0;
          --link-color:#47AFE8;
          --primary-color:${this.primaryColor ? `${this.primaryColor}` : '#FF791A'};
          --dark-primary-color:${ColorUtils.color.brightness(this.primaryColor ? this.primaryColor : '#FF791A', -30)};
          --primary-text:${this.primaryColor ? `${ColorUtils.color.invert(this.primaryColor)}` : '#ffffff'};
          --header-bg:${this.headerColor ? `${this.headerColor}` : '#444'};
          --header-fg:${this.headerColor ? `${ColorUtils.color.invert(this.headerColor)}` : '#ccc'};
          --layout:${this.layout ? `${this.layout}` : 'row'};
          --font-mono:${this.monoFont ? `${this.monoFont}` : 'Monaco, "Andale Mono", "Roboto Mono", Consolas'}; 
          --font-regular:${this.regularFont ? `${this.regularFont}` : 'rapidoc, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" '};
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
        .body{
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
          background-color: var(--bg3);
          border-right: 1px solid var(--light-border-color);
          box-sizing:border-box;
          line-height: 16px;
          display:none;
          color:var(--fg3);
          position:relative;
          flex-direction:column;
          flex-wrap:nowrap;
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
          background: var(--bg3);
          height: 100%;  
          top: 0;
          right: 0;
          width: 16px;
          transition: all .3s;
          opacity: 1;
        }

        *:hover::-webkit-scrollbar {
          width: 30px;
        }

        .nav-bar-tag {
          font-size: var(--font-size-regular);
          font-weight:bold;
          padding: 30px 10px 7px 10px;
          text-transform: capitalize;
        }

        .nav-bar-info,
        .nav-bar-path {
          display:flex;
          cursor:pointer;
          border-left:4px solid transparent;
        }

        .nav-bar-path {
          font-size: var(--font-size-small);
          padding: 10px;
        }
        .nav-bar-info {
          font-size: var(--font-size-regular);
          padding: 16px 10px;
          font-weight:bold;
        }

        .nav-bar-info.active,
        .nav-bar-path.active {
          font-weight:bold;
          border-left:4px solid var(--primary-color);
          background-color:var(--hover-color);
        }

        .nav-bar-info:hover,
        .nav-bar-path:hover {
          background-color:var(--hover-color);
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
          background:${this.headerColor ? ColorUtils.color.brightness(this.headerColor, -20) : ColorUtils.color.inputReverseBg};
          color:var(--header-fg);
          border:1px solid var(--dark-primary-color);
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
              <div id = 'content-overview' class = '${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
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

              ${this.allowApiListStyleSelection === 'true'
                ? this.apiListingStyleSelectionTemplate()
                : ''
              }
              
              ${this.resolvedSpec.tags && this.resolvedSpec.pathGroups
                ? this.renderStyle === 'read'
                  ? this.endpointsExpandedTemplate()
                  : this.apiListStyle === 'group-by-path'
                    ? this.endpointsGroupedByPathTemplate()
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
          <div style="position:sticky; top:0; display:flex; align-items: center; padding:16px 24px; background: var(--bg3);">  
            <input id="nav-bar-search" type="text" placeholder="search" @change="${this.onSearchChange}" style="flex:1" spellcheck="false" >
            <div style="margin: 6px 5px 0 -24px; font-size:var(--title-font-size); cursor:pointer;">&#x23ce;</div>
            ${this.matchPaths
              ? html`
                <div style='margin-left:10px; cursor:pointer;' @click = '${this.onClearSearch}'> Clear </div>`
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
          <div class='nav-bar-tag' > ${tag.name}</div>
          ${tag.paths.filter((v) => {
            if (this.matchPaths) {
              return `${v.method} ${v.path} ${v.summary}`.toLowerCase().includes(this.matchPaths.toLowerCase());
            }
            return true;
          }).map((p) => html`
          <div class='nav-bar-path' data-goto_container='${tag.name.replace(/\s/g, '')}' id='${p.method}${p.path.replace(/\//g, '')}' @click='${(e) => this.scrollToEl(e)}'> 
            <span class="upper method-fg ${p.method}" style='display:inline-block; flex: 0 0 45px; font-size:10px'> ${p.method} </span>
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
    <div id = 'content-api-servers' class='regular-font ${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
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
      <div id='content-authentication' class = '${this.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap '}'>
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

  apiListingStyleSelectionTemplate() {
    return html`
      <div class="sub-title regular-font section-gap">GROUP API BY: </div>
      <div>
        <input type = 'radio' 
          name = 'apiListStyle' 
          value = 'group-by-tag' 
          @change = '${() => this.onListStyleChange('group-by-tag')}'
          .checked = "${this.apiListStyle === 'group-by-tag'}"
          style='margin:12px 0  0 24px' 
        />
        <span style='margin-right:10px'>Tag</span>  
        <input type='radio' 
          name = 'apiListStyle' 
          value = 'group-by-path' 
          @change = '${() => this.onListStyleChange('group-by-path')}'
          .checked = '${this.apiListStyle === 'group-by-path'}'
          style='margin:12px 0'
        />
        <span>Path</span>  
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
          > 
          </end-point>`)
        }`)
      }`;
  }

  endpointsGroupedByPathTemplate() {
    return html`
      ${(this.allowApiListStyleSelection === 'true' && this.resolvedSpec)
        ? html`<div class="sub-title tag regular-font section-gap">PATHS</div>`
        : ''
      }

      ${this.resolvedSpec.pathGroups.filter((pathObj) => {
        if (this.matchPaths) {
          return pathObj.path.includes(this.matchPaths);
        }
        return true;
      })
      .map((pathObj) => html`
        <path-and-methods 
          selected-server  = "${this.selectedServer ? this.selectedServer : ''}"  
          api-key-name     = "${this.apiKeyName ? this.apiKeyName : ''}"
          api-key-value    = "${this.apiKeyValue ? this.apiKeyValue : ''}"
          api-key-location = "${this.apiKeyLocation ? this.apiKeyLocation : ''}"
          layout           = "${this.layout ? this.layout : 'row'}"
          .path            = "${pathObj}" 
          allow-try        = "${this.allowTry ? this.allowTry : 'true'}"
          match-paths      = "${this.matchPaths}"
          schema-style     = "${this.schemaStyle}"
        ></path-and-methods>`)
      }`;
  }

  endpointsExpandedTemplate() {
    return html`
      ${this.resolvedSpec.tags.map((tag) => html`
        <div class='regular-font section-gap--read-mode' style="border-top:1px solid var(--primary-color);">
          <div class="title tag">${tag.name} </div>
          <div class="regular-font-size">
            ${unsafeHTML(`<div class='m-markdown regular-font'>${marked(tag.description ? tag.description : '')}</div>`)}
          </div>
        </div>
        <div class='regular-font section-gap--read-mode'>
          <end-points-expanded
            id = '${tag.name.replace(/\s/g, '')}'
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
          ></end-points-expanded>
        </div>
        `)
      }
    `;
  }
  /* eslint-enable indent */

  observeExpandedContent() {
    const containerEls = this.shadowRoot.querySelectorAll('end-points-expanded');
    /*
    if (containerEls.length === 0 && tryCount < 20) {
      setTimeout(() => { this.observeExpandedContent(tryCount + 1); }, 300);
      return;
    }
    */
    containerEls.forEach((el) => {
      const observeTargetEls = el.shadowRoot.querySelectorAll('.anchor');
      observeTargetEls.forEach((targetEl) => {
        this.intersectionObserver.observe(targetEl);
      });
    });

    const observeOverviewEls = this.shadowRoot.querySelectorAll('#content-overview, #content-api-servers, #content-authentication');
    observeOverviewEls.forEach((targetEl) => {
      this.intersectionObserver.observe(targetEl);
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'spec-url') {
      if (oldVal !== newVal) {
        this.loadSpec(newVal);
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

  onListStyleChange(selectedValue) {
    this.apiListStyle = selectedValue;
    this.requestUpdate();
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
      const spec = await ProcessSpec(specUrl);
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
    if (!this.apiListStyle) {
      this.apiListStyle = 'group-by-tag';
    }

    // Put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    window.setTimeout(() => {
      this.observeExpandedContent();
    }, 100);
    this.requestUpdate();
  }

  onIntersect(entries) {
    if (this.isIntersectionObserverActive === false) {
      return;
    }
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const oldNavEl = this.shadowRoot.querySelector('.nav-bar-path.active, .nav-bar-info.active');
        let newNavEl;
        if (entry.target.id.startsWith('content-')) {
          newNavEl = this.shadowRoot.getElementById(entry.target.id.replace('content-', ''));
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
    const navElId = e.currentTarget.id;
    let contentEl;
    if (['overview', 'api-servers', 'authentication'].includes(navElId)) {
      contentEl = this.shadowRoot.getElementById(`content-${navElId}`);
    } else {
      const containerEl = this.shadowRoot.getElementById(containerElId);
      contentEl = containerEl.shadowRoot.getElementById(navElId);
    }

    if (contentEl) {
      this.isIntersectionObserverActive = false;
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      const oldEl = this.shadowRoot.querySelector('.nav-bar-path.active, .nav-bar-info.active');
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
