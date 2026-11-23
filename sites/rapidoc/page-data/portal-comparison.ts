// RapiDoc Portal against other developer portals, on the /portal/ page (components/ComparisonTable.astro).
// Every cell about another product was checked against its own documentation or pricing page on
// `checked`; the pages are in `sources`. Where a product's docs say nothing either way, the cell is "no"
// with the text "Not documented". A hosted product's feature on its free plan is "yes"; one that needs
// a paid plan is "paid", with the plan. Docusaurus is Docusaurus with the community
// docusaurus-openapi-docs plugin, the usual way to put an API reference in it.

import type { Comparison } from './comparison-types';

const PORTAL_DOCS = 'https://portal.rapidocui.com/docs';

export const portalComparison: Comparison = {
  ours: 'portal',
  caption: 'RapiDoc Portal compared with Mintlify, ReadMe, Redocly, Zudoku and Docusaurus',
  checked: '2026-11-23',
  legend: {
    yes: 'Included, free',
  },
  products: [
    { key: 'portal', name: 'RapiDoc Portal', sub: 'MIT · open source' },
    { key: 'mintlify', name: 'Mintlify' },
    { key: 'readme', name: 'ReadMe' },
    { key: 'redocly', name: 'Redocly' },
    { key: 'zudoku', name: 'Zudoku' },
    { key: 'docusaurus', name: 'Docusaurus' },
  ],
  groups: [
    {
      title: 'Docs and API reference',
      rows: [
        {
          feature: 'Guides as code',
          detail: 'Pages in your repository, reviewed like code',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Markdown, Markdoc and MDX',
              note: 'One rapidoc.config.yaml for the rest',
              href: `${PORTAL_DOCS}/writing/markdown/`,
            },
            mintlify: { verdict: 'yes', text: 'MDX synced from GitHub or GitLab' },
            readme: { verdict: 'yes', text: 'Two-way Git sync' },
            redocly: { verdict: 'paid', text: 'Markdown and Markdoc from Git', note: 'From $249 a month' },
            zudoku: { verdict: 'yes', text: 'Markdown and MDX' },
            docusaurus: { verdict: 'yes', text: 'Markdown and MDX' },
          },
        },
        {
          feature: 'API reference with Try',
          detail: 'Call the API from the page',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Rendered by RapiDoc',
              note: 'OpenAPI 3.0, 3.1 and Swagger 2.0, with OAuth 2.0 and PKCE',
              href: `${PORTAL_DOCS}/api-reference/reference-pages/`,
            },
            mintlify: { verdict: 'yes', text: 'API playground' },
            readme: { verdict: 'yes', text: 'Interactive reference' },
            redocly: { verdict: 'paid', text: 'Replay', note: 'On every plan' },
            zudoku: { verdict: 'yes', text: 'Built-in playground' },
            docusaurus: { verdict: 'partial', text: 'Community plugin', note: 'docusaurus-openapi-docs' },
          },
        },
        {
          feature: 'Several APIs and versions',
          detail: 'A catalog, and a version switcher',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'API catalog and versions',
              href: `${PORTAL_DOCS}/api-reference/catalog/`,
            },
            mintlify: { verdict: 'yes', text: 'Several specs, versions menu' },
            readme: { verdict: 'paid', text: 'One version free', note: 'More from Pro, $250 a month' },
            redocly: { verdict: 'paid', text: 'Catalog from the Scale plan', note: '$729 a month; versions on Pro' },
            zudoku: { verdict: 'yes', text: 'Several APIs, version selector' },
            docusaurus: { verdict: 'partial', text: 'Through the plugin' },
          },
        },
        {
          feature: 'Search',
          detail: 'Across guides and references',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Built in',
              note: 'The index is built with the site; no service to run or pay for',
              href: `${PORTAL_DOCS}/configuration/docs-search-redirects/`,
            },
            mintlify: { verdict: 'yes', text: 'Built in' },
            readme: { verdict: 'yes', text: 'Built in', note: 'Ask AI is a paid add-on' },
            redocly: { verdict: 'paid', text: 'On every plan', note: 'Facets from the Scale plan' },
            zudoku: { verdict: 'yes', text: 'Pagefind', note: 'Or Algolia or Inkeep' },
            docusaurus: { verdict: 'partial', text: 'A third-party service', note: 'Algolia DocSearch or a plugin' },
          },
        },
      ],
    },
    {
      title: 'Sign-in and access',
      rows: [
        {
          feature: 'Single sign-on for readers',
          detail: 'Partner and internal docs',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Any OpenID Connect provider',
              note: 'Okta, Entra ID, Google, Keycloak',
              href: `${PORTAL_DOCS}/access/overview/`,
            },
            mintlify: { verdict: 'paid', text: 'OAuth, OIDC or JWT on Enterprise' },
            readme: { verdict: 'paid', text: 'SSO on Enterprise', note: 'A password on Pro' },
            redocly: { verdict: 'paid', text: 'SSO from the Scale plan', note: 'Email or social login on Pro' },
            zudoku: { verdict: 'yes', text: 'OIDC, Auth0, Clerk and more' },
            docusaurus: { verdict: 'no', text: 'Not documented' },
          },
        },
        {
          feature: 'Access rules per page',
          detail: 'Checked on the server before anything is sent',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Pages, APIs and files',
              note: 'By group or claim, checked by rapidoc serve',
              href: `${PORTAL_DOCS}/access/access-rules/`,
            },
            mintlify: { verdict: 'paid', text: 'Groups per page, on Enterprise' },
            readme: { verdict: 'paid', text: 'Whole project only', note: 'Private docs from Pro' },
            redocly: { verdict: 'paid', text: 'Page-level RBAC', note: 'Scale add-on, in Enterprise' },
            zudoku: { verdict: 'partial', text: 'In the browser on a static build', note: 'On the server with an SSR build' },
            docusaurus: { verdict: 'no', text: 'Not documented' },
          },
        },
      ],
    },
    {
      title: 'AI agents',
      rows: [
        {
          feature: 'llms.txt',
          detail: 'The docs as Markdown for AI tools',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'llms.txt and llms-full.txt',
              note: 'And every page as Markdown',
              href: `${PORTAL_DOCS}/configuration/llms/`,
            },
            mintlify: { verdict: 'yes', text: 'Generated' },
            readme: { verdict: 'yes', text: 'Generated' },
            redocly: { verdict: 'paid', text: 'Generated' },
            zudoku: { verdict: 'yes', text: 'Generated', note: 'Off by default' },
            docusaurus: { verdict: 'partial', text: 'Community plugins' },
          },
        },
        {
          feature: 'MCP server for your APIs',
          detail: 'Operations as tools for agents',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Every API and workflow',
              note: 'Hosted at /mcp, with the reader’s own access',
              href: `${PORTAL_DOCS}/tools/mcp-server/`,
            },
            mintlify: { verdict: 'partial', text: 'Searches the docs', note: 'Not the API’s operations' },
            readme: { verdict: 'yes', text: 'API tools', note: 'Docs search is a paid add-on' },
            redocly: { verdict: 'paid', text: 'Docs and APIs', note: 'On every plan' },
            zudoku: { verdict: 'partial', text: 'Shows an existing server', note: 'Does not generate one' },
            docusaurus: { verdict: 'no', text: 'Not documented' },
          },
        },
      ],
    },
    {
      title: 'Beyond the docs',
      rows: [
        {
          feature: 'Mock server',
          detail: 'Try before the API exists',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'RapiMock',
              note: 'Every API on one port, with OAuth scope checks',
              href: `${PORTAL_DOCS}/tools/mock-server/`,
            },
            mintlify: { verdict: 'no', text: 'Not documented' },
            readme: { verdict: 'no', text: 'Not documented' },
            redocly: { verdict: 'paid', text: 'Built in', note: 'On every plan' },
            zudoku: { verdict: 'no', text: 'Not documented' },
            docusaurus: { verdict: 'no', text: 'Not documented' },
          },
        },
        {
          feature: 'Arazzo workflows',
          detail: 'Multi-step journeys, in the portal',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'A page per workflow',
              note: 'A diagram, run step by step against the API or the mock',
              href: `${PORTAL_DOCS}/configuration/workflows/`,
            },
            mintlify: { verdict: 'no', text: 'Not documented' },
            readme: { verdict: 'no', text: 'Not documented' },
            redocly: { verdict: 'partial', text: 'Run by Respect, in the CLI', note: 'Not shown in the portal' },
            zudoku: { verdict: 'no', text: 'Not documented' },
            docusaurus: { verdict: 'no', text: 'Not documented' },
          },
        },
        {
          feature: 'Spec checks in CI',
          detail: 'Validate and lint before you publish',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'rapidoc validate and lint',
              note: 'And rapidoc migrate, from Zudoku or Redocly',
              href: `${PORTAL_DOCS}/tools/spec-checks/`,
            },
            mintlify: { verdict: 'yes', text: 'mint validate' },
            readme: { verdict: 'yes', text: 'rdme openapi validate' },
            redocly: { verdict: 'yes', text: 'Redocly CLI lint', note: 'MIT' },
            zudoku: { verdict: 'no', text: 'Not documented', note: 'The CLI runs dev, build and preview' },
            docusaurus: { verdict: 'no', text: 'Not documented', note: 'The plugin only generates pages' },
          },
        },
      ],
    },
    {
      title: 'License and hosting',
      rows: [
        {
          feature: 'License and price',
          detail: 'What it costs to run',
          cells: {
            portal: { verdict: 'yes', text: 'MIT, every package', note: 'No paid tier' },
            mintlify: { verdict: 'paid', text: 'Free plan; Pro $450 a month', note: 'Closed source' },
            readme: { verdict: 'paid', text: 'Free plan; Pro $250 a month', note: 'Closed source' },
            redocly: { verdict: 'paid', text: 'From $249 a month', note: 'No free plan; Redoc and the CLI are MIT' },
            zudoku: { verdict: 'yes', text: 'MIT', note: 'Optional hosting on Zuplo' },
            docusaurus: { verdict: 'yes', text: 'MIT' },
          },
        },
        {
          feature: 'Self-hosted',
          detail: 'Your servers, no third party',
          cells: {
            portal: {
              verdict: 'yes',
              text: 'Static files, or rapidoc serve',
              note: 'Sign-in on your servers; no telemetry',
              href: `${PORTAL_DOCS}/deploy/static-hosting/`,
            },
            mintlify: { verdict: 'paid', text: 'Enterprise only', note: 'Set up with Mintlify' },
            readme: { verdict: 'no', text: 'Hosted only' },
            redocly: { verdict: 'no', text: 'Hosted only', note: 'Single-tenant on Enterprise' },
            zudoku: { verdict: 'yes', text: 'Static or SSR build' },
            docusaurus: { verdict: 'yes', text: 'Static build' },
          },
        },
      ],
    },
  ],
  sources: {
    mintlify: [
      { label: 'Pricing', url: 'https://www.mintlify.com/pricing' },
      { label: 'Git sync', url: 'https://www.mintlify.com/docs/deploy/github' },
      { label: 'API playground', url: 'https://www.mintlify.com/docs/api-playground/openapi-setup' },
      { label: 'Authentication', url: 'https://www.mintlify.com/docs/deploy/authentication-setup' },
      { label: 'llms.txt', url: 'https://www.mintlify.com/docs/ai/llmstxt' },
      { label: 'MCP', url: 'https://www.mintlify.com/docs/ai/model-context-protocol' },
      { label: 'CLI', url: 'https://www.mintlify.com/docs/cli/commands' },
      { label: 'Self-hosting', url: 'https://www.mintlify.com/docs/deploy/self-host' },
    ],
    readme: [
      { label: 'Pricing', url: 'https://readme.com/pricing' },
      { label: 'Bi-directional sync', url: 'https://docs.readme.com/main/docs/bi-directional-sync' },
      { label: 'Versions', url: 'https://docs.readme.com/main/docs/versions' },
      { label: 'Private docs', url: 'https://docs.readme.com/main/docs/internal-documentation' },
      { label: 'llms.txt', url: 'https://docs.readme.com/main/docs/llmstxt' },
      { label: 'MCP server', url: 'https://docs.readme.com/main/docs/your-projects-mcp-server' },
      { label: 'rdme CLI', url: 'https://github.com/readmeio/rdme' },
    ],
    redocly: [
      { label: 'Pricing', url: 'https://redocly.com/pricing' },
      { label: 'Connect Git', url: 'https://redocly.com/docs/realm/reunite/project/connect-git/connect-git-provider' },
      { label: 'Search', url: 'https://redocly.com/docs/realm/config/search' },
      { label: 'RBAC', url: 'https://redocly.com/docs/realm/access/rbac' },
      { label: 'AI-ready docs', url: 'https://redocly.com/docs/realm/ai-ready' },
      { label: 'Mock server', url: 'https://redocly.com/docs/realm/config/mock-server' },
      { label: 'Respect', url: 'https://redocly.com/docs/cli/commands/respect' },
    ],
    zudoku: [
      { label: 'Zudoku on GitHub', url: 'https://github.com/zuplo/zudoku' },
      { label: 'API reference', url: 'https://zudoku.dev/docs/configuration/api-reference' },
      { label: 'Search', url: 'https://zudoku.dev/docs/configuration/search' },
      { label: 'Authentication', url: 'https://zudoku.dev/docs/configuration/authentication' },
      { label: 'Server-side protection', url: 'https://zudoku.dev/docs/guides/server-side-content-protection' },
      { label: 'llms.txt', url: 'https://zudoku.dev/docs/configuration/llms' },
      { label: 'MCP servers', url: 'https://zudoku.dev/docs/guides/mcp-servers' },
    ],
    docusaurus: [
      { label: 'Docusaurus on GitHub', url: 'https://github.com/facebook/docusaurus' },
      { label: 'docusaurus-openapi-docs', url: 'https://github.com/PaloAltoNetworks/docusaurus-openapi-docs' },
      { label: 'Search', url: 'https://docusaurus.io/docs/search' },
      { label: 'Deployment', url: 'https://docusaurus.io/docs/deployment' },
      { label: 'llms.txt issue', url: 'https://github.com/facebook/docusaurus/issues/10899' },
    ],
  },
};
