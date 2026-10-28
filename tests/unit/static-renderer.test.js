import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { html, css, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { guard } from 'lit/directives/guard.js';

import {
  renderTemplateToString,
  escapeHtml,
  renderRapiDoc,
  renderEndpoint,
  renderSchema,
  getSpecNavigation,
  getNavBarHtml,
  renderNavBarHtml,
  getNavFilterHtml,
  bindNavBar,
  getMethodBadge,
  getBundledCss,
  getNavCss,
  getThemeTokensCss,
} from 'rapidoc/static';
import { isInternalOrHidden } from '~/utils/common-utils';

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
          200: {
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
          201: {
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
          200: {
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
          200: {
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
    assert.ok(output.includes('<span>Undefined</span>'), 'ifDefined(undefined) should omit the attribute');
    assert.ok(output.includes('<p>Guarded Content</p>'));
  });

  it('should omit attributes whose whole value is nothing, as Lit does', () => {
    // prettier-ignore
    const t = html`<img src="${ifDefined(undefined)}" alt='${nothing}' title=${nothing} class="c">`;
    assert.equal(renderTemplateToString(t), '<img class="c">');
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

  it('should escape strings bound in text nodes, like Lit does in the browser', () => {
    const t = html`<p>${'<img src=x onerror=alert(1)> & "quoted" \'single\''}</p>`;
    assert.equal(renderTemplateToString(t), '<p>&lt;img src=x onerror=alert(1)&gt; &amp; "quoted" \'single\'</p>');
  });

  it('should escape top-level strings and strings inside arrays', () => {
    assert.equal(renderTemplateToString('<b>bold</b>'), '&lt;b&gt;bold&lt;/b&gt;');
    // prettier-ignore
    const t = html`<ul>${['<li>a</li>', html`<li>${'b & c'}</li>`]}</ul>`;
    assert.equal(renderTemplateToString(t), '<ul>&lt;li&gt;a&lt;/li&gt;<li>b &amp; c</li></ul>');
  });

  it('should escape quotes and markup in quoted attribute values', () => {
    // prettier-ignore
    const t = html`<span title="${'a" onmouseover="alert(1)'}" data-x='${"b' onclick='alert(1)"}' class="tag ${'<x> & y'}">ok</span>`;
    assert.equal(
      renderTemplateToString(t),
      '<span title="a&quot; onmouseover=&quot;alert(1)" data-x=\'b&#39; onclick=&#39;alert(1)\' class="tag &lt;x&gt; &amp; y">ok</span>'
    );
  });

  it('should quote unquoted attribute bindings so values cannot add attributes', () => {
    const value = 'x onmouseover=alert(1)';
    const t = html`<option label=${value} value=${value}></option>`;
    assert.equal(renderTemplateToString(t), '<option label="x onmouseover=alert(1)" value="x onmouseover=alert(1)"></option>');
  });

  it('should leave unsafeHTML markup unescaped', () => {
    const t = html`<div title="${'<t>'}">${unsafeHTML('<a href="#x">link & more</a>')}${'<b>'}</div>`;
    assert.equal(renderTemplateToString(t), '<div title="&lt;t&gt;"><a href="#x">link & more</a>&lt;b&gt;</div>');
  });

  it('should leave nested templates unescaped while escaping their own bindings', () => {
    const inner = html`<em class="${'"q"'}">${'1 < 2'}</em>`;
    const t = html`<p>${inner}<span>${html`<strong>${'&'}</strong>`}</span></p>`;
    assert.equal(renderTemplateToString(t), '<p><em class="&quot;q&quot;">1 &lt; 2</em><span><strong>&amp;</strong></span></p>');
  });

  it('should escape values returned from guard directives', () => {
    const t = html`<div>${guard([1], () => '<script>x</script>')}</div>`;
    assert.equal(renderTemplateToString(t), '<div>&lt;script&gt;x&lt;/script&gt;</div>');
  });

  it('should not escape CSSResult text', () => {
    const styles = css`
      .a > .b::after {
        content: '&';
      }
    `;
    const output = renderTemplateToString(
      html`<style>
        ${styles}
      </style>`
    );
    assert.ok(output.includes('.a > .b::after'));
    assert.ok(output.includes("content: '&';"));
  });
});

describe('Static Document Pre-Rendering (renderRapiDoc)', () => {
  it('should render Declarative Shadow DOM (DSD) format by default', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      renderStyle: 'read',
      theme: 'ember',
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
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      renderStyle: 'view',
      theme: 'cobalt',
      colorScheme: 'light',
      outputMode: 'html',
    });

    assert.ok(!htmlOutput.includes('<rapi-doc'), 'Should not use <rapi-doc> in Light DOM mode');
    assert.ok(!htmlOutput.includes('shadowrootmode'), 'Should not use shadowrootmode in Light DOM mode');
    assert.ok(htmlOutput.includes('class="rapidoc-static-container"'), 'Should wrap in rapidoc-static-container');
    assert.ok(htmlOutput.includes('data-theme="cobalt"'), 'Should preserve theme attribute');
    assert.ok(htmlOutput.includes('Cosmo Cargo API'), 'Should render title');
  });

  it('should load and render spec from a local file path', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: './docs/public/specs/petstore.json',
      renderStyle: 'read',
      theme: 'jade',
    });

    assert.ok(htmlOutput.includes('Swagger Petstore'), 'Should load and render local JSON spec');
    assert.ok(htmlOutput.includes('shadowrootmode="open"'));
  });

  it('should serialize all default SSR configuration attributes onto <rapi-doc> tag to prevent hydration mismatch', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
    });

    // Extract the opening <rapi-doc ...> tag
    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch, '<rapi-doc> opening tag must exist');
    const openingTagAttrs = openingTagMatch[1];

    // Verify key attributes that prevent client-side hydration drift/mismatch
    assert.ok(openingTagAttrs.includes('schema-style="table"'), 'Must serialize schema-style="table" (preventing drift to tree)');
    assert.ok(
      openingTagAttrs.includes('allow-advanced-search="false"'),
      'Must serialize allow-advanced-search="false" (preventing modal injection)'
    );
    assert.ok(openingTagAttrs.includes('show-header="true"'), 'Must serialize show-header="true"');
    assert.ok(openingTagAttrs.includes('show-side-nav="true"'), 'Must serialize show-side-nav="true"');
    assert.ok(openingTagAttrs.includes('show-info="true"'), 'Must serialize show-info="true"');
    assert.ok(openingTagAttrs.includes('allow-search="true"'), 'Must serialize allow-search="true"');
    assert.ok(openingTagAttrs.includes('allow-server-selection="true"'), 'Must serialize allow-server-selection="true"');
    assert.ok(openingTagAttrs.includes('allow-authentication="true"'), 'Must serialize allow-authentication="true"');
    assert.ok(openingTagAttrs.includes('allow-try="true"'), 'Must serialize allow-try="true"');
    assert.ok(openingTagAttrs.includes('render-style="read"'), 'Must serialize render-style="read"');
    assert.ok(openingTagAttrs.includes('layout="column"'), 'Must serialize layout="column"');
    assert.ok(openingTagAttrs.includes('theme="ember"'), 'Must serialize theme="ember"');
    assert.ok(openingTagAttrs.includes('color-scheme="dark"'), 'Must serialize color-scheme="dark"');
    assert.ok(openingTagAttrs.includes('page-direction="ltr"'), 'Must serialize page-direction="ltr"');
    assert.ok(openingTagAttrs.includes('default-schema-tab="example"'), 'Must serialize default-schema-tab="example"');
    assert.ok(openingTagAttrs.includes('schema-expand-level="99999"'), 'Must serialize schema-expand-level="99999"');
  });

  it('should serialize customized options onto <rapi-doc> tag and reflect them in static shadow DOM', async () => {
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      schemaStyle: 'tree',
      allowTry: false,
      showHeader: false,
      showSideNav: false,
      allowSearch: false,
      theme: 'indigo',
      colorScheme: 'light',
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes('schema-style="tree"'), 'Must serialize customized schema-style');
    assert.ok(attrs.includes('allow-try="false"'), 'Must serialize customized allow-try="false"');
    assert.ok(attrs.includes('show-header="false"'), 'Must serialize show-header="false"');
    assert.ok(attrs.includes('show-side-nav="false"'), 'Must serialize show-side-nav="false"');
    assert.ok(attrs.includes('allow-search="false"'), 'Must serialize allow-search="false"');
    assert.ok(attrs.includes('theme="indigo"'), 'Must serialize theme="indigo"');
    assert.ok(attrs.includes('color-scheme="light"'), 'Must serialize color-scheme="light"');

    // Also verify that the static shadow DOM reflects these disabled features
    assert.ok(!htmlOutput.includes('class="header"'), 'Header markup must be omitted when showHeader is false');
    assert.ok(!htmlOutput.includes('class="nav-bar'), 'Navbar markup must be omitted when showSideNav is false');
  });

  it('should support both camelCase and kebab-case options and forward custom RapiDoc attributes', async () => {
    const specWithComponents = {
      ...sampleSpec,
      components: {
        schemas: {
          ShipmentRecord: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
    };

    const htmlOutput = await renderRapiDoc({
      spec: specWithComponents,
      'schema-style': 'tree',
      'allow-try': false,
      showMethodInNavBar: 'as-colored-block',
      usePathInNavBar: true,
      'nav-item-spacing': 'relaxed',
      showComponents: true,
      headingText: 'Logistics API Gateway',
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes('schema-style="tree"'), 'Supports kebab-case schema-style');
    assert.ok(attrs.includes('allow-try="false"'), 'Supports kebab-case allow-try');
    assert.ok(attrs.includes('show-method-in-nav-bar="as-colored-block"'), 'Forwards showMethodInNavBar to kebab-case');
    assert.ok(attrs.includes('use-path-in-nav-bar="true"'), 'Forwards usePathInNavBar');
    assert.ok(attrs.includes('nav-item-spacing="relaxed"'), 'Forwards nav-item-spacing');
    assert.ok(attrs.includes('show-components="true"'), 'Forwards showComponents as string boolean');
    assert.ok(attrs.includes('heading-text="Logistics API Gateway"'), 'Forwards headingText');

    // Verify template context picked up custom properties during SSR
    assert.ok(htmlOutput.includes('nav-method as-colored-block'), 'Template rendered with custom navbar method style');
    assert.ok(htmlOutput.includes('Logistics API Gateway'), 'Template rendered headingText in header-title');
    assert.ok(htmlOutput.includes('ShipmentRecord'), 'Template rendered components section when showComponents: true');
  });

  it('should serialize spec-url and spec processing options onto <rapi-doc> tag', async () => {
    const remoteUrl = 'https://api.cosmocargo.dev/v2/openapi.json';
    const htmlOutput = await renderRapiDoc({
      spec: sampleSpec,
      specUrl: remoteUrl,
      sortEndpointsBy: 'method',
      serverUrl: 'https://staging.cosmocargo.dev',
      matchPaths: '/v1/shipments',
    });

    const openingTagMatch = htmlOutput.match(/<rapi-doc\s+([^>]+)>/);
    assert.ok(openingTagMatch);
    const attrs = openingTagMatch[1];

    assert.ok(attrs.includes(`spec-url="${remoteUrl}"`), 'Must serialize spec-url');
    assert.ok(attrs.includes('sort-endpoints-by="method"'), 'Must serialize sort-endpoints-by');
    assert.ok(attrs.includes('server-url="https://staging.cosmocargo.dev"'), 'Must serialize server-url');
    assert.ok(attrs.includes('match-paths="/v1/shipments"'), 'Must serialize match-paths');
  });
});

describe('Static rendering of untrusted spec text', () => {
  const payload = '<img src=x onerror=alert(1)>';
  const xssSpec = {
    openapi: '3.1.0',
    info: { title: `Title ${payload}`, version: '1.0.0' },
    servers: [
      {
        url: 'https://{env}.example.com',
        variables: { env: { default: 'api', enum: ['api', 'x onmouseover=alert(1)'] } },
      },
    ],
    paths: {
      '/items': {
        get: {
          summary: payload,
          operationId: 'listItems',
          tags: ['Items'],
          parameters: [{ name: `q${payload}`, in: 'query', schema: { type: 'string', enum: [payload] } }],
          responses: { 200: { description: 'OK' } },
        },
      },
    },
  };

  for (const outputMode of ['dsd', 'html']) {
    for (const renderStyle of ['read', 'view', 'focused']) {
      it(`should escape an HTML summary in ${renderStyle} mode (${outputMode})`, async () => {
        const rendered = await renderRapiDoc({ spec: xssSpec, renderStyle, outputMode, includeStyles: false });
        // The DSD output inlines the raw spec as JSON in a non-executable <script type="application/json">; check only the markup
        const htmlOutput = rendered.replace(/<script type="application\/json"[^>]*>[\s\S]*?<\/script>/g, '');
        assert.ok(!htmlOutput.includes('<img src=x'), 'Raw <img> from the spec must not reach the output');
        assert.ok(htmlOutput.includes('&lt;img src=x onerror=alert(1)&gt;'), 'Summary text should be HTML-escaped');
        for (const option of htmlOutput.match(/<option[^>]*>/g) || []) {
          assert.match(
            option,
            /^<option( selected)? label="[^"]*" value="[^"]*">$/,
            'Server variable enum must stay inside quoted attributes'
          );
        }
      });
    }
  }

  it('should inline the DSD spec JSON with every < escaped, so it cannot end or alter the script block', async () => {
    const tricky = '</script><!--<script>alert(1)</script>-->';
    const spec = { ...xssSpec, info: { ...xssSpec.info, description: tricky } };
    const rendered = await renderRapiDoc({ spec, includeStyles: false });
    const match = rendered.match(/<script type="application\/json" slot="rapidoc-spec">([\s\S]*?)<\/script>/);
    assert.ok(match, 'Inline spec script should be present');
    assert.ok(!match[1].includes('<'), 'Inline JSON must not contain a raw <');
    assert.deepEqual(JSON.parse(match[1]), spec, 'Inline JSON should parse back to the original spec');
  });

  it('should escape an HTML summary in renderEndpoint output', async () => {
    const htmlOutput = await renderEndpoint({ spec: xssSpec, method: 'get', path: '/items', includeStyles: false });
    assert.ok(!htmlOutput.includes('<img src=x'));
    assert.ok(htmlOutput.includes('&lt;img src=x onerror=alert(1)&gt;'));
  });
});

describe('Static Isolated Endpoint Pre-Rendering (renderEndpoint)', () => {
  it('should render an isolated endpoint card with parameters and path', async () => {
    const htmlOutput = await renderEndpoint({
      spec: sampleSpec,
      path: '/v1/shipments',
      method: 'get',
      theme: 'indigo',
    });

    assert.ok(htmlOutput.includes('rapidoc-endpoint-container'), 'Should wrap in endpoint container');
    assert.ok(htmlOutput.includes('/v1/shipments'), 'Should display path');
    assert.ok(htmlOutput.includes('List shipments'), 'Should display summary');
    assert.ok(htmlOutput.includes('status'), 'Should display query parameter name');
  });

  it('should be case-insensitive for HTTP methods', async () => {
    const htmlOutput = await renderEndpoint({
      spec: sampleSpec,
      path: '/v1/tracking/{trackingNumber}',
      method: 'GET',
    });

    assert.ok(htmlOutput.includes('/v1/tracking/{trackingNumber}'));
    assert.ok(htmlOutput.includes('Get tracking events'));
    assert.ok(htmlOutput.includes('trackingNumber'));
  });

  it('should throw descriptive error when endpoint is not found in spec', async () => {
    await assert.rejects(async () => {
      await renderEndpoint({
        spec: sampleSpec,
        path: '/nonexistent/path',
        method: 'delete',
      });
    }, /Endpoint not found in spec/);
  });
});

describe('Static Schema Pre-Rendering (renderSchema)', () => {
  it('should render schema in table format with column headers and fields', async () => {
    const htmlOutput = await renderSchema({
      schema: sampleSpec.components.schemas.Shipment,
      style: 'table',
      theme: 'carbon',
    });

    assert.ok(htmlOutput.includes('rapidoc-schema-container'));
    assert.ok(htmlOutput.includes('Field'));
    assert.ok(htmlOutput.includes('Type'));
    assert.ok(htmlOutput.includes('Description'));
    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('weightKg'));
  });

  it('should render schema in tree format', async () => {
    const htmlOutput = await renderSchema({
      schema: sampleSpec.components.schemas.Shipment,
      style: 'tree',
      theme: 'ember',
    });

    assert.ok(htmlOutput.includes('rapidoc-schema-container'));
    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('weightKg'));
  });

  it('should resolve named schema from spec.components.schemas', async () => {
    const htmlOutput = await renderSchema({
      spec: sampleSpec,
      schema: 'Shipment',
      style: 'table',
    });

    assert.ok(htmlOutput.includes('destination'));
    assert.ok(htmlOutput.includes('Unique shipment identifier'));
  });
});

