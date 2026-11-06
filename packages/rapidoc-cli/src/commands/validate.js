import fs from "node:fs";
import path from "node:path";
import pkg from "../../package.json" with { type: "json" };
import { loadPortal, tryLoadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { info, setQuiet, success } from "../lib/output.js";

/*
 * rapidoc validate [spec|dir]: one spec (a file or URL), or every spec and workflow file of the portal in a
 * folder. Specs are checked strictly against the OpenAPI Specification (src/validate/check.js), with
 * file:line:col for each error, files reached through $ref included. With the portal engine installed,
 * its link checks add warnings. Exit 1 on errors, or on warnings with --strict.
 */

// Not imported from validate/bundle.js: that loads yaml, and every command module is loaded for help.
const isUrl = (target) => /^https?:\/\//i.test(target);

const warning = (message, rule, location) => ({ severity: "warning", rule, message, location });

async function checkSpecItem(id, location, { remote, portal }) {
  const { checkSpec } = await import("../validate/check.js");
  const result = await checkSpec(location, { remote });
  const problems = [...result.problems];
  if (portal && !isUrl(location)) {
    for (const message of portal.checkApiSpec({ id, fullPath: location }) ?? [])
      problems.push(warning(message, "portal", location));
  }
  for (const skipped of result.skipped)
    problems.push(
      warning(`$ref to ${skipped} not checked (remote; use --remote)`, "ref", location),
    );
  return { kind: "spec", id, location, problems };
}

export default {
  name: "validate",
  usage: "validate [spec|dir]",
  summary:
    "Validates one OpenAPI 2.0 / 3.x spec, or every spec in a portal's apis: (default: current folder)",
  description:
    "Checks against the OpenAPI Specification: required fields, types, path parameters, $refs, including\nfiles reached through $ref. Errors show file:line:col. A portal folder also checks its workflow files\nand, with @rapidoc/portal installed, links between the docs and the specs (warnings).",
  positionals: { name: "spec|dir", max: 1 },
  options: {
    format: {
      type: "string",
      value: "format",
      choices: ["pretty", "json", "sarif"],
      default: "pretty",
      description: "Output format: json for scripts, sarif for GitHub code scanning",
    },
    strict: { type: "boolean", description: "Fail on warnings too" },
    remote: {
      type: "boolean",
      description: "Also fetch and check remote specs and remote $refs (skipped by default)",
    },
  },
  examples: [
    "rapidoc validate",
    "rapidoc validate ./specs/orders-api.yaml",
    "rapidoc validate https://example.com/openapi.json",
    "rapidoc validate --strict --format sarif > rapidoc.sarif",
  ],

  async run({ values, positionals }) {
    const { format, strict, remote } = values;
    const pretty = format === "pretty";
    // json and sarif print one document on stdout; nothing else goes there.
    if (!pretty) setQuiet(true);
    const { printItem, counts, toJson, toSarif } = await import("../validate/report.js");
    const items = [];
    const done = (item) => {
      items.push(item);
      if (pretty) printItem(item);
    };

    const target = positionals[0] || ".";
    if (isUrl(target)) {
      info(`\nValidating ${target}...`);
      done(await checkSpecItem(target, target, { remote: true }));
    } else {
      const fullPath = path.resolve(target);
      if (!fs.existsSync(fullPath)) throw new ProblemError(`File not found: ${fullPath}`);

      if (fs.statSync(fullPath).isFile()) {
        info(`\nValidating ${path.basename(fullPath)}...`);
        const portal = await tryLoadPortal();
        done(await checkSpecItem(path.basename(fullPath), fullPath, { remote, portal }));
      } else {
        const portal = await loadPortal("validate");
        let config;
        try {
          ({ config } = await portal.loadConfig(fullPath));
        } catch (err) {
          throw new ProblemError(err.message);
        }
        info(`\nValidating the specs in ${fullPath}...`);
        for (const api of config.apis || []) {
          for (const version of api.versions) {
            const id = api.versioned ? `${api.id} ${version.version}` : api.id;
            if (version.isRemote && !remote) {
              done({ kind: "spec", id, location: version.spec, skipped: true, problems: [] });
            } else {
              const location = version.isRemote ? version.spec : version.fullPath;
              done(await checkSpecItem(id, location, { remote, portal }));
            }
          }
        }
        for (const workflow of config.workflows || []) {
          const problems = portal
            .checkWorkflow(workflow, config.apis)
            .map((message) => warning(message, "workflow", workflow.fullPath));
          done({ kind: "workflows", id: workflow.id, location: workflow.fullPath, problems });
        }
      }
    }

    const { errors, warnings } = counts(items);
    const specs = items.filter((item) => item.kind === "spec" && !item.skipped).length;
    const failed = errors > 0 || (strict && warnings > 0);
    if (format === "json")
      process.stdout.write(`${JSON.stringify(toJson(items, { strict }), null, 2)}\n`);
    if (format === "sarif")
      process.stdout.write(
        `${JSON.stringify(toSarif(items, { version: pkg.version }), null, 2)}\n`,
      );

    const summary = `${specs} spec(s) checked: ${errors} error(s), ${warnings} warning(s)`;
    if (!failed) {
      success(`${summary}.\n`, "\n");
      return;
    }
    // In json and sarif the report already says what failed; scripts read the exit code.
    if (!pretty) {
      process.exitCode = 1;
      return;
    }
    throw new ProblemError(errors ? `${summary}.` : `${summary}; --strict fails on warnings.`);
  },
};
