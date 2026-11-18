/*
 * A lint result as a summary: the rules in categories, each with its errors and warnings and, where a rule looks
 * at one thing at a time (an operation, a body, a tag), how many of those passed. "1347 warnings" says little;
 * "Examples: 61% of 2,140 bodies have one" says where the spec stands.
 *
 * The Rapi Mock site's spec check shows it. It reads no file and prints nothing: plain data in, plain data out.
 */

/** @import { Rule } from "./types.js" */

/** Every rule belongs to one category, in the order a summary lists them. */
export const CATEGORIES = [
  {
    id: "naming",
    title: "Names and URLs",
    about: "operationIds and paths, which make stable links, tool names and client methods",
    rules: [
      "operation-operationId",
      "operation-operationId-unique",
      "operation-operationId-url-safe",
      "path-kebab-case",
    ],
  },
  {
    id: "documentation",
    title: "Documentation",
    about: "summaries, descriptions and tags, which readers and AI agents rely on",
    rules: [
      "operation-summary",
      "operation-description",
      "operation-tag-defined",
      "tag-description",
      "info-contact",
      "info-license",
    ],
  },
  {
    id: "responses",
    title: "Responses",
    about: "a documented success and a documented failure for every operation",
    rules: ["operation-2xx-response", "operation-4xx-response"],
  },
  {
    id: "examples",
    title: "Examples",
    about: "examples on request and response bodies, which Try and the mock answer with",
    rules: ["media-example", "example-named-map", "example-matches-schema"],
  },
  {
    id: "security",
    title: "Security",
    about: "who may call what",
    rules: ["security-defined", "security-scheme-defined"],
  },
  {
    id: "housekeeping",
    title: "Housekeeping",
    about: "leftovers: unused components, placeholder servers",
    rules: ["no-unused-components", "no-server-example-com"],
  },
  {
    id: "state",
    title: "Mock state",
    about: "what the stateful mock had to assume or could not map",
    rules: [
      "stateful-resource-key",
      "stateful-list-filter",
      "stateful-write-unmapped",
      "stateful-reference-target",
      "stateful-response-unnamed",
      "stateful-operation-assumed",
      "stateful-relation-assumed",
    ],
  },
];

/** A rule that looks at the whole document at once has no "how many passed". */
const countsThings = (rule) => !rule.on.includes("document");

/**
 * @param {Rule[]} rules - The rules that ran
 * @param {{ rule: string, severity: "error" | "warning" }[]} problems - What they found
 * @param {Map<string, { checked: number, failed: number }>} tally - As traverse filled it
 * @returns {{ errors: number, warnings: number, checked: number, passed: number, categories: object[] }}
 *   `checked` and `passed` count the things looked at one at a time, over every rule that does; a category
 *   or rule without such a count has neither. Categories none of whose rules ran are left out.
 */
export function summarize(rules, problems, tally) {
  const ran = new Map(rules.map((rule) => [rule.name, rule]));
  const found = new Map();
  for (const { rule, severity } of problems) {
    const count = found.get(rule) ?? found.set(rule, { errors: 0, warnings: 0 }).get(rule);
    count[severity === "error" ? "errors" : "warnings"] += 1;
  }
  const add = (total, one) => {
    total.errors += one.errors;
    total.warnings += one.warnings;
    if (one.checked !== undefined) {
      total.checked = (total.checked ?? 0) + one.checked;
      total.passed = (total.passed ?? 0) + one.passed;
    }
    return total;
  };
  const categories = [];
  for (const category of CATEGORIES) {
    const list = category.rules
      .filter((name) => ran.has(name))
      .map((name) => {
        const rule = ran.get(name);
        const one = {
          name,
          description: rule.description,
          errors: 0,
          warnings: 0,
          ...found.get(name),
        };
        const count = countsThings(rule) && tally.get(name);
        if (count)
          Object.assign(one, { checked: count.checked, passed: count.checked - count.failed });
        return one;
      });
    if (!list.length) continue;
    const { id, title, about } = category;
    categories.push(list.reduce(add, { id, title, about, errors: 0, warnings: 0, rules: list }));
  }
  const total = categories.reduce(add, { errors: 0, warnings: 0, checked: 0, passed: 0 });
  return { ...total, categories };
}
