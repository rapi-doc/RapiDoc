import { describe, it } from 'node:test';
import assert from 'node:assert';
import { schemaInObjectNotation } from '../../packages/rapidoc/src/utils/schema-utils.ts';

describe('schemaInObjectNotation', () => {
  describe('primitive data types', () => {
    it('should return primitive type string for string schema', () => {
      const result = schemaInObjectNotation({ type: 'string' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('string~|~'));
    });

    it('should return primitive type string for integer schema', () => {
      const result = schemaInObjectNotation({ type: 'integer' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('integer~|~'));
    });

    it('should return primitive type string for number schema', () => {
      const result = schemaInObjectNotation({ type: 'number' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('number~|~'));
    });

    it('should return primitive type string for boolean schema', () => {
      const result = schemaInObjectNotation({ type: 'boolean' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('boolean~|~'));
    });

    it('should return primitive type string for null schema', () => {
      const result = schemaInObjectNotation({ type: 'null' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('null~|~'));
    });

    it('should return const formatted string for schema with const value', () => {
      const result = schemaInObjectNotation({ const: 'ACTIVE' }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.includes('ACTIVE'));
    });

    it('should return enum formatted string for schema with enum values', () => {
      const result = schemaInObjectNotation({ type: 'string', enum: ['pending', 'completed'] }, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.includes('pending┃completed'));
    });

    it('should format string with format or length constraints', () => {
      const formatResult = schemaInObjectNotation({ type: 'string', format: 'uuid' }, {});
      assert.strictEqual(typeof formatResult, 'string');
      assert.ok(formatResult.startsWith('uuid~|~'));

      const lengthResult = schemaInObjectNotation(
        {
          type: 'string',
          minLength: 5,
          maxLength: 20,
        },
        {}
      );
      assert.strictEqual(typeof lengthResult, 'string');
      assert.ok(lengthResult.includes('5 to 20 chars'));
    });

    it('should include numeric constraints in output', () => {
      const result = schemaInObjectNotation(
        {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
        {}
      );
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.includes('Min 1┃Max 100'));
    });
  });

  describe('object schemas', () => {
    it('should format simple object with properties', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(typeof result, 'object');
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result.id.startsWith('integer~|~'));
      assert.ok(result.name.startsWith('string~|~'));
    });

    it('should mark required properties with asterisk (*)', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string' },
          bio: { type: 'string' },
        },
        required: ['id', 'email'],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.ok(result['id*'], 'required field "id" should have asterisk');
      assert.ok(result['email*'], 'required field "email" should have asterisk');
      assert.ok(result.bio, 'optional field "bio" should not have asterisk');
      assert.strictEqual(result['bio*'], undefined);
    });

    it('should capture object metadata (title, description, deprecated, readOnly, writeOnly)', () => {
      const schema = {
        type: 'object',
        title: 'UserProfile',
        description: 'User profile details',
        deprecated: true,
        readOnly: true,
        properties: {
          id: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::title'], 'UserProfile');
      assert.ok(result['::description'].includes('User profile details'));
      assert.strictEqual(result['::deprecated'], true);
      assert.strictEqual(result['::readwrite'], 'readonly');
    });

    it('should set writeonly when writeOnly is true', () => {
      const schema = {
        type: 'object',
        writeOnly: true,
        properties: {
          password: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::readwrite'], 'writeonly');
    });

    it('should handle nullable object (OpenAPI 3.0 nullable: true)', () => {
      const schema = {
        type: 'object',
        nullable: true,
        properties: {
          code: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::nullable'], true);
      assert.strictEqual(result['::dataTypeLabel'], 'object ┃ null');
    });

    it('should format patternProperties with [pattern: <pattern>] key', () => {
      const schema = {
        type: 'object',
        patternProperties: {
          '^S_': { type: 'string' },
          '^I_': { type: 'integer' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.ok(result['[pattern: ^S_]']);
      assert.ok(result['[pattern: ^I_]']);
      assert.ok(result['[pattern: ^S_]'].startsWith('string~|~'));
      assert.ok(result['[pattern: ^I_]'].startsWith('integer~|~'));
    });

    it('should format additionalProperties with [any-key]', () => {
      const schema = {
        type: 'object',
        additionalProperties: { type: 'number' },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.ok(result['[any-key]']);
      assert.ok(result['[any-key]'].startsWith('number~|~'));
    });

    it('should format nested objects recursively', () => {
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              address: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                },
                required: ['city'],
              },
            },
          },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result.user['::type'], 'object');
      assert.strictEqual(result.user.address['::type'], 'object');
      assert.ok(result.user.address['city*'].startsWith('string~|~'));
    });

    it('should handle empty object with no properties', () => {
      const schema = { type: 'object' };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.strictEqual(result['::title'], '');
    });
  });

  describe('array schemas', () => {
    it('should format array with primitive items', () => {
      const schema = {
        type: 'array',
        items: { type: 'string' },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'array');
      assert.ok(result['::props'].startsWith('string~|~'));
    });

    it('should format array with object items', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'array');
      assert.strictEqual(result['::props']['::type'], 'object');
      assert.ok(result['::props'].id.startsWith('integer~|~'));
    });

    it('should format array of arrays and set ::array-type', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'array',
          items: { type: 'integer' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'array');
      assert.strictEqual(result['::array-type'], 'integer');
      assert.strictEqual(result['::props']['::type'], 'array');
      assert.ok(result['::props']['::props'].startsWith('integer~|~'));
    });

    it('should handle array metadata (nullable, minItems, maxItems, uniqueItems)', () => {
      const schema = {
        type: 'array',
        nullable: true,
        minItems: 1,
        maxItems: 5,
        uniqueItems: true,
        items: { type: 'string' },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::nullable'], true);
      assert.strictEqual(result['::dataTypeLabel'], 'array ┃ null');
      assert.ok(result['::description'].includes('Min Items:</b> 1'));
      assert.ok(result['::description'].includes('Max Items:</b> 5'));
      assert.ok(result['::description'].includes('Must have unique items'));
    });
  });

  describe('multi-type arrays (OpenAPI 3.1 type: [...])', () => {
    it('should format multi-primitive types joined by bar (e.g. integer┃string)', () => {
      const schema = { type: ['integer', 'string'] };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('integer┃string~|~'));
    });

    it('should format primitive with null (e.g. string┃null)', () => {
      const schema = { type: ['string', 'null'] };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('string┃null~|~'));
    });

    it('should format primitive with primitive array items as single primitive type', () => {
      const schema = {
        type: ['string', 'array'],
        items: { type: 'integer' },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.includes('string┃[integer]'));
    });

    it('should generate ONE-OF options when complex type (object) is combined with primitive', () => {
      const schema = {
        type: ['string', 'object'],
        properties: {
          id: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result['::ONE~OF']);
      assert.strictEqual(result['::ONE~OF']['::type'], 'xxx-of-option');
      assert.strictEqual(result['::ONE~OF']['::OPTION~1']['::type'], 'object');
      assert.ok(result['::ONE~OF']['::OPTION~1'].id.startsWith('string~|~'));
      assert.ok(result['::ONE~OF']['::OPTION~2'].startsWith('string~|~'));
    });

    it('should generate ONE-OF options when array of objects is combined with primitive', () => {
      const schema = {
        type: ['string', 'array'],
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result['::ONE~OF']);
      assert.strictEqual(result['::ONE~OF']['::OPTION~1']['::type'], 'array');
      assert.ok(result['::ONE~OF']['::OPTION~2'].startsWith('string~|~'));
    });
  });

  describe('allOf schemas', () => {
    it('should return primitive string when allOf has single primitive item', () => {
      const schema = {
        allOf: [{ type: 'string' }],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(typeof result, 'string');
      assert.ok(result.startsWith('string~|~'));
    });

    it('should merge properties from multiple object schemas in allOf', () => {
      const schema = {
        allOf: [
          {
            type: 'object',
            properties: { id: { type: 'integer' } },
            required: ['id'],
          },
          {
            type: 'object',
            properties: { name: { type: 'string' } },
          },
          {
            type: 'object',
            properties: { role: { type: 'string', enum: ['admin', 'user'] } },
            required: ['role'],
          },
        ],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result['id*'].startsWith('integer~|~'));
      assert.ok(result.name.startsWith('string~|~'));
      assert.ok(result['role*'].includes('admin┃user'));
    });

    it('should handle allOf with anyOf child sub-schema using propSuffix', () => {
      const schema = {
        allOf: [
          {
            type: 'object',
            properties: { base: { type: 'string' } },
          },
          {
            anyOf: [
              { type: 'object', properties: { variantA: { type: 'string' } } },
              { type: 'object', properties: { variantB: { type: 'number' } } },
            ],
          },
        ],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result.base.startsWith('string~|~'));
      // The anyOf at index 1 gets suffix 1
      assert.ok(result['::ANY~OF 1']);
      assert.ok(result['::ANY~OF 1']['::OPTION~1']);
      assert.ok(result['::ANY~OF 1']['::OPTION~2']);
    });
  });

  describe('oneOf and anyOf schemas', () => {
    it('should format root oneOf with primitive options', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      // Look for the oneOf block (current implementation has trailing space)
      const oneOfKey = Object.keys(result).find((k) => k.startsWith('::ONE~OF'));
      assert.ok(oneOfKey, 'should contain ::ONE~OF block');
      assert.strictEqual(result[oneOfKey]['::type'], 'xxx-of-option');
      assert.ok(result[oneOfKey]['::OPTION~1'].startsWith('string~|~'));
      assert.ok(result[oneOfKey]['::OPTION~2'].startsWith('number~|~'));
    });

    it('should format anyOf with object options and titles in ::OPTION key', () => {
      const schema = {
        anyOf: [
          {
            type: 'object',
            title: 'DogOption',
            properties: { bark: { type: 'boolean' } },
          },
          {
            type: 'object',
            title: 'CatOption',
            properties: { meow: { type: 'boolean' } },
          },
        ],
      };
      const result = schemaInObjectNotation(schema, {});
      const anyOfKey = Object.keys(result).find((k) => k.startsWith('::ANY~OF'));
      assert.ok(anyOfKey, 'should contain ::ANY~OF block');
      assert.ok(result[anyOfKey]['::OPTION~1~DogOption']);
      assert.ok(result[anyOfKey]['::OPTION~2~CatOption']);
      assert.strictEqual(result[anyOfKey]['::OPTION~1~DogOption']['::readwrite'], '');
    });

    it('should format object with regular properties AND oneOf polymorphism', () => {
      const schema = {
        type: 'object',
        properties: {
          kind: { type: 'string' },
        },
        required: ['kind'],
        oneOf: [
          {
            type: 'object',
            title: 'Circle',
            properties: { radius: { type: 'number' } },
          },
          {
            type: 'object',
            title: 'Square',
            properties: { side: { type: 'number' } },
          },
        ],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result['kind*'].startsWith('string~|~'));
      const oneOfKey = Object.keys(result).find((k) => k.startsWith('::ONE~OF'));
      assert.ok(oneOfKey);
      assert.ok(result[oneOfKey]['::OPTION~1~Circle']);
      assert.ok(result[oneOfKey]['::OPTION~2~Square']);
    });
  });

  describe('nesting and complex combinations', () => {
    it('should format object containing array of objects with nested oneOf', () => {
      const schema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                payload: {
                  oneOf: [{ type: 'string' }, { type: 'object', properties: { count: { type: 'integer' } } }],
                },
              },
            },
          },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      const arrayProps = result.items['::props'];
      assert.strictEqual(arrayProps['::type'], 'object');
      assert.ok(arrayProps.id.startsWith('string~|~'));
      const nestedOneOf = Object.keys(arrayProps.payload).find((k) => k.startsWith('::ONE~OF'));
      assert.ok(nestedOneOf);
      assert.ok(arrayProps.payload[nestedOneOf]['::OPTION~1'].startsWith('string~|~'));
      assert.strictEqual(arrayProps.payload[nestedOneOf]['::OPTION~2']['::type'], 'object');
    });

    it('should format allOf containing object with nested anyOf', () => {
      const schema = {
        allOf: [
          {
            type: 'object',
            properties: {
              meta: {
                type: 'object',
                properties: { timestamp: { type: 'string', format: 'date-time' } },
              },
            },
          },
          {
            type: 'object',
            properties: {
              data: {
                anyOf: [{ type: 'integer' }, { type: 'array', items: { type: 'integer' } }],
              },
            },
          },
        ],
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result.meta.timestamp.includes('date-time'));
      const anyOfKey = Object.keys(result.data).find((k) => k.startsWith('::ANY~OF'));
      assert.ok(anyOfKey);
      assert.ok(result.data[anyOfKey]['::OPTION~1'].startsWith('integer~|~'));
      assert.strictEqual(result.data[anyOfKey]['::OPTION~2']['::type'], 'array');
    });
  });

  describe('recursion limit & falsy inputs', () => {
    it('should return undefined when schema is null or undefined', () => {
      assert.strictEqual(schemaInObjectNotation(null, {}), undefined);
      assert.strictEqual(schemaInObjectNotation(undefined, {}), undefined);
    });

    it('should truncate recursion when level exceeds 8', () => {
      const deepSchema = {
        type: 'object',
        description: 'deep',
        properties: { foo: { type: 'string' } },
      };
      const result = schemaInObjectNotation(deepSchema, {}, 9);
      assert.deepStrictEqual(result, {
        '::type': 'object',
        '::description': 'deep',
      });
      assert.strictEqual(result.foo, undefined);
    });
  });

  // =========================================================================
  // The following tests assert EXPECTED / CORRECT behaviors where the CURRENT
  // implementation has known bugs or design flaws.
  // As requested, these test cases are added and intentionally fail for now
  // to validate the upcoming reimplementation.
  // =========================================================================
  describe('known issues & edge cases in current implementation (expected to fail)', () => {
    it('Bug A: should allow calling schemaInObjectNotation(schema) without passing obj', () => {
      // Currently crashes with: TypeError: Cannot set properties of undefined (setting '::title')
      // A safe API should have default parameter obj = {}
      const result = schemaInObjectNotation({
        type: 'object',
        properties: { id: { type: 'string' } },
      });
      assert.ok(result, 'should return an object notation even when obj arg is omitted');
      assert.strictEqual(result['::type'], 'object');
      assert.ok(result.id);
    });

    it('Bug B1: should generate "::ONE~OF" without trailing space when suffix is empty', () => {
      // Currently sets key as "::ONE~OF " (with trailing space) due to template: `::ONE~OF ${suffix}`
      const result = schemaInObjectNotation(
        {
          oneOf: [{ type: 'string' }, { type: 'number' }],
        },
        {}
      );
      assert.strictEqual(Object.prototype.hasOwnProperty.call(result, '::ONE~OF'), true, 'Expected key "::ONE~OF" without trailing space');
      assert.strictEqual(Object.prototype.hasOwnProperty.call(result, '::ONE~OF '), false, 'Key should not contain trailing space');
    });

    it('Bug B2: should generate "::ANY~OF" without trailing space when suffix is empty', () => {
      // Currently sets key as "::ANY~OF " (with trailing space) due to template: `::ANY~OF ${suffix}`
      const result = schemaInObjectNotation(
        {
          anyOf: [{ type: 'string' }, { type: 'number' }],
        },
        {}
      );
      assert.strictEqual(Object.prototype.hasOwnProperty.call(result, '::ANY~OF'), true, 'Expected key "::ANY~OF" without trailing space');
      assert.strictEqual(Object.prototype.hasOwnProperty.call(result, '::ANY~OF '), false, 'Key should not contain trailing space');
    });

    it('Bug C: should not generate an empty ghost option when multi-type has only complex types', () => {
      // For type: ['object', 'array'], complexTypes has length 2, but primitiveType is empty.
      // Line 1062 blindly adds multiTypeOptions[`::OPTION~${complexTypes.length + 1}`] = multiPrimitiveTypes?.html || '';
      // which results in an empty string ghost option "::OPTION~3": ""
      const schema = {
        type: ['object', 'array'],
        items: {
          type: 'object',
          properties: { val: { type: 'string' } },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      const oneOfBlock = result['::ONE~OF'];
      assert.ok(oneOfBlock);
      const optionKeys = Object.keys(oneOfBlock).filter((k) => k.startsWith('::OPTION'));
      assert.strictEqual(
        optionKeys.length,
        2,
        `Expected exactly 2 options for [object, array], but got ${optionKeys.length}: ${optionKeys.join(', ')}`
      );
      for (const key of optionKeys) {
        assert.notStrictEqual(oneOfBlock[key], '', `Option ${key} should not be an empty string`);
      }
    });

    it('Bug D: should recognize OpenAPI 3.1 nullable object (type: ["object", "null"]) as nullable object', () => {
      // In OpenAPI 3.1, nullable objects are declared as type: ['object', 'null'].
      // Line 1070 checks `(Array.isArray(schema.type) && schema.type.includes('null')) || schema.nullable`,
      // but line 991 intercepts all Array.isArray(schema.type) schemas first and splits them into ONE-OF options!
      // It should instead be recognized as an object with ::nullable = true and ::dataTypeLabel = 'object ┃ null'.
      const schema = {
        type: ['object', 'null'],
        properties: {
          id: { type: 'string' },
        },
      };
      const result = schemaInObjectNotation(schema, {});
      assert.strictEqual(result['::type'], 'object');
      assert.strictEqual(result['::nullable'], true);
      assert.strictEqual(result['::dataTypeLabel'], 'object ┃ null');
      assert.ok(result.id, 'properties should be direct keys on the object');
    });

    it('Bug E: should preserve caller-provided properties on obj when schema has allOf', () => {
      // Line 951: obj = objWithAllProps reassigns the local variable obj, completely discarding
      // any existing properties on the passed obj object, unlike the regular object branches.
      const existingObj = { _customTrackingKey: 'my-custom-state' };
      const schema = {
        allOf: [
          {
            type: 'object',
            properties: { id: { type: 'string' } },
          },
        ],
      };
      const result = schemaInObjectNotation(schema, existingObj);
      assert.strictEqual(result._customTrackingKey, 'my-custom-state', 'Caller-provided keys in obj should not be discarded by allOf');
    });
  });
});
