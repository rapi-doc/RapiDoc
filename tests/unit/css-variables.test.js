import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../packages/rapidoc/src');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(p);
    return /\.(js|ts)$/.test(entry.name) ? [p] : [];
  });
}

const sources = sourceFiles(srcDir).map((file) => ({ file: path.relative(srcDir, file), text: fs.readFileSync(file, 'utf8') }));
const defined = new Set(sources.flatMap(({ text }) => [...text.matchAll(/(?<![\w-])(--[a-z0-9-]+)\s*:/g)].map((m) => m[1])));

describe('CSS custom properties', () => {
  it('every variable RapiDoc reads is defined (no fallback-only hooks)', () => {
    const undefinedReads = sources.flatMap(({ file, text }) =>
      [...text.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].filter((m) => !defined.has(m[1])).map((m) => `${m[1]} in ${file}`)
    );
    assert.deepEqual([...new Set(undefinedReads)], []);
  });

  it('removed v11 variables do not come back', () => {
    const removed =
      /--(rapidoc-(bg|fg|font|font-mono)|portal-(bg|fg|font|font-mono)|font-regular|card-radius|border-radius|nav-[a-z-]+|input-border|inline-code-(fg|bg)|markdown-fg|code-fg|ui-base-size|scroll-bar-width|primary-hover|code-(property|keyword|operator)-color|content-padding|read-mode-bottom-padding|method-copy|method-purge|layout)(?![a-z0-9-])/;
    const hits = sources.filter(({ text }) => removed.test(text)).map(({ file, text }) => `${file}: ${text.match(removed)[0]}`);
    assert.deepEqual(hits, []);
  });

  it('defines the shadcn/ui tokens RapiDoc is themed with', () => {
    for (const token of [
      '--background',
      '--foreground',
      '--card',
      '--card-foreground',
      '--muted',
      '--muted-foreground',
      '--primary',
      '--primary-foreground',
      '--border',
      '--input',
      '--ring',
      '--radius',
      '--destructive',
      '--font-sans',
      '--font-mono',
    ]) {
      assert.ok(defined.has(token), `${token} must be defined`);
    }
  });
});
