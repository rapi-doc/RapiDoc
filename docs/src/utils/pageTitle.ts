export interface PageTitleInfo {
  cleanTitle: string;
  hierarchyTitle: string;
  seoTitle: string;
  gaTitle: string;
  contentGroup: string;
}

/**
 * Strips common prefixes (e.g. "Tests |", "Example |") and suffixes
 * (e.g. "| RapiDoc", "| Rapidoc", "| RapiDoc Tests", "- Interactive OpenAPI Example | RapiDoc")
 * to produce the core subject of the page.
 */
export function cleanRawTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  let clean = rawTitle.trim();

  // Strip brand & template suffixes
  clean = clean.replace(/\s*-\s*Interactive\s+OpenAPI\s+Example\s*\|\s*RapiDoc\s*$/i, '');
  clean = clean.replace(/\s*\|\s*RapiDoc\s+Tests\s*$/i, '');
  clean = clean.replace(/\s*\|\s*RapiDoc\s*$/i, '');
  clean = clean.replace(/\s*\|\s*Rapidoc\s*$/i, '');

  // Strip section prefixes (e.g. "Tests |", "Example |", "Examples |", "Guide |", "Tests /")
  clean = clean.replace(/^(Examples?|Tests?|Guides?)\s*(\/|\|)\s*/i, '');

  // Clean any lingering edge pipes or whitespace
  clean = clean
    .replace(/^\|\s*/, '')
    .replace(/\s*\|$/, '')
    .trim();

  return clean;
}

/**
 * Computes hierarchical page title info for both SEO (<title>) and Google Analytics.
 *
 * For example:
 * - /examples/badges -> GA: "Examples / End-Point Badges", SEO: "Examples / End-Point Badges | RapiDoc"
 * - /tests/collapsable -> GA: "Tests / Collapsed Tags & scrollToPath", SEO: "Tests / Collapsed Tags & scrollToPath | RapiDoc"
 */
export function computePageTitleInfo(pathname: string, rawTitle?: string): PageTitleInfo {
  const cleanPath = (pathname || '').replace(/\/+$/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  const firstSeg = segments[0]?.toLowerCase() || '';
  const secondSeg = segments[1] || '';

  const siteName = 'RapiDoc';

  // 1. Determine Section & Content Group
  let section = '';
  let contentGroup = 'Home';

  if (firstSeg === 'examples') {
    section = 'Examples';
    contentGroup = 'Examples';
  } else if (firstSeg === 'tests') {
    section = 'Tests';
    contentGroup = 'Tests';
  } else if (firstSeg === 'guides') {
    section = 'Guides';
    contentGroup = 'Guides';
  } else if (firstSeg === 'docs') {
    section = 'Docs';
    contentGroup = 'Docs';
  } else if (firstSeg === 'api') {
    section = 'API';
    contentGroup = 'API';
  } else if (firstSeg === 'quickstart') {
    section = 'Quickstart';
    contentGroup = 'Quickstart';
  } else if (firstSeg) {
    section = firstSeg.charAt(0).toUpperCase() + firstSeg.slice(1);
    contentGroup = section;
  }

  // 2. Extract clean subject title
  let cleanSubject = cleanRawTitle(rawTitle || '');

  // If on a section index root (e.g. /examples, /tests, /api)
  if (!secondSeg && section) {
    if (firstSeg === 'examples') cleanSubject = 'Gallery';
    else if (firstSeg === 'tests') cleanSubject = 'Validation Matrix';
    else if (firstSeg === 'api') cleanSubject = 'Reference';
    else if (!cleanSubject) cleanSubject = section;
  } else if (!cleanSubject) {
    if (secondSeg) {
      cleanSubject = secondSeg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  // 3. Home / Root page
  if (!firstSeg) {
    const homeTitle = rawTitle || `${siteName} - Modern OpenAPI Spec Viewer & Console Web Component`;
    return {
      cleanTitle: 'Home',
      hierarchyTitle: 'Home',
      seoTitle: homeTitle,
      gaTitle: `Home - ${siteName}`,
      contentGroup: 'Home',
    };
  }

  // 4. Section Root pages (e.g. /examples, /tests, /api, /quickstart)
  if (!secondSeg) {
    if (firstSeg === 'api') {
      const seoTitle = rawTitle && !/rapidoc/i.test(rawTitle) ? `${rawTitle} | ${siteName}` : rawTitle || `API Reference | ${siteName}`;
      return {
        cleanTitle: 'API Reference',
        hierarchyTitle: 'API Reference',
        seoTitle,
        gaTitle: 'API Reference',
        contentGroup: 'API',
      };
    }
    if (firstSeg === 'quickstart') {
      return {
        cleanTitle: 'Quickstart Guide',
        hierarchyTitle: 'Quickstart Guide',
        seoTitle: rawTitle || `Quickstart Guide | ${siteName}`,
        gaTitle: 'Quickstart Guide',
        contentGroup: 'Quickstart',
      };
    }
    const hierarchy = `${section} / ${cleanSubject}`;
    const seoTitle = rawTitle && rawTitle.includes('|') && /gallery|matrix/i.test(rawTitle) ? rawTitle : `${hierarchy} | ${siteName}`;
    return {
      cleanTitle: cleanSubject,
      hierarchyTitle: hierarchy,
      seoTitle,
      gaTitle: hierarchy,
      contentGroup,
    };
  }

  // 5. Standard subpages (/examples/some-html, /tests/some-html, /guides/theme, etc.)
  const hierarchyTitle = `${section} / ${cleanSubject}`;
  const seoTitle = `${hierarchyTitle} | ${siteName}`;
  const gaTitle = hierarchyTitle;

  return {
    cleanTitle: cleanSubject,
    hierarchyTitle,
    seoTitle,
    gaTitle,
    contentGroup,
  };
}
