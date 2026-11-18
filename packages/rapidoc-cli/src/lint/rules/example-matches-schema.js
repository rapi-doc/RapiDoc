import { namedExampleMap } from "../examples.js";

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** @type {import("../types.js").Rule} */
export default {
  name: "example-matches-schema",
  description:
    "Request and response examples fit their schema: Try sends them and the mock server answers with them, so a wrong one teaches a wrong shape. Needs @rapidoc/mock, which reads the schemas.",
  default: "warn",
  needs: "mock",
  on: ["mediaType"],
  check: (media, { doc, v2, pointer, resolve, mock }) => {
    if (v2 || !mock || !isObject(media.schema)) return [];
    const where = `#/${pointer.join("/")}/schema`;
    const findings = [];
    const test = (value, at, label) => {
      const problem = mock.exampleError(doc, media.schema, value, where);
      if (problem)
        findings.push({ pointer: at, message: `${label} does not fit the schema: ${problem}` });
    };
    // A map of named examples under `example` is example-named-map's finding, not a schema mismatch
    if (media.example !== undefined && !namedExampleMap(media, resolve)) {
      test(media.example, [...pointer, "example"], "example");
    }
    for (const [name, raw] of Object.entries(isObject(media.examples) ? media.examples : {})) {
      const example = resolve(raw);
      if (isObject(example) && example.value !== undefined) {
        test(example.value, [...pointer, "examples", name], `example "${name}"`);
      }
    }
    return findings;
  },
};
