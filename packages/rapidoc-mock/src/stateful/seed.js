/**
 * The seed generator of the stateful mock: the initial records of every resource, from the spec alone.
 *
 *   const { data, report } = await generateSeed(doc, classifySpec(doc), { rows: 10, seed: 1 });
 *
 * - Resources are filled in the order of their relations, so a reference always has a record to point at;
 *   references inside a cycle, and to a record's own kind (`parentId`), are filled in a second pass.
 * - A value comes from, in order: a reference, the spec's own values (enum, const, default; its examples for
 *   the first record, so the rest differ), a named generator for the entity and field (generators.js), the shape
 *   of the field's example (likeExample: a date, digits, a code, a number of that size), then the schema's format
 *   and constraints. A `pattern` is always kept. Fields are read through `allOf`.
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

/**
 * A schema with the properties and required fields of its `allOf` parts as its own: what a record of it holds.
 * Petclinic writes every entity as `allOf: [OwnerFields, { id, pets }]`, which has no `properties` itself.
 */
function flat(schema, depth = 0) {
  if (!schema || typeof schema !== "object" || !Array.isArray(schema.allOf) || depth > 6)
    return schema;
  const properties = {};
  const required = [];
  let type;
  for (const part of schema.allOf) {
    const inner = flat(part, depth + 1);
    Object.assign(properties, inner?.properties);
    required.push(...(inner?.required || []));
    type ??= inner?.type;
  }
  return {
    ...(type ? { type } : {}),
    ...schema,
    properties: { ...properties, ...schema.properties },
    required: [...new Set([...required, ...(schema.required || [])])],
  };
}

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
  // a number with an example takes its size from it (likeExample)
  return numeric && open && !hasExample(schema) ? { ...next, minimum: 0, maximum: 1000 } : next;
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
    const shape = flat(schema);
    const properties = shape.properties || {};
    const fields = Object.keys(properties);
    const domain = entityDomain(name, fields);
    const key = model.resources[name].key;
    const usedKeys = new Set();
    const mine = edges.filter((edge) => edge.from === name);
    for (const edge of mine) {
      edge.nullable = typesOf(properties[edge.field]).includes("null");
      edge.required = (shape.required || []).includes(edge.field);
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
      dress(record, shape, { values, entity: name, index: i }, { first, domain, model });

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
    const property = flat(properties[field]);
    const value = record[field];
    const isText = typesOf(property).includes("string");
    const nested = flat(property?.type === "array" ? property.items : property);
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
      const named = generator ? fit(generator(context), property) : undefined;
      const example = hasExample(property) ? exampleOf(property, context.index) : undefined;
      // The field's name gives the value, unless the example shows a code where the name gave a word
      // (`color` with the example `#039BE5`)
      const isCode =
        typeof example === "string" && /^\S*\d\S*$/.test(example) && !/[@/]/.test(example);
      if (named !== undefined && !(isCode && !/\d/.test(named))) record[field] = named;
      else if (typeof value === "string" && example !== undefined) {
        // an id is never a phrase: it keeps the generated value unless the example shows a shape to follow
        const idLike = /^(ids?|key|uuid|token)$/.test(splitWords(field).at(-1));
        const made = likeExample(example, context, property, idLike);
        if (made !== undefined) record[field] = fit(made, property);
      }
    } else if (isText && !property.format) {
      // A pattern decides: a named value where it fits (a person's name does, in a pattern for names), else a
      // few plain words, else what was generated from the pattern (a code, a phone number)
      const generator = generatorFor(domain, field);
      const readable = [generator?.(context), context.values.words()].find((candidate) =>
        fits(candidate, property),
      );
      if (readable !== undefined) record[field] = readable;
    } else if (isText && property.format === "email") {
      record[field] = generatorFor(domain, "email")(context);
    } else if (isText && (property.format === "uri" || property.format === "url")) {
      record[field] = context.values.url();
    } else if (typeof value === "number" && hasExample(property)) {
      record[field] = likeExample(exampleOf(property, context.index), context, property);
    } else if (Array.isArray(value) && hasExample(property) && !property.items?.properties) {
      // a list of plain values (`tags: ["New"]`): the spec's own list reads better than generated text
      const example = exampleOf(property, context.index);
      if (Array.isArray(example)) record[field] = structuredClone(example);
    }
  });
}

