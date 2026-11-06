import path from "node:path";
import { isUrl } from "./bundle.js";
import { encodePointer } from "./bundle.js";
import { error, icon, info, success, warn } from "../lib/output.js";

/*
 * The results of `rapidoc validate`, as one list of checked items:
 *   { kind: "spec" | "workflows", id, location, skipped?: true, problems: [ { severity, rule, message,
 *     location?, pointer?, line?, column? } ] }
 * and three ways to print them: pretty (the terminal), json (scripts) and sarif (GitHub code scanning).
 */

/** A location as printed: a path relative to the current folder (forward slashes) or a URL. */
export const displayPath = (location) =>
  isUrl(location)
    ? location
    : path.relative(process.cwd(), location).split(path.sep).join("/") || ".";

const where = (problem) =>
  problem.location
    ? `${displayPath(problem.location)}${problem.line ? `:${problem.line}:${problem.column}` : ""}`
    : "";

export function counts(items) {
  const all = items.flatMap((item) => item.problems);
  return {
    errors: all.filter((p) => p.severity === "error").length,
    warnings: all.filter((p) => p.severity === "warning").length,
  };
}

/** Prints one checked item as soon as it's done (pretty format). `ok` is the line for a clean spec. */
export function printItem(item, { ok } = {}) {
  info(`\n${icon("🔍")}${item.id}: ${displayPath(item.location)}`);
  if (item.skipped) {
    info(`   ${icon("⏭️ ")}remote, skipped (use --remote to check it)`);
    return;
  }
  const errors = item.problems.filter((p) => p.severity === "error");
  if (errors.length) {
    error(`${errors.length} error(s):`, "   ");
    for (const problem of errors) process.stderr.write(`      ${describe(problem)}\n`);
  } else if (ok) {
    success(ok, "   ");
  } else if (item.kind === "spec") {
    success("Valid OpenAPI", "   ");
  } else {
    success("Workflows resolve against the portal's APIs", "   ");
  }
  for (const problem of item.problems.filter((p) => p.severity === "warning"))
    warn(describe(problem), "   ");
}

/** "file:line:col  message  [rule]  (#/pointer)"; the parts a problem has. */
function describe(problem) {
  const at = problem.location && problem.line ? `${where(problem)}  ` : "";
  const rule = LINT_RULE.test(problem.rule) ? `  [${problem.rule}]` : "";
  const pointer = problem.pointer?.length ? `  (${encodePointer(problem.pointer)})` : "";
  return `${at}${problem.message}${rule}${pointer}`;
}

// validate's own rule ids (syntax, openapi, ref, portal, workflow) are not shown; lint's are.
const LINT_RULE = /-/;

export function toJson(items, { strict }) {
  const { errors, warnings } = counts(items);
  return {
    valid: errors === 0 && (!strict || warnings === 0),
    errors,
    warnings,
    items: items.map((item) => ({
      kind: item.kind,
      id: item.id,
      location: displayPath(item.location),
      ...(item.skipped && { skipped: true }),
      problems: item.problems.map((problem) => ({
        severity: problem.severity,
        rule: problem.rule,
        message: problem.message,
        ...(problem.location && { location: displayPath(problem.location) }),
        ...(problem.line && { line: problem.line, column: problem.column }),
        ...(problem.pointer && { pointer: encodePointer(problem.pointer) }),
      })),
    })),
  };
}

const RULES = {
  syntax: "The file is not valid YAML or JSON.",
  openapi:
    "The document must follow the OpenAPI Specification (required fields, types, path parameters).",
  ref: "Every $ref must point to something that exists.",
  portal: "Links and references the portal checks (operation ids, anchors).",
  workflow: "Arazzo workflow steps must resolve against the portal's APIs.",
};

/** SARIF 2.1.0, for GitHub code scanning (github/codeql-action/upload-sarif). `rules` adds to validate's. */
export function toSarif(items, { version, tool = "rapidoc validate", rules = {} }) {
  const results = items.flatMap((item) =>
    item.problems.map((problem) => {
      const location = problem.location ?? item.location;
      const region = problem.line
        ? { region: { startLine: problem.line, startColumn: problem.column } }
        : {};
      return {
        ruleId: problem.rule,
        level: problem.severity,
        message: { text: problem.message },
        locations: [
          {
            physicalLocation: { artifactLocation: { uri: displayPath(location) }, ...region },
            ...(problem.pointer?.length && {
              logicalLocations: [{ fullyQualifiedName: encodePointer(problem.pointer) }],
            }),
          },
        ],
      };
    }),
  );
  return {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: tool,
            version,
            informationUri: "https://rapidocui.com",
            rules: Object.entries({ ...RULES, ...rules }).map(([id, text]) => ({
              id,
              shortDescription: { text },
            })),
          },
        },
        results,
      },
    ],
  };
}
