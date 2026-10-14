import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';
import { fixRenderedAnchorLinks } from '../../packages/rapidoc/src/utils/markdown-utils.js';

describe('markdown in-page anchor links', () => {
  let originalLocation;
  beforeEach(() => {
    originalLocation = globalThis.location;
    globalThis.location = { href: 'https://example.com/docs/page?x=1#old-hash' };
  });
  afterEach(() => {
    if (originalLocation === undefined) {
      delete globalThis.location;
    } else {
      globalThis.location = originalLocation;
    }
  });

  it('renders #anchors as absolute URLs of the current page with the anchor-link class', () => {
    const html = marked.parse('[go](#section-1)');
    assert.match(html, /<a class="anchor-link" href="https:\/\/example\.com\/docs\/page\?x=1#section-1">go<\/a>/);
  });

  it('keeps the link title only when present', () => {
    assert.match(marked.parse('[go](#a "Title")'), /title="Title"/);
    assert.doesNotMatch(marked.parse('[go](#a)'), /title=/);
  });

  it('renders inline markdown inside the link text', () => {
    assert.match(marked.parse('[**bold**](#a)'), /<a class="anchor-link" [^>]*><strong>bold<\/strong><\/a>/);
  });

  it('leaves external and relative links to the default renderer', () => {
    const html = marked.parse('[ext](https://other.org/a) [rel](./b)');
    assert.match(html, /<a href="https:\/\/other\.org\/a">ext<\/a>/);
    assert.match(html, /<a href="\.\/b">rel<\/a>/);
    assert.doesNotMatch(html, /anchor-link/);
  });

  it('also fixes links when a custom renderer replaces the global one (e.g. headings in the nav bar)', () => {
    const renderer = new marked.Renderer();
    fixRenderedAnchorLinks(renderer);
    const html = marked.parse('[go](#a) and [ext](https://other.org/a)', { renderer });
    assert.match(html, /<a class="anchor-link" href="https:\/\/example\.com\/docs\/page\?x=1#a">go<\/a>/);
    assert.match(html, /<a href="https:\/\/other\.org\/a">ext<\/a>/);
  });

  it('does not fix links of a custom renderer that was not opted in', () => {
    const html = marked.parse('[go](#a)', { renderer: new marked.Renderer() });
    assert.doesNotMatch(html, /anchor-link/);
  });
});

describe('hasMultilineDescription', () => {
  it('returns false for null, undefined, or empty string', async () => {
    const { hasMultilineDescription } = await import('../../packages/rapidoc/src/utils/markdown-utils.js');
    assert.equal(hasMultilineDescription(null), false);
    assert.equal(hasMultilineDescription(undefined), false);
    assert.equal(hasMultilineDescription(''), false);
    assert.equal(hasMultilineDescription(123), false);
  });

  it('returns false for single-line text', async () => {
    const { hasMultilineDescription } = await import('../../packages/rapidoc/src/utils/markdown-utils.js');
    assert.equal(hasMultilineDescription('Single line description'), false);
    assert.equal(hasMultilineDescription('Single line with trailing br <br>'), false);
    assert.equal(hasMultilineDescription('Single line with trailing br <br/>'), false);
  });

  it('returns true for text with newline characters', async () => {
    const { hasMultilineDescription } = await import('../../packages/rapidoc/src/utils/markdown-utils.js');
    assert.equal(hasMultilineDescription('First line\nSecond line'), true);
    assert.equal(hasMultilineDescription('First line\r\nSecond line'), true);
  });

  it('returns true for text with internal <br> tags', async () => {
    const { hasMultilineDescription } = await import('../../packages/rapidoc/src/utils/markdown-utils.js');
    assert.equal(hasMultilineDescription('Line 1<br>Line 2'), true);
    assert.equal(hasMultilineDescription('Line 1<br/>Line 2'), true);
    assert.equal(hasMultilineDescription('Line 1<br />Line 2'), true);
  });
});
