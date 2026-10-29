import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { fake } from "./engine/faker.js";
import { pointerSegment, resolve } from "./spec.js";
import { toJsonSchema } from "./schema.js";

/**
 * Parses an RFC 7240 `Prefer` header into lower-cased directives:
 * `code=404` (pick a documented response), `example=<name>` (pick a named example),
 * `dynamic=true` (generate data even when the spec has an example).
 */
export function parsePrefer(header) {
  const directives = {};
  for (const token of (header || "").split(/[,;]/)) {
    const [key, ...rest] = token.split("=");
    if (key.trim() && rest.length)
      directives[key.trim().toLowerCase()] = rest.join("=").trim().replace(/^"|"$/g, "");
  }
  return directives;
}

/** Picks the documented response: Prefer code (exact, then `4XX`, then `default`), else the first 2xx. */
function pickResponse(responses, preferCode) {
  const keys = Object.keys(responses);
  if (/^[1-5]\d\d$/.test(preferCode || "")) {
    const key = [preferCode, `${preferCode[0]}XX`, "default"].find((candidate) =>
      keys.includes(candidate),
    );
    if (key) return { key, status: Number(preferCode), applied: true };
  }
  const success =
    keys.filter((key) => /^2\d\d$/.test(key)).sort()[0] || keys.find((key) => /^2XX$/i.test(key));
  const key = success || (keys.includes("default") ? "default" : keys[0]);
  if (!key) return { key: null, status: 204 };
  const status = /^\dXX$/i.test(key) ? Number(key[0]) * 100 : key === "default" ? 200 : Number(key);
  return { key, status };
}

/** The content type to answer with: the first one Accept allows, else JSON, else the first documented. */
function pickMediaType(content, accept) {
  const types = Object.keys(content);
  const accepted = (accept || "")
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);
  for (const want of accepted) {
    if (want === "*/*") break;
    const match = types.find((type) => {
      const base = type.split(";")[0].trim().toLowerCase();
      return base === want || (want.endsWith("/*") && base.startsWith(want.slice(0, -1)));
    });
    if (match) return match;
  }
  return types.find((type) => /json/i.test(type)) || types[0];
}

const ajv = new Ajv2020({ strict: false, logger: false, allErrors: true, verbose: true });
addFormats(ajv);
for (const format of ["int32", "int64", "float", "double", "byte", "binary", "password"])
  ajv.addFormat(format, true);
const validators = new WeakMap();

/** A cached validator for generated data, or null when the schema is beyond ajv (then data goes out unchecked). */
function validatorFor(schema) {
  if (!validators.has(schema)) {
    let validate = null;
    try {
      validate = ajv.compile(schema);
    } catch {
      // unchecked
    }
    validators.set(schema, validate);
  }
  return validators.get(schema);
}

/**
 * Generates a value and repairs what misses the schema: a generator can break a constraint for some seeds (an
 * empty string for a pattern, say). Each failing scalar is generated again from its own schema with other seeds.
 */
async function generateValid(schema, seed) {
  let value = await fake(schema, seed);
  const valid = validatorFor(schema);
  for (let round = 1; valid && round <= 3 && !valid(value); round++) {
    for (const error of valid.errors) {
      const leaf = error.parentSchema;
      if (
        !leaf ||
        typeof leaf !== "object" ||
        leaf.properties ||
        leaf.items ||
        leaf.allOf ||
        leaf.oneOf ||
        leaf.anyOf
      )
        continue;
      const leafValid = validatorFor(leaf);
      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = await fake(leaf, (seed + round * 1000 + attempt) >>> 0);
        if (leafValid && !leafValid(candidate)) continue;
        value = setAt(value, error.instancePath, candidate);
        break;
      }
    }
  }
  return value;
}

/** Sets the value at a JSON pointer (`/a/0/b`); the empty pointer replaces the root. */
function setAt(root, pointer, value) {
  if (!pointer) return value;
  const keys = pointer
    .slice(1)
    .split("/")
    .map((key) => key.replaceAll("~1", "/").replaceAll("~0", "~"));
  let node = root;
  for (const key of keys.slice(0, -1)) node = node?.[key];
  if (node && typeof node === "object") node[keys.at(-1)] = value;
  return root;
}

