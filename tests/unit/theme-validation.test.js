import test from 'node:test';
import assert from 'node:assert/strict';
import { THEME_PRESETS, isValidHexColor, isValidTheme, normalizeTheme } from '../../packages/rapidoc/src/styles/theme-tokens.js';

test('theme-validation', async (t) => {
  await t.test('isValidHexColor validates 3, 6, and 8 digit hex color codes', () => {
    // Valid hex colors
    assert.equal(isValidHexColor('#fff'), true);
    assert.equal(isValidHexColor('#FFF'), true);
    assert.equal(isValidHexColor('#3b82f6'), true);
    assert.equal(isValidHexColor('#10B981'), true);
    assert.equal(isValidHexColor('#12345678'), true);
    assert.equal(isValidHexColor('  #abc  '), true);

    // Invalid hex colors
    assert.equal(isValidHexColor('fff'), false);
    assert.equal(isValidHexColor('#gg1234'), false);
    assert.equal(isValidHexColor('#12'), false);
    assert.equal(isValidHexColor('#12345'), false);
    assert.equal(isValidHexColor('rgb(255, 0, 0)'), false);
    assert.equal(isValidHexColor('red'), false);
    assert.equal(isValidHexColor(''), false);
    assert.equal(isValidHexColor(null), false);
    assert.equal(isValidHexColor(undefined), false);
  });

  await t.test('isValidTheme accepts only presets and valid hex colors', () => {
    // Presets
    for (const preset of THEME_PRESETS) {
      assert.equal(isValidTheme(preset), true, `Preset "${preset}" should be valid`);
      assert.equal(isValidTheme(preset.toUpperCase()), true, `Uppercase "${preset}" should be valid`);
    }

    // Hex colors
    assert.equal(isValidTheme('#3b82f6'), true);
    assert.equal(isValidTheme('#fff'), true);

    // Invalid themes
    assert.equal(isValidTheme('default'), false);
    assert.equal(isValidTheme('modern'), false);
    assert.equal(isValidTheme('dark'), false);
    assert.equal(isValidTheme('light'), false);
    assert.equal(isValidTheme('custom-blue'), false);
    assert.equal(isValidTheme('rgb(0, 0, 0)'), false);
    assert.equal(isValidTheme(''), false);
    assert.equal(isValidTheme(null), false);
  });

  await t.test('normalizeTheme returns allowed presets as-is', () => {
    for (const preset of THEME_PRESETS) {
      const res = normalizeTheme(preset);
      assert.equal(res.theme, preset);
    }

    // Case-insensitive preset
    const resUpper = normalizeTheme('EMERALD');
    assert.equal(resUpper.theme, 'emerald');
  });

  await t.test('normalizeTheme returns valid hex color as-is', () => {
    assert.deepEqual(normalizeTheme('#3b82f6'), { theme: '#3b82f6' });
    assert.deepEqual(normalizeTheme('#10B981'), { theme: '#10B981' });
    assert.deepEqual(normalizeTheme('#fff'), { theme: '#fff' });
  });

  await t.test('normalizeTheme falls back to "amber" for any invalid or missing theme', () => {
    assert.deepEqual(normalizeTheme('foobar'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('default'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('modern'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('dark'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('light'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('rgb(255, 0, 0)'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('hsl(200, 50%, 50%)'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme(''), { theme: 'amber' });
    assert.deepEqual(normalizeTheme(null), { theme: 'amber' });
    assert.deepEqual(normalizeTheme(undefined), { theme: 'amber' });
  });
});
