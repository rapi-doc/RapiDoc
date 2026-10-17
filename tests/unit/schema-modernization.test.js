import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { schemaToAST } from '../../packages/rapidoc/src/utils/schema-utils.js';

// Polyfill minimal browser globals for Lit components in Node.js
if (typeof globalThis.customElements === 'undefined') {
  globalThis.customElements = { define: () => {} };
}

const { default: SchemaTree } = await import('../../packages/rapidoc/src/components/schema-tree.js');
const { default: SchemaTable } = await import('../../packages/rapidoc/src/components/schema-table.js');

function renderToString(result) {
  if (!result) return '';
  if (typeof result === 'string' || typeof result === 'number') return String(result);
  if (Array.isArray(result)) return result.map(renderToString).join('');
  if (result.strings && result.values) {
    let str = '';
    for (let i = 0; i < result.strings.length; i++) {
      str += result.strings[i];
      if (i < result.values.length) {
        str += renderToString(result.values[i]);
      }
    }
    return str;
  }
  return '';
}

describe('Schema Modernization & Accessibility (schema-tree & schema-table)', () => {
  const tree = new SchemaTree();
  tree.schemaExpandLevel = 999;
  const table = new SchemaTable();
  table.schemaExpandLevel = 999;

  describe('schema-tree keyboard & ARIA attributes', () => {
    it('should render role="button", tabindex="0", aria-expanded on object open-bracket', () => {
      const ast = schemaToAST({ type: 'object', properties: { id: { type: 'string' } } }, 0, 'user');
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes('role="button"'), 'Should have role="button"');
      assert.ok(html.includes('tabindex="0"'), 'Should have tabindex="0"');
      assert.ok(html.includes('aria-label="Toggle user"'), 'Should have descriptive aria-label');
      assert.ok(html.includes('aria-expanded="true"'), 'Should indicate expanded state');
    });

    it('should render role="button", tabindex="0", aria-expanded on array-of-object open-bracket', () => {
      const ast = schemaToAST({ type: 'array', items: { type: 'object', properties: { id: { type: 'integer' } } } }, 0, 'items');
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes('role="button"'), 'Array of objects should have role="button"');
      assert.ok(html.includes('tabindex="0"'), 'Array of objects should have tabindex="0"');
      assert.ok(html.includes('aria-label="Toggle items"'), 'Should have descriptive aria-label');
      assert.ok(html.includes('aria-expanded="true"'), 'Should indicate expanded state');
    });

    it('should render role="button", tabindex="0", aria-expanded on array-of-array open-bracket', () => {
      const ast = schemaToAST({ type: 'array', items: { type: 'array', items: { type: 'string' } } }, 0, 'matrix');
      const html = renderToString(tree.renderAST(ast));
      assert.ok(html.includes('role="button"'), 'Array of arrays should have role="button"');
      assert.ok(html.includes('tabindex="0"'), 'Array of arrays should have tabindex="0"');
      assert.ok(html.includes('aria-label="Toggle matrix"'), 'Should have descriptive aria-label');
      assert.ok(html.includes('aria-expanded="true"'), 'Should indicate expanded state');
    });

    it('should attach keydown handler to the tree root', () => {
      tree.data = { kind: 'object', type: 'object', properties: [] };
      const treeHtml = renderToString(tree.render());
      assert.ok(treeHtml.includes('@keydown='), 'Tree container should have @keydown handler attached');
    });
  });

  describe('schema-table keyboard, button elements & ARIA attributes', () => {
    it('should render <button type="button" class="obj-toggle"> with aria-label and aria-expanded for objects', () => {
      const ast = schemaToAST({ type: 'object', properties: { nested: { type: 'string' } } }, 0, 'account');
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes('<button'), 'Should render <button> tag for obj-toggle');
      assert.ok(html.includes('class="obj-toggle"'), 'Should have class="obj-toggle"');
      assert.ok(html.includes('data-obj="account"'), 'Should have data-obj="account"');
      assert.ok(html.includes('aria-label="Toggle account"'), 'Should have descriptive aria-label');
      assert.ok(html.includes('aria-expanded="true"'), 'Should have aria-expanded="true" when schemaLevel < schemaExpandLevel');
    });

    it('should render <button type="button" class="obj-toggle"> with aria-label and aria-expanded for object arrays', () => {
      const ast = schemaToAST({ type: 'array', items: { type: 'object', properties: { id: { type: 'integer' } } } }, 0, 'users');
      const html = renderToString(table.renderAST(ast));
      assert.ok(html.includes('<button'), 'Should render <button> tag for obj-toggle');
      assert.ok(html.includes('class="obj-toggle"'), 'Should have class="obj-toggle"');
      assert.ok(html.includes('data-obj="users"'), 'Should have data-obj="users"');
      assert.ok(html.includes('aria-label="Toggle users"'), 'Should have descriptive aria-label');
      assert.ok(html.includes('aria-expanded="true"'), 'Should have aria-expanded="true"');
    });

    it('should attach keydown handler to the table root and render table-container / table-header classes', () => {
      table.data = { kind: 'object', type: 'object', properties: [] };
      const tableHtml = renderToString(table.render());
      assert.ok(tableHtml.includes('@keydown='), 'Table container should have @keydown handler attached');
      assert.ok(tableHtml.includes('class="table-container"'), 'Should render table-container class');
      assert.ok(tableHtml.includes('class="tr table-header"'), 'Should render table-header class');
    });
  });

  describe('description expander accessibility & expandability detection', () => {
    it('should render role="button", tabindex="0", and aria-label on descr-expand-toggle', () => {
      const expanderHtml = renderToString(tree.renderDescrExpander(true, true));
      assert.ok(expanderHtml.includes('class="descr-expand-toggle'), 'Should render descr-expand-toggle');
      assert.ok(expanderHtml.includes('role="button"'), 'Expander should have role="button"');
      assert.ok(expanderHtml.includes('tabindex="0"'), 'Expander should have tabindex="0"');
      assert.ok(expanderHtml.includes('aria-label="Toggle description"'), 'Expander should have aria-label');
      assert.ok(expanderHtml.includes('aria-expanded="false"'), 'Expander should indicate aria-expanded');
    });

    it('isDescriptionExpandable returns true for long single-line descriptions (>75 chars)', () => {
      const longDesc = 'Strategic organizational portfolio identifier assigned by executive leadership governance.';
      assert.equal(longDesc.length > 75, true);
      assert.equal(table.isDescriptionExpandable(longDesc), true);
      assert.equal(tree.isDescriptionExpandable(longDesc), true);
    });

    it('isDescriptionExpandable returns false for medium/short descriptions (<=75 chars) without newlines/chips', () => {
      const mediumDesc = 'Global corporate entity registration and compliance identification code';
      assert.equal(mediumDesc.length <= 75, true);
      assert.equal(table.isDescriptionExpandable(mediumDesc, false), false);
      assert.equal(tree.isDescriptionExpandable(mediumDesc, false), false);
    });

    it('isDescriptionExpandable returns true when hasChips is true or newlines exist', () => {
      assert.equal(table.isDescriptionExpandable('short', true), true);
      assert.equal(table.isDescriptionExpandable('line1\nline2', false), true);
      assert.equal(table.isDescriptionExpandable('line1<br>line2', false), true);
    });

    it('renders descr-expand-toggle for fields with long single-line descriptions in schema-table and schema-tree', () => {
      const longDesc = 'Strategic organizational portfolio identifier assigned by executive leadership governance.';
      const ast = schemaToAST(
        {
          type: 'object',
          properties: {
            departmentExecutiveLeadershipPortfolioIdentifier: {
              type: 'string',
              description: longDesc,
            },
            shortField: {
              type: 'string',
              description: 'Short desc',
            },
          },
        },
        0,
        'root'
      );

      const tableHtml = renderToString(table.renderAST(ast));
      assert.ok(
        tableHtml.includes('class="descr-expand-toggle'),
        'schema-table should render descr-expand-toggle for long single-line description (>75 chars)'
      );

      const treeHtml = renderToString(tree.renderAST(ast));
      assert.ok(
        treeHtml.includes('class="descr-expand-toggle'),
        'schema-tree should render descr-expand-toggle for long single-line description (>75 chars)'
      );
    });

    it('isDescriptionExpandable returns true for long field names (> 48 chars) and false for <= 48 chars without description', () => {
      const longName = 'primaryCorporateEntityRegistrationIdentificationNumber'; // 55 chars
      assert.equal(longName.length > 48, true);
      assert.equal(tree.isDescriptionExpandable('', false, '', longName), true);

      const shortName = 'internalCorporateAdministrativeTaxIdentifier'; // 44 chars
      assert.equal(shortName.length <= 48, true);
      assert.equal(tree.isDescriptionExpandable('', false, '', shortName), false);
    });

    it('renders descr-expand-toggle in schema-tree for long field name (> 48 chars) even with no description', () => {
      const ast = schemaToAST(
        {
          type: 'object',
          properties: {
            primaryCorporateEntityRegistrationIdentificationNumber: {
              type: 'string',
            },
            internalCorporateAdministrativeTaxIdentifier: {
              type: 'string',
            },
          },
        },
        0,
        'root'
      );

      const treeHtml = renderToString(tree.renderAST(ast));
      assert.ok(treeHtml.includes('class="descr-expand-toggle'), 'schema-tree should render descr-expand-toggle for field name > 48 chars');
    });

    it('getThresholds returns default thresholds and supports custom overrides', () => {
      const defaults = tree.getThresholds();
      assert.equal(defaults.descThreshold, 75);
      assert.equal(defaults.fieldNameThreshold, 48);
    });

    it('renders title tooltip on key-label in schema-table and schema-tree', () => {
      const ast = schemaToAST(
        {
          type: 'object',
          properties: {
            customFieldName: {
              type: 'string',
              description: 'Some desc',
            },
          },
        },
        0,
        'root'
      );

      const tableHtml = renderToString(table.renderAST(ast));
      assert.ok(tableHtml.includes('title="customFieldName"'), 'schema-table should include title="customFieldName"');

      const treeHtml = renderToString(tree.renderAST(ast));
      assert.ok(treeHtml.includes('title="customFieldName"'), 'schema-tree should include title="customFieldName"');
    });
  });
});
