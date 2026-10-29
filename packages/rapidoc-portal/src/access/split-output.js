/**
 * Splits a built portal for `rapidoc serve` (@rapidoc/server), when `auth` is configured:
 *
 *   <outDir>/public/              everything readers may get without signing in; safe on any static host
 *   <outDir>/protected/           pages, specs and files of non-public zones, served only by rapidoc serve
 *   <outDir>/protected/_rapidoc/search/<zone>/   that zone's search indexes (Pagefind bundle, search-index.json)
 *   <outDir>/protected/_rapidoc/search/_empty/   an empty Pagefind bundle, served for zones a reader may not see
 *   <outDir>/rapidoc-server.json  zones, the zone of every protected file, and the non-secret auth settings
 *
 * Paths inside public/ and protected/ are the URL paths. Every file gets exactly one zone (rules.js).
 */

import fs from 'node:fs';
import path from 'node:path';
import { createZoneMatcher, PUBLIC_ZONE } from './rules.js';

export const SERVER_MANIFEST = 'rapidoc-server.json';
export const SEARCH_URL_PREFIX = '/_rapidoc/search';
export const EMPTY_SEARCH_ZONE = '_empty';
const SEARCH_INDEX_FILE = 'search-index.json';

/** Build files that carry no page content: always public. `_rapidoc/` holds the build assets too. */
const ALWAYS_PUBLIC = [/^_rapidoc\//, /^assets\/rapidoc-min\.js$/, /^oauth-receiver\.html$/];

/** The logo and favicon stay public too: the sign-in error and access-denied pages show them. */
function brandingFiles(site) {
  return new Set([site.favicon, site.logo?.light, site.logo?.dark].filter((src) => src?.startsWith('/')).map((src) => src.slice(1)));
}

export class AccessRuleError extends Error {
  constructor(rules) {
    super(
      [
        'These access rules match no page or file (a typo would leave content public):',
        ...rules.map(({ index, path: rulePath }) => `  - access.rules[${index}].path: ${rulePath}`),
      ].join('\n')
    );
    this.name = 'AccessRuleError';
  }
}

/** A portal with sign-in is built for `rapidoc serve`. */
export function usesServerLayout(portalConfig) {
  return Boolean(portalConfig.auth);
}

/** Zones other than public, each with its own search bundle. */
function protectedZones(portalConfig) {
  return Object.keys(portalConfig.access.zones).filter((zone) => zone !== PUBLIC_ZONE);
}

/**
 * Starlight `pagefind.mergeIndex`: one bundle per protected zone. rapidoc serve answers each with the
 * real bundle or the empty one, so the search box only finds pages the reader may open.
 */
export function pagefindMergeIndex(portalConfig) {
  if (!usesServerLayout(portalConfig)) return [];
  return protectedZones(portalConfig).map((zone) => ({ bundlePath: `${SEARCH_URL_PREFIX}/${zone}/pagefind/`, baseUrl: '/' }));
}

/** `docs/a/index.html` → `/docs/a/`, `index.html` → `/`, `specs/x.json` → `/specs/x.json` */
export function urlOfFile(relPath) {
  if (relPath === 'index.html') return '/';
  if (relPath.endsWith('/index.html')) return `/${relPath.slice(0, -'index.html'.length)}`;
  return `/${relPath}`;
}

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'));
}

function moveFile(fromDir, toDir, relPath) {
  const target = path.join(toDir, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.renameSync(path.join(fromDir, relPath), target);
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data), 'utf8');
}

/** Sitemap without protected URLs and without the portal's own /_rapidoc/ pages. */
function filterSitemap(xml, zoneOf) {
  return xml.replace(/<url>[\s\S]*?<\/url>/g, (entry) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1];
    if (!loc) return entry;
    let pathname;
    try {
      pathname = new URL(loc).pathname;
    } catch {
      return entry;
    }
    return zoneOf(pathname) === PUBLIC_ZONE && !pathname.startsWith('/_rapidoc/') ? entry : '';
  });
}

