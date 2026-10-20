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

  await t.test('--nav-hover-fg token is defined and used correctly', () => {
    // Assert --nav-hover-fg token is declared in theme tokens
    assert.match(themeTokens.cssText, /--nav-hover-fg:\s*var\(--foreground\);/);

    // Assert nav styles use var(--nav-hover-fg, var(--foreground))
    assert.match(navStyles.cssText, /var\(--nav-hover-fg,\s*var\(--foreground\)\)/);

    // Assert deprecated --nav-hover-text has been completely dropped
    assert.doesNotMatch(themeTokens.cssText, /--nav-hover-text/);
    assert.doesNotMatch(navStyles.cssText, /--nav-hover-text/);
  });

  await t.test('--nav-accent-fg token is defined and used correctly', () => {
    // Assert --nav-accent-fg token is declared in theme tokens (defaults to var(--primary))
    assert.match(themeTokens.cssText, /--nav-accent-fg:\s*var\(--primary\);/);

    // Assert nav styles use var(--nav-accent-fg, var(--primary)) for left-bar active text color
    assert.match(navStyles.cssText, /color:\s*var\(--nav-accent-fg,\s*var\(--primary\)\);/);

    // Assert active items always use left-bar marker style
    assert.match(navStyles.cssText, /\.left-bar\.active/);
    assert.doesNotMatch(navStyles.cssText, /\.colored-block\.active/);

    // Assert --nav-accent and --nav-accent-foreground are completely dropped
    assert.doesNotMatch(themeTokens.cssText, /--nav-accent:/);
    assert.doesNotMatch(themeTokens.cssText, /--nav-accent-foreground/);
    assert.doesNotMatch(navStyles.cssText, /var\(--nav-accent,/);
    assert.doesNotMatch(navStyles.cssText, /--nav-accent-foreground/);
  });

  await t.test('--nav-logo slot uses --nav-logo-max-height and overflow clipping', () => {
    // Assert --nav-logo-max-height token exists
    assert.match(themeTokens.cssText, /--nav-logo-max-height:\s*60px;/);

    // Assert nav styles use var(--nav-logo-max-height, 60px) and overflow: hidden
    assert.match(navStyles.cssText, /max-height:\s*var\(--nav-logo-max-height,\s*60px\);/);
    assert.match(navStyles.cssText, /overflow:\s*hidden;/);
  });

  await t.test('normalizeTheme maps #f76b39 to amber preset', () => {
    assert.deepEqual(normalizeTheme('#f76b39'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('#F76B39'), { theme: 'amber' });
    assert.deepEqual(normalizeTheme('  #f76b39  '), { theme: 'amber' });
  });

  await t.test('light theme default surfaces use #555555 for softer medium-gray foreground', () => {
    assert.match(themeTokens.cssText, /:host\(\[color-scheme='light'\]\)[\s\S]*?--foreground:\s*#555555;/);
    assert.match(themeTokens.cssText, /:host\(\[color-scheme='light'\]\)[\s\S]*?--card-foreground:\s*#555555;/);
  });
});
