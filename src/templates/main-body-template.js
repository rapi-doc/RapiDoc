import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import marked from 'marked';

// Templates
import expandedEndpointTemplate from '@/templates/expanded-endpoint-template';
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
  renderer.heading = ((text, level, raw, slugger) => `<h${level} class="observe-me" id="${slugger.slug(raw)}">${text}</h${level}>`);
  return renderer;
}


export default function mainBodyTemplate(data) {
  const newTheme = {
    bg1: isValidHexColor(data.bgColor) ? data.bgColor : '',
    fg1: isValidHexColor(data.textColor) ? data.textColor : '',
    headerColor: isValidHexColor(data.headerColor) ? data.headerColor : '',
    primaryColor: isValidHexColor(data.primaryColor) ? data.primaryColor : '',
    navBgColor: isValidHexColor(data.navBgColor) ? data.navBgColor : '',
    navTextColor: isValidHexColor(data.navTextColor) ? data.navTextColor : '',
    navHoverBgColor: isValidHexColor(data.navHoverBgColor) ? data.navHoverBgColor : '',
    navHoverTextColor: isValidHexColor(data.navHoverTextColor) ? data.navHoverTextColor : '',
    navAccentColor: isValidHexColor(data.navAccentColor) ? data.navAccentColor : '',
  };

  /* eslint-disable indent */
  return html`
    ${FontStyles}
    ${InputStyles}
    ${FlexStyles}
    ${TableStyles}
    ${EndpointStyles}
    ${PrismStyles}
    ${TabStyles}
    ${NavStyles}
    ${data.theme === 'dark' ? SetTheme('dark', newTheme) : SetTheme('light', newTheme)}

    <style>
      :host {
        --layout:${data.layout ? `${data.layout}` : 'row'};
        --font-mono:${data.monoFont ? `${data.monoFont}` : 'Monaco, "Andale Mono", "Roboto Mono", Consolas, monospace'}; 
        --font-regular:${data.regularFont ? `${data.regularFont}` : 'rapidoc, "Open Sans", BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'};

        --font-size-mono: 13px;
        --font-size-regular: 14px;
        --font-size-small: 12px;
        --border-radius: 2px;
        --resp-area-height: ${data.responseAreaHeight};
        --nav-item-padding: ${data.navItemSpacing === 'relaxed' ? '10px' : data.navItemSpacing === 'compact' ? '3px 10px' : '6px 10px'};

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

    ${data.showHeader === 'false' ? '' : headerTemplate(data)}
    <div class="body">
      ${data.renderStyle === 'read' && data.resolvedSpec ? navbarTemplate(data) : ''}
      
      <div class="main-content regular-font ${data.renderStyle === 'read' ? 'main-content--read-mode' : ''} " style = "${data.renderStyle === 'read' ? 'padding:0' : ''}">
        <slot></slot>
        ${data.loading === true ? html`<div class="loader"></div>` : ''}
        ${data.loadFailed === true ? html`<div style="text-align: center;margin: 16px;"> Unable to load the Spec</div>` : ''}
        ${data.resolvedSpec
          ? html`
            ${(data.showInfo === 'false' || !data.resolvedSpec.info) ? '' : html`
            <div id = 'overview' class = 'observe-me ${data.renderStyle === 'read' ? 'section-gap--read-mode' : 'section-gap'}'>
              <div style = 'font-size:32px'>
                ${data.resolvedSpec.info.title}
                ${!data.resolvedSpec.info.version ? '' : html`
                  <span style = 'font-size:var(--font-size-small);font-weight:bold'>
                    ${data.resolvedSpec.info.version}
                  </span>`
                }
              </div>

              ${data.resolvedSpec.info.description
                ? html`${unsafeHTML(`<div class='m-markdown regular-font'>${marked(data.resolvedSpec.info.description, { renderer: infoDescriptionHeadingRenderer() })}</div>`)}`
                : ''
              }
              ${data.resolvedSpec.info.termsOfService
                ? html`${unsafeHTML(`<div class='tiny-title' style="margin-top:8px"> Terms: </div> <span class='m-markdown regular-font'>${marked(data.resolvedSpec.info.termsOfService)}</span>`)}`
                : ''
              }
              ${data.resolvedSpec.info.contact ? contactInfoTemplate(data) : ''}
            </div>`
            }

            ${(data.allowTry === 'false' || data.allowServerSelection === 'false')
              ? ''
              : serverTemplate.call(this, data)
            } 

            ${(data.allowAuthentication === 'false' || !data.resolvedSpec.securitySchemes)
              ? ''
              : securitySchemeTemplate.call(this, data)
            }
            <div @click="${(e) => { data.handleHref(e); }}">
              ${data.resolvedSpec.tags
                ? data.renderStyle === 'read'
                  ? expandedEndpointTemplate.call(this, data)
                  : endpointTemplate.call(this, data)
                : ''
              }
            </div>

            ${data.showComponents === 'true' ? componentsTemplate(data) : ''}
          `
          : ''
        }
        <slot name="footer"></slot>
      </div>
    </div>  
  `;
}
/* eslint-enable indent */
