import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { MANAGED_RAPIDOC_ATTRIBUTES } from './errors.js';
import { findHomeDoc } from '../engine/sync-docs.js';
import { normalizeAccess, RESERVED_PREFIXES } from '../access/rules.js';

/**
 * Turns a valid rapidoc.config.yaml (schema.js) into the config the portal pages read:
 * defaults filled in, API metadata read from the specs, and `navigation` resolved into header tabs,
 * each documentation tab with its Starlight sidebar and the URL prefixes it covers.
 *
 * Documentation pages live under /docs/ (the docs folder is mirrored to src/content/docs/docs/).
 */

export const CATALOG_PATH = '/catalog';
/** Every API reference page is API_PATH/<id>; API_PATH itself redirects to the catalog. */
export const API_PATH = '/apis';
/** Local specs are published at SPECS_PATH/<api id><ext>. */
export const SPECS_PATH = '/specs';
export const DEFAULT_PRIMARY_COLOR = '#f76b39';

const isExternal = (href) => /^[a-z][a-z0-9+.-]*:/i.test(href);

/** `guides/first-shipment` or `/guides/index` → `guides/first-shipment`, `guides` */
function cleanSlug(slug) {
  return slug
    .replace(/^\/+|\/+$/g, '')
    .replace(/(^|\/)index$/, '')
    .replace(/\.(md|mdx|markdoc|mdoc)$/, '');
}

const docUrl = (slug) => (slug ? `/docs/${slug}/` : '/docs/');

/** info.title / info.description / info.version of a local spec, or {} if it cannot be read. */
function readSpecInfo(fullPath) {
  try {
    const text = fs.readFileSync(fullPath, 'utf8');
    const spec = fullPath.endsWith('.json') ? JSON.parse(text) : YAML.parse(text);
    return spec?.info || {};
  } catch {
    return {};
  }
}

/**
 * First paragraph of a Markdown description as plain text, for API cards: no headings, code blocks,
 * link targets or emphasis markers.
 */
export function plainSummary(markdown = '') {
  const paragraph =
    String(markdown)
      .replace(/```[\s\S]*?```/g, '')
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .find((block) => block && !/^(#|\||>|[-*] |\d+\. )/.test(block)) || '';
  return paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|\*)(\S[^*]*?)\1/g, '$2')
    .replace(/(^|\W)(__|_)(\S[^_]*?)\2(?=\W|$)/g, '$1$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeApi(api, baseDir) {
  const isRemote = isExternal(api.spec);
  const fullPath = isRemote ? api.spec : path.resolve(baseDir, api.spec);
  const info = isRemote ? {} : readSpecInfo(fullPath);
  return {
    id: api.id,
    spec: api.spec,
    fullPath,
    isRemote,
    // Local specs are published as /specs/<id><ext>, so an access rule for /apis/<id> also covers its spec.
    specUrl: isRemote ? api.spec : `${SPECS_PATH}/${api.id}${path.extname(fullPath) || '.json'}`,
    path: `${API_PATH}/${api.id}`,
    title: api.title || info.title || api.id,
    description: api.description ?? info.description ?? '',
    summary: plainSummary(api.description ?? info.description),
    version: info.version || '',
    category: api.category || 'General',
  };
}

/** Google Fonts stylesheet for a family name, in the weights the portal uses. */
export function googleFontsUrl(family) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
}

/** A font with only a `family` is loaded from Google Fonts; `url` points anywhere else. */
function normalizeFont(font) {
  return font ? { family: font.family, url: font.url || googleFontsUrl(font.family) } : null;
}

/** First doc page (sorted) inside a docs sub-folder, as a slug. */
function firstDocIn(docsDir, dir) {
  const folder = path.join(docsDir, dir);
  if (!fs.existsSync(folder)) return cleanSlug(dir);
  const files = fs
    .readdirSync(folder, { recursive: true })
    .filter((f) => /\.(md|mdx|markdoc)$/.test(f))
    .sort();
  return files.length ? cleanSlug(path.posix.join(dir, files[0].split(path.sep).join('/'))) : cleanSlug(dir);
}

/**
 * Sidebar items → Starlight sidebar entries, plus every URL prefix they cover and the first page.
 */
