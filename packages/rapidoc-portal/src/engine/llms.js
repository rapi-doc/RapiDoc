/**
 * LLM-friendly output (`llms` in the config): every docs page as Markdown at /docs/<page>.md, plus /llms.txt
 * (an index, https://llmstxt.org) and /llms-full.txt (every page's text). Written into the workspace's public/
 * folder, so `rapidoc dev` serves them too.
 *
 * Pages are converted from their source, not rendered: Markdoc tags and MDX components the portal knows
 * become plain Markdown, other tags keep their inner text. With access rules, /llms.txt and /llms-full.txt
 * list public pages only; a protected page's .md follows the page (access/split-output.js).
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { activeTab } from '../components/header-nav.js';
import { createZoneMatcher, PUBLIC_ZONE } from '../access/rules.js';

export const LLMS_TXT = 'llms.txt';
export const LLMS_FULL_TXT = 'llms-full.txt';

/** A page URL → where its Markdown is published: `/` → `/index.md`, `/docs/a/` → `/docs/a.md`. */
export function markdownUrlOf(pageUrl) {
  return pageUrl === '/' ? '/index.md' : `${pageUrl.replace(/\/+$/, '')}.md`;
}

/** The reverse, for a file in the build output (no leading slash): `docs/a.md` → `/docs/a/`, `index.md` → `/`. */
export function pageUrlOfMarkdown(relPath) {
  return relPath === 'index.md' ? '/' : `/${relPath.replace(/\.md$/, '')}/`;
}

const CALLOUT_LABELS = {
  note: 'Note',
  tip: 'Tip',
  info: 'Info',
  caution: 'Caution',
  warning: 'Warning',
  danger: 'Danger',
  success: 'Success',
};
const calloutLabel = (type) => CALLOUT_LABELS[type] || CALLOUT_LABELS.note;

/** Attributes of a Markdoc tag or JSX element: `a="x" b='y' c={z}` → { a: 'x', b: 'y', c: 'z' }. */
function attributesOf(text = '') {
  const attrs = {};
  for (const [, name, ...values] of text.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g)) {
    attrs[name] = values.find((v) => v !== undefined);
  }
  return attrs;
}

/** Lines as a Markdown quote that starts with the callout's label (and title). */
function quoteCallout(type, title, body) {
  const head = `**${calloutLabel(type)}${title ? `: ${title}` : ':'}**`;
  const lines = body.trim() ? body.trim().split('\n') : [];
  return [head, ...lines].map((line) => (line ? `> ${line}` : '>')).join('\n');
}

const HELD = /\u0000(\d+)\u0000/g;

/**
 * Takes code out of `text` (fenced blocks, then inline code) so the conversions leave examples alone.
 * Returns the text with placeholders and a function that puts the code back.
 */
