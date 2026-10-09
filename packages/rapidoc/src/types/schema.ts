import type { OpenAPIV3_1 } from '@scalar/openapi-types';

/**
 * Keys of the OpenAPI 3.1 base schema that are redefined below (recursive keys and keys whose shape is loosened because
 * RapiDoc accepts both OpenAPI 3.0 and 3.1 documents, and swagger-like variants).
 */
type RedefinedKeys =
  | 'type'
  | 'items'
  | 'properties'
  | 'patternProperties'
  | 'additionalProperties'
  | 'allOf'
  | 'anyOf'
  | 'oneOf'
  | 'not'
  | 'examples'
  | 'required'
  | 'xml'
  | 'enum'
  | 'const'
  | 'default'
  | 'example'
  | 'exclusiveMinimum'
  | 'exclusiveMaximum'
  | 'nullable';

/** XML object of a schema (only the members read by RapiDoc) */
export interface SchemaXml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

/**
 * A (dereferenced) JSON Schema / OpenAPI schema as consumed by RapiDoc.
 * Built on the OpenAPI 3.1 schema members; recursive members are typed with this very interface
 * (the spec is dereferenced before rendering so `$ref` only remains for circular references).
 */
export interface Schema extends Omit<OpenAPIV3_1.BaseSchemaObject, RedefinedKeys> {
  $ref?: string;
  /** string, or list of strings (OpenAPI 3.1 multi-type) */
  type?: string | string[];
  /** OpenAPI 3.0 nullable flag */
  nullable?: boolean;
  items?: Schema;
  properties?: Record<string, Schema>;
  patternProperties?: Record<string, Schema>;
  additionalProperties?: Schema | boolean;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  not?: Schema;
  required?: string[];
  xml?: SchemaXml;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  example?: unknown;
  /** JSON Schema `examples` keyword (array); some documents provide a map of example objects */
  examples?: unknown[];
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: Schema;
  /** Vendor extension: name used for the `additionalProperties` key placeholder */
  'x-additionalPropertiesName'?: string;
  /** Other vendor extensions */
  [extension: `x-${string}`]: unknown;
}

/** Return type of `getTypeInfo` */
export interface TypeInfo {
  type: string;
  format: string;
  contentMediaType: string;
  contentEncoding: string;
  contentSchema: Schema | null;
  pattern: string;
  /** '🆁' (read only), '🆆' (write only) or '' */
  readOrWriteOnly: '🆁' | '🆆' | '';
  /** '❌' when deprecated, '' otherwise */
  deprecated: '❌' | '';
  examples: unknown;
  /** printable default value */
  default: string;
  description: string;
  constrain: string;
  allowedValues: string;
  arrayType: string;
  /** values joined by `~|~`, parsed by the schema rendering components */
  html: string;
}

/* ------------------------------------------------------------------------- */
/* Examples                                                                  */
/* ------------------------------------------------------------------------- */

/** Example object as found in `examples` maps (OpenAPI Example Object) */
export interface ExampleObject {
  value?: unknown;
  summary?: string;
  description?: string;
  externalValue?: string;
  'x-example-show-value'?: boolean;
}

/** Map of named examples, output of `standardizeExample` and input of `normalizeExamples` / `generateExample` */
export type ExamplesMap = Record<string, ExampleObject>;

/** One entry of the list returned by `normalizeExamples` */
export interface NormalizedExample {
  /** raw value for `array` data types, otherwise a string */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  printableValue: string;
  summary?: string;
  description?: string;
}

/** Return type of `normalizeExamples` */
export interface NormalizedExamples {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exampleVal: any;
  exampleList: NormalizedExample[];
}

/** Output format of an example: `json` content is an object/value, `text` content is a string */
export type ExampleFormat = 'json' | 'text';

