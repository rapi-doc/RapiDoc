import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { parseRawFile } from './loader.js';
import { RapidocConfigSchema } from './schema.js';
import { checkReferences } from './normalizer.js';
import { describeIssues, MANAGED_RAPIDOC_ATTRIBUTES } from './errors.js';

/**
 * `rapidoc migrate`: converts a Redocly project (redocly.yaml + sidebars.yaml) or a Zudoku config into a
 * rapidoc.config.yaml. Only this module knows their key names; the loader accepts rapidoc.config.yaml only.
 */

export const MIGRATION_SOURCES = {
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

/** Redocly / Zudoku `apis` (list or map) → v2 list. */
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
    });
  });
}

/** A Redocly sidebar item → v2 sidebar item. */
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

/** Redocly sidebar groups → items of one documentation tab. */
function convertGroups(groups, apiIds) {
  return groups.map((group) => {
    if (typeof group === 'string' || !(group.items || group.pages)) return convertSidebarItem(group, apiIds);
    return compact({
      label: group.title || group.label || group.group,
      items: (group.items || group.pages).map((i) => convertSidebarItem(i, apiIds)),
    });
  });
}

/** Redocly `theme.openapi` options → kebab-case <rapi-doc> attributes + the theme keys they become. */
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

/**
 * redocly.yaml (+ sidebars.yaml, already merged in as `sidebars`) → v2: the sidebars become one
 * Documentation tab, then an API Catalog tab; `theme.openapi` becomes theme keys and `rapidoc:` attributes.
 */
function fromRedocly(raw) {
  const apis = convertApis(raw.apis);
  const theme = {};
  const rapidoc = convertRapidoc(raw.theme?.openapi, theme);
  const docsItems = convertGroups(raw.sidebars || raw.navigation || [], new Set(apis.map((a) => a.id)));
  const navigation = [
    ...(docsItems.length ? [{ label: 'Documentation', icon: 'book', items: docsItems }] : []),
    ...(apis.length ? [{ label: 'API Catalog', icon: 'grid', catalog: true }] : []),
  ];
  return assemble({
    site: compact({ title: raw.seo?.title || raw.site?.title || 'Developer Portal', description: raw.seo?.description }),
    theme,
    navigation,
    apis,
    rapidoc,
  });
}

/**
 * Drops empty sections and sets the key order. v2 has no `apis[].path` (every API is at /apis/<id>),
 * so an API that lived elsewhere gets a redirect from its old URL.
 */
function assemble(config) {
  const apis = config.apis?.map(({ path, ...api }) => api); // eslint-disable-line no-unused-vars
  const apiRedirects = (config.apis || [])
    .filter((api) => api.path)
    .map((api) => ({ from: api.path.replace(/\/+$/, ''), to: `/apis/${api.id}` }));
  const redirects = [...(config.redirects || []), ...apiRedirects];
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
    redirects: redirects.length ? redirects : undefined,
  });
}

/**
 * Converts a parsed config of the given kind into a v2 config object.
 *
 * @param {object} raw - Parsed source config
 * @param {'redocly' | 'zudoku'} from
 * @returns {{ config: object, problems: string[] }} problems: what still fails v2 validation
 */
export function convertConfig(raw, from) {
  const convert = { redocly: fromRedocly, zudoku: fromZudoku }[from];
  if (!convert) throw new Error(`Unknown migration source "${from}". Use one of: ${Object.keys(MIGRATION_SOURCES).join(', ')}`);
  const config = convert(raw || {});
  const result = RapidocConfigSchema.safeParse(config);
  const problems = result.success ? checkReferences(result.data) : describeIssues(result.error.issues);
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
 * @param {'redocly' | 'zudoku'} [from] - Default: whichever source config is found first
 * @returns {Promise<{ content: string, problems: string[], sourceFile: string }>}
 */
export async function generateMigratedConfig(sourceDir, from) {
  const kind = from || Object.keys(MIGRATION_SOURCES).find((k) => MIGRATION_SOURCES[k].some((n) => fs.existsSync(path.join(sourceDir, n))));
  if (!kind) throw new Error(`Nothing to migrate in "${sourceDir}": no redocly.yaml or zudoku.config.*`);
  const { file, raw } = await readSource(sourceDir, kind);
  const { config, problems } = convertConfig(raw, kind);
  return { content: SCHEMA_COMMENT + YAML.stringify(config, { indent: 2, lineWidth: 0 }), problems, sourceFile: file };
}

/**
 * Writes the converted config to <targetDir>/rapidoc.config.yaml.
 *
 * @param {string} targetDir
 * @param {{ from?: 'redocly' | 'zudoku', overwrite?: boolean }} [options]
 * @returns {Promise<{ filePath: string, content: string, problems: string[] }>}
 */
export async function migrateConfig(targetDir = process.cwd(), options = {}) {
  const outputPath = path.join(targetDir, 'rapidoc.config.yaml');
  const { content, problems } = await generateMigratedConfig(targetDir, options.from);
  if (fs.existsSync(outputPath) && !options.overwrite) {
    throw new Error(`File already exists: "${outputPath}". Use --overwrite or pass { overwrite: true } to replace it.`);
  }
  fs.writeFileSync(outputPath, content, 'utf8');
  return { filePath: outputPath, content, problems };
}
