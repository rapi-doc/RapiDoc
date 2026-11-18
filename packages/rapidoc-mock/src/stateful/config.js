/**
 * The user's corrections to what the stateful mock worked out, as `mock.config.yaml` holds them:
 *
 *   resources:
 *     Pod:
 *       key: metadata.name          # the key of a resource; it may sit inside the record
 *   operations:
 *     deleteVideo:                  # an operationId, or "DELETE /videos"
 *       resource: Video
 *       action: delete              # none, list, create, createMany, read, update, patch, delete
 *       key: query.id               # where the record's key comes from: path.x, query.x or body.x
 *     sendMessage:
 *       action: none                # keep no state for it
 *
 * With several APIs the same two sections go under `apis.<api id>`. `version: 1` at the top says which format
 * the file is in; it is optional, and there so the format can change later without guessing. What is set here is taken as stated: it is
 * not marked for review. An entry that no longer fits the spec (a resource, operation, field or parameter that
 * is not there) is skipped and reported, never applied silently or dropped silently.
 */
import { listOperations, resolve } from "../spec.js";
import { operationIds, propertiesOf } from "./classify.js";

export const CONFIG_FILE = "mock.config.yaml";
/** The format of the file this code reads. A file may say `version: 1`; one without the line is read as 1. */
export const CONFIG_VERSION = 1;

const ACTIONS = ["none", "list", "create", "createMany", "read", "update", "patch", "delete"];
const KEYED = new Set(["read", "update", "patch", "delete"]);
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const unknownKeys = (object, known) => Object.keys(object).filter((key) => !known.includes(key));

/**
 * The section of a config for one API: `apis.<id>` when it has one, else the top level when a single API is
 * mocked. `{ section, warnings }`.
 * @param {object} [config] - The whole file, parsed
 * @param {string} apiId
 * @param {string[]} apiIds - Every API being mocked
 */
export function configFor(config, apiId, apiIds) {
  const warnings = [];
  if (config === undefined || config === null) return { section: undefined, warnings };
  if (!isObject(config)) {
    return { section: undefined, warnings: ["it must hold resources, operations or apis"] };
  }
  const { apis, version, ...top } = config;
  const hasTop = Object.keys(top).length > 0;
  if (apis !== undefined && !isObject(apis))
    warnings.push("apis: must map an API id to its settings");
  const byApi = isObject(apis) ? apis : {};
  if (apiId === apiIds[0]) {
    if (version !== undefined && version !== CONFIG_VERSION) {
      warnings.push(
        `version: ${JSON.stringify(version)} is not a format this mock knows (it reads version ${CONFIG_VERSION}); what it recognises is applied`,
      );
    }
    for (const id of Object.keys(byApi).filter((one) => !apiIds.includes(one))) {
      warnings.push(`apis.${id}: no API with that id is mocked (there are: ${apiIds.join(", ")})`);
    }
    if (hasTop && apiIds.length > 1) {
      warnings.push(
        `${Object.keys(top).join(", ")} at the top level apply when one API is mocked; with several, put them under apis.<api id>`,
      );
    }
  }
  if (byApi[apiId] !== undefined) return { section: byApi[apiId], warnings };
  return { section: hasTop && apiIds.length === 1 ? top : undefined, warnings };
}

/** Whether a schema (by its component name) has a field at a dotted path. */
function hasField(doc, schemaName, path) {
  let schema = { $ref: `#/components/schemas/${schemaName}` };
  for (const part of String(path).split(".")) {
    const property = propertiesOf(doc, schema)[part];
    if (!property) return false;
    schema = property;
  }
  return true;
}

/**
 * Applies one API's settings to its model (classifySpec's result), in place.
 * @param {object} doc - The bundled OpenAPI document
 * @param {object} model - classifySpec(doc)
 * @param {object} [section] - `{ resources?, operations? }`
 * @returns {string[]} What was skipped and why, each starting with the setting's path (`resources.Pod.key: ...`)
 */
