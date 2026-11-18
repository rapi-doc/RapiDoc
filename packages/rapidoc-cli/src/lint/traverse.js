import { childKind, METHODS } from "../lib/openapi-shape.js";
import { decodePointer, valueAt } from "../validate/bundle.js";

/*
 * One walk of the document that calls every rule on the nodes of the kinds it asked for. A $ref is not
 * descended into (its target is walked where it lives, under components); rules that need the target
 * call context.resolve.
 */

/** @import { Finding, LintContext, Operation, Rule } from "./types.js" */

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

/** Follows `#/...` $refs in `doc`, up to 10 hops; anything else comes back as is. */
export const resolver = (doc) => (node) => {
  for (let hops = 0; isObject(node) && typeof node.$ref === "string" && hops < 10; hops++) {
    if (!node.$ref.startsWith("#")) return node;
    const target = valueAt(doc, decodePointer(node.$ref));
    if (target === undefined) return node;
    node = target;
  }
  return node;
};

/** Every operation of the document, with its route and method. @returns {Operation[]} */
export function operationsOf(doc, resolve) {
  const operations = [];
  for (const [path, rawItem] of Object.entries(isObject(doc.paths) ? doc.paths : {})) {
    const item = resolve(rawItem);
    if (!isObject(item)) continue;
    for (const method of METHODS)
      if (isObject(item[method]))
        operations.push({ node: item[method], pointer: ["paths", path, method], path, method });
  }
  return operations;
}

/**
 * Runs `rules` over `doc`; returns each finding with the rule that made it.
 * @param {object} doc
 * @param {Rule[]} rules
 * @param {object} [shared]  more for every rule's context (`mock`)
 * @param {Map<string, { checked: number, failed: number }>} [tally]  filled per rule name with how many nodes
 *   the rule was asked about and how many of them it found something on (summary.js reads it)
 * @returns {(Finding & { rule: string })[]}
 */
export function traverse(doc, rules, shared = {}, tally) {
  const v2 = typeof doc.swagger === "string";
  const resolve = resolver(doc);
  const operations = operationsOf(doc, resolve);
  const findings = [];

  /** kind → rules wanting it */
  const byKind = new Map();
  for (const rule of rules)
    for (const kind of rule.on) (byKind.get(kind) ?? byKind.set(kind, []).get(kind)).push(rule);

  const visit = (kind, node, pointer, parents, extra) => {
    const wanting = byKind.get(kind);
    if (!wanting) return;
    /** @type {LintContext} */
    const context = { doc, v2, pointer, parents, operations, resolve, ...shared, ...extra };
    for (const rule of wanting) {
      const found = rule.check(node, context);
      for (const finding of found) findings.push({ ...finding, rule: rule.name });
      if (tally) {
        const count =
          tally.get(rule.name) ?? tally.set(rule.name, { checked: 0, failed: 0 }).get(rule.name);
        count.checked += 1;
        if (found.length) count.failed += 1;
      }
    }
  };

  const walk = (kind, node, pointer, parents, extra) => {
    if (!isObject(node)) return;
    visit(kind, node, pointer, parents, extra);
    if (typeof node.$ref === "string") return;
    const below = [...parents, kind];
    for (const [key, child] of Object.entries(node)) {
      const shape = childKind(kind, key, v2);
      if (!shape) continue;
      const childPointer = [...pointer, key];
      const [arity, childKindName] = shape;
      const childExtra =
        kind === "pathItem" && childKindName === "operation" ? { ...extra, method: key } : extra;
      if (arity === "one") walk(childKindName, child, childPointer, below, childExtra);
      else if (arity === "list" && Array.isArray(child))
        child.forEach((item, i) =>
          walk(childKindName, item, [...childPointer, String(i)], below, childExtra),
        );
      else if (arity === "map" && isObject(child))
        for (const [name, item] of Object.entries(child))
          walk(
            childKindName,
            item,
            [...childPointer, name],
            below,
            childKindName === "pathItem" && kind === "root" ? { ...extra, path: name } : childExtra,
          );
    }
  };

  visit("document", doc, [], [], {});
  if (isObject(doc.info)) visit("info", doc.info, ["info"], ["root"], {});
  if (Array.isArray(doc.servers))
    doc.servers.forEach((server, i) =>
      visit("server", server, ["servers", String(i)], ["root"], {}),
    );
  if (Array.isArray(doc.tags))
    doc.tags.forEach((tag, i) => visit("tag", tag, ["tags", String(i)], ["root"], {}));
  const schemes = v2 ? doc.securityDefinitions : doc.components?.securitySchemes;
  if (isObject(schemes))
    for (const [name, scheme] of Object.entries(schemes))
      visit(
        "securityScheme",
        scheme,
        v2 ? ["securityDefinitions", name] : ["components", "securitySchemes", name],
        ["root"],
        {},
      );
  walk("root", doc, [], [], {});
  return findings;
}
