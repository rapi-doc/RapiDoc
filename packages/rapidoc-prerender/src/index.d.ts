/**
 * Types of `@rapidoc/prerender`.
 *
 * Options are camelCase, named as `<rapi-doc>`'s property for the same thing. An option that is also
 * an attribute of `<rapi-doc>` is accepted under the attribute's kebab-case name too
 * (`"schema-style"`); the types list the camelCase names. An unknown option name throws, except in
 * `renderRapiDoc`, which passes any other attribute of `<rapi-doc>` on to the element.
 */

/** A value of a `"true"` / `"false"` attribute of `<rapi-doc>`. */
export type BooleanLike = boolean | "true" | "false";

/** How a spec is read: the same options as `<rapi-doc>`'s attributes of these names. */
export interface SpecOptions {
  /** Give operations without a tag one named after their path's first segment (default `false`: they go under "General"). */
  generateMissingTags?: BooleanLike;
  sortTags?: BooleanLike;
  sortSchemas?: BooleanLike;
  /** Default `"none"`: the spec's order. (`<rapi-doc>` itself defaults to `"path"`.) */
  sortEndpointsBy?: "path" | "method" | "summary" | "none";
  apiKeyName?: string;
  apiKeyLocation?: "header" | "query";
  apiKeyValue?: string;
  serverUrl?: string;
  /** Which operations to keep, as `filter-operations` of `<rapi-doc>`: operationIds, `GET /path`, path globs, `tag:`, `badge:`, `deprecated`, `!` to leave out. */
  filterOperations?: string;
  /** Keep tags that no operation uses when they have a description, as `show-unused-tags` of `<rapi-doc>`. */
  showUnusedTags?: BooleanLike;
}

export interface RenderRapiDocOptions extends SpecOptions {
  /** A file path, a URL, JSON or YAML text, or a spec object. */
  spec: string | object;
  /** Default `"read"`. */
  renderStyle?: "read" | "view" | "focused";
  /** A preset (`ember`, `carbon`, `cobalt`, `jade`, `indigo`, `amber`) or a hex color. Default `"amber"`. */
  theme?: string;
  /** Default `"dark"`. `"auto"` follows the page's theme in the browser; the HTML is rendered dark. */
  colorScheme?: "dark" | "light" | "system" | "auto";
  /** Default `"row"`. */
  layout?: "row" | "column";
  showHeader?: BooleanLike;
  showSideNav?: BooleanLike;
  showInfo?: BooleanLike;
  allowSearch?: BooleanLike;
  /** Default `true`. */
  allowAdvancedSearch?: BooleanLike;
  allowServerSelection?: BooleanLike;
  allowAuthentication?: BooleanLike;
  allowTry?: BooleanLike;
  /** Default `"tree"`. */
  schemaStyle?: "tree" | "table";
  schemaExpandLevel?: number;
  defaultSchemaTab?: "example" | "schema";
  pageDirection?: "ltr" | "rtl";
  /** `"dsd"` (default): `<rapi-doc>` with Declarative Shadow DOM. `"html"` / `"light"`: plain light-DOM HTML. */
  outputMode?: "dsd" | "html" | "light";
  /** Inline the element's CSS in the output (default `true`). */
  includeStyles?: boolean;
  /** Inline an object `spec` as a `<script type="application/json" slot="rapidoc-spec">` (default `true`). */
  inlineSpec?: boolean;
  /** The operation shown first in focused mode (default `"overview"`, or the first operation when `showInfo` is off). */
  focusedElementId?: string;
  /** Any other attribute of `<rapi-doc>`, in camelCase or kebab-case: written to the element (DSD output). */
  [attribute: string]: unknown;
}

export interface RenderEndpointOptions extends SpecOptions {
  spec: string | object;
  /** The operation's path, matched exactly. */
  path: string;
  /** The HTTP method, in any case. */
  method: string;
  renderStyle?: "read" | "view";
  /** Default `"column"`. */
  layout?: "row" | "column";
  theme?: string;
  colorScheme?: "dark" | "light" | "system";
  includeStyles?: boolean;
  /** Default `false`. */
  allowTry?: BooleanLike;
  /** Default `"table"`. */
  schemaStyle?: "table" | "tree";
}

export interface RenderSchemaOptions {
  /** A JSON Schema object, or a name under `components.schemas` of `spec`. */
  schema: object | string;
  spec?: string | object;
  /** Default `"table"`. */
  schemaStyle?: "table" | "tree";
  schemaExpandLevel?: number;
  theme?: string;
  colorScheme?: "dark" | "light" | "system";
  includeStyles?: boolean;
}

