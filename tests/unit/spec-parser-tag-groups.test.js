import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import ProcessSpec, { groupByTagGroups } from '../../packages/rapidoc/src/utils/spec-parser.js';
import { renderTemplateToString } from '../../packages/rapidoc/src/static/serializer.js';

describe('OpenAPI 3-Tier Navigation (x-tagGroups / x-tag-groups)', () => {
  const mockTags = [
    { name: 'shipments', paths: [{ path: '/shipments', method: 'get' }] },
    { name: 'tracking', paths: [{ path: '/tracking', method: 'get' }] },
    { name: 'rates', paths: [{ path: '/rates', method: 'post' }] },
    { name: 'billing', paths: [{ path: '/billing', method: 'get' }] },
    { name: 'misc', paths: [{ path: '/misc', method: 'get' }] },
  ];

  it('should return empty array when no x-tagGroups or x-tag-groups is defined', () => {
    const spec = { openapi: '3.1.0', info: { title: 'Test' } };
    const groups = groupByTagGroups(spec, mockTags);
    assert.deepEqual(groups, []);
  });

  it('should organize tags into groups when x-tagGroups is defined', () => {
    const spec = {
      openapi: '3.1.0',
      'x-tagGroups': [
        {
          name: 'Shipment Operations',
          tags: ['shipments', 'tracking'],
        },
        {
          name: 'Billing & Invoicing',
          tags: ['rates', 'billing'],
        },
      ],
    };

    const groups = groupByTagGroups(spec, mockTags);
    assert.equal(groups.length, 2); // 2 declared groups, unassigned tags are strictly omitted

    assert.equal(groups[0].name, 'Shipment Operations');
    assert.equal(groups[0].elementId, 'tag-group--Shipment-Operations');
    assert.equal(groups[0].tags.length, 2);
    assert.equal(groups[0].tags[0].name, 'shipments');
    assert.equal(groups[0].tags[1].name, 'tracking');

    assert.equal(groups[1].name, 'Billing & Invoicing');
    assert.equal(groups[1].tags.length, 2);
    assert.equal(groups[1].tags[0].name, 'rates');
    assert.equal(groups[1].tags[1].name, 'billing');
  });

  it('should support kebab-case x-tag-groups', () => {
    const spec = {
      openapi: '3.1.0',
      'x-tag-groups': [
        {
          name: 'All Logistics',
          tags: ['shipments', 'tracking', 'rates', 'billing', 'misc'],
        },
      ],
    };

    const groups = groupByTagGroups(spec, mockTags);
    assert.equal(groups.length, 1);
    assert.equal(groups[0].name, 'All Logistics');
    assert.equal(groups[0].tags.length, 5);
  });

  it('should handle case-insensitive tag matching', () => {
    const spec = {
      openapi: '3.1.0',
      'x-tagGroups': [
        {
          name: 'Core',
          tags: ['SHIPMENTS', 'Tracking'],
        },
      ],
    };

    const groups = groupByTagGroups(spec, mockTags);
    assert.equal(groups[0].name, 'Core');
    assert.equal(groups[0].tags.length, 2);
    assert.equal(groups[0].tags[0].name, 'shipments');
    assert.equal(groups[0].tags[1].name, 'tracking');
  });

  it('should populate tagGroups in ProcessSpec full pipeline', async () => {
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Cosmo Cargo Portal', version: '1.0.0' },
      'x-tagGroups': [
        {
          name: 'Logistics',
          tags: ['shipments'],
        },
      ],
      tags: [{ name: 'shipments', description: 'Shipment endpoints' }],
      paths: {
        '/shipments': {
          get: {
            tags: ['shipments'],
            summary: 'List shipments',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);
    assert.ok(parsed.tagGroups, 'parsed.tagGroups should exist');
    assert.equal(parsed.tagGroups.length, 1);
    assert.equal(parsed.tagGroups[0].name, 'Logistics');
    assert.equal(parsed.tagGroups[0].tags[0].name, 'shipments');
    assert.equal(parsed.tagGroups[0].tags[0].paths.length, 1);
  });

  it('should render 3-tier tagGroups in navbarTemplate', async () => {
    const navbarTemplate = (await import('../../packages/rapidoc/src/templates/navbar-template.js')).default;
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Cosmo Cargo Portal', version: '1.0.0' },
      'x-tagGroups': [
        {
          name: 'Logistics',
          tags: ['shipments'],
        },
      ],
      tags: [{ name: 'shipments', description: 'Shipment endpoints' }],
      paths: {
        '/shipments': {
          get: {
            tags: ['shipments'],
            summary: 'List shipments',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);
    const context = {
      resolvedSpec: parsed,
      renderStyle: 'read',
      showSideNav: 'true',
      showInfo: 'true',
      showHeader: 'true',
      allowAdvancedSearch: 'false',
    };

    const html = renderTemplateToString(navbarTemplate.call(context));
    assert.ok(html.includes('nav-bar-tag-group'), 'Should render nav-bar-tag-group container');
    assert.ok(html.includes('Logistics'), 'Should render tag group title');
    assert.ok(html.includes('nav-bar-tags-under-group'), 'Should render nested tags container');
    assert.ok(html.includes('shipments'), 'Should render tag name inside group');
    assert.ok(html.includes('List shipments'), 'Should render operation inside group');
    assert.ok(html.includes('nav-bar-path'), 'Should render nav-bar-path items');
    assert.ok(!html.includes('colored-block'), 'colored-block marker style should not be used');
  });

  it('should mark first operation with data-first-operation-in-tag="true" and render tag description in read mode', async () => {
    const expandedEndpointTemplate = (await import('../../packages/rapidoc/src/templates/expanded-endpoint-template.js')).default;
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Test Portal', version: '1.0.0' },
      tags: [{ name: 'orders', description: 'Order lifecycle management APIs' }],
      paths: {
        '/orders': {
          get: {
            tags: ['orders'],
            summary: 'List orders',
            responses: { 200: { description: 'OK' } },
          },
          post: {
            tags: ['orders'],
            summary: 'Create order',
            responses: { 201: { description: 'Created' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);
    const context = {
      resolvedSpec: parsed,
      renderStyle: 'read',
      layout: 'row',
      config: { renderStyle: 'read', schemaStyle: 'table' },
    };

    const html = renderTemplateToString(expandedEndpointTemplate.call(context));
    assert.ok(html.includes('Order lifecycle management APIs'), 'Tag description should be rendered before operations');
    assert.ok(html.includes('data-first-operation-in-tag="true"'), 'First operation should have data-first-operation-in-tag="true"');
  });

  it('should mark first operation with data-first-operation-in-tag="true" and render tag description in view mode', async () => {
    const endpointTemplate = (await import('../../packages/rapidoc/src/templates/endpoint-template.js')).default;
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Test Portal', version: '1.0.0' },
      tags: [{ name: 'inventory', description: 'Warehouse inventory operations' }],
      paths: {
        '/inventory': {
          get: {
            tags: ['inventory'],
            summary: 'Get stock level',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);
    const context = {
      resolvedSpec: parsed,
      renderStyle: 'view',
      layout: 'row',
      config: { renderStyle: 'view', schemaStyle: 'table' },
    };

    const html = renderTemplateToString(endpointTemplate.call(context, false, false));
    assert.ok(html.includes('Warehouse inventory operations'), 'Tag description should be rendered in view mode');
    assert.ok(html.includes('data-first-operation-in-tag="true"'), 'First operation in view mode should have data-first-operation-in-tag');
  });

  it('should render tag description in focused mode only for first operation in tag', async () => {
    const focusedEndpointTemplate = (await import('../../packages/rapidoc/src/templates/focused-endpoint-template.js')).default;
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Test Portal', version: '1.0.0' },
      tags: [{ name: 'billing', description: 'Billing and invoice operations' }],
      paths: {
        '/invoices': {
          get: {
            tags: ['billing'],
            summary: 'List invoices',
            responses: { 200: { description: 'OK' } },
          },
          post: {
            tags: ['billing'],
            summary: 'Create invoice',
            responses: { 201: { description: 'Created' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);
    const firstOpId = parsed.tags[0].paths[0].elementId;
    const secondOpId = parsed.tags[0].paths[1].elementId;

    // First operation focused
    const contextFirst = {
      resolvedSpec: parsed,
      renderStyle: 'focused',
      focusedElementId: firstOpId,
      layout: 'column',
      config: { renderStyle: 'focused', schemaStyle: 'table' },
      shadowRoot: { getElementById: () => null },
    };

    const htmlFirst = renderTemplateToString(focusedEndpointTemplate.call(contextFirst));
    assert.ok(htmlFirst.includes('data-first-operation-in-tag="true"'), 'First operation in focused mode should have data-first-operation-in-tag');
    assert.ok(htmlFirst.includes('Billing and invoice operations'), 'First operation should display tag description in focused mode');

    // Second operation focused
    const contextSecond = {
      resolvedSpec: parsed,
      renderStyle: 'focused',
      focusedElementId: secondOpId,
      layout: 'column',
      config: { renderStyle: 'focused', schemaStyle: 'table' },
      shadowRoot: { getElementById: () => null },
    };

    const htmlSecond = renderTemplateToString(focusedEndpointTemplate.call(contextSecond));
    assert.ok(!htmlSecond.includes('data-first-operation-in-tag="true"'), 'Second operation in focused mode should not have data-first-operation-in-tag');
    assert.ok(!htmlSecond.includes('Billing and invoice operations'), 'Second operation should not display tag description in focused mode');
  });

  it('should apply overflow-ellipsis by default and overflow-wrap when nav-item-overflow="wrap"', async () => {
    const navbarTemplate = (await import('../../packages/rapidoc/src/templates/navbar-template.js')).default;
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Test Portal', version: '1.0.0' },
      tags: [{ name: 'shipping' }],
      paths: {
        '/shipping': {
          get: {
            tags: ['shipping'],
            summary: 'Calculate shipping rate',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    };

    const parsed = await ProcessSpec(specObj, false);

    // Default: ellipsis
    const contextDefault = {
      resolvedSpec: parsed,
      renderStyle: 'read',
      showSideNav: 'true',
      showInfo: 'true',
      showHeader: 'true',
      allowAdvancedSearch: 'false',
    };
    const htmlDefault = renderTemplateToString(navbarTemplate.call(contextDefault));
    assert.ok(htmlDefault.includes('overflow-ellipsis'), 'Navbar should have overflow-ellipsis by default');

    // Explicit: wrap
    const contextWrap = {
      ...contextDefault,
      navItemOverflow: 'wrap',
    };
    const htmlWrap = renderTemplateToString(navbarTemplate.call(contextWrap));
    assert.ok(htmlWrap.includes('overflow-wrap'), 'Navbar should have overflow-wrap when navItemOverflow="wrap"');
  });

  it('should respect x-tag-expanded for both tags and tag-groups (boolean, string, camelCase)', async () => {
    const specObj = {
      openapi: '3.1.0',
      info: { title: 'Test Portal', version: '1.0.0' },
      'x-tagGroups': [
        {
          name: 'Collapsed Group',
          'x-tag-expanded': false,
          tags: ['collapsed-tag', 'string-collapsed-tag'],
        },
        {
          name: 'Expanded Group',
          'x-tag-expanded': true,
          tags: ['expanded-tag', 'camel-tag'],
        },
      ],
      tags: [
        { name: 'collapsed-tag', 'x-tag-expanded': false },
        { name: 'string-collapsed-tag', 'x-tag-expanded': 'false' },
        { name: 'expanded-tag', 'x-tag-expanded': true },
        { name: 'camel-tag', 'x-tagExpanded': false },
      ],
      paths: {
        '/test1': { get: { tags: ['collapsed-tag'], responses: { 200: { description: 'OK' } } } },
        '/test2': { get: { tags: ['string-collapsed-tag'], responses: { 200: { description: 'OK' } } } },
        '/test3': { get: { tags: ['expanded-tag'], responses: { 200: { description: 'OK' } } } },
        '/test4': { get: { tags: ['camel-tag'], responses: { 200: { description: 'OK' } } } },
      },
    };

    const parsed = await ProcessSpec(specObj, false);

    assert.equal(parsed.tagGroups.length, 2);
    assert.equal(parsed.tagGroups[0].expanded, false, 'Collapsed Group should have expanded=false');
    assert.equal(parsed.tagGroups[1].expanded, true, 'Expanded Group should have expanded=true');

    const collapsedTag = parsed.tags.find((t) => t.name === 'collapsed-tag');
    const stringCollapsedTag = parsed.tags.find((t) => t.name === 'string-collapsed-tag');
    const expandedTag = parsed.tags.find((t) => t.name === 'expanded-tag');
    const camelTag = parsed.tags.find((t) => t.name === 'camel-tag');

    assert.equal(collapsedTag.expanded, false, 'collapsed-tag should have expanded=false');
    assert.equal(stringCollapsedTag.expanded, false, 'string-collapsed-tag should have expanded=false');
    assert.equal(expandedTag.expanded, true, 'expanded-tag should have expanded=true');
    assert.equal(camelTag.expanded, false, 'camel-tag should have expanded=false');
  });

  it('should auto-expand parent tag and tag-group containers via expandParentNavContainers', async () => {
    const { expandParentNavContainers } = await import('../../packages/rapidoc/src/templates/navbar-template.js');

    function createMockElement(className, tagName = 'div') {
      const classes = new Set(className.split(' ').filter(Boolean));
      const attributes = {};
      const children = [];
      let parent = null;

      const el = {
        tagName,
        classList: {
          contains: (cls) => classes.has(cls),
          add: (cls) => classes.add(cls),
          remove: (cls) => classes.delete(cls),
          replace: (oldCls, newCls) => {
            classes.delete(oldCls);
            classes.add(newCls);
          },
        },
        setAttribute: (k, v) => {
          attributes[k] = String(v);
        },
        getAttribute: (k) => attributes[k],
        closest: (selector) => {
          let curr = el;
          while (curr) {
            const classMatch = selector.startsWith('.') && curr.classList.contains(selector.slice(1));
            if (classMatch) return curr;
            curr = curr.parentElement;
          }
          return null;
        },
        querySelector: (selector) => {
          return children.find((c) => selector.startsWith('.') && c.classList.contains(selector.slice(1))) || null;
        },
        get parentElement() {
          return parent;
        },
        appendChild: (child) => {
          child._setParent(el);
          children.push(child);
        },
        _setParent: (p) => {
          parent = p;
        },
        style: {},
        scrollHeight: 100,
      };
      return el;
    }

    const tagGroupEl = createMockElement('nav-bar-tag-group collapsed');
    const groupHeader = createMockElement('nav-bar-tag-group-header');
    tagGroupEl.appendChild(groupHeader);

    const tagAndPathsEl = createMockElement('nav-bar-tag-and-paths collapsed');
    const tagHeader = createMockElement('nav-bar-tag');
    const pathsUnderTag = createMockElement('nav-bar-paths-under-tag');
    tagAndPathsEl.appendChild(tagHeader);
    tagAndPathsEl.appendChild(pathsUnderTag);
    tagGroupEl.appendChild(tagAndPathsEl);

    const pathEl = createMockElement('nav-bar-path');
    tagAndPathsEl.appendChild(pathEl);

    assert.ok(tagGroupEl.classList.contains('collapsed'));
    assert.ok(tagAndPathsEl.classList.contains('collapsed'));

    expandParentNavContainers(pathEl);

    assert.ok(tagGroupEl.classList.contains('expanded'));
    assert.ok(tagAndPathsEl.classList.contains('expanded'));
    assert.equal(groupHeader.getAttribute('aria-expanded'), 'true');
    assert.equal(tagHeader.getAttribute('aria-expanded'), 'true');
  });

  it('should include :has() rules for collapsed active parents in nav-styles', async () => {
    const NavStyles = (await import('../../packages/rapidoc/src/styles/nav-styles.js')).default;
    const cssText = NavStyles.cssText;
    assert.ok(
      cssText.includes('.nav-bar-tag-and-paths.collapsed:has(.nav-bar-path.active) > .nav-bar-tag'),
      'Should style collapsed tag containing active path'
    );
    assert.ok(
      cssText.includes('.nav-bar-tag-group.collapsed:has(.active) > .nav-bar-tag-group-header'),
      'Should style collapsed tag group containing active element'
    );
  });
});


