import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { buildDocDefinition } from "../../src/core/index.js";
import { loadSpec } from "../../src/load-spec.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const specsDir = path.join(here, "../fixtures/specs");
export const baselineDir = path.join(here, "../fixtures/baseline");

/** The option sets every fixture spec is rendered with. */
export const VARIANTS = {
  default: {},
  table: { pdfSchemaStyle: "table" },
  full: {
    includeExample: true,
    includeApiList: true,
    pdfSortTags: false,
    pdfTitle: "Baseline",
    pdfFooterText: "footer",
    pdfPrimaryColor: "#123456",
    pdfAlternateColor: "#654321",
  },
  minimal: { includeInfo: false, includeToc: false, includeSecurity: false },
};

export function readSpec(file) {
  const text = fs.readFileSync(path.join(specsDir, file), "utf8");
  return file.endsWith(".json") ? JSON.parse(text) : parseYaml(text);
}

/**
 * A document definition as JSON text that can be compared and stored: the footer by what it returns
 * for page 3 of 7, other functions (table layouts) as "[fn]", `undefined` as "[undefined]".
 */
export function serializeDefinition(definition) {
  const def = { ...definition };
  if (typeof def.footer === "function") def.footer = { "[fn footer(3,7)]": def.footer(3, 7) };
  return JSON.stringify(def, (key, value) => {
    if (typeof value === "function") return "[fn]";
    if (value === undefined) return "[undefined]";
    return value;
  });
}

/** The serialized definition of a fixture spec under one option set. */
export async function definitionOf(specFile, options) {
  const spec = await loadSpec(readSpec(specFile));
  return serializeDefinition(buildDocDefinition(spec, options));
}