/**
 * Pagefind bundles: public pages into public/pagefind/, each protected zone into its search folder, and one
 * empty bundle. Only pages with `data-pagefind-body` are indexed, as in Starlight's own index.
 */
async function writePagefindBundles(pagesByZone, publicDir, protectedDir, zones) {
  const pagefind = await import('pagefind');
  try {
    const write = async (pages, outputPath) => {
      const { index, errors } = await pagefind.createIndex({});
      if (!index) throw new Error(`Pagefind: ${errors.join(', ')}`);
      for (const page of pages) {
        const content = fs.readFileSync(page.file, 'utf8');
        if (content.includes('data-pagefind-body')) await index.addHTMLFile({ url: page.url, content });
      }
      const result = await index.writeFiles({ outputPath });
      if (result.errors?.length) throw new Error(`Pagefind: ${result.errors.join(', ')}`);
    };
    await write(pagesByZone.get(PUBLIC_ZONE) || [], path.join(publicDir, 'pagefind'));
    for (const zone of zones) {
      await write(pagesByZone.get(zone) || [], path.join(protectedDir, '_rapidoc/search', zone, 'pagefind'));
    }
    await write([], path.join(protectedDir, '_rapidoc/search', EMPTY_SEARCH_ZONE, 'pagefind'));
  } finally {
    await pagefind.close();
  }
}

/**
 * Splits `outDir` in place after `astro build`. Throws AccessRuleError when a rule matches nothing.
 *
 * @param {string} outDir - Output of astro build
 * @param {object} portalConfig - Normalized config with `auth`
 * @returns {Promise<{protectedPages: number, protectedFiles: number, zones: string[], warnings: string[]}>}
 */