function holdCode(text) {
  const held = [];
  const hold = (match) => `\u0000${held.push(match) - 1}\u0000`;
  const out = text.replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[ \t]*$/gm, hold).replace(/(`+)[^\n]*?\1/g, hold);
  const restore = (value) => value.replace(HELD, (_, i) => restore(held[Number(i)]));
  return { text: out, restore };
}

/**
 * A docs page's source → plain Markdown: no frontmatter or MDX imports; callouts, cards, badges and
 * operation embeds as Markdown; other Markdoc tags and MDX components keep their inner text.
 *
 * @param {string} source - File contents
 * @param {object} portalConfig - Normalized config (for operation links)
 */
export function toMarkdown(source, portalConfig) {
  const apis = new Map((portalConfig.apis || []).map((api) => [api.id, api]));
  const code = holdCode(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ''));
  let text = code.text;
  // A callout's body gets its code back before it is quoted, so a code block in it is quoted line by line.
  const quote = (type, title, body) => quoteCallout(type, title, code.restore(body));

  // MDX imports and exports.
  text = text.replace(/^(?:import|export)\s.*$/gm, '');

  // Operation embeds → method, path, title, and a link to the API page.
  text = text.replace(/\{%\s*api-operation\s+([^%]*?)\/?%\}/g, (_, attrText) => {
    const { spec, path: opPath, method = 'get', title, version } = attributesOf(attrText);
    const api = apis.get(spec);
    const target = api && (version ? api.versions.find((v) => v.version === version) : api.versions[0]);
    const label = `\`${method.toUpperCase()} ${opPath}\`${title ? ` ${title}` : ''}`;
    return target ? `${label} ([${api.title}](${target.path}))` : label;
  });

  // Callouts: {% callout %}, :::type, <Aside>, <Callout>.
  text = text.replace(/\{%\s*(callout|aside)\s*([^%]*?)%\}([\s\S]*?)\{%\s*\/\1\s*%\}/g, (_, _tag, attrText, body) => {
    const { type, title } = attributesOf(attrText);
    return quote(type, title, body);
  });
  text = text.replace(/^:::(\w+)(?:\[([^\]]*)\]|\{([^}]*)\})?[ \t]*\n([\s\S]*?)^:::[ \t]*$/gm, (_, type, bracketTitle, braces, body) =>
    quote(type, bracketTitle || attributesOf(braces).title, body)
  );
  text = text.replace(/<(Aside|Callout)\b([^>]*)>([\s\S]*?)<\/\1>/g, (_, _name, attrText, body) => {
    const { type, title } = attributesOf(attrText);
    return quote(type, title, body);
  });

  // Cards: a linked title, then the body.
  text = text.replace(/\{%\s*card\s+([^%]*?)%\}([\s\S]*?)\{%\s*\/card\s*%\}/g, (_, attrText, body) => {
    const { title, href } = attributesOf(attrText);
    return `**${href ? `[${title}](${href})` : title}**\n\n${body.trim()}\n`;
  });
  text = text.replace(/\{%\s*badge\s+([^%]*?)\/%\}/g, (_, attrText) => attributesOf(attrText).text || '');

  // Every other Markdoc tag keeps its content; a tab keeps its label and a step its title.
  text = text.replace(/\{%\s*(tab|step)\s+([^%]*?)%\}/g, (_, _tag, attrText) => {
    const { label, name, title } = attributesOf(attrText);
    const heading = label || name || title;
    return heading ? `**${heading}**\n` : '';
  });
  text = text.replace(/\{%\s*\/?[\w-]+[^%]*?%\}/g, '');

  // Links relative to the portal get its base path, so they resolve from the .md's URL.
  const base = portalConfig.site?.basePath;
  if (base) text = text.replace(/(\]\(|\]:\s*)(\/(?!\/))/g, `$1${base}$2`);

  return code
    .restore(text)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Title and description from a page's frontmatter, else its first `#` heading, else its file name. */