function buildSidebar(items, ctx) {
  const covered = [];
  let firstHref;
  const visit = (item) => {
    if (typeof item === 'string') item = { slug: item };
    if (item.slug !== undefined) {
      const slug = cleanSlug(item.slug);
      covered.push(docUrl(slug));
      firstHref ??= docUrl(slug);
      return { slug: slug ? `docs/${slug}` : 'docs', ...(item.label && { label: item.label }), ...(item.badge && { badge: item.badge }) };
    }
    if (item.autogenerate !== undefined) {
      const dir = cleanSlug(item.autogenerate);
      covered.push(docUrl(dir));
      firstHref ??= docUrl(firstDocIn(ctx.docsDir, dir));
      // Starlight wants a labelled group around the autogenerate entry.
      return {
        label: item.label,
        items: [{ autogenerate: { directory: dir ? `docs/${dir}` : 'docs' } }],
        ...(item.collapsed !== undefined && { collapsed: item.collapsed }),
        ...(item.badge && { badge: item.badge }),
      };
    }
    if (item.api !== undefined) {
      const api = ctx.apiById.get(item.api);
      firstHref ??= api.path;
      return { label: item.label || api.title, link: api.path, ...(item.badge && { badge: item.badge }) };
    }
    if (item.items !== undefined) {
      return {
        label: item.label,
        items: item.items.map(visit),
        ...(item.collapsed !== undefined && { collapsed: item.collapsed }),
        ...(item.badge && { badge: item.badge }),
      };
    }
    if (!isExternal(item.href)) firstHref ??= item.href;
    return {
      label: item.label,
      link: item.href,
      ...(isExternal(item.href) && { attrs: { target: '_blank', rel: 'noopener noreferrer' } }),
      ...(item.badge && { badge: item.badge }),
    };
  };
  const sidebar = items.map(visit);
  return { sidebar, covered, firstHref };
}

/**
 * `navigation` → header tabs. Every tab gets `href` (where it links) and `match` (URL prefixes for
 * which it is the active tab; the longest match wins). Documentation tabs also get `sidebar`.
 */
function buildTabs(navigation, ctx) {
  const tabs = navigation.map((tab) => {
    const base = { label: tab.label, icon: tab.icon, badge: tab.badge };
    if (tab.items || tab.autogenerate !== undefined) {
      const items = tab.items || [{ label: tab.label, autogenerate: tab.autogenerate }];
      const { sidebar, covered, firstHref } = buildSidebar(items, ctx);
      // A tab that is one autogenerated folder shows that folder's pages, not a group around them.
      const flat = tab.items ? sidebar : sidebar[0].items;
      return { ...base, kind: 'docs', href: firstHref || '/docs/', match: covered, sidebar: flat };
    }
    if (tab.api) {
      const api = ctx.apiById.get(tab.api);
      return { ...base, kind: 'api', api: api.id, href: api.path, match: [api.path] };
    }
    if (tab.catalog) {
      return { ...base, kind: 'catalog', href: CATALOG_PATH, match: [CATALOG_PATH] };
    }
    return { ...base, kind: 'link', href: tab.href, match: isExternal(tab.href) ? [] : [tab.href] };
  });

  // Docs pages listed in no tab belong to the first documentation tab; APIs without a tab of their own
  // belong to the catalog tab.
  const firstDocs = tabs.find((t) => t.kind === 'docs');
  if (firstDocs) firstDocs.match.push('/docs/');
  const catalogTab = tabs.find((t) => t.kind === 'catalog');
  if (catalogTab) {
    const tabbed = new Set(tabs.filter((t) => t.kind === 'api').map((t) => t.api));
    catalogTab.match.push(...ctx.apis.filter((a) => !tabbed.has(a.id)).map((a) => a.path));
  }
  return tabs;
}

/**
 * Checks that need the whole config: references between sections and <rapi-doc> attributes the
 * portal manages. Returns problem descriptions (empty when the config is consistent).
 *
 * @param {object} raw - Config that passed RapidocConfigSchema
 * @returns {string[]}
 */
export function checkReferences(raw) {
  const problems = [];
  const apiIds = new Set();
  (raw.apis || []).forEach((api, i) => {
    if (apiIds.has(api.id)) problems.push(`apis[${i}].id: "${api.id}" is used by another API`);
    apiIds.add(api.id);
  });
  const known = [...apiIds].join(', ') || 'none';
  const checkApi = (id, where) => {
    if (id !== undefined && !apiIds.has(id)) problems.push(`${where}.api: no API with id "${id}" in apis (ids: ${known})`);
  };
  const visit = (items, where) =>
    items.forEach((item, i) => {
      if (typeof item !== 'object') return;
      checkApi(item.api, `${where}[${i}]`);
      if (item.items) visit(item.items, `${where}[${i}].items`);
    });
  (raw.navigation || []).forEach((tab, i) => {
    checkApi(tab.api, `navigation[${i}]`);
    if (tab.items) visit(tab.items, `navigation[${i}].items`);
  });
  if ((raw.navigation || []).filter((t) => t.catalog).length > 1) problems.push('navigation: only one tab can have `catalog: true`');

  for (const key of Object.keys(raw.rapidoc || {})) {
    if (key in MANAGED_RAPIDOC_ATTRIBUTES) {
      const instead = MANAGED_RAPIDOC_ATTRIBUTES[key];
      problems.push(`rapidoc.${key}: set by the portal${instead ? `; use ${instead}` : ''}`);
    }
  }

  problems.push(...checkAccess(raw));
  (raw.redirects || []).forEach((redirect, i) => {
    if (redirect.from.startsWith('/_rapidoc/')) problems.push(`redirects[${i}].from: /_rapidoc/ is reserved for the portal`);
  });
  return problems;
}

