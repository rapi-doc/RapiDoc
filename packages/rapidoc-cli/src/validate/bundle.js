import fs from "node:fs";
import path from "node:path";
import { isMap, isScalar, isSeq, LineCounter, parseDocument } from "yaml";

/*
 * Loads a spec and the files its $refs point to, keeping each file's YAML document for line and column
 * numbers (JSON is YAML, so .json works the same), and builds the "bundle" that is validated:
 *
 * - $refs into other files (or other URLs) are replaced by what they point to, so that content is
 *   checked too;
 * - $refs within the main file stay as they are: the validators check them as written, and recursive
 *   schemas (a $ref back to an ancestor) can't loop;
 * - every copied object and array remembers the file and JSON pointer it came from (`origin`), so an
 *   error at a path in the bundle can be traced back to its file, line and column (`locate`).
 */

export const isUrl = (location) => /^https?:\/\//i.test(location);

export const decodePointer = (pointer) =>
  pointer
    .replace(/^#/, "")
    .split("/")
    .slice(1)
    .map((segment) => decodeURIComponent(segment.replace(/~1/g, "/").replace(/~0/g, "~")));

export const encodePointer = (segments) =>
  `#${segments.map((segment) => `/${String(segment).replace(/~/g, "~0").replace(/\//g, "~1")}`).join("")}`;

/** Where `ref` (as written in the file at `from`) points: { location, pointer }. */
export function resolveRef(from, ref) {
  const [target, fragment = ""] = ref.split("#");
  let location = from;
  if (isUrl(target)) location = new URL(target).href;
  else if (target)
    location = isUrl(from) ? new URL(target, from).href : path.resolve(path.dirname(from), target);
  return { location, pointer: fragment ? decodePointer(`#${fragment}`) : [] };
}

export function valueAt(value, pointer) {
  let node = value;
  for (const segment of pointer) {
    if (node === null || typeof node !== "object") return undefined;
    node = node[segment];
  }
  return node;
}

async function readSource(location) {
  if (!isUrl(location)) return fs.readFileSync(location, "utf8");
  const response = await fetch(location);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

export class SpecSyntaxError extends Error {
  constructor(location, message, line, column) {
    super(message);
    Object.assign(this, { location, line, column });
  }
}

async function parseFile(location) {
  const text = await readSource(location);
  const lineCounter = new LineCounter();
  const doc = parseDocument(text, { lineCounter, prettyErrors: true, uniqueKeys: false });
  if (doc.errors.length) {
    const [first] = doc.errors;
    const { line, col } = first.linePos?.[0] ?? { line: 1, col: 1 };
    throw new SpecSyntaxError(location, first.message.split("\n")[0], line, col);
  }
  return { location, doc, lineCounter, value: doc.toJS({ maxAliasCount: -1 }) };
}

/** Every $ref string in a parsed value. */
function refsIn(value, found = []) {
  if (Array.isArray(value)) for (const item of value) refsIn(item, found);
  else if (value && typeof value === "object") {
    if (typeof value.$ref === "string") found.push(value.$ref);
    for (const child of Object.values(value)) refsIn(child, found);
  }
  return found;
}

/**
 * Loads `entry` and every file reachable through $refs. Remote files are fetched only with `remote`
 * (or when the entry itself is a URL); others stay unchecked $refs, reported as `skipped`.
 * Returns { entry, files: Map<location, file>, value, origin, problems, skipped }.
 */
export async function bundleSpec(entry, { remote = false } = {}) {
  const allowRemote = remote || isUrl(entry);
  const files = new Map([[entry, await parseFile(entry)]]);
  const problems = [];
  const skipped = new Set();

  // Load every file the $refs reach (breadth first), before the synchronous copy below.
  const queue = [entry];
  while (queue.length) {
    const from = queue.shift();
    for (const ref of refsIn(files.get(from).value)) {
      const { location } = resolveRef(from, ref);
      if (files.has(location) || (isUrl(location) && !allowRemote)) continue;
      try {
        files.set(location, await parseFile(location));
        queue.push(location);
      } catch (err) {
        if (err instanceof SpecSyntaxError) throw err;
        files.set(location, { location, error: err.message });
      }
    }
  }

  const origin = new WeakMap();
  const copy = (node, location, pointer, chain) => {
    if (Array.isArray(node)) {
      const out = node.map((item, i) => copy(item, location, [...pointer, String(i)], chain));
      origin.set(out, { location, pointer });
      return out;
    }
    if (!node || typeof node !== "object") return node;

    if (typeof node.$ref === "string") {
      const target = resolveRef(location, node.$ref);
      const refPointer = [...pointer, "$ref"];
      if (target.location === entry) {
        // Points into the main file: keep it as a $ref within the bundle.
        if (valueAt(files.get(entry).value, target.pointer) === undefined)
          problems.push({
            location,
            pointer: refPointer,
            message: `$ref "${node.$ref}" points to nothing`,
          });
        const kept = { ...node, $ref: encodePointer(target.pointer) };
        origin.set(kept, { location, pointer });
        return kept;
      }
      const file = files.get(target.location);
      if (!file) {
        skipped.add(target.location);
        const kept = { ...node };
        origin.set(kept, { location, pointer });
        return kept;
      }
      if (file.error) {
        problems.push({
          location,
          pointer: refPointer,
          message: `$ref "${node.$ref}": can't read ${target.location} (${file.error})`,
        });
        return {};
      }
      const key = `${target.location}${encodePointer(target.pointer)}`;
      const value = valueAt(file.value, target.pointer);
      if (value === undefined) {
        problems.push({
          location,
          pointer: refPointer,
          message: `$ref "${node.$ref}" points to nothing`,
        });
        return {};
      }
      // A $ref chain that comes back to itself across files: stop there.
      if (chain.has(key)) return {};
      return copy(value, target.location, target.pointer, new Set([...chain, key]));
    }

    const out = {};
    for (const [key, child] of Object.entries(node))
      out[key] = copy(child, location, [...pointer, key], chain);
    origin.set(out, { location, pointer });
    return out;
  };

  const value = copy(files.get(entry).value, entry, [], new Set());
  return { entry, files, value, origin, problems, skipped: [...skipped] };
}

/** The file and JSON pointer that a path in the bundle comes from. */
export function locate(bundle, segments) {
  let node = bundle.value;
  let best = bundle.origin.get(node);
  let rest = [];
  for (const segment of segments) {
    node = node !== null && typeof node === "object" ? node[segment] : undefined;
    const from = node !== null && typeof node === "object" ? bundle.origin.get(node) : undefined;
    if (from) [best, rest] = [from, []];
    else rest.push(segment);
  }
  return { location: best.location, pointer: [...best.pointer, ...rest] };
}

/**
 * Line and column (1-based) of a JSON pointer in a loaded file: the key of the deepest property that
 * exists along the pointer (a missing property points at its parent).
 */
export function position(file, pointer) {
  if (!file?.doc) return { line: 1, column: 1 };
  let node = file.doc.contents;
  let range = node?.range;
  for (const segment of pointer) {
    if (isMap(node)) {
      const pair = node.items.find(
        (item) => String(isScalar(item.key) ? item.key.value : item.key) === segment,
      );
      if (!pair) break;
      range = pair.key?.range ?? pair.value?.range ?? range;
      node = pair.value;
    } else if (isSeq(node)) {
      const item = node.items[Number(segment)];
      if (!item) break;
      range = item.range ?? range;
      node = item;
    } else break;
  }
  const { line, col } = file.lineCounter.linePos(range?.[0] ?? 0);
  return { line, column: col };
}
