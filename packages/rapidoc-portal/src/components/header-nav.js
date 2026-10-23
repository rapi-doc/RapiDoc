/**
 * Header navigation, in two rows: `config.header.links` (row 1, right of the search) and
 * `config.tabs` (row 2), both resolved by src/config/normalizer.js.
 */

/**
 * The tab whose `match` prefix is the longest match for the path, or undefined.
 *
 * @param {Array<{match: string[]}>} tabs
 * @param {string} pathname
 */
export function activeTab(tabs, pathname) {
  const path = `${stripSlash(pathname)}/`;
  let best;
  let bestLength = 0;
  for (const tab of tabs) {
    for (const prefix of tab.match) {
      const p = `${stripSlash(prefix)}/`;
      if (path.startsWith(p) && p.length > bestLength) {
        best = tab;
        bestLength = p.length;
      }
    }
  }
  return best;
}

/** Tabs and header links as one list, for the narrow-screen menus. */
export function mobileNavLinks(config) {
  return [...(config?.tabs || []), ...(config?.header?.links || [])];
}

function stripSlash(href = '') {
  return href.length > 1 ? href.replace(/\/+$/, '') : href;
}
