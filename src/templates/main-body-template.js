import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import marked from 'marked';

// Templates
import expandedEndpointTemplate from '@/templates/expanded-endpoint-template';
import focusedEndpointTemplate from '@/templates/focused-endpoint-template';
import endpointTemplate from '@/templates/endpoint-template';
import serverTemplate from '@/templates/server-template';
import securitySchemeTemplate from '@/templates/security-scheme-template';
import componentsTemplate from '@/templates/components-template';
import contactInfoTemplate from '@/templates/contact-info-template';
import headerTemplate from '@/templates/header-template';
import navbarTemplate from '@/templates/navbar-template';

// Styles
import FontStyles from '@/styles/font-styles';
import InputStyles from '@/styles/input-styles';
import FlexStyles from '@/styles/flex-styles';
import TableStyles from '@/styles/table-styles';
import EndpointStyles from '@/styles/endpoint-styles';
import PrismStyles from '@/styles/prism-styles';
import TabStyles from '@/styles/tab-styles';
import NavStyles from '@/styles/nav-styles';

import SetTheme from '@/utils/theme';
import { isValidHexColor } from '@/utils/color-utils';

function infoDescriptionHeadingRenderer() {
  const renderer = new marked.Renderer();
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="overview--${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}

/* eslint-disable indent */

function overviewTemplate() {
  return html`
    <div id = 'overview' class = 'observe-me ${this.renderStyle === 'read' ? 'section-gap--read-mode' : (this.renderStyle === 'focused' ? 'section-gap--read-mode' : 'section-gap')}'>
      <div style = 'font-size:32px'>
        ${this.resolvedSpec.info.title}
        ${!this.resolvedSpec.info.version ? '' : html`
          <span style = 'font-size:var(--font-size-small);font-weight:bold'>
            ${this.resolvedSpec.info.version}
          </span>`
        }
      </div>

      ${this.resolvedSpec.info.description
        ? html`${unsafeHTML(`<div class='m-markdown regular-font'>${marked(this.resolvedSpec.info.description, { renderer: infoDescriptionHeadingRenderer() })}</div>`)}`
        : ''
      }
      ${this.resolvedSpec.info.termsOfService
        ? html`${unsafeHTML(`<div class='tiny-title' style="margin-top:8px"> Terms: </div> <span class='m-markdown regular-font'>${marked(this.resolvedSpec.info.termsOfService)}</span>`)}`
        : ''
      }
      ${this.resolvedSpec.info.contact ? contactInfoTemplate.call(this) : ''}
    </div>
  `;
}

export default function mainBodyTemplate() {
  const newTheme = {
    bg1: isValidHexColor(this.bgColor) ? this.bgColor : '',
    fg1: isValidHexColor(this.textColor) ? this.textColor : '',
    headerColor: isValidHexColor(this.headerColor) ? this.headerColor : '',
    primaryColor: isValidHexColor(this.primaryColor) ? this.primaryColor : '',
    navBgColor: isValidHexColor(this.navBgColor) ? this.navBgColor : '',
    navBgImage: this.navBgImage || '',
    navBgImageSize: this.navBgImageSize,
    navBgImageRepeat: this.navBgImageRepeat,
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
        --layout:${this.layout || 'row'};
        --font-mono:${this.monoFont || 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'}; 
        --font-regular:${this.regularFont || 'rapidoc, "Open Sans", BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

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
        overflow-y: auto;
        overflow-x: hidden;
      }
      .main-content-inner--view-mode{
        padding: 0 16px;
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
        .section-gap { 
          padding: 0 24px; 
        }
        .section-gap--focused-mode {
          padding: 24px; 
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
        .section-gap--focused-mode { 
          padding: 12px 100px 12px 100px; 
        }
        .section-gap--read-mode { 
          padding: 24px 100px 12px 100px; 
        }
      }
    </style>

    <!-- Header -->
    ${this.showHeader === 'false' ? '' : headerTemplate.call(this)}
    
    <div class="body">
      <!-- Side Nav -->
      ${((this.renderStyle === 'read' || this.renderStyle === 'focused') && this.resolvedSpec) ? navbarTemplate.call(this) : ''}
      
      <!-- Main Content -->
      <main class="main-content regular-font">
        <slot></slot>
        <div class="main-content-inner--${this.renderStyle}-mode">
          ${this.loading === true ? html`<div class="loader"></div>` : ''}
          ${this.loadFailed === true ? html`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>` : ''}
          ${this.resolvedSpec
            ? html`
              ${(this.showInfo === 'false' || !this.resolvedSpec.info)
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'overview' ? overviewTemplate.call(this) : '')
                  : overviewTemplate.call(this)
              }

              ${(this.allowTry === 'false' || this.allowServerSelection === 'false')
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'api-servers' ? serverTemplate.call(this) : '')
                  : serverTemplate.call(this)
              } 

              ${(this.allowAuthentication === 'false' || !this.resolvedSpec.securitySchemes)
                ? ''
                : this.renderStyle === 'focused'
                  ? (this.selectedContentId === 'authentication' ? securitySchemeTemplate.call(this) : '')
                  : securitySchemeTemplate.call(this)
              }
              <div @click="${(e) => { this.handleHref(e); }}">
                ${this.resolvedSpec.tags
                  ? this.renderStyle === 'read'
                    ? expandedEndpointTemplate.call(this)
                    : this.renderStyle === 'focused'
                      ? focusedEndpointTemplate.call(this)
                      : endpointTemplate.call(this)
                  : ''
                }
              </div>

              ${this.showComponents === 'true' ? componentsTemplate.call(this) : ''}
            `
            : ''
          }
        </div>  
        <slot name="footer"></slot>
      </main>
    </div>  
  `;
}
/* eslint-enable indent */
