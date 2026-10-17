import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { guard } from 'lit/directives/guard.js';

import {
  renderTemplateToString,
  escapeHtml,
  renderStaticDoc,
  renderStaticEndpoint,
  renderStaticSchema,
  getSpecNavigation,
  getCatalogMetadata,
  generateSeoMetadata,
  getBundledCss,
} from 'rapidoc/static';

const sampleSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Cosmo Cargo API',
    version: '2.4.0',
    description: 'Logistics, shipment rates, tracking, and label management.',
    termsOfService: 'https://example.com/terms',
    contact: {
      name: 'Cosmo Support',
      email: 'support@cosmocargo.dev',
      url: 'https://cosmocargo.dev',
    },
  },
  servers: [{ url: 'https://api.cosmocargo.dev/v1' }],
  'x-tagGroups': [
    {
      name: 'Shipment Logistics',
      description: 'Shipment operations',
      tags: ['Shipments', 'Tracking'],
    },
    {
      name: 'Finance',
      tags: ['Billing'],
    },
  ],
  tags: [
    { name: 'Shipments', description: 'Create and list shipments' },
    { name: 'Tracking', description: 'Real-time shipment tracking' },
    { name: 'Billing', description: 'Invoices and payments' },
  ],
  paths: {
    '/v1/shipments': {
      get: {
        summary: 'List shipments',
        description: 'Returns all registered shipments.',
        operationId: 'listShipments',
        tags: ['Shipments'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Filter by delivery status',
            schema: { type: 'string', enum: ['in_transit', 'delivered'] },
          },
        ],
        responses: {
          '200': {
            description: 'A list of shipments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Shipment' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create shipment',
        description: 'Creates a new shipment order.',
        operationId: 'createShipment',
        tags: ['Shipments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Shipment' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Shipment created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Shipment' },
              },
            },
          },
        },
      },
    },
    '/v1/tracking/{trackingNumber}': {
      get: {
        summary: 'Get tracking events',
        operationId: 'getTracking',
        tags: ['Tracking'],
        parameters: [
          {
            name: 'trackingNumber',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Unique tracking identifier',
          },
        ],
        responses: {
          '200': {
            description: 'Tracking status details',
          },
        },
      },
    },
    '/v1/invoices': {
      get: {
        summary: 'List billing invoices',
        operationId: 'listInvoices',
        tags: ['Billing'],
        responses: {
          '200': {
            description: 'List of invoices',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Shipment: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique shipment identifier' },
          destination: { type: 'string', description: 'Destination city or airport' },
          weightKg: { type: 'number', minimum: 0, description: 'Weight in kilograms' },
          status: { type: 'string', enum: ['draft', 'booked', 'in_transit', 'delivered'] },
        },
        required: ['id', 'destination'],
      },
    },
  },
};

