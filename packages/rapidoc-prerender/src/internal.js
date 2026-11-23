/**
 * `@rapidoc/prerender/internal`: what the other RapiDoc packages (the portal, the tests) use beyond the
 * public API. Not covered by semver: the parsed model's shape follows the parser of packages/rapidoc
 * and changes with it. Don't import this from outside the RapiDoc repository.
 */

export { resolveSpecInput } from "./render.js";
export { renderNavBarHtml } from "./navigation.js";
export { renderTemplateToString, escapeHtml } from "./serializer.js";
export { OperationSlugger } from "../../rapidoc/src/utils/slugger.js";
