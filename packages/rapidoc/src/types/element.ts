/**
 * Host-element types: the `this` of the template functions (`fn.call(this, ...)`) and of the helpers that
 * receive a RapiDoc element as context. Types only: no runtime code.
 *
 * Reactive attribute properties are strings (`'true'` / `'false'` ...) unless the code shows otherwise.
 * Members the connectedCallback always defaults are non-optional; the others may be left undefined.
 */
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type {
  AdvancedSearchMatch,
  ResolvedJsonSchemaSpec,
  ResolvedParameter,
  ResolvedSecurityScheme,
  ResolvedServer,
  ResolvedSpec,
  ResolvedSpecState,
} from '~/types/spec';

/** Value of `additional-authorize-params` / `additional-token-params` (see `paramsConverter`): JSON object, raw string or null. */
export type AuthParams = Record<string, unknown> | string | null;

/** What `get config()` of RapiDoc / RapiDocMini returns and what is passed to `<api-request>` / `<api-response>` via `.config`. */
export interface RapiDocConfig {
  renderStyle: string;
  schemaStyle: string;
  defaultSchemaTab: string;
  schemaExpandLevel: number;
  schemaDescriptionExpanded: string;
  allowSchemaDescriptionExpandToggle: string;
  schemaHideReadOnly: string;
  schemaHideWriteOnly?: string;
  fillRequestFieldsWithExample: string;
  allowTry: string;
  showCurlBeforeTry?: string;
  fetchCredentials: string;
}

/** Shape stored in `localStorage['rapidoc']` when `persist-auth="true"` (security-scheme-template). */
export type PersistedApiKeys = Record<string, ResolvedSecurityScheme & { username?: string }>;

/** `this` of `ProcessSpec`: the element it is called on. */
export type SpecHostElement = Pick<RapiDocElement, 'requestUpdate' | 'dispatchEvent'>;

/** Reactive properties / defaults shared by `<rapi-doc>` and `<rapi-doc-mini>`. */
export interface RapiDocSharedProps {
  // Spec
  specUrl?: string;
  sortEndpointsBy: string;
  sortTags: string;
  /** Defaulted by RapiDoc; never declared by RapiDocMini (undefined there). */
  sortSchemas?: string;
  /** Defaulted by RapiDoc; never declared by RapiDocMini (undefined there). */
  generateMissingTags?: string;

  // UI layout
  layout: string;
  renderStyle: string;
  defaultSchemaTab: string;
  responseAreaHeight: string;
  fillRequestFieldsWithExample: string;
  persistAuth: string;
  updateRoute: string;
  showHeader?: string;
  allowAdvancedSearch: string;
  allowTry: string;
  showCurlBeforeTry?: string;

  // Schema styles
  schemaStyle: string;
  schemaExpandLevel: number;
  schemaDescriptionExpanded: string;
  allowSchemaDescriptionExpandToggle: string;
  schemaHideReadOnly: string;
  schemaHideWriteOnly: string;

  // API server / auth
  apiKeyName: string;
  apiKeyLocation: string;
  apiKeyValue: string;
  defaultApiServerUrl?: string;
  serverUrl?: string;
  oauthReceiver: string;
  additionalAuthorizeParams?: AuthParams;
  additionalTokenParams?: AuthParams;

  // Mock server
  mockServer?: string;
  mockServerStatusCode?: string;
  mockServerStatusStrategy?: string;
  mockServerDelay?: number;
  mockServerLog?: string;

  // Colors and fonts
  theme: string;
  bgColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontSize: string;
  regularFont?: string;
  monoFont?: string;
  loadFonts?: string;
  /** Defaulted by RapiDoc; never declared by RapiDocMini (undefined there). */
  navItemSpacing?: string;

  // Fetch / filters
  fetchCredentials: string;
  matchPaths: string;
  matchType: string;
  removeEndpointsWithBadgeLabelAs: string;

  // Internal state
  /** True while the spec is being loaded (undefined until the first load). */
  loading?: boolean;
  loadFailed?: boolean;
  /** `null` when loading failed; undefined until the first load. */
  resolvedSpec?: ResolvedSpecState;
  selectedServer?: ResolvedServer;

  // Members every host provides
  readonly config: RapiDocConfig;
  requestUpdate(): void;
  readonly updateComplete: Promise<boolean>;
  handleHref(e: Event): void;
  loadSpec(specUrl: unknown): Promise<void>;
}

/**
 * `this` of the templates rendered by `<rapi-doc>` (main-body, header, navbar, overview, server, security-scheme,
 * focused/expanded/endpoint, components, advanced-search-dialog, callback, ...).
 */
// `scrollTo` is omitted: RapiDoc's public `scrollTo(elementId)` shadows (incompatibly) Element.scrollTo.
export interface RapiDocElement extends Omit<HTMLElement, 'scrollTo'>, RapiDocSharedProps {
  navItemSpacing: string;
  sortSchemas: string;
  generateMissingTags: string;
  scrollTo(elementId: string): Promise<void>;
  // Heading / routing
  headingText?: string;
  gotoPath?: string;
  routePrefix: string;
  specFile?: string;
  scrollBehavior: string;
  pageDirection?: string;
  onNavTagClick: string;