function pageMeta(source, file) {
  const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let data = {};
  try {
    data = (fm && yaml.parse(fm[1])) || {};
  } catch {
    // Unreadable frontmatter: fall back to the heading or file name.
  }
  const heading = source.match(/^#\s+(.+)$/m)?.[1];
  const name = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
  return {
    title: String(data.title || heading || name.charAt(0).toUpperCase() + name.slice(1)).replace(/<[^>]+>/g, ''),
    description: data.description ? String(data.description) : '',
  };
}

/** A doc file → its page URL: docs/index.* is the home page, `guides/index.md` is /docs/guides/. */
function pageUrlOf(docsDir, file) {
  const slug = path
    .relative(docsDir, file)
    .split(path.sep)
    .join('/')
    .replace(/\.(md|mdx|markdoc)$/, '')
    .replace(/(^|\/)index$/, '');
  if (!slug && /^index\./.test(path.basename(file)) && path.dirname(file) === docsDir) return '/';
  return slug ? `/docs/${slug}/` : '/docs/';
}

/**
 * Every docs page with its URLs, title, description and Markdown, in navigation order: the documentation
 * tabs in order, each in its sidebar order, then pages no tab lists.
 */
export function collectDocPages(portalConfig, docFiles) {
  const docsDir = portalConfig.docs.fullPath;
  const pages = docFiles
    .filter((file) => fs.existsSync(file))
    .map((file) => {
      const source = fs.readFileSync(file, 'utf8');
      const url = pageUrlOf(docsDir, file);
      return { file, url, markdownUrl: markdownUrlOf(url), ...pageMeta(source, file), body: toMarkdown(source, portalConfig) };
    });

  const docsTabs = (portalConfig.tabs || []).filter((tab) => tab.kind === 'docs');
  const order = sidebarOrder(docsTabs);
  const rank = (page) => order.findIndex((prefix) => page.url === prefix || (prefix.endsWith('/') && page.url.startsWith(prefix)));
  const tabIndex = (page) => (page.url === '/' ? -1 : docsTabs.indexOf(activeTab(docsTabs, page.url) || docsTabs[0]));
  return pages
    .map((page) => ({ ...page, tab: tabIndex(page) }))
    .sort((a, b) => a.tab - b.tab || orderValue(rank(a)) - orderValue(rank(b)) || a.url.localeCompare(b.url));
}

const orderValue = (index) => (index === -1 ? Number.MAX_SAFE_INTEGER : index);

/** Page URLs (and folder prefixes, for autogenerated groups) in sidebar order across the documentation tabs. */
function sidebarOrder(docsTabs) {
  const order = [];
  const walk = (entries) =>
    entries.forEach((entry) => {
      if (entry.slug !== undefined) order.push(entry.slug === 'docs' ? '/docs/' : `/${entry.slug}/`);
      else if (entry.link && entry.link.startsWith('/')) order.push(entry.link);
      if (entry.items) {
        entry.items.forEach((child) => {
          if (child.autogenerate) order.push(`/${child.autogenerate.directory}/`);
        });
        walk(entry.items);
      }
    });
  docsTabs.forEach((tab) => walk(tab.sidebar));
  return order;
}

/** `/docs/a.md` → an absolute URL when the site has one (LLM tools fetch links), else unchanged. */
function absolute(portalConfig, url) {
  const { site } = portalConfig;
  return site.url ? new URL(url.replace(/^\/+/, ''), `${site.url.replace(/\/+$/, '')}/`).href : url;
}

/**
 * /llms.txt: the site, then one section per documentation tab with its pages, then the APIs.
 *
 * @param {(url: string) => boolean} [isPublic] - Whether an API page is public; others are left out
 */
export function renderLlmsTxt(portalConfig, pages, isPublic = () => true) {
  const { site, llms } = portalConfig;
  const docsTabs = (portalConfig.tabs || []).filter((tab) => tab.kind === 'docs');
  const link = (title, url, description) => `- [${title}](${absolute(portalConfig, url)})${description ? `: ${description}` : ''}`;
  const sections = [`# ${site.title}`];
  if (llms.description) sections.push(`> ${llms.description.replace(/\s*\n\s*/g, ' ')}`);

  const groups = new Map();
  for (const page of pages) {
    const label = page.tab === -1 ? site.title : docsTabs[page.tab]?.label || 'Documentation';
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(link(page.title, page.markdownUrl, page.description));
  }
  for (const [label, lines] of groups) sections.push(`## ${label}\n\n${lines.join('\n')}`);

  const apis = (portalConfig.apis || []).flatMap((api) =>
    api.versions
      .filter((version) => isPublic(version.path))
      .map((version) =>
        link(`${api.title}${version.isDefault ? '' : ` ${version.label}`} (OpenAPI)`, version.specUrl, version.isDefault ? api.summary : '')
      )
  );
  if (apis.length) sections.push(`## APIs\n\n${apis.join('\n')}`);
  return `${sections.join('\n\n')}\n`;
}

/** One page as Markdown: its title, description and body. */
export function renderPageMarkdown(page) {
  return `# ${page.title}\n\n${page.description ? `> ${page.description}\n\n` : ''}${page.body}\n`;
}

/** /llms-full.txt: every page's Markdown, each with its URL. */
export function renderLlmsFullTxt(portalConfig, pages) {
  return pages.map((page) => `${renderPageMarkdown(page)}\nSource: ${absolute(portalConfig, page.url)}\n`).join('\n---\n\n');
}

/**
 * Writes the .md pages, /llms.txt and /llms-full.txt into `publicDir`. With `llms: false`, nothing.
 * The two text files list public pages only.
 *
 * @param {object} portalConfig - Normalized config
 * @param {string[]} docFiles - Absolute paths of the docs pages
 * @param {string} publicDir - The workspace's public/ folder
 */
export function writeLlmsFiles(portalConfig, docFiles, publicDir) {
  if (!portalConfig.llms) return;
  // In `rapidoc dev` this runs again on every docs change: drop the .md files of the previous run first.
  for (const file of written.get(publicDir) || []) fs.rmSync(file, { force: true });
  const pages = collectDocPages(portalConfig, docFiles);
  const files = pages.map((page) => {
    const target = path.join(publicDir, page.markdownUrl);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, renderPageMarkdown(page), 'utf8');
    return target;
  });
  written.set(publicDir, files);
  const { zoneOf } = createZoneMatcher(portalConfig.access);
  const isPublic = (url) => zoneOf(url) === PUBLIC_ZONE;
  const publicPages = pages.filter((page) => isPublic(page.url));
  fs.writeFileSync(path.join(publicDir, LLMS_TXT), renderLlmsTxt(portalConfig, publicPages, isPublic), 'utf8');
  fs.writeFileSync(path.join(publicDir, LLMS_FULL_TXT), renderLlmsFullTxt(portalConfig, publicPages), 'utf8');
}

/** .md files written per public/ folder, so a page removed in `rapidoc dev` loses its .md too. */
const written = new Map();
