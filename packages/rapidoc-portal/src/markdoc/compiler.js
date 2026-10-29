import fs from "node:fs";
import Markdoc from "@markdoc/markdoc";
import YAML from "yaml";
import GithubSlugger from "github-slugger";
import { tags } from "./tags.js";
import { heading, fence } from "./nodes.js";
import { extractHeadings } from "./toc.js";

/**
 * Creates default Markdoc configuration merged with custom tags and nodes.
 */
export function createMarkdocConfig(customConfig = {}) {
  const slugger = new GithubSlugger();

  return {
    tags: {
      ...tags,
      ...customConfig.tags,
    },
    nodes: {
      heading,
      fence,
      ...customConfig.nodes,
    },
    variables: {
      ...customConfig.variables,
    },
    slugger,
  };
}

/**
 * Compiles Markdoc source string into HTML, Table of Contents, and frontmatter.
 *
 * @param {string} content - Raw Markdoc / Markdown string
 * @param {object} options - Optional config overrides and variables
 * @returns {{ html: string, toc: Array<{ id: string, title: string, level: number }>, frontmatter: object }}
 */
export function compileMarkdoc(content, options = {}) {
  const config = createMarkdocConfig(options);
  const ast = Markdoc.parse(content);

  // 1. Extract Frontmatter if present
  let frontmatter = {};
  if (ast.attributes?.frontmatter) {
    try {
      frontmatter = YAML.parse(ast.attributes.frontmatter) || {};
    } catch {
      frontmatter = {};
    }
  }

  // 2. Extract Headings for Table of Contents
  const toc = extractHeadings(ast, options.toc);

  // 3. Transform AST using custom tags and nodes
  const transformed = Markdoc.transform(ast, config);

  // 4. Render to standard, semantic HTML
  const html = Markdoc.renderers.html(transformed);

  return {
    html,
    toc,
    frontmatter,
    ast,
    transformed,
  };
}

/**
 * Reads and compiles a Markdoc file from the filesystem.
 *
 * @param {string} filePath - Absolute path to the .markdoc or .md file
 * @param {object} options - Compilation options
 * @returns {{ html: string, toc: Array<{ id: string, title: string, level: number }>, frontmatter: object, filePath: string }}
 */
export function compileDocFile(filePath, options = {}) {
  const content = fs.readFileSync(filePath, "utf8");
  const compiled = compileMarkdoc(content, options);

  return {
    ...compiled,
    filePath,
  };
}
