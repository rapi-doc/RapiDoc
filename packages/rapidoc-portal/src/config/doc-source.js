/**
 * A docs page's source: its frontmatter and the text after it. The one reader for the search index and
 * the llms output (the docs sync edits frontmatter as text and has its own code for that).
 */

import YAML from "yaml";

// The block must open on the first line and close on a line of its own; \r\n files included.
const FRONTMATTER = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * @param {string} source - File contents
 * @returns {{ data: object, body: string }} data: the frontmatter ({} without one, or when it can't be
 *   read); body: the source after it
 */
export function splitFrontmatter(source = "") {
  const match = FRONTMATTER.exec(source);
  if (!match) return { data: {}, body: source };
  let data = {};
  try {
    const parsed = YAML.parse(match[1]);
    if (parsed && typeof parsed === "object") data = parsed;
  } catch {
    // Unreadable frontmatter: the page is indexed with the title its caller falls back to.
  }
  return { data, body: source.slice(match[0].length) };
}
