/**
 * The request handlers of the stateful mock: what `--stateful` adds to the server.
 *
 *   const stateful = await createStateful(doc, { rows: 10, seed: 1 });
 *   const response = await stateful.handle(request);   // null: not a stored resource, answer as a plain mock
 *
 * The classifier's operation map says what each operation does to which resource (create, read, update, patch,
 * delete, list); the store holds the records, seeded from the spec. An answer keeps the shape the spec gives the
 * response: the plain mock's response is the frame (status, headers, and the fields beside the records in an
 * envelope), and the stored records go where the spec puts them.
 */
import { randomUUID } from "node:crypto";
import { problem } from "../auth.js";
import { generateValid } from "../responses.js";
import { toJsonSchema } from "../schema.js";
import { resolve } from "../spec.js";
import {
  classifySpec,
  contentSchema,
  labelCounts,
  namedSchema,
  operationIds,
  pathShape,
  propertiesOf,
} from "./classify.js";
import { generateSeed } from "./seed.js";
import { createStore } from "./store.js";
import { nameKey, splitWords } from "./words.js";

/** The request header that names a session: its own copy of the data, made when it first writes. */
export const SESSION_HEADER = "x-mock-session";

/**
 * Where a stored record keeps the parents its path names and its own fields don't: a `Key` of
 * `/apps/{app_id}/keys` without an `app_id` field is stored with `{ $parents: { apps: "a1" } }`. Keyed by the
 * segment in front of the parameter, which stays the same when operations name the parameter differently.
 * Never part of a response.
 */
export const PARENTS = "$parents";
/** How many parent records the seeded records of a nested resource are spread over. */
const SEEDED_PARENTS = 3;

/** The parameters of a path, in order: `/apps/{app_id}/keys/{id}` -> `[{ param: "app_id", under: "apps", index: 1 }, ...]`. */
function paramsOf(template) {
  const segments = template.split("/").filter(Boolean);
  return segments.flatMap((segment, index) => {
    if (!/^\{.+\}$/.test(segment)) return [];
    const param = segment.slice(1, -1);
    const before = segments[index - 1];
    return [{ param, index, under: before && !before.startsWith("{") ? before : param }];
  });
}

/** A record as a response shows it: without the parents kept beside its fields. */
const shown = (record) => {
  if (!isObject(record) || !(PARENTS in record)) return record;
  const { [PARENTS]: _, ...rest } = record;
  return rest;
};

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const typesOf = (schema) => (Array.isArray(schema?.type) ? schema.type : [schema?.type]);
/** Whether a field beside the records of a list holds how many there are: `count`, `total`, `articlesCount`,
 * `total_count`, `totalElements`; not `pageCount` or `totalPages`. */
function isTotalField(field) {
  const words = splitWords(field);
  if (words.some((word) => /^pages?$/.test(word))) return false;
  return words[0] === "total" || /^(count|total)$/.test(words.at(-1));
}
/** Fields that hold when a record last changed. */
const CHANGED_FIELD = /^(updated|modified|changed)_?(at|on|date|time)?$/i;
const LIMIT_PARAMS = ["limit", "per_page", "perPage", "page_size", "pageSize", "size"];

/** The values of a path's parameters: `/pets/{petId}` and `/pets/7` give `{ petId: "7" }`. */
export function pathParams(template, path) {
  const names = template.split("/");
  const values = path.split("/");
  const params = {};
  names.forEach((name, i) => {
    if (/^\{.+\}$/.test(name) && values[i] !== undefined) {
      params[name.slice(1, -1)] = decodeURIComponent(values[i]);
    }
  });
  return params;
}

const firstNumber = (query, names) => {
  for (const name of names) {
    const value = Number.parseInt(query.get(name) ?? "", 10);
    if (Number.isFinite(value) && value >= 0) return value;
  }
  return undefined;
};

/**
 * @param {object} doc - A bundled OpenAPI 3.x document (see loadSpec)
 * @param {object} [options]
 * @param {number | Record<string, number>} [options.rows] - Seed records per resource (default 10)
 * @param {number} [options.seed] - Seed of the generated data (default 1)
 */
