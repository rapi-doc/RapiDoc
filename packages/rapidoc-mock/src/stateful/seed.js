/**
 * The seed generator of the stateful mock: the initial records of every resource, from the spec alone.
 *
 *   const { data, report } = await generateSeed(doc, classifySpec(doc), { rows: 10, seed: 1 });
 *
 * - Resources are filled in the order of their relations, so a reference always has a record to point at;
 *   references inside a cycle, and to a record's own kind (`parentId`), are filled in a second pass.
 * - A value comes from, in order: a reference, the spec's own values (enum, const, default; its examples for
 *   the first record, so the rest differ), a named generator for the entity and field (generators.js), then the
 *   schema's format and constraints.
 * - The same spec and seed give the same data.
 */
import { generateValid, validatorFor } from "../responses.js";
import { toJsonSchema } from "../schema.js";
import { valuesFor } from "../engine/values.js";
import { entityDomain, generatorFor } from "./generators.js";
import { splitWords } from "./words.js";

/** A small seeded random number generator (mulberry32): `() => number in [0, 1)`. */
function randomFrom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (text) => {
  let h = 2166136261;
  for (const char of String(text)) h = Math.imul(h ^ char.codePointAt(0), 16777619);
  return h >>> 0;
};

/** The relations of the model as edges: `{ from, field, to, toKey, copy, late }`. */
function edgesOf(model) {
  const names = Object.keys(model.resources);
  const edges = [];
  for (const [id, value] of Object.entries(model.relations)) {
    const target = typeof value === "string" ? value : value.to;
    if (!target) continue;
    const from = names.find((name) => id.startsWith(`${name}.`));
    const to = names
      .filter((name) => target === name || target.startsWith(`${name}.`))
      .sort((a, b) => b.length - a.length)[0];
    if (!from || !to) continue;
    edges.push({
      from,
      field: id.slice(from.length + 1),
      to,
      toKey: model.resources[to].key,
      copy: Boolean(value.embeddedCopy),
      late: from === to,
    });
  }
  return edges;
}

/** Resources ordered so each comes after those it refers to; edges that close a cycle are marked `late`. */
function orderOf(names, edges) {
  const order = [];
  const done = new Set();
  const remaining = new Set(names);
  while (remaining.size) {
    const ready = [...remaining].filter((name) =>
      edges.every((edge) => edge.from !== name || edge.late || done.has(edge.to)),
    );
    if (ready.length === 0) {
      // A cycle: the resource with the fewest unmet references goes next, and those references wait
      const unmet = (name) => edges.filter((e) => e.from === name && !e.late && !done.has(e.to));
      const next = [...remaining].sort((a, b) => unmet(a).length - unmet(b).length)[0];
      for (const edge of unmet(next)) edge.late = true;
      ready.push(next);
    }
    for (const name of ready) {
      order.push(name);
      done.add(name);
      remaining.delete(name);
    }
  }
  return order;
}

const typesOf = (schema) => (Array.isArray(schema?.type) ? schema.type : [schema?.type]);
const hasExample = (schema) => schema?.example !== undefined || schema?.examples?.length > 0;
const hasFixedValue = (schema) =>
  !schema || schema.enum || schema.const !== undefined || schema.default !== undefined;

/** A JSON Schema whose unbounded numbers get a small positive range: a quantity of -837 reads as a bug. */
function bounded(schema) {
  if (Array.isArray(schema)) return schema.map(bounded);
  if (!schema || typeof schema !== "object") return schema;
  const next = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [
      key,
      key === "enum" || key === "const" || key === "examples" ? value : bounded(value),
    ]),
  );
  const numeric = typesOf(schema).some((type) => type === "integer" || type === "number");
  const open = [
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "enum",
    "const",
  ].every((key) => schema[key] === undefined);
  return numeric && open ? { ...next, minimum: 0, maximum: 1000 } : next;
}

/** A JSON Schema without its examples, so generation varies: the examples are kept for the first record only. */
function withoutExamples(schema) {
  if (Array.isArray(schema)) return schema.map(withoutExamples);
  if (!schema || typeof schema !== "object") return schema;
  return Object.fromEntries(
    Object.entries(schema)
      .filter(([key]) => key !== "examples" && key !== "example")
      .map(([key, value]) => [
        key,
        key === "enum" || key === "const" ? value : withoutExamples(value),
      ]),
  );
}

