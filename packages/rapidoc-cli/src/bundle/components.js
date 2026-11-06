import path from "node:path";
import { encodePointer, isUrl, resolveRef, valueAt } from "../validate/bundle.js";

/*
 * Turns a spec split over several files into one document: every $ref to another file becomes a
 * component (`#/components/schemas/Order`, or `#/definitions/Order` in Swagger 2.0) holding a copy of
 * what it pointed to, rewritten the same way. In-file $refs stay as written. A $ref whose kind can't be
 * told from where it is (under a vendor extension, say) is inlined instead.
 *
 * The walk knows the OpenAPI structure (which children of a node are schemas, parameters, ...), so the
 * kind of a $ref is the kind of the place it's written in.
 */

/** @typedef {import("../validate/bundle.js").SpecFile} SpecFile */
/** @typedef {{ location: string, pointer: string[], message: string }} RefProblem */

const METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];
const SCHEMA_ONE = [
  "items",
  "not",
  "additionalProperties",
  "additionalItems",
  "unevaluatedProperties",
  "unevaluatedItems",
  "propertyNames",
  "contains",
  "if",
  "then",
  "else",
];
const SCHEMA_MAP = ["properties", "patternProperties", "dependentSchemas", "$defs", "definitions"];
const SCHEMA_LIST = ["allOf", "anyOf", "oneOf", "prefixItems"];

/**
 * The kind of `key`'s value inside a node of kind `kind`, as ["one", kind], ["map", kind] or
 * ["list", kind]; undefined when it holds no $ref-able OpenAPI object (or the kind is unknown).
 * @param {string | undefined} kind
 * @param {string} key
 * @param {boolean} v2  Swagger 2.0 document
 */
function childKind(kind, key, v2) {
  switch (kind) {
    case "root":
      if (key === "paths" || key === "webhooks") return ["map", "pathItem"];
      if (key === "components") return ["one", "components"];
      if (v2 && key === "definitions") return ["map", "schema"];
      if (v2 && key === "parameters") return ["map", "parameter"];
      if (v2 && key === "responses") return ["map", "response"];
      return undefined;
    case "components":
      return CONTAINERS[key] ? ["map", CONTAINERS[key]] : undefined;
    case "pathItem":
      if (key === "parameters") return ["list", "parameter"];
      if (METHODS.includes(key)) return ["one", "operation"];
      return undefined;
    case "operation":
      if (key === "parameters") return ["list", "parameter"];
      if (key === "requestBody") return ["one", "requestBody"];
      if (key === "responses") return ["map", "response"];
      if (key === "callbacks") return ["map", "callback"];
      return undefined;
    case "parameter":
    case "header":
      if (key === "schema" || (v2 && key === "items")) return ["one", "schema"];
      if (key === "examples") return ["map", "example"];
      if (key === "content") return ["map", "mediaType"];
      return undefined;
    case "requestBody":
      return key === "content" ? ["map", "mediaType"] : undefined;
    case "response":
      if (key === "headers") return ["map", "header"];
      if (key === "content") return ["map", "mediaType"];
      if (key === "links") return ["map", "link"];
      if (v2 && key === "schema") return ["one", "schema"];
      return undefined;
    case "mediaType":
      if (key === "schema") return ["one", "schema"];
      if (key === "examples") return ["map", "example"];
      if (key === "encoding") return ["map", "encoding"];
      return undefined;
    case "encoding":
      return key === "headers" ? ["map", "header"] : undefined;
    case "callback":
      return ["one", "pathItem"];
    case "schema":
      if (SCHEMA_ONE.includes(key)) return ["one", "schema"];
      if (SCHEMA_MAP.includes(key)) return ["map", "schema"];
      if (SCHEMA_LIST.includes(key)) return ["list", "schema"];
      return undefined;
    default:
      return undefined;
  }
}

/** components/<container> → kind (OpenAPI 3.x). */
const CONTAINERS = {
  schemas: "schema",
  parameters: "parameter",
  responses: "response",
  requestBodies: "requestBody",
  headers: "header",
  examples: "example",
  links: "link",
  callbacks: "callback",
  pathItems: "pathItem",
  securitySchemes: "securityScheme",
};

/** Where a component of `kind` lives, as pointer segments, or undefined when the version has no place for it. */
function containerFor(kind, { v2, pathItems }) {
  if (v2)
    return { schema: ["definitions"], parameter: ["parameters"], response: ["responses"] }[kind];
  if (kind === "pathItem" && !pathItems) return undefined;
  const container = Object.keys(CONTAINERS).find((key) => CONTAINERS[key] === kind);
  return container ? ["components", container] : undefined;
}

