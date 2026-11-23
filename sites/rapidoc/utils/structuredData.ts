// Structured data (schema.org JSON-LD) for the home and feature pages: tells search engines and AI agents
// that each page is a software product, which family it belongs to, its license, version and repository.
// GlobalLayout renders what a page passes as `structuredData`. Versions come from the build info, which
// the package builds refresh from each package.json.

import { rapidocBuildInfo } from '../page-data/rapidoc-build-info';

const SITE = 'https://rapidocui.com';
const REPO = 'https://github.com/rapi-doc/RapiDoc';
const LICENSE = 'https://opensource.org/licenses/MIT';

/** The family, as one organization every product belongs to */
export const FAMILY = {
  '@type': 'Organization',
  '@id': `${SITE}/#family`,
  name: 'RapiDoc',
  url: `${SITE}/`,
  logo: `${SITE}/assets/images/rapidoc-leaves.png`,
  sameAs: [REPO, 'https://www.npmjs.com/package/rapidoc'],
};

type Product = {
  key: string;
  name: string;
  description: string;
  /** The feature page on rapidocui.com */
  path: string;
  /** The product's documentation, where it has its own site */
  docs?: string;
  /** The npm package whose version is the product's */
  npm?: string;
  /** Browser or Node: where it runs */
  runtime: 'browser' | 'node' | 'both';
  category?: string;
};

export const PRODUCTS: Product[] = [
  {
    key: 'rapidoc',
    name: 'RapiDoc',
    description:
      'The <rapi-doc> web component: an interactive API reference from an OpenAPI 3.0, 3.1 or Swagger 2.0 spec, with Try, an in-browser mock, themes and MCP server export. One HTML element, no runtime dependencies.',
    path: '/rapidoc/',
    npm: 'rapidoc',
    runtime: 'browser',
  },
  {
    key: 'rapidoc-mini',
    name: 'RapiDoc Mini',
    description:
      'The <rapi-doc-mini> web component: a few API operations, with Try, embedded in a blog post, guide or dashboard.',
    path: '/rapidoc-mini/',
    npm: 'rapidoc',
    runtime: 'browser',
  },
  {
    key: 'rapi-flow',
    name: 'RapiFlow',
    description:
      'The <rapi-flow> web component: draws the workflows of an Arazzo spec next to the API reference and runs them in the browser, against the API or a mock, and exports them as MCP tools.',
    path: '/rapi-flow/',
    docs: 'https://flow.rapidocui.com/',
    npm: 'rapidoc',
    runtime: 'browser',
  },
  {
    key: 'rapipdf',
    name: 'RapiPdf',
    description:
      'Turns an OpenAPI 3.x or Swagger 2.0 spec into a PDF: the <rapi-pdf> web component in the browser, rapipdf/node and `rapidoc pdf` in Node.',
    path: '/rapipdf/',
    npm: 'rapipdf',
    runtime: 'both',
  },
  {
    key: 'rapi-mock',
    name: 'RapiMock',
    description:
      'A mock server from an OpenAPI spec: request validation, OAuth scope and token checks, state that persists between requests, a UI to look inside, and endpoints for tests in any language.',
    path: '/rapi-mock/',
    docs: 'https://mock.rapidocui.com/',
    npm: '@rapidoc/mock',
    runtime: 'node',
  },
  {
    key: 'portal',
    name: 'RapiDoc Portal',
    description:
      'A docs-as-code developer portal: OpenAPI specs and Markdown or Markdoc guides become one static site with an API catalog, interactive references, search, Arazzo workflows, MCP manifests, llms.txt, and optional single sign-on (OpenID Connect) with access rules.',
    path: '/portal/',
    docs: 'https://portal.rapidocui.com/',
    npm: '@rapidoc/portal',
    runtime: 'node',
  },
  {
    key: 'cli',
    name: 'RapiDoc CLI',
    description:
      'The rapidoc command: previews, validates, lints and bundles OpenAPI specs, writes PDFs, runs mock servers, turns specs into MCP servers, and builds developer portals.',
    path: '/cli/',
    npm: '@rapidoc/cli',
    runtime: 'node',
  },
];

const versionOf = (npm?: string) => (npm ? rapidocBuildInfo.packages?.[npm]?.version : undefined);

/** One product as a SoftwareApplication, part of the family */
export function productData(key: string) {
  const product = PRODUCTS.find((p) => p.key === key);
  if (!product) throw new Error(`structuredData: no product "${key}"`);
  const version = versionOf(product.npm);
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}${product.path}#software`,
    name: product.name,
    description: product.description,
    url: `${SITE}${product.path}`,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'API documentation',
    operatingSystem:
      product.runtime === 'browser'
        ? 'Any (web browser)'
        : product.runtime === 'node'
          ? 'Node.js'
          : 'Any (web browser), Node.js',
    ...(version && { softwareVersion: version }),
    ...(product.docs && { softwareHelp: { '@type': 'CreativeWork', url: product.docs } }),
    ...(product.npm && { downloadUrl: `https://www.npmjs.com/package/${product.npm}` }),
    license: LICENSE,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': FAMILY['@id'] },
    isPartOf: { '@id': `${SITE}/#family-list` },
    codeRepository: REPO,
  };
}

/** A feature page: the product, and the family it belongs to */
export function productPageData(key: string) {
  return { '@context': 'https://schema.org', '@graph': [FAMILY, productData(key)] };
}

/** The home page: the site, the family and every product in it */
export function homePageData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      FAMILY,
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'RapiDoc',
        description:
          'The RapiDoc family of open-source tools for OpenAPI and Arazzo: API references, embedded endpoints, PDFs, mock servers, workflows and developer portals.',
        publisher: { '@id': FAMILY['@id'] },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE}/#family-list`,
        name: 'The RapiDoc family',
        itemListElement: PRODUCTS.map((product, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: productData(product.key),
        })),
      },
    ],
  };
}
