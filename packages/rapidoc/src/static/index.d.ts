/* eslint-disable no-unused-vars */
/**
 * TypeScript Type Definitions for 'rapidoc/static'
 */

export interface StaticDocOptions {
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

export interface StaticEndpointOptions {
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

export interface StaticSchemaOptions {
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

export interface CatalogEntry {
  id: string;
  title: string;
  version: string;
  description: string;
  servers: string[];
  contact: object | null;
  license: object | null;
  endpointsCount: number;
  tagGroupsCount: number;
  tagsCount: number;
  methodsSummary: Record<string, number>;
  [key: string]: any;
}

export interface SeoMetadata {
  title: string;
  description: string;
  jsonLd: Record<string, any>;
  jsonLdScript: string;
  openGraph: Record<string, string>;
  metaTags: string;
}

export function renderStaticDoc(options: StaticDocOptions): Promise<string>;
export function renderStaticEndpoint(options: StaticEndpointOptions): Promise<string>;
export function renderStaticSchema(options: StaticSchemaOptions): Promise<string>;
export function resolveSpecInput(specInput: string | object, options?: any): Promise<any>;
export function renderTemplateToString(result: any, options?: { stripComments?: boolean }): string;
export function escapeHtml(str: string): string;
export function getSpecNavigation(specInput: string | object, options?: any): Promise<SpecNavigation>;
export function getCatalogMetadata(specsList: Array<string | object>, options?: any): Promise<CatalogEntry[]>;
export function getSingleCatalogEntry(specItem: string | object, options?: any): Promise<CatalogEntry>;
export function generateSeoMetadata(specInput: string | object, options?: { baseUrl?: string }): Promise<SeoMetadata>;
export function getBundledCss(options?: { theme?: string; colorScheme?: string; scope?: string }): string;
