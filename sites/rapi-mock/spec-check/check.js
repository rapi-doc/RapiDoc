/**
 * The spec check of the Rapi Mock site, as one function: `checkSpec(text)` parses a spec, validates it, lints it
 * with every rule `rapidoc lint --stateful` runs, and starts the stateful mock on it, all in the page. Nothing is
 * sent anywhere.
 *
 * The code is the CLI's and the mock's own, bundled by relative path (`vite.config.mjs` here): the validator and
 * the lint rules of `packages/rapidoc-cli`, and `createBrowserMock` of `packages/rapidoc-mock`. This file only
 * strings them together the way `rapidoc lint` does (`packages/rapidoc-cli/src/lint/run.js`): an invalid spec is
 * not linted further.
 */
import { LineCounter, parseDocument } from "yaml";
import { validate } from "@scalar/openapi-validator";
import { severitiesFor } from "../../../packages/rapidoc-cli/src/lint/config.js";
import { RULES } from "../../../packages/rapidoc-cli/src/lint/rules/index.js";
import { summarize } from "../../../packages/rapidoc-cli/src/lint/summary.js";
import { traverse } from "../../../packages/rapidoc-cli/src/lint/traverse.js";
import { decodePointer, position } from "../../../packages/rapidoc-cli/src/validate/bundle.js";
import { createBrowserMock } from "../../../packages/rapidoc-mock/src/browser.js";
import { exampleError } from "../../../packages/rapidoc-mock/src/examples.js";
import { configFor } from "../../../packages/rapidoc-mock/src/stateful/config.js";
import {
  statefulFindings,
  statefulReport,
} from "../../../packages/rapidoc-mock/src/stateful/findings.js";

/** What the lint rules that read schemas the way the mock does get (`needs: "mock"`). */
const mockForLint = { statefulFindings, statefulReport, configFor, exampleError };

const segmentsOf = (path) =>
  Array.isArray(path)
    ? path.map(String)
    : typeof path === "string" && path
      ? decodePointer(`#${path}`)
      : [];

/**
 * @param {string} text - A spec as YAML or JSON
 * @param {{ id?: string }} [options] - `id`: the API's id, as the mock would name it after its file
 * @returns {Promise<{ title?: string, version?: string, problems: object[], linted: boolean, summary?: object,
 *   mock?: object, mockError?: string }>} `problems`: `{ severity, rule, message, pointer, line, column }` in
 *   file order; `linted` is false when the spec is not valid OpenAPI (the problems are then the validator's);
 *   `summary`: the lint result by category, as `summarize` of the CLI's `lint/summary.js` returns it;
 *   `mock`: what createBrowserMock returns, or `mockError` why the mock could not start
 */
export async function checkSpec(text, { id = "api" } = {}) {
  const lineCounter = new LineCounter();
  const parsed = parseDocument(text, { lineCounter, prettyErrors: true, uniqueKeys: false });
  if (parsed.errors.length) {
    const [first] = parsed.errors;
    const { line, col } = first.linePos?.[0] ?? { line: 1, col: 1 };
    const message = first.message.split("\n")[0];
    return {
      problems: [{ severity: "error", rule: "syntax", message, pointer: [], line, column: col }],
      linted: false,
      mockError: "The text is not valid YAML or JSON.",
    };
  }
  const doc = parsed.toJS({ maxAliasCount: -1 });
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    return {
      problems: [
        {
          severity: "error",
          rule: "syntax",
          message: "The text is not an OpenAPI document.",
          pointer: [],
          line: 1,
          column: 1,
        },
      ],
      linted: false,
      mockError: "The text is not an OpenAPI document.",
    };
  }
  const file = { doc: parsed, lineCounter };
  const at = (pointer) => ({ pointer, ...position(file, pointer) });
  const inFileOrder = (list) => list.sort((a, b) => a.line - b.line || a.column - b.column);

  const result = await validate(doc, { checkPathParameters: false });
  const problems = (result.errors ?? []).map((error) => ({
    severity: "error",
    rule: "openapi",
    message: error.message,
    ...at(segmentsOf(error.path)),
  }));
  let linted = false;
  let summary;
  if (!problems.length) {
    linted = true;
    const tally = new Map();
    const severities = severitiesFor({ stateful: true });
    const swagger = typeof doc.swagger === "string";
    const active = RULES.filter(
      (rule) => severities[rule.name] !== "off" && !(swagger && rule.name.startsWith("stateful-")),
    );
    for (const finding of traverse(doc, active, { mock: mockForLint }, tally)) {
      problems.push({
        severity: severities[finding.rule] === "error" ? "error" : "warning",
        rule: finding.rule,
        message: finding.message,
        ...at(finding.pointer),
      });
    }
    summary = summarize(active, problems, tally);
  }

  const checked = {
    title: doc.info?.title,
    version: doc.openapi || (doc.swagger && `Swagger ${doc.swagger}`),
    problems: inFileOrder(problems),
    linted,
    summary,
  };
  try {
    checked.mock = await createBrowserMock(doc, { id });
  } catch (err) {
    checked.mockError = err.message.split("\n")[0];
  }
  return checked;
}
