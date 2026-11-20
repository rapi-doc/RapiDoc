/**
 * The classifier of the stateful mock (a spike): compiles a bundled OpenAPI document into a data model and an
 * operation map, the content of `mock.lock.yaml`.
 *
 *   classifySpec(doc) -> { resources, relations, embedded, operations, review }
 *
 * It reads the document before dereferencing: `$ref` names are its strongest signal (two operations that use
 * `#/components/schemas/Pet` share an entity). Nothing here guesses silently: what the rules cannot settle is
 * marked `review: true` with a `why`, and listed in `review`.
 */
import { listOperations, resolve } from "../spec.js";
import { nameKey, singular, splitWords, trimWords } from "./words.js";

const SCHEMA_REF = /^#\/components\/schemas\/([^/]+)$/;
/**
 * Words code-first frameworks add to an entity's name for its request and response variants, in any naming
 * style: `CreatePetDto`, `PetUpdate`, `PatchedPet`, `key_patch`, `PetOut-Output` (Pydantic v2).
 */
const VARIANT_PREFIXES = new Set(["create", "update", "patched", "patch", "new", "partial"]);
const VARIANT_SUFFIXES = new Set(
  "dto request response input output create update read write in out body payload summary detail fields patch post put".split(
    " ",
  ),
);
/** The variant that describes a stored record best: what the API returns. */
const READ_WORDS = new Set(["response", "out", "output", "read", "detail"]);
const isReadVariant = (name) =>
  splitWords(name)
    .slice(-2)
    .some((word) => READ_WORDS.has(word));
/** Words in front of a reference that point back at the record's own kind: `parentId` on a `Category`. */
const SELF_WORDS = new Set(["parent", "child", "root", "previous", "next", "original", "source"]);
/** The property of a list wrapper that holds the records (Django REST, Spring, and common custom shapes). */
const LIST_PROPS = ["results", "content", "items", "data", "records", "entries"];
/** The property of an envelope around a single record. */
const ENVELOPE_PROPS = ["data", "result", "item", "payload"];
/** Fields that sit beside the records in an envelope: counts, paging and request details. */
const ENVELOPE_META =
  /count|total|page|cursor|next|prev|offset|limit|size|more|request_?id|status|meta|links?$/i;
/** Query parameters of a list that page, sort or shape the answer: they pick no records by a field. */
const NOT_A_FILTER = new Set(
  "page limit offset size pagesize perpage sort sortby sortorder order orderby orderdirection cursor pagetoken prevpagetoken nextpagetoken select fields".split(
    " ",
  ),
);
const JSON_TYPE = /json/i;

const lower = (text) => String(text || "").toLowerCase();
/** `/pet/{petId}/uploadImage` -> segments, and the shape `/pet/{}/uploadImage` (parameter names dropped). */
export function pathShape(path) {
  const segments = path.split("/").filter(Boolean);
  const params = segments.map((s) => (/^\{.+\}$/.test(s) ? s.slice(1, -1) : null));
  return {
    segments,
    params,
    shape: `/${segments.map((s, i) => (params[i] ? "{}" : s)).join("/")}`,
  };
}
/** The shape one segment up: `/apps/{}/keys/{}` -> `/apps/{}/keys`. */
const parentOf = (shape) => shape.slice(0, shape.lastIndexOf("/")) || "/";

/** The schema of the first JSON media type (else the first media type) of a `content` map. */
export function contentSchema(doc, content) {
  const types = Object.keys(content || {});
  const type = types.find((t) => JSON_TYPE.test(t)) || types[0];
  // A media type can itself be a `$ref` (OpenAPI 3.2 `components.mediaTypes`)
  return type ? resolve(doc, content[type], "").node?.schema : undefined;
}

/** Whether a schema describes a record (an object), not a value such as an enum, a string or a number. */
function isRecordSchema(node) {
  if (!node || node.enum) return false;
  const types = Array.isArray(node.type) ? node.type : [node.type];
  return Boolean(
    node.properties || node.allOf || node.oneOf || node.anyOf || types.includes("object"),
  );
}

/** The last word of a field that tells one record from another: `id`, `messageId`, `api_key`, `slug`. */
const KEY_WORDS = new Set(["id", "key", "uuid", "slug"]);

