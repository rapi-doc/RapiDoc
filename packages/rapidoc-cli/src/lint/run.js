import { bundleSpec, locate, position, SpecSyntaxError } from "../validate/bundle.js";
import { checkSpec } from "../validate/check.js";
import { RULES } from "./rules/index.js";
import { traverse } from "./traverse.js";

/*
 * Lints one spec: validate's strict check first (an invalid spec is not linted further, so one CI step
 * covers both), then every rule whose severity isn't off, over one traversal. Each finding comes back
 * as a problem of validate's shape, with the file, line and column it traces back to.
 */

/** @import { Severity } from "./types.js" */

/**
 * @param {string} location  file path or URL
 * @param {{ remote?: boolean, severities: Record<string, Severity> }} options
 * @returns {Promise<{ location, problems, skipped: string[], linted: boolean }>}
 */
export async function lintSpec(location, { remote = false, severities }) {
  let bundle;
  try {
    bundle = await bundleSpec(location, { remote });
  } catch (err) {
    if (!(err instanceof SpecSyntaxError)) throw err;
    const checked = await checkSpec(location, { remote }); // reports the syntax error
    return { ...checked, linted: false };
  }
  const checked = await checkSpec(location, { remote, bundle });
  if (checked.problems.length) return { ...checked, linted: false };

  const active = RULES.filter((rule) => severities[rule.name] !== "off");
  const problems = traverse(bundle.value, active).map((finding) => {
    const at = locate(bundle, finding.pointer);
    const { line, column } = position(bundle.files.get(at.location), at.pointer);
    return {
      severity: severities[finding.rule] === "error" ? "error" : "warning",
      rule: finding.rule,
      message: finding.message,
      location: at.location,
      pointer: at.pointer,
      line,
      column,
    };
  });
  // In file order, so the output reads top to bottom.
  problems.sort(
    (a, b) => a.location.localeCompare(b.location) || a.line - b.line || a.column - b.column,
  );
  return { location, problems, skipped: bundle.skipped, linted: true };
}