/** `access` rules: reserved paths, and protection without sign-in. */
function checkAccess(raw) {
  const problems = [];
  const needsAuth = (allow, where) => {
    if (allow !== undefined && allow !== 'public' && !raw.auth) {
      problems.push(`${where}: needs "auth"; who is signed in is only known when sign-in is configured`);
    }
  };
  needsAuth(raw.access?.default, 'access.default');
  (raw.access?.rules || []).forEach((rule, i) => {
    const reserved = RESERVED_PREFIXES.find((prefix) => `${rule.path.replace(/\/+$/, '')}/`.startsWith(prefix));
    if (reserved) problems.push(`access.rules[${i}].path: ${reserved} holds no page content and is always public`);
    needsAuth(rule.allow, `access.rules[${i}].allow`);
  });
  return problems;
}

const DEFAULT_SCOPES = ['openid', 'profile', 'email'];

/** `auth` with defaults filled in. Holds no secrets: those are environment variables of `rapidoc serve`. */
function normalizeAuth(auth) {
  if (!auth) return null;
  return {
    provider: auth.provider || 'oidc',
    issuer: auth.issuer || null,
    clientId: auth.clientId || null,
    scopes: auth.scopes?.length ? auth.scopes : DEFAULT_SCOPES,
    claims: { groups: auth.claims?.groups || 'groups' },
    session: { maxAge: auth.session?.maxAge || '8h' },
    logout: auth.logout || 'local',
    label: auth.label || 'Sign in',
  };
}

/**
 * @param {object} raw - Config that passed RapidocConfigSchema and checkReferences()
 * @param {string} baseDir - Folder of the config file
 * @returns {object} The portal config (exposed to pages as `virtual:rapidoc-portal/config`)
 */
export function normalizeConfig(raw, baseDir = process.cwd()) {
  const apis = (raw.apis || []).map((api) => normalizeApi(api, baseDir));
  const docsDir = raw.docs?.dir || './docs';
  const docs = {
    dir: docsDir,
    fullPath: path.resolve(baseDir, docsDir),
    toc: raw.docs?.toc ?? {},
    editUrl: raw.docs?.editUrl || null,
  };
  docs.home = Boolean(findHomeDoc(docs.fullPath));

  const tabs = buildTabs(raw.navigation || [], { apis, apiById: new Map(apis.map((a) => [a.id, a])), docsDir: docs.fullPath });
  const catalogTab = tabs.find((t) => t.kind === 'catalog');

  const site = raw.site;
  const logoSrc = site.logo?.src;
  const logo = {
    light: typeof logoSrc === 'object' ? logoSrc.light : logoSrc || null,
    dark: typeof logoSrc === 'object' ? logoSrc.dark : logoSrc || null,
    text: site.logo?.text ?? (logoSrc ? null : site.title),
    alt: site.logo?.alt || site.title,
    href: site.logo?.href || '/',
  };

  return {
    site: {
      title: site.title,
      description: site.description || '',
      url: site.url || null,
      logo,
      favicon: site.favicon || null,
      banner: site.banner ? { dismissible: true, ...site.banner } : null,
    },
    theme: {
      primary: raw.theme?.primary || DEFAULT_PRIMARY_COLOR,
      mode: raw.theme?.mode || 'auto',
      fonts: { sans: normalizeFont(raw.theme?.fonts?.sans), mono: normalizeFont(raw.theme?.fonts?.mono) },
    },
    header: {
      links: raw.header?.links || [],
      themeSwitcher: raw.header?.themeSwitcher !== false,
    },
    tabs,
    apis,
    catalog: { path: CATALOG_PATH, label: catalogTab?.label || 'API Catalog' },
    docs,
    footer: raw.footer === false ? false : { branding: true, ...raw.footer },
    rapidoc: Object.fromEntries(Object.entries(raw.rapidoc || {}).map(([key, value]) => [key, String(value)])),
    search: raw.search !== false,
    redirects: [
      ...(raw.redirects || []),
      ...(apis.length && !raw.redirects?.some((r) => r.from.replace(/\/+$/, '') === API_PATH)
        ? [{ from: API_PATH, to: CATALOG_PATH }]
        : []),
    ],
    auth: normalizeAuth(raw.auth),
    access: normalizeAccess(raw.access),
    baseDir,
  };
}
