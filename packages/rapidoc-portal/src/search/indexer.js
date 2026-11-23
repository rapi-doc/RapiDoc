import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import yaml from "yaml";
import { toKebabCase } from "@rapidoc/prerender";
import { OperationSlugger } from "@rapidoc/prerender/internal";
import { docPageUrl } from "../config/doc-paths.js";
import { splitFrontmatter } from "../config/doc-source.js";
import { activeTab } from "../components/header-nav.js";

/** The label of a docs result whose page is in no navigation tab. */
const DOCS_CATEGORY = "Documentation";

/**
 * Strips Markdown, Markdoc, and HTML syntax into clean plain text for indexing.
 *
 * @param {string} rawContent
 * @returns {string} Plain text content
 */
export function stripMarkup(rawContent = "") {
  let text = rawContent;

  // 1. Remove YAML frontmatter
  text = splitFrontmatter(text).body;

  // 2. Remove Markdoc tags ({% ... %})
  text = text.replace(/{%[\s\S]*?%}/g, " ");

  // 3. Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, " ");

  // 4. Remove an MDX page's import and export lines: code, not text
  text = text.replace(
    /^(?:import\s[^\n]*?from\s+["'][^"'\n]+["']|import\s+["'][^"'\n]+["']|export\s+(?:const|default|function)\b[^\n]*);?[ \t]*$/gm,
    " ",
  );

  // 5. Keep inline code as text, out of the way of the next step: `<rapi-doc>` is a name, not a tag
  const codeSpans = [];
  text = text.replace(/`([^`\n]+)`/g, (match, code) => `\uE000${codeSpans.push(code) - 1}\uE000`);

  // 6. Remove HTML tags and MDX components
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\uE000(\d+)\uE000/g, (match, index) => codeSpans[Number(index)]);

  // 7. Convert markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 8. Remove image tags ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // 9. Remove markdown styling (*, _, ~, #)
  text = text.replace(/[*_~#]/g, " ");

  // 10. Normalize whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Extracts sections from Markdown / Markdoc document based on headings.
 *
 * @param {string} rawContent
 * @param {string} basePath
 * @param {string} docTitle
 * @param {string} [category] - The label of the page's group (its navigation tab)
 * @returns {Array<object>} List of search records
 */
export function extractDocSections(
  rawContent = "",
  basePath = "",
  docTitle = "",
  category = DOCS_CATEGORY,
) {
  const records = [];
  const slugger = new GithubSlugger();

  // Strip frontmatter first
  const contentWithoutFm = splitFrontmatter(rawContent).body;
  const lines = contentWithoutFm.split("\n");

  let currentHeading = null;
  let currentLines = [];

  function flushSection() {
    if (currentHeading) {
      const sectionText = stripMarkup(currentLines.join("\n"));
      if (sectionText.length > 0 || currentHeading.title) {
        records.push({
          id: `doc-${basePath}#${currentHeading.slug}`,
          type: "doc",
          title: currentHeading.title,
          pageTitle: docTitle,
          subtitle: docTitle,
          category,
          url: `${basePath}#${currentHeading.slug}`,
          content: sectionText.slice(0, 500),
        });
      }
    }
    currentLines = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      const level = headingMatch[1].length;
      // The heading as it reads on the page: `<rapi-doc>` without its backticks, a link as its text
      const title = stripMarkup(headingMatch[2]) || headingMatch[2].trim();
      const slug = slugger.slug(title);
      currentHeading = { level, title, slug };
    } else {
      currentLines.push(line);
    }
  }

  flushSection();
  return records;
}

/** The HTTP methods of a path item, in the order RapiDoc's parser reads them (anchors depend on it). */
const HTTP_METHODS = ["get", "put", "post", "delete", "patch", "head", "options", "trace", "query"];

/** `/orders/{id}` as `OrdersId`, the way the parser names an operation without an operationId. */
const pascalCase = (pathName) =>
  String(pathName)
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (chr) => chr.toUpperCase());

const isHidden = (item) =>
  [item?.["x-internal"], item?.["x-hidden"]].some((value) => value === true || value === "true");

/** An OpenAPI 3.2 tag without `kind`, or with `nav`, is a section of the sidebar; other kinds only label. */
const isNavTag = (tag) => !tag?.kind || tag.kind === "nav";

