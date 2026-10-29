/* eslint-disable no-unused-vars */
/**
 * TypeScript Type Definitions for 'rapidoc/static'
 */

export interface RenderRapiDocOptions {
  spec: string | object;
  renderStyle?: 'read' | 'view' | 'focused';
  theme?: string;
  colorScheme?: 'dark' | 'light' | 'system';
  layout?: 'row' | 'column';
  showHeader?: boolean | string;
  showSideNav?: boolean | string;
  showInfo?: boolean | string;
  allowSearch?: boolean | string;
  allowAdvancedSearch?: boolean | string;
  allowServerSelection?: boolean | string;
  allowAuthentication?: boolean | string;
  allowTry?: boolean | string;
  schemaStyle?: 'table' | 'tree';
  schemaExpandLevel?: number;
  defaultSchemaTab?: 'example' | 'schema';
  outputMode?: 'dsd' | 'html' | 'light';
  includeStyles?: boolean;
  matchPaths?: string;
  pageDirection?: 'ltr' | 'rtl';
  [key: string]: any;
}

export type RapiDocOptions = RenderRapiDocOptions;

export interface RenderEndpointOptions {
  spec: string | object;
  path: string;
  method: string;
  renderStyle?: 'read' | 'view';
  layout?: 'row' | 'column';
  theme?: string;
  colorScheme?: 'dark' | 'light' | 'system';
  includeStyles?: boolean;
  allowTry?: boolean | string;
  schemaStyle?: 'table' | 'tree';
}

export interface RenderSchemaOptions {
  schema: object | string;
  spec?: string | object;
  style?: 'table' | 'tree';
  schemaExpandLevel?: number;
  theme?: string;
  colorScheme?: 'dark' | 'light' | 'system';
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
  description: string;
  elementId: string;
  expanded: boolean;
  paths: NavigationOperation[];
}

export interface NavigationTagGroup {
  name: string;
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
  methodBadgeFormat?: '3-char' | 'full';
  /** How each operation shows its HTTP method, as `show-method-in-nav-bar` of `<rapi-doc>` (default `as-colored-block`). */
  showMethodInNavBar?: 'false' | 'as-plain-text' | 'as-colored-text' | 'as-colored-block';
  'show-method-in-nav-bar'?: 'false' | 'as-plain-text' | 'as-colored-text' | 'as-colored-block';
  /** Show each operation's path instead of its summary, as `use-path-in-nav-bar` of `<rapi-doc>`. */
  usePathInNav?: boolean | 'true' | 'false';
  'use-path-in-nav-bar'?: boolean | 'true' | 'false';
  routingMode?: 'tag-pages' | 'single-page';
}

export function renderRapiDoc(options: RenderRapiDocOptions): Promise<string>;
export function renderEndpoint(options: RenderEndpointOptions): Promise<string>;
export function renderSchema(options: RenderSchemaOptions): Promise<string>;
export function resolveSpecInput(specInput: string | object, options?: any): Promise<any>;
export function renderTemplateToString(result: any, options?: { stripComments?: boolean }): string;
export function escapeHtml(str: string): string;
export function getSpecNavigation(specInput: string | object, options?: any): Promise<SpecNavigation>;
export function getNavBarHtml(specInput: string | object, options?: RenderNavBarHtmlOptions): Promise<string>;
export function renderNavBarHtml(resolvedSpec: any, options?: RenderNavBarHtmlOptions): string;
export function getNavFilterHtml(options?: { searchPlaceholder?: string; inputClassName?: string }): string;
export function bindNavBar(
  sidebar: HTMLElement | string,
  rapiDoc?: HTMLElement | string,
  options?: { activeClass?: string; updateHistory?: boolean }
): () => void;
export function getMethodBadge(method: string, format?: '3-char' | 'full'): string;
export function getBundledCss(options?: { theme?: string; colorScheme?: string; scope?: string }): string;
export function getNavCss(scope?: string): string;
export function getThemeTokensCss(theme?: string, scope?: string): string;
export function toKebabCase(str: string): string;

/** Anchor built from an operation's method and path (e.g. "get-routes-id-estimate"); <rapi-doc> resolves it to the operation. */
export function methodPathSlug(method: string, path: string): string;

/** Which field an operation's anchor is built from: 'operationId' (stable), 'summary' or 'path' (method + path). */
export function operationAnchorSource(op: { operationId?: string; summary?: string }): 'operationId' | 'summary' | 'path';
