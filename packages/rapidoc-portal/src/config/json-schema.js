import { z } from "zod";
import { RapidocConfigSchema } from "./schema.js";

/**
 * JSON Schema of rapidoc.config.yaml, for editors. Cross-field rules (one kind per navigation item)
 * are checked by the loader only.
 */
export function configJsonSchema() {
  return {
    ...z.toJSONSchema(RapidocConfigSchema, { io: "input", unrepresentable: "any" }),
    $id: "https://rapidocweb.com/schema/rapidoc-config.json",
    title: "RapiDoc Portal configuration (rapidoc.config.yaml)",
  };
}
