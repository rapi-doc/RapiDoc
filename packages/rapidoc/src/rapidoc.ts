import { LitElement, noChange } from "lit";
import { customElement, property } from "lit/decorators.js";
import { fixRenderedAnchorLinks } from "~/utils/markdown-utils";
import { marked } from "marked";
import Slugger from "github-slugger";
import { scheduleHighlight } from "~/utils/highlighter";

// Styles
import FontStyles from "~/styles/font-styles";
import InputStyles from "~/styles/input-styles";
import FlexStyles from "~/styles/flex-styles";
import AuthStyles from "~/styles/auth-styles";
import ParamListStyles from "~/styles/param-list-styles";
import EndpointStyles from "~/styles/endpoint-styles";
import MicrolighterStyles from "~/styles/microlighter-styles";
import TabStyles from "~/styles/tab-styles";
import NavStyles from "~/styles/nav-styles";
import InfoStyles from "~/styles/info-styles";
import CustomStyles from "~/styles/custom-styles";
import DialogBoxStyles from "~/styles/dialog-box-styles";
import LayoutStyles from "~/styles/layout-styles";
import ThemeTokens, {
  DEFAULT_THEME,
  applyCustomTheme,
  isValidHexColor,
  normalizeTheme,
} from "~/styles/theme-tokens";

import {
  advancedSearch,
  getMatchedPaths,
  getMatchedComponents,
  rapidocApiKey,
  sleep,
} from "~/utils/common-utils";
import ProcessSpec from "~/utils/spec-parser";
import { enableMockServer, disableMockServer, updateMockConfig } from "~/utils/mock-interceptor";
import mainBodyTemplate from "~/templates/main-body-template";
import { expandParentNavContainers } from "~/templates/navbar-template";
import { applyApiKey, onClearAllApiKeys } from "~/templates/security-scheme-template";
import { setApiServer } from "~/templates/server-template";
import {
  generateMcpServer as mcpServerGenerator,
  buildMcpManifest,
  estimateTokenCost,
  parseMcpEnabled,
  createZip,
} from "~/utils/mcp-generator";
import { bindNavBar } from "~/utils/bind-navbar";
import { methodPathSlug } from "~/utils/slugger";
import { AutoColorSchemeController } from "~/utils/auto-color-scheme";

