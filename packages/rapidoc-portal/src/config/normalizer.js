import path from 'node:path';

/**
 * Converts camelCase string to kebab-case.
 * e.g. renderStyle -> render-style
 */
function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Normalizes an API definition into a unified object.
 */
function normalizeApiItem(id, item, baseDir) {
  const specLocation = item.root || item.input || item.spec;
  const isRemote = /^https?:\/\//i.test(specLocation);
  const apiId = id || item.id || item.name || path.basename(specLocation, path.extname(specLocation));
  const routePath = item.path || `/apis/${apiId}`;

  return {
    id: apiId,
    root: specLocation,
    fullPath: isRemote ? specLocation : path.resolve(baseDir, specLocation),
    isRemote,
    path: routePath,
    title: item.title || apiId,
    version: item.version || '',
    description: item.description || '',
    category: item.category || (Array.isArray(item.categories) && item.categories[0]?.label) || 'General',
  };
}

/**
 * Normalizes navigation items into a standard category/link tree.
 */
function normalizeNavigation(navItems, apis) {
  if (!navItems || !Array.isArray(navItems)) {
    return [];
  }

  const apiMap = new Map(apis.map((a) => [a.id, a]));

  return navItems.map((group) => {
    const title = group.title || group.label || group.group || 'General';
    const items = (group.items || []).map((item) => {
      if (typeof item === 'string') {
        return {
          label: item,
          path: item.startsWith('/') ? item : `/docs/${item}`,
          type: 'doc',
        };
      }

      const label = item.label || item.title || item.name || '';
      const apiRef = item.api || item.apiId;

      if (apiRef && apiMap.has(apiRef)) {
        const targetApi = apiMap.get(apiRef);
        return {
          label: label || targetApi.title,
          path: targetApi.path,
          api: apiRef,
          type: 'api',
        };
      }

      const itemPath = item.path || item.page || item.href || item.to || '';
      return {
        label,
        path: itemPath,
        type: itemPath.startsWith('http') ? 'external' : 'doc',
      };
    });

    return {
      title,
      items,
    };
  });
}

/**
 * Normalizes RapiDoc Web Component attributes.
 * Maps camelCase options to standard kebab-case attributes used by <rapi-doc>.
 */
function normalizeRapiDocOptions(options = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(options)) {
    normalized[camelToKebab(key)] = value;
  }
  return normalized;
}

/**
 * Main Normalizer: converts validated raw config into canonical internal representation.
 *
 * @param {object} rawConfig - Validated raw configuration object
 * @param {string} baseDir - Base directory where the config file was found
 * @returns {object} Canonical RapiDoc Portal configuration
 */
export function normalizeConfig(rawConfig, baseDir = process.cwd()) {
  // 1. Normalize APIs
  let rawApis = rawConfig.apis || {};
  let normalizedApis = [];

  if (Array.isArray(rawApis)) {
    normalizedApis = rawApis.map((item, idx) => normalizeApiItem(item.id || `api-${idx + 1}`, item, baseDir));
  } else if (typeof rawApis === 'object' && rawApis !== null) {
    normalizedApis = Object.entries(rawApis).map(([id, item]) => normalizeApiItem(id, item, baseDir));
  }

  // 2. Normalize Docs Directory
  const rawDocs = rawConfig.docs || { dir: './docs', engine: 'markdoc' };
  const docsDir = rawDocs.dir || rawDocs.files || './docs';
  const normalizedDocs = {
    dir: docsDir,
    fullPath: path.resolve(baseDir, docsDir),
    engine: rawDocs.engine || 'markdoc',
  };

  // 3. Normalize Navigation (combining navigation and sidebars)
  const rawNav = rawConfig.navigation || rawConfig.sidebars || [];
  const normalizedNav = normalizeNavigation(rawNav, normalizedApis);

  // 4. Normalize Site Info
  const rawSite = rawConfig.site || {};
  let normalizedLogo = null;
  if (rawSite.logo) {
    if (typeof rawSite.logo === 'string') {
      normalizedLogo = { light: rawSite.logo, dark: rawSite.logo, alt: rawSite.title || 'Logo', href: '/' };
    } else if (typeof rawSite.logo === 'object') {
      const src = rawSite.logo.src;
      const light = rawSite.logo.light || (typeof src === 'object' ? src.light : src) || '';
      const dark = rawSite.logo.dark || (typeof src === 'object' ? src.dark : src) || light;
      normalizedLogo = {
        light,
        dark,
        alt: rawSite.logo.alt || rawSite.title || 'Logo',
        href: rawSite.logo.href || '/',
      };
    }
  }

  const normalizedSite = {
    title: rawSite.title || 'Developer Portal',
    tagline: rawSite.tagline || rawSite.description || '',
    description: rawSite.description || rawSite.tagline || '',
    logo: normalizedLogo,
    favicon: rawSite.favicon || '/favicon.ico',
    baseUrl: rawSite.baseUrl || '/',
    announcement: rawSite.announcement || rawConfig.announcement || null,
    headerLinks: rawSite.headerLinks || rawConfig.headerLinks || null,
    footer: rawSite.footer || rawConfig.footer || null,
  };

  // 5. Normalize RapiDoc Component Attributes
  const rapidocConfig = {
    ...rawConfig.rapidoc,
    ...(rawConfig.theme?.openapi || {}), // Support Redocly's theme.openapi flags if present
  };
  const normalizedRapiDoc = normalizeRapiDocOptions(rapidocConfig);

  // 6. Search
  const rawSearch = rawConfig.search || { enabled: true, provider: 'pagefind' };
  const normalizedSearch = {
    enabled: typeof rawSearch === 'boolean' ? rawSearch : rawSearch.enabled !== false,
    provider: rawSearch.provider || 'pagefind',
  };

  // 7. Catalog Configuration
  const rawCatalog = rawConfig.catalog || rawConfig.catalogs || null;
  const normalizedCatalog = rawCatalog
    ? {
        path: typeof rawCatalog === 'object' && rawCatalog.path ? rawCatalog.path : '/catalog',
        label: typeof rawCatalog === 'object' && rawCatalog.label ? rawCatalog.label : 'API Catalog',
        title: typeof rawCatalog === 'object' && rawCatalog.title ? rawCatalog.title : 'API Catalog',
      }
    : { path: '/catalog', label: 'API Catalog', title: 'API Catalog' };

  return {
    site: normalizedSite,
    apis: normalizedApis,
    docs: normalizedDocs,
    navigation: normalizedNav,
    rapidoc: normalizedRapiDoc,
    search: normalizedSearch,
    catalog: normalizedCatalog,
    baseDir,
  };
}
