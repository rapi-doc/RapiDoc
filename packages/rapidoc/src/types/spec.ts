/**
 * Types of the resolved spec data model produced by `utils/spec-parser.ts` (`ProcessSpec`) and consumed
 * by every template/component through `this.resolvedSpec`. Types only: no runtime code.
 */
import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { Tokens } from 'marked';

/** HTTP methods RapiDoc renders (also the endpoint ordering used by `sort-endpoints-by="method"`). */
export type HttpMethod = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'head' | 'options';

/** Value of the `sort-endpoints-by` attribute. */
export type SortEndpointsBy = 'none' | 'method' | 'summary' | 'path';

/** Heading token extracted from a markdown description (depth 1 or 2). */
export type MarkdownHeading = Tokens.Heading;

/** `info` object of the spec (title/description/version/contact/license/termsOfService). */
export type ResolvedInfo = OpenAPIV3_1.InfoObject;

/** `x-badges` item of an operation. */
export interface XBadge {
  label: string;
  color?: string;
}

/** `x-codeSamples` / `x-code-samples` item of an operation. */
export interface XCodeSample {
  lang: string;
  label?: string;
  source: string;
}

/** Server variable, with the `value` (initially the `default`) added by the parser. */
export type ResolvedServerVariable = OpenAPIV3_1.ServerVariableObject & { value?: string };

/** Server with the `computedUrl` (variables substituted) added by the parser. */
export interface ResolvedServer extends Omit<OpenAPIV3_1.ServerObject, 'variables'> {
  computedUrl: string;
  variables?: Record<string, ResolvedServerVariable>;
}

/** Operation parameter (after merging path-level and operation-level parameters). */
export type ResolvedParameter = OpenAPIV3_1.ParameterObject;

/** Callbacks of an operation: callback name -> expression -> path item (only object entries are kept). */
export type ResolvedCallbacks = Record<string, Record<string, OpenAPIV3_1.PathItemObject>>;

/** An operation (or webhook) with the fields computed by the parser. */
export interface ResolvedPath {
  show: boolean;
  expanded: boolean;
  isWebhook: boolean;
  expandedAtLeastOnce: boolean;
  summary: string;
  description: string;
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject;
  shortSummary: string;
  method: HttpMethod;
  path: string;
  operationId?: string;
  elementId: string;
  servers: OpenAPIV3_1.ServerObject[];
  parameters: ResolvedParameter[];
  requestBody?: OpenAPIV3_1.RequestBodyObject;
  responses?: OpenAPIV3_1.ResponsesObject;
  callbacks?: ResolvedCallbacks;
  deprecated?: boolean;
  security?: OpenAPIV3_1.SecurityRequirementObject[];
  xBadges?: XBadge[];
  /** `''` when the operation has no code samples. */
  xCodeSamples: XCodeSample[] | '';
}

/** A tag (navigation group) with the operations belonging to it. */
export interface ResolvedTag {
  show: boolean;
  elementId: string;
  name: string;
  /** Only set for tags declared in the spec's `tags` array. */
  displayName?: string;
  description: string;
  headers: MarkdownHeading[];
  paths: ResolvedPath[];
  expanded: boolean;
  /** Only set when endpoints are sorted (`sort-endpoints-by` other than `none`). */
  firstPathId?: string;
}

/** Security scheme with the derived fields added by the parser (and mutated by the security UI). */
export interface ResolvedSecurityScheme {
  securitySchemeId: string;
  type?: string;
  description?: string;
  /** Header/cookie/query location of an api-key. */
  in?: string;
  /** Name of the header/cookie/api-key. */
  name?: string;
  /** Name of the security-scheme. */
  nameId?: string;
  scheme?: string;
  bearerFormat?: string;
  openIdConnectUrl?: string;
  flows?: OpenAPIV3_1.OAuthFlows;
  oAuthFlow?: string;
  user?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  value?: string;
  finalKeyValue?: string;
  typeDisplay?: string;
}

/** An entry of a components group (e.g. one schema of `components.schemas`). */
export interface ResolvedSubComponent {
  show: boolean;
  id: string;
  name: string;
  component: unknown;
}

/** A components group (schemas, responses, parameters, ...). */
export interface ResolvedComponent {
  show: boolean;
  name: string;
  description: string;
  subComponents: ResolvedSubComponent[];
}

export type ResolvedComponents = ResolvedComponent[];

/** Successfully resolved spec. */
export interface ResolvedSpec {
  specLoadError: false;
  isSpecLoading: false;
  info: ResolvedInfo;
  infoDescriptionHeaders: MarkdownHeading[];
  tags: ResolvedTag[];
  components: ResolvedComponents;
  externalDocs?: OpenAPIV3_1.ExternalDocumentationObject;
  securitySchemes: ResolvedSecurityScheme[];
  servers: ResolvedServer[];
}

/** Returned by `ProcessSpec` when the spec could not be loaded/parsed (the info holds the error message). */
export interface ResolvedSpecError {
  specLoadError: true;
  isSpecLoading: false;
  info: { title: string; description: string; version: string };
  tags: ResolvedTag[];
}

/** Placeholder set by the components while the spec is loading. */
export interface ResolvedSpecLoading {
  specLoadError: false;
  isSpecLoading: true;
  tags: ResolvedTag[];
}

/** Any value `this.resolvedSpec` can hold (null when loading failed or nothing was loaded yet). */
export type ResolvedSpecState = ResolvedSpec | ResolvedSpecError | ResolvedSpecLoading | null;

/** One schema + examples block of the JSON-schema-viewer variant of the resolved spec. */
export interface JsonSchemaAndExamples {
  elementId: string;
  name: string;
  schema: OpenAPIV3_1.SchemaObject;
  example?: unknown;
  examples?: unknown;
  selectedExample?: string;
}

/** Resolved spec of `<json-schema-viewer>`. */
export interface ResolvedJsonSchemaSpec {
  specLoadError: boolean;
  isSpecLoading: boolean;
  info?: ResolvedInfo;
  tags: ResolvedTag[];
  schemaAndExamples: JsonSchemaAndExamples[];
}

/** Entry returned by `advancedSearch`. */
export interface AdvancedSearchMatch {
  elementId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  deprecated?: boolean;
}

/** Options accepted by `enableMockServer` / `updateMockConfig` (attribute strings). */
export interface MockOptions {
  statusCode?: string;
  statusStrategy?: string;
  delay?: number | string;
  log?: string;
}
