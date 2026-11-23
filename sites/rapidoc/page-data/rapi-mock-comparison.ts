// RapiMock against other mock servers, on the /rapi-mock/ page (components/ComparisonTable.astro).
// Every cell about another product was checked against its own documentation on `checked`; the pages
// are in `sources`. Where a product's docs say nothing either way, the cell is "no" with the text
// "Not documented". WireMock is the open-source WireMock; WireMock Cloud is named in the cells.

import type { Comparison } from './comparison-types';

const MOCK_DOCS = 'https://mock.rapidocui.com/docs';

export const rapiMockComparison: Comparison = {
  ours: 'rapimock',
  caption: 'RapiMock compared with Prism, WireMock, Mockoon, Postman mock servers and Microcks',
  checked: '2026-11-23',
  products: [
    { key: 'rapimock', name: 'RapiMock', sub: 'MIT · open source' },
    { key: 'prism', name: 'Prism' },
    { key: 'wiremock', name: 'WireMock' },
    { key: 'mockoon', name: 'Mockoon' },
    { key: 'postman', name: 'Postman mocks' },
    { key: 'microcks', name: 'Microcks' },
  ],
  groups: [
    {
      title: 'From the spec',
      rows: [
        {
          feature: 'Mock straight from the spec',
          detail: 'Point it at the spec; no stubs to write',
          cells: {
            rapimock: { verdict: 'yes', text: 'OpenAPI 3.0, 3.1 and 3.2', href: `${MOCK_DOCS}/getting-started/quickstart/` },
            prism: { verdict: 'yes', text: 'OpenAPI 2.0, 3.0 and 3.1' },
            wiremock: { verdict: 'paid', text: 'In WireMock Cloud', note: 'Stubs by hand in open source' },
            mockoon: { verdict: 'partial', text: 'Imported, partly mapped' },
            postman: { verdict: 'partial', text: 'Through a generated collection' },
            microcks: { verdict: 'yes', text: 'Needs examples in the spec' },
          },
        },
        {
          feature: 'Data from the schemas',
          detail: 'Realistic values where there is no example',
          cells: {
            rapimock: { verdict: 'yes', text: 'Generated per field', note: 'The same on every run for a seed' },
            prism: { verdict: 'yes', text: 'Dynamic mode' },
            wiremock: { verdict: 'partial', text: 'Faker templates by hand' },
            mockoon: { verdict: 'partial', text: 'Once, at import' },
            postman: { verdict: 'partial', text: 'Faker variables by hand' },
            microcks: { verdict: 'partial', text: 'Templates by hand' },
          },
        },
        {
          feature: 'Request validation',
          detail: 'A bad request gets a 400 that says why',
          cells: {
            rapimock: { verdict: 'yes', text: 'Parameters and bodies' },
            prism: { verdict: 'yes', text: 'Parameters and bodies' },
            wiremock: { verdict: 'paid', text: 'In WireMock Cloud' },
            mockoon: { verdict: 'no' },
            postman: { verdict: 'no', text: 'Not documented' },
            microcks: { verdict: 'partial', text: 'Parameters only' },
          },
        },
        {
          feature: 'Tokens and OAuth scopes',
          detail: "Checked against your issuer and the spec's security",
          cells: {
            rapimock: {
              verdict: 'yes',
              text: 'JWTs verified, scopes checked',
              note: '401 or 403 as the real API would',
              href: `${MOCK_DOCS}/responses/tokens-and-scopes/`,
            },
            prism: { verdict: 'partial', text: 'Missing credentials only' },
            wiremock: { verdict: 'partial', text: 'Header rules by hand' },
            mockoon: { verdict: 'partial', text: 'Header rules by hand' },
            postman: { verdict: 'no', text: 'Not documented' },
            microcks: { verdict: 'partial', text: 'Header pattern only' },
          },
        },
      ],
    },
    {
      title: 'State and tests',
      rows: [
        {
          feature: 'State between requests',
          detail: 'What you create, you can read, change and delete',
          cells: {
            rapimock: { verdict: 'yes', text: 'Worked out from the spec', href: `${MOCK_DOCS}/state/overview/` },
            prism: { verdict: 'no', text: 'On its roadmap' },
            wiremock: { verdict: 'partial', text: 'An extension', note: 'Or WireMock Cloud Enterprise' },
            mockoon: { verdict: 'yes', text: 'CRUD routes you set up' },
            postman: { verdict: 'partial', text: 'Handlers you write' },
            microcks: { verdict: 'partial', text: 'Scripts you write' },
          },
        },
        {
          feature: 'Separate data per test',
          detail: 'Parallel tests do not see each other',
          cells: {
            rapimock: { verdict: 'yes', text: 'X-Mock-Session header', href: `${MOCK_DOCS}/state/sessions/` },
            prism: { verdict: 'no', text: 'No state' },
            wiremock: { verdict: 'no', text: 'Not documented' },
            mockoon: { verdict: 'no', text: 'Not documented' },
            postman: { verdict: 'no', text: 'Not documented' },
            microcks: { verdict: 'no', text: 'Not documented' },
          },
        },
        {
          feature: 'Control API',
          detail: 'Reset, read and set the data from any language',
          cells: {
            rapimock: { verdict: 'yes', text: 'Under /__mock', href: `${MOCK_DOCS}/reference/control-api/` },
            prism: { verdict: 'no' },
            wiremock: { verdict: 'yes', text: 'Admin API' },
            mockoon: { verdict: 'yes', text: 'Admin API' },
            postman: { verdict: 'no', text: 'Not documented' },
            microcks: { verdict: 'partial', text: 'No state reset' },
          },
        },
        {
          feature: 'A UI to look inside',
          detail: 'Its records and what each operation does',
          cells: {
            rapimock: { verdict: 'yes', text: 'Mock UI in the browser', href: `${MOCK_DOCS}/mock-ui/tour/` },
            prism: { verdict: 'no' },
            wiremock: { verdict: 'paid', text: 'In WireMock Cloud' },
            mockoon: { verdict: 'partial', text: 'Logs in the desktop app' },
            postman: { verdict: 'yes', text: 'Logs and state' },
            microcks: { verdict: 'yes', text: 'Web console' },
          },
        },
        {
          feature: 'Latency and faults',
          cells: {
            rapimock: { verdict: 'partial', text: 'A delay, and error responses on request', note: 'No connection faults' },
            prism: { verdict: 'no' },
            wiremock: { verdict: 'yes', text: 'Delays and connection faults' },
            mockoon: { verdict: 'partial', text: 'Latency' },
            postman: { verdict: 'yes', text: 'Delays, errors, chaos mode' },
            microcks: { verdict: 'partial', text: 'Delays' },
          },
        },
      ],
    },
    {
      title: 'Beyond the spec',
      rows: [
        {
          feature: 'Record or proxy a real API',
          cells: {
            rapimock: { verdict: 'no' },
            prism: { verdict: 'partial', text: 'Proxy, no recording' },
            wiremock: { verdict: 'yes', text: 'Proxy, record and play back' },
            mockoon: { verdict: 'yes', text: 'Proxy and recording' },
            postman: { verdict: 'no', text: 'Not documented' },
            microcks: { verdict: 'partial', text: 'Proxy; HAR import' },
          },
        },
        {
          feature: 'GraphQL, gRPC or AsyncAPI',
          cells: {
            rapimock: { verdict: 'no' },
            prism: { verdict: 'no' },
            wiremock: { verdict: 'partial', text: 'GraphQL and gRPC extensions' },
            mockoon: { verdict: 'no' },
            postman: { verdict: 'partial', text: 'gRPC' },
            microcks: { verdict: 'yes', text: 'All three' },
          },
        },
        {
          feature: 'MCP for AI agents',
          detail: 'Agents call the mocked API as tools',
          cells: {
            rapimock: { verdict: 'partial', text: 'rapidoc mcp serve, pointed at the mock' },
            prism: { verdict: 'no' },
            wiremock: { verdict: 'paid', text: 'WireMock Cloud Enterprise' },
            mockoon: { verdict: 'partial', text: 'Starts and stops mocks only' },
            postman: { verdict: 'no' },
            microcks: { verdict: 'yes', text: 'Mocks as MCP tools' },
          },
        },
      ],
    },
    {
      title: 'License and hosting',
      rows: [
        {
          feature: 'License',
          cells: {
            rapimock: { verdict: 'yes', text: 'MIT', note: 'No paid tier' },
            prism: { verdict: 'yes', text: 'Apache 2.0' },
            wiremock: { verdict: 'partial', text: 'Apache 2.0', note: 'WireMock Cloud is commercial' },
            mockoon: { verdict: 'partial', text: 'MIT', note: 'Pro and Enterprise are paid' },
            postman: { verdict: 'paid', text: 'Proprietary', note: 'With a free plan' },
            microcks: { verdict: 'yes', text: 'Apache 2.0' },
          },
        },
        {
          feature: 'Hosted URL a team shares',
          detail: 'A managed service, nothing to run',
          cells: {
            rapimock: { verdict: 'no', text: 'Run it on your own server' },
            prism: { verdict: 'paid', text: 'Stoplight platform' },
            wiremock: { verdict: 'paid', text: 'WireMock Cloud', note: 'Free tier with limits' },
            mockoon: { verdict: 'paid', text: 'Enterprise' },
            postman: { verdict: 'yes', text: 'On every plan' },
            microcks: { verdict: 'no', text: 'Self-hosted' },
          },
        },
      ],
    },
  ],
  sources: {
    prism: [
      { label: 'README and roadmap', url: 'https://github.com/stoplightio/prism' },
      { label: 'Mocking', url: 'https://github.com/stoplightio/prism/blob/master/docs/guides/01-mocking.md' },
      { label: 'Request validation', url: 'https://github.com/stoplightio/prism/blob/master/docs/guides/02-request-validation.md' },
      { label: 'Validation proxy', url: 'https://github.com/stoplightio/prism/blob/master/docs/guides/03-validation-proxy.md' },
      { label: 'Stoplight pricing', url: 'https://stoplight.io/pricing' },
    ],
    wiremock: [
      { label: 'WireMock Cloud vs. open source', url: 'https://wiremock.org/docs/wiremock-cloud/' },
      { label: 'Stateful behaviour', url: 'https://wiremock.org/docs/stateful-behaviour/' },
      { label: 'Simulating faults', url: 'https://wiremock.org/docs/simulating-faults/' },
      { label: 'Admin API', url: 'https://wiremock.org/docs/standalone/admin-api-reference/' },
      { label: 'Record and playback', url: 'https://wiremock.org/docs/record-playback/' },
      { label: 'AI', url: 'https://wiremock.org/docs/solutions/ai/' },
      { label: 'Pricing', url: 'https://www.wiremock.io/pricing' },
    ],
    mockoon: [
      { label: 'OpenAPI compatibility', url: 'https://mockoon.com/docs/latest/openapi/openapi-specification-compatibility/' },
      { label: 'CRUD routes', url: 'https://mockoon.com/docs/latest/api-endpoints/crud-routes/' },
      { label: 'Admin API', url: 'https://mockoon.com/docs/latest/admin-api/overview/' },
      { label: 'Recording', url: 'https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/' },
      { label: 'CLI and MCP command', url: 'https://github.com/mockoon/mockoon/blob/main/packages/cli/README.md' },
      { label: 'Pricing', url: 'https://mockoon.com/pricing/' },
    ],
    postman: [
      { label: 'Mock servers', url: 'https://learning.postman.com/docs/design-apis/mock-apis/overview/' },
      { label: 'Matching algorithm', url: 'https://learning.postman.com/docs/design-apis/mock-apis/mock-servers/matching-algorithm' },
      { label: 'JavaScript mocks', url: 'https://learning.postman.com/docs/design-apis/mock-apis/mocks/overview' },
      { label: 'Scenarios and behaviors', url: 'https://learning.postman.com/docs/design-apis/mock-apis/mocks/scenarios-and-behaviors' },
      { label: 'Pricing', url: 'https://www.postman.com/pricing/' },
    ],
    microcks: [
      { label: 'OpenAPI conventions', url: 'https://microcks.io/documentation/references/artifacts/openapi-conventions/' },
      { label: 'Mock constraints', url: 'https://microcks.io/documentation/guides/usage/mocks-constraints/' },
      { label: 'Stateful mocks', url: 'https://microcks.io/documentation/guides/usage/stateful-mocks/' },
      { label: 'Dispatching', url: 'https://microcks.io/documentation/explanations/dispatching/' },
      { label: 'MCP endpoints', url: 'https://microcks.io/documentation/explanations/mcp-endpoints/' },
    ],
  },
};
