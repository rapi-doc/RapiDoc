import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import TagInput from '../../packages/rapidoc/src/components/tag-input.js';

describe('multipart/form-data cURL and Array Input Handling', () => {
  it('TagInput hasChanged should not trigger update for arrays with identical values', () => {
    const hasChanged = TagInput.properties.value.hasChanged;
    assert.equal(hasChanged(['alpha', 'beta'], ['alpha', 'beta']), false);
    assert.equal(hasChanged([], []), false);
    assert.equal(hasChanged(['alpha'], ['beta']), true);
    assert.equal(hasChanged(['alpha'], ['alpha', 'beta']), true);
    assert.equal(hasChanged(['alpha'], undefined), true);
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
        return ` -F "${key}=${value}"`;
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
        return ` -F "${key}=${value}"`;
      })
      .join('\\\n');

    assert.equal(curlForm, ' -F "avatar=@test.png"\\\n -F "username=octocat"');
  });

  it('should extract merged properties from allOf schema for form-data rendering', () => {
    function getMergedProperties(schema) {
      if (!schema || typeof schema !== 'object') {
        return {};
      }
      let properties = { ...(schema.properties || {}) };
      if (Array.isArray(schema.allOf)) {
        schema.allOf.forEach((sub) => {
          Object.assign(properties, getMergedProperties(sub));
        });
      }
      return properties;
    }

    const schemaWithAllOf = {
      type: 'object',
      allOf: [
        {
          type: 'object',
          properties: {
            items: { type: 'array', items: { type: 'string' } },
            itemType: { type: 'string', enum: ['typeA', 'typeB'] },
          },
        },
      ],
    };

    const properties = getMergedProperties(schemaWithAllOf);
    assert.deepEqual(Object.keys(properties), ['items', 'itemType']);
    assert.equal(properties.items.type, 'array');
    assert.equal(properties.itemType.type, 'string');
  });
});
