import $RefParser from "@apidevtools/json-schema-ref-parser";

export const METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
];

/**
 * A `$ref` resolver for the server of the address the user gave: the parser refuses `localhost` and private
 * networks (a guard against a spec's `$ref` reaching into one), but a spec the user names there (a local
 * server's `/openapi.json`) is meant to be read, with the files it references on that server. Other servers a
 * spec's `$ref`s name are read by the parser's own resolver, behind its guard.
 */
const fromServer = (origin) => ({
  order: 150, // before the parser's http resolver (200)
  canRead: (file) => {
    try {
      return new URL(file.url).origin === origin;
    } catch {
      return false;
    }
  },
  read: async (file) => {
    const response = await fetch(file.url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok)
      throw new Error(`${file.url} answered ${response.status} ${response.statusText}`.trim());
    return response.text();
  },
});

/**
 * Loads one OpenAPI 3.0 / 3.1 / 3.2 document (JSON or YAML) and bundles the files it references into it, so every
 * `$ref` left is internal (`#/...`). Internal refs stay as they are: recursive schemas need them.
 *
 * `fullPath` is a file's path or an http(s) address; a relative `$ref` in a spec read from an address is read from
 * that address's server too.
 *
 * @param {string} fullPath
 * @returns {Promise<object>}
 */
export async function loadSpec(fullPath) {
  const remote = /^https?:\/\//i.test(fullPath);
  const doc = await $RefParser.bundle(
    fullPath,
    remote ? { resolve: { named: fromServer(new URL(fullPath).origin) } } : {},
  );
  if (typeof doc?.openapi !== "string" || !/^3\.[012]\./.test(doc.openapi)) {
    const version = doc?.openapi || (doc?.swagger && `Swagger ${doc.swagger}`) || "no version";
    throw new Error(`${fullPath} is not OpenAPI 3.0, 3.1 or 3.2 (${version})`);
  }
  return doc;
}

/** Escapes one JSON pointer segment. */
export const pointerSegment = (key) => String(key).replaceAll("~", "~0").replaceAll("/", "~1");

/** The value at a JSON pointer (`#/a/b`) in the document. */
export function atPointer(doc, ref) {
  if (!ref.startsWith("#")) throw new Error(`External $ref left after bundling: ${ref}`);
  let node = doc;
  for (const raw of ref.slice(1).split("/").slice(1)) {
    const key = decodeURIComponent(raw).replaceAll("~1", "/").replaceAll("~0", "~");
    node = node?.[key];
  }
  return node;
}

/**
 * Follows `$ref` chains: returns the object and the pointer it lives at. `pointer` is where `node` was found.
 * Sibling keywords of a `$ref` (OpenAPI 3.1 `description`, `summary`) are dropped: none matter to a mock.
 */
export function resolve(doc, node, pointer) {
  for (let hops = 0; node && typeof node === "object" && typeof node.$ref === "string"; hops++) {
    if (hops > 32) throw new Error(`$ref loop at ${pointer}`);
    pointer = node.$ref;
    node = atPointer(doc, pointer);
  }
  return { node, pointer };
}

/**
 * Every operation of the document: `{ method, path, operation, pointer }`, `method` in lower case. OpenAPI 3.2's
 * `query` and the methods under `additionalOperations` (`PURGE`, `COPY`, ...) are included.
 */
export function listOperations(doc) {
  const operations = [];
  for (const [path, rawItem] of Object.entries(doc.paths || {})) {
    const { node: item, pointer: itemPointer } = resolve(
      doc,
      rawItem,
      `#/paths/${pointerSegment(path)}`,
    );
    for (const method of METHODS) {
      if (item?.[method])
        operations.push({
          method,
          path,
          operation: item[method],
          pointer: `${itemPointer}/${method}`,
        });
    }
    for (const [name, operation] of Object.entries(item?.additionalOperations || {})) {
      const method = name.toLowerCase();
      if (!operation || typeof operation !== "object" || METHODS.includes(method)) continue;
      operations.push({
        method,
        path,
        operation,
        pointer: `${itemPointer}/additionalOperations/${pointerSegment(name)}`,
      });
    }
  }
  return operations;
}

/** The security requirements that apply to an operation (its own, else the document's). */
export const securityOf = (doc, operation) => operation.security ?? doc.security ?? [];