/**
 * Whether an object has a key of its own, by its fields' names: `id` (or `key`, `uuid`, `slug`), or one named
 * after the object, as `messageId` on `Message` and `api_key_id` on `CreateApiKeyResponse`. Not an id about
 * something else: the `request_id` of a response wrapper, the `threadId` of a message.
 * @param {object} properties
 * @param {string} [owner] - The schema's component name
 */
function hasOwnKey(properties, owner) {
  const ownerWords = owner
    ? splitWords(trimWords(owner, VARIANT_PREFIXES, VARIANT_SUFFIXES)).map(singular)
    : [];
  return Object.keys(properties).some((field) => {
    const words = splitWords(field);
    if (!KEY_WORDS.has(words.at(-1))) return false;
    const before = words.slice(0, -1).map(singular);
    if (!before.length) return true;
    // `messageId` on `GmailMessage` too: the words in front are the end of the schema's name
    return (
      before.length <= ownerWords.length &&
      before.every((word, i) => word === ownerWords[ownerWords.length - before.length + i])
    );
  });
}

/**
 * Per document: the schemas an item path returns and addresses by one of their fields (`/messages/{messageId}`
 * returning an object with `messageId`). Those are records, whatever else they hold; `classifySpec` fills it
 * before anything reads a schema, so every reader of the document agrees.
 */
const addressed = new WeakMap();

/**
 * What a schema is, by name: `{ name }` for a `$ref` to a component schema, `{ name, many: true }` for an array of
 * one, `{ name, many: true, wrapper }` for a list wrapper around one. `{}` for an inline or unnamed schema.
 * @param {object} doc
 * @param {object} schema
 * @param {number} [depth]
 * @param {string} [owner] - The component name of `schema`, when it was reached through a `$ref`
 */
export function namedSchema(doc, schema, depth = 0, owner = undefined) {
  if (!schema || typeof schema !== "object" || depth > 4) return {};
  if (typeof schema.$ref === "string") {
    const name = schema.$ref.match(SCHEMA_REF)?.[1];
    if (!name) return {};
    const { node } = resolve(doc, schema, schema.$ref);
    // A schema its own path addresses by a field is a record, not a wrapper around what it holds
    if (addressed.get(doc)?.has(name)) return { name: decodeURIComponent(name) };
    // A named schema that is only a list (`Pets: array of Pet`) or a list wrapper (`PaginatedPetList`)
    const inner = node?.$ref ? {} : namedSchema(doc, { ...node, $ref: undefined }, depth + 1, name);
    if (inner.name && (inner.many || inner.envelope)) {
      return { ...inner, wrapper: inner.wrapper || name };
    }
    // Only an object can be a record: an enum (`RoleType`) or a binary string (`FileContent`) is a value
    return isRecordSchema(node) ? { name: decodeURIComponent(name) } : {};
  }
  if (schema.allOf?.length === 1 && !schema.properties) {
    return namedSchema(doc, schema.allOf[0], depth + 1);
  }
  if (schema.type === "array" || schema.items) {
    const item = namedSchema(doc, schema.items, depth + 1);
    if (item.name) return { ...item, many: true };
    // A list of objects written inline: no name, but still a list of records (RealWorld's article list)
    const inline = resolve(doc, schema.items, "").node;
    return inline?.properties || inline?.type === "object" ? { many: true, inline: true } : {};
  }
  // An inline object, through `allOf` (Nylas: `allOf: [common_response, { properties: { data } }]`)
  const properties = { ...schema.properties };
  for (const part of schema.allOf || []) {
    const { node } = resolve(doc, part, "");
    Object.assign(properties, node?.properties);
  }
  const keys = Object.keys(properties);
  if (keys.length) {
    const prop = LIST_PROPS.find((p) => properties[p]);
    const item = prop ? namedSchema(doc, properties[prop], depth + 1) : {};
    if (item.name && item.many) return { ...item, listProperty: prop };
    // An envelope around one record or list: `{ data: Pet }`, `{ article: Article }`,
    // `{ articles: [Article], articlesCount }`. Not an entity of its own: it has no id and little else.
    const named = keys
      .map((key) => ({ key, ...namedSchema(doc, properties[key], depth + 1) }))
      .filter((entry) => entry.name || entry.inline);
    // `data` and the like wrap whatever they hold, among any other fields (Apideck: `status`, `service`, ...).
    // A property named for its content wraps it too (`article` around an `Article`), but only when the fields
    // beside it are paging or status details: `{ content, references: [ArtifactReference] }` is a record of
    // its own, and so is `RoleMapping` with its `role`.
    const only = named.length === 1 ? named[0] : undefined;
    const namedForContent =
      only &&
      ((only.name && lower(only.name).includes(lower(singular(only.key)))) ||
        (only.inline && only.many));
    // Never an object with a key of its own: that is a record which holds another (Gmail's `Message`, with
    // an `id` and a `payload: MessagePart`), not a wrapper around one.
    const isEnvelope =
      only &&
      !hasOwnKey(properties, owner) &&
      (ENVELOPE_PROPS.includes(only.key) ||
        (namedForContent && keys.every((k) => k === only.key || ENVELOPE_META.test(k))));
    if (isEnvelope) {
      const { key, ...inner } = named[0];
      return { ...inner, envelope: key, ...(inner.many ? { listProperty: key } : {}) };
    }
  }
  return {};
}