  // Visibility / permissions
  showSideNav: string;
  showInfo: string;
  showComponents: string;
  allowAuthentication: string;
  allowSpecUrlLoad?: string;
  allowSpecFileLoad?: string;
  allowSpecFileDownload?: string;
  allowSearch: string;
  allowServerSelection: string;

  // Colors / css
  headerColor?: string;
  cssFile: string | null;
  cssClasses: string;
  navBgColor?: string;
  navTextColor?: string;
  navHoverBgColor?: string;
  navHoverTextColor?: string;
  navAccentColor?: string;
  navAccentTextColor?: string;
  navActiveItemMarker: string;
  showMethodInNavBar: string;
  usePathInNavBar: string;
  infoDescriptionHeadingsInNavBar: string;
  /** Set to the boolean `true` by the RapiDoc constructor (RapiDocMini: string attribute). */
  showSummaryWhenCollapsed: string | boolean;

  // Internal state
  focusedElementId?: string;
  advancedSearchMatches?: AdvancedSearchMatch[];
  searchVal?: string;
  isMini?: boolean;
  isIntersectionObserverActive: boolean;
  intersectionObserver: IntersectionObserver;
  timeoutId?: ReturnType<typeof setTimeout>;

  // Event handlers / actions used by templates
  onSpecUrlChange(): void;
  onSpecFileChange(e: Event): void;
  onFileLoadClick(): void;
  onSearchChange(e: Event): void;
  onClearSearch(): void;
  onOpenNavBarToggle(): void;
  onShowAdvancedSearchClicked(): void;
  onAdvancedSearchClose(e?: Event): void;
  onAdvancedSearch(ev: Event, delay: number): void;
  scrollToEventTarget(event: Event, scrollNavItemToView?: boolean): Promise<void>;
  scrollToPath(elementId: string, expandPath?: boolean, scrollNavItemToView?: boolean): Promise<void>;
  expandAndGotoOperation(elementId: string, scrollToElement?: boolean, ...rest: unknown[]): void;
  replaceHistoryState(hashId: string): void;
  getComponentBaseURL(): string;
  getElementIDFromURL(): string;
  isValidTopId(id: string): boolean;
  isValidPathId(id: string): unknown;
  afterSpecParsedAndValidated(spec: unknown): Promise<void>;
  setApiServer(apiServerUrl: string): boolean;
  setApiKey(securitySchemeId: string, apiKeyValue: string): boolean;
  setHttpUserNameAndPassword(securitySchemeId: string, username: string, password: string): boolean;
  removeAllSecurityKeys(): void;
}

/**
 * `this` of the templates that need a successfully resolved spec (navbar, expanded/focused endpoint, components, ...):
 * a RapiDocElement whose `resolvedSpec` was narrowed by the caller (mainBodyTemplate's `specLoadError` / `isSpecLoading` early returns).
 */
export type RapiDocSpecElement = RapiDocElement & { resolvedSpec: ResolvedSpec };

/**
 * `<rapi-doc-mini>` (a separate LitElement, NOT a subclass of RapiDoc): it has the shared members but none of the
 * navigation/search handlers. It is rendered with `mainBodyTemplate.call(this, true, this.pathsExpanded)`; since the
 * templates are typed with `RapiDocElement`, the call site needs `this as unknown as RapiDocElement`.
 */
export interface RapiDocMiniElement extends HTMLElement, RapiDocSharedProps {
  isMini: boolean;
  /** Attribute string `'true'`, converted to a boolean by connectedCallback. */
  pathsExpanded: string | boolean;
  showSummaryWhenCollapsed: string;
  onSpecUrlChange(): void;
  afterSpecParsedAndValidated(spec: unknown): Promise<void>;
  setApiServer(apiServerUrl: string): boolean;
  setApiKey(securitySchemeId: string, apiKeyValue: string): boolean;
  setHttpUserNameAndPassword(securitySchemeId: string, username: string, password: string): boolean;
  removeAllSecurityKeys(): void;
}

/** `this` of `jsonSchemaViewerTemplate` (templates/json-schema-viewer-template.ts): `<json-schema-viewer>`. */
export interface JsonSchemaViewerElement extends HTMLElement {
  specUrl?: string;
  isMini: boolean;
  updateRoute: string;
  renderStyle: string;
  showHeader: string;
  showSideNav: string;
  showInfo: string;
  allowAdvancedSearch: string;
  allowSpecUrlLoad?: string;
  allowSpecFileLoad?: string;
  allowSpecFileDownload?: string;
  allowSearch: string;
  allowSchemaDescriptionExpandToggle: string;
  schemaStyle: string;
  schemaExpandLevel: number;
  schemaDescriptionExpanded: string;
  /** Set to a boolean by connectedCallback (attribute string `'true'` converted). */
  pathsExpanded?: string | boolean;
  theme: string;
  bgColor?: string;
  textColor?: string;
  primaryColor?: string;
  fontSize: string;
  regularFont?: string;
  monoFont?: string;
  loadFonts?: string;
  matchType: string;
  matchPaths?: string;
  /** Read by the template but never declared/set by the element. */
  headerColor?: string;
  navBgColor?: string;
  navTextColor?: string;
  navHoverBgColor?: string;
  navHoverTextColor?: string;
  navAccentColor?: string;
  navAccentTextColor?: string;
  cssClasses?: string;
  pageDirection?: string;
  /** Not declared by the element: only read through `generateMissingTags === 'true'` etc. when calling ProcessSpec. */
  generateMissingTags?: string;
  sortTags?: string;
  sortSchemas?: string;

