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
import FontStyles from './styles/font-styles';
import InputStyles from './styles/input-styles';
import FlexStyles from './styles/flex-styles';
import TableStyles from './styles/table-styles';
import PrismStyles from './styles/prism-styles';
import TabStyles from './styles/tab-styles';
import NavStyles from './styles/nav-styles';
import InfoStyles from './styles/info-styles';

import EndpointStyles from './styles/endpoint-styles';
import ProcessSpec from './utils/spec-parser';
import jsonSchemaViewerTemplate from './templates/json-schema-viewer-template';
import { property } from 'lit/decorators.js';
import { RapiDocJSONSchemaViewerElement, ResolvedSpec } from '@rapidoc-types';

export default class JsonSchemaViewer extends LitElement implements RapiDocJSONSchemaViewerElement {
  // TODO: Typescript migration: existing properties used to be defined in the constructor
  public isMini = false;
  public updateRoute: 'true' | 'false' = 'false';
  public renderStyle = 'focused';
  public allowAdvancedSearch: 'true' | 'false' = 'false';
  public selectedExampleForEachSchema = {};

  // TODO Typescript migration: non existing properties used inside the class
  public pathsExpanded?: 'true' | 'false' | boolean;
  private matchType?: 'includes';
  public matchPaths?: string;
  public loadFailed?: boolean;
  public resolvedSpec?: ResolvedSpec | null;
  private generateMissingTags?: 'true' | 'false';
  private sortTags?: 'true' | 'false';
  cssClasses?: string | undefined;
  pageDirection?: 'rtl' | 'ltr' | undefined;
  layout?: 'row' | 'column' | undefined;
  navItemSpacing?: 'relaxed' | 'compact' | undefined;
  responseAreaHeight?: string | undefined;
  headingText?: string | undefined;
  onSpecFileChange: () => void = () => console.info('JsonSchemaViewer#onSpecFileChange not implemented');
  specFile?: string | undefined;
  onFileLoadClick: () => void = () => console.info('JsonSchemaViewer#onFileLoadClick not implemented');
  onShowSearchModalClicked: () => void = () => console.info('JsonSchemaViewer#onShowSearchModalClicked not implemented');
  infoDescriptionHeadingsInNavBar?: 'true' | 'false' | undefined;
  headerColor?: string | undefined;
  navBgColor?: string | undefined;
  navTextColor?: string | undefined;
  navHoverBgColor?: string | undefined;
  navHoverTextColor?: string | undefined;
  navAccentColor?: string | undefined;
  navAccentTextColor?: string | undefined;

  // Spec
  
  @property({ type: String, attribute: 'spec-url' },)
  public specUrl?: string; 

  // Schema Styles
  
  @property({ type: String, attribute: 'schema-style' },)
  public schemaStyle?: string; 
  
  @property({ type: Number, attribute: 'schema-expand-level' },)
  public schemaExpandLevel?: number; 
  
  @property({ type: String, attribute: 'schema-description-expanded' },)
  public schemaDescriptionExpanded?: 'true' | 'false';
  
  @property({ type: String, attribute: 'allow-schema-description-expand-toggle' },)
  public allowSchemaDescriptionExpandToggle?: 'true' | 'false';

  // Hide/show Sections
  
  @property({ type: String, attribute: 'show-header' },)
  public showHeader?: 'true' | 'false' = 'true'; 
  
  @property({ type: String, attribute: 'show-side-nav' },)
  public showSideNav?: string; 
  
  @property({ type: String, attribute: 'show-info' },)
  public showInfo?: 'true' | 'false'; 

  // Allow or restrict features
  
  @property({ type: String, attribute: 'allow-spec-url-load' },)
  public allowSpecUrlLoad?: 'true' | 'false'; 
  
  @property({ type: String, attribute: 'allow-spec-file-load' },)
  public allowSpecFileLoad?: 'true' | 'false'; 
  
  @property({ type: String, attribute: 'allow-spec-file-download' },)
  public allowSpecFileDownload?: 'true' | 'false'; 
  
  @property({ type: String, attribute: 'allow-search' },)
  public allowSearch?: 'true' | 'false'; 

  // Main Colors and Font
  
