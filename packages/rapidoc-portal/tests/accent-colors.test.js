import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accentColors, contrast } from '../src/engine/accent-colors.js';

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

test('accent text reaches 4.5:1 on the light and dark backgrounds and the primary tint', () => {
  for (const primary of ['#f76b39', '#2563eb', '#10b981', '#facc15', '#1e3a8a', '#ffffff', '#000000']) {
    const { textLight, textDark, onPrimary } = accentColors(primary);
    for (const bg of ['#ffffff', '#f4f4f5']) {
      for (const surface of [rgb(bg), mix(rgb(bg), rgb(primary), 0.12)]) {
        assert.ok(contrast(rgb(textLight), surface) >= 4.5, `${primary}: light text ${textLight}`);
      }
    }
    for (const surface of [rgb('#22242b'), mix(rgb('#22242b'), rgb(primary), 0.12)]) {
      assert.ok(contrast(rgb(textDark), surface) >= 4.5, `${primary}: dark text ${textDark}`);
    }
    const other = onPrimary === '#000000' ? '#ffffff' : '#000000';
    assert.ok(contrast(rgb(onPrimary), rgb(primary)) >= contrast(rgb(other), rgb(primary)), `${primary}: on-primary ${onPrimary}`);
  }
});

test('a primary that already contrasts is used as is', () => {
  assert.equal(accentColors('#1e3a8a').textLight, '#1e3a8a');
});

test('non-hex colors fall back to color-mix()', () => {
  const { textLight, onPrimary } = accentColors('rebeccapurple');
  assert.match(textLight, /^color-mix\(in oklch, rebeccapurple/);
  assert.equal(onPrimary, '#000000');
});
