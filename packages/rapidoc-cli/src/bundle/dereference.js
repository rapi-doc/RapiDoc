import { encodePointer, resolveRef, valueAt } from "../validate/bundle.js";

/*
 * Inlines every $ref of a spec, across files and within the entry file, so the output has none. A
 * $ref that leads back to a node being inlined is a cycle: it can't be written out, so dereferencing
 * stops with a CycleError naming the chain. (`toComponents` handles cycles, since they stay $refs.)
 */

/** @typedef {import("../validate/bundle.js").SpecFile} SpecFile */

export class CycleError extends Error {
  /** @param {{ location: string, pointer: string[] }[]} chain  the $ref targets, from the first to the one that repeats */
  constructor(chain) {
    super("Recursive $ref can't be inlined");
    this.chain = chain;
  }
}

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * The entry file of `files` with every $ref replaced by what it points to. Sibling keys of a $ref
 * (a 3.1 `description`, say) are kept over the target's.
 * @param {{ entry: string, files: Map<string, SpecFile> }} loaded
 * @returns {{ value: unknown, problems: { location: string, pointer: string[], message: string }[] }}
 */
export function dereference({ entry, files }) {
  const problems = [];

  const walk = (node, location, chain, pointer) => {
    if (Array.isArray(node))
      return node.map((item, i) => walk(item, location, chain, [...pointer, String(i)]));
    if (!isObject(node)) return node;

    if (typeof node.$ref === "string") {
      const target = resolveRef(location, node.$ref);
      const file = files.get(target.location);
      const { $ref, ...siblings } = node; // oxlint-disable-line no-unused-vars -- drops $ref
      if (!file) return { ...node }; // remote, not fetched: stays as written
      const value = file.error ? undefined : valueAt(file.value, target.pointer);
      if (value === undefined) {
        problems.push({
          location,
          pointer: [...pointer, "$ref"],
          message: file.error
            ? `$ref "${node.$ref}": can't read ${target.location} (${file.error})`
            : `$ref "${node.$ref}" points to nothing`,
        });
        return { ...node };
      }
      const key = `${target.location}${encodePointer(target.pointer)}`;
      const seen = chain.findIndex((link) => link.key === key);
      if (seen >= 0) throw new CycleError([...chain.slice(seen), { key, ...target }]);
      const resolved = walk(value, target.location, [...chain, { key, ...target }], target.pointer);
      return isObject(resolved) && Object.keys(siblings).length
        ? { ...resolved, ...siblings }
        : resolved;
    }

    const out = {};
    for (const [key, child] of Object.entries(node))
      out[key] = walk(child, location, chain, [...pointer, key]);
    return out;
  };

  return { value: walk(files.get(entry).value, entry, [], []), problems };
}