describe('Navigation & Styling Helpers (getSpecNavigation, getBundledCss)', () => {
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

  it('getBundledCss should return valid CSS and support Light DOM scoping', () => {
    const shadowCss = getBundledCss({ theme: 'ember' });
    assert.ok(shadowCss.includes(':host'));
    assert.ok(shadowCss.includes('.main-content'));

    const lightCss = getBundledCss({ theme: 'ember', scope: '.my-portal' });
    assert.ok(!lightCss.includes(':host {'));
    assert.ok(lightCss.includes('.my-portal'));
  });

  it('getMethodBadge should format 3-character badges matching core RapiDoc', () => {
    assert.equal(getMethodBadge('delete'), 'DEL');
    assert.equal(getMethodBadge('post'), 'POS');
    assert.equal(getMethodBadge('get'), 'GET');
    assert.equal(getMethodBadge('put'), 'PUT');
    assert.equal(getMethodBadge('patch'), 'PAT');
    assert.equal(getMethodBadge('get', 'full'), 'GET');
    assert.equal(getMethodBadge('delete', 'full'), 'DELETE');
  });

  it('getNavBarHtml and renderNavBarHtml should serialize matching 3-tier HTML directly from spec', async () => {
    const html = await getNavBarHtml(sampleSpec, {
      basePath: '/apis/shipments',
      activeHref: '/apis/shipments#shipments--list-shipments',
    });

    assert.ok(html.includes('class="nav-bar-tag-group expanded"'));
    assert.ok(html.includes('class="nav-bar-tag-group-header"'));
    assert.ok(html.includes('class="nav-bar-tag-and-paths expanded"'));
    assert.ok(html.includes('class="nav-bar-tag"'));
    assert.ok(html.includes('class="nav-bar-paths-under-tag"'));
    assert.ok(html.includes('class="nav-bar-path active"'));
    assert.ok(html.includes('class="nav-method as-colored-block get"'));
    assert.ok(html.includes('>GET</span>'));
    assert.ok(html.includes('href="/apis/shipments#overview"'));
    assert.ok(html.includes('href="/apis/shipments#shipments--list-shipments"'));
    assert.ok(html.includes('Shipment Logistics'));
    assert.ok(html.includes('Shipments'));

    assert.ok(html.includes('class="nav-bar-search-input portal-filter-input"'));
    assert.ok(html.includes('<svg class="nav-bar-search-icon"'), 'the filter icon is a single-colour SVG');
    assert.ok(!html.includes('🔍'), 'not the colour emoji');
    assert.ok(!html.includes('id="advanced-search-btn"'), 'Must not render redundant advanced-search-btn');

    // Multi-page Tag Mode: routingMode: 'tag-pages'
    const tagPagesHtml = await getNavBarHtml(sampleSpec, {
      basePath: '/apis/shipments',
      routingMode: 'tag-pages',
    });
    assert.ok(tagPagesHtml.includes('href="/apis/shipments/shipments#list-shipments"'));
  });

  it('getNavFilterHtml should generate clean dedicated filter header without search modal button', () => {
    const filterHtml = getNavFilterHtml({ searchPlaceholder: 'Search APIs...' });
    assert.ok(filterHtml.includes('class="nav-bar-header"'));
    assert.ok(filterHtml.includes('placeholder="Search APIs..."'));
    assert.ok(filterHtml.includes('portal-filter-input'));
    assert.ok(!filterHtml.includes('advanced-search-btn'));
  });

  it('isInternalOrHidden should correctly identify internal or hidden operations and tags', () => {
    assert.equal(isInternalOrHidden({ 'x-internal': true }), true);
    assert.equal(isInternalOrHidden({ 'x-hidden': true }), true);
    assert.equal(isInternalOrHidden({ xInternal: true }), true);
    assert.equal(isInternalOrHidden({ xHidden: 'true' }), true);
    assert.equal(isInternalOrHidden({ rawOperation: { 'x-internal': true } }), true);
    assert.equal(isInternalOrHidden({ summary: 'Public Endpoint' }), false);
    assert.equal(isInternalOrHidden(null), false);
  });

  it('bindNavBar should be exported as a callable binding function', () => {
    assert.equal(typeof bindNavBar, 'function');
  });

  it('getNavCss should return complete scoped navigation styles including method badges', () => {
    const navCss = getNavCss('.portal-sidebar');
    assert.ok(navCss.includes('.portal-sidebar {'));
    assert.ok(navCss.includes('.nav-bar-path'));
    assert.ok(navCss.includes('.nav-bar-tag-group'));
    assert.ok(navCss.includes('.nav-method.as-colored-block'));
    assert.ok(navCss.includes('.nav-method.as-colored-block.delete'));
  });

  it('getThemeTokensCss should return adapted design system tokens for portal light and dark modes', () => {
    const emberTokens = getThemeTokensCss('ember');
    assert.ok(emberTokens.includes("[data-theme='light']"));
    assert.ok(emberTokens.includes("[data-theme='dark']"));
    assert.ok(emberTokens.includes('--primary: #f76b39;'));

    const cobaltTokens = getThemeTokensCss('cobalt');
    assert.ok(cobaltTokens.includes('--primary: #7aa2d6;'));
    assert.ok(cobaltTokens.includes('--primary: #3a6cb0;'));
  });
});
