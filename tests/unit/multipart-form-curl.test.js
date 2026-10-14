import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import TagInput from '../../packages/rapidoc/src/components/tag-input.js';
import { getMergedProperties, getMergedRequired, EMPTY_ARRAY } from '../../packages/rapidoc/src/utils/schema-utils.js';

describe('multipart/form-data cURL and Array Input Handling', () => {
  it('TagInput hasChanged should not trigger update for arrays with identical values', () => {
    const hasChanged = TagInput.properties.value.hasChanged;
    assert.equal(hasChanged(['alpha', 'beta'], ['alpha', 'beta']), false);
    assert.equal(hasChanged([], []), false);
    assert.equal(hasChanged(['alpha'], ['beta']), true);
    assert.equal(hasChanged(['alpha'], ['alpha', 'beta']), true);
    assert.equal(hasChanged(['alpha'], undefined), true);
  });

  it('EMPTY_ARRAY constant should be frozen and empty', () => {
    assert.equal(Array.isArray(EMPTY_ARRAY), true);
    assert.equal(EMPTY_ARRAY.length, 0);
    assert.equal(Object.isFrozen(EMPTY_ARRAY), true);
  });

  it('should format multiple FormData entries for array items without regex corruption', () => {
    const formData = new FormData();
    const items = ['apple', 'banana', 'cherry'];
    items.forEach((item) => formData.append('items', item));
    formData.append('itemType', 'typeA');

    const curlForm = Array.from(formData)
      .map(([key, value]) => {
        if (value instanceof File) {
          return ` -F "${key}=@${value.name}"`;
        }
        const sanitizedVal = typeof value === 'string' ? value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : value;
        return ` -F "${key}=${sanitizedVal}"`;
      })
      .join('\\\n');

    assert.ok(curlForm.includes('-F "items=apple"'));
    assert.ok(curlForm.includes('-F "items=banana"'));
    assert.ok(curlForm.includes('-F "items=cherry"'));
    assert.ok(curlForm.includes('-F "itemType=typeA"'));
    // Ensure words are not chopped up by old /([^,],)/gm regex
    assert.ok(!curlForm.includes('e,'));
    assert.ok(!curlForm.includes('a,'));
  });

  it('should escape double quotes and backslashes in cURL FormData values', () => {
    const formData = new FormData();
    formData.append('description', 'A "special" \\escaped\\ note');

    const curlForm = Array.from(formData)
      .map(([key, value]) => {
        if (value instanceof File) {
          return ` -F "${key}=@${value.name}"`;
        }
        const sanitizedVal = typeof value === 'string' ? value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : value;
        return ` -F "${key}=${sanitizedVal}"`;
      })
      .join('\\\n');

    assert.equal(curlForm, ' -F "description=A \\"special\\" \\\\escaped\\\\ note"');
  });

  it('should handle FormData with File objects', () => {
    const formData = new FormData();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    formData.append('avatar', file, file.name);
    formData.append('username', 'octocat');

    const curlForm = Array.from(formData)
      .map(([key, value]) => {
        if (value instanceof File) {
          return ` -F "${key}=@${value.name}"`;
        }
        const sanitizedVal = typeof value === 'string' ? value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : value;
        return ` -F "${key}=${sanitizedVal}"`;
      })
      .join('\\\n');

    assert.equal(curlForm, ' -F "avatar=@test.png"\\\n -F "username=octocat"');
  });

  it('should extract merged properties and required fields from allOf schema directly using schema-utils', () => {
    const schemaWithAllOf = {
      type: 'object',
      required: ['itemType'],
      allOf: [
        {
          type: 'object',
          required: ['items'],
          properties: {
            items: { type: 'array', items: { type: 'string' } },
            itemType: { type: 'string', enum: ['typeA', 'typeB'] },
          },
        },
      ],
    };

    const properties = getMergedProperties(schemaWithAllOf);
    const required = getMergedRequired(schemaWithAllOf);

    assert.deepEqual(Object.keys(properties), ['items', 'itemType']);
    assert.equal(properties.items.type, 'array');
    assert.equal(properties.itemType.type, 'string');
    assert.deepEqual(required.sort(), ['itemType', 'items'].sort());
  });

  it('should safely handle circular allOf references without infinite loop', () => {
    const circularSchema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    };
    circularSchema.allOf = [circularSchema];

    const properties = getMergedProperties(circularSchema);
    assert.deepEqual(Object.keys(properties), ['name']);

    const required = getMergedRequired(circularSchema);
    assert.deepEqual(required, []);
  });

  describe('TagInput keyboard tag deletion and creation', () => {
    function createMockTagInput(initialValue = []) {
      const el = {
        value: [...initialValue],
        events: [],
        dispatchEvents() {
          this.events.push({ type: 'change', value: this.value });
        },
      };
      el.afterKeyDown = TagInput.prototype.afterKeyDown.bind(el);
      return el;
    }

    it('should remove previous entire tag on Backspace when editable tag has no letters', () => {
      const el = createMockTagInput(['tag1', 'tag2', 'tag3']);
      const prevVal = el.value;
      let prevented = false;

      el.afterKeyDown({
        key: 'Backspace',
        keyCode: 8,
        target: { value: '' },
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {},
      });

      assert.deepEqual(el.value, ['tag1', 'tag2']);
      assert.equal(prevented, true);
      assert.equal(el.events.length, 1);
      // Ensure hasChanged detects the change for Lit dirty checking
      assert.equal(TagInput.properties.value.hasChanged(el.value, prevVal), true);
    });

    it('should NOT remove tag on Backspace if editable tag has letters (regular backspace)', () => {
      const el = createMockTagInput(['tag1', 'tag2']);
      let prevented = false;

      el.afterKeyDown({
        key: 'Backspace',
        keyCode: 8,
        target: { value: 'abc' },
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {},
      });

      // Tags remain untouched; browser handles regular backspacing within target input
      assert.deepEqual(el.value, ['tag1', 'tag2']);
      assert.equal(prevented, false);
      assert.equal(el.events.length, 0);
    });

    it('should remove previous entire tag on Delete when editable tag has no letters', () => {
      const el = createMockTagInput(['tag1', 'tag2']);
      let prevented = false;

      el.afterKeyDown({
        key: 'Delete',
        keyCode: 46,
        target: { value: '' },
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {},
      });

      assert.deepEqual(el.value, ['tag1']);
      assert.equal(prevented, true);
      assert.equal(el.events.length, 1);
    });

    it('should handle Backspace gracefully when tag list is already empty', () => {
      const el = createMockTagInput([]);
      let prevented = false;

      el.afterKeyDown({
        key: 'Backspace',
        keyCode: 8,
        target: { value: '' },
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {},
      });

      assert.deepEqual(el.value, []);
      assert.equal(prevented, false);
      assert.equal(el.events.length, 0);
    });

    it('should create new tag on Enter and clear editable input', () => {
      const el = createMockTagInput(['tag1']);
      const target = { value: '  new-tag  ' };
      let prevented = false;
      let stopped = false;

      el.afterKeyDown({
        key: 'Enter',
        keyCode: 13,
        target,
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {
          stopped = true;
        },
      });

      assert.deepEqual(el.value, ['tag1', 'new-tag']);
      assert.equal(target.value, '');
      assert.equal(prevented, true);
      assert.equal(stopped, true);
      assert.equal(el.events.length, 1);
    });
  });
});
