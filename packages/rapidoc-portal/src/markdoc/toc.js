import GithubSlugger from "github-slugger";
import { getNodeText } from "./nodes.js";

/**
 * Traverses a Markdoc AST to collect all headings between minLevel and maxLevel.
 *
 * @param {import('@markdoc/markdoc').Node} ast - Markdoc abstract syntax tree
 * @param {object} options - Filtering options ({ minLevel: 2, maxLevel: 3 })
 * @returns {Array<{ id: string, title: string, level: number }>}
 */
export function extractHeadings(ast, options = {}) {
  const minLevel = options.minLevel ?? 2;
  const maxLevel = options.maxLevel ?? 3;
  const slugger = new GithubSlugger();
  const headings = [];

  function walk(node) {
    if (!node) return;

    if (node.type === "heading") {
      const level = node.attributes?.level || 1;
      if (level >= minLevel && level <= maxLevel) {
        const title = getNodeText(node);
        const id = node.attributes?.id || slugger.slug(title);
        headings.push({
          id,
          title,
          level,
        });
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  walk(ast);
  return headings;
}