/**
 * @param {object} doc - The bundled OpenAPI document
 * @param {object} model - classifySpec(doc)
 * @param {{ rows?: number | Record<string, number>, seed?: number }} [options] - `rows`: records per resource,
 *   for all (a number) or per resource (`{ default: 10, Order: 50 }`)
 * @returns {Promise<{ data: Record<string, object[]>, report: object }>}
 */
export async function generateSeed(doc, model, { rows = 10, seed = 1 } = {}) {
  const names = Object.keys(model.resources);
  const edges = edgesOf(model);
  const order = orderOf(names, edges);
  const rowsFor = (name) => (typeof rows === "number" ? rows : (rows[name] ?? rows.default ?? 10));
  const data = Object.fromEntries(names.map((name) => [name, []]));
  const invalid = {};

  for (const name of order) {
    const pointer = `#/components/schemas/${model.schemas[name]}`;
    const schema = bounded(toJsonSchema(doc, { $ref: pointer }, pointer));
    const varied = withoutExamples(schema);
    const properties = schema.properties || {};
    const fields = Object.keys(properties);
    const domain = entityDomain(name, fields);
    const key = model.resources[name].key;
    const usedKeys = new Set();
    const mine = edges.filter((edge) => edge.from === name);
    for (const edge of mine) {
      edge.nullable = typesOf(properties[edge.field]).includes("null");
      edge.required = (schema.required || []).includes(edge.field);
    }
    // `recipeId` means the recipe's `id`, even where its path uses another key (`/recipes/{slug}`)
    for (const edge of edges.filter((e) => e.to === name && !e.copy)) {
      if (/^ids?$/.test(splitWords(edge.field).at(-1)) && fields.includes("id")) edge.toKey = "id";
    }

    for (let i = 0; i < rowsFor(name); i++) {
      const recordSeed = hash(`${seed}/${name}/${i}`);
      const random = randomFrom(recordSeed);
      // The first record shows the spec's examples; the others are generated, or every record would be the same
      const first = i === 0;
      const record = await generateValid(first ? schema : varied, recordSeed);
      if (!record || typeof record !== "object" || Array.isArray(record)) continue;
      // One set of value makers per record, seeded by it: a record's values never depend on another's
      const values = valuesFor(recordSeed);
      dress(record, schema, { values, entity: name, index: i }, { first, domain, model });

      for (const edge of mine.filter((e) => !e.late)) link(record, edge, data[edge.to], random);
      if (key) record[key] = uniqueKey(record[key], properties[key], i, usedKeys);
      // An `id` beside another key (`User.id` with the key `username`) still differs per record
      if (key !== "id" && typesOf(properties.id).includes("integer")) record.id = i + 1;
      data[name].push(record);
    }
  }

  // Second pass: references to a record's own kind, and those that closed a cycle
  for (const edge of edges.filter((e) => e.late)) {
    data[edge.from].forEach((record, i) => {
      const random = randomFrom(hash(`${seed}/${edge.from}/${edge.field}/${i}`));
      // A record never refers to itself; the first of its kind has nothing before it
      const pool = edge.from === edge.to ? data[edge.to].slice(0, i) : data[edge.to];
      link(record, edge, pool, random, true);
    });
  }

  for (const name of order) {
    const pointer = `#/components/schemas/${model.schemas[name]}`;
    const valid = validatorFor(toJsonSchema(doc, { $ref: pointer }, pointer));
    const bad = valid ? data[name].filter((record) => !valid(record)).length : 0;
    if (bad) invalid[name] = bad;
  }

  return {
    data,
    report: {
      order,
      records: Object.fromEntries(names.map((name) => [name, data[name].length])),
      orphans: orphansOf(data, edges),
      invalid,
    },
  };
}

/**
 * Gives a generated record the values its fields call for: each enum value in turn, and a named value where a
 * generator knows the field. The spec's own values stand (enum, const, default; examples in the first record).
 * Objects nested in the record are dressed the same way, as the entity their schema or field names.
 */
