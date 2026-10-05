import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTROL_REGISTRY,
  CATEGORY_TITLES,
  PRESETS,
  resolveActiveControls,
  groupControlsByCategory,
} from '../../docs/src/components/controller-registry.ts';

test('controller-registry', async (t) => {
  await t.test('CONTROL_REGISTRY contains core controls and valid attributes', () => {
    assert.ok(CONTROL_REGISTRY['render-style']);
    assert.ok(CONTROL_REGISTRY['theme']);
    assert.ok(CONTROL_REGISTRY['primary-color']);
    assert.ok(CONTROL_REGISTRY['schema-style']);
    assert.ok(CONTROL_REGISTRY['allow-try']);

    // Check properties of render-style
    const renderStyle = CONTROL_REGISTRY['render-style'];
    assert.equal(renderStyle.type, 'segmented');
    assert.equal(renderStyle.category, 'appearance');
    assert.ok(renderStyle.options.length >= 3);
    assert.ok(renderStyle.tip);

    // Check properties of a toggle control
    const allowTry = CONTROL_REGISTRY['allow-try'];
    assert.equal(allowTry.type, 'toggle');
    assert.equal(allowTry.category, 'sections');
    assert.ok(allowTry.tip);
  });

  await t.test('PRESETS map to valid controls in CONTROL_REGISTRY', () => {
    assert.ok(PRESETS.minimal.length > 0);
    for (const [presetName, controls] of Object.entries(PRESETS)) {
      if (presetName === 'none') {
        assert.equal(controls.length, 0);
        continue;
      }
      for (const ctrlKey of controls) {
        assert.ok(CONTROL_REGISTRY[ctrlKey], `Preset "${presetName}" references unknown control: "${ctrlKey}"`);
      }
    }
  });

  await t.test('CATEGORY_TITLES has human-readable titles for all categories', () => {
    const categories = ['appearance', 'theming', 'navigation', 'schema', 'sections'];
    for (const cat of categories) {
      assert.ok(CATEGORY_TITLES[cat], `Missing category title for ${cat}`);
    }
  });

  await t.test('resolveActiveControls resolves presets and custom control lists correctly', () => {
    // Preset minimal
    const minimal = resolveActiveControls(undefined, 'minimal');
    assert.ok(minimal.length >= 3);
    assert.ok(minimal.some((c) => c.attr === 'render-style'));
    assert.ok(minimal.some((c) => c.attr === 'theme'));

    // Custom list with duplicates
    const custom = resolveActiveControls(['theme', 'theme', 'schema-style', 'invalid-key']);
    assert.equal(custom.length, 2);
    assert.equal(custom[0].attr, 'theme');
    assert.equal(custom[1].attr, 'schema-style');

    // Fallback on empty/invalid preset
    const fallback = resolveActiveControls(undefined, 'non-existent-preset');
    assert.deepEqual(
      fallback.map((c) => c.attr),
      PRESETS.minimal
    );
  });

  await t.test('groupControlsByCategory groups controls into categorized sections', () => {
    const controls = resolveActiveControls(PRESETS.all);
    const groups = groupControlsByCategory(controls);

    assert.ok(groups.length > 0);
    for (const group of groups) {
      assert.ok(group.id);
      assert.ok(group.title);
      assert.ok(group.controls.length > 0);
      for (const ctrl of group.controls) {
        assert.equal(ctrl.category, group.id);
      }
    }
  });
});
