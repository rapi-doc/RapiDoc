import { describe, it, before, after } from 'node:test';
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

  describe('description click: expands only rows with more to show', () => {
    let saved;
    before(() => {
      saved = { window: globalThis.window, getComputedStyle: globalThis.getComputedStyle };
      globalThis.window = { getSelection: () => ({ isCollapsed: true }) };
      globalThis.getComputedStyle = (el) => ({ visibility: el.visibility });
    });
    after(() => {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete globalThis[key];
        else globalThis[key] = value;
      }
    });

    // A click on a description row; arrowVisible is what CSS decided, cutOff whether the line is wider than its box
    const clickRow = ({ arrowVisible = false, cutOff = false, expanded = false } = {}) => {
      const classes = new Set(expanded ? ['expanded-descr'] : []);
      const toggleEl = { visibility: arrowVisible ? 'visible' : 'hidden', setAttribute() {} };
      const bodyEl = { scrollWidth: cutOff ? 500 : 200, clientWidth: 200, querySelector: () => toggleEl };
      const trEl = {
        classList: { contains: (c) => classes.has(c), toggle: (c) => (classes.delete(c) ? false : !!classes.add(c)) },
        querySelector: () => toggleEl,
      };
      const closest = (sel) => (sel === '.tr' ? trEl : sel.includes('.descr-body') ? bodyEl : null);
      tree.schemaDescriptionExpanded = 'false';
      tree.handleAllEvents({ target: { classList: { contains: () => false }, closest } });
      return classes.has('expanded-descr');
    };

    it('does nothing for a row that fits and has no arrow', () => {
      assert.equal(clickRow(), false);
    });

    it('expands a row whose arrow CSS shows', () => {
      assert.equal(clickRow({ arrowVisible: true }), true);
    });

    it('expands a cut-off row even where CSS cannot show its arrow (Firefox, Safari)', () => {
      assert.equal(clickRow({ cutOff: true }), true);
    });

    it('collapses an expanded row', () => {
      assert.equal(clickRow({ expanded: true }), false);
    });
  });

  describe('description cell: arrow only when content is known to be hidden', () => {
    const cell = (desc, chipsNode = null, title = '') => renderToString(tree.renderDescrCell(desc, chipsNode, title));
    // CSS shows the arrow for rows with the has-more class (and, in Chromium, for rows whose line is cut off)
    const arrowHidden = (desc, chipsNode = null) => !/class="descr-body [^"]*\bhas-more\b/.test(cell(desc, chipsNode));

    it('renders an accessible arrow toggle and a one-line description body', () => {
      const html = cell('A short description');
      assert.ok(html.includes('class="descr-expand-toggle"'), 'Should render descr-expand-toggle');
      assert.ok(html.includes('role="button"'), 'Arrow should have role="button"');
      assert.ok(html.includes('tabindex="0"'), 'Arrow should have tabindex="0"');
      assert.ok(html.includes('aria-label="Toggle description"'), 'Arrow should have aria-label');
      assert.ok(html.includes('aria-expanded="false"'), 'Arrow should indicate aria-expanded');
      assert.ok(html.includes('class="descr-body m-markdown-small'), 'Should render descr-body');
    });

    it('puts the arrow first inside the description box, with no hidden attribute or "…" badge', () => {
      const html = cell('First paragraph.\n\nSecond paragraph.');
      assert.match(
        html,
        /<div class="descr-body [^"]*">\s*<span\s+class="descr-expand-toggle"/,
        'Scroll-state queries only reach descendants'
      );
      assert.ok(!/descr-expand-toggle"[^>]*\bhidden\b/.test(html), 'CSS decides whether the arrow shows');
      assert.ok(!html.includes('descr-more'), 'The plain ellipsis is the only cut-off cue');
    });

    it('hides the arrow for a single paragraph, however long', () => {
      const longDesc = 'Strategic organizational portfolio identifier assigned by executive leadership governance. '.repeat(3);
      assert.equal(arrowHidden(longDesc), true);
      assert.equal(arrowHidden('Short desc'), true);
      assert.equal(arrowHidden('Single line with trailing br <br>'), true);
    });

    it('shows the arrow for several markdown blocks, list items or line breaks', () => {
      assert.equal(arrowHidden('First paragraph.\n\nSecond paragraph.'), false);
      assert.equal(arrowHidden('- one\n- two'), false);
      assert.equal(arrowHidden('Line 1<br>Line 2'), false);
      assert.equal(arrowHidden('- only item'), true);
    });

    it('summarizes a first block that cannot fit on one line, and shows the arrow for it', () => {
      const table = '| A | B |\n| - | - |\n| 1 | 2 |\n| 3 | 4 |\n';
      for (const desc of [table, '```json\n{ "a": 1 }\n```', '<div>\n<p>HTML block</p>\n</div>', '> Quoted note']) {
        assert.equal(arrowHidden(desc), false, `Arrow for ${JSON.stringify(desc)}`);
        assert.ok(cell(desc).includes('class="descr-summary"'), `Summary line for ${JSON.stringify(desc)}`);
      }
      assert.ok(cell(table, null, 'Matrix').includes('class="descr-summary"'), 'A title leads the summary line');
      assert.ok(!cell('A plain paragraph').includes('descr-summary'), 'A paragraph is shown as it is');
      assert.ok(!cell('Intro.\n\n' + table).includes('descr-summary'), 'A paragraph before a table is the first line');
    });

    // HTML handed to unsafeHTML, in render order: the summary line (when there is one), then the full description
    const unsafeStrings = (result) =>
      (result?.values ?? []).flatMap((v) =>
        v?._$litDirective$ ? v.values.filter((x) => typeof x === 'string') : v?.strings ? unsafeStrings(v) : []
      );

    it('gives a title its own paragraph before a list or heading, and leads the summary line with it', () => {
      const [listSummary, listHtml] = unsafeStrings(tree.renderDescrCell('* `1`: highest\n* `5`: lowest', null, 'Priority'));
      assert.equal(listSummary, '<b>Priority:</b> <code>1</code>: highest');
      assert.match(listHtml, /^<p><b>Priority:<\/b><\/p>\s*<ul>/, 'The list stays a list under the title');
      assert.equal(arrowHidden('* only item'), true, 'Without a title a one-item list needs no summary');

      const [headingSummary, headingHtml] = unsafeStrings(tree.renderDescrCell('### Shipping speed\nHow fast it ships.', null, 'Speed'));
      assert.equal(headingSummary, '<b>Speed:</b> Shipping speed');
      assert.match(headingHtml, /^<p><b>Speed:<\/b><\/p>\s*<h3/);

      const paragraphHtml = renderToString(tree.renderDescrCell('Plain text', null, 'Note'));
      assert.match(paragraphHtml, /<p><b>Note:<\/b> Plain text<\/p>/, 'Before a paragraph the title stays inline, with no summary');
      assert.ok(!paragraphHtml.includes('descr-summary'));
    });

    it('summarizes a list by its first item, without the items nested under it', () => {
      const [summary] = unsafeStrings(tree.renderDescrCell('* parent\n  * child\n* sibling', null, 'Tags'));
      assert.equal(summary, '<b>Tags:</b> parent');
    });

    it('shows the arrow when constraint chips sit under a description', () => {
      const chipsNode = { constraints: 'min:1, max:10' };
      assert.equal(arrowHidden('Number of items', chipsNode), false);
      assert.ok(cell('Number of items', chipsNode).includes('class="item-details"'));
    });

    it('puts constraint chips on the first line, with no arrow, when there is no description', () => {
      const chipsNode = { constraints: 'min:1, max:10' };
      assert.equal(arrowHidden('', chipsNode), true);
      assert.ok(cell('', chipsNode).includes('class="item-details"'));
    });

    it('renders an empty cell, with no arrow, when there is no description, title or chips', () => {
      assert.equal(cell('').trim(), '<div class="td key-descr"></div>');
      assert.equal(cell('   ').trim(), '<div class="td key-descr"></div>');
      assert.equal(cell(undefined).trim(), '<div class="td key-descr"></div>');
    });

    it('renders a title-only primitive as a description', () => {
      assert.ok(cell('', null, 'Identifier').includes('class="descr-body'));
    });

    it('does not show an arrow for a long field name without a description', () => {
      const ast = schemaToAST(
        { type: 'object', properties: { primaryCorporateEntityRegistrationIdentificationNumber: { type: 'string' } } },
        0,
        'root'
      );
      const treeHtml = renderToString(tree.renderAST(ast));
      assert.ok(!treeHtml.includes('class="descr-expand-toggle"'), 'No description means no toggle');
    });

    it('uses the same description cell for every row kind in schema-tree and schema-table', () => {
      const ast = schemaToAST(
        {
          type: 'object',
          properties: {
            obj: { type: 'object', description: 'Object desc', properties: { a: { type: 'string', description: 'Primitive desc' } } },
            objList: {
              type: 'array',
              description: 'Array of objects desc',
              items: { type: 'object', properties: { b: { type: 'string' } } },
            },
            matrix: { type: 'array', description: 'Array of arrays desc', items: { type: 'array', items: { type: 'string' } } },
            tags: { type: 'array', description: 'Array of primitives desc', items: { type: 'string', minLength: 2 } },
          },
        },
        0,
        'root'
      );
      for (const html of [renderToString(tree.renderAST(ast)), renderToString(table.renderAST(ast))]) {
        assert.equal(html.match(/class="descr-body /g)?.length, 5, 'Every described row should render a descr-body');
        assert.ok(!html.includes('class="td key-descr m-markdown-small"'), 'The markdown class belongs on descr-body, not the cell');
      }
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
