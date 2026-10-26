import test from 'node:test';
import assert from 'node:assert/strict';
import themeTokens, {
  THEME_PRESETS,
  isValidHexColor,
  isValidTheme,
  normalizeTheme,
} from '../../packages/rapidoc/src/styles/theme-tokens.js';
import navStyles from '../../packages/rapidoc/src/styles/nav-styles.js';

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
    const resUpper = normalizeTheme('COBALT');
    assert.equal(resUpper.theme, 'cobalt');
  });

  await t.test('normalizeTheme returns valid hex color as-is', () => {
    assert.deepEqual(normalizeTheme('#3b82f6'), { theme: '#3b82f6' });
    assert.deepEqual(normalizeTheme('#10B981'), { theme: '#10B981' });
    assert.deepEqual(normalizeTheme('#fff'), { theme: '#fff' });
  });

  await t.test('normalizeTheme falls back to "ember" for any invalid or missing theme', () => {
    assert.deepEqual(normalizeTheme('foobar'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('default'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('modern'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('dark'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('light'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('rgb(255, 0, 0)'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme('hsl(200, 50%, 50%)'), { theme: 'ember' });
    assert.deepEqual(normalizeTheme(''), { theme: 'ember' });
    assert.deepEqual(normalizeTheme(null), { theme: 'ember' });
    assert.deepEqual(normalizeTheme(undefined), { theme: 'ember' });
  });

  await t.test('navigation uses the shadcn/ui --sidebar-* tokens', () => {
    for (const token of [
      '--sidebar',
      '--sidebar-foreground',
      '--sidebar-primary',
      '--sidebar-border',
      '--sidebar-ring',
      '--sidebar-width',
    ]) {
      assert.match(themeTokens.cssText, new RegExp(`${token}:`), `${token} must be defined`);
    }
    assert.match(navStyles.cssText, /background:\s*var\(--sidebar\);/);
    assert.match(navStyles.cssText, /color:\s*var\(--sidebar-accent-foreground\);\s*background:\s*var\(--sidebar-accent\);/);
    assert.match(navStyles.cssText, /border-inline-start:\s*4px solid var\(--sidebar-primary\);\s*color:\s*var\(--sidebar-primary\);/);

    // Active items always use the left-bar marker style
    assert.match(navStyles.cssText, /\.left-bar\.active/);
    assert.doesNotMatch(navStyles.cssText, /\.colored-block\.active/);
  });

  await t.test('sidebar logo slot uses --sidebar-logo-max-height and overflow clipping', () => {
    assert.match(themeTokens.cssText, /--sidebar-logo-max-height:\s*60px;/);
    assert.match(navStyles.cssText, /max-height:\s*var\(--sidebar-logo-max-height\);/);
    assert.match(navStyles.cssText, /overflow:\s*hidden;/);
  });

  await t.test('the five presets each define dark, light and system-light rules', () => {
    assert.deepEqual(THEME_PRESETS, ['ember', 'carbon', 'cobalt', 'jade', 'indigo']);
    for (const preset of THEME_PRESETS) {
      assert.match(themeTokens.cssText, new RegExp(`:host\\(\\[theme='${preset}'\\]\\)`), `${preset} dark rule`);
      assert.match(themeTokens.cssText, new RegExp(`:host\\(\\[theme='${preset}'\\]\\[color-scheme='light'\\]\\)`), `${preset} light rule`);
      assert.match(
        themeTokens.cssText,
        new RegExp(`:host\\(\\[theme='${preset}'\\]\\[color-scheme='system'\\]\\)`),
        `${preset} system rule`
      );
    }
    // Only the default preset applies without a theme attribute
    assert.match(themeTokens.cssText, /:host\(\[theme='ember'\]\),\s*:host\(:not\(\[theme\]\)\)/);
    assert.doesNotMatch(themeTokens.cssText, /:host\(\[theme='carbon'\]\),\s*:host\(:not/);
  });

  await t.test('a hex color is kept as a custom theme, not mapped to a preset', () => {
    assert.deepEqual(normalizeTheme('#f76b39'), { theme: '#f76b39' });
  });

  await t.test('light theme default surfaces use #27272a foreground and derived card-foreground', () => {
    assert.match(themeTokens.cssText, /:host\(\[color-scheme='light'\]\)[\s\S]*?--foreground:\s*#27272a;/);
    assert.match(themeTokens.cssText, /:host\(\[color-scheme='light'\]\)[\s\S]*?--card-foreground:\s*color-mix/);
  });

  await t.test('--ring follows --primary so every theme has a focus ring', () => {
    assert.match(themeTokens.cssText, /--ring:\s*var\(--primary\);/);
    assert.match(themeTokens.cssText, /--focus-shadow:[^;]*var\(--ring\)/);
  });

  await t.test('--font-sans and --font-mono are plain shadcn/ui font tokens', () => {
    assert.match(themeTokens.cssText, /--font-sans:\s*-apple-system/);
    assert.match(themeTokens.cssText, /--font-mono:\s*ui-monospace/);
  });
});
