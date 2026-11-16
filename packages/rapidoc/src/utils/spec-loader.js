/*
 * Loading a spec with `@scalar/openapi-parser`: the fetch plugin for `load()` and the step that makes a
 * dereferenced spec a tree again. Headless and without other imports, so that `<rapi-doc>`
 * (spec-parser.js) and `<rapi-pdf>` (packages/rapipdf, which bundles this file by relative path) load
 * specs the same way.
 */
import { parse as parseYaml } from "yaml";

export function isUrlLike(value) {
  if (typeof value !== "string") {
    return false;
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return false;
  }
  if (trimmed.includes("\n")) {
    return false;
  }
  return true;
}

// The page URL that relative spec URLs are resolved against; guard for non-browser environments (SSR / test runners)
export function pageUrl() {
  return typeof window !== "undefined" && window.location?.href
    ? window.location.href
    : "http://localhost/";
}

/**
 * Custom browser fetch plugin for `@scalar/openapi-parser`'s `load()` method.
 *
 * Provides browser-native `fetch` support for loading specifications and resolving
 * relative and external `$ref` files across browser and SSR/Node environments.
 *
 * @param {string} [baseUrl] - The base URL or document path to resolve relative references against.
 * @returns {import('@scalar/openapi-parser').LoadPlugin} A plugin object conforming to the `@scalar/openapi-parser` plugin interface:
 *   - `check(value)`: Determines whether this plugin handles the given reference/URL.
 *   - `resolvePath(parentPath, reference)`: Resolves relative reference paths against parent document URLs.
 *   - `get(value)`: Fetches file content as text using browser `fetch()`.
 */
export function createBrowserFetchPlugin(baseUrl) {
  const base = new URL(baseUrl || pageUrl(), pageUrl());

  return {
    // Determines if the reference should be fetched by this plugin (ignores inlined JSON/YAML and '#/...' local refs)
    check(value) {
      if (typeof value !== "string" || value.startsWith("#")) {
        return false;
      }
      return isUrlLike(value);
    },
    // Resolves relative $ref paths (e.g. '../common/models.yaml') against their parent document URL
    resolvePath(parentPath, reference) {
      if (
        typeof reference === "string" &&
        (reference.startsWith("http://") || reference.startsWith("https://"))
      ) {
        return reference;
      }
      const isParentString = typeof parentPath === "string";
      const parentUrl =
        isParentString && (parentPath.startsWith("http://") || parentPath.startsWith("https://"))
          ? new URL(parentPath)
          : base;
      return new URL(reference, parentUrl).href;
    },
    // Fetches the target URL via native fetch and returns the parsed spec or raw text
    async get(value) {
      const targetUrl =
        value.startsWith("http://") || value.startsWith("https://")
          ? value
          : new URL(value, base).href;
      const resp = await fetch(targetUrl);
      if (!resp.ok) {
        const error = new Error(`Failed to load ${targetUrl} (${resp.status})`);
        error.status = resp.status;
        error.statusCode = resp.status;
        error.response = resp;
        error.url = targetUrl;
        throw error;
      }
      const text = await resp.text();
      try {
        return JSON.parse(text);
      } catch {
        try {
          return parseYaml(text, { maxAliasCount: -1, merge: true });
        } catch {
          return text;
        }
      }
    },
  };
}

/**
 * A copy of a dereferenced spec without object cycles: where a schema contains itself, the inner
 * occurrence becomes `{ $ref }` (the ref `dereference()` recorded as `x-ref` in its `onDereference`).
 * The `x-ref` markers are left out of the copy.
 */
export function breakCircularRefs(root) {
  const seen = new WeakMap();
  const ancestors = new WeakSet();

  function walk(node, activeRefs = new Set(), currentRef = null) {
    if (!node || typeof node !== "object") {
      return node;
    }

    const ref = node["x-ref"];
    if (ref) {
      if (activeRefs.has(ref)) {
        return { $ref: ref };
      }
    }

    // A dereferenced $ref can be a shallow copy of the schema it points to: a different object with the
    // same children. When one of those children is being walked right now, this is the schema inside
    // itself, and the $ref belongs here; walking on would put it one level down, on that child
    // (`properties: { $ref }`).
    if (ref) {
      for (const child of Object.values(node)) {
        if (child && typeof child === "object" && ancestors.has(child)) {
          return { $ref: ref };
        }
      }
    }

    // Cycle detection via object identity (in active ancestor chain)
    if (ancestors.has(node)) {
      return { $ref: ref || currentRef || "#/components/schemas/Circular" };
    }

    // Memoization for non-cycle nodes (preserves DAG sharing & linear O(V+E) time)
    if (seen.has(node)) {
      return seen.get(node);
    }

    ancestors.add(node);
    let childActiveRefs = activeRefs;
    if (ref) {
      childActiveRefs = new Set(activeRefs);
      childActiveRefs.add(ref);
    }

    let clone;
    if (Array.isArray(node)) {
      clone = [];
      seen.set(node, clone);
      for (let i = 0; i < node.length; i++) {
        clone.push(walk(node[i], childActiveRefs, ref || currentRef));
      }
    } else {
      clone = {};
      seen.set(node, clone);
      for (const key of Object.keys(node)) {
        if (key === "x-ref") {
          continue;
        }
        clone[key] = walk(node[key], childActiveRefs, ref || currentRef);
      }
    }

    ancestors.delete(node);
    return clone;
  }

  return walk(root);
}