/**
 * Every operation of a spec with the link the API sidebar gives it (`getNavBarHtml` of
 * `@rapidoc/prerender` with `routingMode: 'tag-pages'`): the page of its first tag and the anchor
 * `<rapi-doc>` gives the operation there, from the same slugger (`OperationSlugger`), in the parser's
 * order (the parity is checked by `tests/search.test.js`). Operations the sidebar hides (`x-internal`, `x-hidden`, on the operation, its path or its
 * tag) are marked `hidden`.
 *
 * @param {object} spec - The OpenAPI document
 * @returns {Array<{ method: string, path: string, operation: object, pathItem: object, tag: string, link: string, hidden: boolean }>}
 *   `link` is relative to the API's page: `/<tag slug>#<anchor>`, or `#<anchor>` for untagged operations
 */
export function operationLinks(spec) {
  const slugger = new OperationSlugger();
  const declaredTags = new Map(
    (Array.isArray(spec.tags) ? spec.tags : []).map((tag) => [String(tag.name).toLowerCase(), tag]),
  );
  const hasTagGroups = ["x-tagGroups", "x-tag-groups"].some((key) => spec[key]?.length > 0);
  const found = [];
  const items = [...Object.entries(spec.paths || {}), ...Object.entries(spec.webhooks || {})];

  for (const [pathName, pathItem] of items) {
    if (!pathItem || typeof pathItem !== "object") continue;
    const operations = HTTP_METHODS.filter((method) => pathItem[method]).map((method) => [
      method,
      pathItem[method],
    ]);
    for (const [name, operation] of Object.entries(pathItem.additionalOperations || {})) {
      if (operation && typeof operation === "object")
        operations.push([name.toLowerCase(), operation]);
    }

    for (const [method, operation] of operations) {
      const own =
        Array.isArray(operation.tags) && operation.tags.length > 0 ? operation.tags : null;
      const navTags = (own || []).filter((name) =>
        isNavTag(declaredTags.get(String(name).toLowerCase())),
      );
      const tags = navTags.length > 0 ? navTags : own || ["General"];
      const slugSource = {
        method,
        path: pathName,
        operationId: operation.operationId,
        summary: operation.summary || operation.description,
      };
      // Without a tag prefix the sidebar builds the anchor from the parsed operation, whose operationId is
      // never empty (method + path when the spec has none)
      const sidebarSource = {
        method,
        path: pathName,
        operationId: operation.operationId || `${method}${pascalCase(pathName)}`,
        summary: operation.summary || "",
      };
      // Every tag the operation is under takes an anchor, as in the parser, so later ones come out the same
      const links = tags.map((tag) => {
        const tagSlug = toKebabCase(tag);
        const elementId = slugger.slug(slugSource, hasTagGroups ? tagSlug : "");
        if (!tagSlug || tagSlug === "general") return `#${elementId}`;
        const prefix = `${tagSlug}--`;
        const anchor = elementId.startsWith(prefix)
          ? elementId.slice(prefix.length)
          : slugger.slugOp(sidebarSource);
        return `/${tagSlug}#${anchor}`;
      });
      const shown = tags.findIndex((tag) => !isHidden(declaredTags.get(String(tag).toLowerCase())));
      found.push({
        method,
        path: pathName,
        operation,
        pathItem,
        tag: tags[Math.max(shown, 0)],
        link: links[Math.max(shown, 0)],
        hidden: isHidden(operation) || isHidden(pathItem) || shown === -1,
      });
    }
  }
  return found;
}

/**
 * Indexes an OpenAPI specification file into searchable operation records. Each record's URL is the
 * operation's link in the API sidebar (its tag's page and anchor); operations the sidebar hides are
 * left out.
 *
 * @param {object} api - API configuration entry
 * @returns {Array<object>} List of API search records
 */
export function indexOpenApiSpec(api) {
  const records = [];
  if (!api.fullPath || !fs.existsSync(api.fullPath)) {
    return records;
  }

  try {
    const content = fs.readFileSync(api.fullPath, "utf8");
    const parsed = yaml.parse(content);
    if (!parsed || !parsed.paths) return records;

    for (const { method, path: endpoint, operation, tag, link, hidden } of operationLinks(parsed)) {
      if (hidden) continue;
      const methodUpper = method.toUpperCase();
      const title = operation.summary || operation.operationId || `${methodUpper} ${endpoint}`;
      const operationId = operation.operationId || "";
      const shownTag = Array.isArray(operation.tags) && operation.tags.length > 0 ? tag : "";

      const paramNames = Array.isArray(operation.parameters)
        ? operation.parameters.map((p) => p.name).join(" ")
        : "";

      const searchContent = [
        title,
        operation.description || "",
        operationId,
        endpoint,
        shownTag,
        paramNames,
      ]
        .filter(Boolean)
        .join(" ");

      records.push({
        id: `api-${api.id}-${method}-${endpoint}`,
        type: "api",
        title,
        subtitle: `${methodUpper} ${endpoint}`,
        method: methodUpper,
        endpoint,
        tag: shownTag,
        category: api.title || `${api.id.toUpperCase()} API`,
        url: `${api.path}${link}`,
        content: stripMarkup(searchContent).slice(0, 500),
      });
    }
  } catch (err) {
    console.warn(`[search-indexer] Failed to parse OpenAPI spec at ${api.fullPath}:`, err.message);
  }

  return records;
}