/** FNV-1a: a stable number per operation and response, so each gets its own data from one seed. */
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/**
 * Builds mock responses for one API: spec examples first, then data generated from the schema with a fixed seed.
 *
 * @param {object} doc - Bundled OpenAPI document
 * @param {object} [options]
 * @param {number} [options.seed]
 */
export function createResponder(doc, { seed = 1 } = {}) {
  // Generated data depends only on the schema and the seed, so each schema is generated once.
  const generated = new Map();
  const generate = (schema, pointer) => {
    if (!generated.has(pointer))
      generated.set(
        pointer,
        generateValid(toJsonSchema(doc, schema, pointer), (seed + hash(pointer)) >>> 0),
      );
    return generated.get(pointer);
  };

  /** A value for a media type or header object: named example, example, first example, else generated. */
  const valueOf = async (object, pointer, prefer = {}) => {
    const examples = object.examples && typeof object.examples === "object" ? object.examples : {};
    if (prefer.dynamic !== "true") {
      if (prefer.example && examples[prefer.example]) {
        return {
          value: resolve(doc, examples[prefer.example]).node?.value,
          source: `example "${prefer.example}"`,
          applied: true,
        };
      }
      if (object.example !== undefined) return { value: object.example, source: "example" };
      const [name, first] = Object.entries(examples)[0] || [];
      const example = first && resolve(doc, first).node;
      if (example && "value" in example)
        return { value: example.value, source: `example "${name}"` };
    }
    if (!object.schema) return { value: undefined, source: "empty" };
    return { value: await generate(object.schema, `${pointer}/schema`), source: "generated" };
  };

  /**
   * @param {object} input
   * @param {object} input.operation - The operation object from the bundled document
   * @param {string} input.pointer - JSON pointer of the operation
   * @param {boolean} [input.head] - HEAD request: headers only
   * @param {Record<string, string>} [input.prefer] - parsePrefer() of the request
   * @param {string} [input.accept] - Accept header
   * @returns {Promise<{status: number, headers: Record<string, string>, body: string | null, source: string}>}
   */
  return async function respond({ operation, pointer, head = false, prefer = {}, accept }) {
    const responses = operation.responses || {};
    const picked = pickResponse(responses, prefer.code);
    const preferenceApplied = picked.applied ? [`code=${prefer.code}`] : [];
    const headers = {};
    if (!picked.key) return { status: picked.status, headers, body: null, source: "empty" };

    const { node: response, pointer: responsePointer } = resolve(
      doc,
      responses[picked.key],
      `${pointer}/responses/${pointerSegment(picked.key)}`,
    );
    for (const [name, raw] of Object.entries(response?.headers || {})) {
      if (/^content-type$/i.test(name)) continue;
      const { node: header, pointer: headerPointer } = resolve(
        doc,
        raw,
        `${responsePointer}/headers/${pointerSegment(name)}`,
      );
      const { value } = await valueOf(header || {}, headerPointer);
      if (value !== undefined && value !== null)
        headers[name] = typeof value === "object" ? JSON.stringify(value) : String(value);
    }

    if (preferenceApplied.length) headers["Preference-Applied"] = preferenceApplied.join(", ");

    const content = response?.content || {};
    const mediaType = pickMediaType(content, accept);
    if (!mediaType || picked.status === 204 || picked.status === 304)
      return { status: picked.status, headers, body: null, source: "empty" };
    const mediaPointer = `${responsePointer}/content/${pointerSegment(mediaType)}`;
    const { node: media } = resolve(doc, content[mediaType], mediaPointer);
    const { value, source, applied } = await valueOf(media || {}, mediaPointer, prefer);
    if (applied) preferenceApplied.push(`example=${prefer.example}`);
    if (prefer.dynamic === "true" && source === "generated") preferenceApplied.push("dynamic=true");

    headers["Content-Type"] = mediaType;
    let body = "";
    if (typeof value === "string" && !/json/i.test(mediaType)) body = value;
    else if (value !== undefined) body = JSON.stringify(value, null, 2);
    if (preferenceApplied.length) headers["Preference-Applied"] = preferenceApplied.join(", ");
    return { status: picked.status, headers, body: head ? null : body, source };
  };
}
