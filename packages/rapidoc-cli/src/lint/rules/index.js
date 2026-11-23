import descriptionHtmlRemoved from "./description-html-removed.js";
import exampleMatchesSchema from "./example-matches-schema.js";
import exampleNamedMap from "./example-named-map.js";
import infoContact from "./info-contact.js";
import infoLicense from "./info-license.js";
import mediaExample from "./media-example.js";
import noAmbiguousPaths from "./no-ambiguous-paths.js";
import noEmptyServers from "./no-empty-servers.js";
import noEnumTypeMismatch from "./no-enum-type-mismatch.js";
import noHttpVerbsInPaths from "./no-http-verbs-in-paths.js";
import noPathTrailingSlash from "./no-path-trailing-slash.js";
import noRequiredUndefinedProperties from "./no-required-undefined-properties.js";
import noServerExampleCom from "./no-server-example-com.js";
import noServerTrailingSlash from "./no-server-trailing-slash.js";
import noUnusedComponents from "./no-unused-components.js";
import operation2xxResponse from "./operation-2xx-response.js";
import operation4xxResponse from "./operation-4xx-response.js";
import operationDescription from "./operation-description.js";
import operationIdCasingConsistent from "./operationId-casing-consistent.js";
import operationOperationId from "./operation-operationId.js";
import operationOperationIdUnique from "./operation-operationId-unique.js";
import operationOperationIdUrlSafe from "./operation-operationId-url-safe.js";
import operationParametersUnique from "./operation-parameters-unique.js";
import operationSingularTag from "./operation-singular-tag.js";
import operationSummary from "./operation-summary.js";
import operationTagDefined from "./operation-tag-defined.js";
import parameterCasingConsistent from "./parameter-casing-consistent.js";
import parameterDescription from "./parameter-description.js";
import pathKebabCase from "./path-kebab-case.js";
import pathNotIncludeQuery from "./path-not-include-query.js";
import propertyCasingConsistent from "./property-casing-consistent.js";
import responseErrorSchema from "./response-error-schema.js";
import schemaOneofDiscriminator from "./schema-oneof-discriminator.js";
import securityDefined from "./security-defined.js";
import securitySchemeDefined from "./security-scheme-defined.js";
import stateful from "./stateful.js";
import tagDescription from "./tag-description.js";
import tagsAlphabetical from "./tags-alphabetical.js";

/** Every rule, in the order they are listed in help and reports. @type {import("../types.js").Rule[]} */
export const RULES = [
  operationOperationId,
  operationOperationIdUnique,
  operationOperationIdUrlSafe,
  operationIdCasingConsistent,
  operationParametersUnique,
  parameterCasingConsistent,
  operationSummary,
  operationDescription,
  parameterDescription,
  descriptionHtmlRemoved,
  operationTagDefined,
  operationSingularTag,
  tagDescription,
  tagsAlphabetical,
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
  noEnumTypeMismatch,
  noRequiredUndefinedProperties,
  propertyCasingConsistent,
  pathKebabCase,
  noAmbiguousPaths,
  noPathTrailingSlash,
  pathNotIncludeQuery,
  noHttpVerbsInPaths,
  noEmptyServers,
  noServerTrailingSlash,
  noServerExampleCom,
  infoContact,
  infoLicense,
  ...stateful,
];

export const RULE_NAMES = RULES.map((rule) => rule.name);
