/**
 * Checks on the specs in `apis:` that do not stop a build. Shared by `rapidoc dev`, `rapidoc build`
 * and `rapidoc validate`.
 *
 * Operation links (/apis/<id>/<tag>#<operation>) use the operationId when there is one. Without it,
 * RapiDoc builds the anchor from the summary, so editing the summary breaks links to that operation.
 * (Every operation is also reachable by its method + path anchor, which only changes with the endpoint.)
 */

import fs from 'node:fs';
import yaml from 'yaml';
import { methodPathSlug, operationAnchorSource } from 'rapidoc/static';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace', 'query'];
const LISTED_OPERATIONS = 3;

/** Reads a local spec (JSON or YAML). Throws when it cannot be read or parsed. */
export function readSpecFile(fullPath) {
  const raw = fs.readFileSync(fullPath, 'utf8');
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
      if (!pathItem || typeof pathItem !== 'object') continue;
      for (const method of HTTP_METHODS) {
        const op = pathItem[method];
        if (!op || typeof op !== 'object') continue;
        const summary = op.summary || op.description;
        if (operationAnchorSource({ operationId: op.operationId, summary }) === 'summary') {
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
  const listed = ops.slice(0, LISTED_OPERATIONS).map((op) => `${op.method.toUpperCase()} ${op.path}`);
  const more = ops.length > LISTED_OPERATIONS ? `, and ${ops.length - LISTED_OPERATIONS} more` : '';
  const count = ops.length === 1 ? '1 operation has' : `${ops.length} operations have`;
  return [
    `${api.id}: ${count} no operationId, so links to them change when their summary changes (${listed.join(', ')}${more}). ` +
      'Add an operationId to keep these links stable.',
  ];
}

/**
 * Warnings for every API in a normalized portal config.
 *
 * @param {{apis?: object[]}} config
 * @returns {string[]}
 */
export function checkPortalSpecs(config) {
  return (config.apis || []).flatMap(checkApiSpec);
}

/** Prints checkPortalSpecs() warnings (used by `rapidoc dev` and `rapidoc build`). */
export function reportSpecWarnings(config) {
  for (const warning of checkPortalSpecs(config)) console.warn(`[rapidoc-portal] Warning: ${warning}`);
}
