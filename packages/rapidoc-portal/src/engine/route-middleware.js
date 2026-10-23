/**
 * Starlight route middleware: each documentation tab has its own sidebar.
 *
 * Starlight's sidebar holds one group per documentation tab (starlight-options.js). For each page this
 * keeps only the entries of the active tab's group, and drops prev/next links that lead to another tab.
 */

import portalConfig from 'virtual:rapidoc-portal/config';
import { activeTab } from '../components/header-nav.js';

const docsTabs = portalConfig.tabs.filter((tab) => tab.kind === 'docs');

function collectHrefs(entries, hrefs = new Set()) {
  for (const entry of entries) {
    if (entry.type === 'link') hrefs.add(entry.href);
    else if (entry.entries) collectHrefs(entry.entries, hrefs);
  }
  return hrefs;
}

export async function onRequest(context, next) {
  const route = context.locals.starlightRoute;
  if (docsTabs.length > 0 && route.hasSidebar) {
    const tab = activeTab(docsTabs, context.url.pathname) || docsTabs[0];
    const group = route.sidebar[docsTabs.indexOf(tab)];
    if (group?.type === 'group') {
      route.sidebar = group.entries;
      const hrefs = collectHrefs(group.entries);
      const { prev, next: nextLink } = route.pagination;
      route.pagination = {
        prev: prev && hrefs.has(prev.href) ? prev : undefined,
        next: nextLink && hrefs.has(nextLink.href) ? nextLink : undefined,
      };
    }
  }
  await next();
}
