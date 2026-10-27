import { resolve } from './spec.js';

/**
 * Turns an OpenAPI schema (with internal `$ref`s, 3.0 or 3.1 dialect) into one self-contained JSON Schema
 * 2020-12 tree for data generation:
 *
 * - `$ref`s are inlined; a schema that refers back to itself stops after one level (an optional property is
 *   left out, an array becomes empty, a `oneOf` branch is dropped), so generated data stays finite and valid.
 * - OpenAPI 3.0 `nullable`, boolean `exclusiveMinimum`/`exclusiveMaximum` and `example` become JSON Schema.
 * - `writeOnly` properties are left out (responses never carry them).
 * - `allOf` next to `oneOf`/`anyOf` takes the first branch into the `allOf`: generators otherwise produce only
 *   the shared part and miss the branch's required properties.
 */
export function toJsonSchema(doc, schema, pointer) {
  return convert(doc, schema, pointer, [], doc.openapi.startsWith('3.0')) ?? {};
}

const CYCLE = Symbol('cycle');
const DROP = new Set([
  'discriminator',
  'xml',
  'externalDocs',
  'example',
  'nullable',
  'readOnly',
  'writeOnly',
  'deprecated',
  '$id',
  '$schema',
]);
const SCHEMA_MAPS = ['properties', 'patternProperties', 'dependentSchemas', '$defs'];
const SCHEMA_LISTS = ['allOf', 'anyOf', 'oneOf', 'prefixItems'];
const SCHEMA_VALUES = ['additionalProperties', 'unevaluatedProperties', 'items', 'contains', 'propertyNames', 'not', 'if', 'then', 'else'];

function convert(doc, node, pointer, stack, is30) {
  if (typeof node === 'boolean') return node;
  if (!node || typeof node !== 'object') return {};
  if (typeof node.$ref === 'string') {
    const target = resolve(doc, node, pointer);
    if (stack.includes(target.pointer)) return CYCLE;
    return convert(doc, target.node, target.pointer, [...stack, target.pointer], is30);
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (DROP.has(key) || key.startsWith('x-')) continue;
    const at = `${pointer}/${key}`;
    if (SCHEMA_MAPS.includes(key) && value && typeof value === 'object') {
      out[key] = {};
      for (const [name, child] of Object.entries(value)) {
        if (key === 'properties' && child?.writeOnly) continue;
        const converted = convert(doc, child, `${at}/${name}`, stack, is30);
        if (converted !== CYCLE) out[key][name] = converted;
      }
    } else if (SCHEMA_LISTS.includes(key) && Array.isArray(value)) {
      const converted = value.map((child, i) => convert(doc, child, `${at}/${i}`, stack, is30));
      out[key] = key === 'oneOf' || key === 'anyOf' ? converted.filter((c) => c !== CYCLE) : converted.map((c) => (c === CYCLE ? {} : c));
    } else if (SCHEMA_VALUES.includes(key)) {
      const converted = convert(doc, value, at, stack, is30);
      if (converted !== CYCLE) out[key] = converted;
      else if (key === 'items') Object.assign(out, { items: {}, maxItems: 0, minItems: 0 });
    } else {
      out[key] = value;
    }
  }

  if (out.required && out.properties) out.required = out.required.filter((name) => name in out.properties);
  for (const key of ['oneOf', 'anyOf']) if (out[key]?.length === 0) delete out[key];

  if (node.example !== undefined && out.examples === undefined) out.examples = [node.example];
  if (is30) {
    if (node.nullable === true) {
      if (out.type) out.type = [].concat(out.type, 'null');
      if (out.enum && !out.enum.includes(null)) out.enum = [...out.enum, null];
    }
    for (const [flag, bound] of [
      ['exclusiveMinimum', 'minimum'],
      ['exclusiveMaximum', 'maximum'],
    ]) {
      if (typeof out[flag] !== 'boolean') continue;
      if (out[flag] && out[bound] !== undefined) out[flag] = out[bound];
      else delete out[flag];
      if (typeof out[flag] === 'number') delete out[bound];
    }
  }

  const branches = out.oneOf ?? out.anyOf;
  if (out.allOf && branches) {
    out.allOf = [...out.allOf, branches[0]];
    delete out.oneOf;
    delete out.anyOf;
  }
  return out;
}
