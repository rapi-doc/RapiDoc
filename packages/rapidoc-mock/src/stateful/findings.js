/**
 * What the stateful mock had to assume about a spec, or could not map, as findings a linter can report:
 * `statefulFindings(doc)` -> `[{ rule, pointer, message }]`. `rapidoc lint --stateful` turns each into a problem
 * at its place in the spec. They are the classifier's own review notes (classify.js), grouped by what the spec's
 * author can do about them, plus the resources it could not see because their schemas have no name.
 *
 *   stateful-resource-key        a resource whose key is unknown, or that has no item path
 *   stateful-list-filter         a list's query parameter that matches no field of what it returns
 *   stateful-write-unmapped      a PUT, PATCH or DELETE that fits no resource
 *   stateful-reference-target    a field that looks like a reference to a resource the spec does not have
 *   stateful-response-unnamed    a collection whose records are described by an inline schema
 *   stateful-operation-assumed   another assumption about what an operation does
 *   stateful-relation-assumed    a link between resources matched by more than its plain name
 */
import { listOperations, resolve } from "../spec.js";
import { classifySpec, contentSchema, namedSchema, operationIds, pathShape } from "./classify.js";
import { applyConfig } from "./config.js";

export const STATEFUL_RULES = [
  "stateful-resource-key",
  "stateful-list-filter",
  "stateful-write-unmapped",
  "stateful-reference-target",
  "stateful-response-unnamed",
  "stateful-operation-assumed",
  "stateful-relation-assumed",
];

const cache = new WeakMap();

/** The rule a part of an operation's review note belongs to. */
function operationRule(part) {
  if (/^query parameter .* matches no field of /.test(part)) return "stateful-list-filter";
  if (/^(PUT|PATCH|DELETE) that fits no resource$/.test(part)) return "stateful-write-unmapped";
  return "stateful-operation-assumed";
}

/** What a finding means for the mock, after the classifier's own words. */
const CONSEQUENCE = {
  "stateful-list-filter": "the mock ignores it when listing",
  "stateful-write-unmapped": "the mock answers it without changing stored data",
  "stateful-operation-assumed": "check that this is what the operation does",
};

/** A key for "no config" in the per-document cache. */
const NO_CONFIG = {};

/**
 * @param {object} doc - An OpenAPI 3.x document with its internal `$ref`s kept (as loadSpec or a bundler leaves it)
 * @param {object} [section] - The user's corrections for this API (`{ resources, operations }`, see config.js):
 *   what they state is no longer a finding
 * @returns {{ rule: string, pointer: string[], message: string }[]}
 */
export function statefulFindings(doc, section) {
  return statefulReport(doc, section).findings;
}

/**
 * The findings, and what in the user's corrections no longer fits the spec.
 * @param {object} doc
 * @param {object} [section] - See statefulFindings
 * @returns {{ findings: { rule: string, pointer: string[], message: string }[], warnings: string[] }}
 */
export function statefulReport(doc, section) {
  const perDoc = cache.get(doc) ?? cache.set(doc, new Map()).get(doc);
  const cached = perDoc.get(section ?? NO_CONFIG);
  if (cached) return cached;
  const model = classifySpec(doc);
  const warnings = applyConfig(doc, model, section);
  const ids = operationIds(doc);
  const findings = [];
  const schemaPointer = (name) => ["components", "schemas", model.schemas[name] || name];
  const operations = listOperations(doc).map((one) => {
    const id = ids.get(`${one.method} ${one.path}`);
    return { ...one, id, entry: model.operations[id] || { action: "none" } };
  });

  for (const [name, resource] of Object.entries(model.resources)) {
    if (!resource.review) continue;
    const effect = resource.key
      ? "the mock guessed the key"
      : "the mock can't tell one record from another, so reads, updates and deletes of one record keep no state";
    findings.push({
      rule: "stateful-resource-key",
      pointer: schemaPointer(name),
      message: `Resource ${name}: ${resource.why}: ${effect}`,
    });
  }

  for (const { method, path, entry } of operations) {
    if (!entry.review || !entry.why) continue;
    const label = `${method.toUpperCase()} ${path}`;
    // One note can hold several: each goes to its own rule; what belongs together stays together
    const byRule = new Map();
    for (const part of entry.why.split("; ")) {
      const rule = operationRule(part);
      byRule.set(rule, [...(byRule.get(rule) || []), part]);
    }
    for (const [rule, parts] of byRule) {
      findings.push({
        rule,
        pointer: ["paths", path, method],
        message:
          rule === "stateful-write-unmapped"
            ? `${label} fits no resource: ${CONSEQUENCE[rule]}`
            : `${label}: ${parts.join("; ")}: ${CONSEQUENCE[rule]}`,
      });
    }
  }

  for (const [id, value] of Object.entries(model.relations)) {
    if (!value || typeof value !== "object" || !value.review) continue;
    const name = Object.keys(model.resources).find((one) => id.startsWith(`${one}.`));
    if (!name) continue;
    const field = id.slice(name.length + 1);
    const base = schemaPointer(name);
    // The field itself when the schema declares it directly, else the schema (it may sit in an allOf part)
    const own = resolve(doc, { $ref: `#/${base.join("/")}` }, "").node?.properties?.[field];
    const pointer = own ? [...base, "properties", field] : base;
    findings.push(
      value.to === null
        ? {
            rule: "stateful-reference-target",
            pointer,
            message: `${name}.${field} ${value.why}: the mock fills it with generated values, not with the key of a stored record`,
          }
        : {
            rule: "stateful-relation-assumed",
            pointer,
            message: `${name}.${field} is linked to ${value.to}: ${value.why}`,
          },
    );
  }

  // A collection and its item path where nothing was mapped, and what a GET returns has no schema name:
  // the classifier knows a record by the name of its schema, so these keep no state
  const byShape = new Map();
  for (const one of operations) {
    const { shape } = pathShape(one.path);
    byShape.set(shape, [...(byShape.get(shape) || []), one]);
  }
  for (const [shape, here] of byShape) {
    const items = byShape.get(`${shape}/{}`);
    if (!items || shape.endsWith("/{}")) continue;
    const all = [...here, ...items];
    if (all.some((one) => one.entry.action !== "none")) continue;
    for (const one of all.filter((op) => op.method === "get")) {
      const code = Object.keys(one.operation.responses || {})
        .sort()
        .find((key) => key.startsWith("2"));
      const response = resolve(doc, one.operation.responses?.[code], "").node;
      const schema = contentSchema(doc, response?.content);
      const shapeOf = namedSchema(doc, schema);
      if (!schema || shapeOf.name) continue;
      findings.push({
        rule: "stateful-response-unnamed",
        pointer: ["paths", one.path, one.method, "responses", code],
        message: `${one.method.toUpperCase()} ${one.path}: the response's records are described by a schema without a name: put it under components.schemas and refer to it, so the mock can keep state for ${shape}`,
      });
    }
  }

  // a note marks the names it takes from the spec with backticks (classify.js): a lint message reads without
  const report = {
    findings: findings.map((one) => ({ ...one, message: one.message.replaceAll("`", "") })),
    warnings,
  };
  perDoc.set(section ?? NO_CONFIG, report);
  return report;
}