/** An operation in the navigation: these fields and no others. */
export interface NavigationOperation {
  /** Lower case. */
  method: string;
  path: string;
  summary: string;
  description: string;
  /** The operation's anchor in `<rapi-doc>` (`#<elementId>`). */
  elementId: string;
  deprecated: boolean;
  /** The spec's `operationId`, or one made from the method and path when it has none. */
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

/** The sidebar's own options. */
export interface NavBarOptions {
  /** The prefix of every link, e.g. `/apis/orders`; a closing slash is ignored. */
  basePath?: string;
  /** The current URL or anchor: the matching item is marked active. */
  activeHref?: string;
  /** Include the filter box (default `true`). */
  includeSearch?: boolean;
  searchPlaceholder?: string;
  backToDocsHref?: string;
  backToDocsLabel?: string;
  /** A class added to every operation link. */
  itemClassName?: string;
  includeOverview?: boolean;
  /** The method's text with `showMethodInNavBar: "as-colored-block"` (default `"3-char"`). */
  methodBadgeFormat?: "3-char" | "full";
  /** `"single-page"` (default): links are `<basePath>#<anchor>`. `"tag-pages"`: `<basePath>/<tag slug>#<anchor>`, a page per tag. */
  routingMode?: "tag-pages" | "single-page";
  /** How each operation shows its HTTP method, as `show-method-in-nav-bar` of `<rapi-doc>` (default `as-colored-text`). */
  showMethodInNavBar?: "false" | "as-plain-text" | "as-colored-text" | "as-colored-block";
  /** A dot on items whose operation shows a badge, as `show-badges-in-nav-bar` of `<rapi-doc>` (default `dot`). */
  showBadgesInNavBar?: "dot" | "false";
  /** Show each operation's path instead of its summary, as `use-path-in-nav-bar` of `<rapi-doc>`. */
  usePathInNavBar?: BooleanLike;
}

/** Options of `getNavBarHtml`: the sidebar's, and how the spec is read. */
export interface GetNavBarHtmlOptions extends NavBarOptions, SpecOptions {}

/**
 * These functions throw when the spec cannot be loaded or parsed (a file that does not exist, a URL
 * that does not answer, text that is not an OpenAPI document), and on an unknown option name.
 */
export function renderRapiDoc(options: RenderRapiDocOptions): Promise<string>;
export function renderEndpoint(options: RenderEndpointOptions): Promise<string>;
export function renderSchema(options: RenderSchemaOptions): Promise<string>;
export function getSpecNavigation(
  specInput: string | object,
  options?: SpecOptions,
): Promise<SpecNavigation>;
export function getNavBarHtml(
  specInput: string | object,
  options?: GetNavBarHtmlOptions,
): Promise<string>;
/** The sidebar's filter box alone. */
export function getNavFilterHtml(options?: {
  searchPlaceholder?: string;
  inputClassName?: string;
}): string;
/** In the browser: ties a sidebar from `getNavBarHtml` to a `<rapi-doc>`. Returns a function that undoes it. */
export function bindNavBar(
  sidebar: HTMLElement | string,
  rapiDoc?: HTMLElement | string,
  options?: { activeClass?: string; updateHistory?: boolean },
): () => void;
/** The CSS of `<rapi-doc>`, every theme and color scheme included. `scope` replaces `:host`, for light-DOM HTML. */
export function getBundledCss(options?: { scope?: string }): string;
/** The sidebar's CSS; `scope` is the selector of the element that holds it. */
export function getNavCss(scope?: string): string;
/** The theme's CSS variables, on `:root` or `scope`. */
export function getThemeTokensCss(theme?: string, scope?: string): string;
/** A name as the kebab-case slug `<rapi-doc>` uses in anchors and the sidebar uses for tag pages. */
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
    /** Classes to add to step boxes, by step id. */
    stepClasses?: Record<string, string[]>;
    /**
     * How far the diagram may shrink to fit a narrower container, 0.85 for 85%; below that the
     * container scrolls (give it overflow-x: auto). Default 0: shrinks to any size.
     */
    minScale?: number;
    /** false leaves the API sources out of the first box (default: listed above the inputs). */
    showSources?: boolean;
  },
): {
  svg: string;
  /** Kinds of lines drawn, in this order when present. */
  legend: ("seq" | "success" | "failure" | "retry")[];
  graph: object | null;
  problems: ArazzoProblem[];
  workflowIds: string[];
};

/** CSS for the diagrams drawn by `renderArazzoWorkflow`. */
export function getFlowCss(): string;