describe('Isomorphic Template Serializer (renderTemplateToString)', () => {
  it('should serialize simple strings, numbers, and nullish values', () => {
    assert.equal(renderTemplateToString('hello'), 'hello');
    assert.equal(renderTemplateToString(42), '42');
    assert.equal(renderTemplateToString(null), '');
    assert.equal(renderTemplateToString(undefined), '');
    assert.equal(renderTemplateToString(false), '');
  });

  it('should strip event listener expressions (@click, @change, @input)', () => {
    const t = html`<button @click="${() => {}}" @mouseenter="${() => {}}" class="btn">Click Me</button>`;
    const output = renderTemplateToString(t);
    assert.ok(!output.includes('@click'), 'Should not contain @click');
    assert.ok(!output.includes('@mouseenter'), 'Should not contain @mouseenter');
    assert.ok(output.includes('class="btn"'), 'Should retain standard attributes');
    assert.ok(output.includes('Click Me'), 'Should retain text content');
  });

  it('should strip property bindings (.config, .data)', () => {
    const t = html`<div .config="${{ a: 1 }}" .customData="${'test'}" id="main">Content</div>`;
    const output = renderTemplateToString(t);
    assert.ok(!output.includes('.config'), 'Should not contain .config');
    assert.ok(!output.includes('.customData'), 'Should not contain .customData');
    assert.ok(output.includes('id="main"'), 'Should retain id');
    assert.ok(output.includes('Content'), 'Should retain inner text');
  });

  it('should properly handle boolean attributes (?disabled, ?hidden)', () => {
    const t1 = html`<input ?disabled="${true}" ?required="${'true'}" type="text" />`;
    const output1 = renderTemplateToString(t1);
    assert.ok(output1.includes('disabled'), 'Should include disabled attribute when truthy');
    assert.ok(output1.includes('required'), 'Should include required attribute when truthy');
    assert.ok(!output1.includes('?disabled'), 'Should not have leading ?');

    const t2 = html`<input ?disabled="${false}" ?readonly="${null}" type="text" />`;
    const output2 = renderTemplateToString(t2);
    assert.ok(!output2.includes('disabled'), 'Should omit disabled attribute when falsy');
    assert.ok(!output2.includes('readonly'), 'Should omit readonly attribute when null');
  });

  it('should resolve unsafeHTML directive without escaping', () => {
    const t = html`<div>${unsafeHTML('<strong>Raw <em>Markup</em></strong>')}</div>`;
    const output = renderTemplateToString(t);
    assert.ok(output.includes('<strong>Raw <em>Markup</em></strong>'));
  });

  it('should handle ifDefined and guard directives', () => {
    const t = html`
      <div>
        <span class="${ifDefined('active')}">Defined</span>
        <span id="${ifDefined(undefined)}">Undefined</span>
        ${guard([1], () => html`<p>Guarded Content</p>`)}
      </div>
    `;
    const output = renderTemplateToString(t);
    assert.ok(output.includes('class="active"'));
    assert.ok(output.includes('<p>Guarded Content</p>'));
  });

  it('should resolve CSSResult objects to cssText', () => {
    const styles = css`
      .card {
        padding: 12px;
        color: red;
      }
    `;
    const output = renderTemplateToString(styles);
    assert.ok(output.includes('.card'));
    assert.ok(output.includes('padding: 12px;'));
  });

  it('escapeHtml should properly escape HTML special characters', () => {
    assert.equal(escapeHtml('<script>alert("xss")&\'</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&amp;&#39;&lt;/script&gt;');
  });
});

describe('Static Document Pre-Rendering (renderStaticDoc)', () => {
  it('should render Declarative Shadow DOM (DSD) format by default', async () => {
    const htmlOutput = await renderStaticDoc({
      spec: sampleSpec,
      renderStyle: 'read',
      theme: 'amber',
      colorScheme: 'dark',
    });

    assert.ok(htmlOutput.startsWith('<rapi-doc'), 'Must wrap in <rapi-doc>');
    assert.ok(htmlOutput.includes('<template shadowrootmode="open">'), 'Must declare shadowrootmode="open"');
    assert.ok(htmlOutput.includes('<style>'), 'Must include <style> block');
    assert.ok(htmlOutput.includes('Cosmo Cargo API'), 'Must include API title');
    assert.ok(htmlOutput.includes('Shipment Logistics'), 'Must render 3-tier tagGroup heading');
    assert.ok(htmlOutput.includes('</template>'), 'Must close template');
    assert.ok(htmlOutput.endsWith('</rapi-doc>'), 'Must close <rapi-doc>');
  });

  it('should render Light DOM format when outputMode is "html" or "light"', async () => {
    const htmlOutput = await renderStaticDoc({
      spec: sampleSpec,
      renderStyle: 'view',
      theme: 'emerald',
      colorScheme: 'light',
      outputMode: 'html',
    });

    assert.ok(!htmlOutput.includes('<rapi-doc'), 'Should not use <rapi-doc> in Light DOM mode');
    assert.ok(!htmlOutput.includes('shadowrootmode'), 'Should not use shadowrootmode in Light DOM mode');
    assert.ok(htmlOutput.includes('class="rapidoc-static-container"'), 'Should wrap in rapidoc-static-container');
    assert.ok(htmlOutput.includes('data-theme="emerald"'), 'Should preserve theme attribute');
    assert.ok(htmlOutput.includes('Cosmo Cargo API'), 'Should render title');
  });

  it('should load and render spec from a local file path', async () => {
    const htmlOutput = await renderStaticDoc({
      spec: './docs/public/specs/petstore.json',
      renderStyle: 'read',
      theme: 'blue',
    });

    assert.ok(htmlOutput.includes('Swagger Petstore'), 'Should load and render local JSON spec');
    assert.ok(htmlOutput.includes('shadowrootmode="open"'));
  });
});

describe('Static Isolated Endpoint Pre-Rendering (renderStaticEndpoint)', () => {
  it('should render an isolated endpoint card with parameters and path', async () => {
    const htmlOutput = await renderStaticEndpoint({
      spec: sampleSpec,
      path: '/v1/shipments',
      method: 'get',
      theme: 'violet',
    });

    assert.ok(htmlOutput.includes('rapidoc-endpoint-container'), 'Should wrap in endpoint container');
    assert.ok(htmlOutput.includes('/v1/shipments'), 'Should display path');
    assert.ok(htmlOutput.includes('List shipments'), 'Should display summary');
    assert.ok(htmlOutput.includes('status'), 'Should display query parameter name');
  });

  it('should be case-insensitive for HTTP methods', async () => {
    const htmlOutput = await renderStaticEndpoint({
      spec: sampleSpec,
      path: '/v1/tracking/{trackingNumber}',
      method: 'GET',
    });

    assert.ok(htmlOutput.includes('/v1/tracking/{trackingNumber}'));
    assert.ok(htmlOutput.includes('Get tracking events'));
    assert.ok(htmlOutput.includes('trackingNumber'));
  });

  it('should throw descriptive error when endpoint is not found in spec', async () => {
    await assert.rejects(
      async () => {
        await renderStaticEndpoint({
          spec: sampleSpec,
          path: '/nonexistent/path',
          method: 'delete',
        });
      },
      /Endpoint not found in spec/
    );
  });
});

describe('Static Schema Pre-Rendering (renderStaticSchema)', () => {
  it('should render schema in table format with column headers and fields', async () => {
    const htmlOutput = await renderStaticSchema({
      schema: sampleSpec.components.schemas.Shipment,
      style: 'table',
      theme: 'rose',
    });

    assert.ok(htmlOutput.includes('rapidoc-schema-container'));
    assert.ok(htmlOutput.includes('Field'));
    assert.ok(htmlOutput.includes('Type'));
    assert.ok(htmlOutput.includes('Description'));
    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('weightKg'));
  });

  it('should render schema in tree format', async () => {
    const htmlOutput = await renderStaticSchema({
      schema: sampleSpec.components.schemas.Shipment,
      style: 'tree',
      theme: 'amber',
    });

    assert.ok(htmlOutput.includes('rapidoc-schema-container'));
    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('weightKg'));
  });

  it('should resolve named schema from spec.components.schemas', async () => {
    const htmlOutput = await renderStaticSchema({
      spec: sampleSpec,
      schema: 'Shipment',
      style: 'table',
    });

    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('Unique shipment identifier'));
  });
});

