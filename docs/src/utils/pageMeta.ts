import { testListData } from '../page-data/tests.ts';
import { exampleListData } from '../page-data/example-list.ts';

export interface ResolvedPageMeta {
  title: string;
  description: string;
  validates?: string[];
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Automatically looks up title and description for a test page from tests.yaml (testListData).
 */
export function findTestBySlug(slug: string, data = testListData): ResolvedPageMeta {
  if (!slug) {
    return { title: '', description: '' };
  }

  const allTests = [...(data?.basic || []), ...(data?.advanced || [])];
  for (const item of allTests) {
    if (item[slug]) {
      const test = item[slug];
      const title = test.title || formatSlug(slug);
      let description = (test as any).description || '';
      if (!description) {
        if (test.validates && test.validates.length > 0) {
          description = `Validates ${test.validates.join('; ')} in RapiDoc.`;
        } else {
          description = `OpenAPI schema edge case and rendering validation test for ${title} in RapiDoc.`;
        }
      }
      return {
        title,
        description,
        validates: test.validates || [],
      };
    }
  }

  const cleanTitle = formatSlug(slug);
  return {
    title: cleanTitle,
    description: `OpenAPI schema edge case and rendering validation test for ${cleanTitle} in RapiDoc.`,
  };
}

/**
 * Automatically looks up title and description for an example page from example-list.yaml (exampleListData).
 */
export function findExampleBySlug(slug: string, pathname?: string, data = exampleListData): ResolvedPageMeta {
  if (!slug) {
    return { title: '', description: '' };
  }

  const targetHref = `/examples/${slug}`;

  for (const group of data?.examples || []) {
    const mainKey = Object.keys(group)[0];
    if (!mainKey) continue;
    const item = group[mainKey];
    if (!item) continue;

    // 1. Direct top-level match
    if (item.href === targetHref || (pathname && item.href === pathname) || item.href?.replace(/\/+$/, '').endsWith(`/${slug}`)) {
      return {
        title: mainKey,
        description:
          item.description || `Interactive live example demonstrating ${mainKey} configuration and features in RapiDoc OpenAPI viewer.`,
      };
    }

    // 2. Sub-example match
    if (Array.isArray(item.subExamples)) {
      for (const subGroup of item.subExamples) {
        const subKey = Object.keys(subGroup)[0];
        if (!subKey) continue;
        const subItem = subGroup[subKey];
        if (
          subItem?.href === targetHref ||
          (pathname && subItem?.href === pathname) ||
          subItem?.href?.replace(/\/+$/, '').endsWith(`/${slug}`)
        ) {
          const combinedTitle = subKey.toLowerCase().includes(mainKey.toLowerCase()) ? subKey : `${mainKey} - ${subKey}`;
          return {
            title: combinedTitle,
            description:
              (subItem as any).description ||
              item.description ||
              `Interactive live example demonstrating ${combinedTitle} configuration and features in RapiDoc OpenAPI viewer.`,
          };
        }
      }
    }
  }

  const cleanTitle = formatSlug(slug);
  return {
    title: cleanTitle,
    description: `Interactive live example demonstrating ${cleanTitle} configuration and features in RapiDoc OpenAPI viewer.`,
  };
}