  loading?: boolean;
  loadFailed?: boolean;
  resolvedSpec?: ResolvedJsonSchemaSpec | null;
  selectedExampleForEachSchema: Record<string, string>;

  requestUpdate(): void;
  readonly updateComplete: Promise<boolean>;
  loadSpec(specUrl: unknown): Promise<void>;
  onSpecUrlChange(): void;
  onSearchChange(e: Event): void;
  onSelectExample(e: Event, schemaBody?: unknown): void;
  handleHref(e: Event): void;
  scrollToEventTarget(event: Event, scrollNavItemToView?: boolean): Promise<void>;
  afterSpecParsedAndValidated(spec: unknown): Promise<void>;
}

/**
 * `this` of request-body-template, request-params-template and api-response-template
 * (`apiCallTemplate`, `curlSyntaxTemplate`, `apiResponseTabTemplate`): the `<api-request>` component (components/api-request.ts).
 */
export interface ApiRequestElement extends HTMLElement {
  // Reactive properties (attributes / bound props)
  config: RapiDocConfig;
  serverUrl?: string;
  servers?: OpenAPIV3_1.ServerObject[];
  method: string;
  path: string;
  security?: OpenAPIV3_1.SecurityRequirementObject[];
  parameters?: ResolvedParameter[];
  request_body?: OpenAPIV3_1.RequestBodyObject;
  api_keys?: ResolvedSecurityScheme[];
  parser?: unknown;
  accept?: string;
  /** `'true'` when rendered inside a callback. */
  callback?: string;
  /** `'true'` for webhooks (forces `allowTry = 'false'`). */
  webhook?: string;
  fillRequestFieldsWithExample: string;
  allowTry: string;
  showCurlBeforeTry?: string;
  renderStyle: string;
  schemaStyle: string;
  activeSchemaTab?: string;
  activeParameterSchemaTabs: Record<string, string>;
  schemaExpandLevel: number;
  schemaDescriptionExpanded: string;
  allowSchemaDescriptionExpandToggle: string;
  schemaHideReadOnly: string;
  schemaHideWriteOnly: string;
  fetchCredentials?: string;

  // Internal reactive state (initialised in the constructor)
  /** string, or a lit TemplateResult after a successful request. */
  responseMessage: unknown;
  responseStatus: string;
  /** Reset to `[]` by onTryClick (TODO(ts-migration)-worthy: otherwise always a string). */
  responseHeaders: string | string[];
  responseText: string;
  responseUrl: string;
  curlSyntax: string;
  responseIsBlob: boolean;
  responseBlobType: string;
  responseBlobUrl: string;
  respContentDisposition: string;
  activeResponseTab: string;
  selectedRequestBodyType: string;
  selectedRequestBodyExample: string;
  fileInputKeys: Record<string, number[]>;
  loading: boolean;
  activeAbortController?: AbortController | null;

  // Methods used by the templates
  requestUpdate(): void;
  onSelectExample(e: Event): void;
  onMimeTypeChange(e: Event): void;
  onFillRequestData(e: Event): Promise<void>;
  onClearRequestData(e: Event): Promise<void>;
  onTryClick(e: Event): Promise<void>;
  liveCURLSyntaxUpdate(requestPanelEl: HTMLElement): void;
  getRequestPanel(e: Event): HTMLElement | null;
  onAddFileInput(fieldName: string): void;
  onRemoveFileInput(fieldName: string, keyToRemove: number): void;
  clearResponseData(): void;
}

/** Members used by `applyApiKey` / `onClearAllApiKeys` / `recoverPersistedApiKeys` / the security-scheme UI. */
export type SecuritySchemeHost = Pick<
  RapiDocElement,
  | 'resolvedSpec'
  | 'requestUpdate'
  | 'dispatchEvent'
  | 'shadowRoot'
  | 'persistAuth'
  | 'selectedServer'
  | 'updateRoute'
  | 'renderStyle'
  | 'oauthReceiver'
  | 'additionalAuthorizeParams'
  | 'additionalTokenParams'
> & {
  /** Undefined on `<rapi-doc-mini>`, which never declares it. */
  allowAuthentication?: string;
};

/** Members used by `setApiServer` and `serverTemplate`. */
export type ServerHost = Pick<
  RapiDocElement,
  'resolvedSpec' | 'selectedServer' | 'requestUpdate' | 'dispatchEvent' | 'renderStyle' | 'mockServer'
>;
