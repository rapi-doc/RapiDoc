import { marked } from "marked";

/*
 * Markdown (CommonMark and GFM, as OpenAPI descriptions use) as pdfmake content, straight from marked's
 * tokens: no HTML and no DOM in between, so it runs in Node as it does in the browser. Raw HTML in the
 * markdown is reduced to its text. Images are left out (their alt text is printed).
 */

const PARAGRAPH_MARGIN = [0, 5, 0, 10];
const HEADING_SIZES = [24, 22, 20, 18, 16, 14];
const LINK = { color: "blue", decoration: "underline" };
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] !== "#") return ENTITIES[entity.toLowerCase()] ?? match;
    const code = /^#x/i.test(entity)
      ? parseInt(entity.slice(2), 16)
      : parseInt(entity.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

/** Text as a browser would lay it out inside a paragraph: a line break in the source is a space. */
function plainText(text) {
  return decodeEntities(text).replace(/\r?\n/g, " ");
}

function htmlToText(html) {
  return decodeEntities(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, ""));
}

/** Inline tokens as a flat list of pdfmake text runs; `format` is what the enclosing tokens add. */
function inlineRuns(tokens = [], format = {}) {
  const runs = [];
  for (const token of tokens) {
    switch (token.type) {
      case "strong":
        runs.push(...inlineRuns(token.tokens, { ...format, bold: true }));
        break;
      case "em":
        runs.push(...inlineRuns(token.tokens, { ...format, italics: true }));
        break;
      case "del":
        runs.push(...inlineRuns(token.tokens, { ...format, decoration: "lineThrough" }));
        break;
      case "link":
        runs.push(...inlineRuns(token.tokens, { ...format, ...LINK, link: token.href }));
        break;
      case "codespan":
        runs.push({ text: decodeEntities(token.text), ...format, style: ["mono"] });
        break;
      case "br":
        runs.push({ text: "\n", ...format });
        break;
      case "image":
        if (token.text) runs.push({ text: plainText(token.text), ...format });
        break;
      case "html": {
        const text = htmlToText(token.text ?? token.raw ?? "");
        if (text) runs.push({ text, ...format });
        break;
      }
      default:
        if (token.tokens?.length) runs.push(...inlineRuns(token.tokens, format));
        else if (token.text ?? token.raw)
          runs.push({ text: plainText(token.text ?? token.raw), ...format });
    }
  }
  return runs;
}

/** The `text` of a pdfmake node for inline tokens: a string when it is one unformatted run. */
function inlineText(tokens) {
  const runs = inlineRuns(tokens);
  if (runs.length === 1 && Object.keys(runs[0]).length === 1) return runs[0].text;
  return runs;
}

function listItem(item) {
  const blocks = blockNodes(item.tokens, { inList: true });
  if (blocks.length === 1) return blocks[0];
  return { stack: blocks };
}

function tableCell(cell, header) {
  const node = { text: inlineText(cell.tokens) };
  if (header) Object.assign(node, { bold: true, fillColor: "#EEEEEE" });
  if (cell.align) node.alignment = cell.align;
  return node;
}

function blockNodes(tokens = [], { inList = false } = {}) {
  const nodes = [];
  for (const token of tokens) {
    switch (token.type) {
      case "space":
      case "def":
        break;
      case "paragraph":
        nodes.push({
          text: inlineText(token.tokens),
          ...(inList ? {} : { margin: PARAGRAPH_MARGIN }),
        });
        break;
      case "heading":
        nodes.push({
          text: inlineText(token.tokens),
          fontSize: HEADING_SIZES[token.depth - 1] ?? 14,
          bold: true,
          marginBottom: 5,
        });
        break;
      case "list": {
        const items = token.items.map(listItem);
        const list = token.ordered ? { ol: items } : { ul: items };
        if (token.ordered && token.start > 1) list.start = token.start;
        nodes.push({ ...list, marginBottom: 5, marginLeft: 5 });
        break;
      }
      case "code":
        nodes.push({
          text: token.text,
          style: ["monoSub"],
          preserveLeadingSpaces: true,
          margin: PARAGRAPH_MARGIN,
        });
        break;
      case "blockquote":
        nodes.push({ stack: blockNodes(token.tokens), margin: [10, 0, 0, 0], style: ["darkGray"] });
        break;
      case "table":
        nodes.push({
          table: {
            headerRows: 1,
            body: [
              token.header.map((cell) => tableCell(cell, true)),
              ...token.rows.map((row) => row.map((cell) => tableCell(cell, false))),
            ],
          },
          marginBottom: 5,
        });
        break;
      case "hr":
        nodes.push({
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#aaaaaa" },
          ],
          margin: [0, 5, 0, 5],
        });
        break;
      case "html": {
        const text = htmlToText(token.text ?? token.raw ?? "").trim();
        if (text) nodes.push({ text, ...(inList ? {} : { margin: PARAGRAPH_MARGIN }) });
        break;
      }
      default:
        // "text" at block level (a tight list item) and anything marked adds later: its inline content
        if (token.tokens?.length || token.text) {
          nodes.push({ text: inlineText(token.tokens ?? [{ type: "text", text: token.text }]) });
        }
    }
  }
  return nodes;
}

/** Markdown as a list of pdfmake nodes (for a `stack`). Not a string: an empty list. */
export function markdownToPdfmake(markdown) {
  if (typeof markdown !== "string" || !markdown.trim()) return [];
  return blockNodes(marked.lexer(markdown, { gfm: true }));
}
