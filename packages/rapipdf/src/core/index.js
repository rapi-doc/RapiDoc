/*
 * The headless part of RapiPdf: a resolved OpenAPI document in, a pdfmake document definition out.
 * No DOM, network or file access, and no pdfmake: the browser element and Node hand the definition
 * to their own pdfmake.
 */
export { buildDocDefinition, DEFAULT_OPTIONS } from "./doc-definition.js";
export { buildSpecModel } from "./spec-model.js";
export { DEFAULT_LOCALIZE } from "./localize.js";
export { markdownToPdfmake } from "./markdown.js";
