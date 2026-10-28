import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Markdoc from '@markdoc/markdoc';
import { compileMarkdoc, compileDocFile, extractHeadings } from '../src/index.js';
import { portalMarkdocConfig } from '../src/markdoc/astro-config.js';

describe('RapiDoc Portal Markdoc Engine (Milestone 3)', () => {
  const DEMO_GUIDES_DIR = path.join(
    process.env.RAPIDOC_DEMO_PORTAL_DIR ??
      fileURLToPath(new URL('../../../../demo-api-portal/fixtures/zudoku-cosmo-cargo', import.meta.url)),
    'docs/guides'
  );

  it('should compile order-fulfillment.markdoc from demo-api-portal', () => {
    const filePath = `${DEMO_GUIDES_DIR}/order-fulfillment.markdoc`;
    assert.ok(fs.existsSync(filePath), `File exists: ${filePath}`);

    const result = compileDocFile(filePath);

    // 1. Verify HTML output
    assert.ok(result.html.length > 0);

    // Callout verification
    assert.ok(result.html.includes('class="portal-callout" role="note" data-type="info"'));
    assert.ok(result.html.includes('Real-time Webhook Updates'));
    assert.ok(result.html.includes('data-type="warning"'));
    assert.ok(result.html.includes('Inventory Locks'));

    // Steps verification
    assert.ok(result.html.includes('portal-steps-list'));
    assert.ok(result.html.includes('portal-step'));
    assert.ok(result.html.includes('1. Query Item Availability'));

    // Tabs verification
    assert.ok(result.html.includes('portal-tabs-container'));
    assert.ok(result.html.includes('portal-tab-bar'));
    assert.ok(result.html.includes('cURL'));
    assert.ok(result.html.includes('JavaScript'));

    // Interactive RapiDoc operation embed verification
    assert.ok(result.html.includes('portal-api-operation-embed'));
    assert.ok(result.html.includes('data-spec="orders"'));
    assert.ok(result.html.includes('data-path="/orders"'));
    assert.ok(result.html.includes('data-method="POST"'));
    assert.ok(result.html.includes('<rapi-doc-mini'));
    assert.ok(result.html.includes('match-paths="^post /orders$"'));
    assert.ok(result.html.includes('match-type="regex"'));
    assert.ok(!result.html.includes('spec-url='), 'no spec-url without a specUrls variable');

    // 2. Verify Table of Contents (TOC)
    assert.equal(result.toc.length, 2);
    assert.equal(result.toc[0].title, 'Fulfillment Steps');
    assert.equal(result.toc[0].id, 'fulfillment-steps');
    assert.equal(result.toc[0].level, 2);

    assert.equal(result.toc[1].title, 'Interactive Endpoint Preview');
    assert.equal(result.toc[1].id, 'interactive-endpoint-preview');
    assert.equal(result.toc[1].level, 2);
  });

  it('should compile loyalty-and-rewards.markdoc from demo-api-portal', () => {
    const filePath = `${DEMO_GUIDES_DIR}/loyalty-and-rewards.markdoc`;
    assert.ok(fs.existsSync(filePath));

    const result = compileDocFile(filePath);

    // Card grid & cards
    assert.ok(result.html.includes('portal-card-grid'));
    assert.ok(result.html.includes('portal-card'));
    assert.ok(result.html.includes('Seed Tier'));
    assert.ok(result.html.includes('Sprout Tier'));
    assert.ok(result.html.includes('Bloom Tier'));

    // Callout tip
    assert.ok(result.html.includes('data-type="tip"'));
    assert.ok(result.html.includes('Double Points Tuesdays'));

    // RapiDoc operation embed for loyalty redeem
    assert.ok(result.html.includes('data-spec="loyalty"'));
    assert.ok(result.html.includes('data-path="/rewards/redeem"'));

    // TOC
    assert.equal(result.toc.length, 2);
    assert.equal(result.toc[0].title, 'Loyalty Tiers');
    assert.equal(result.toc[1].title, 'Redeeming Rewards');
  });

  it('should fill in the embed spec-url from the specUrls variable and match exactly one operation', () => {
    const result = compileMarkdoc('{% api-operation spec="shipments" path="/shipments/{trackingNumber}" method="get" /%}', {
      variables: { specUrls: { shipments: '/specs/shipments.json' } },
    });
    assert.ok(result.html.includes('spec-url="/specs/shipments.json"'));
    assert.ok(result.html.includes('match-paths="^get /shipments/\\{trackingNumber\\}$"'), result.html);
  });

  it('should generate unique anchor slugs for duplicate headings', () => {
    const content = `
# Section

## Quickstart

## Quickstart

### Details
`;
    const result = compileMarkdoc(content);

    assert.ok(result.html.includes('id="quickstart"'));
    assert.ok(result.html.includes('id="quickstart-1"'));

    assert.equal(result.toc.length, 3);
    assert.equal(result.toc[0].id, 'quickstart');
    assert.equal(result.toc[1].id, 'quickstart-1');
    assert.equal(result.toc[2].id, 'details');
  });

  it('should extract frontmatter metadata correctly', () => {
    const content = `---
title: My Custom Guide
description: An awesome tutorial
author: Jane Doe
tags: [coffee, barista]
---

# Introduction

Here is some content.
`;
    const result = compileMarkdoc(content);

    assert.equal(result.frontmatter.title, 'My Custom Guide');
    assert.equal(result.frontmatter.description, 'An awesome tutorial');
    assert.equal(result.frontmatter.author, 'Jane Doe');
    assert.deepEqual(result.frontmatter.tags, ['coffee', 'barista']);
  });

  it('should render custom code fence with language data attributes', () => {
    const content = `
\`\`\`javascript
const greeting = "Hello RapiDoc!";
console.log(greeting);
\`\`\`
`;
    const result = compileMarkdoc(content);

    assert.ok(result.html.includes('portal-code-block'));
    assert.ok(result.html.includes('language-javascript'));
    assert.ok(result.html.includes('data-language="javascript"'));
    assert.ok(result.html.includes('const greeting = &quot;Hello RapiDoc!&quot;;'));
  });

  it('should accept the process=false fence annotation in the docs pages config (shows tags without checking them)', () => {
    const { nodes, tags } = portalMarkdocConfig();
    const ast = Markdoc.parse('```md {% process=false %}\n{% not-a-tag x=1 %}\n```\n');
    assert.deepEqual(
      Markdoc.validate(ast, { nodes, tags }).map((e) => e.error.message),
      []
    );
    assert.ok(compileMarkdoc('```md {% process=false %}\n{% callout %}x{% /callout %}\n```\n').html.includes('{% callout %}'));
  });
});
