import { css, LitElement } from 'lit';
import type { PropertyValues } from 'lit';
import { scheduleHighlight } from '~/utils/highlighter';

// Styles
import FontStyles from '~/styles/font-styles';
import InputStyles from '~/styles/input-styles';
import FlexStyles from '~/styles/flex-styles';
import TableStyles from '~/styles/table-styles';
import MicrolighterStyles from '~/styles/microlighter-styles';
import TabStyles from '~/styles/tab-styles';
import NavStyles from '~/styles/nav-styles';
import InfoStyles from '~/styles/info-styles';

import EndpointStyles from '~/styles/endpoint-styles';
import ProcessSpec from '~/utils/spec-parser';
import type { ResolvedJsonSchemaSpec } from '~/types/spec';
import jsonSchemaViewerTemplate from '~/templates/json-schema-viewer-template';
import '~/utils/markdown-utils';

export default class JsonSchemaViewer extends LitElement {
  specUrl?: string;
  schemaStyle!: string;
  schemaExpandLevel!: number;
  schemaDescriptionExpanded!: string;
  allowSchemaDescriptionExpandToggle!: string;
  showHeader!: string;
  showSideNav!: string;
  showInfo!: string;
  allowSpecUrlLoad?: string;
  allowSpecFileLoad?: string;
  allowSpecFileDownload?: string;
  allowSearch!: string;
  theme!: string;
  bgColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontSize!: string;
  regularFont?: string;
  monoFont?: string;
  loadFonts?: string;
  loading?: boolean;

  // Not reactive properties (never declared in `properties`)
  isMini: boolean;
  updateRoute: string;
  renderStyle: string;
  allowAdvancedSearch: string;
  selectedExampleForEachSchema: Record<string, string>;
  pathsExpanded?: string | boolean;
  matchType!: string;
  matchPaths?: string;
  generateMissingTags?: string;
  sortTags?: string;
  sortSchemas?: string;
  loadFailed?: boolean;
  resolvedSpec?: ResolvedJsonSchemaSpec | null;

  constructor() {
    super();
    this.isMini = false;
    this.updateRoute = 'false';
    this.renderStyle = 'focused';
    this.showHeader = 'true';
    this.allowAdvancedSearch = 'false';
    this.selectedExampleForEachSchema = {};
  }

