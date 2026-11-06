/*
 * The shapes `rapidoc lint` is built from. Rules are small pure functions: given a node of a kind they
 * asked for and the context, they return findings; the runner adds file, line and column.
 */

/**
 * @typedef {"error" | "warn" | "off"} Severity
 */

/**
 * @typedef {object} Finding
 * @property {string[]} pointer   JSON pointer segments of what's wrong, in the linted document
 * @property {string} message
 */

/**
 * @typedef {object} Operation
 * @property {object} node
 * @property {string[]} pointer
 * @property {string} path     the route, "/orders/{id}"
 * @property {string} method   lower case
 */

/**
 * @typedef {object} LintContext
 * @property {object} doc            the whole document (other-file $refs inlined, in-file ones kept)
 * @property {boolean} v2            Swagger 2.0
 * @property {string[]} pointer      where the node is
 * @property {string[]} parents      the kinds of the node's ancestors, nearest last
 * @property {string} [path]         the route, inside a path item
 * @property {string} [method]       the method, inside an operation
 * @property {Operation[]} operations   every operation of the document
 * @property {(node: unknown) => unknown} resolve   follows in-document $refs (up to 10 hops)
 */

/**
 * @typedef {object} Rule
 * @property {string} name          kebab-case, as in --rule and the config
 * @property {string} description   one sentence: what it checks and why the portal cares
 * @property {Severity} default
 * @property {string[]} on          node kinds it wants (see lib/openapi-shape.js), plus "document",
 *                                  "info", "server", "tag" and "securityScheme"
 * @property {(node: any, context: LintContext) => Finding[]} check
 */

export {};
