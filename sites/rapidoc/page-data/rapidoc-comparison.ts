// RapiDoc (and the family around it) against Redocly, Scalar and Swagger, on the /rapidoc/ page
// (components/ComparisonTable.astro). Every cell about another product was checked against its own
// documentation or pricing page on `checked`; the pages are in `sources`.

import type { Comparison } from './comparison-types';
import { rapidocBuildInfo } from './rapidoc-build-info';

export const rapidocComparison: Comparison = {
  ours: 'rapidoc',
  caption: 'RapiDoc compared with Redocly, Scalar and Swagger',
  checked: '2026-11-23',
  legend: {
    yes: 'Included, open source',
    partial: 'Limited, the rest is commercial',
  },
  products: [
    { key: 'rapidoc', name: 'RapiDoc', sub: 'MIT · open source' },
    { key: 'redocly', name: 'Redocly' },
    { key: 'scalar', name: 'Scalar' },
    { key: 'swagger', name: 'Swagger' },
  ],
  groups: [
    {
      title: 'API reference',
      rows: [
        {
          feature: 'How you add it',
          detail: 'What goes into your page',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'One web component',
              note: `<rapi-doc> in any framework or plain HTML, ${rapidocBuildInfo.bundle.gzip.formatted} gzipped, no dependencies`,
            },
            redocly: { verdict: 'yes', text: 'React app or standalone script' },
            scalar: { verdict: 'yes', text: 'Script tag or framework packages' },
            swagger: { verdict: 'yes', text: 'Standalone bundle or React component' },
          },
        },
        {
          feature: 'Try it console',
          detail: 'Call the API from the docs',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'Included',
              note: 'With OAuth 2.0, PKCE and API keys',
              href: '/docs/rapidoc/authentication/oauth/',
            },
            redocly: { verdict: 'paid', text: 'Replay, on paid plans', note: 'Not in open-source Redoc' },
            scalar: { verdict: 'yes', text: 'Included (API client)' },
            swagger: { verdict: 'yes', text: 'Included (Try it out)' },
          },
        },
        {
          feature: 'Layouts',
          detail: 'One reference, several audiences',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'Three render styles',
              note: 'Read, view and focused, plus <rapi-doc-mini> for one operation',
              href: '/docs/rapidoc/performance/render-modes/',
            },
            redocly: { verdict: 'yes', text: 'Three-panel layout' },
            scalar: { verdict: 'yes', text: 'Modern and classic layouts' },
            swagger: { verdict: 'yes', text: 'One collapsible list' },
          },
        },
      ],
    },
    {
      title: 'Mocking & workflows',
      rows: [
        {
          feature: 'Mock server',
          detail: 'Responses before the backend exists',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'In the browser and standalone',
              note: 'RapiMock: examples, generated data, request validation, OAuth scope checks',
              href: '/rapi-mock/',
            },
            redocly: { verdict: 'paid', text: 'On every paid plan' },
            scalar: { verdict: 'yes', text: 'Open-source mock server' },
            swagger: { verdict: 'paid', text: 'Swagger Studio (commercial)' },
          },
        },
        {
          feature: 'Arazzo workflows',
          detail: 'Multi-step API journeys',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: '<rapi-flow>',
              note: 'A diagram next to the reference, run step by step',
              href: '/rapi-flow/',
            },
            redocly: { verdict: 'yes', text: 'Respect, in Redocly CLI', note: 'Runs and lints them' },
            scalar: { verdict: 'no' },
            swagger: { verdict: 'no' },
          },
        },
      ],
    },
    {
      title: 'Developer portal',
      rows: [
        {
          feature: 'Docs-as-code portal',
          detail: 'Guides, references and a catalog',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'RapiDoc Portal',
              note: 'Markdown, Markdoc and MDX guides, API catalog, versions, search',
              href: 'https://portal.rapidocui.com/',
            },
            redocly: { verdict: 'paid', text: 'Redocly platform', note: 'From $249 a month' },
            scalar: { verdict: 'paid', text: 'Scalar Docs', note: 'Guides and custom domains from Pro' },
            swagger: { verdict: 'paid', text: 'Swagger Portal', note: 'A separate paid product' },
          },
        },
        {
          feature: 'Single sign-on (SSO) and access rules',
          detail: 'Private APIs and partner docs',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'SSO with any OpenID Connect provider',
              note: 'Okta, Entra ID, Google, Keycloak; per-page access rules, served by rapidoc serve on your servers',
              href: 'https://portal.rapidocui.com/docs/access/overview/',
            },
            redocly: { verdict: 'paid', text: 'SSO and RBAC from the Scale plan' },
            scalar: { verdict: 'paid', text: 'SSO on Business and Enterprise' },
            swagger: { verdict: 'paid', text: 'SAML SSO on Enterprise', note: 'In Swagger Studio' },
          },
        },
        {
          feature: 'AI agents (MCP)',
          detail: 'Your API as tools for agents',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'MCP export and hosting',
              note: 'Export a server from the browser, or host the tools at /mcp behind sign-in; llms.txt',
              href: '/docs/mcp/',
            },
            redocly: { verdict: 'paid', text: 'MCP server and llms.txt on paid plans' },
            scalar: { verdict: 'paid', text: 'Hosted MCP servers', note: 'From the Pro plan' },
            swagger: { verdict: 'paid', text: 'MCP server for Swagger Studio', note: 'And MCP server generation from an API' },
          },
        },
        {
          feature: 'Command line',
          detail: 'Checks in CI and local preview',
          cells: {
            rapidoc: {
              verdict: 'yes',
              text: 'rapidoc CLI',
              note: 'validate, lint, bundle, mock, and migrate from Redocly or Zudoku',
              href: '/docs/cli/',
            },
            redocly: { verdict: 'yes', text: 'Redocly CLI', note: 'lint, bundle, Respect' },
            scalar: { verdict: 'yes', text: 'Scalar CLI' },
            swagger: { verdict: 'paid', text: 'SwaggerHub CLI', note: 'Publishes APIs to Swagger Studio from CI' },
          },
        },
      ],
    },
    {
      title: 'License and hosting',
      rows: [
        {
          feature: 'License',
          detail: 'What you may do with it',
          cells: {
            rapidoc: { verdict: 'yes', text: 'MIT, every package', note: 'No paid tier' },
            redocly: { verdict: 'partial', text: 'Only Redoc and the CLI are MIT', note: 'Everything else is commercial' },
            scalar: { verdict: 'partial', text: 'Only the core is MIT', note: 'Docs and MCP are on hosted plans' },
            swagger: {
              verdict: 'partial',
              text: 'Only Swagger UI, Editor and Codegen are Apache 2.0',
              note: 'Swagger Studio and Portal are commercial',
            },
          },
        },
        {
          feature: 'Self-hosted',
          detail: 'Your servers, no third party',
          cells: {
            rapidoc: { verdict: 'yes', text: 'Everything', note: 'Static files, or rapidoc serve with sign-in; no telemetry' },
            redocly: { verdict: 'partial', text: 'Limited to basic Redoc', note: 'The platform is hosted only' },
            scalar: { verdict: 'partial', text: 'Limited to the reference, client and mock', note: 'Scalar Docs is hosted' },
            swagger: {
              verdict: 'partial',
              text: 'Limited to the open-source tools',
              note: 'Swagger Studio self-managed on a paid plan',
            },
          },
        },
      ],
    },
  ],
  sources: {
    redocly: [
      { label: 'Pricing', url: 'https://redocly.com/pricing' },
      { label: 'Redoc', url: 'https://github.com/Redocly/redoc' },
      { label: 'Redocly CLI', url: 'https://github.com/Redocly/redocly-cli' },
      { label: 'Mock server', url: 'https://redocly.com/docs/realm/config/mock-server' },
      { label: 'MCP server', url: 'https://redocly.com/docs/realm/customization/mcp-server' },
    ],
    scalar: [
      { label: 'Pricing', url: 'https://scalar.com/pricing' },
      { label: 'Scalar on GitHub', url: 'https://github.com/scalar/scalar' },
      { label: 'API reference configuration', url: 'https://scalar.com/scalar/scalar-api-references/configuration' },
      { label: 'Mock server', url: 'https://scalar.com/products/mock-server/getting-started' },
      { label: 'MCP servers', url: 'https://scalar.com/products/agent/mcp' },
    ],
    swagger: [
      { label: 'Swagger UI', url: 'https://github.com/swagger-api/swagger-ui' },
      { label: 'Swagger Editor', url: 'https://github.com/swagger-api/swagger-editor' },
      { label: 'Swagger Studio', url: 'https://swagger.io/tools/swaggerhub/' },
      { label: 'Self-managed', url: 'https://swagger.io/tools/swaggerhub/enterprise' },
      { label: 'Swagger MCP server', url: 'https://support.smartbear.com/swaggerhub/docs/en/integrations/smartbear-mcp-server.html' },
      { label: 'SwaggerHub CLI', url: 'https://github.com/SmartBear/swaggerhub-cli' },
    ],
  },
};