/**
 * The properties of a schema (through `$ref` and `allOf`) that are arrays of a named schema:
 * `[{ property, schema }]`. `{ droplets: [droplet], links, meta }` -> `[{ property: "droplets", schema: "droplet" }]`.
 */
function listPropertiesOf(doc, schema, depth = 0) {
  const node = resolve(doc, schema, "").node;
  if (!node || typeof node !== "object" || depth > 4) return [];
  const found = [];
  for (const [property, value] of Object.entries(node.properties || {})) {
    const list = resolve(doc, value, "").node;
    if (!list || (list.type !== "array" && !list.items)) continue;
    const item = namedSchema(doc, list.items);
    if (item.name && !item.many) found.push({ property, schema: item.name });
  }
  for (const part of node.allOf || []) found.push(...listPropertiesOf(doc, part, depth + 1));
  return found;
}

/** Maps every component schema name to its entity: `CreatePetDto`, `PetUpdate`, `PatchedPet` -> `Pet`. */
function entityNames(doc) {
  const names = Object.keys(doc.components?.schemas || {});
  const base = (name) => trimWords(name, VARIANT_PREFIXES, VARIANT_SUFFIXES);
  const byBase = new Map();
  for (const name of names) byBase.set(base(name), [...(byBase.get(base(name)) || []), name]);
  const entityOf = new Map();
  for (const name of names) {
    const short = base(name);
    // Reduced only when the short name is itself a schema, or several variants agree on it
    const merged = short !== name && (names.includes(short) || byBase.get(short).length > 1);
    entityOf.set(name, merged ? short : name);
  }
  // The schema that stands for each entity: its own, else the variant the API returns
  const schemaOf = new Map();
  for (const [short, variants] of byBase) {
    schemaOf.set(
      short,
      names.includes(short) ? short : variants.find(isReadVariant) || variants[0],
    );
  }
  return { entityOf, schemaOf };
}

/** The parameters of an operation (its own and its path item's), `$ref`s followed. */
function parametersOf(doc, pathItem, operation) {
  return [...(pathItem?.parameters || []), ...(operation.parameters || [])]
    .map((p) => resolve(doc, p, "").node)
    .filter(Boolean);
}

/** The properties of an entity's schema, through `allOf`. */
export function propertiesOf(doc, schema, depth = 0) {
  const { node } = resolve(doc, schema, "");
  if (!node || depth > 6) return {};
  let properties = { ...node.properties };
  for (const part of node.allOf || []) {
    properties = { ...propertiesOf(doc, part, depth + 1), ...properties };
  }
  // One of several objects with no fields of its own (Nylas' `RedirectURIObject`: a web, JS, iOS or Android
  // callback): a record of it has the fields of its shapes, so those are its fields (the first shape's wins)
  if (!Object.keys(properties).length) {
    for (const part of node.oneOf || node.anyOf || []) {
      properties = { ...propertiesOf(doc, part, depth + 1), ...properties };
    }
  }
  return properties;
}