/** Entry of the list returned by `generateExample` */
export interface GeneratedExample {
  exampleId: string;
  exampleSummary: string;
  exampleDescription: string;
  exampleType: string;
  /** parsed value for `json`, string for `text` */
  exampleValue: unknown;
  exampleFormat: string;
}

/**
 * Dynamic sample value generated from a schema (object, array, primitive, null...).
 * Generated objects also carry `::TITLE`, `::DESCRIPTION`, `::XML_TAG` and `::XML_WRAP` internal keys.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SampleValue = any;

/** Map of generated examples: `example-0`, `example-1`... */
export type SampleObj = Record<string, SampleValue>;

/** Config accepted by `schemaToSampleObj` */
export interface SampleConfig {
  includeReadOnly?: boolean;
  includeWriteOnly?: boolean;
  includeDeprecated?: boolean;
  /** passed by `generateExample` but never read by `schemaToSampleObj` */
  deprecated?: boolean;
  useXmlTagForProp?: boolean;
}

/** Tuple returned by `getSchemaFromParam`: [schema, serialize style, media type object] */
export type SchemaFromParam = [Schema | null, 'json' | 'xml' | null, { schema?: Schema; [key: string]: unknown } | null];

/* ------------------------------------------------------------------------- */
/* AST (schemaToAST)                                                         */
/* ------------------------------------------------------------------------- */

interface SchemaASTBase {
  name: string;
  title: string;
  description: string;
  required: boolean;
  /** set on options of a union */
  optionIndex?: number;
  optionTitle?: string;
}

export interface ObjectAST extends SchemaASTBase {
  kind: 'object';
  /** only set on truncated nodes (recursion limit) */
  type?: string | string[];
  truncated?: boolean;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  nullable?: boolean;
  dataTypeLabel?: string;
  properties?: SchemaAST[];
  patternProperties?: SchemaAST[];
  additionalProperties?: SchemaAST | null;
  /** unions merged from allOf compositions */
  unions?: SchemaAST[];
}

export interface ArrayAST extends SchemaASTBase {
  kind: 'array';
  deprecated: boolean;
  readOnly: boolean;
  writeOnly: boolean;
  nullable: boolean;
  dataTypeLabel: string;
  arrayType: string | string[];
  minItems?: number;
  maxItems?: number;
  uniqueItems: boolean;
  items: SchemaAST | null;
}

export interface PrimitiveAST extends SchemaASTBase {
  kind: 'primitive';
  type: string | string[];
  format: string;
  contentMediaType: string;
  contentEncoding: string;
  contentSchema: Schema | null;
  pattern: string;
  constraints: string;
  defaultValue: string;
  allowedValues: string;
  deprecated: boolean;
  readOnly: boolean;
  writeOnly: boolean;
  html: string;
}

export interface UnionAST extends SchemaASTBase {
  kind: 'union';
  operator: 'anyOf' | 'oneOf';
  suffix?: string;
  /** reset to false on union options by `schemaToAST` */
  readOnly?: boolean;
  writeOnly?: boolean;
  properties?: SchemaAST[];
  options: SchemaAST[];
}

/** AST node returned by `schemaToAST` */
export type SchemaAST = ObjectAST | ArrayAST | PrimitiveAST | UnionAST;

/* ------------------------------------------------------------------------- */
/* Object notation (schemaInObjectNotation, deprecated)                      */
/* ------------------------------------------------------------------------- */

/** Value of an object notation entry: type info string (`getTypeInfo().html`), flag, or nested notation */
export type ObjectNotationValue = string | string[] | boolean | undefined | ObjectNotation;

/**
 * Object notation of a schema. Keys prefixed with `::` are metadata
 * (`::type`, `::title`, `::description`, `::deprecated`, `::readwrite`, `::nullable`, `::dataTypeLabel`, `::props`,
 * `::array-type`, `::OPTION~n`, `::ANY~OF`, `::ONE~OF`), other keys are property names.
 */
export interface ObjectNotation {
  [key: string]: ObjectNotationValue;
}
