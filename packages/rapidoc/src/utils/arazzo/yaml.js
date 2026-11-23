/**
 * The YAML reader for Arazzo documents, on js-yaml: YAML 1.2 core values (no dates, `yes`/`no` are
 * strings) plus merge keys (`<<`). It is half the size of the `yaml` package, which matters for
 * `rapidoc/flow` (`<rapi-flow>`): that bundle reads no OpenAPI spec itself, so this is its only YAML
 * code. OpenAPI specs are read with `yaml` (spec-loader.js, spec-parser.js), which their parser,
 * @scalar/openapi-parser, bundles anyway: a second YAML library there would only add size.
 *
 * It is forgiving where real specs are sloppy, as a reader of other people's files has to be:
 * - a tag it does not know (`!Ref`, `!!binary`) leaves the value as written, a plain string, list or map;
 * - raw control characters, which YAML does not allow, are dropped and the text is read again;
 * - an empty document is `null`.
 */
import { CORE_SCHEMA, load, mapTag, mergeTag, seqTag, strTag } from "js-yaml";

const known = CORE_SCHEMA.withTags([mergeTag]);
const schema = Object.create(known);
schema.lookupScalarTag = (tag) => known.lookupScalarTag(tag) ?? strTag;
schema.lookupSequenceTag = (tag) => known.lookupSequenceTag(tag) ?? seqTag;
schema.lookupMappingTag = (tag) => known.lookupMappingTag(tag) ?? mapTag;

/** What YAML calls non-printable: C0 and C1 controls other than tab, line feed, carriage return and NEL */
// oxlint-disable-next-line no-control-regex -- these characters are the point
const NON_PRINTABLE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u0084\u0086-\u009f￾￿]/g;

/**
 * Parses YAML (or JSON, which is YAML) text.
 *
 * @param {string} text
 * @returns {unknown} The document's value; `null` for an empty document
 * @throws {Error} When the text is not valid YAML
 */
export function parseYaml(text) {
  const source = String(text);
  if (!/\S/.test(source)) return null;
  let value;
  try {
    value = load(source, { schema });
  } catch (error) {
    const cleaned = source.replace(NON_PRINTABLE, "");
    if (cleaned === source) {
      // Only comments: no document to read
      if (/^(\s*(#[^\n]*)?\n?)*$/.test(source)) return null;
      throw error;
    }
    value = load(cleaned, { schema });
  }
  return value === undefined ? null : value;
}