  @property({ type: String },)
  public theme?: 'dark' | 'light'; 
  
  @property({ type: String, attribute: 'bg-color' },)
  public bgColor?: string; 
  
  @property({ type: String, attribute: 'text-color' },)
  public textColor?: string; 
  
  @property({ type: String, attribute: 'primary-color' },)
  public primaryColor?: string; 
  
  @property({ type: String, attribute: 'font-size' },)
  public fontSize?: 'default' | 'large'; 
  
  @property({ type: String, attribute: 'regular-font' },)
  public regularFont?: string; 
  
  @property({ type: String, attribute: 'mono-font' },)
  public monoFont?: string; 
  
  @property({ type: String, attribute: 'load-fonts' },)
  public loadFonts?: string; 

  // Internal Properties
  
  @property({ type: Boolean }) // indicates spec is being loaded
  public loading?: boolean;
  static override get styles() {
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
      .nav-bar {
        width: 230px;
        display:flex;
      }

      .main-content { 
        margin:0;
        padding: 16px; 
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
  override connectedCallback() {
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

    this.renderStyle = 'focused';
    this.pathsExpanded = this.pathsExpanded === 'true';

    if (!this.showInfo || !'true, false,'.includes(`${this.showInfo},`)) { this.showInfo = 'true'; }
    if (!this.showSideNav || !'true false'.includes(this.showSideNav)) { this.showSideNav = 'true'; }
    if (!this.showHeader || !'true, false,'.includes(`${this.showHeader},`)) { this.showHeader = 'true'; }

    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) { this.schemaStyle = 'tree'; }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    if (!this.allowSearch || !'true, false,'.includes(`${this.allowSearch},`)) { this.allowSearch = 'true'; }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) { this.fontSize = 'default'; }
    if (!this.matchType || !'includes regex'.includes(this.matchType)) { this.matchType = 'includes'; }
    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) { this.allowSchemaDescriptionExpandToggle = 'true'; }

    marked.setOptions({
      highlight: (code, lang) => {
        if (Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
    });
  }

  override render() {
    return jsonSchemaViewerTemplate.call(this, true);
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
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  onSpecUrlChange() {
    this.setAttribute('spec-url', (this.shadowRoot?.getElementById('spec-url') as HTMLInputElement).value);
  }

  onSearchChange(e: Event) {
    // Todo: Filter Search
    this.matchPaths = (e.target as HTMLInputElement).value;
  }

  // Public Method
  async loadSpec(specUrl: string | null) {
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
        this.getAttribute('sort-endpoints-by') as 'method' | 'summary' | 'path' | 'none' | '',
      );
      this.loading = false;
      this.afterSpecParsedAndValidated(spec);
    } catch (err: any) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err?.message}`); // eslint-disable-line no-console
    }
  }

  async afterSpecParsedAndValidated(spec?: ResolvedSpec) {
    this.resolvedSpec = spec;
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);
  }

  // Called by anchor tags created using markdown
  handleHref(e: Event) {
    if ((e.target as HTMLLinkElement).tagName.toLowerCase() === 'a') {
      if ((e.target as HTMLLinkElement).getAttribute('href')?.startsWith('#')) {
        const gotoEl =  this.shadowRoot?.getElementById((e.target as HTMLElement)?.getAttribute('href')?.replace('#', '') || '')
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }

  // Example Dropdown @change Handler
  onSelectExample(e: Event) {
    const exampleContainerEl = (e.target as HTMLSelectElement).closest('.json-schema-example-panel') as HTMLElement;
    const exampleEls = [...exampleContainerEl.querySelectorAll('.example')] as HTMLElement[];
    exampleEls.forEach((v) => {
      v.style.display = v.dataset.example === (e.target as HTMLSelectElement).value ? 'flex' : 'none';
    });
  }

  async scrollToEventTarget(event: MouseEvent | KeyboardEvent) {
    const navEl = event.currentTarget as HTMLElement;
    if (!navEl.dataset.contentId) {
      return;
    }
    const contentEl = this.shadowRoot?.getElementById(navEl.dataset.contentId);
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}
customElements.define('json-schema-viewer', JsonSchemaViewer);
