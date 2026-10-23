import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { findConfigFile, parseRawFile } from './loader.js';
import { RapidocConfigSchema } from './schema.js';
import { checkReferences } from './normalizer.js';
import { describeIssues, MANAGED_RAPIDOC_ATTRIBUTES } from './errors.js';

/**
 * `rapidoc migrate`: converts a v1 rapidoc.config.yaml, a Redocly project (redocly.yaml + sidebars.yaml)
 * or a Zudoku config into a v2 rapidoc.config.yaml. Only this module knows the older key names; the
 * loader accepts v2 only.
 */

export const MIGRATION_SOURCES = {
  v1: ['rapidoc.config.yaml', 'rapidoc.config.yml', 'rapidoc.config.json', 'rapidoc.config.js', 'rapidoc.config.mjs'],
  redocly: ['redocly.yaml', 'redocly.yml'],
  zudoku: ['zudoku.config.ts', 'zudoku.config.mjs', 'zudoku.config.js'],
};

const SCHEMA_COMMENT = '# yaml-language-server: $schema=./node_modules/@rapidoc/portal/schema.json\n';

const isExternal = (href) => /^[a-z][a-z0-9+.-]*:/i.test(href || '');
const camelToKebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));

/** `/docs/guides/intro`, `guides/intro.md` → `guides/intro`; null for paths outside /docs/. */
function docSlug(href, { bare = false } = {}) {
  if (!href || isExternal(href)) return null;
  let p = href.replace(/[#?].*$/, '');
  if (p.startsWith('/docs/')) p = p.slice('/docs/'.length);
  else if (p === '/docs') p = '';
  else if (!bare) return null;
  return p.replace(/^\/+|\/+$/g, '').replace(/\.(md|mdx|markdoc|mdoc)$/, '');
}

function idFromSpec(spec) {
  return path
    .basename(spec || 'api', path.extname(spec || ''))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** v1 / Redocly / Zudoku `apis` (list or map) → v2 list. */
function convertApis(rawApis) {
  if (!rawApis) return [];
  const entries = Array.isArray(rawApis)
    ? rawApis.map((api) => [api.id || api.name, api])
    : Object.entries(rawApis).map(([id, api]) => [id, typeof api === 'string' ? { root: api } : api]);
  return entries.map(([id, api]) => {
    const spec = api.spec || api.root || api.input;
    const apiId = idFromSpec(id || spec);
    return compact({
      id: apiId,
      spec,
      path: api.path && api.path.replace(/\/+$/, '') !== `/apis/${apiId}` ? api.path : undefined,
      title: api.title,
      description: api.description,
      category: api.category || (Array.isArray(api.categories) ? api.categories[0]?.label : undefined),
      featured: api.featured || api.highlighted || api.pinned ? true : undefined,
    });
  });
}

/** A v1/Redocly sidebar item → v2 sidebar item. */
function convertSidebarItem(item, apiIds) {
  if (typeof item === 'string') return docSlug(item, { bare: true });
  const label = item.label || item.title || item.name;
  if (item.api && apiIds.has(item.api)) return compact({ label, api: item.api });
  if (item.items || item.pages) {
    return compact({ label: label || item.group, items: (item.items || item.pages).map((i) => convertSidebarItem(i, apiIds)) });
  }
  const target = item.path || item.page || item.href || item.to || item.link;
  const slug = item.page ? docSlug(item.page, { bare: true }) : docSlug(target);
  if (slug !== null) return label ? { label, slug } : slug;
  return compact({ label, href: target });
}

/** v1 / Redocly navigation groups → items of one documentation tab. */
function convertGroups(groups, apiIds) {
  return groups.map((group) => {
    if (typeof group === 'string' || !(group.items || group.pages)) return convertSidebarItem(group, apiIds);
    return compact({
      label: group.title || group.label || group.group,
      items: (group.items || group.pages).map((i) => convertSidebarItem(i, apiIds)),
    });
  });
}

function convertMenuItem(item) {
  return compact({
    label: item.label || item.title,
    href: item.href || item.path,
    icon: item.icon,
    description: item.description,
    badge: item.badge,
    items: (item.items || item.features)?.map((f) =>
      compact({ label: f.label || f.title, href: f.href || f.path || item.href, icon: f.icon })
    ),
  });
}

/** rapidoc: / theme.openapi attributes → kebab-case passthrough + the theme keys they become. */
function convertRapidoc(options = {}, theme) {
  const rapidoc = {};
  for (const [key, value] of Object.entries(options)) {
    const attr = camelToKebab(key);
    if (attr === 'primary-color') theme.primary ??= String(value);
    else if (attr === 'color-scheme' && ['dark', 'light', 'auto'].includes(value)) theme.mode ??= value;
    else if (attr === 'theme' && ['dark', 'light'].includes(value)) theme.mode ??= value;
    else if (!(attr in MANAGED_RAPIDOC_ATTRIBUTES)) rapidoc[attr] = value;
  }
  return rapidoc;
}

function convertFooter(footer) {
  if (footer === false) return false;
  if (!footer || typeof footer !== 'object') return undefined;
  return compact({
    columns: footer.columns?.map((col) => ({
      title: col.title,
      links: (col.links || col.items || []).map((l) => ({ label: l.label || l.title, href: l.href || l.path })),
    })),
    social: footer.social?.map((s) => ({ icon: s.icon, href: s.href })),
    copyright: footer.copyright,
    branding: footer.branding === false ? false : undefined,
  });
}

function convertLogo(logo, title) {
  if (!logo) return undefined;
  if (typeof logo === 'string') return { src: logo };
  const src =
    logo.src || (logo.light && logo.dark && logo.light !== logo.dark ? { light: logo.light, dark: logo.dark } : logo.light || logo.dark);
  return compact({
    src: typeof src === 'object' && src.light === src.dark ? src.light : src,
    text: logo.text && logo.text !== title ? logo.text : src ? undefined : logo.text,
    alt: logo.alt && logo.alt !== 'Logo' ? logo.alt : undefined,
    href: logo.href && logo.href !== '/' ? logo.href : undefined,
  });
}

function convertTheme(raw) {
  const font = raw.theme?.font;
  const fonts = font
    ? compact({
        sans: font.name ? compact({ family: font.name, url: font.url }) : undefined,
        mono: font.monoName ? compact({ family: font.monoName, url: font.monoUrl }) : undefined,
      })
    : undefined;
  return compact({ fonts: fonts && Object.keys(fonts).length ? fonts : undefined });
}

/**
 * Tabs from v1 `site.headerLinks`: links to docs, an API, or the catalog become tabs (in their order);
 * everything else stays in the header. Without headerLinks: Documentation, featured APIs, catalog.
 */
function splitHeaderLinks(headerLinks, docsItems, apis) {
  const apiByPath = new Map(apis.map((a) => [a.path || `/apis/${a.id}`, a]));
  const tabs = [];
  const links = [];
  const docsTab = docsItems.length ? { label: 'Documentation', icon: 'book', items: docsItems } : null;
  let addedDocs = false;

  for (const link of headerLinks || []) {
    const href = (link.href || link.path || '').replace(/\/+$/, '');
    if (!link.items?.length && docsTab && !addedDocs && docSlug(href) !== null) {
      tabs.push({ ...docsTab, label: link.label });
      addedDocs = true;
    } else if (!link.items?.length && href === '/catalog') {
      tabs.push({ label: link.label, icon: 'grid', catalog: true });
    } else if (!link.items?.length && apiByPath.has(href)) {
      tabs.push({ label: link.label, icon: 'code', api: apiByPath.get(href).id });
    } else if (link.items?.length) {
      links.push(compact({ label: link.label, icon: link.icon, items: link.items.map(convertMenuItem) }));
    } else {
      links.push(compact({ label: link.label, href: link.href || link.path, icon: link.icon }));
    }
  }

  if (!headerLinks?.length) {
    tabs.push(...apis.filter((a) => a.featured).map((a) => ({ label: a.title || a.id, icon: 'code', api: a.id })));
    if (apis.length) tabs.push({ label: 'API Catalog', icon: 'grid', catalog: true });
  }
  if (docsTab && !addedDocs) tabs.unshift(docsTab);
  return { tabs, links };
}

/** v1 rapidoc.config.yaml → v2. */
function fromV1(raw) {
  const apis = convertApis(raw.apis);
  const apiIds = new Set(apis.map((a) => a.id));
  const site = raw.site || {};
  const theme = convertTheme(raw);
  const rapidoc = convertRapidoc({ ...raw.rapidoc, ...raw.theme?.openapi }, theme);
  const docsItems = convertGroups(raw.navigation || raw.sidebars || [], apiIds);
  const { tabs, links } = splitHeaderLinks(site.headerLinks || raw.headerLinks, docsItems, apis);
  const announcement = site.announcement || raw.announcement;
  const docsDir = raw.docs?.dir || raw.docs?.path || raw.docs?.files || (typeof raw.docs === 'string' ? raw.docs : undefined);

  return assemble({
    site: compact({
      title: site.title || 'Developer Portal',
      description: site.description || site.tagline,
      logo: convertLogo(site.logo, site.title),
      favicon: site.favicon,
      banner: announcement?.text
        ? compact({
            message: announcement.text,
            href: announcement.link,
            dismissible: announcement.dismissible === false ? false : undefined,
            background: announcement.bgColor,
            color: announcement.textColor,
          })
        : undefined,
    }),
    theme,
    header: links.length ? { links } : undefined,
    navigation: tabs,
    apis,
    docs: docsDir && docsDir.replace(/\/$/, '') !== './docs' ? { dir: docsDir } : undefined,
    footer: convertFooter(site.footer ?? raw.footer),
    rapidoc,
    search: raw.search === false || raw.search?.enabled === false ? false : undefined,
  });
}

/** Zudoku navigation item → v2 sidebar item. */
function fromZudokuItem(item, apiPaths) {
  if (typeof item === 'string') return docSlug(item, { bare: true });
  if (item.type === 'doc')
    return item.label ? { label: item.label, slug: docSlug(item.file, { bare: true }) } : docSlug(item.file, { bare: true });
  if (item.type === 'category') {
    return compact({
      label: item.label,
      collapsed: item.collapsed,
      items: (item.items || []).map((i) => fromZudokuItem(i, apiPaths)).filter(Boolean),
    });
  }
  if (item.type === 'link') {
    if (apiPaths.has(item.to?.replace(/\/+$/, ''))) return { label: item.label, api: apiPaths.get(item.to.replace(/\/+$/, '')) };
    return { label: item.label, href: item.to };
  }
  return null; // separator, section, filter, custom-page: no v2 equivalent
}

/** zudoku.config.* → v2. Zudoku's top-level navigation items are tabs already. */
function fromZudoku(raw) {
  const apis = convertApis(Array.isArray(raw.apis) ? raw.apis : raw.apis ? [raw.apis] : []);
  const apiPaths = new Map(apis.map((a) => [(a.path || `/apis/${a.id}`).replace(/\/+$/, ''), a.id]));
  const tabs = (raw.navigation || [])
    .map((item) => {
      const converted = fromZudokuItem(item, apiPaths);
      if (!converted || typeof converted === 'string') return converted && { label: converted, items: [converted] };
      if (converted.api) return compact({ label: converted.label, icon: item.icon, api: converted.api });
      if (converted.href) return compact({ label: converted.label, icon: item.icon, href: converted.href });
      if (converted.slug) return compact({ label: converted.label, icon: item.icon, items: [converted.slug] });
      return compact({ label: converted.label, icon: item.icon, items: converted.items });
    })
    .filter(Boolean);
  const files = Array.isArray(raw.docs?.files) ? raw.docs.files[0] : raw.docs?.files;
  const docsDir = files ? `./${files.replace(/^\/+/, '').split(/[*{]/)[0].replace(/\/+$/, '')}` : undefined;
  const logoSrc = raw.site?.logo?.src;

  return assemble({
    site: compact({
      title: raw.site?.title || raw.metadata?.title || 'Developer Portal',
      description: raw.metadata?.description,
      logo: logoSrc ? { src: typeof logoSrc === 'object' && logoSrc.light === logoSrc.dark ? logoSrc.light : logoSrc } : undefined,
      favicon: raw.metadata?.favicon,
    }),
    navigation: tabs,
    apis,
    docs: docsDir && docsDir !== './docs' ? { dir: docsDir } : undefined,
    redirects: raw.redirects?.length ? raw.redirects : undefined,
  });
}

/** redocly.yaml (+ sidebars.yaml, already merged in as `sidebars`) → v2. */
function fromRedocly(raw) {
  return fromV1({ ...raw, site: { title: raw.seo?.title || raw.site?.title, ...raw.site } });
}

/** Drops empty sections, `featured` (a v1-only hint) and sets the key order. */
function assemble(config) {
  const apis = config.apis?.map(({ featured, ...api }) => api); // eslint-disable-line no-unused-vars
  return compact({
    site: config.site,
    theme:
      config.theme && Object.keys(config.theme).length
        ? compact({ primary: config.theme.primary, mode: config.theme.mode, fonts: config.theme.fonts })
        : undefined,
    header: config.header,
    navigation: config.navigation?.length ? config.navigation : undefined,
    apis: apis?.length ? apis : undefined,
    docs: config.docs,
    footer: config.footer,
    rapidoc: config.rapidoc && Object.keys(config.rapidoc).length ? config.rapidoc : undefined,
    search: config.search,
    redirects: config.redirects,
  });
}

/**
 * Converts a parsed config of the given kind into a v2 config object.
 *
 * @param {object} raw - Parsed source config
 * @param {'v1' | 'redocly' | 'zudoku'} from
 * @returns {{ config: object, problems: string[] }} problems: what still fails v2 validation
 */
export function convertConfig(raw, from) {
  const convert = { v1: fromV1, redocly: fromRedocly, zudoku: fromZudoku }[from];
  if (!convert) throw new Error(`Unknown migration source "${from}". Use one of: ${Object.keys(MIGRATION_SOURCES).join(', ')}`);
  const config = convert(raw || {});
  const result = RapidocConfigSchema.safeParse(config);
  const problems = result.success ? checkReferences(result.data) : describeIssues(result.error.issues).map((p) => p.text);
  return { config, problems };
}

/** Finds and parses the source config (with Redocly's sidebars.yaml). */
async function readSource(sourceDir, from) {
  const candidates = MIGRATION_SOURCES[from];
  if (!candidates) throw new Error(`Unknown migration source "${from}". Use one of: ${Object.keys(MIGRATION_SOURCES).join(', ')}`);
  const file = candidates.map((name) => path.join(sourceDir, name)).find((p) => fs.existsSync(p));
  if (!file) throw new Error(`No ${candidates.join(' / ')} in "${sourceDir}".`);
  const raw = (await parseRawFile(file)) || {};
  if (from === 'redocly' && !raw.navigation && !raw.sidebars) {
    const sidebars = ['sidebars.yaml', 'sidebars.yml'].map((name) => path.join(sourceDir, name)).find((p) => fs.existsSync(p));
    if (sidebars) raw.sidebars = YAML.parse(fs.readFileSync(sidebars, 'utf8'));
  }
  return { file, raw };
}

/**
 * @param {string} sourceDir
 * @param {'v1' | 'redocly' | 'zudoku'} [from] - Default: whichever source config is found first
 * @returns {Promise<{ content: string, problems: string[], sourceFile: string }>}
 */
export async function generateMigratedConfig(sourceDir, from) {
  const kind = from || Object.keys(MIGRATION_SOURCES).find((k) => MIGRATION_SOURCES[k].some((n) => fs.existsSync(path.join(sourceDir, n))));
  if (!kind) throw new Error(`Nothing to migrate in "${sourceDir}": no rapidoc.config.yaml, redocly.yaml or zudoku.config.*`);
  const { file, raw } = await readSource(sourceDir, kind);
  const { config, problems } = convertConfig(raw, kind);
  return { content: SCHEMA_COMMENT + YAML.stringify(config, { indent: 2, lineWidth: 0 }), problems, sourceFile: file };
}

/**
 * Writes the converted config to <targetDir>/rapidoc.config.yaml. A v1 config being replaced is kept as
 * rapidoc.config.v1.yaml.
 *
 * @param {string} targetDir
 * @param {{ from?: 'v1' | 'redocly' | 'zudoku', overwrite?: boolean }} [options]
 * @returns {Promise<{ filePath: string, content: string, problems: string[], backupPath: string | null }>}
 */
export async function migrateConfig(targetDir = process.cwd(), options = {}) {
  const outputPath = path.join(targetDir, 'rapidoc.config.yaml');
  const { content, problems, sourceFile } = await generateMigratedConfig(targetDir, options.from);
  const replacingSource = path.resolve(sourceFile) === path.resolve(findConfigFile(targetDir) || '');

  let backupPath = null;
  if (replacingSource) {
    backupPath = path.join(targetDir, `rapidoc.config.v1${path.extname(sourceFile)}`);
    fs.copyFileSync(sourceFile, backupPath);
    if (sourceFile !== outputPath) fs.rmSync(sourceFile);
  } else if (fs.existsSync(outputPath) && !options.overwrite) {
    throw new Error(`File already exists: "${outputPath}". Use --overwrite or pass { overwrite: true } to replace it.`);
  }

  fs.writeFileSync(outputPath, content, 'utf8');
  return { filePath: outputPath, content, problems, backupPath };
}