describe('Portal Navigation & Catalog Helpers (getSpecNavigation, getCatalogMetadata, generateSeoMetadata)', () => {
  it('getSpecNavigation should extract 3-level navigation hierarchy when x-tagGroups is defined', async () => {
    const nav = await getSpecNavigation(sampleSpec);

    assert.equal(nav.title, 'Cosmo Cargo API');
    assert.equal(nav.version, '2.4.0');
    assert.equal(nav.tagGroups.length, 2, 'Should have 2 tag groups');

    const shipmentGroup = nav.tagGroups.find((g) => g.name === 'Shipment Logistics');
    assert.ok(shipmentGroup, 'Should find Shipment Logistics group');
    assert.equal(shipmentGroup.tags.length, 2, 'Should have 2 tags under Shipment Logistics');

    const shipmentsTag = shipmentGroup.tags.find((t) => t.name === 'Shipments');
    assert.ok(shipmentsTag, 'Should have Shipments tag');
    assert.equal(shipmentsTag.paths.length, 2, 'Should have 2 operations under Shipments');
    assert.equal(shipmentsTag.paths[0].method, 'get');
    assert.equal(shipmentsTag.paths[0].path, '/v1/shipments');
  });

  it('getCatalogMetadata should extract API Catalog overview cards', async () => {
    const catalog = await getCatalogMetadata([sampleSpec, { id: 'petstore-card', spec: './docs/public/specs/petstore.json' }]);

    assert.equal(catalog.length, 2);
    assert.equal(catalog[0].title, 'Cosmo Cargo API');
    assert.equal(catalog[0].endpointsCount, 4);
    assert.equal(catalog[0].tagGroupsCount, 2);
    assert.equal(catalog[0].methodsSummary.get, 3);
    assert.equal(catalog[0].methodsSummary.post, 1);

    assert.equal(catalog[1].id, 'petstore-card');
    assert.equal(catalog[1].title, 'Swagger Petstore');
    assert.ok(catalog[1].endpointsCount > 0);
  });

  it('generateSeoMetadata should extract WebAPI JSON-LD and OpenGraph tags', async () => {
    const seo = await generateSeoMetadata(sampleSpec, { baseUrl: 'https://cosmocargo.dev/api' });

    assert.ok(seo.title.includes('Cosmo Cargo API v2.4.0'));
    assert.equal(seo.jsonLd['@context'], 'https://schema.org');
    assert.equal(seo.jsonLd['@type'], 'WebAPI');
    assert.equal(seo.jsonLd.name, 'Cosmo Cargo API');
    assert.equal(seo.jsonLd.documentation, 'https://cosmocargo.dev/api');
    assert.equal(seo.jsonLd.provider?.name, 'Cosmo Support');

    assert.ok(seo.jsonLdScript.includes('<script type="application/ld+json">'));
    assert.ok(seo.metaTags.includes('<title>'));
    assert.ok(seo.metaTags.includes('<meta property="og:title"'));
  });

  it('getBundledCss should return valid CSS and support Light DOM scoping', () => {
    const shadowCss = getBundledCss({ theme: 'amber' });
    assert.ok(shadowCss.includes(':host'));
    assert.ok(shadowCss.includes('.main-content'));

    const lightCss = getBundledCss({ theme: 'amber', scope: '.my-portal' });
    assert.ok(!lightCss.includes(':host {'));
    assert.ok(lightCss.includes('.my-portal'));
  });
});
