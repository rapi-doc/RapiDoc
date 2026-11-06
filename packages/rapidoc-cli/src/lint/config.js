import fs from "node:fs";
import path from "node:path";
import { UsageError, ProblemError } from "../lib/errors.js";
import { closest } from "../lib/suggest.js";
import { RULE_NAMES, RULES } from "./rules/index.js";

/*
 * Which rules run and how hard they fail. Most specific wins: --rule name=severity › the API's entry
 * under lint.apis in rapidoc.config.* › lint.rules there › each rule's default.
 *
 *   lint:
 *     rules: { operation-description: warn, no-unused-components: off }
 *     apis: { legacy: { operation-operationId: off } }
 *
 * The config is read as a plain file (yaml or json) so that `rapidoc lint` needs no portal engine; a
 * rapidoc.config.js/.mjs is imported; a .ts file can't be read here and is reported.
 */

/** @import { Severity } from "./types.js" */

const SEVERITIES = ["error", "warn", "off"];

/** @typedef {{ rules?: Record<string, Severity>, apis?: Record<string, Record<string, Severity>> }} LintConfig */

function checkRuleName(name, where) {
  if (RULE_NAMES.includes(name)) return;
  const suggestion = closest(name, RULE_NAMES);
  throw new UsageError(
    `${where}: unknown rule "${name}".${suggestion ? ` Did you mean ${suggestion}?` : ""}`,
    { command: "lint" },
  );
}

function checkSeverity(name, severity, where) {
  if (SEVERITIES.includes(severity)) return;
  throw new UsageError(
    `${where}: rule ${name} must be one of ${SEVERITIES.join(", ")}, got "${severity}"`,
    { command: "lint" },
  );
}

/** `--rule name=severity` values → { name: severity }. */
export function parseRuleOptions(values = []) {
  const out = {};
  for (const value of values) {
    const [name, severity, ...rest] = String(value).split("=");
    if (!severity || rest.length)
      throw new UsageError(`--rule needs <name>=<error|warn|off>, got "${value}"`, {
        command: "lint",
      });
    checkRuleName(name, "--rule");
    checkSeverity(name, severity, "--rule");
    out[name] = severity;
  }
  return out;
}

/**
 * The `lint:` section of the portal config in `dir`, or {} when there is none.
 * @returns {Promise<{ config: LintConfig, file?: string, warning?: string }>}
 */
export async function readLintConfig(dir) {
  const names = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const name = names.find((entry) => /^rapidoc\.config\.(ya?ml|json|m?js|ts)$/.test(entry));
  if (!name) return { config: {} };
  const file = path.join(dir, name);
  let raw;
  if (/\.ya?ml$/.test(name)) {
    const { parse } = await import("yaml");
    raw = parse(fs.readFileSync(file, "utf8"));
  } else if (name.endsWith(".json")) {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } else if (name.endsWith(".ts")) {
    return {
      config: {},
      file,
      warning: `${name}: lint settings in a .ts config aren't read; pass --rule instead`,
    };
  } else {
    raw = (await import(file)).default;
  }
  const config = raw?.lint ?? {};
  if (typeof config !== "object" || config === null || Array.isArray(config))
    throw new ProblemError(`${name}: lint must be a map (rules:, apis:)`);
  for (const [ruleName, severity] of Object.entries(config.rules ?? {})) {
    checkRuleName(ruleName, `${name}: lint.rules`);
    checkSeverity(ruleName, severity, `${name}: lint.rules`);
  }
  for (const [api, rules] of Object.entries(config.apis ?? {}))
    for (const [ruleName, severity] of Object.entries(rules ?? {})) {
      checkRuleName(ruleName, `${name}: lint.apis.${api}`);
      checkSeverity(ruleName, severity, `${name}: lint.apis.${api}`);
    }
  return { config, file };
}

/**
 * The severity of every rule for one spec.
 * @param {{ config?: LintConfig, api?: string, overrides?: Record<string, Severity> }} layers
 * @returns {Record<string, Severity>}
 */
export function severitiesFor({ config = {}, api, overrides = {} } = {}) {
  return Object.fromEntries(
    RULES.map((rule) => [
      rule.name,
      overrides[rule.name] ??
        (api && config.apis?.[api]?.[rule.name]) ??
        config.rules?.[rule.name] ??
        rule.default,
    ]),
  );
}
