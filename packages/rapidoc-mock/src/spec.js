import $RefParser from '@apidevtools/json-schema-ref-parser';

export const METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

/**
 * Loads one OpenAPI 3.0 / 3.1 document (JSON or YAML) and bundles the files it references into it, so every
 * `$ref` left is internal (`#/...`). Internal refs stay as they are: recursive schemas need them.
 *
 * @param {string} fullPath
 * @returns {Promise<object>}
 */
export async function loadSpec(fullPath) {
  const doc = await $RefParser.bundle(fullPath);
  if (typeof doc?.openapi !== 'string' || !/^3\.[01]\./.test(doc.openapi)) {
    const version = doc?.openapi || (doc?.swagger && `Swagger ${doc.swagger}`) || 'no version';
    throw new Error(`${fullPath} is not OpenAPI 3.0 or 3.1 (${version})`);
  }
  return doc;
}

/** Escapes one JSON pointer segment. */
export const pointerSegment = (key) => String(key).replaceAll('~', '~0').replaceAll('/', '~1');

/** The value at a JSON pointer (`#/a/b`) in the document. */
export function atPointer(doc, ref) {
  if (!ref.startsWith('#')) throw new Error(`External $ref left after bundling: ${ref}`);
  let node = doc;
  for (const raw of ref.slice(1).split('/').slice(1)) {
    const key = decodeURIComponent(raw).replaceAll('~1', '/').replaceAll('~0', '~');
    node = node?.[key];
  }
  return node;
}

/**
 * Follows `$ref` chains: returns the object and the pointer it lives at. `pointer` is where `node` was found.
 * Sibling keywords of a `$ref` (OpenAPI 3.1 `description`, `summary`) are dropped: none matter to a mock.
 */
export function resolve(doc, node, pointer) {
  for (let hops = 0; node && typeof node === 'object' && typeof node.$ref === 'string'; hops++) {
    if (hops > 32) throw new Error(`$ref loop at ${pointer}`);
    pointer = node.$ref;
    node = atPointer(doc, pointer);
  }
  return { node, pointer };
}

/** Every operation of the document: `{ method, path, operation, pointer }`. */
export function listOperations(doc) {
  const operations = [];
  for (const [path, rawItem] of Object.entries(doc.paths || {})) {
    const { node: item, pointer: itemPointer } = resolve(doc, rawItem, `#/paths/${pointerSegment(path)}`);
    for (const method of METHODS) {
      if (item?.[method]) operations.push({ method, path, operation: item[method], pointer: `${itemPointer}/${method}` });
    }
  }
  return operations;
}

/** The security requirements that apply to an operation (its own, else the document's). */
export const securityOf = (doc, operation) => operation.security ?? doc.security ?? [];
