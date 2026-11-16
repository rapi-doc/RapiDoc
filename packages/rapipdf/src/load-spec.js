import { dereference, load, upgrade } from "@scalar/openapi-parser";
import { parse as parseYaml } from "yaml";
import { breakCircularRefs } from "../../rapidoc/src/utils/spec-loader.js";

/**
 * The spec as one OpenAPI 3.x document with every $ref replaced by what it points to (a schema inside
 * itself stays a `{ $ref }`). `input` is a location the `plugins` can read (a
 * URL in the browser, a file path or URL in Node), the text of a spec (JSON or YAML) or a spec
 * object. Swagger 2.0 is converted to OpenAPI 3. Throws when the spec can't be loaded.
 *
 * @param {string | object} input
 * @param {{ plugins?: import("@scalar/openapi-parser").LoadPlugin[], isLocation?: (text: string) => boolean }} [options]
 *   `plugins` fetch or read the spec and the files its $refs reach; `isLocation` tells a location
 *   from spec text (default: one line that doesn't start like JSON).
 */
export async function loadSpec(input, { plugins = [], isLocation = looksLikeLocation } = {}) {
  let source = input;
  if (typeof input === "string" && !isLocation(input)) {
    try {
      source = JSON.parse(input);
    } catch {
      source = parseYaml(input, { maxAliasCount: -1, merge: true });
    }
  }

  const loaded = await load(source, { plugins });
  if (!loaded.specification || typeof loaded.specification !== "object") {
    throw new Error(loaded.errors?.[0]?.message || "The spec could not be loaded");
  }

  if (!loaded.specification.openapi && !loaded.specification.swagger) {
    throw new Error('Not an OpenAPI or Swagger document: it has no "openapi" or "swagger" field');
  }

  let { filesystem } = loaded;
  if (String(loaded.specification.swagger ?? "").startsWith("2")) {
    // The converted document takes the entry file's place, so $refs to the spec's other files still
    // resolve (dereferencing the converted document on its own would not find them).
    const { specification } = upgrade(filesystem);
    filesystem = filesystem.map((file) => (file.isEntrypoint ? { ...file, specification } : file));
  }

  const { schema } = await dereference(filesystem, {
    onDereference: ({ schema: dereferenced, ref }) => {
      dereferenced["x-ref"] = ref;
    },
  });
  return breakCircularRefs(schema);
}

function looksLikeLocation(text) {
  const trimmed = text.trim();
  return !trimmed.startsWith("{") && !trimmed.startsWith("[") && !trimmed.includes("\n");
}
