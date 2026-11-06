import path from "node:path";
import { stringify } from "yaml";

/*
 * The bundled document as text. YAML keeps the keys in the order the spec had them; no anchors or
 * aliases are written even where the same object appears twice (tools that read OpenAPI rarely take
 * them). JSON is indented with two spaces.
 */

/** "yaml" or "json": from --format, else from the output file's extension, else yaml. */
export function formatFor(format, output) {
  if (format) return format;
  return output && path.extname(output).toLowerCase() === ".json" ? "json" : "yaml";
}

/** @param {unknown} value  @param {"yaml" | "json"} format */
export function serialize(value, format) {
  if (format === "json") return `${JSON.stringify(value, null, 2)}\n`;
  return stringify(value, { aliasDuplicateObjects: false, lineWidth: 0 });
}
