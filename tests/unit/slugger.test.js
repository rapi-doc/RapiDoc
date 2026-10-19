import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OperationSlugger, toKebabCase, clampWordBoundary, createSlugger } from '../../packages/rapidoc/src/utils/slugger.js';
import ProcessSpec from '../../packages/rapidoc/src/utils/spec-parser.js';

describe('OperationSlugger and Clean Route Name Generation', () => {
  it('toKebabCase converts camelCase, PascalCase, snake_case, spaces, and slashes', () => {
    assert.equal(toKebabCase('trackShipment'), 'track-shipment');
    assert.equal(toKebabCase('CreateShipmentOrder'), 'create-shipment-order');
    assert.equal(toKebabCase('get_tracking_events'), 'get-tracking-events');
    assert.equal(toKebabCase('Shipment Logistics / Rates'), 'shipment-logistics-rates');
    assert.equal(toKebabCase('  /shipments/{shipmentId}  '), 'shipments-shipment-id');
  });

  it('clampWordBoundary truncates at word boundary to max 40 characters', () => {
    const slug = 'retrieve-detailed-tracking-information-and-checkpoint-updates';
    const clamped = clampWordBoundary(slug, 40);
    assert.ok(clamped.length <= 40, `Length ${clamped.length} should be <= 40`);
    assert.equal(clamped, 'retrieve-detailed-tracking-information');
    assert.ok(!clamped.endsWith('-'), 'Should not end with hyphen');
  });

  it('Candidate 1: uses concise operationId when present (<= 45 chars and non-generic)', () => {
    const slugger = new OperationSlugger();
    const slug = slugger.slug({
      method: 'get',
      path: '/shipments/{id}',
      operationId: 'trackShipment',
      summary: 'Track a shipment across the galaxy',
    });
    assert.equal(slug, 'track-shipment');
  });

  it('Candidate 2: ignores generic operationId and falls back to summary', () => {
    const slugger = new OperationSlugger();
    const slug = slugger.slug({
      method: 'get',
      path: '/shipments/{id}',
      operationId: 'endpoint_1',
      summary: 'Track a shipment',
    });
    assert.equal(slug, 'track-a-shipment');
  });

  it('Candidate 2: protects against 5,000+ character summaries via 100-char pre-slice and 40-char clamp', () => {
    const slugger = new OperationSlugger();
    const hugeSummary = 'Retrieve detailed tracking information, checkpoint updates, carrier status, and delivery alerts '.repeat(60);
    assert.ok(hugeSummary.length > 5000);

    const slug = slugger.slug({
      method: 'get',
      path: '/shipments/{id}',
      summary: hugeSummary,
    });

    assert.ok(slug.length <= 40, `Resulting slug length ${slug.length} must not exceed 40 chars`);
    assert.ok(!slug.includes('/'), 'Must not contain forward slashes');
    assert.equal(slug, 'retrieve-detailed-tracking-information');
  });

  it('Candidate 3: falls back to Method + Clean Path when operationId and summary are missing', () => {
    const slugger = new OperationSlugger();
    const slug = slugger.slug({
      method: 'get',
      path: '/shipments/{shipmentId}/events',
    });
    assert.equal(slug, 'get-shipments-shipmentid-events');
  });

  it('Collision handling: differentiates duplicate summaries across operations using method or counter', () => {
    const slugger = new OperationSlugger();

    // First operation: GET /items with summary 'List items'
    const slug1 = slugger.slug({
      method: 'get',
      path: '/items',
      summary: 'List items',
    });
    assert.equal(slug1, 'list-items');

    // Second operation with different method: POST /items with identical summary
    const slug2 = slugger.slug({
      method: 'post',
      path: '/items',
      summary: 'List items',
    });
    // Differentiates using method prefix
    assert.equal(slug2, 'post-list-items');

    // Third operation with same method: GET /archive/items with identical summary
    const slug3 = slugger.slug({
      method: 'get',
      path: '/archive/items',
      summary: 'List items',
    });
    assert.equal(slug3, 'get-list-items');

    // Fourth operation with same method: GET /history/items with identical summary
    const slug4 = slugger.slug({
      method: 'get',
      path: '/history/items',
      summary: 'List items',
    });
    assert.equal(slug4, 'list-items-1');
  });

  it('re-uses identical slug for identical operation across multiple calls in the same spec', () => {
    const slugger = new OperationSlugger();
    const op = {
      method: 'get',
      path: '/shared-endpoint',
      summary: 'Shared overview',
    };
    const slugFirstCall = slugger.slug(op);
    const slugSecondCall = slugger.slug(op);
    assert.equal(slugFirstCall, 'shared-overview');
    assert.equal(slugSecondCall, 'shared-overview');
  });

  it('prefixes tag slug when tagSlug is provided', () => {
    const slugger = new OperationSlugger();
    const slug = slugger.slug(
      {
        method: 'get',
        path: '/shipments/{id}',
        summary: 'Track a shipment',
      },
      'shipment-management'
    );
    assert.equal(slug, 'shipment-management--track-a-shipment');
  });

  it('slugTag and slugTagGroup generate clean kebab-case slugs', () => {
    const slugger = createSlugger();
    assert.equal(slugger.slugTag('Shipment Management'), 'tag--shipment-management');
    assert.equal(slugger.slugTagGroup('Cosmo Freight Logistics'), 'tag-group--cosmo-freight-logistics');
  });

  it('ProcessSpec automatically generates fallback operationId on AST when omitted in spec', async () => {
    const spec = {
      openapi: '3.1.0',
      info: { title: 'Test Spec', version: '1.0' },
      paths: {
        '/shipments/{shipmentId}': {
          get: {
            summary: 'Track a shipment',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(spec, false);
    const op = parsed.tags[0].paths[0];

    // clean elementId generated from summary
    assert.equal(op.elementId, 'track-a-shipment');
    // fallback operationId populated for codegen / MCP tools
    assert.equal(op.operationId, 'getShipmentsShipmentId');
  });
});
