/**
 * Header navigation for a portal: `site.headerLinks` when configured (with a Documentation link
 * added if it has none), otherwise Documentation, API Catalog, up to three featured APIs and an
 * "APIs" menu listing every API.
 *
 * @param {object} config - Normalized portal config
 * @returns {Array<{label: string, href?: string, path?: string, items?: Array}>}
 */
export function resolveHeaderLinks(config) {
  const site = config?.site || {};
  const apis = config?.apis || [];
  const headerLinks = site.headerLinks;

  if (headerLinks?.length) {
    const hasDocLink = headerLinks.some((l) => l.href?.includes('/docs') || l.label?.toLowerCase().includes('doc'));
    return hasDocLink ? headerLinks : [{ label: 'Documentation', href: '/docs/documentation' }, ...headerLinks];
  }

  const featuredIds = site.featuredApis || site.highlightedApis || site.pinnedApis || [];
  const featured = apis.filter((a) => a.featured || a.highlighted || a.pinned || featuredIds.includes(a.id)).slice(0, 3);
  const apiHref = (a) => a.path || `/apis/${a.id}`;

  const links = [
    { label: 'Documentation', href: '/docs/documentation' },
    { label: 'API Catalog', href: '/catalog' },
    ...featured.map((a) => ({ label: a.title || a.id, href: apiHref(a) })),
  ];
  if (apis.length > 0) {
    links.push({
      label: 'APIs',
      items: apis.map((a) => ({
        label: a.title || a.id,
        href: apiHref(a),
        description: a.description || `Interactive OpenAPI reference for ${a.title || a.id}`,
        icon: 'zap',
      })),
    });
  }
  return links;
}
