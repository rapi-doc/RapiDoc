import exampleMatchesSchema from "./example-matches-schema.js";
import exampleNamedMap from "./example-named-map.js";
import infoContact from "./info-contact.js";
import infoLicense from "./info-license.js";
import mediaExample from "./media-example.js";
import noServerExampleCom from "./no-server-example-com.js";
import noUnusedComponents from "./no-unused-components.js";
import operation2xxResponse from "./operation-2xx-response.js";
import operation4xxResponse from "./operation-4xx-response.js";
import operationDescription from "./operation-description.js";
import operationOperationId from "./operation-operationId.js";
import operationOperationIdUnique from "./operation-operationId-unique.js";
import operationOperationIdUrlSafe from "./operation-operationId-url-safe.js";
import operationSummary from "./operation-summary.js";
import operationTagDefined from "./operation-tag-defined.js";
import parameterDescription from "./parameter-description.js";
import pathKebabCase from "./path-kebab-case.js";
import responseErrorSchema from "./response-error-schema.js";
import schemaOneofDiscriminator from "./schema-oneof-discriminator.js";
import securityDefined from "./security-defined.js";
import securitySchemeDefined from "./security-scheme-defined.js";
import stateful from "./stateful.js";
import tagDescription from "./tag-description.js";

/** Every rule, in the order they are listed in help and reports. @type {import("../types.js").Rule[]} */
export const RULES = [
  operationOperationId,
  operationOperationIdUnique,
  operationOperationIdUrlSafe,
  operationSummary,
  operationDescription,
  parameterDescription,
  operationTagDefined,
  tagDescription,
  operation2xxResponse,
  operation4xxResponse,
  responseErrorSchema,
  securityDefined,
  securitySchemeDefined,
  noUnusedComponents,
  mediaExample,
  exampleNamedMap,
  exampleMatchesSchema,
  schemaOneofDiscriminator,
  pathKebabCase,
  noServerExampleCom,
  infoContact,
  infoLicense,
  ...stateful,
];

export const RULE_NAMES = RULES.map((rule) => rule.name);
