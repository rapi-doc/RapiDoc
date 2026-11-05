/**
 * TypeScript Type Definitions for '@rapidoc/prerender'
 */

export interface RenderRapiDocOptions {
  spec: string | object;
  renderStyle?: "read" | "view" | "focused";
  theme?: string;
  colorScheme?: "dark" | "light" | "system";
  layout?: "row" | "column";
  showHeader?: boolean | string;
  showSideNav?: boolean | string;
  showInfo?: boolean | string;
  allowSearch?: boolean | string;
  allowAdvancedSearch?: boolean | string;
  allowServerSelection?: boolean | string;
  allowAuthentication?: boolean | string;
  allowTry?: boolean | string;
  schemaStyle?: "table" | "tree";
  schemaExpandLevel?: number;
  defaultSchemaTab?: "example" | "schema";
  outputMode?: "dsd" | "html" | "light";
  includeStyles?: boolean;
  matchPaths?: string;
  pageDirection?: "ltr" | "rtl";
  /** Keep tags that no operation uses when they have a description, as `show-unused-tags` of `<rapi-doc>`. */
  showUnusedTags?: boolean | "true" | "false";
  /** Inline an object `spec` as a `<script type="application/json" slot="rapidoc-spec">` (default `true`). */
  inlineSpec?: boolean;
  /** The operation shown first in focused mode (default `"overview"`, or the first operation when `showInfo` is off). */
  focusedElementId?: string;
  [key: string]: any;
}

export type RapiDocOptions = RenderRapiDocOptions;

export interface RenderEndpointOptions {
  spec: string | object;
  path: string;
  method: string;
  renderStyle?: "read" | "view";
  layout?: "row" | "column";
  theme?: string;
  colorScheme?: "dark" | "light" | "system";
  includeStyles?: boolean;
  allowTry?: boolean | string;
  schemaStyle?: "table" | "tree";
}

export interface RenderSchemaOptions {
  schema: object | string;
  spec?: string | object;
  style?: "table" | "tree";
  schemaExpandLevel?: number;
  theme?: string;
  colorScheme?: "dark" | "light" | "system";
  includeStyles?: boolean;
}

export interface NavigationOperation {
  method: string;
  path: string;
  summary: string;
  description: string;
  elementId: string;
  deprecated: boolean;
  operationId: string;
  isWebhook: boolean;
}

export interface NavigationTag {
  name: string;
  /** `x-displayName` when the spec sets it, else `name`. */
  displayName: string;
  description: string;
  elementId: string;
  expanded: boolean;
  paths: NavigationOperation[];
  /** A tag kept for its description (`show-unused-tags`, or listed in `x-tagGroups`); `paths` is empty. */
  descriptionOnly?: boolean;
}

export interface NavigationTagGroup {
  name: string;
  /** `x-displayName` when the spec sets it, else `name`. */
  displayName: string;
  description: string;
  elementId: string;
  expanded: boolean;
  tags: NavigationTag[];
}

export interface SpecNavigation {
  title: string;
  version: string;
  description: string;
  tagGroups: NavigationTagGroup[];
  tags: NavigationTag[];
  /** With tag groups, the tags no group lists; otherwise empty. */
  remainingTags: NavigationTag[];
}

export interface RenderNavBarHtmlOptions {
  basePath?: string;
  activeHref?: string;
  includeSearch?: boolean;
  searchPlaceholder?: string;
  backToDocsHref?: string;
  backToDocsLabel?: string;
  itemClassName?: string;
  includeOverview?: boolean;
  methodBadgeFormat?: "3-char" | "full";
  /** How each operation shows its HTTP method, as `show-method-in-nav-bar` of `<rapi-doc>` (default `as-colored-block`). */
  showMethodInNavBar?: "false" | "as-plain-text" | "as-colored-text" | "as-colored-block";
  "show-method-in-nav-bar"?: "false" | "as-plain-text" | "as-colored-text" | "as-colored-block";
  /** Show each operation's path instead of its summary, as `use-path-in-nav-bar` of `<rapi-doc>`. */
  usePathInNav?: boolean | "true" | "false";
  "use-path-in-nav-bar"?: boolean | "true" | "false";
  routingMode?: "tag-pages" | "single-page";
  "routing-mode"?: "tag-pages" | "single-page";
}

export function renderRapiDoc(options: RenderRapiDocOptions): Promise<string>;
export function renderEndpoint(options: RenderEndpointOptions): Promise<string>;
export function renderSchema(options: RenderSchemaOptions): Promise<string>;
export function resolveSpecInput(specInput: string | object, options?: any): Promise<any>;
export function renderTemplateToString(result: any, options?: { stripComments?: boolean }): string;
export function escapeHtml(str: string): string;
export function getSpecNavigation(
  specInput: string | object,
  options?: any,
): Promise<SpecNavigation>;
export function getNavBarHtml(
  specInput: string | object,
  options?: RenderNavBarHtmlOptions,
): Promise<string>;
export function renderNavBarHtml(resolvedSpec: any, options?: RenderNavBarHtmlOptions): string;
export function getNavFilterHtml(options?: {
  searchPlaceholder?: string;
  /** Alias of `searchPlaceholder`. */
  placeholder?: string;
  inputClassName?: string;
}): string;
export function bindNavBar(
  sidebar: HTMLElement | string,
  rapiDoc?: HTMLElement | string,
  options?: { activeClass?: string; updateHistory?: boolean },
): () => void;
export function getMethodBadge(method: string, format?: "3-char" | "full"): string;
export function getBundledCss(options?: {
  theme?: string;
  colorScheme?: string;
  scope?: string;
}): string;
export function getNavCss(scope?: string): string;
export function getThemeTokensCss(theme?: string, scope?: string): string;
export function toKebabCase(str: string): string;

/** Anchor built from an operation's method and path (e.g. "get-routes-id-estimate"); <rapi-doc> resolves it to the operation. */
export function methodPathSlug(method: string, path: string): string;

/** Which field an operation's anchor is built from: 'operationId' (stable), 'summary' or 'path' (method + path). */
export function operationAnchorSource(op: {
  operationId?: string;
  summary?: string;
}): "operationId" | "summary" | "path";

/** A problem found by Arazzo validation. */
export interface ArazzoProblem {
  level: "error" | "warning";
  path: string;
  message: string;
}

/**
 * Draws one Arazzo workflow as an SVG string. `sources` maps source description names to their
 * OpenAPI documents (text or object), so steps show their method and path. Style the result with
 * `getFlowCss()` plus `getThemeTokensCss()`.
 */
export function renderArazzoWorkflow(
  arazzo: string | object,
  options?: {
    workflowId?: string;
    sources?: Record<string, string | object>;
    /** "expanded" (default) lists each step's inputs and actions in its box. */
    view?: "expanded" | "compact";
    idPrefix?: string;
    interactive?: boolean;
  },
): {
  svg: string;
  /** Kinds of lines drawn, for a legend, in this order when present. */
  legend: ("seq" | "data" | "output" | "success" | "failure" | "action")[];
  graph: object | null;
  problems: ArazzoProblem[];
  workflowIds: string[];
};

/** CSS for the diagrams drawn by `renderArazzoWorkflow`. */
export function getFlowCss(): string;
