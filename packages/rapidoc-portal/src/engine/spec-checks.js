/**
 * Checks on the specs in `apis:` that do not stop a build. Shared by `rapidoc dev`, `rapidoc build`
 * and `rapidoc validate`.
 *
 * Operation links (/apis/<id>/<tag>#<operation>) use the operationId when there is one. Without it,
 * RapiDoc builds the anchor from the summary, so editing the summary breaks links to that operation.
 * (Every operation is also reachable by its method + path anchor, which only changes with the endpoint.)
 */

import fs from "node:fs";
import yaml from "yaml";
import { methodPathSlug, operationAnchorSource } from "@rapidoc/prerender";
import { compileWorkflows, indexOperations, parseArazzo, validateArazzo } from "@rapidoc/mcp";

const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];
const LISTED_OPERATIONS = 3;

/** Reads a local spec (JSON or YAML). Throws when it cannot be read or parsed. */
export function readSpecFile(fullPath) {
  const raw = fs.readFileSync(fullPath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return yaml.parse(raw);
  }
}

/**
 * Operations whose anchor is built from their summary.
 *
 * @param {object} spec - Parsed OpenAPI document
 * @returns {{method: string, path: string, alias: string}[]}
 */
export function summaryAnchoredOperations(spec) {
  const found = [];
  for (const group of [spec?.paths, spec?.webhooks]) {
    for (const [pathName, pathItem] of Object.entries(group || {})) {
      if (!pathItem || typeof pathItem !== "object") continue;
      for (const method of HTTP_METHODS) {
        const op = pathItem[method];
        if (!op || typeof op !== "object") continue;
        const summary = op.summary || op.description;
        if (operationAnchorSource({ operationId: op.operationId, summary }) === "summary") {
          found.push({ method, path: pathName, alias: methodPathSlug(method, pathName) });
        }
      }
    }
  }
  return found;
}

/**
 * Warnings for one API from `apis:` (normalized config entry). Remote specs are not checked.
 *
 * @param {{id: string, fullPath?: string, isRemote?: boolean}} api
 * @returns {string[]}
 */
export function checkApiSpec(api) {
  if (api.isRemote || !api.fullPath || !fs.existsSync(api.fullPath)) return [];
  let spec;
  try {
    spec = readSpecFile(api.fullPath);
  } catch {
    return []; // `rapidoc validate` reports specs that do not parse
  }
  const ops = summaryAnchoredOperations(spec);
  if (ops.length === 0) return [];
  const listed = ops
    .slice(0, LISTED_OPERATIONS)
    .map((op) => `${op.method.toUpperCase()} ${op.path}`);
  const more = ops.length > LISTED_OPERATIONS ? `, and ${ops.length - LISTED_OPERATIONS} more` : "";
  const count = ops.length === 1 ? "1 operation has" : `${ops.length} operations have`;
  return [
    `${api.id}: ${count} no operationId, so links to them change when their summary changes (${listed.join(", ")}${more}). ` +
      "Add an operationId to keep these links stable.",
  ];
}

/**
 * Warnings for one Arazzo file of `workflows:` (normalized entry): structural problems, source
 * descriptions that match no API, and workflows the runtime cannot run (an operation not found in
 * the API's spec, a step that calls another workflow, non-simple criteria). Each source resolves
 * against the default version of its API.
 *
 * @param {{id: string, fullPath: string, sources: Record<string, string>}} workflow
 * @param {{id: string, fullPath?: string, isRemote?: boolean}[]} apis normalized `apis:`
 * @returns {string[]}
 */
export function checkWorkflow(workflow, apis = []) {
  if (!fs.existsSync(workflow.fullPath)) return [];
  let doc;
  try {
    doc = parseArazzo(fs.readFileSync(workflow.fullPath, "utf8"));
  } catch (err) {
    return [`${workflow.id}: ${workflow.fullPath} cannot be parsed: ${err.message.split("\n")[0]}`];
  }
  const warnings = validateArazzo(doc)
    .filter((p) => p.level === "error")
    .map((p) => `${workflow.id}: ${p.path ? `${p.path} ` : ""}${p.message}`);
  const sources = new Map();
  for (const s of doc.sourceDescriptions || []) {
    if (!s?.name || (s.type && s.type !== "openapi")) continue;
    const apiId = workflow.sources?.[s.name];
    const api = apis.find((a) => a.id === apiId);
    if (!api) {
      warnings.push(
        `${workflow.id}: source "${s.name}" is not one of the portal's APIs; name it after an API id or map it in workflows[].sources`,
      );
      continue;
    }
    if (api.isRemote || !api.fullPath || !fs.existsSync(api.fullPath)) continue;
    try {
      sources.set(s.name, indexOperations(readSpecFile(api.fullPath)));
    } catch {
      // `rapidoc validate` reports specs that do not parse
    }
  }
  compileWorkflows(doc, {
    sources,
    onProblem: (p) => warnings.push(`${workflow.id}: ${p.message}`),
  });
  return warnings;
}

/**
 * Warnings for every API and workflow in a normalized portal config.
 *
 * @param {{apis?: object[], workflows?: object[]}} config
 * @returns {string[]}
 */
export function checkPortalSpecs(config) {
  return [
    ...(config.apis || []).flatMap((api) =>
      api.versions.flatMap((version) =>
        checkApiSpec({ ...version, id: api.versioned ? `${api.id} ${version.version}` : api.id }),
      ),
    ),
    ...(config.workflows || []).flatMap((workflow) => checkWorkflow(workflow, config.apis)),
  ];
}

/** Prints checkPortalSpecs() warnings (used by `rapidoc dev` and `rapidoc build`). */
export function reportSpecWarnings(config) {
  for (const warning of checkPortalSpecs(config))
    console.warn(`[rapidoc-portal] Warning: ${warning}`);
}