  static override get properties() {
    return {
      // Spec
      specUrl: { type: String, attribute: 'spec-url' },

      // Schema Styles
      schemaStyle: { type: String, attribute: 'schema-style' },
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },

      // Hide/show Sections
      showHeader: { type: String, attribute: 'show-header' },
      showSideNav: { type: String, attribute: 'show-side-nav' },
      showInfo: { type: String, attribute: 'show-info' },

      // Allow or restrict features
      allowSpecUrlLoad: { type: String, attribute: 'allow-spec-url-load' },
      allowSpecFileLoad: { type: String, attribute: 'allow-spec-file-load' },
      allowSpecFileDownload: { type: String, attribute: 'allow-spec-file-download' },
      allowSearch: { type: String, attribute: 'allow-search' },

      // Main Colors and Font
      theme: { type: String },
      bgColor: { type: String, attribute: 'bg-color' },
      textColor: { type: String, attribute: 'text-color' },
      primaryColor: { type: String, attribute: 'primary-color' },
      fontSize: { type: String, attribute: 'font-size' },
      regularFont: { type: String, attribute: 'regular-font' },
      monoFont: { type: String, attribute: 'mono-font' },
      loadFonts: { type: String, attribute: 'load-fonts' },

      // Internal Properties
      loading: { type: Boolean }, // indicates spec is being loaded
    };
  }

  static override get styles() {
    return [
      FontStyles,
      InputStyles,
      FlexStyles,
      TableStyles,
      EndpointStyles,
      MicrolighterStyles,
      TabStyles,
      NavStyles,
      InfoStyles,
      css`
        :host {
          all: initial;
          display: flex;
          flex-direction: column;
          min-width: 360px;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          letter-spacing: normal;
          color: var(--fg);
          background: var(--bg);
          font-family: var(--font-regular);
          container-type: inline-size;
        }
        .body {
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        .nav-bar {
          width: 230px;
          display: flex;
        }

        .main-content {
          margin: 0;
          padding: 16px;
          display: block;
          flex: 1;
          height: 100%;
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
          background: transparent;
        }
        .main-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
        }
        .main-header {
          background: var(--header-bg);
          color: var(--header-fg);
          width: 100%;
        }
        .header-title {
          font-size: calc(var(--font-size-regular) + 8px);
          padding: 0 8px;
        }
        input.header-input {
          background: var(--header-color-darker);
          color: var(--header-fg);
          border: 1px solid var(--header-color-border);
          flex: 1;
          padding-right: 24px;
          border-radius: 3px;
        }
        input.header-input::placeholder {
          opacity: 0.4;
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
    }

    if (this.loadFonts !== 'false') {
      const fontDescriptor = {
        family: 'Open Sans',
        style: 'normal',
        weight: '300',
        unicodeRange:
          'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
      };
      const fontWeight300 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor
      );
      fontDescriptor.weight = '600';
      const fontWeight600 = new FontFace(
        'Open Sans',
        "url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2) format('woff2')",
        fontDescriptor
      );
      fontWeight300.load().then((font) => {
        document.fonts.add(font);
      });
      fontWeight600.load().then((font) => {
        document.fonts.add(font);
      });
    }

    this.renderStyle = 'focused';
    this.pathsExpanded = this.pathsExpanded === 'true';

    if (!this.showInfo || !'true, false,'.includes(`${this.showInfo},`)) {
      this.showInfo = 'true';
    }
    if (!this.showSideNav || !'true false'.includes(this.showSideNav)) {
      this.showSideNav = 'true';
    }
    if (!this.showHeader || !'true, false,'.includes(`${this.showHeader},`)) {
      this.showHeader = 'true';
    }

    if (!this.schemaStyle || !'tree, table,'.includes(`${this.schemaStyle},`)) {
      this.schemaStyle = 'tree';
    }
    if (!this.theme || !'light, dark,'.includes(`${this.theme},`)) {
      this.theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (!this.allowSearch || !'true, false,'.includes(`${this.allowSearch},`)) {
      this.allowSearch = 'true';
    }
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (!this.schemaDescriptionExpanded || !'true, false,'.includes(`${this.schemaDescriptionExpanded},`)) {
      this.schemaDescriptionExpanded = 'false';
    }
    if (!this.fontSize || !'default, large, largest,'.includes(`${this.fontSize},`)) {
      this.fontSize = 'default';
    }
    if (!this.matchType || !'includes regex'.includes(this.matchType)) {
      this.matchType = 'includes';
    }
    if (!this.allowSchemaDescriptionExpandToggle || !'true, false,'.includes(`${this.allowSchemaDescriptionExpandToggle},`)) {
      this.allowSchemaDescriptionExpandToggle = 'true';
    }
  }

  override render() {
    return jsonSchemaViewerTemplate.call(this, true);
  }

  override updated(changedProperties: PropertyValues) {
    super.updated?.(changedProperties);
    scheduleHighlight(this.shadowRoot!);
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
    this.setAttribute('spec-url', (this.shadowRoot!.getElementById('spec-url') as HTMLInputElement).value);
  }

  onSearchChange(e: Event) {
    // Todo: Filter Search
    const target = e.target as HTMLElement;
    const input =
      target instanceof HTMLInputElement ? target : (this.shadowRoot!.getElementById('nav-bar-search') as HTMLInputElement | null);
    this.matchPaths = input?.value ?? '';
  }

  // Public Method
  async loadSpec(specUrl: unknown) {
    if (!specUrl) {
      return;
    }
    try {
      this.resolvedSpec = {
        specLoadError: false,
        isSpecLoading: true,
        tags: [],
      } as unknown as ResolvedJsonSchemaSpec;
      this.loading = true;
      this.loadFailed = false;
      this.requestUpdate();
      const spec = await ProcessSpec.call(
        this,
        specUrl as Parameters<typeof ProcessSpec>[0],
        this.generateMissingTags === 'true',
        this.sortTags === 'true',
        this.sortSchemas === 'true',
        this.getAttribute('sort-endpoints-by'),
        '', // api-key-name (not applicable)
        '', // api-key-location (not applicable)
        '', // api-key-value (not applicable)
        '', // server-url (not applicable)
        this.getAttribute('match-paths') || '',
        this.getAttribute('match-type') || '',
        this.getAttribute('remove-endpoints-with-badge-label-as') || ''
      );
      this.loading = false;
      this.afterSpecParsedAndValidated(spec);
    } catch (err) {
      this.loading = false;
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${(err as Error).message}`);
    }
  }

  async afterSpecParsedAndValidated(spec: unknown) {
    this.resolvedSpec = spec as ResolvedJsonSchemaSpec;
    const specLoadedEvent = new CustomEvent('spec-loaded', { detail: spec });
    this.dispatchEvent(specLoadedEvent);
  }

  // Called by anchor tags created using markdown
  handleHref(e: Event) {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'a') {
      if (target.getAttribute('href')!.startsWith('#')) {
        const gotoEl = this.shadowRoot!.getElementById(target.getAttribute('href')!.replace('#', ''));
        if (gotoEl) {
          gotoEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }
  }

  // Example Dropdown @change Handler
  onSelectExample(e: Event) {
    const target = e.target as HTMLSelectElement;
    const exampleContainerEl = target.closest('.json-schema-example-panel')!;
    const exampleEls = [...exampleContainerEl.querySelectorAll<HTMLElement>('.example')];
    exampleEls.forEach((v) => {
      v.style.display = v.dataset['example'] === target.value ? 'flex' : 'none';
    });
  }

  async scrollToEventTarget(event: Event) {
    const navEl = event.currentTarget as HTMLElement;
    if (!navEl.dataset['contentId']) {
      return;
    }
    const contentEl = this.shadowRoot!.getElementById(navEl.dataset['contentId']);
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}
customElements.define('json-schema-viewer', JsonSchemaViewer);
