import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';
import { fixRenderedAnchorLinks } from '../../packages/rapidoc/src/utils/markdown-utils.ts';

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
