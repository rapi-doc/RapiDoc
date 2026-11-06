/*
 * The shape of an OpenAPI document, for walks that need to know what a node is: which children of a
 * node of one kind are schemas, parameters, responses, ... `rapidoc bundle` uses it to pick a component's
 * container, `rapidoc lint` to hand each rule the nodes of the kinds it asked for.
 *
 * Kinds: root, components, pathItem, operation, parameter, header, requestBody, response, mediaType,
 * encoding, callback, schema, example, link, securityScheme (the last three have no $ref-able children).
 */

export const METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
];
const SCHEMA_ONE = [
  "items",
  "not",
  "additionalProperties",
  "additionalItems",
  "unevaluatedProperties",
  "unevaluatedItems",
  "propertyNames",
  "contains",
  "if",
  "then",
  "else",
];
const SCHEMA_MAP = ["properties", "patternProperties", "dependentSchemas", "$defs", "definitions"];
const SCHEMA_LIST = ["allOf", "anyOf", "oneOf", "prefixItems"];

/**
 * The kind of `key`'s value inside a node of kind `kind`, as ["one", kind], ["map", kind] or
 * ["list", kind]; undefined when it holds no $ref-able OpenAPI object (or the kind is unknown).
 * @param {string | undefined} kind
 * @param {string} key
 * @param {boolean} v2  Swagger 2.0 document
 */
export function childKind(kind, key, v2) {
  switch (kind) {
    case "root":
      if (key === "paths" || key === "webhooks") return ["map", "pathItem"];
      if (key === "components") return ["one", "components"];
      if (v2 && key === "definitions") return ["map", "schema"];
      if (v2 && key === "parameters") return ["map", "parameter"];
      if (v2 && key === "responses") return ["map", "response"];
      return undefined;
    case "components":
      return CONTAINERS[key] ? ["map", CONTAINERS[key]] : undefined;
    case "pathItem":
      if (key === "parameters") return ["list", "parameter"];
      if (METHODS.includes(key)) return ["one", "operation"];
      return undefined;
    case "operation":
      if (key === "parameters") return ["list", "parameter"];
      if (key === "requestBody") return ["one", "requestBody"];
      if (key === "responses") return ["map", "response"];
      if (key === "callbacks") return ["map", "callback"];
      return undefined;
    case "parameter":
    case "header":
      if (key === "schema" || (v2 && key === "items")) return ["one", "schema"];
      if (key === "examples") return ["map", "example"];
      if (key === "content") return ["map", "mediaType"];
      return undefined;
    case "requestBody":
      return key === "content" ? ["map", "mediaType"] : undefined;
    case "response":
      if (key === "headers") return ["map", "header"];
      if (key === "content") return ["map", "mediaType"];
      if (key === "links") return ["map", "link"];
      if (v2 && key === "schema") return ["one", "schema"];
      return undefined;
    case "mediaType":
      if (key === "schema") return ["one", "schema"];
      if (key === "examples") return ["map", "example"];
      if (key === "encoding") return ["map", "encoding"];
      return undefined;
    case "encoding":
      return key === "headers" ? ["map", "header"] : undefined;
    case "callback":
      return ["one", "pathItem"];
    case "schema":
      if (SCHEMA_ONE.includes(key)) return ["one", "schema"];
      if (SCHEMA_MAP.includes(key)) return ["map", "schema"];
      if (SCHEMA_LIST.includes(key)) return ["list", "schema"];
      return undefined;
    default:
      return undefined;
  }
}

/** components/<container> → kind (OpenAPI 3.x). */
export const CONTAINERS = {
  schemas: "schema",
  parameters: "parameter",
  responses: "response",
  requestBodies: "requestBody",
  headers: "header",
  examples: "example",
  links: "link",
  callbacks: "callback",
  pathItems: "pathItem",
  securitySchemes: "securityScheme",
};