/** The field of an entity a path parameter addresses: `username` -> `username`, `petId` -> `id`. */
function keyField(properties, param, entity) {
  const names = Object.keys(properties);
  if (names.includes(param)) return { field: param };
  const byKey = (words) => words.length && names.find((n) => nameKey(n) === nameKey(words));
  const words = splitWords(param);
  const entityWords = splitWords(entity);
  // `{petId}` on `Pet` -> `id`: the parameter without the entity's own words in front
  const startsWithEntity = entityWords.every(
    (word, i) => singular(words[i] ?? "") === singular(word),
  );
  const own = startsWithEntity && byKey(words.slice(entityWords.length));
  if (own) return { field: own };
  const exact = byKey(words);
  if (exact) return { field: exact };
  // `/customers/{customer}`: the parameter is named after the entity itself (Stripe)
  const namesEntity = nameKey(words) === nameKey(entityWords);
  if (names.includes("id") && (words.at(-1) === "id" || namesEntity)) return { field: "id" };
  // `{propertyName}` -> `name`: the parameter's last word is the field
  const byWord = byKey(words.slice(-1));
  if (byWord) return { field: byWord };
  if (names.includes("id")) return { field: "id", review: `parameter {${param}} matches no field` };
  return { field: null, review: `no key field found for {${param}}` };
}

/**
 * The id of every operation in the operation map, by `"<method> <path>"` (method in lower case): its
 * `operationId`, else `"<METHOD> <path>"`. An operationId used twice (Cal.com has two) would overwrite the first
 * operation's entry, so the second gets the method and path as well.
 * @param {object} doc
 * @returns {Map<string, string>}
 */
export function operationIds(doc) {
  const seen = new Set();
  const ids = new Map();
  for (const { method, path, operation } of listOperations(doc)) {
    const id =
      operation.operationId && !seen.has(operation.operationId)
        ? operation.operationId
        : `${method.toUpperCase()} ${path}`;
    seen.add(id);
    ids.set(`${method} ${path}`, id);
  }
  return ids;
}

/**
 * @param {object} doc - A bundled OpenAPI 3.x document (internal `$ref`s kept; see loadSpec)
 * @returns {{ resources: object, relations: object, embedded: object, operations: object, review: string[], schemas: Record<string, string> }}
 */