/** The example of a field for the record at `index`: a field with several gives each in turn. */
const exampleOf = (property, index) =>
  property.examples?.length
    ? property.examples[index % property.examples.length]
    : property.example;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/;

/**
 * A value shaped like the spec's example of a field, for the records after the first: what the example shows
 * that the schema does not say (Apideck's `created_at` is a plain string with a date-time for its example).
 *
 * - A date or date-time: another one, in the year before it.
 * - Digits (`"12345"`): as many other digits. A phone number, a URL, an e-mail address: another one.
 * - A number: one between half and one and a half times it, whole when it is, inside the schema's limits.
 * - A few words (`"Cold Call"`, `"EN"`): the example itself. It is likely one of a few values the API uses, and
 *   reads as data where generated text would not. Longer text: a sentence.
 */
function likeExample(example, { values }, property = {}, idLike = false) {
  if (typeof example === "number") {
    // a time in Unix seconds or milliseconds: another one, in the year before it
    for (const unit of [1, 1000]) {
      if (Number.isInteger(example) && example >= 1e9 * unit && example < 2e9 * unit) {
        return example - values.number(0, 365 * 24 * 60 * 60, true) * unit;
      }
    }
    const [low, high] = [example * 0.5, example * 1.5].sort((a, b) => a - b);
    const min = Math.max(low, property.minimum ?? -Infinity);
    const max = Math.min(high, property.maximum ?? Infinity);
    return min <= max ? values.number(min, max, Number.isInteger(example)) : example;
  }
  if (typeof example !== "string") return example;
  if (ISO_DATE.test(example) || ISO_DATE_TIME.test(example)) {
    const to = new Date(example);
    if (Number.isNaN(to.getTime())) return example;
    const made = values.dateBefore(to).toISOString();
    return ISO_DATE.test(example) ? made.slice(0, 10) : made;
  }
  if (/^\d+$/.test(example)) return values.digits(example.length);
  if (/^\+?[\d\s().-]+$/.test(example) && example.replace(/\D/g, "").length >= 7)
    return values.phone();
  if (/^https?:\/\//.test(example)) return values.url();
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(example)) {
    return `${values.firstName()}.${values.lastName()}@example.com`.toLowerCase();
  }
  // A code (`df0yq6c9okc6t9j4`, a UUID, `#039BE5`, `1.1.1.1`), and any one-word example of an id (`WgRpOB`):
  // the same shape, character by character
  if (!/\s/.test(example) && (/\d/.test(example) || idLike)) {
    const hex = /^[#\da-fA-F-]+$/.test(example) && /\d/.test(example) && /[a-f]/i.test(example);
    const hexDigits = /[A-F]/.test(example) ? "0123456789ABCDEF" : "0123456789abcdef";
    const alphabet = (char) =>
      hex && /[\da-f]/i.test(char)
        ? hexDigits
        : /\d/.test(char)
          ? "0123456789"
          : /[a-z]/.test(char)
            ? "abcdefghijklmnopqrstuvwxyz"
            : /[A-Z]/.test(char)
              ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              : "";
    return [...example]
      .map((char) => (alphabet(char) ? values.pick(alphabet(char)) : char))
      .join("");
  }
  if (idLike) return undefined;
  return example.length <= 24 && example.split(/\s+/).length <= 3 ? example : values.sentence();
}

/** Whether a text matches the field's `pattern` and length limits. */
function fits(value, property) {
  if (typeof value !== "string") return false;
  if (value.length < (property.minLength ?? 0) || value.length > (property.maxLength ?? Infinity))
    return false;
  try {
    return new RegExp(property.pattern, "u").test(value);
  } catch {
    return false;
  }
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