function dress(record, schema, context, { first, domain, model }, depth = 0) {
  const properties = schema?.properties || {};
  Object.keys(properties).forEach((field, index) => {
    const property = properties[field];
    const value = record[field];
    const isText = typesOf(property).includes("string");
    const nested = property?.type === "array" ? property.items : property;
    if (nested?.properties && depth < 3) {
      const entity = model.embedded[`${context.entity}.${field}`] || field;
      const inner = { first, model, domain: entityDomain(entity, Object.keys(nested.properties)) };
      for (const [n, item] of (Array.isArray(value) ? value : [value]).entries()) {
        if (!item || typeof item !== "object") continue;
        // an item of a list is numbered within the list, so two tags of one pet differ
        const index1 = Array.isArray(value) ? context.index * 3 + n : context.index;
        dress(
          item,
          nested,
          { ...context, person: undefined, entity, index: index1 },
          inner,
          depth + 1,
        );
      }
    } else if (Array.isArray(property?.enum) && property.enum.length > 1) {
      // Enumerated fields take each value in turn, so every `status` has records
      if (depth === 0)
        record[field] = property.enum[(context.index + index) % property.enum.length];
    } else if (hasFixedValue(property) || (first && hasExample(property))) {
      // the spec's own value stands
    } else if (isText && !property.format && !property.pattern) {
      const generator = generatorFor(domain, field);
      if (generator) record[field] = fit(generator(context), property);
    } else if (isText && property.format === "email") {
      record[field] = generatorFor(domain, "email")(context);
    } else if (isText && (property.format === "uri" || property.format === "url")) {
      record[field] = context.values.url();
    }
  });
}

/** A generated text cut to the field's `maxLength`. */
const fit = (value, property) =>
  typeof value === "string" && property?.maxLength ? value.slice(0, property.maxLength) : value;

/** A key no earlier record has: integers count up from 1; text keeps its value, numbered when it repeats. */
function uniqueKey(value, property, index, used) {
  const types = typesOf(property);
  let key = value;
  if (types.includes("integer") || types.includes("number")) key = index + 1;
  else if (key === undefined || key === null || key === "" || used.has(String(key))) {
    key = `${key || "id"}-${index + 1}`;
  }
  used.add(String(key));
  return key;
}

/**
 * Points a record's reference field at records of the pool: the key of one, a list of keys for an `ids` field,
 * or a copy of the record where the field holds a whole one. With an empty pool the field is cleared when it
 * may be (`clearIfEmpty`), else left as generated.
 */
function link(record, edge, pool, random, late = false) {
  const current = record[edge.field];
  const many = Array.isArray(current) || splitWords(edge.field).at(-1) === "ids";
  if (!pool.length) {
    // Nothing to point at (the first record of its kind): no reference, in whatever way the schema allows
    if (!late) return;
    if (many) record[edge.field] = [];
    else if (edge.nullable) record[edge.field] = null;
    else if (!edge.required) delete record[edge.field];
    else if (!edge.copy && edge.toKey) record[edge.field] = record[edge.toKey];
    return;
  }
  if (!edge.copy && !edge.toKey) return;
  const one = () => pool[Math.floor(random() * pool.length)];
  // A field that holds a whole record keeps its own shape (often a summary: `{ name, url }`) and takes the
  // target's values for the fields they share, so it describes a record that exists
  const shaped = (target, sample) => {
    if (!sample || typeof sample !== "object" || Array.isArray(sample))
      return structuredClone(target);
    const next = { ...sample };
    for (const field of Object.keys(sample)) {
      if (target[field] !== undefined) next[field] = structuredClone(target[field]);
    }
    return next;
  };
  if (many) {
    const samples = Array.isArray(current) ? current : [];
    const count = Math.min(pool.length, 1 + Math.floor(random() * 2));
    const picked = new Set();
    while (picked.size < count) picked.add(one());
    record[edge.field] = [...picked].map((target, n) =>
      edge.copy ? shaped(target, samples[n] ?? samples[0]) : target[edge.toKey],
    );
  } else {
    const target = one();
    record[edge.field] = edge.copy ? shaped(target, current) : target[edge.toKey];
  }
}

/** References that point at no record: `[{ relation, count }]`. Empty when the seed is consistent. */
export function orphansOf(data, edges) {
  const orphans = [];
  for (const edge of edges) {
    if (edge.copy || !edge.toKey) continue;
    const keys = new Set((data[edge.to] || []).map((record) => String(record[edge.toKey])));
    const count = (data[edge.from] || [])
      .flatMap((record) => record[edge.field])
      .filter((value) => value !== null && value !== undefined && !keys.has(String(value))).length;
    if (count) orphans.push({ relation: `${edge.from}.${edge.field}`, count });
  }
  return orphans;
}