export function classifySpec(doc) {
  const { entityOf, schemaOf } = entityNames(doc);
  const componentSchemas = doc.components?.schemas || {};
  // By entity name: `schemas.ApiKey` is `ApiKeyResponseDto` when no schema is named `ApiKey`
  const schemas = new Proxy(
    {},
    { get: (_, name) => componentSchemas[schemaOf.get(name)] || componentSchemas[name] },
  );
  const entity = (name) => (name ? entityOf.get(name) || name : undefined);
  const review = [];
  const flag = (id, why) => {
    review.push(`${id}: ${why}`);
    return { review: true, why };
  };

  // Before anything reads a schema: the ones an item path returns and addresses by one of their fields are
  // records (`/tags/{slug}` returning an object with `slug`), also where the field is no id and the object
  // holds another under `data` or `payload`
  const records = new Set();
  addressed.set(doc, records);
  for (const { path, operation } of listOperations(doc)) {
    const parameter = path.match(/\{([^}]+)\}$/)?.[1];
    if (!parameter) continue;
    for (const [code, response] of Object.entries(operation.responses || {})) {
      if (!code.startsWith("2")) continue;
      const returned = contentSchema(doc, resolve(doc, response, "").node?.content);
      const name = returned?.$ref?.match(SCHEMA_REF)?.[1];
      if (!name) continue;
      const key = keyField(propertiesOf(doc, returned), parameter, decodeURIComponent(name));
      if (key.field && !key.review) records.add(name);
    }
  }

  // Pass 1: what each operation carries, by name
  const ids = operationIds(doc);
  const facts = listOperations(doc).map(({ method, path, operation }) => {
    const pathItem = resolve(doc, doc.paths[path], "").node;
    const body = resolve(doc, operation.requestBody, "").node;
    const requestSchema = contentSchema(doc, body?.content);
    const request = namedSchema(doc, requestSchema);
    const successCode = Object.keys(operation.responses || {})
      .sort()
      .find((code) => code.startsWith("2"));
    const success = resolve(doc, operation.responses?.[successCode], "").node;
    const responseSchema = contentSchema(doc, success?.content);
    const response = namedSchema(doc, responseSchema);
    const sent = resolve(doc, requestSchema, "").node;
    return {
      responseSchema,
      // a body that holds one object: what a create sends, whatever its schema is called
      sendsObject:
        Boolean(sent) && (isRecordSchema(sent) || Boolean(request.name)) && !request.many,
      id: ids.get(`${method} ${path}`),
      method,
      path,
      ...pathShape(path),
      parameters: parametersOf(doc, pathItem, operation),
      request: { ...request, entity: entity(request.name) },
      response: { ...response, entity: entity(response.name) },
    };
  });

  // A static segment after a parameter is a nested collection (`/apps/{}/keys`) when the spec has its item path
  // (`/apps/{}/keys/{}`) or it lists records; otherwise it is an action on the record (`/pet/{}/uploadImage`).
  const shapes = new Set(facts.map((op) => op.shape));
  const isSubAction = (op) =>
    !op.params.at(-1) &&
    op.params.some(Boolean) &&
    !shapes.has(`${op.shape}/{}`) &&
    !((op.method === "get" || op.method === "query") && op.response.many);

  // Pass 2: the entity of each path shape, from the operations there that name one. An item path (`/pet/{}`)
  // and its collection path (`/pet`) share it. Votes are weighted by how well an operation names the record:
  // what a GET returns says most, what a write sends says more than what it answers, and a DELETE's answer
  // says nothing (an API may answer every write with one small `{ id }` schema, as Apideck does).
  const shapeEntity = new Map();
  const vote = (shape, name, weight) => {
    if (!name || !weight) return;
    const votes = shapeEntity.get(shape) || new Map();
    votes.set(name, (votes.get(name) || 0) + weight);
    shapeEntity.set(shape, votes);
  };
  for (const op of facts) {
    const lastIsParam = Boolean(op.params.at(-1));
    // Only a collection path or an item path names its resource: `/pet/{}/uploadImage` returns something else
    if (isSubAction(op)) continue;
    const isWrite = op.method === "post" || op.method === "put" || op.method === "patch";
    const shapes = lastIsParam
      ? [op.shape, parentOf(op.shape)]
      : isWrite || op.response.many
        ? [op.shape] // `/pet/findByStatus` lists the resource of `/pet`; `/pets` lists its own
        : [];
    for (const shape of shapes) {
      if (op.method === "get" || op.method === "query") vote(shape, op.response.entity, 4);
      else if (isWrite) {
        vote(shape, op.request.entity, 2);
        vote(shape, op.response.entity, 1);
      }
    }
  }
  const winner = (shape) => {
    const votes = shapeEntity.get(shape);
    if (votes) return [...votes].sort((a, b) => b[1] - a[1])[0][0];
    // An item path nothing names (only a DELETE there) holds what its collection holds
    return shape.endsWith("/{}") ? winner(parentOf(shape)) : undefined;
  };

  // Pass 3: resources, with their paths and keys
  const resources = {};
  for (const op of facts) {
    if (!op.params.at(-1)) continue;
    const name = winner(op.shape);
    if (!name || !schemas[name]) continue;
    const param = op.params.at(-1);
    const key = keyField(propertiesOf(doc, schemas[name]), param, name);
    const existing = resources[name];
    if (existing && existing.path !== op.shape) {
      existing.alsoAt = [...new Set([...(existing.alsoAt || []), op.shape])];
      continue;
    }
    // A path that takes a number for a key the schema types as text (Jira: `{id}` is an integer, `id` a string):
    // keys are then written as numbers in text, so a request for one passes the path's own validation
    const keyParameter = op.parameters.find((one) => one.in === "path" && one.name === param);
    const parameterTypes = [].concat(resolve(doc, keyParameter?.schema, "").node?.type || []);
    const fieldTypes = [].concat(
      resolve(doc, propertiesOf(doc, schemas[name])[key.field], "").node?.type || [],
    );
    const numbered =
      key.field &&
      parameterTypes.some((type) => type === "integer" || type === "number") &&
      fieldTypes.includes("string");
    resources[name] = {
      path: op.shape,
      key: key.field,
      ...(numbered ? { keyAs: "number" } : {}),
      ...(key.review ? flag(`resources.${name}`, key.review) : {}),
    };
  }
  // A resource that is only created or listed (no item path)
  for (const op of facts) {
    const name = winner(op.shape);
    if (name && schemas[name] && !resources[name] && !op.params.some(Boolean)) {
      const hasId = "id" in propertiesOf(doc, schemas[name]);
      resources[name] = {
        path: null,
        key: hasId ? "id" : null,
        ...flag(`resources.${name}`, "no item path (such as /things/{id}) in the spec"),
      };
    }
  }

  // A schema that is part of a resource's schema, or built on it, describes the same record: Nylas lists
  // `calendar_common` and reads `calendar` (`allOf: [calendar_common, ...]`). Such an entity stands for that
  // resource wherever an operation names it.
  const partsOf = (name, depth = 0) => {
    const parts = new Set();
    if (depth > 4) return parts;
    for (const part of schemas[name]?.allOf || []) {
      const ref = entity(decodeURIComponent(String(part.$ref || "").match(SCHEMA_REF)?.[1] || ""));
      if (!ref || parts.has(ref)) continue;
      parts.add(ref);
      for (const inner of partsOf(ref, depth + 1)) parts.add(inner);
    }
    return parts;
  };
  const resourceOf = (name) => {
    if (!name || resources[name]) return name;
    const same = Object.keys(resources).filter(
      (resource) => partsOf(resource).has(name) || partsOf(name).has(resource),
    );
    return same.length === 1 ? same[0] : name;
  };
  for (const op of facts) {
    op.request.entity = resourceOf(op.request.entity);
    op.response.entity = resourceOf(op.response.entity);
  }

  // A collection's GET that holds a list of what its item path returns is the list of that resource, whatever
  // the property is called: `{ load_balancers: [...], links, meta }` (DigitalOcean), `PageBeanX { values: [...] }`
  // (Jira). Told by structure, not by a name: one property, and only one, is an array of that record.
  for (const op of facts) {
    if (op.method !== "get" && op.method !== "query") continue;
    if (op.params.at(-1) || op.response.many || !shapes.has(`${op.shape}/{}`)) continue;
    const item = resourceOf(winner(`${op.shape}/{}`));
    if (!item || !resources[item]) continue;
    const found = listPropertiesOf(doc, op.responseSchema).filter(
      (one) => resourceOf(entity(one.schema)) === item,
    );
    if (found.length !== 1) continue;
    op.response = {
      name: found[0].schema,
      entity: item,
      many: true,
      listProperty: found[0].property,
      listItem: found[0].schema,
    };
  }

  // Pass 4: each operation's action
  const operations = {};
  for (const op of facts) {
    const lastParam = op.params.at(-1);
    const subAction = isSubAction(op);
    const parentShape = parentOf(op.shape);
    const name = resourceOf(
      winner(op.shape) ||
        (!lastParam && !subAction && op.response.many ? op.response.entity : undefined) ||
        (!lastParam && !subAction ? winner(parentShape) : undefined),
    );
    const resource = name && resources[name] ? name : undefined;
    const entry = (action, extra = {}) => ({ resource, action, ...extra });
    const queryNames = op.parameters.filter((p) => p.in === "query").map((p) => p.name);
    let result;

    if (!resource || subAction) {
      result = { action: "none" };
    } else if (lastParam) {
      const keyFrom = `path.${lastParam}`;
      if (op.method === "get") {
        // A GET that answers with something else (a file, another record) is not a plain read of the resource
        const other = !op.response.inline && op.response.entity !== resource;
        result = entry("read", {
          keyFrom,
          ...(other ? flag(op.id, `GET does not return ${resource}; assumed to read it`) : {}),
        });
      } else if (op.method === "put") result = entry("update", { keyFrom });
      else if (op.method === "patch") result = entry("patch", { keyFrom });
      else if (op.method === "delete") result = entry("delete", { keyFrom });
      else if (op.method === "post" && !op.request.entity) {
        // Petstore's `POST /pet/{petId}` with form fields: a partial update
        result = entry("patch", {
          keyFrom,
          ...flag(op.id, "POST on an item path; assumed a partial update"),
        });
      } else result = { action: "none" };
    } else if (
      (op.method === "get" || op.method === "query") &&
      (op.response.entity === resource || op.response.inline) &&
      op.response.many
    ) {
      const properties = propertiesOf(doc, schemas[resource]);
      const fields = Object.keys(properties);
      const filter = {};
      const unmatched = [];
      const notes = [];
      // what was assumed about each query parameter, by its name: where the UI marks it (describe.js)
      const paramReview = {};
      if (op.method === "query") notes.push("QUERY: its filters are in the request body");
      if (op.response.inline) notes.push(`returns inline objects; assumed to be ${resource}`);
      for (const q of queryNames) {
        // A field that holds objects (`tags: Tag[]`) is matched on one of their fields, by name
        const inner = fields.includes(q) ? namedSchema(doc, properties[q]) : {};
        const innerFields = inner.name ? Object.keys(propertiesOf(doc, schemas[inner.name])) : [];
        if (inner.name && innerFields.includes("name")) {
          filter[`${q}${inner.many ? "[]" : ""}.name`] = `query.${q}`;
          notes.push(`${q} holds ${inner.name} objects; assumed to match on their name`);
          paramReview[q] = `matched on the name of its ${inner.name} objects`;
        } else if (inner.name) unmatched.push(q);
        else if (fields.includes(q)) filter[q] = `query.${q}`;
        else if (!NOT_A_FILTER.has(nameKey(q))) unmatched.push(q);
      }
      for (const q of unmatched) paramReview[q] = `matches no field of ${resource}`;
      result = entry("list", {
        ...(Object.keys(filter).length ? { filter } : {}),
        ...(op.response.listProperty ? { listProperty: op.response.listProperty } : {}),
        ...(op.response.listItem ? { listItem: op.response.listItem } : {}),
        ...(Object.keys(paramReview).length ? { paramReview } : {}),
        ...(unmatched.length || notes.length
          ? flag(
              op.id,
              [
                ...notes,
                ...(unmatched.length
                  ? [`query parameter ${unmatched.join(", ")} matches no field of ${resource}`]
                  : []),
              ].join("; "),
            )
          : {}),
      });
    } else if (
      op.method === "post" &&
      (op.request.entity === resource || (op.response.entity === resource && !op.response.many))
    ) {
      // The body may be an input variant under another name (`OwnerFields`): what comes back names the record
      result = entry(op.request.many ? "createMany" : "create");
    } else if (
      op.method === "post" &&
      op.sendsObject &&
      [resources[resource].path, ...(resources[resource].alsoAt || [])].includes(`${op.shape}/{}`)
    ) {
      // A POST with an object on the collection of a resource creates one, though neither schema is named
      // after it (Jira: `CreatePriorityDetails` in, `PriorityId` out). Assumed, so it is marked.
      result = entry("create", {
        ...flag(
          op.id,
          `POST on the collection of ${resource}; assumed to create one${op.request.name ? ` from ${op.request.name}` : ""}`,
        ),
      });
    } else if ((op.method === "put" || op.method === "patch") && op.request.entity === resource) {
      // `PUT /pet` with the whole record in the body: the key comes from the body
      const key = resources[resource].key;
      result = entry(op.method === "put" ? "update" : "patch", {
        ...(key
          ? { keyFrom: `body.${key}` }
          : flag(op.id, "no key in the path or the body; one record per caller (a singleton)?")),
      });
    } else {
      result = { action: "none" };
    }
    if (result.action === "none" && /^(put|patch|delete)$/.test(op.method)) {
      Object.assign(result, flag(op.id, `${op.method.toUpperCase()} that fits no resource`));
    }
    operations[op.id] = result;
  }

  // A resource nothing reads or lists gains nothing from state (`POST /users/login` with a `LoginUser` body):
  // its operations go back to plain mocked responses
  for (const name of Object.keys(resources)) {
    const ids = Object.keys(operations).filter((id) => operations[id].resource === name);
    if (ids.some((id) => operations[id].action === "read" || operations[id].action === "list"))
      continue;
    delete resources[name];
    for (const id of ids) operations[id] = { action: "none" };
    const stale = new Set([`resources.${name}`, ...ids]);
    for (let i = review.length - 1; i >= 0; i--) {
      if (stale.has(review[i].slice(0, review[i].indexOf(": ")))) review.splice(i, 1);
    }
  }

  // Pass 5: relations between resources, and nested schemas stored inside their parent
  const relations = {};
  const embedded = {};
  // What a reference may call a resource: its entity name, and the collection its path names
  // (`GroupMetaData` at `/groups/{}` is also "group")
  const byEntityName = new Map(Object.keys(resources).map((n) => [nameKey(n), n]));
  const byPathName = new Map();
  for (const [n, resource] of Object.entries(resources)) {
    const segment = (resource.path || "")
      .split("/")
      .filter((part) => part && part !== "{}")
      .at(-1);
    if (segment && !byPathName.has(nameKey(segment))) byPathName.set(nameKey(segment), n);
  }
  /** The resource a reference field points at: `{ target, why? }`; `why` when it took more than the plain name. */
  const referenceTarget = (name, words) => {
    for (let i = 0; i < words.length; i++) {
      const rest = words.slice(i);
      const dropped = words.slice(0, i).join(" ");
      const target = byEntityName.get(nameKey(rest));
      if (target) {
        return { target, why: i ? `matched ${target} after dropping "${dropped}"` : undefined };
      }
      const byPath = byPathName.get(nameKey(rest));
      if (byPath) {
        const how = i ? ` after dropping "${dropped}"` : "";
        return {
          target: byPath,
          why: `matched ${byPath} by its path name "${rest.join(" ")}"${how}`,
        };
      }
    }
    // `parentId`, `rootId`: another record of the same kind
    if (words.every((word) => SELF_WORDS.has(word))) {
      return { target: name, why: `"${words.join(" ")}" assumed to be another ${name}` };
    }
    return {};
  };
  for (const name of Object.keys(resources)) {
    for (const [field, raw] of Object.entries(propertiesOf(doc, schemas[name]))) {
      const named = namedSchema(doc, raw);
      const target = entity(named.name);
      if (target && target !== name) {
        if (resources[target]) {
          relations[`${name}.${field}`] = {
            to: target,
            embeddedCopy: true,
            ...flag(
              `relations.${name}.${field}`,
              `holds a whole ${target}, which is also a resource`,
            ),
          };
        } else embedded[`${name}.${field}`] = target;
        continue;
      }
      // A reference is a field whose last word is `id` or `ids`: `petId`, `pet_id`, `assignedUserIDs`
      const words = splitWords(field);
      if (words.length < 2 || !/^ids?$/.test(words.at(-1)) || field === resources[name].key)
        continue;
      const refWords = words.slice(0, -1);
      const { target: refTarget, why } = referenceTarget(name, refWords);
      const id = `relations.${name}.${field}`;
      if (!refTarget) {
        relations[`${name}.${field}`] = {
          to: null,
          ...flag(id, `looks like a reference, but no resource is named ${refWords.join(" ")}`),
        };
      } else {
        // A target whose key is unknown is named alone: the relation holds, what it stores is open
        const targetKey = resources[refTarget].key;
        const to = targetKey ? `${refTarget}.${targetKey}` : refTarget;
        const notes = [why, targetKey ? undefined : `${refTarget} has no known key`].filter(
          Boolean,
        );
        relations[`${name}.${field}`] = notes.length ? { to, ...flag(id, notes.join("; ")) } : to;
      }
    }
  }

  // The component schema that describes each resource's records (`ApiKey` -> `ApiKeyResponseDto`)
  const schemaNames = Object.fromEntries(
    Object.keys(resources).map((name) => [name, schemaOf.get(name) || name]),
  );
  return { resources, relations, embedded, operations, review, schemas: schemaNames };
}

/**
 * The label of every operation, counted:
 * - `confident`: mapped to a stored record with nothing assumed
 * - `needsReview`: mapped, but something was assumed (on the operation or on its resource)
 * - `plainMock`: no state; answered with generated data, as the mock does without `--stateful`
 *
 * @param {ReturnType<typeof classifySpec>} model
 * @returns {{ confident: number, needsReview: number, plainMock: number }}
 */
export function labelCounts(model) {
  const counts = { confident: 0, needsReview: 0, plainMock: 0 };
  for (const entry of Object.values(model.operations)) counts[operationLabel(model, entry)] += 1;
  return counts;
}

/** The label of one operation's entry: `confident`, `needsReview` or `plainMock`. */
export function operationLabel(model, entry) {
  if (entry.action === "none") return "plainMock";
  return entry.review || model.resources[entry.resource]?.review ? "needsReview" : "confident";
}