export function applyConfig(doc, model, section) {
  const warnings = [];
  if (section === undefined || section === null) return warnings;
  if (!isObject(section)) return ["it must hold resources and operations"];
  for (const key of unknownKeys(section, ["resources", "operations"])) {
    warnings.push(`${key}: not a setting (there are: resources, operations)`);
  }
  const componentSchemas = doc.components?.schemas || {};
  /** Drops what the classifier noted for review about something the user has now stated. */
  const settled = (id) => {
    model.review = model.review.filter((line) => !line.startsWith(`${id}: `));
  };

  const resources = section.resources ?? {};
  if (!isObject(resources)) warnings.push("resources: must map a resource to its settings");
  for (const [name, setting] of Object.entries(isObject(resources) ? resources : {})) {
    const at = `resources.${name}`;
    const existing = model.resources[name];
    const schemaName = model.schemas[name] || (componentSchemas[name] ? name : undefined);
    if (!schemaName) {
      warnings.push(
        `${at}: the spec has no resource or schema named ${name} (resources: ${Object.keys(model.resources).slice(0, 8).join(", ")}${Object.keys(model.resources).length > 8 ? ", ..." : ""})`,
      );
      continue;
    }
    if (!isObject(setting)) {
      warnings.push(`${at}: must hold settings, such as key: id`);
      continue;
    }
    for (const key of unknownKeys(setting, ["key"])) {
      warnings.push(`${at}.${key}: not a setting of a resource (there is: key)`);
    }
    if (setting.key === undefined) continue;
    if (typeof setting.key !== "string" || !setting.key) {
      warnings.push(`${at}.key: must name a field, such as id or metadata.name`);
      continue;
    }
    if (!hasField(doc, schemaName, setting.key)) {
      warnings.push(`${at}.key: ${name} has no field ${setting.key}`);
      continue;
    }
    if (existing) {
      existing.key = setting.key;
      delete existing.review;
      delete existing.why;
      existing.configured = true;
    } else {
      // a schema the classifier did not take for a resource: one now, reached by the operations set below
      model.resources[name] = { path: null, key: setting.key, configured: true };
      model.schemas[name] = schemaName;
    }
    settled(at);
  }

  const operations = section.operations ?? {};
  if (!isObject(operations)) warnings.push("operations: must map an operation to its settings");
  const ids = operationIds(doc);
  const byId = new Map(
    listOperations(doc).map((one) => [ids.get(`${one.method} ${one.path}`), one]),
  );
  for (const [given, setting] of Object.entries(isObject(operations) ? operations : {})) {
    const at = `operations.${given}`;
    // by operationId, or as "DELETE /videos"
    const route = given.match(/^([A-Za-z]+) (\/.*)$/);
    const id = byId.has(given)
      ? given
      : route
        ? ids.get(`${route[1].toLowerCase()} ${route[2]}`)
        : undefined;
    const found = id === undefined ? undefined : byId.get(id);
    if (!found) {
      warnings.push(`${at}: the spec has no operation with that id, or that method and path`);
      continue;
    }
    if (!isObject(setting)) {
      warnings.push(`${at}: must hold settings, such as action: none`);
      continue;
    }
    for (const key of unknownKeys(setting, ["resource", "action", "key"])) {
      warnings.push(
        `${at}.${key}: not a setting of an operation (there are: resource, action, key)`,
      );
    }
    const before = model.operations[id] || { action: "none" };
    const action = setting.action ?? before.action;
    if (!ACTIONS.includes(action)) {
      warnings.push(`${at}.action: must be one of ${ACTIONS.join(", ")}`);
      continue;
    }
    if (action === "none") {
      model.operations[id] = { action: "none", configured: true };
      settled(id);
      continue;
    }
    const resource = setting.resource ?? before.resource;
    if (!resource || !model.resources[resource]) {
      warnings.push(
        resource
          ? `${at}.resource: ${resource} is not a resource (set its key under resources.${resource} to make it one)`
          : `${at}.resource: say which resource the operation works on`,
      );
      continue;
    }
    let keyFrom;
    if (KEYED.has(action)) {
      const parameters = [
        ...(resolve(doc, doc.paths[found.path], "").node?.parameters || []),
        ...(found.operation.parameters || []),
      ]
        .map((one) => resolve(doc, one, "").node)
        .filter(Boolean);
      const lastPathParameter = found.path.match(/\{([^}]+)\}$/)?.[1];
      keyFrom =
        setting.key ??
        before.keyFrom ??
        (lastPathParameter ? `path.${lastPathParameter}` : undefined);
      const source = String(keyFrom || "").match(/^(path|query|body)\.(.+)$/);
      if (!source) {
        warnings.push(
          `${at}.key: say where the record's key comes from: path.<parameter>, query.<parameter> or body.<field>`,
        );
        continue;
      }
      if (
        source[1] !== "body" &&
        !parameters.some((one) => one.in === source[1] && one.name === source[2])
      ) {
        warnings.push(`${at}.key: the operation has no ${source[1]} parameter ${source[2]}`);
        continue;
      }
    } else if (setting.key !== undefined) {
      warnings.push(`${at}.key: a ${action} takes no key; ignored`);
    }
    // what the classifier found about a list stays when it is still one of the same resource
    const sameList = action === "list" && before.action === "list" && before.resource === resource;
    model.operations[id] = {
      resource,
      action,
      ...(keyFrom ? { keyFrom } : {}),
      ...(sameList && before.filter ? { filter: before.filter } : {}),
      ...(sameList && before.listProperty ? { listProperty: before.listProperty } : {}),
      ...(sameList && before.listItem ? { listItem: before.listItem } : {}),
      configured: true,
    };
    settled(id);
  }
  return warnings;
}