/**
 * Builds the complete unified search index across all docs and OpenAPI specifications.
 *
 * @param {object} config - Normalized RapiDoc portal configuration
 * @param {string} projectDir - Base project directory
 * @param {Array<string>} docFiles - List of absolute documentation file paths
 * @returns {{ version: number, generatedAt: string, records: Array<object> }}
 */
export function buildSearchIndex(config, projectDir, docFiles = []) {
  const records = [];

  // 1. Index documentation pages and heading sections
  for (const docFile of docFiles) {
    if (!fs.existsSync(docFile)) continue;
    const rawContent = fs.readFileSync(docFile, "utf8");

    // Extract frontmatter title and description
    let docTitle = path.basename(docFile, path.extname(docFile)).replace(/-/g, " ");
    let docDesc = "";

    // Unreadable frontmatter is {}: the title stays the file name
    const { data: fm } = splitFrontmatter(rawContent);
    if (fm.title) docTitle = fm.title;
    if (fm.description) docDesc = fm.description;

    // The page's address, without the closing slash (the index's form)
    const pageUrl = docPageUrl(path.relative(config.docs.fullPath, docFile), {
      home: config.docs.home !== false,
    });
    const routePath = pageUrl === "/" ? pageUrl : pageUrl.replace(/\/$/, "");

    // The group a result is shown under: the navigation tab the page is in ("Guides", "RapiFlow"), so a
    // reader sees which part of the documentation it is from. A page no tab lists keeps the plain label.
    const category = activeTab(config.tabs || [], pageUrl)?.label || DOCS_CATEGORY;

    // Index main page record
    records.push({
      id: `doc-${routePath}`,
      type: "doc",
      title: docTitle,
      subtitle: docDesc || "Documentation Page",
      category,
      url: routePath,
      content: stripMarkup(rawContent).slice(0, 600),
    });

    // Index individual heading sections for direct anchor links
    const sectionRecords = extractDocSections(rawContent, routePath, docTitle, category);
    records.push(...sectionRecords);
  }

  // 2. Index OpenAPI specifications: every version; versions other than the default at their own URLs.
  for (const api of config.apis || []) {
    for (const version of api.versions || [api]) {
      const target =
        version.isDefault === false
          ? {
              ...version,
              id: `${api.id}@${version.version}`,
              title: `${api.title} · ${version.label}`,
            }
          : api;
      records.push(...indexOpenApiSpec(target));
    }
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totalRecords: records.length,
    records,
  };
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·" };

/** Text of a piece of HTML: tags out, entities decoded, whitespace folded. */
function htmlText(html = "") {
  return html
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(x?)([0-9a-f]+);/gi, (match, hex, code) =>
      String.fromCodePoint(parseInt(code, hex ? 16 : 10)),
    )
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

const metaContent = (html, name) =>
  new RegExp(`<meta\\s[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i").exec(
    html,
  )?.[1] ??
  new RegExp(`<meta\\s[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i").exec(html)?.[1];

/** How many of a page's headings get a record of their own. */
const MAX_PAGE_SECTIONS = 40;

/**
 * Search records for one built page of the project (pages/*.astro): the page, and its h2 and h3
 * headings that have an id. Read from the HTML the build wrote, since such a page has no Markdown
 * source. A page opts out with `<meta name="portal-search" content="off">`.
 *
 * @param {string} html - The built page
 * @param {string} url - Its address, portal-relative, without a closing slash
 * @param {{ siteTitle?: string }} [options] - siteTitle: taken off the end of a <title> ("Pricing | Acme")
 * @returns {Array<object>}
 */
export function extractPageRecords(html = "", url = "/", { siteTitle } = {}) {
  if (/^off$/i.test(metaContent(html, "portal-search") || "")) return [];

  // The page's own content: <main> when it has one, else the body without header, nav and footer
  const main = /<main\b[^>]*>([\s\S]*)<\/main>/i.exec(html)?.[1];
  const body =
    main ??
    (/<body\b[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html).replace(
      /<(header|nav|footer)\b[\s\S]*?<\/\1>/gi,
      " ",
    );

  // Without an <h1>, the page's <title>, less the site's name at its end
  let docTitle = htmlText(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]);
  if (siteTitle && docTitle.endsWith(siteTitle) && docTitle.length > siteTitle.length)
    docTitle = docTitle.slice(0, -siteTitle.length).replace(/[\s|·:–—-]+$/, "") || docTitle;
  const title = htmlText(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(body)?.[1]) || docTitle || url;
  const description = metaContent(html, "description");
  const records = [
    {
      id: `page-${url}`,
      type: "page",
      title,
      subtitle: htmlText(description) || "Page",
      category: "Page",
      url,
      content: htmlText(body).slice(0, 600),
    },
  ];

  const headings = [...body.matchAll(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)];
  headings.slice(0, MAX_PAGE_SECTIONS).forEach((heading, index) => {
    const id = /\bid=["']([^"']+)["']/i.exec(heading[2])?.[1];
    const sectionTitle = htmlText(heading[3]);
    if (!id || !sectionTitle) return;
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? body.length;
    records.push({
      id: `page-${url}#${id}`,
      type: "page",
      title: sectionTitle,
      pageTitle: title,
      subtitle: title,
      category: "Page",
      url: `${url}#${id}`,
      content: htmlText(body.slice(start, end)).slice(0, 500),
    });
  });
  return records;
}

/**
 * The built files of the project's pages: `/pricing` is pricing/index.html, a dynamic route
 * (`/api/[...element]`) every file its pattern covers. The 404 page is not a page to find.
 *
 * @param {string} outDir - The build output
 * @param {{ pattern: string }[]} pages - The project's pages (engine/project-pages.js)
 * @returns {{ url: string, file: string }[]}
 */
export function builtPageFiles(outDir, pages = []) {
  const found = new Map();
  const add = (relDir) => {
    const file = path.join(outDir, relDir, "index.html");
    if (fs.existsSync(file)) found.set(relDir ? `/${relDir}` : "/", file);
  };
  for (const { pattern } of pages) {
    if (pattern === "/404") continue;
    if (!pattern.includes("[")) {
      add(pattern.replace(/^\/+/, ""));
      continue;
    }
    // The folders above the first parameter, then every index.html under them that the pattern covers
    const segments = pattern.split("/").filter(Boolean);
    const fixed = segments.slice(
      0,
      segments.findIndex((segment) => segment.includes("[")),
    );
    const matcher = new RegExp(
      `^${segments
        .map((segment) =>
          segment.startsWith("[...")
            ? "(?:/.+)?"
            : segment.includes("[")
              ? "/[^/]+"
              : `/${segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        )
        .join("")}$`,
    );
    const root = path.join(outDir, ...fixed);
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root, { withFileTypes: true, recursive: true })) {
      if (!entry.isFile() || entry.name !== "index.html") continue;
      const relDir = path.relative(outDir, entry.parentPath).split(path.sep).join("/");
      if (matcher.test(relDir ? `/${relDir}` : "/")) add(relDir);
    }
  }
  return [...found]
    .map(([url, file]) => ({ url, file }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * Puts page records into a search index file, in place of any it has (the dev server re-reads the pages).
 *
 * @param {string} indexFile - search-index.json
 * @param {Array<object>} pageRecords
 */
export function writePageRecords(indexFile, pageRecords = []) {
  if (!fs.existsSync(indexFile)) return;
  const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  index.records = [...index.records.filter((record) => record.type !== "page"), ...pageRecords];
  index.totalRecords = index.records.length;
  fs.writeFileSync(indexFile, JSON.stringify(index), "utf8");
}

/**
 * Adds the project's pages to the search index of a finished build (search-index.json in the output).
 * Runs after `astro build` and before the access split, which sorts the records by zone.
 *
 * @param {string} outDir - The build output
 * @param {{ pattern: string }[]} pages - The project's pages
 * @param {{ siteTitle?: string }} [options]
 * @returns {number} Records added
 */
export function indexBuiltPages(outDir, pages = [], { siteTitle } = {}) {
  const indexFile = path.join(outDir, "search-index.json");
  if (pages.length === 0 || !fs.existsSync(indexFile)) return 0;
  const records = builtPageFiles(outDir, pages).flatMap(({ url, file }) =>
    extractPageRecords(fs.readFileSync(file, "utf8"), url, { siteTitle }),
  );
  if (records.length === 0) return 0;
  writePageRecords(indexFile, records);
  return records.length;
}