export async function splitOutput(outDir, portalConfig) {
  const { access, apis = [] } = portalConfig;
  const matcher = createZoneMatcher(access);
  // A spec follows the pages of its version: /specs/<id><ext> follows /apis/<id>, /specs/<id>/<v><ext> follows /apis/<id>/<v>
  // (the default version's pages are at /apis/<id>).
  const versions = apis.flatMap((api) => (api.versions || [api]).map((version) => ({ ...version, id: api.id })));
  const specFiles = versions
    .filter((version) => !version.isRemote)
    .flatMap((version) => [version.specUrl, version.pinnedSpecUrl].filter(Boolean).map((url) => ({ url, version })));
  const specZones = new Map(specFiles.map(({ url, version }) => [url.slice(1), matcher.zoneOf(version.path)]));
  const branding = brandingFiles(portalConfig.site);
  const zoneOfFile = (relPath) => {
    if (branding.has(relPath) || ALWAYS_PUBLIC.some((pattern) => pattern.test(relPath))) return PUBLIC_ZONE;
    if (specZones.has(relPath)) return specZones.get(relPath);
    return matcher.zoneOf(urlOfFile(relPath));
  };

  const files = listFiles(outDir);
  const stagingPublic = path.join(outDir, '.rapidoc-public');
  const stagingProtected = path.join(outDir, '.rapidoc-protected');
  const manifestFiles = {};
  const pagesByZone = new Map();
  let searchIndex = null;

  for (const relPath of files) {
    if (relPath.startsWith('pagefind/')) {
      fs.rmSync(path.join(outDir, relPath)); // rebuilt per zone below
      continue;
    }
    if (relPath === SEARCH_INDEX_FILE) {
      searchIndex = JSON.parse(fs.readFileSync(path.join(outDir, relPath), 'utf8'));
      fs.rmSync(path.join(outDir, relPath));
      continue;
    }
    if (/^sitemap[^/]*\.xml$/.test(relPath)) {
      const file = path.join(outDir, relPath);
      fs.writeFileSync(file, filterSitemap(fs.readFileSync(file, 'utf8'), matcher.zoneOf), 'utf8');
    }

    const zone = zoneOfFile(relPath);
    const isPublic = zone === PUBLIC_ZONE;
    moveFile(outDir, isPublic ? stagingPublic : stagingProtected, relPath);
    if (!isPublic) manifestFiles[relPath] = zone;
    if (relPath.endsWith('.html')) {
      if (!pagesByZone.has(zone)) pagesByZone.set(zone, []);
      pagesByZone.get(zone).push({ url: urlOfFile(relPath), file: path.join(isPublic ? stagingPublic : stagingProtected, relPath) });
    }
  }

  const unmatched = access.rules.map((rule, index) => ({ ...rule, index })).filter(({ index }) => !matcher.matched.has(index));
  if (unmatched.length) throw new AccessRuleError(unmatched);

  const zones = protectedZones(portalConfig);

  // The portal's own search (search-index.json): public records for everyone, the rest per zone.
  if (searchIndex) {
    const byZone = Map.groupBy(searchIndex.records || [], (record) => matcher.zoneOf(record.url || '/'));
    const indexOf = (records = []) => ({ ...searchIndex, totalRecords: records.length, records });
    writeJson(path.join(stagingPublic, SEARCH_INDEX_FILE), indexOf(byZone.get(PUBLIC_ZONE)));
    for (const zone of zones) {
      if (byZone.has(zone)) writeJson(path.join(stagingProtected, '_rapidoc/search', zone, SEARCH_INDEX_FILE), indexOf(byZone.get(zone)));
    }
  }
  if (portalConfig.search) await writePagefindBundles(pagesByZone, stagingPublic, stagingProtected, zones);

  const warnings = [];
  for (const version of versions) {
    if (version.isRemote && matcher.zoneOf(version.path) !== PUBLIC_ZONE) {
      warnings.push(
        `API "${version.id}" is protected but its spec is a URL (${version.spec}); the browser fetches it from there, so protect it there.`
      );
    }
  }
  const protectedSpecs = new Map(specFiles.filter(({ url }) => manifestFiles[url.slice(1)]).map(({ url, version }) => [url, version.id]));
  for (const page of pagesByZone.get(PUBLIC_ZONE) || []) {
    const html = fs.readFileSync(page.file, 'utf8');
    for (const [specUrl, id] of protectedSpecs) {
      if (html.includes(`spec-url="${specUrl}"`)) {
        warnings.push(
          `${page.url} is public but embeds an operation of the protected API "${id}"; readers without access see an error there.`
        );
      }
    }
  }
  if (!portalConfig.site.url) {
    warnings.push('No site.url: set RAPIDOC_PUBLIC_URL when serving, or the sign-in redirect URL is taken from the request host.');
  }

  fs.mkdirSync(stagingPublic, { recursive: true });
  fs.mkdirSync(stagingProtected, { recursive: true });
  // Only the staging folders are left in outDir, so these names cannot clash with built files.
  for (const leftover of fs.readdirSync(outDir)) {
    if (leftover !== '.rapidoc-public' && leftover !== '.rapidoc-protected') fs.rmSync(path.join(outDir, leftover), { recursive: true });
  }
  fs.renameSync(stagingPublic, path.join(outDir, 'public'));
  fs.renameSync(stagingProtected, path.join(outDir, 'protected'));

  writeJson(path.join(outDir, SERVER_MANIFEST), {
    version: 1,
    site: { url: portalConfig.site.url },
    auth: portalConfig.auth,
    access: {
      defaultZone: access.default.zone,
      zones: access.zones,
      // Only the groups some rule names; the server keeps no other group names in the session.
      groups: [...new Set(Object.values(access.zones).flatMap((allow) => allow.groups || []))].sort(),
    },
    files: manifestFiles,
  });

  const protectedPages = Object.keys(manifestFiles).filter((file) => file.endsWith('.html')).length;
  return { protectedPages, protectedFiles: Object.keys(manifestFiles).length, zones, warnings };
}