/** A component name from where a $ref points: the file name, or the last pointer segment. */
function nameFor(location, pointer) {
  const raw = pointer.length
    ? pointer.at(-1)
    : path
        .basename(isUrl(location) ? new URL(location).pathname : location)
        .replace(/\.[^.]+$/, "");
  return raw.replace(/[^a-zA-Z0-9._-]/g, "_") || "component";
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * The entry file of `files` as one document, other-file $refs turned into components.
 * @param {{ entry: string, files: Map<string, SpecFile>, skipped: string[] }} loaded
 * @returns {{ value: object, problems: RefProblem[], added: { kind: string, name: string, from: string }[], inlined: number }}
 */
export function toComponents({ entry, files }) {
  const root = files.get(entry).value;
  const v2 = isObject(root) && typeof root.swagger === "string";
  const pathItems = !v2 && /^3\.[1-9]/.test(String(root?.openapi ?? ""));
  const versions = { v2, pathItems };

  /** @type {RefProblem[]} */
  const problems = [];
  const added = [];
  let inlined = 0;
  /** target key (location + pointer) → component pointer segments */
  const named = new Map();
  /** container pointer (joined) → names taken there, with the target key each holds */
  const taken = new Map();
  /** container pointer (joined) → { name: value } to merge into the output */
  const components = new Map();

  const takenIn = (container) => {
    const key = container.join("/");
    if (!taken.has(key)) {
      const existing = valueAt(root, container);
      taken.set(
        key,
        new Map(Object.keys(isObject(existing) ? existing : {}).map((n) => [n, null])),
      );
      components.set(key, {});
    }
    return taken.get(key);
  };

  /** Registers (once) a component for the target and returns its pointer segments. */
  const componentFor = (kind, target, container) => {
    const targetKey = `${target.location}${encodePointer(target.pointer)}`;
    if (named.has(targetKey)) return named.get(targetKey);
    const names = takenIn(container);
    const base = nameFor(target.location, target.pointer);
    let name = base;
    for (let n = 2; names.has(name); n++) name = `${base}-${n}`;
    names.set(name, targetKey);
    const segments = [...container, name];
    named.set(targetKey, segments);
    added.push({ kind, name, from: target.location });
    const file = files.get(target.location);
    const byName = components.get(container.join("/"));
    byName[name] = undefined; // takes its place now, ahead of the components its body adds
    byName[name] = rewrite(
      valueAt(file.value, target.pointer),
      target.location,
      kind,
      new Set([targetKey]),
      target.pointer,
    );
    return segments;
  };

  /**
   * A copy of `node` (which lives in the file at `location`) with its $refs rewritten.
   * `kind` is what the node is (undefined when unknown); `chain` holds the targets being inlined, so a
   * cycle through inlining stops.
   */
  const rewrite = (node, location, kind, chain, pointer = []) => {
    if (Array.isArray(node))
      return node.map((item, i) => rewrite(item, location, kind, chain, [...pointer, String(i)]));
    if (!isObject(node)) return node;

    if (typeof node.$ref === "string") {
      const target = resolveRef(location, node.$ref);
      if (target.location === entry) return { ...node, $ref: encodePointer(target.pointer) };
      const file = files.get(target.location);
      if (!file) return { ...node }; // remote, not fetched: stays as written
      const problem = file.error
        ? `$ref "${node.$ref}": can't read ${target.location} (${file.error})`
        : valueAt(file.value, target.pointer) === undefined
          ? `$ref "${node.$ref}" points to nothing`
          : undefined;
      if (problem) {
        problems.push({ location, pointer: [...pointer, "$ref"], message: problem });
        return { ...node };
      }
      const container = kind && containerFor(kind, versions);
      if (container) {
        const { $ref, ...siblings } = node; // oxlint-disable-line no-unused-vars -- drops $ref
        return { $ref: encodePointer(componentFor(kind, target, container)), ...siblings };
      }
      const targetKey = `${target.location}${encodePointer(target.pointer)}`;
      if (chain.has(targetKey)) {
        problems.push({
          location,
          pointer: [...pointer, "$ref"],
          message: `$ref "${node.$ref}" is part of a cycle that can't be inlined (no component kind for it here)`,
        });
        return { ...node };
      }
      inlined++;
      return rewrite(
        valueAt(file.value, target.pointer),
        target.location,
        kind,
        new Set([...chain, targetKey]),
        target.pointer,
      );
    }

    const out = {};
    for (const [key, child] of Object.entries(node)) {
      const childPointer = [...pointer, key];
      const shape = childKind(kind, key, v2);
      if (!shape) {
        out[key] = rewrite(child, location, undefined, chain, childPointer);
      } else if (shape[0] === "one") {
        out[key] = rewrite(child, location, shape[1], chain, childPointer);
      } else if (shape[0] === "list") {
        out[key] = Array.isArray(child)
          ? child.map((item, i) =>
              rewrite(item, location, shape[1], chain, [...childPointer, String(i)]),
            )
          : rewrite(child, location, undefined, chain, childPointer);
      } else {
        out[key] = isObject(child)
          ? Object.fromEntries(
              Object.entries(child).map(([name, item]) => [
                name,
                rewrite(item, location, shape[1], chain, [...childPointer, name]),
              ]),
            )
          : rewrite(child, location, undefined, chain, childPointer);
      }
    }
    return out;
  };

  const value = rewrite(root, entry, "root", new Set());

  // Merge the new components in, after the entry's own ones.
  for (const [key, byName] of components) {
    if (!Object.keys(byName).length) continue;
    const container = key.split("/");
    let node = value;
    for (const segment of container.slice(0, -1)) node = node[segment] ??= {};
    const last = container.at(-1);
    node[last] = { ...(isObject(node[last]) ? node[last] : {}), ...byName };
  }
  return { value, problems, added, inlined };
}
