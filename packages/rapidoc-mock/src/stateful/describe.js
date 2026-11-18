/**
 * The stateful mock's model, described for a person: what the Mock UI's detail pages show, and what
 * `GET /__mock/model/<api>/resources/<Resource>` and `.../operations/<id>` return.
 *
 *   describeResource(doc, model, name)   fields with their seed source, relations, the operations on it
 *   describeOperation(doc, model, id)    what the mock does for it, its parameters, request and responses
 *   sampleRecord(doc, model, name, seed) one generated record, stored nowhere
 */
import { listOperations, resolve } from "../spec.js";
import {
  contentSchema,
  namedSchema,
  operationIds,
  operationLabel,
  propertiesOf,
} from "./classify.js";
import { fieldSources, fieldsOf, generateSeed } from "./seed.js";
import { nameKey } from "./words.js";

/** Query parameters a list pages by (handlers.js), and those that sort or page in ways the mock does not apply. */
const PAGED_BY = new Set("limit perpage pagesize size offset skip page".split(" "));
const NOT_APPLIED = new Set(
  "sort sortby sortorder order orderby orderdirection cursor pagetoken prevpagetoken nextpagetoken select fields".split(
    " ",
  ),
);

/** Every operation of the document with its id and the classifier's entry. */
function operationsOf(doc, model) {
  const ids = operationIds(doc);
  return listOperations(doc).map((one) => {
    const id = ids.get(`${one.method} ${one.path}`);
    return { ...one, id, entry: model.operations[id] || { action: "none" } };
  });
}

/** An operation as a list shows it. */
export function operationSummary(model, { id, method, path, operation, entry }) {
  return {
    id,
    method: method.toUpperCase(),
    path,
    ...(operation.summary ? { summary: operation.summary } : {}),
    action: entry.action,
    ...(entry.resource ? { resource: entry.resource } : {}),
    label: operationLabel(model, entry),
    ...(entry.why ? { why: entry.why } : {}),
  };
}

/**
 * A resource in full, or undefined when the model has none of that name.
 * @param {object} doc - The bundled OpenAPI document
 * @param {object} model - classifySpec(doc)
 * @param {string} name
 */
export function describeResource(doc, model, name) {
  const resource = model.resources[name];
  if (!resource) return undefined;
  const sources = new Map(fieldSources(doc, model, name).map((one) => [one.field, one.source]));
  const target = (value) => (typeof value === "string" ? value : value?.to) || null;
  const relations = Object.entries(model.relations);
  // `readOnly` as the spec writes it: the schema made for generating data (fieldsOf) leaves the keyword out
  const written = propertiesOf(doc, { $ref: `#/components/schemas/${model.schemas[name]}` });
  const readOnly = (field) => Boolean(resolve(doc, written[field], "").node?.readOnly);
  return {
    name,
    key: resource.key,
    path: resource.path,
    ...(resource.alsoAt ? { alsoAt: resource.alsoAt } : {}),
    schema: model.schemas[name],
    ...(resource.review ? { review: resource.why } : {}),
    fields: fieldsOf(doc, model, name).map((field) => ({
      ...field,
      readOnly: readOnly(field.name),
      key: field.name === resource.key,
      seededAs: sources.get(field.name),
    })),
    // Fields of this resource that point at another, and fields of others that point here
    relations: relations
      .filter(([id]) => id.startsWith(`${name}.`))
      .map(([id, value]) => ({
        field: id.slice(name.length + 1),
        to: target(value),
        ...(value?.why ? { why: value.why } : {}),
      })),
    referencedBy: relations
      .filter(([id, value]) => {
        const to = target(value);
        return !id.startsWith(`${name}.`) && (to === name || to?.startsWith(`${name}.`));
      })
      .map(([id]) => id),
    operations: operationsOf(doc, model)
      .filter((one) => one.entry.resource === name)
      .map((one) => operationSummary(model, one)),
  };
}

/** What the mock does for an operation, in a sentence. */
function does(entry, resource, filters, parents) {
  const under = parents.length
    ? ` under the ${parents.map((name) => `{${name}}`).join(" and ")} of the path`
    : "";
  const key = resource?.key || "key";
  const param = entry.keyFrom
    ?.replace(/^path\./, "path parameter ")
    .replace(/^body\./, "body field ");
  const which = param ? `whose ${key} is the ${param}` : "";
  switch (entry.action) {
    case "list":
      return `Lists the stored ${entry.resource} records${under}${
        filters.length ? `, filtered by ${filters.join(", ")}` : ""
      }.`;
    case "create":
      return `Stores a new ${entry.resource} record${under} and returns it.`;
    case "createMany":
      return `Stores the ${entry.resource} records sent and returns them.`;
    case "read":
      return `Returns the ${entry.resource} record ${which}, or 404.`;
    case "update":
      return `Replaces the ${entry.resource} record ${which}, or 404.`;
    case "patch":
      return `Changes the fields sent on the ${entry.resource} record ${which}, or 404.`;
    case "delete":
      return `Removes the ${entry.resource} record ${which}, or 404.`;
    default:
      return "Keeps no state: answers with the spec's example, or data generated from the response schema.";
  }
}