export async function createStateful(doc, { rows = 10, seed = 1 } = {}) {
  const model = classifySpec(doc);
  const store = createStore(model.resources);
  const { data, report } = await generateSeed(doc, model, { rows, seed });
  const ids = operationIds(doc);

  const schemaRef = (name) => ({ $ref: `#/components/schemas/${model.schemas[name]}` });
  const propertyCache = new Map();
  const properties = (name) => {
    if (!propertyCache.has(name)) propertyCache.set(name, propertiesOf(doc, schemaRef(name)));
    return propertyCache.get(name);
  };
  /** The field of a resource a parameter of its path fills: `{grant_id}` -> `grant_id` (never its own key). */
  const fieldFor = (name, param) => {
    const fields = Object.keys(properties(name)).filter((f) => f !== model.resources[name].key);
    return fields.includes(param) ? param : fields.find((f) => nameKey(f) === nameKey(param));
  };

  // Seeded records of a nested resource go under a few of the seeded parents, so one parent's list is not
  // another's. Deepest parent first: a record takes its parent's own parents with it.
  const byShape = new Map();
  for (const [name, resource] of Object.entries(model.resources)) {
    for (const shape of [resource.path, ...(resource.alsoAt || [])]) {
      if (shape && !byShape.has(shape)) byShape.set(shape, name);
    }
  }
  const pathTemplates = Object.keys(doc.paths || {});
  for (const [name, resource] of Object.entries(model.resources)) {
    const pathTemplate =
      resource.path && pathTemplates.find((t) => pathShape(t).shape === resource.path);
    if (!pathTemplate || !data[name]?.length) continue;
    const segments = resource.path.split("/").filter(Boolean);
    for (const { param, index, under } of paramsOf(pathTemplate).slice(0, -1).reverse()) {
      if (fieldFor(name, param)) continue;
      const parent = byShape.get(`/${segments.slice(0, index + 1).join("/")}`);
      const parentKey = parent && parent !== name ? model.resources[parent].key : undefined;
      const owners = parentKey ? (data[parent] || []).slice(0, SEEDED_PARENTS) : [];
      if (!owners.length) continue;
      data[name].forEach((record, i) => {
        if (record[PARENTS]?.[under] !== undefined) return;
        const owner = owners[i % owners.length];
        record[PARENTS] = { ...owner[PARENTS], ...record[PARENTS], [under]: owner[parentKey] };
      });
    }
  }
  store.load(data);

  /** One generated record per resource: where a new record's required fields come from when the caller sends none. */
  const templates = new Map();
  const template = (name) => {
    if (!templates.has(name)) {
      const pointer = schemaRef(name).$ref;
      templates.set(
        name,
        generateValid(toJsonSchema(doc, schemaRef(name), pointer), seed).catch(() => ({})),
      );
    }
    return templates.get(name);
  };

  /** How an operation's request and success response hold the record: `{ request, response }` of namedSchema. */
  const shapes = new Map();
  const shapeOf = (id, operation) => {
    if (!shapes.has(id)) {
      const body = resolve(doc, operation.requestBody, "").node;
      const code = Object.keys(operation.responses || {})
        .sort()
        .find((key) => key.startsWith("2"));
      const success = resolve(doc, operation.responses?.[code], "").node;
      shapes.set(id, {
        request: namedSchema(doc, contentSchema(doc, body?.content)),
        response: namedSchema(doc, contentSchema(doc, success?.content)),
      });
    }
    return shapes.get(id);
  };

  /**
   * A record as the response's schema describes it: itself when that is the resource's schema, else its fields
   * that the returned schema has too (an API that answers a write with `{ id }` gets the real id).
   */
  const project = (name, record, shape) => {
    if (!shape.name || shape.name === model.schemas[name] || shape.name === name) return record;
    const wanted = Object.keys(propertiesOf(doc, { $ref: `#/components/schemas/${shape.name}` }));
    const picked = Object.fromEntries(
      wanted.filter((field) => field in record).map((field) => [field, record[field]]),
    );
    return Object.keys(picked).length ? picked : undefined;
  };

  /** The response body: the records where the spec puts them, in the frame the plain mock made. */
  const fill = (name, frame, shape, payload, total) => {
    const many = Array.isArray(payload);
    const shaped = many
      ? payload.map((record) => project(name, record, shape))
      : project(name, payload, shape);
    if (shaped === undefined || (many && shaped.includes(undefined))) return undefined;
    const property = shape.envelope || shape.listProperty;
    if (!property) return Boolean(shape.many) === many ? shaped : undefined;
    const body = isObject(frame) ? { ...frame } : {};
    body[property] = shaped;
    if (total !== undefined) {
      for (const field of Object.keys(body)) {
        if (isTotalField(field) && typeof body[field] === "number") body[field] = total;
      }
    }
    return body;
  };

  /**
   * Answers a request from the store.
   *
   * @param {object} request
   * @param {string} request.method - Lower case
   * @param {string} request.template - The path as the spec writes it (`/pets/{petId}`)
   * @param {string} request.path - The path of the request (`/pets/7`)
   * @param {URLSearchParams} request.query
   * @param {unknown} request.body - Parsed
   * @param {object} request.operation - The operation object
   * @param {string} [request.session] - Session id (the X-Mock-Session header)
   * @param {boolean} [request.head]
   * @param {(prefer?: Record<string, string>) => Promise<object>} request.respond - The plain mock's response
   * @returns {Promise<object | null>} The response, or null when the operation holds no state
   */
  async function handle({
    method,
    template: pathTemplate,
    path,
    query,
    body,
    operation,
    session,
    head,
    respond,
  }) {
    const id = ids.get(`${method === "head" ? "get" : method} ${pathTemplate}`);
    const entry = model.operations[id];
    if (!entry || entry.action === "none") return null;
    const name = entry.resource;
    const resource = model.resources[name];
    const keyed = entry.action !== "list" && !entry.action.startsWith("create");
    // Without a key field, one record can't be told from another: only lists and creates hold state
    if (keyed && !resource.key) return null;

    const view = store.session(session || undefined);
    const fields = properties(name);
    const shape = shapeOf(id, operation);
    const params = pathParams(pathTemplate, path);
    const keyParam = entry.keyFrom?.startsWith("path.") ? entry.keyFrom.slice(5) : undefined;
    // The other parameters of the path name the record's parents: `/grants/{grant_id}/messages`
    // by a field of the record when it has one for the parameter, else kept beside its fields (PARENTS)
    const parents = {};
    const kept = {};
    for (const { param, under } of paramsOf(pathTemplate)) {
      if (param === keyParam) continue;
      const field = fieldFor(name, param);
      if (field) parents[field] = params[param];
      else kept[under] = params[param];
    }
    const hasKept = Object.keys(kept).length > 0;
    // A record with no parent on record (seeded where the parent is no resource) is found under any
    const inParents = (record) =>
      Object.entries(parents).every(([field, value]) => String(record[field]) === String(value)) &&
      Object.entries(kept).every(
        ([under, value]) =>
          record[PARENTS]?.[under] === undefined ||
          String(record[PARENTS][under]) === String(value),
      );
    const input =
      shape.request.envelope && isObject(body) && !shape.request.many
        ? body[shape.request.envelope]
        : shape.request.listProperty && isObject(body)
          ? body[shape.request.listProperty]
          : body;

    const finish = async (payload, total) => {
      const frame = await respond();
      let parsed;
      try {
        parsed = frame.body ? JSON.parse(frame.body) : undefined;
      } catch {
        return { ...frame, body: head ? null : frame.body, source: "state" };
      }
      const filled =
        frame.body && payload !== undefined
          ? fill(
              name,
              parsed,
              shape.response,
              Array.isArray(payload) ? payload.map(shown) : shown(payload),
              total,
            )
          : undefined;
      return {
        ...frame,
        body: head ? null : filled === undefined ? frame.body : JSON.stringify(filled, null, 2),
        source: "state",
      };
    };
    const notFound = async (key) => {
      if (operation.responses?.["404"]) {
        const response = await respond({ code: "404" });
        delete response.headers["Preference-Applied"];
        return { ...response, source: "state" };
      }
      return {
        ...problem(404, "Not Found", `No ${name} with ${resource.key} ${key}.`),
        source: "state",
      };
    };
    const now = () => new Date().toISOString();
    const touch = (record) => {
      for (const [field, schema] of Object.entries(fields)) {
        if (CHANGED_FIELD.test(field) && schema?.format === "date-time") record[field] = now();
      }
      return record;
    };
    /** The fields of the request, with the types the record's schema gives them (query values are text). */
    const fromQuery = () => {
      const changes = {};
      for (const [field, schema] of Object.entries(fields)) {
        if (!query.has(field) || field === resource.key) continue;
        const text = query.get(field);
        const types = typesOf(schema);
        changes[field] =
          types.includes("integer") || types.includes("number")
            ? Number(text)
            : types.includes("boolean")
              ? text === "true"
              : text;
      }
      return changes;
    };

    if (entry.action === "list") {
      const where = { ...parents };
      for (const [fieldPath, from] of Object.entries(entry.filter || {})) {
        const values = query.getAll(from.replace(/^query\./, ""));
        if (values.length) where[fieldPath] = values;
      }
      const limit = firstNumber(query, LIMIT_PARAMS);
      const page = firstNumber(query, ["page"]);
      const offset =
        firstNumber(query, ["offset", "skip"]) ??
        (page !== undefined && limit !== undefined ? Math.max(0, page - 1) * limit : 0);
      const { total, records } = view.list(name, {
        where,
        ...(hasKept ? { test: inParents } : {}),
        offset,
        limit,
      });
      return finish(records, total);
    }

    if (entry.action === "create" || entry.action === "createMany") {
      const inputs = entry.action === "createMany" ? input : [input];
      if (!Array.isArray(inputs) || !inputs.every(isObject)) return null;
      const base = await template(name);
      const required = new Set(resolve(doc, schemaRef(name), "").node?.required || []);
      const created = [];
      for (const one of inputs) {
        const record = {};
        // What the server would set: the fields a caller can't send, and the required ones it left out
        for (const [field, schema] of Object.entries(fields)) {
          if (field in one || field === resource.key) continue;
          if (!schema?.readOnly && !required.has(field)) continue;
          const types = typesOf(schema);
          if (schema?.default !== undefined) record[field] = structuredClone(schema.default);
          else if (schema?.format === "date-time") record[field] = now();
          // A new record starts empty: no children (an owner's `pets`), counts at their lowest, flags off
          else if (types.includes("array")) record[field] = [];
          else if (types.includes("integer") || types.includes("number"))
            record[field] = schema.minimum ?? 0;
          else if (types.includes("boolean")) record[field] = false;
          else if (isObject(base) && field in base) record[field] = structuredClone(base[field]);
        }
        Object.assign(record, one, parents);
        delete record[PARENTS];
        if (hasKept) record[PARENTS] = kept;
        const key = resource.key;
        if (key && (record[key] === undefined || record[key] === null)) {
          delete record[key];
          if (fields[key]?.format === "uuid") record[key] = randomUUID();
        }
        const stored = view.insert(name, record);
        if (!stored) {
          return {
            ...problem(409, "Conflict", `A ${name} with ${key} ${record[key]} already exists.`),
            source: "state",
          };
        }
        created.push(stored);
      }
      const payload =
        entry.action === "createMany" && shape.response.many ? created : created.at(-1);
      return finish(payload);
    }

    const key = keyParam ? params[keyParam] : isObject(input) ? input[resource.key] : undefined;
    if (key === undefined) return null;
    const existing = view.get(name, key);
    if (!existing || !inParents(existing)) return notFound(key);

    if (entry.action === "read") return finish(existing);

    if (entry.action === "delete") {
      view.remove(name, key);
      return finish(existing);
    }

    if (entry.action === "update" || entry.action === "patch") {
      const merge = entry.action === "patch";
      const changes = isObject(input) ? input : fromQuery();
      // A replaced record keeps what the caller can't send
      const unchanged = merge
        ? {}
        : Object.fromEntries(
            Object.entries(existing).filter(
              ([field]) => fields[field]?.readOnly || field === PARENTS,
            ),
          );
      const { [PARENTS]: _, ...sent } = changes;
      const updated = view.update(name, key, touch({ ...unchanged, ...sent, ...parents }), {
        merge,
      });
      return finish(updated);
    }

    return null;
  }

  return { model, store, report, labels: labelCounts(model), handle };
}
