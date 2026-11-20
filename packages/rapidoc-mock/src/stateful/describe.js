/**
 * The stateful mock's model, described for a person: what the Mock UI's detail pages show, and what
 * `GET /__mock/model/<api>/resources/<Resource>` and `.../operations/<id>` return.
 *
 *   describeResource(doc, model, name)   fields with their seed source, relations, the operations on it
 *   describeOperation(doc, model, id)    what the mock does for it, its parameters, request and responses
 *   sampleRecord(doc, model, name, seed) one generated record, stored nowhere
 */
import { pickMediaType, pickResponse } from "../responses.js";
import { listOperations, resolve } from "../spec.js";
import {
  contentSchema,
  name_,
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
  const fields = fieldsOf(doc, model, name);
  const shape = shapeOf(doc, model.schemas[name]);
  // a field of one of several shapes that only some of them have: which ones
  const onlyIn = (field) => {
    if (!shape?.fields) return undefined;
    const where = shape.options.filter((_, i) => shape.fields[i].includes(field));
    return where.length < shape.options.length ? where : undefined;
  };
  return {
    name,
    key: resource.key,
    path: resource.path,
    ...(resource.alsoAt ? { alsoAt: resource.alsoAt } : {}),
    schema: model.schemas[name],
    ...(resource.review ? { review: resource.why } : {}),
    // a schema with no fields of its own: what it is instead (its options' own fields stay here)
    ...(shape ? { shape: { ...shape, fields: undefined } } : {}),
    fields: fields.map((field) => ({
      ...field,
      readOnly: readOnly(field.name),
      key: field.name === resource.key,
      seededAs: sources.get(field.name),
      ...(onlyIn(field.name) ? { onlyIn: onlyIn(field.name) } : {}),
      // a field that copies or points at records of another resource takes their values: what its nested
      // fields hold is that resource's to say, so they keep their shape only
      ...(field.fields && model.relations[`${name}.${field.name}`]
        ? { fields: withoutSeeding(field.fields) }
        : {}),
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

/**
 * What a schema with no fields of its own is instead: `{ kind: "oneOf" | "anyOf", options: [schema names],
 * by?: discriminator property, fields: [the fields of each option] }`, or `{ kind: "none" }`. A record of one of
 * several objects is one of them: the mock seeds each record from one option in turn.
 */
function shapeOf(doc, name) {
  const node = resolve(doc, doc.components?.schemas?.[name], "").node || {};
  if (Object.keys(propertiesOf(doc, { ...node, oneOf: undefined, anyOf: undefined })).length) {
    return undefined;
  }
  for (const kind of ["oneOf", "anyOf"]) {
    if (Array.isArray(node[kind]) && node[kind].length) {
      return {
        kind,
        options: node[kind].map((one, index) =>
          typeof one?.$ref === "string" ? one.$ref.split("/").pop() : `option ${index + 1}`,
        ),
        ...(node.discriminator?.propertyName ? { by: node.discriminator.propertyName } : {}),
        fields: node[kind].map((one) => Object.keys(propertiesOf(doc, one))),
      };
    }
  }
  return { kind: "none" };
}

/** Nested fields without `seededAs`, at every depth. */
const withoutSeeding = (fields) =>
  fields.map(({ seededAs: _seededAs, fields: inner, ...field }) => ({
    ...field,
    ...(inner ? { fields: withoutSeeding(inner) } : {}),
  }));

/** What an operation on one record answers when the record is not there. */
const NOT_STORED = "If no such record is stored, it responds with HTTP status 404 (Not Found).";

/** What the mock does for an operation, in a sentence. Names from the spec are in backticks (`name_`). */
function does(entry, resource, filters, parents) {
  const under = parents.length
    ? ` under the ${parents.map((name) => name_(`{${name}}`)).join(" and ")} of the path`
    : "";
  const key = resource?.key ? name_(resource.key) : "key";
  const named = name_(entry.resource);
  // `path.petId` -> "path parameter `petId`"
  const [, from, at] = entry.keyFrom?.match(/^(path|query|body)\.(.+)$/) || [];
  const param =
    from &&
    `${{ path: "path parameter", query: "query parameter", body: "body field" }[from]} ${name_(at)}`;
  const which = param ? `whose ${key} is in the ${param}` : "it names";
  switch (entry.action) {
    case "list":
      return `Lists the stored ${named} records${under}${
        filters.length ? `, filtered by ${filters.map(name_).join(", ")}` : ""
      }.`;
    case "create":
      return `Stores a new ${named} record${under} and returns it.`;
    case "createMany":
      return `Stores the ${named} records sent and returns them.`;
    case "read":
      return `Returns the ${named} record ${which}. ${NOT_STORED}`;
    case "update":
      return `Replaces the whole ${named} record ${which} with the one you send. ${NOT_STORED}`;
    case "patch":
      return `Updates only the fields you send on the ${named} record ${which}. ${NOT_STORED}`;
    case "delete":
      return `Deletes the ${named} record ${which}. ${NOT_STORED}`;
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
 * Where the mock takes a response's body from, for the content type it answers with by default: `{ body:
 * "example" }` (one example), `{ body: "examples", examples: [names] }` (the first unless `Prefer: example=`
 * names another), `{ body: "generated" }` (from the schema), or nothing when the response has no body.
 */
function bodySource(doc, content) {
  const types = Object.keys(content || {});
  if (!types.length) return {};
  const media = resolve(doc, content[pickMediaType(content)], "").node || {};
  if (media.example !== undefined) return { body: "example" };
  const examples = Object.keys(media.examples || {});
  if (examples.length) return { body: "examples", examples };
  return media.schema ? { body: "generated" } : {};
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
            ? `the ${resource?.key ? name_(resource.key) : "key"} of the record`
            : "a parent of the record";
      } else if (stateful && parameter.in === "query" && filterOf.has(parameter.name)) {
        role = `filters by ${name_(filterOf.get(parameter.name))}`;
      } else if (entry.action === "list" && parameter.in === "query") {
        if (PAGED_BY.has(nameKey(parameter.name))) role = "paging";
        else if (NOT_APPLIED.has(nameKey(parameter.name))) role = "accepted, not applied";
        else if (entry.paramReview?.[parameter.name]) role = "ignored when listing";
      }
      // what the mock assumed about this parameter: the UI marks its row
      const review = parameter.in === "query" ? entry.paramReview?.[parameter.name] : undefined;
      return {
        name: parameter.name,
        in: parameter.in,
        required: Boolean(parameter.required),
        type: [].concat(schema.type || []).join(" | ") || (schema.enum ? "enum" : "any"),
        ...(parameter.description ? { description: parameter.description } : {}),
        ...(role ? { role } : {}),
        ...(review ? { review } : {}),
      };
    });
  // the operation's review note without what its parameters' rows now say: shown at the top, beside the count
  // of parameters to review
  const reviewed = parameters.filter((one) => one.review).length;
  const elsewhere = reviewed
    ? (entry.why || "")
        .split("; ")
        .filter(
          (part) =>
            !/^query parameter .* matches no field of /.test(part) &&
            !/ holds .* objects$/.test(part) &&
            part !== "assumed to match on their name",
        )
        .join("; ")
    : undefined;
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
    ...(reviewed
      ? { review: { parameters: reviewed, ...(elsewhere ? { other: elsewhere } : {}) } }
      : {}),
    parameters,
    ...(body
      ? { request: { required: Boolean(body.required), ...bodyShape(doc, body.content) } }
      : {}),
    // `returned`: the response a request gets unless `Prefer: code=` asks for another
    responses: Object.entries(operation.responses || {}).map(([code, raw], _, all) => {
      const response = resolve(doc, raw, "").node || {};
      return {
        code,
        ...(response.description ? { description: response.description } : {}),
        ...bodyShape(doc, response.content),
        ...bodySource(doc, response.content),
        ...(code === pickResponse(Object.fromEntries(all)).key ? { returned: true } : {}),
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