const paramsConverter = {
  fromAttribute: (attr) => {
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
  toAttribute: (prop) => {
    if (typeof prop === "object" && prop !== null) {
      return JSON.stringify(prop);
    }
    return prop;
  },
};

// Input that marks the reader's first interaction with the page (see getContentScrollBehavior)
const INTERACTION_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"];

/**
 * `<rapi-doc>`: an OpenAPI reference with a built-in console.
 *
 * The doc comments in this class are the element's public API reference. `scripts/rapidoc-api.js` reads
 * them, with each attribute's type and initial value, into the manifest that the docs /api page and the
 * metadata in dist/ (schema, custom elements manifest, types) are built from. Descriptions are HTML.
 *
 * On an attribute: `@summary` (one line, for places too small for the description, such as the tuner),
 * `@group` (heading on /api), `@default` (when it is not the initial value),
 * `@allowedNote`, `@example` (a page showing it), `@hidden` (kept off /api), `@internal` (not an
 * attribute for page authors). On a method: `@public` (followed by the signature to document, when the
 * method takes internal arguments too), `@example`, `@code`. On the class: `@fires`,
 * `@slot`, and `@deprecatedAttr name | group | allowed values | default | description` for an attribute
 * the element no longer reads.
 *
 * @fires before-render - Dispatched before rendering starts. Provides the parsed OpenAPI
 * specification object via <span class="mono yellow">e.detail.spec</span>, allowing programmatic
 * modifications before the UI tree is built.
 * @fires spec-loaded - Dispatched after the OpenAPI specification has been fully fetched, parsed,
 * resolved, and rendered into the DOM. Provides the resolved spec object in <span class="mono
 * yellow">e.detail</span>.
 * @fires nav-active-change - Dispatched when the active section changes, either through
 * programmatic navigation (<span class="mono yellow">scrollToPath</span>, a hash change) or because
 * scrolling brought a different operation or tag into view. Bubbles and is composed, so a
 * page-level listener outside the shadow DOM receives it. <span class="mono
 * yellow">e.detail.id</span> and <span class="mono yellow">e.detail.elementId</span> carry the
 * section's element id; <span class="mono yellow">e.detail.operationId</span> is set when the
 * section is an operation. Static sidebars rendered with <span class="mono
 * yellow">@rapidoc/prerender</span> and <span class="mono yellow">bindNavBar</span> use it to
 * highlight the current item.
 * @fires before-try - Dispatched when a user clicks "TRY" before the network request is initiated.
 * Provides a mutable <a href="https://developer.mozilla.org/en-US/docs/Web/API/Request"
 * target="_blank" rel="noopener">Request-like object</a> via <span class="mono
 * yellow">e.detail.request</span> to append headers, rewrite parameters, or modify payloads, along
 * with an <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
 * target="_blank" rel="noopener">AbortController</a> via <span class="mono
 * yellow">e.detail.controller</span> to abort requests conditionally. <br/><br/> <span
 * class="yellow">Example:</span> Append custom authorization headers before sending:
 * <pre><code class="language-js"> rapidocEl.addEventListener('before-try', (e) => {
 *   if (e.detail.request.method === 'POST') {
 *     e.detail.request.headers.append('X-Tenant-ID', 'corp-acme-123');
 *   }
 * }); </code></pre>
 * <span class="yellow">Example:</span> Append query parameters to all GET requests:
 * <pre><code class="language-js"> rapidocEl.addEventListener('before-try', (e) => {
 *   if (e.detail.request.method === 'GET') {
 *     const url = new URL(e.detail.request.url);
 *     url.searchParams.append('client_version', '2.4.0');
 *     e.detail.request.url = url.toString();
 *   }
 * }); </code></pre>
 * <span class="yellow">Example:</span> Abort specific requests conditionally:
 * <pre><code class="language-js"> rapidocEl.addEventListener('before-try', (e) => {
 *   if (e.detail.request.method === 'DELETE') {
 *     alert('DELETE operations are disabled in this sandbox environment.');
 *     e.detail.controller.abort();
 *   }
 * }); </code></pre>
 * @fires after-try - Dispatched after a try request completes. Provides <span class="mono
 * yellow">e.detail.request</span> and <span class="mono yellow">e.detail.response</span>. In the
 * event of a network or protocol error, provides request and error objects.
 * @fires request-aborted - Dispatched when an in-flight API try request is aborted by the user or
 * programmatically via AbortController.
 * @fires api-server-change - Dispatched when the active target API server is modified in the
 * dropdown.
 * @fires before-authorize - Dispatched immediately before opening the OAuth authorization popup
 * window. Provides <span class="mono yellow">e.detail.securitySchemeId</span>, <span class="mono
 * yellow">e.detail.flowType</span>, <span class="mono yellow">e.detail.authUrl</span>, and mutable
 * <span class="mono yellow">e.detail.authParams</span> (<a
 * href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank"
 * rel="noopener">URLSearchParams</a>). Calling <span class="mono yellow">e.preventDefault()</span>
 * cancels opening the authorization window. <br/><br/> <span class="yellow">Example:</span>
 * Dynamically inject a launch token or proxy parameter:
 * <pre><code class="language-js"> rapidocEl.addEventListener('before-authorize', (e) => {
 *   e.detail.authParams.set('launch', 'xyz123');
 * }); </code></pre>
 * @fires before-token-request - Dispatched immediately before sending the POST request to the
 * OAuth2 token endpoint. Provides <span class="mono yellow">e.detail.securitySchemeId</span>, <span
 * class="mono yellow">e.detail.grantType</span>, <span class="mono
 * yellow">e.detail.tokenUrl</span>, mutable <span class="mono yellow">e.detail.params</span> (<a
 * href="https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" target="_blank"
 * rel="noopener">URLSearchParams</a>), <span class="mono yellow">e.detail.headers</span> (<a
 * href="https://developer.mozilla.org/en-US/docs/Web/API/Headers" target="_blank"
 * rel="noopener">Headers</a>), and mutable <span class="mono yellow">e.detail.request</span>.
 * Calling <span class="mono yellow">e.preventDefault()</span> cancels the token request. <br/><br/>
 * <span class="yellow">Example:</span> Add a custom token audience or header:
 * <pre><code class="language-js"> rapidocEl.addEventListener('before-token-request', (e) => {
 *   e.detail.params.set('audience', 'https://api.mycompany.com');
 *   e.detail.headers.set('X-Client-Version', '1.0.0');
 * }); </code></pre>
 *
 * @slot - Any standard markup placed directly inside the `<rapi-doc>` tag renders immediately below
 * the header bar and above the specification info overview.
 * @slot logo - Custom HTML or image markup to replace the default brand logo in the top header bar.
 * @slot header - Custom HTML elements rendered in the top header bar following the spec URL input
 * controls.
 * @slot footer - Custom HTML elements rendered at the bottom of the documentation canvas.
 * @slot nav-logo - Custom image or branding markup placed at the top of the sidebar navigation
 * panel (available in read mode).
 * @slot overview - Custom HTML rendered inside the overview section at the top of the document.
 * Link directly to this anchor using <span class="mono yellow">#overview</span>.
 * @slot servers - Custom HTML rendered inside the server configuration section located under the
 * overview container. Link directly using <span class="mono yellow">#servers</span>.
 * @slot auth - Custom HTML rendered inside the authentication controls panel under the overview
 * section. Link directly using <span class="mono yellow">#auth</span>.
 * @slot operations-top - Custom HTML displayed directly above the operations list. Use this slot to
 * provide global announcements, common headers, or usage instructions applicable across all API
 * calls. Link directly using <span class="mono yellow">#operations-top</span>.
 * @slot tag--{tag-name} - Inserts custom HTML content underneath a specific tag grouping identified
 * by tag name.
 * @slot {method}-{path} - Inserts custom HTML into a specific endpoint section. Identified by <span
 * class="mono yellow">{method}-{path}</span>, where special characters such as brackets, spaces,
 * and hashes are replaced by hyphens (e.g. <span class="mono yellow">get-/pet/-petId-</span>).
 *
 * @deprecatedAttr nav-active-item-marker | Sidebar & Navigation | left-bar, colored-block |
 * left-bar | <span class="red bold">[DEPRECATED]</span> RapiDoc now standardizes on the modern
 * left-bar active indicator across all modes.
 * @deprecatedAttr on-nav-tag-click | Sidebar & Navigation | expand-collapse, show-description |
 * expand-collapse | <span class="red bold">[DEPRECATED]</span> A click on a tag's name shows the
 * tag's description; a click on its arrow expands or collapses it.<br/> Previously configured
 * sidebar tag click behavior in focused mode.
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
@customElement("rapi-doc")
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
    // Set on the reader's first pointer, key, wheel or touch input (see getContentScrollBehavior)
    this._readerHasInteracted = false;
    this._onFirstInteraction = null;
    this._onHashChange = null;
    // Spec loads carry a token; only the latest load may apply its result (see loadSpec)
    this._specLoadSeq = 0;
    // The spec-url attribute value whose load has been handled, or that an inlined spec superseded
    this._lastSpecUrlRequested = null;
    // The spec (URL or object) of the latest load: a filter-operations change re-filters this one
    this._lastLoadedSpec = null;
    this.initIntersectionObserver();
  }

  // Spec & Content
  /**
   * URL of the OpenAPI specification file (JSON or YAML) to load and render.
   * @group Spec & Content
   */
  @property({ type: String, attribute: "spec-url" })
  specUrl = "";

  /**
   * Sorts tags in alphabetical order. When set to "false", preserves the tag order defined in the
   * OpenAPI specification.
   * @summary Alphabetically sort tag sections in sidebar
   * @group Spec & Content
   */
  @property({ type: String, attribute: "sort-tags" })
  sortTags: "true" | "false" = "false";

  /**
   * Sorts component schemas alphabetically. When set to "false", preserves the order defined in the
   * spec. <span class="orange bold">Note:</span> Only has an effect if <span class="mono
   * yellow">render-style="focused"</span> and <span class="mono
   * yellow">show-components="true"</span>.
   * @group Spec & Content
   */
  @property({ type: String, attribute: "sort-schemas" })
  sortSchemas: "true" | "false" = "false";

  /**
   * Sorts endpoints within each tag group by path, HTTP method, or summary. 'none' leaves the sort
   * order unmodified.<br/> <span class="green">ⓘ This is a static initialization attribute. It will
   * not have any effect if modified using JavaScript after the spec is rendered.</span>
   * @group Spec & Content
   * @example /examples/arrange-by-tags
   */
  @property({ type: String, attribute: "sort-endpoints-by" })
  sortEndpointsBy: "path" | "method" | "summary" | "none" = "path";

  /**
   * Shows tags that no operation uses, as long as they have a <span class="mono
   * fg-color">description</span>, so a tag can hold a guide or concepts section (written in
   * markdown) next to the operations. Each such tag gets a section and a sidebar link. When
   * "false", tags without operations are left out, except those the spec lists in <span class="mono
   * fg-color">x-tagGroups</span>, which show either way.<br/> <span class="green">ⓘ This is a
   * static initialization attribute. It will not have any effect if modified using JavaScript after
   * the spec is rendered.</span>
   * @group Spec & Content
   */
  @property({ type: String, attribute: "show-unused-tags" })
  showUnusedTags: "true" | "false" = "false";

  /**
   * Groups operations that have no tag under a tag made from the first segment of their path.
   * @group Spec & Content
   * @hidden
   */
  @property({ type: String, attribute: "generate-missing-tags" })
  generateMissingTags: "true" | "false" = "false";

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
   * @example /examples/search
   */
  @property({ type: String, attribute: "filter-operations" })
  filterOperations = "";

  // Layout & Scrolling
  /**
   * Controls the overall documentation presentation layout. Three distinct modes are supported:
   * <ul> <li> <span class="yellow">view</span>: Optimized for interactive exploration with
   * collapsible operations | <a href="/examples/render-view">Example</a> </li> <li> <span
   * class="yellow">read</span>: Continuous narrative page layout, ideal for reading through API
   * specifications from top to bottom | <a href="/examples/render-read">Example</a> </li> <li>
   * <span class="yellow">focused</span>: Displays a single endpoint at a time with a dedicated
   * sidebar, ideal for large enterprise schemas | <a href="/examples/render-focused">Example</a>
   * </li> </ul>
   * @summary Display mode: Read for docs, View with tabs, Focused for single endpoint
   * @group Layout & Scrolling
   */
  @property({ type: String, attribute: "render-style" })
  renderStyle: "read" | "view" | "focused" = "read";

  /**
   * Controls the multi-column orientation of request parameters and response panels on desktop
   * screens (>768px). In 'row' layout, request and response sections sit side-by-side; in 'column'
   * layout, they stack vertically. Defaults to 'column' when render-style is 'read' or 'focused',
   * and 'row' when render-style is 'view'.
   * @summary Request and response layout: row (side-by-side) or column (stacked)
   * @group Layout & Scrolling
   * @default column (read, focused) / row (view)
   */
  @property({ type: String, reflect: true })
  layout: "row" | "column" = "row";

  /**
   * <span class="yellow-dim">Allowed: </span>Any valid CSS height value (e.g. 400px, 50%,
   * 60vh).<br/> Controls the vertical height of the interactive response payload viewer.
   * @group Layout & Scrolling
   */
  @property({ type: String, attribute: "response-area-height" })
  responseAreaHeight = "400px";

  /**
   * Text direction of the page.
   * @group Layout & Scrolling
   * @hidden
   */
  @property({ type: String, attribute: "page-direction" })
  pageDirection: "ltr" | "rtl" = "ltr";

  /**
   * <span class="yellow-dim">Allowed: </span>A number of pixels (e.g. 96).<br/> With
   * <code>auto-height="true"</code>, where the page scrolls instead of RapiDoc, this is the height
   * of a sticky or fixed page header. Navigation scrolls a section to just below it, and the active
   * navigation item ignores sections hidden under it. When not set, RapiDoc uses the scroll root's
   * <code>scroll-padding-top</code>, so a page that already sets it needs no extra configuration.
   * @group Layout & Scrolling
   * @default (scroll-padding-top of the page)
   */
  @property({ type: String, attribute: "scroll-offset" })
  scrollOffset = "";

  /**
   * How the page scrolls when a navigation item is clicked.
   * @group Layout & Scrolling
   * @hidden
   */
  @property({ type: String, attribute: "scroll-behavior" })
  scrollBehavior: "smooth" | "auto" = "smooth";

  /**
   * CSS selector of the ancestor element that scrolls, when it cannot be detected.
   * @group Layout & Scrolling
   * @hidden
   */
  @property({ type: String, attribute: "scroll-container" })
  scrollContainer = "";

  /**
   * Lets the element grow to the height of its content, so the host page scrolls instead of the
   * element.
   * @group Layout & Scrolling
   * @hidden
   */
  @property({ type: String, attribute: "auto-height" })
  autoHeight: "true" | "false" = "false";

  // Theme
  /**
   * Brand color preset, or a custom brand color as a hex code. Each preset defines a dark and a
   * light palette.
   * @summary Color palette preset
   * @group Theme
   * @allowedNote (or custom hex color e.g. #2563eb)
   * @default ember
   * @example /examples/themes
   */
  @property({ type: String, reflect: true })
  theme: "ember" | "carbon" | "cobalt" | "jade" | "indigo" | (string & {}) = DEFAULT_THEME;

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
   * A custom brand color as a hex code. Same as passing the hex code to <span class="mono
   * yellow">theme</span>.
   * @group Theme
   * @hidden
   */
  @property({ type: String, attribute: "primary-color" })
  primaryColor = "";

  /**
   * File name of a stylesheet the page already loads with a <span class="yellow
   * mono">&lt;link&gt;</span> tag. Its rules are copied into the shadow DOM.
   * @group Theme
   * @hidden
   */
  @property({ type: String, attribute: "css-file" })
  cssFile = "";

  /**
   * Space-separated CSS class names, defined in <span class="yellow mono">css-file</span>, to add
   * to the element's root.
   * @group Theme
   * @hidden
   */
  @property({ type: String, attribute: "css-classes" })
  cssClasses = "";

  // Sidebar & Navigation
  /**
   * The navigation sidebar (read and focused modes). <span class="mono yellow">true</span> docks
   * it beside the content on wide layouts and turns it into a menu button with a slide-over menu
   * when the element is narrower than 768px; <span class="mono yellow">floating</span> uses the
   * menu button and slide-over menu at every width, so the content takes the whole width;
   * <span class="mono yellow">false</span> shows no sidebar.
   * @summary Docked, floating or no navigation sidebar
   * @group Sidebar & Navigation
   */
  @property({ type: String, attribute: "show-side-nav" })
  showSideNav: "true" | "false" | "floating" = "true";

  /**
   * Displays HTTP methods (GET, POST, etc.) alongside endpoint items in the navigation sidebar.
   * Ensure sufficient contrast if customizing nav-bg-color.
   * @summary Sidebar HTTP method badge presentation style
   * @group Sidebar & Navigation
   * @example /examples/nav-item-with-method
   */
  @property({ type: String, attribute: "show-method-in-nav-bar" })
  showMethodInNavBar: "false" | "as-plain-text" | "as-colored-text" | "as-colored-block" = "false";

  /**
   * Displays raw API URL paths in the navigation bar instead of operation summaries. <div
   * class="orange"> <span class="bold yellow-dim">NOTE: </span> Setting this to <span class="mono
   * yellow">true</span> displays the path only. To display the HTTP method alongside the path, also
   * configure <span class="mono yellow">show-method-in-nav-bar</span>. </div>
   * @summary Show URL paths instead of summaries in the sidebar
   * @group Sidebar & Navigation
   * @example /examples/nav-item-as-path
   */
  @property({ type: String, attribute: "use-path-in-nav-bar" })
  usePathInNavBar: "true" | "false" = "false";

  /**
   * Controls vertical density and padding between sidebar navigation items.
   * @summary Vertical spacing between sidebar navigation items
   * @group Sidebar & Navigation
   * @example /examples/navbar-spacing
   */
  @property({ type: String, attribute: "nav-item-spacing", reflect: true })
  navItemSpacing: "default" | "compact" | "relaxed" = "default";

  /**
   * Controls text truncation behavior for long endpoint paths and operation summaries in the
   * navigation sidebar. When set to <span class="mono yellow">ellipsis</span> (default), long paths
   * truncate with a clean ellipsis. When set to <span class="mono yellow">wrap</span>, long items
   * wrap across multiple lines without clipping.
   * @group Sidebar & Navigation
   */
  @property({ type: String, attribute: "nav-item-overflow", reflect: true })
  navItemOverflow: "ellipsis" | "wrap" = "ellipsis";

  /**
   * Extracts Markdown headings (H1 and H2) from the specification's info description and adds them
   * to the sidebar navigation menu (read mode only).
   * @summary Extract H1 and H2 markdown headings into sidebar navigation
   * @group Sidebar & Navigation
   * @example /examples/markdown-headings
   */
  @property({ type: String, attribute: "info-description-headings-in-navbar" })
  infoDescriptionHeadingsInNavBar: "true" | "false" = "false";

  /**
   * When set to "true", automatically updates the browser's URL address hash as the user scrolls
   * through or clicks on different sections.
   * @summary Update browser URL hash when navigating endpoints
   * @group Sidebar & Navigation
   */
  @property({ type: String, attribute: "update-route" })
  updateRoute: "true" | "false" = "true";

  /**
   * Target endpoint location to navigate to automatically after the specification finishes loading.
   * Must be provided in the format of <span class="mono fg-color">{method}-{path}</span> (e.g., to
   * focus on <span class="mono fg-color">GET /user/login</span>, provide <span class="mono
   * fg-color">get-/user/login</span>).
   * @group Sidebar & Navigation
   */
  @property({ type: String, attribute: "goto-path" })
  gotoPath = "";

  // Header & Sections
  /**
   * Toggles the top navigation header bar. Set to <span class="mono fg-color">false</span> to
   * prevent users from loading alternative spec URLs or to seamlessly embed inside existing
   * layouts.
   * @summary Display the top navbar header
   * @group Header & Sections
   */
  @property({ type: String, attribute: "show-header" })
  showHeader: "true" | "false" = "true";

  /**
   * Custom title text displayed on the top-left corner of the header.
   * @summary Top header title text
   * @group Header & Sections
   */
  @property({ type: String, attribute: "heading-text" })
  headingText = "";

  /**
   * Toggles visibility of the OpenAPI document info section (title, description, version, terms of
   * service). Useful when embedding `<rapi-doc>` into an existing developer portal or knowledge
   * base that already contains its own header.
   * @summary Display OpenAPI document title and overview info
   * @group Header & Sections
   */
  @property({ type: String, attribute: "show-info" })
  showInfo: "true" | "false" = "true";

  /**
   * Toggles the components section (schemas, responses, examples, request bodies, headers, security
   * schemes) in both the document body and sidebar menu (available in focused render-style).
   * @summary Show the components section
   * @group Header & Sections
   */
  @property({ type: String, attribute: "show-components" })
  showComponents: "true" | "false" = "false";

  /**
   * Enables the instant search and filtering input in the navigation sidebar.
   * @summary Enable quick endpoint search bar
   * @group Header & Sections
   */
  @property({ type: String, attribute: "allow-search" })
  allowSearch: "true" | "false" = "true";

  /**
   * Enables deep multi-property search modal, indexing paths, descriptions, parameter names, and
   * response schemas.
   * @summary Enable advanced full-text schema and parameter search
   * @group Header & Sections
   * @example /examples/search
   */
  @property({ type: String, attribute: "allow-advanced-search" })
  allowAdvancedSearch: "true" | "false" = "true";

  /**
   * When set to <span class="mono fg-color">false</span>, disables the input field allowing users
   * to load arbitrary external OpenAPI specification URLs.
   * @summary Allow loading arbitrary OpenAPI spec by URL
   * @group Header & Sections
   */
  @property({ type: String, attribute: "allow-spec-url-load" })
  allowSpecUrlLoad: "true" | "false" = "true";

  /**
   * When set to <span class="mono fg-color">false</span>, hides the file picker allowing users to
   * upload and preview local OpenAPI spec files (desktop viewports >768px).
   * @summary Allow uploading and viewing local OpenAPI spec file
   * @group Header & Sections
   */
  @property({ type: String, attribute: "allow-spec-file-load" })
  allowSpecFileLoad: "true" | "false" = "true";

  /**
   * When set to <span class="mono fg-color">true</span>, displays convenient buttons in the
   * overview section to download the raw OpenAPI specification file or view it in a new tab.
   * @summary Show download button for the active OpenAPI spec
   * @group Header & Sections
   */
  @property({ type: String, attribute: "allow-spec-file-download" })
  allowSpecFileDownload: "true" | "false" = "false";

  // Schemas
  /**
   * Controls the visual representation of complex JSON schemas in request and response panels.
   * 'tree' provides an interactive collapsible tree view; 'table' renders structured tabular rows.
   * @summary Display schemas as visual table or tree hierarchy
   * @group Schemas
   * @example /examples/schema-styles
   */
  @property({ type: String, attribute: "schema-style" })
  schemaStyle: "tree" | "table" = "tree";

  /**
   * Initial depth level for auto-expanding complex nested schema properties and sub-objects (the
   * default expands all levels).
   * @summary Initial expansion depth for nested schemas
   * @group Schemas
   * @example /examples/schema-expand-level
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
   * Shows or hides the button allowing users to toggle between single-line summary and multi-line
   * detailed schema property descriptions.
   * @summary Show toggle button for multiline schema descriptions
   * @group Schemas
   */
  @property({ type: String, attribute: "allow-schema-description-expand-toggle" })
  allowSchemaDescriptionExpandToggle: "true" | "false" = "true";

  /**
   * 'default' hides read-only properties in request bodies while displaying them in response models
   * and webhook callbacks. Set to 'never' to always display read-only fields across all payloads.
   * <span class="orange">Note: This does not affect example generation.</span>
   * @summary Hide read-only fields from request body schemas
   * @group Schemas
   * @example /examples/hide-read-only-write-only
   */
  @property({ type: String, attribute: "schema-hide-read-only" })
  schemaHideReadOnly: "default" | "never" = "default";

  /**
   * 'default' hides write-only properties in response bodies while displaying them in request
   * payloads. Set to 'never' to always display write-only fields across all payloads. <span
   * class="orange">Note: This does not affect example generation.</span>
   * @summary Hide write-only fields from response body schemas
   * @group Schemas
   * @example /examples/hide-read-only-write-only
   */
  @property({ type: String, attribute: "schema-hide-write-only" })
  schemaHideWriteOnly: "default" | "never" = "default";

  /**
   * Selects which tab is active by default, and listed first, for request bodies, responses and
   * object parameters: 'schema' (data contract model) or 'example' (sample JSON payload).
   * @summary Default active tab in request and response bodies
   * @group Schemas
   */
  @property({ type: String, attribute: "default-schema-tab" })
  defaultSchemaTab: "schema" | "example" = "example";

  // Try & Servers
  /**
   * Enables the interactive "TRY" console allowing users to test live API calls directly from their
   * browser.
   * @summary Live interactive endpoint testing console
   * @group Try & Servers
   * @example /examples/try
   */
  @property({ type: String, attribute: "allow-try" })
  allowTry: "true" | "false" = "true";

  /**
   * When set to <span class="mono fg-color">true</span>, generates and displays copyable cURL
   * commands directly within the endpoint documentation prior to clicking "TRY".
   * @summary Display cURL command before invoking API
   * @group Try & Servers
   * @example /examples/show-curl-before-try
   */
  @property({ type: String, attribute: "show-curl-before-try" })
  showCurlBeforeTry: "true" | "false" = "false";

  /**
   * Pre-populates interactive request parameter inputs and request body fields using example values
   * defined in the OpenAPI spec.
   * @summary Pre-populate "Try" console parameters with sample values
   * @group Try & Servers
   */
  @property({ type: String, attribute: "fill-request-fields-with-example" })
  fillRequestFieldsWithExample: "true" | "false" = "true";

  /**
   * Enables the dropdown allowing users to switch between target servers declared in the OpenAPI
   * spec.
   * @summary Allow switching between configured API server URLs
   * @group Try & Servers
   */
  @property({ type: String, attribute: "allow-server-selection" })
  allowServerSelection: "true" | "false" = "true";

  /**
   * Custom API server base URL. Overrides the servers array defined in the OpenAPI specification.
   * Particularly useful when sharing a single spec across development, staging, and production
   * environments.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "server-url" })
  serverUrl = "";

  /**
   * Selects which server URL from the spec's servers list should be selected by default.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "default-api-server" })
  defaultApiServerUrl = "";

  /**
   * Configures credentials mode for cross-origin browser Fetch requests as defined in the <a
   * href="https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials" target="_blank"
   * rel="noopener">Fetch Standard</a>, enabling transmission of cookies and Authorization headers
   * in CORS requests.
   * @group Try & Servers
   */
  @property({ type: String, attribute: "fetch-credentials" })
  fetchCredentials: "" | "omit" | "same-origin" | "include" = "";

  // Authentication
  /**
   * Controls the display of interactive authentication controls (HTTP Basic, Bearer Token, API Key,
   * OAuth2). Disable to hide authentication dialogs when using hardcoded or pre-authenticated API
   * keys.
   * @summary Show the authentication controls
   * @group Authentication
   */
  @property({ type: String, attribute: "allow-authentication" })
  allowAuthentication: "true" | "false" = "true";

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

  // Mock Server
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

  // MCP
  // "true" shows the Export MCP Server button; "none" or "false" hides it
  /**
   * Enables Model Context Protocol (MCP) server export for AI agents. <span class="mono
   * fg-color">true</span> renders an <span class="mono fg-color">Export MCP Server</span> button in
   * the overview section that downloads a zip with the MCP manifest (<span class="mono
   * fg-color">manifest.json</span>), a fixed runtime (<span class="mono
   * fg-color">runtime.js</span>) and a stdio TypeScript server (<span class="mono
   * fg-color">server.ts</span>). <span class="mono fg-color">false</span>, <span class="mono
   * fg-color">none</span> or an empty value hides the button.
   * @summary Shows the Export MCP Server button
   * @group MCP
   * @example /examples/mcp-server
   */
  @property({ type: String, attribute: "mcp" })
  mcp: "true" | "false" | "none" = "false";

  /**
   * Custom name for the generated MCP server. Defaults to the API specification title.
   * @group MCP
   */
  @property({ type: String, attribute: "mcp-server-name" })
  mcpServerName = "";

  // Not attributes
  @property({ type: String, attribute: false }) specFile: any;
  _lastSpecUrlRequested: string | null;
  _lastLoadedSpec: any;
  // color-scheme="auto": follows the page's theme (see utils/auto-color-scheme.js)
  _autoColorScheme = new AutoColorSchemeController(this);

  // Internal state, reactive so a change re-renders
  /** @internal */
  @property({ type: Boolean }) loading = false;
  /** @internal */
  @property({ type: String }) focusedElementId = "";
  /** @internal */
  @property({ type: Object }) advancedSearchMatches: any;
  /** @internal */
  @property({ type: String }) searchVal = "";

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
    if (this.shadowRoot && this.shadowRoot.querySelector(".main-content")) {
      this._hasDsd = true;
    }
    const parent = this.parentElement;
    if (parent && parent.tagName === "BODY") {
      if (parent.offsetWidth === 0 && parent.style.width === "") {
        parent.style.width = "100vw";
      }
      if (parent.offsetHeight === 0 && parent.style.height === "") {
        parent.style.height = "100vh";
      }
      if (!parent.style.marginTop) {
        parent.style.marginTop = "0";
      }
      if (!parent.style.marginRight) {
        parent.style.marginRight = "0";
      }
      if (!parent.style.marginBottom) {
        parent.style.marginBottom = "0";
      }
      if (!parent.style.marginLeft) {
        parent.style.marginLeft = "0";
      }
    }

    if (!this.renderStyle || !"read, view, focused,".includes(`${this.renderStyle},`)) {
      this.renderStyle = "focused";
    }

    if (this.hasAttribute("layout")) {
      const attrLayout = this.getAttribute("layout");
      if ("row, column,".includes(`${attrLayout},`)) {
        this.layout = attrLayout as "row" | "column";
        this._userSetLayout = true;
      }
    }

    if (!this._userSetLayout) {
      const defaultLayout =
        this.renderStyle === "read" || this.renderStyle === "focused" ? "column" : "row";
      this._isDefaultingLayout = true;
      this.layout = defaultLayout;
      this.setAttribute("layout", defaultLayout);
      this._isDefaultingLayout = false;
    } else if (!this.layout || !"row, column,".includes(`${this.layout},`)) {
      this.layout =
        this.renderStyle === "read" || this.renderStyle === "focused" ? "column" : "row";
      this.setAttribute("layout", this.layout);
    }
    if (!this.schemaStyle || !"tree, table,".includes(`${this.schemaStyle},`)) {
      this.schemaStyle = "tree";
    }
    if (this.theme === "light" || this.theme === "dark") {
      this.colorScheme = this.theme as "light" | "dark";
      this.theme = DEFAULT_THEME;
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
    if (!this.navItemSpacing || !"compact, default, relaxed,".includes(`${this.navItemSpacing},`)) {
      this.navItemSpacing = "default";
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
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) {
      this.schemaExpandLevel = 99999;
    }
    if (
      !this.schemaDescriptionExpanded ||
      !"true, false,".includes(`${this.schemaDescriptionExpanded},`)
    ) {
      this.schemaDescriptionExpanded = "false";
    }

    if (!this.schemaHideReadOnly || !"default, never,".includes(`${this.schemaHideReadOnly},`)) {
      this.schemaHideReadOnly = "default";
    }
    if (!this.schemaHideWriteOnly || !"default, never,".includes(`${this.schemaHideWriteOnly},`)) {
      this.schemaHideWriteOnly = "default";
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
      this.responseAreaHeight = "400px";
    }

    if (!this.allowSearch || !"true, false,".includes(`${this.allowSearch},`)) {
      this.allowSearch = "true";
    }
    if (!this.allowAdvancedSearch || !"true, false,".includes(`${this.allowAdvancedSearch},`)) {
      this.allowAdvancedSearch = "true";
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
    if (!this.updateRoute || !"true, false,".includes(`${this.updateRoute},`)) {
      this.updateRoute = "true";
    }
    if (!this.sortTags || !"true, false,".includes(`${this.sortTags},`)) {
      this.sortTags = "false";
    }
    if (!this.sortSchemas || !"true, false,".includes(`${this.sortSchemas},`)) {
      this.sortSchemas = "false";
    }
    if (!this.generateMissingTags || !"true, false,".includes(`${this.generateMissingTags},`)) {
      this.generateMissingTags = "false";
    }
    if (!this.showUnusedTags || !"true, false,".includes(`${this.showUnusedTags},`)) {
      this.showUnusedTags = "false";
    }
    if (
      !this.sortEndpointsBy ||
      !"method, path, summary, none,".includes(`${this.sortEndpointsBy},`)
    ) {
      this.sortEndpointsBy = "path";
    }

    if (!this.navItemSpacing || !"compact, relaxed, default,".includes(`${this.navItemSpacing},`)) {
      this.navItemSpacing = "default";
    }
    if (
      !this.showMethodInNavBar ||
      !"false, as-plain-text, as-colored-text, as-colored-block,".includes(
        `${this.showMethodInNavBar},`,
      )
    ) {
      this.showMethodInNavBar = "false";
    }
    if (!this.usePathInNavBar || !"true, false,".includes(`${this.usePathInNavBar},`)) {
      this.usePathInNavBar = "false";
    }
    if (!this.navItemOverflow || !"ellipsis, wrap,".includes(`${this.navItemOverflow},`)) {
      this.navItemOverflow = "ellipsis";
    }
    if (!this.getAttribute("nav-item-overflow")) {
      this.setAttribute("nav-item-overflow", this.navItemOverflow);
    }
    if (!this.showInfo || !"true, false,".includes(`${this.showInfo},`)) {
      this.showInfo = "true";
    }
    if (!this.allowServerSelection || !"true, false,".includes(`${this.allowServerSelection},`)) {
      this.allowServerSelection = "true";
    }
    if (!this.allowAuthentication || !"true, false,".includes(`${this.allowAuthentication},`)) {
      this.allowAuthentication = "true";
    }
    if (
      !this.allowSchemaDescriptionExpandToggle ||
      !"true, false,".includes(`${this.allowSchemaDescriptionExpandToggle},`)
    ) {
      this.allowSchemaDescriptionExpandToggle = "true";
    }

    if (!["true", "false", "floating"].includes(this.showSideNav)) {
      this.showSideNav = "true";
    }
    if (!this.showComponents || !"true false".includes(this.showComponents)) {
      this.showComponents = "false";
    }
    if (
      !this.infoDescriptionHeadingsInNavBar ||
      !"true, false,".includes(`${this.infoDescriptionHeadingsInNavBar},`)
    ) {
      this.infoDescriptionHeadingsInNavBar = "false";
    }
    if (
      !this.fetchCredentials ||
      !"omit, same-origin, include,".includes(`${this.fetchCredentials},`)
    ) {
      this.fetchCredentials = "";
    }
    if (!this.scrollBehavior || !"smooth, auto,".includes(`${this.scrollBehavior},`)) {
      this.scrollBehavior = "auto";
    }

    if (!this.cssFile) {
      this.cssFile = null;
    }
    if (!this.cssClasses) {
      this.cssClasses = "";
    }
    if (!this.mcp) {
      this.mcp = "none";
    }

    if (!this._onHashChange) {
      this._onHashChange = () => {
        this.scrollToPath(this.getElementIDFromURL());
      };
      window.addEventListener("hashchange", this._onHashChange, true);
    }

    if (!this._readerHasInteracted && !this._onFirstInteraction) {
      this._onFirstInteraction = () => {
        this._readerHasInteracted = true;
        this.removeFirstInteractionListeners();
      };
      INTERACTION_EVENTS.forEach((type) =>
        window.addEventListener(type, this._onFirstInteraction, { capture: true, passive: true }),
      );
    }

    // Auto-hydrate from inlined spec or spec-url attribute if not already loaded. This block owns
    // the initial load; the deferred spec-url path in attributeChangedCallback skips the value
    // recorded in _lastSpecUrlRequested so one <rapi-doc spec-url> loads once.
    if (!this.resolvedSpec) {
      const inlinedSpecEl = this.querySelector(
        'script[type="application/json"][slot="rapidoc-spec"]',
      );
      if (inlinedSpecEl?.textContent) {
        try {
          const parsed = JSON.parse(inlinedSpecEl.textContent);
          // The inlined spec wins over a spec-url attribute present at connect
          this._lastSpecUrlRequested = this.getAttribute("spec-url");
          // spec-url stays the spec's URL (download, view), so not through loadSpec, which would clear it
          this._loadSpec(parsed);
        } catch {
          // ignore parse error
        }
      } else if (this.getAttribute("spec-url")) {
        this.loadSpec(this.getAttribute("spec-url"));
      }
    }
  }

  // Cleanup
  disconnectedCallback() {
    if (this._intersectionRaf) {
      cancelAnimationFrame(this._intersectionRaf);
    }
    if (typeof this._observerLockCleanup === "function") {
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
    if (this._onHashChange) {
      window.removeEventListener("hashchange", this._onHashChange, true);
      this._onHashChange = null;
    }
    this.removeFirstInteractionListeners();
    if (this.mockServer === "true") {
      disableMockServer(this);
    }
    super.disconnectedCallback();
  }

  removeFirstInteractionListeners() {
    if (!this._onFirstInteraction) return;
    INTERACTION_EVENTS.forEach((type) =>
      window.removeEventListener(type, this._onFirstInteraction, { capture: true }),
    );
    this._onFirstInteraction = null;
  }

  /**
   * Behavior of scrolls that move the content to a section. Scrolls before the reader's first input are
   * load-time navigation (location hash, goto-path, back/forward) and jump, like the browser's own
   * fragment navigation. A smooth scroll advances only while the page renders frames, and a background
   * tab renders none: the scroll would not happen, and the active-section tracking would then report the
   * section at the top of the page (and rewrite the URL to it).
   */
  getContentScrollBehavior() {
    return this._readerHasInteracted ? this.scrollBehavior : "instant";
  }

  infoDescriptionHeadingRenderer() {
    const renderer = new marked.Renderer();
    const slugger = new Slugger();
    renderer.heading = ({ text, depth }) =>
      `<h${depth} class="observe-me" id="${slugger.slug(text)}">${text}</h${depth}>`;
    fixRenderedAnchorLinks(renderer);
    return renderer;
  }

  willUpdate(changedProperties) {
    super.willUpdate?.(changedProperties);
    if ((this.defaultSchemaTab as string) === "model") {
      this.defaultSchemaTab = "schema";
    }
    if (changedProperties.has("layout") && !this._isDefaultingLayout) {
      this._userSetLayout = Boolean(this.layout && "row, column,".includes(`${this.layout},`));
    }
    if (changedProperties.has("renderStyle") && !this._userSetLayout) {
      const targetLayout =
        this.renderStyle === "read" || this.renderStyle === "focused" ? "column" : "row";
      if (this.layout !== targetLayout) {
        this._isDefaultingLayout = true;
        this.layout = targetLayout;
        this.setAttribute("layout", targetLayout);
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

    // adding custom style for RapiDoc: the page's <link> whose href contains the css-file value
    if (this.cssFile) {
      const cssLinkEl = document.querySelector(`link[href*="${CSS.escape(this.cssFile)}"]`);
      if (cssLinkEl) {
        this.shadowRoot.appendChild(cssLinkEl.cloneNode());
      }
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
      mockServer: this.mockServer,
    };
  }

  updated(changedProperties) {
    super.updated?.(changedProperties);
    scheduleHighlight(this.shadowRoot);

    if (changedProperties.has("theme")) {
      if (this.theme === "light" || this.theme === "dark") {
        this.colorScheme = this.theme as "light" | "dark";
        this.setAttribute("color-scheme", this.colorScheme);
        this.theme = DEFAULT_THEME;
        this.setAttribute("theme", DEFAULT_THEME);
      }
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

    if (changedProperties.has("colorScheme")) {
      if (!this.colorScheme || !"dark, light, system,".includes(`${this.colorScheme},`)) {
        this.colorScheme = "dark";
      }
      if (this.getAttribute("color-scheme") !== this.colorScheme) {
        this.setAttribute("color-scheme", this.colorScheme);
      }
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
    if (changedProperties.has("scrollContainer")) {
      this.initIntersectionObserver();
    }
  }

  observeExpandedContent() {
    // Main Container
    const observeOverviewEls = this.shadowRoot.querySelectorAll(".observe-me");
    observeOverviewEls.forEach((targetEl) => {
      this.intersectionObserver.observe(targetEl);
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "spec-url") {
      if (oldVal !== newVal) {
        // put it at the end of event-loop to load all the attributes
        window.setTimeout(async () => {
          // Already loaded by connectedCallback (or superseded by an inlined spec there)
          if (newVal === this._lastSpecUrlRequested) {
            return;
          }
          await this.loadSpec(newVal);
          // If goto-path is provided and no location-hash is present then try to scroll there
          if (this.gotoPath && !window.location.hash) {
            this.scrollToPath(this.gotoPath);
          }
        }, 0);
      }
    }
    if (name === "filter-operations") {
      if (oldVal !== newVal) {
        window.setTimeout(async () => {
          await this._loadSpec(this._lastLoadedSpec || this.specUrl);
        }, 0);
      }
    }
    if (name === "scroll-offset" && oldVal !== newVal) {
      window.setTimeout(() => this.initIntersectionObserver(), 0);
    }
    if (name === "layout") {
      if (!this._isDefaultingLayout) {
        if (newVal !== null && "row, column,".includes(`${newVal},`)) {
          this._userSetLayout = true;
          this.layout = newVal;
        } else if (newVal === null) {
          this._userSetLayout = false;
          const defaultLayout =
            this.renderStyle === "read" || this.renderStyle === "focused" ? "column" : "row";
          this._isDefaultingLayout = true;
          this.layout = defaultLayout;
          this.setAttribute("layout", defaultLayout);
          this._isDefaultingLayout = false;
        }
      }
    }
    if (name === "render-style") {
      if (newVal === "read") {
        window.setTimeout(() => {
          this.observeExpandedContent();
        }, 100);
      } else {
        this.intersectionObserver.disconnect();
      }
      if (!this._userSetLayout) {
        const defaultLayout = newVal === "read" || newVal === "focused" ? "column" : "row";
        this._isDefaultingLayout = true;
        this.layout = defaultLayout;
        this.setAttribute("layout", defaultLayout);
        this._isDefaultingLayout = false;
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
            (v) => v.securitySchemeId === rapidocApiKey,
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
    this.setAttribute("spec-url", this.shadowRoot.getElementById("spec-url").value);
  }

  onSpecFileChange(e) {
    this.setAttribute("spec-file", this.shadowRoot.getElementById("spec-file").value);
    const specFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const specObj = JSON.parse(reader.result);
        this.loadSpec(specObj);
        this.shadowRoot.getElementById("spec-url").value = "";
      } catch {
        console.error("RapiDoc: Unable to read or parse json");
      }
    };
    // Read the Text file
    reader.readAsText(specFile);
  }

  onFileLoadClick() {
    this.shadowRoot.getElementById("spec-file").click();
  }

  onSearchChange(e) {
    // The event may come from the ↩ icon (a div without `value`): read the nav-bar input instead
    const input =
      e.target instanceof HTMLInputElement
        ? e.target
        : this.shadowRoot.getElementById("nav-bar-search");
    this.searchVal = input?.value ?? "";
    this.resolvedSpec.tags.forEach((tag) =>
      tag.paths.filter((path) => {
        if (this.searchVal) {
          if (getMatchedPaths(this.searchVal, path, tag.name)) {
            tag.expanded = true;
          }
        }
      }),
    );
    this.resolvedSpec.components.forEach((component) =>
      component.subComponents.filter((v) => {
        v.expanded = false;
        if (getMatchedComponents(this.searchVal, v)) {
          v.expanded = true;
        }
      }),
    );
    this.requestUpdate();
  }

  onClearSearch() {
    const searchEl = this.shadowRoot.getElementById("nav-bar-search");
    searchEl.value = "";
    this.searchVal = "";
    this.resolvedSpec.components.forEach((component) =>
      component.subComponents.filter((v) => {
        v.expanded = true;
      }),
    );
  }

  onOpenNavBarToggle() {
    const navBarEL = this.shadowRoot.getElementById("nav-bar");
    navBarEL.classList.toggle("floating-nav");
  }

  onShowAdvancedSearchClicked() {
    this.shadowRoot.getElementById("advanced-search-dialog").showModal();
  }
  onAdvancedSearchClose() {
    this.shadowRoot.getElementById("advanced-search-dialog").close();
  }

  /**
   * Programmatically loads a new OpenAPI specification. Accepts either a string URL or a valid
   * in-memory JSON/JavaScript spec object. The download and view buttons and the header's spec URL
   * box follow the spec loaded: its URL, or none for a spec object (the spec download buttons are
   * then hidden).
   * @public loadSpec(spec)
   * @example https://github.com/rapi-doc/RapiDoc/blob/master/docs/examples/example9.html
   */
  async loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    // The download / view buttons and the Spec URL box follow the spec loaded last: its URL, or none
    // for a spec object (the property doesn't reflect, so this starts no second load)
    this.specUrl = typeof specUrl === "string" ? specUrl : "";
    await this._loadSpec(specUrl);
  }

  async _loadSpec(specUrl) {
    if (!specUrl) {
      return;
    }
    this._lastLoadedSpec = specUrl;
    if (typeof specUrl === "string") {
      this._lastSpecUrlRequested = specUrl;
    }
    // Each load gets a token; a load whose token is no longer current never applies its result
    const token = ++this._specLoadSeq;
    this.searchVal = "";
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
        this.generateMissingTags === "true",
        this.sortTags === "true",
        this.sortSchemas === "true",
        this.getAttribute("sort-endpoints-by"),
        this.getAttribute("api-key-name"),
        this.getAttribute("api-key-location"),
        this.getAttribute("api-key-value"),
        this.getAttribute("server-url"),
        this.filterOperations,
        this.showUnusedTags === "true",
      );
      if (token !== this._specLoadSeq) {
        return; // a newer load started while this one was parsing
      }
      this.loading = false;
      this.afterSpecParsedAndValidated(spec, token);
    } catch (err) {
      if (token !== this._specLoadSeq) {
        return;
      }
      this.loading = false;
      this._clearDsdIfNeeded();
      this.loadFailed = true;
      this.resolvedSpec = null;
      console.error(`RapiDoc: Unable to resolve the API spec..  ${err.message}`);
    }
  }

  async afterSpecParsedAndValidated(spec, token = this._specLoadSeq) {
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
        this.selectedServer = this.resolvedSpec.servers.find(
          (v) => v.url === this.defaultApiServerUrl,
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

    // Initiate IntersectionObserver and put it at the end of event loop, to allow loading all the child elements (must for larger specs)
    this.intersectionObserver.disconnect();
    if (this._intersectingElements) {
      this._intersectingElements.clear();
    }
    if (this.renderStyle === "read") {
      await sleep(100);
      if (token !== this._specLoadSeq) {
        return;
      }
      this.observeExpandedContent(); // This will auto-highlight the selected nav-item in read-mode
    }

    this.isIntersectionObserverActive = true;

    // On first time Spec load, try to navigate to location hash if provided
    const elementId = this.getElementIDFromURL();

    if (elementId) {
      if (this.renderStyle === "view") {
        this.expandAndGotoOperation(elementId, true, true);
      } else {
        this.scrollToPath(elementId);
      }
    } else if (this.gotoPath) {
      this.scrollToPath(this.gotoPath);
    } else if (this.renderStyle === "focused") {
      // If goto-path is provided and no location-hash is present then try to scroll to default element
      if (!this.gotoPath) {
        const defaultElementId =
          this.showInfo === "true"
            ? "overview"
            : this.resolvedSpec.tags.find((t) => t.paths.length > 0)?.paths[0]?.elementId;
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
    return window.location.href.split("#")[0];
  }

  /**
   * From the URL return the ID of the element from the location hash
   */
  getElementIDFromURL() {
    return window.location.hash ? window.location.hash.substring(1) : "";
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
    const tmpElementId = elementId.indexOf("#") === -1 ? elementId : elementId.substring(1);
    if (
      tmpElementId.startsWith("overview") ||
      tmpElementId === "servers" ||
      tmpElementId === "auth"
    ) {
      isExpandingNeeded = false;
    } else {
      for (let i = 0; i < this.resolvedSpec.tags?.length; i++) {
        const tag = this.resolvedSpec.tags[i];
        if (tag.elementId === elementId) {
          // A click on a tag in the navigation bar opens that tag
          isExpandingNeeded = !tag.expanded;
          tag.expanded = true;
          break;
        }
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
          const hasPath = group.tags?.some(
            (t) => t.elementId === elementId || t.paths?.some((p) => p.elementId === elementId),
          );
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
          const firstNavEl = this.shadowRoot.querySelector(".first-nav-item");
          const isFirst = firstNavEl && firstNavEl.dataset.contentId === tmpElementId;
          const gotoEl = this.shadowRoot.getElementById(tmpElementId);
          if (gotoEl) {
            const mainContentEl = this.shadowRoot.querySelector(".main-content");
            let targetTop: number;
            if (this.autoHeight === "true") {
              this.scrollAutoHeightTarget(gotoEl, tmpElementId);
            } else if (isFirst) {
              targetTop = 0;
              this.lockObserverDuringScroll(gotoEl, tmpElementId, targetTop);
              if (mainContentEl) {
                mainContentEl.scrollTo({ top: 0, behavior: this.getContentScrollBehavior() });
              } else {
                gotoEl.scrollIntoView({
                  behavior: this.getContentScrollBehavior(),
                  block: "start",
                });
              }
            } else if (mainContentEl) {
              const containerRect = mainContentEl.getBoundingClientRect();
              const targetRect = gotoEl.getBoundingClientRect();
              targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
              this.lockObserverDuringScroll(gotoEl, tmpElementId, targetTop);
              mainContentEl.scrollTo({ top: targetTop, behavior: this.getContentScrollBehavior() });
            } else {
              this.lockObserverDuringScroll(gotoEl, tmpElementId);
              gotoEl.scrollIntoView({ behavior: this.getContentScrollBehavior(), block: "start" });
            }
            this._activeElementId = tmpElementId;
            this.dispatchEvent(
              new CustomEvent("nav-active-change", {
                detail: {
                  id: tmpElementId,
                  elementId: tmpElementId,
                },
                bubbles: true,
                composed: true,
              }),
            );
            if (this.updateRoute === "true") {
              this.replaceHistoryState(tmpElementId);
            }
          }
        },
        isExpandingNeeded ? 150 : 0,
      );
    }
  }

  isValidTopId(id) {
    return id.startsWith("overview") || id === "servers" || id === "auth";
  }

  isValidPathId(id) {
    if (id === "overview" && this.showInfo) {
      return true;
    }
    if (id === "servers" && this.allowServerSelection) {
      return true;
    }
    if (id === "auth" && this.allowAuthentication) {
      return true;
    }
    if (id.startsWith("tag--")) {
      return this.resolvedSpec?.tags?.find((tag) => tag.elementId === id);
    }
    return this.resolvedSpec?.tags?.find((tag) => tag.paths.find((path) => path.elementId === id));
  }

  initIntersectionObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    let container = null;
    if (this.scrollContainer && typeof document !== "undefined") {
      try {
        container = document.querySelector(this.scrollContainer);
        const isAncestor = Boolean(
          container &&
          (container.contains(this) ||
            (this.assignedSlot && container.contains(this.assignedSlot)) ||
            (container.shadowRoot && container.shadowRoot.contains(this.assignedSlot))),
        );
        if (container && !isAncestor) {
          // If the specified element is not an ancestor of <rapi-doc>, IntersectionObserver cannot observe inside it
          console.warn(
            `RapiDoc: The element specified by scroll-container ("${this.scrollContainer}") is not an ancestor of <rapi-doc>. Falling back to auto-detection.`,
          );
          container = null;
        }
      } catch {
        // Ignore invalid query selector
      }
    }
    if (!container && typeof window !== "undefined") {
      let parent: any = this.assignedSlot ? this.assignedSlot.parentElement : this.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          container = parent;
          break;
        }
        parent =
          parent.parentElement ||
          (parent.getRootNode && parent.getRootNode() instanceof ShadowRoot
            ? (parent.getRootNode() as ShadowRoot).host
            : null);
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

    const activeCandidates = Array.from(this._intersectingElements.values()).filter(
      (el) => el.isConnected,
    );
    if (activeCandidates.length === 0) {
      return;
    }

    const containerTop =
      (this._scrollRootContainer ? this._scrollRootContainer.getBoundingClientRect().top : 0) +
      this.getScrollOffset();
    const visibleHeadings = [];
    const scrolledPast = [];

    for (const el of activeCandidates) {
      const top = el.getBoundingClientRect().top - containerTop;
      // A section scrolled to (scrollToPath) can end up a fraction of a pixel above the top: the
      // browser rounds the scroll position to device pixels. It still counts as visible.
      if (top > -1) {
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
      if (targetId.startsWith("tag--") && this.resolvedSpec?.tags) {
        const matchingTag = this.resolvedSpec.tags.find((t) => t.elementId === targetId);
        if (matchingTag?.paths?.[0]?.elementId) {
          resolvedOperationId = matchingTag.paths[0].elementId;
        }
      }

      this.dispatchEvent(
        new CustomEvent("nav-active-change", {
          detail: {
            id: targetId,
            elementId: targetId,
            operationId: resolvedOperationId,
          },
          bubbles: true,
          composed: true,
        }),
      );

      if (this.updateRoute === "true") {
        this.replaceHistoryState(targetId);
      }

      // 2. If internal navbar is active (show-side-nav="true" or "floating"), update Shadow DOM elements
      const newNavEl = this.shadowRoot.getElementById(`link-${targetId}`);
      if (newNavEl) {
        const oldNavEl = this.shadowRoot.querySelector(
          ".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active",
        );

        if (oldNavEl && oldNavEl !== newNavEl) {
          oldNavEl.classList.remove("active");
          oldNavEl.part.remove("section-navbar-active-item");
        }

        expandParentNavContainers(newNavEl);
        newNavEl.classList.add("active");
        newNavEl.part.add("section-navbar-active-item");

        // Scroll sidebar only if the active item is out of view
        const navScrollEl = newNavEl.closest(".nav-scroll");
        if (navScrollEl) {
          const headerEl =
            navScrollEl.querySelector(".nav-bar-header") ||
            navScrollEl.querySelector(".nav-bar-search-container");
          const topOffset = headerEl ? headerEl.offsetHeight : 0;

          if (newNavEl.offsetTop <= topOffset + 30) {
            if (navScrollEl.scrollTop > 0) {
              const behavior = this.scrollBehavior === "auto" ? "auto" : "smooth";
              navScrollEl.scrollTo({ top: 0, behavior });
            }
          } else {
            const scrollRect = navScrollEl.getBoundingClientRect();
            const itemRect = newNavEl.getBoundingClientRect();
            const isOutOfView =
              itemRect.top < scrollRect.top + topOffset + 15 ||
              itemRect.bottom > scrollRect.bottom - 40;
            if (isOutOfView) {
              const behavior = this.scrollBehavior === "auto" ? "auto" : "smooth";
              // Land the item below the sticky search header (which sits inside the scroll area), not under it
              const targetTop =
                itemRect.top - scrollRect.top + navScrollEl.scrollTop - topOffset - 20;
              navScrollEl.scrollTo({ top: targetTop, behavior });
            }
          }
        }
      }
    });
  }

  // Called by anchor tags created using markdown
  handleHref(e) {
    if (e.target.tagName.toLowerCase() === "a") {
      if (e.target.getAttribute("href").startsWith("#")) {
        const gotoEl = this.shadowRoot.getElementById(
          e.target.getAttribute("href").replace("#", ""),
        );
        if (gotoEl) {
          const mainContentEl = this.shadowRoot.querySelector(".main-content");
          if (this.autoHeight === "true" || this.hasAttribute("auto-height")) {
            this.scrollAutoHeightTarget(gotoEl, gotoEl.id);
          } else if (mainContentEl) {
            const containerRect = mainContentEl.getBoundingClientRect();
            const targetRect = gotoEl.getBoundingClientRect();
            const targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
            mainContentEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
          } else {
            gotoEl.scrollIntoView({ behavior: this.scrollBehavior, block: "start" });
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
    if (
      !(this.autoHeight === "true" || this.hasAttribute("auto-height")) ||
      typeof window === "undefined"
    ) {
      return 0;
    }
    const explicit = parseFloat(this.scrollOffset);
    if (Number.isFinite(explicit)) {
      return explicit;
    }
    const root: HTMLElement =
      this._scrollRootContainer ||
      (document.scrollingElement as HTMLElement) ||
      document.documentElement;
    const padding = getComputedStyle(root).scrollPaddingTop;
    const value = parseFloat(padding);
    if (!Number.isFinite(value)) {
      return 0;
    }
    return padding.endsWith("%") ? (value / 100) * root.clientHeight : value;
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
      container.scrollTo({ top: targetTop, behavior: this.getContentScrollBehavior() });
    } else {
      const targetTop = top + window.scrollY;
      this.lockObserverDuringScroll(targetEl, targetId, targetTop);
      window.scrollTo({ top: targetTop, behavior: this.getContentScrollBehavior() });
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
  lockObserverDuringScroll(
    targetEl: HTMLElement | null,
    targetId: string = "",
    targetTop?: number,
  ) {
    if (this._intersectionRaf) {
      cancelAnimationFrame(this._intersectionRaf);
      this._intersectionRaf = null;
    }

    if (typeof this._observerLockCleanup === "function") {
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

    const isAutoHeight = this.autoHeight === "true" || this.hasAttribute("auto-height");
    const scrollContainer: any = isAutoHeight
      ? this._scrollRootContainer || (typeof window !== "undefined" ? window : null)
      : this.shadowRoot?.querySelector(".main-content") ||
        (typeof window !== "undefined" ? window : null);

    if (!scrollContainer || typeof window === "undefined") {
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
      scrollContainer.removeEventListener?.("scrollend", onScrollEnd);
      window.removeEventListener?.("scrollend", onScrollEnd);
      scrollContainer.removeEventListener?.("scroll", onScroll);
      window.removeEventListener?.("scroll", onScroll);
      clearTimeout(debounceTimer);
    };
    this._observerLockCleanup = cleanup;

    if ("onscrollend" in window) {
      scrollContainer.addEventListener?.("scrollend", onScrollEnd, { once: true, passive: true });
      window.addEventListener?.("scrollend", onScrollEnd, { once: true, passive: true });
    }
    scrollContainer.addEventListener?.("scroll", onScroll, { passive: true });
    window.addEventListener?.("scroll", onScroll, { passive: true });

    const currentScrollTop =
      scrollContainer === window ? window.scrollY : scrollContainer.scrollTop || 0;
    const isZeroDistance =
      typeof targetTop === "number" && Math.abs(targetTop - currentScrollTop) < 3;
    const maxSafetyDelay = isZeroDistance
      ? 60
      : this.getContentScrollBehavior() === "smooth"
        ? 1200
        : 100;
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
    if (!(event.type === "click" || (event.type === "keyup" && event.keyCode === 13))) {
      return;
    }
    const navEl = ((event.target as HTMLElement)?.closest?.("[data-content-id]") ||
      event.target) as HTMLElement;
    if (!navEl?.dataset?.contentId) {
      return;
    }
    if (this.renderStyle === "focused") {
      const requestEl = this.shadowRoot.querySelector("api-request");
      if (typeof requestEl?.beforeNavigationFocusedMode === "function") {
        requestEl.beforeNavigationFocusedMode();
      }
    }
    const isFirstNavItem = navEl.dataset.firstNavItem === "true";
    this.scrollToPath(navEl.dataset.contentId, true, scrollNavItemToView, isFirstNavItem);
  }

  // Public Method - Returns the DOM element in ShadowRoot matching elementId, operationId, or slug
  getTargetElement(elementId: string): HTMLElement | null {
    if (!elementId || !this.shadowRoot) return null;
    return (this.shadowRoot.getElementById(elementId) ||
      this.shadowRoot.querySelector(`[data-op-slug="${CSS.escape(elementId)}"]`) ||
      this.shadowRoot.querySelector(`[id$="--${CSS.escape(elementId)}"]`) ||
      this.shadowRoot.getElementById(
        elementId.replace(/^[a-z0-9_-]+--/, ""),
      )) as HTMLElement | null;
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
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const wanted = normalize(elementId);
    for (const tag of this.resolvedSpec?.tags || []) {
      const op = tag.paths?.find((p) => normalize(methodPathSlug(p.method, p.path)) === wanted);
      if (op) return op.elementId;
    }
    return elementId;
  }

  /**
   * Connects a sidebar rendered outside the component (for example the static HTML from <span
   * class="mono fg-color">getNavBarHtml</span> in <span class="mono
   * fg-color">@rapidoc/prerender</span>) to this element: clicks navigate with <span class="mono
   * fg-color">scrollToPath</span>, the active item follows <span class="mono
   * fg-color">nav-active-change</span>, and the filter box filters the sidebar. <span class="mono
   * fg-color">sidebar</span> is an element or a CSS selector; <span class="mono
   * fg-color">options</span> accepts <span class="mono fg-color">activeClass</span> (default <span
   * class="mono fg-color">active</span>) and <span class="mono fg-color">updateHistory</span>
   * (default <span class="mono fg-color">true</span>). Returns a function that removes the
   * bindings.
   * @public
   */
  bindNavBar(sidebar: HTMLElement | string, options?: any) {
    return bindNavBar(sidebar, this, options);
  }

  // Public Method (scrolls to a given path and highlights the left-nav selection)
  async scrollTo(elementId) {
    return this.scrollToPath(elementId);
  }

  /**
   * Programmatically scrolls the viewport to focus on a specific endpoint section. The <span
   * class="mono fg-color">path</span> argument is the operation's element ID (e.g., <span
   * class="mono fg-color">login-user</span>) or its method + path anchor (e.g., <span class="mono
   * fg-color">get-user-login</span>; the older <span class="mono fg-color">get-/user/login</span>
   * format also works).
   * @public scrollToPath(path)
   * @example /tests/collapsable
   */
  async scrollToPath(
    elementId,
    expandPath = true,
    scrollNavItemToView = true,
    isFirstNavItem = false,
  ) {
    elementId = this.resolveOperationAlias(elementId);
    if (this.renderStyle === "focused") {
      // for focused mode update this.focusedElementId to update the rendering, else it wont find the needed html elements
      // focusedElementId will get validated in the template
      this.focusedElementId = elementId;
      await sleep(0);
    }
    if (this.renderStyle === "view") {
      this.expandAndGotoOperation(elementId, expandPath, true);
    } else {
      const contentEl = this.getTargetElement(elementId);
      const isValidElementId = Boolean(contentEl);
      if (contentEl) {
        const firstNavEl = this.shadowRoot.querySelector(".first-nav-item");
        const isFirst =
          isFirstNavItem || (firstNavEl && firstNavEl.dataset.contentId === elementId);
        const mainContentEl = this.shadowRoot.querySelector(".main-content");
        let targetTop: number;

        if (this.autoHeight === "true" || this.hasAttribute("auto-height")) {
          this.scrollAutoHeightTarget(contentEl, elementId);
        } else if (isFirst) {
          targetTop = 0;
          this.lockObserverDuringScroll(contentEl, elementId, targetTop);
          if (mainContentEl) {
            mainContentEl.scrollTo({ top: 0, behavior: this.getContentScrollBehavior() });
          } else {
            contentEl.scrollIntoView({ behavior: this.getContentScrollBehavior(), block: "start" });
          }
        } else if (mainContentEl) {
          const containerRect = mainContentEl.getBoundingClientRect();
          const targetRect = contentEl.getBoundingClientRect();
          targetTop = targetRect.top - containerRect.top + mainContentEl.scrollTop;
          this.lockObserverDuringScroll(contentEl, elementId, targetTop);
          mainContentEl.scrollTo({ top: targetTop, behavior: this.getContentScrollBehavior() });
        } else {
          this.lockObserverDuringScroll(contentEl, elementId);
          contentEl.scrollIntoView({ behavior: this.getContentScrollBehavior(), block: "start" });
        }
      }
      if (isValidElementId) {
        // In focused mode, <api-request> and <api-response> component instances are reused across endpoint switches
        // to avoid expensive DOM re-creation. Reset their selection state so selections from the previous operation
        // (such as alternative request bodies or non-default status codes) do not persist into the new operation.
        if (this.renderStyle === "focused") {
          const requestEl = this.shadowRoot.querySelector("api-request");
          if (typeof requestEl?.afterNavigationFocusedMode === "function") {
            requestEl.afterNavigationFocusedMode();
          }
          const responseEl = this.shadowRoot.querySelector("api-response");
          if (typeof responseEl?.resetSelection === "function") {
            responseEl.resetSelection();
          }
        }

        // Update Location Hash
        this._activeElementId = contentEl?.id || elementId;
        this.dispatchEvent(
          new CustomEvent("nav-active-change", {
            detail: {
              id: elementId,
              elementId,
            },
            bubbles: true,
            composed: true,
          }),
        );
        if (this.updateRoute === "true") {
          this.replaceHistoryState(elementId);
        }

        // Update NavBar View and Styles
        const newNavEl = this.shadowRoot.getElementById(`link-${elementId}`);

        if (newNavEl) {
          expandParentNavContainers(newNavEl);
          if (scrollNavItemToView) {
            const navScrollEl = this.shadowRoot.querySelector(".nav-scroll");
            if (navScrollEl) {
              const scrollRect = navScrollEl.getBoundingClientRect();
              const itemRect = newNavEl.getBoundingClientRect();
              const targetTop =
                itemRect.top -
                scrollRect.top +
                navScrollEl.scrollTop -
                navScrollEl.clientHeight / 2;
              navScrollEl.scrollTo({ top: targetTop, behavior: this.scrollBehavior });
            } else {
              newNavEl.scrollIntoView({ behavior: this.scrollBehavior, block: "center" });
            }
          }
          await sleep(0);
          const oldNavEl = this.shadowRoot.querySelector(
            ".nav-bar-tag.active, .nav-bar-path.active, .nav-bar-info.active, .nav-bar-h1.active, .nav-bar-h2.active, .operations.active",
          );
          if (oldNavEl) {
            oldNavEl.classList.remove("active");
            oldNavEl.part.remove("active");
            oldNavEl.part.remove("section-navbar-active-item");
          }
          newNavEl.classList.add("active"); // must add the class after scrolling
          newNavEl.part.add("section-navbar-active-item");
          // this.requestUpdate();
        }
      }
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
   * @code
   * <script>
   *   const rapidocEl = document.getElementById('the-doc');
   *   rapidocEl.addEventListener('spec-loaded', () => {
   *     rapidocEl.setApiKey('oauth2', 'Bearer ' + token, { note: 'Using your sign-in (ann@example.com).' });
   *   });
   * </script>
   */
  setApiKey(securitySchemeId, apiKeyValue, options: { note?: string } = {}) {
    return applyApiKey.call(this, securitySchemeId, "", "", apiKeyValue, options?.note || "");
  }

  // Public Method
  removeAllSecurityKeys() {
    return onClearAllApiKeys.call(this);
  }

  /**
   * Programmatically switches the active target API server URL.
   * @public
   * @code
   * <html>
   *   ...
   *   <rapi-doc id="the-doc" spec-url="https://.../spec.yaml"></rapi-doc>
   *   <script>
   *     window.addEventListener('DOMContentLoaded', () => {
   *       const rapidocEl = document.getElementById('the-doc');
   *       rapidocEl.addEventListener('spec-loaded', () => {
   *         rapidocEl.setApiServer(window.location.origin + "/api");
   *       });
   *     });
   *   </script>
   *   ...
   * </html>
   */
  setApiServer(apiServerUrl) {
    // return apiServerUrl;
    return setApiServer.call(this, apiServerUrl);
  }

  // True when the `mcp` attribute asks for the Export MCP Server button
  get mcpEnabled() {
    return parseMcpEnabled(this.mcp);
  }

  /**
   * The <rapi-flow> on the page whose Arazzo document the export takes workflow tools from: the
   * one whose `for` names this element, else one without `for`. Nothing when rapi-flow is not
   * loaded.
   */
  private findArazzoDocument() {
    if (typeof customElements === "undefined" || !customElements.get("rapi-flow")) return undefined;
    const flows = [...document.querySelectorAll("rapi-flow")] as any[];
    return (
      flows.find((f) => this.id && f.getAttribute("for") === this.id && f.arazzoDocument) ||
      flows.find((f) => !f.getAttribute("for") && f.arazzoDocument)
    );
  }

  private mcpOptions(options) {
    const flow = this.findArazzoDocument();
    return {
      serverName: this.mcpServerName,
      arazzo: flow?.arazzoDocument,
      // <rapi-flow> carries the workflow runtime; this bundle does not
      workflowRuntime: flow?.workflowRuntimeSource,
      ...options,
    };
  }

  /**
   * Builds the MCP manifest and the exported project in memory. Returns <span class="mono
   * fg-color">{ manifest, files, budget, hostConfig }</span>: <span class="mono
   * fg-color">manifest</span> is the plain JSON description of the server (one tool per operation
   * with a JSON Schema <span class="mono fg-color">inputSchema</span>, MCP <span class="mono
   * fg-color">annotations</span> and the <span class="mono fg-color">operation</span> the runtime
   * executes), <span class="mono fg-color">files</span> maps every file of the zip to its text
   * (<span class="mono fg-color">manifest.json</span>, <span class="mono
   * fg-color">server.ts</span>, <span class="mono fg-color">runtime.js</span>, <span class="mono
   * fg-color">package.json</span>, <span class="mono fg-color">README.md</span>, <span class="mono
   * fg-color">claude_desktop_config.json</span>), <span class="mono fg-color">budget</span> is the
   * token diagnostics and <span class="mono fg-color">hostConfig</span> the Claude Desktop / Cursor
   * config JSON. <span class="mono fg-color">options</span>: <span class="mono
   * fg-color">serverName</span>, <span class="mono fg-color">includeInternal</span>, <span
   * class="mono fg-color">includeDeprecated</span>, <span class="mono
   * fg-color">includeOperations</span> (<span class="mono fg-color">false</span>: only the workflow
   * tools of a paired <span class="mono fg-color">&lt;rapi-flow&gt;</span>).
   * @public
   */
  generateMcpServer(options = {}) {
    const spec = this.resolvedSpec || this.openApiSpec;
    if (!spec) return null;
    return mcpServerGenerator(spec, this.mcpOptions(options));
  }

  /**
   * Downloads the exported project as <span class="mono
   * fg-color">&lt;server-name&gt;-mcp.zip</span> (<span class="mono
   * fg-color">&lt;server-name&gt;-workflows-mcp.zip</span> with <span class="mono
   * fg-color">includeOperations: false</span>). Same <span class="mono fg-color">options</span>
   * as <span class="mono fg-color">generateMcpServer</span>.
   * @public
   */
  downloadMcpServer(options = {}) {
    const result = this.generateMcpServer(options);
    if (!result) return;
    const blob = new Blob([createZip(result.files)], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // A workflows-only export gets a name of its own, so the two downloads do not overwrite
    const kind =
      (options as { includeOperations?: boolean }).includeOperations === false ? "-workflows" : "";
    link.download = `${result.manifest.server.name.replace(/_/g, "-")}${kind}-mcp.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /**
   * Returns prompt token overhead diagnostics for the current OpenAPI specification: <span
   * class="mono fg-color">{ totalTools, totalResources, estimatedTokens, consequentialCount,
   * warnings }</span>, where <span class="mono fg-color">consequentialCount</span> is the number of
   * tools that are not read-only and <span class="mono fg-color">warnings</span> lists context
   * footprint warnings (over 30 tools or 5,000 tokens).
   * @public
   */
  getMcpBudget(options = {}) {
    const spec = this.resolvedSpec || this.openApiSpec;
    if (!spec) return null;
    return estimateTokenCost(buildMcpManifest(spec, this.mcpOptions(options)));
  }

  // Event handler for Advanced Search text-inputs and checkboxes
  onAdvancedSearch(ev, delay) {
    const eventTargetEl = ev.target;
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      let searchInputEl;
      if (eventTargetEl.type === "text") {
        searchInputEl = eventTargetEl;
      } else {
        searchInputEl = eventTargetEl
          .closest(".advanced-search-options")
          .querySelector("input[type=text]");
      }
      const searchOptions = [
        ...eventTargetEl.closest(".advanced-search-options").querySelectorAll("input:checked"),
      ].map((v) => v.id);
      this.advancedSearchMatches = advancedSearch(
        searchInputEl.value,
        this.resolvedSpec.tags,
        searchOptions,
      );
    }, delay);
  }
}
