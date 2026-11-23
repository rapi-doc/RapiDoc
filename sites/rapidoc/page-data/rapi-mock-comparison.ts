// RapiMock against other mock servers, on the /rapi-mock/ page (components/ComparisonTable.astro).
// Every cell about another product was checked against its own documentation on `checked`; the pages
// are in `sources`. Where a product's docs say nothing either way, the cell is "no" with the note
// "Not documented". WireMock is the open-source WireMock; WireMock Cloud is named in the notes.

import type { Comparison } from './comparison-types';

export const rapiMockComparison: Comparison = {
  ours: 'rapimock',
  caption: 'RapiMock compared with Prism, WireMock, Mockoon, Postman mock servers and Microcks',
  checked: '2026-11-23',
  products: [
    { key: 'rapimock', name: 'RapiMock', url: 'https://mock.rapidocui.com/' },
    { key: 'prism', name: 'Prism', url: 'https://github.com/stoplightio/prism' },
    { key: 'wiremock', name: 'WireMock', url: 'https://wiremock.org/' },
    { key: 'mockoon', name: 'Mockoon', url: 'https://mockoon.com/' },
    { key: 'postman', name: 'Postman mocks', url: 'https://learning.postman.com/docs/design-apis/mock-apis/overview/' },
    { key: 'microcks', name: 'Microcks', url: 'https://microcks.io/' },
  ],
  rows: [
    {
      feature: 'Mock straight from an OpenAPI spec',
      detail: 'Point it at the spec; no stubs to write',
      cells: {
        rapimock: { verdict: 'yes', note: '3.0, 3.1, 3.2' },
        prism: { verdict: 'yes', note: '2.0, 3.0, 3.1' },
        wiremock: { verdict: 'partial', note: 'Cloud only; stubs by hand' },
        mockoon: { verdict: 'partial', note: 'Imported; partial mapping' },
        postman: { verdict: 'partial', note: 'Via a generated collection' },
        microcks: { verdict: 'yes', note: 'Needs examples' },
      },
    },
    {
      feature: 'Data generated from the schemas',
      detail: 'Realistic values where the spec has no example',
      cells: {
        rapimock: { verdict: 'yes' },
        prism: { verdict: 'yes' },
        wiremock: { verdict: 'partial', note: 'Faker templates by hand' },
        mockoon: { verdict: 'partial', note: 'Once, at import' },
        postman: { verdict: 'partial', note: 'Faker variables by hand' },
        microcks: { verdict: 'partial', note: 'Templates by hand' },
      },
    },
    {
      feature: 'Validates requests against the spec',
      detail: 'A bad request gets a 400 that says why',
      cells: {
        rapimock: { verdict: 'yes' },
        prism: { verdict: 'yes' },
        wiremock: { verdict: 'partial', note: 'Cloud only' },
        mockoon: { verdict: 'no' },
        postman: { verdict: 'no', note: 'Not documented' },
        microcks: { verdict: 'partial', note: 'Parameters only' },
      },
    },
    {
      feature: "Checks tokens and OAuth scopes",
      detail: "Verifies JWTs against your issuer and the spec's security",
      cells: {
        rapimock: { verdict: 'yes' },
        prism: { verdict: 'partial', note: 'Missing credentials only' },
        wiremock: { verdict: 'partial', note: 'Header rules by hand' },
        mockoon: { verdict: 'partial', note: 'Header rules by hand' },
        postman: { verdict: 'no', note: 'Not documented' },
        microcks: { verdict: 'partial', note: 'Header pattern only' },
      },
    },
    {
      feature: 'Keeps state between requests',
      detail: 'What you create, you can read, change and delete',
      cells: {
        rapimock: { verdict: 'yes', note: 'Worked out from the spec' },
        prism: { verdict: 'no', note: 'On its roadmap' },
        wiremock: { verdict: 'partial', note: 'Extension, or Cloud Enterprise' },
        mockoon: { verdict: 'yes', note: 'CRUD routes you set up' },
        postman: { verdict: 'partial', note: 'Handlers you write' },
        microcks: { verdict: 'partial', note: 'Scripts you write' },
      },
    },
    {
      feature: 'Separate data for parallel tests',
      detail: 'Each test session sees only its own changes',
      cells: {
        rapimock: { verdict: 'yes', note: 'X-Mock-Session header' },
        prism: { verdict: 'no', note: 'No state' },
        wiremock: { verdict: 'no', note: 'Not documented' },
        mockoon: { verdict: 'no', note: 'Not documented' },
        postman: { verdict: 'no', note: 'Not documented' },
        microcks: { verdict: 'no', note: 'Not documented' },
      },
    },
    {
      feature: 'Control API for tests',
      detail: 'Reset, read and set the data from any language',
      cells: {
        rapimock: { verdict: 'yes' },
        prism: { verdict: 'no' },
        wiremock: { verdict: 'yes' },
        mockoon: { verdict: 'yes' },
        postman: { verdict: 'no', note: 'Not documented' },
        microcks: { verdict: 'partial', note: 'No state reset' },
      },
    },
    {
      feature: 'Web UI to look inside',
      detail: 'The records it holds and what each operation does',
      cells: {
        rapimock: { verdict: 'yes' },
        prism: { verdict: 'no' },
        wiremock: { verdict: 'partial', note: 'Cloud only' },
        mockoon: { verdict: 'partial', note: 'Desktop app' },
        postman: { verdict: 'yes' },
        microcks: { verdict: 'yes' },
      },
    },
    {
      feature: 'Latency and faults',
      cells: {
        rapimock: { verdict: 'partial', note: 'Delay, and error responses on request' },
        prism: { verdict: 'no' },
        wiremock: { verdict: 'yes' },
        mockoon: { verdict: 'partial', note: 'Latency' },
        postman: { verdict: 'yes' },
        microcks: { verdict: 'partial', note: 'Delays' },
      },
    },
    {
      feature: 'Record or proxy a real API',
      cells: {
        rapimock: { verdict: 'no' },
        prism: { verdict: 'partial', note: 'Proxy, no recording' },
        wiremock: { verdict: 'yes' },
        mockoon: { verdict: 'yes' },
        postman: { verdict: 'no', note: 'Not documented' },
        microcks: { verdict: 'partial', note: 'Proxy; HAR import' },
      },
    },
    {
      feature: 'GraphQL, gRPC or AsyncAPI',
      cells: {
        rapimock: { verdict: 'no' },
        prism: { verdict: 'no' },
        wiremock: { verdict: 'partial', note: 'GraphQL, gRPC extensions' },
        mockoon: { verdict: 'no' },
        postman: { verdict: 'partial', note: 'gRPC' },
        microcks: { verdict: 'yes' },
      },
    },
    {
      feature: 'MCP for AI agents',
      detail: 'Agents call the mocked API as tools',
      cells: {
        rapimock: { verdict: 'partial', note: 'rapidoc mcp serve pointed at the mock' },
        prism: { verdict: 'no' },
        wiremock: { verdict: 'partial', note: 'Cloud Enterprise' },
        mockoon: { verdict: 'partial', note: 'Starts and stops mocks only' },
        postman: { verdict: 'no' },
        microcks: { verdict: 'yes' },
      },
    },
    {
      feature: 'Open source and free',
      cells: {
        rapimock: { verdict: 'yes', note: 'MIT' },
        prism: { verdict: 'yes', note: 'Apache-2.0' },
        wiremock: { verdict: 'yes', note: 'Apache-2.0; Cloud is paid' },
        mockoon: { verdict: 'yes', note: 'MIT; Pro is paid' },
        postman: { verdict: 'no', note: 'Free plan' },
        microcks: { verdict: 'yes', note: 'Apache-2.0' },
      },
    },
    {
      feature: 'Hosted URL a team shares',
      detail: 'A managed service, nothing to run',
      cells: {
        rapimock: { verdict: 'no', note: 'Run it on your server' },
        prism: { verdict: 'partial', note: 'Stoplight, paid' },
        wiremock: { verdict: 'partial', note: 'Cloud; free tier is limited' },
        mockoon: { verdict: 'partial', note: 'Enterprise' },
        postman: { verdict: 'yes' },
        microcks: { verdict: 'no', note: 'Self-hosted' },
      },
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
  correction:
    'Products change. If a cell is out of date, open an issue at github.com/rapi-doc/RapiDoc with a link to the page that shows it, and we will fix the table.',
};