/** How a request or response body holds its data: the schema's name, one record or a list, and where. */
function bodyShape(doc, content) {
  const types = Object.keys(content || {});
  if (!types.length) return undefined;
  const shape = namedSchema(doc, contentSchema(doc, content));
  return {
    contentTypes: types,
    ...(shape.name ? { schema: shape.name } : {}),
    ...(shape.wrapper ? { wrapper: shape.wrapper } : {}),
    many: Boolean(shape.many),
    ...(shape.envelope || shape.listProperty
      ? { inside: shape.envelope || shape.listProperty }
      : {}),
  };
}

/**
 * An operation in full, or undefined when the document has none with that id.
 * @param {object} doc - The bundled OpenAPI document
 * @param {object} model - classifySpec(doc)
 * @param {string} id - As the operation map names it (operationIds)
 */
export function describeOperation(doc, model, id) {
  const found = operationsOf(doc, model).find((one) => one.id === id);
  if (!found) return undefined;
  const { path, operation, entry } = found;
  const resource = model.resources[entry.resource];
  const stateful = entry.action !== "none";
  const keyParam = entry.keyFrom?.startsWith("path.") ? entry.keyFrom.slice(5) : undefined;
  const filterOf = new Map(
    Object.entries(entry.filter || {}).map(([field, from]) => [
      from.replace(/^query\./, ""),
      field,
    ]),
  );
  const pathItem = resolve(doc, doc.paths[path], "").node;
  const parameters = [...(pathItem?.parameters || []), ...(operation.parameters || [])]
    .map((one) => resolve(doc, one, "").node)
    .filter(Boolean)
    .map((parameter) => {
      const schema = resolve(doc, parameter.schema, "").node || {};
      let role;
      if (stateful && parameter.in === "path") {
        role =
          parameter.name === keyParam
            ? `the ${resource?.key || "key"} of the record`
            : "a parent of the record";
      } else if (stateful && parameter.in === "query" && filterOf.has(parameter.name)) {
        role = `filters by ${filterOf.get(parameter.name)}`;
      } else if (entry.action === "list" && parameter.in === "query") {
        if (PAGED_BY.has(nameKey(parameter.name))) role = "paging";
        else if (NOT_APPLIED.has(nameKey(parameter.name))) role = "accepted, not applied";
      }
      return {
        name: parameter.name,
        in: parameter.in,
        required: Boolean(parameter.required),
        type: [].concat(schema.type || []).join(" | ") || (schema.enum ? "enum" : "any"),
        ...(parameter.description ? { description: parameter.description } : {}),
        ...(role ? { role } : {}),
      };
    });
  const body = resolve(doc, operation.requestBody, "").node;
  return {
    ...operationSummary(model, found),
    ...(operation.description ? { description: operation.description } : {}),
    does: does(
      entry,
      resource,
      [...filterOf.keys()],
      stateful
        ? parameters
            .filter((one) => one.in === "path" && one.name !== keyParam)
            .map((one) => one.name)
        : [],
    ),
    ...(entry.keyFrom ? { keyFrom: entry.keyFrom } : {}),
    parameters,
    ...(body
      ? { request: { required: Boolean(body.required), ...bodyShape(doc, body.content) } }
      : {}),
    responses: Object.entries(operation.responses || {}).map(([code, raw]) => {
      const response = resolve(doc, raw, "").node || {};
      return {
        code,
        ...(response.description ? { description: response.description } : {}),
        ...bodyShape(doc, response.content),
      };
    }),
  };
}

/**
 * One generated record of a resource, as a seeded one after the first would be (the first shows the spec's
 * examples). Stored nowhere. Its references point at records generated with it, not at stored ones.
 * @param {object} doc
 * @param {object} model
 * @param {string} name
 * @param {number} seed
 */
export async function sampleRecord(doc, model, name, seed) {
  const { data } = await generateSeed(doc, model, { rows: 2, seed });
  return data[name]?.[1] ?? data[name]?.[0];
}
