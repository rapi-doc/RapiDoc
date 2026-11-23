import { walkDocument } from "../walk.js";

/** What RapiDoc takes out of a description before showing it (rapidoc 15: utils/sanitize.js) */
const REMOVED = [
  [/<\s*(script|style|iframe|object|embed|svg|math|template|textarea|select|form)\b/i, "<$1>"],
  [/<[a-z][^>]*\son[a-z]+\s*=/i, "an event handler attribute"],
  [/\b(?:href|src)\s*=\s*["']?\s*(javascript|vbscript)\s*:/i, "a $1: address"],
  [/\]\(\s*(javascript|vbscript)\s*:/i, "a $1: link"],
];

/** @type {import("../types.js").Rule} */
export default {
  name: "description-html-removed",
  description:
    "A description has no HTML that the reference removes for safety (script, iframe and form elements, event handlers, javascript: links): the reader would see the text without it.",
  default: "warn",
  on: ["document"],
  check: (doc) => {
    const findings = [];
    walkDocument(doc, (node, pointer, isNameMap) => {
      // in a `properties` object, `description` is a property's name
      if (isNameMap || typeof node.description !== "string") return;
      for (const [pattern, what] of REMOVED) {
        const match = pattern.exec(node.description);
        if (!match) continue;
        const named = what.replace("$1", (match[1] ?? "").toLowerCase());
        // "<iframe>" → "an <iframe> element"
        const said = named.startsWith("<")
          ? `${/^<[aeio]/.test(named) ? "an" : "a"} ${named} element`
          : named;
        findings.push({
          pointer: [...pointer, "description"],
          message: `The description has ${said}, which the reference removes`,
        });
        break;
      }
    });
    return findings;
  },
};
