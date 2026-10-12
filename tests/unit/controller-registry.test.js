import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTROL_REGISTRY,
  CATEGORY_TITLES,
  PRESETS,
  resolveActiveControls,
  resolveControlKeys,
  resolveActiveSlots,
  groupControlsByCategory,
} from '../../docs/src/components/controller-registry.ts';

test('controller-registry', async (t) => {
  await t.test('CONTROL_REGISTRY contains core controls and valid attributes', () => {
    assert.ok(CONTROL_REGISTRY['render-style']);
    assert.ok(CONTROL_REGISTRY['theme']);
    assert.ok(CONTROL_REGISTRY['color-scheme']);
    assert.ok(CONTROL_REGISTRY['radius']);
    assert.ok(CONTROL_REGISTRY['scale']);
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

  await t.test('slots preset includes slot controls and color preset excludes slot controls', () => {
    // PRESETS.slots and PRESETS.slot include slot controls
    assert.deepEqual(PRESETS.slots, ['slot-nav-logo', 'slot-fixed-header', 'slot-default']);
    assert.deepEqual(PRESETS.slot, ['slot-nav-logo', 'slot-fixed-header', 'slot-default']);

    // Color presets do NOT contain slot controls
    for (const ctrl of PRESETS.colors) {
      assert.equal(CONTROL_REGISTRY[ctrl].category, 'theming');
      assert.ok(!ctrl.startsWith('slot-'));
    }
    for (const ctrl of PRESETS.color) {
      assert.equal(CONTROL_REGISTRY[ctrl].category, 'theming');
      assert.ok(!ctrl.startsWith('slot-'));
    }

    // resolveActiveSlots on color preset is empty
    assert.deepEqual(resolveActiveSlots(undefined, 'color'), []);
    assert.deepEqual(resolveActiveSlots(undefined, ['color']), []);
    assert.deepEqual(resolveActiveSlots(undefined, 'colors'), []);
    assert.deepEqual(resolveActiveSlots(undefined, ['colors']), []);

    // resolveActiveSlots on slot preset returns all 3 slots
    assert.deepEqual(resolveActiveSlots(undefined, 'slot'), ['nav-logo', 'fixed-header', 'default']);
    assert.deepEqual(resolveActiveSlots(undefined, ['slot']), ['nav-logo', 'fixed-header', 'default']);
    assert.deepEqual(resolveActiveSlots(undefined, 'slots'), ['nav-logo', 'fixed-header', 'default']);
    assert.deepEqual(resolveActiveSlots(undefined, ['slots']), ['nav-logo', 'fixed-header', 'default']);
  });

  await t.test('array presets calculate unique set of controls', () => {
    // Array of presets ['color', 'slot']
    const colorAndSlot = resolveControlKeys(undefined, ['color', 'slot']);
    assert.ok(colorAndSlot.includes('theme'));
    assert.ok(colorAndSlot.includes('slot-nav-logo'));
    assert.ok(colorAndSlot.includes('slot-fixed-header'));
    assert.ok(colorAndSlot.includes('slot-default'));
    assert.equal(resolveActiveSlots(undefined, ['color', 'slot']).length, 3);

    // Array of overlapping presets calculate unique set
    const minimalAndSchema = resolveControlKeys(undefined, ['minimal', 'schema']);
    const schemaStyleCount = minimalAndSchema.filter((k) => k === 'schema-style').length;
    assert.equal(schemaStyleCount, 1, 'schema-style should only appear once');

    // Multi-preset controls resolution
    const activeControls = resolveActiveControls(undefined, ['color', 'slot']);
    assert.ok(activeControls.some((c) => c.attr === 'theme'));
    assert.ok(activeControls.some((c) => c.attr === 'slot-nav-logo'));

    // Unique count matches set size
    const uniqueAttrs = new Set(activeControls.map((c) => c.attr));
    assert.equal(uniqueAttrs.size, activeControls.length);
  });
});
