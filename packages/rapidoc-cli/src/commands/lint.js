import fs from "node:fs";
import path from "node:path";
import pkg from "../../package.json" with { type: "json" };
import { loadPortal } from "../lib/engines.js";
import { ProblemError } from "../lib/errors.js";
import { info, setQuiet, success, warn } from "../lib/output.js";

/*
 * rapidoc lint [spec|dir]: what a spec needs to make a good portal, beyond being valid OpenAPI. One spec
 * (a file or URL), or every spec of the portal in a folder (its rapidoc.config.*), or every OpenAPI file
 * found in a folder without one. validate's check runs first; an invalid spec is not linted further.
 * Severities: --rule name=severity › lint: in rapidoc.config.* (per API under lint.apis) › the defaults.
 */

const isUrl = (target) => /^https?:\/\//i.test(target);

export default {
  name: "lint",
  usage: "lint [spec|dir]",
  summary:
    "Checks what a spec needs to make a good portal: operationIds, summaries, examples, security",
  description:
    "Runs validate's check, then rules for what the portal, Try, the mock server and MCP tools need:\noperationIds (stable URLs), summaries, declared tags, success responses, security on write\noperations, examples on bodies, no unused components. Same output as validate, with the rule name.\nSeverities: --rule name=error|warn|off, or lint.rules / lint.apis.<id> in rapidoc.config.*.",
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
    rule: {
      type: "string",
      multiple: true,
      value: "name=severity",
      description: "Set a rule's severity (error, warn, off); repeat for more. See --rules",
    },
    rules: { type: "boolean", description: "List the rules, their defaults and what they check" },
    remote: {
      type: "boolean",
      description: "Also fetch and lint remote specs and remote $refs (skipped by default)",
    },
  },
  examples: [
    "rapidoc lint openapi.yaml",
    "rapidoc lint",
    "rapidoc lint openapi.yaml --rule operation-description=warn --rule no-unused-components=off",
    "rapidoc lint --strict --format sarif > rapidoc.sarif",
  ],

  async run({ values, positionals }) {
    const { format, strict, remote } = values;
    const { RULES } = await import("../lint/rules/index.js");
    if (values.rules) {
      const width = Math.max(...RULES.map((rule) => rule.name.length)) + 2;
      info("\nRules (default severity):\n");
      for (const rule of RULES)
        info(`  ${rule.name.padEnd(width)}${rule.default.padEnd(7)}${rule.description}`);
      info("");
      return;
    }

    const pretty = format === "pretty";
    if (!pretty) setQuiet(true);
    const { parseRuleOptions, readLintConfig, severitiesFor } = await import("../lint/config.js");
    const { lintSpec } = await import("../lint/run.js");
    const { printItem, counts, toJson, toSarif } = await import("../validate/report.js");
    const overrides = parseRuleOptions(values.rule);

    const items = [];
    const done = (item) => {
      items.push(item);
      if (pretty) printItem(item, { ok: "No problems" });
    };
    const lintOne = async (id, location, severities) => {
      const result = await lintSpec(location, { remote, severities });
      const problems = [...result.problems];
      for (const skipped of result.skipped)
        problems.push({
          severity: "warning",
          rule: "ref",
          message: `$ref to ${skipped} not checked (remote; use --remote)`,
          location,
        });
      done({ kind: "spec", id, location, problems, linted: result.linted });
    };

    const target = positionals[0] || ".";
    if (isUrl(target)) {
      info(`\nLinting ${target}...`);
      await lintOne(target, target, severitiesFor({ overrides }));
    } else {
      const fullPath = path.resolve(target);
      if (!fs.existsSync(fullPath)) throw new ProblemError(`File not found: ${fullPath}`);
      // A single file takes the settings of the portal it's run from (the current folder).
      const dir = fs.statSync(fullPath).isFile() ? process.cwd() : fullPath;
      const { config, warning } = await readLintConfig(dir);
      if (warning) warn(warning);

      if (fs.statSync(fullPath).isFile()) {
        info(`\nLinting ${path.basename(fullPath)}...`);
        await lintOne(path.basename(fullPath), fullPath, severitiesFor({ config, overrides }));
      } else if (
        fs
          .readdirSync(fullPath)
          .some((name) => /^rapidoc\.config\.(ya?ml|json|m?js|ts)$/.test(name))
      ) {
        const portal = await loadPortal("lint");
        let loaded;
        try {
          loaded = (await portal.loadConfig(fullPath)).config;
        } catch (err) {
          throw new ProblemError(err.message);
        }
        info(`\nLinting the specs in ${fullPath}...`);
        for (const api of loaded.apis || []) {
          const severities = severitiesFor({ config, api: api.id, overrides });
          for (const version of api.versions) {
            const id = api.versioned ? `${api.id} ${version.version}` : api.id;
            if (version.isRemote && !remote)
              done({ kind: "spec", id, location: version.spec, skipped: true, problems: [] });
            else await lintOne(id, version.isRemote ? version.spec : version.fullPath, severities);
          }
        }
      } else {
        const { findOpenApiSpecs } = await import("create-rapidoc/scaffold");
        const files = findOpenApiSpecs(fullPath);
        if (!files.length) throw new ProblemError(`No OpenAPI files found in ${fullPath}`);
        info(`\nLinting ${files.length} spec(s) in ${fullPath}...`);
        for (const file of files)
          await lintOne(file, path.join(fullPath, file), severitiesFor({ config, overrides }));
      }
    }

    const { errors, warnings } = counts(items);
    const specs = items.filter((item) => item.kind === "spec" && !item.skipped).length;
    const failed = errors > 0 || (strict && warnings > 0);
    if (format === "json")
      process.stdout.write(`${JSON.stringify(toJson(items, { strict }), null, 2)}\n`);
    if (format === "sarif") {
      const rules = Object.fromEntries(RULES.map((rule) => [rule.name, rule.description]));
      process.stdout.write(
        `${JSON.stringify(toSarif(items, { version: pkg.version, tool: "rapidoc lint", rules }), null, 2)}\n`,
      );
    }

    const summary = `${specs} spec(s) linted: ${errors} error(s), ${warnings} warning(s)`;
    if (!failed) {
      success(`${summary}.\n`, "\n");
      return;
    }
    if (!pretty) {
      process.exitCode = 1;
      return;
    }
    throw new ProblemError(errors ? `${summary}.` : `${summary}; --strict fails on warnings.`);
  },
};
