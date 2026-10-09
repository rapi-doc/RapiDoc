import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateExample, getTypeInfo, isBinaryFileField, standardizeExample } from '../../packages/rapidoc/src/utils/schema-utils.ts';

describe('generateExample', () => {
  it('should use single "example" when "examples" is undefined', () => {
    const singleExample = { id: 101, name: 'Rex', status: 'available' };
    const result = generateExample(
      { type: 'object', properties: { id: { type: 'integer' } } },
      'application/json',
      undefined,
      singleExample,
      true,
      true,
      'json',
      false
    );

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].exampleId, 'Example');
    assert.deepStrictEqual(result[0].exampleValue, singleExample);
    assert.strictEqual(result[0].exampleFormat, 'json');
  });

  it('should use single "example" with { value: ... } wrapper', () => {
    const singleExample = { value: { id: 202, title: 'Document' }, summary: 'Doc Example' };
    const result = generateExample(undefined, 'application/json', null, singleExample, true, true, 'json', false);

    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].exampleValue, { id: 202, title: 'Document' });
    assert.strictEqual(result[0].exampleSummary, 'Doc Example');
  });

  it('should process multiple "examples" map correctly', () => {
    const examplesMap = {
      dog: { summary: 'A Dog', value: { type: 'dog', barks: true } },
      cat: { summary: 'A Cat', value: { type: 'cat', meows: true } },
    };
    const result = generateExample(undefined, 'application/json', examplesMap, undefined, true, true, 'json', false);

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].exampleId, 'dog');
    assert.strictEqual(result[0].exampleSummary, 'A Dog');
    assert.deepStrictEqual(result[0].exampleValue, { type: 'dog', barks: true });
    assert.strictEqual(result[1].exampleId, 'cat');
    assert.deepStrictEqual(result[1].exampleValue, { type: 'cat', meows: true });
  });

  it('should handle raw example objects in "examples" without .value wrapper', () => {
    const rawExamples = {
      ex1: { id: 1 },
      ex2: { id: 2 },
    };
    const result = generateExample(undefined, 'application/json', rawExamples, null, true, true, 'json');

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result[0].exampleValue, { id: 1 });
    assert.deepStrictEqual(result[1].exampleValue, { id: 2 });
  });

  it('should respect falsy schema-level examples (0, false, empty string)', () => {
    // Boolean false
    const boolResult = generateExample({ type: 'boolean', example: false }, 'application/json', null, null, true, true, 'json');
    assert.strictEqual(boolResult.length, 1);
    assert.strictEqual(boolResult[0].exampleValue, false);

    // Number 0
    const zeroResult = generateExample({ type: 'integer', example: 0 }, 'application/json', null, null, true, true, 'json');
    assert.strictEqual(zeroResult.length, 1);
    assert.strictEqual(zeroResult[0].exampleValue, 0);

    // Empty string
    const emptyStrResult = generateExample({ type: 'string', example: '' }, 'text/plain', null, null, true, true, 'text');
    assert.strictEqual(emptyStrResult.length, 1);
    assert.strictEqual(emptyStrResult[0].exampleValue, '');
  });

  it('should format output as indented text string when outputType is "text"', () => {
    const data = { id: 1, active: true };
    const result = generateExample(undefined, 'application/json', null, data, true, true, 'text');

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].exampleFormat, 'text');
    assert.strictEqual(typeof result[0].exampleValue, 'string');
    assert.strictEqual(result[0].exampleValue, JSON.stringify(data, undefined, 2));
  });

  it('should fall back to schemaToSampleObj when no examples are provided', () => {
    const schema = {
      type: 'object',
      properties: {
        userId: { type: 'integer' },
        name: { type: 'string' },
        verified: { type: 'boolean' },
      },
    };
    const result = generateExample(schema, 'application/json', null, null, true, true, 'json');

    assert.ok(result.length >= 1);
    const sample = result[0].exampleValue;
    assert.strictEqual(typeof sample.userId, 'number');
    assert.strictEqual(typeof sample.name, 'string');
    assert.strictEqual(typeof sample.verified, 'boolean');
  });

  it('should generate valid XML when mimeType is application/xml', () => {
    const schema = {
      type: 'object',
      xml: { name: 'User' },
      properties: {
        name: { type: 'string' },
      },
    };
    const result = generateExample(schema, 'application/xml', null, null, true, true, 'text');

    assert.ok(result.length >= 1);
    assert.ok(result[0].exampleValue.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(result[0].exampleValue.includes('<User>'));
    assert.ok(result[0].exampleValue.includes('</User>'));
  });

  it('should append schema-generated example when includeGeneratedExample is true', () => {
    const schema = {
      type: 'object',
      properties: {
        role: { type: 'string' },
      },
    };
    const explicit = { role: 'admin' };
    const result = generateExample(schema, 'application/json', null, explicit, true, true, 'json', true);

    // Should include both explicit example and generated example
    assert.ok(result.length >= 2);
    assert.deepStrictEqual(result[0].exampleValue, explicit);
  });

  it('should cap combinatorial example explosion to max 10 examples (preventing 1M combinations)', () => {
    const colorSchema = {
      title: 'Color',
      oneOf: [
        { type: 'string', example: '#FF0000' },
        {
          type: 'object',
          properties: {
            r: { type: 'integer', example: 255 },
            g: { type: 'integer', example: 0 },
            b: { type: 'integer', example: 0 },
          },
        },
      ],
    };

    const playerSchema = {
      title: 'Player',
      type: 'object',
      properties: {
        eyeColor: colorSchema,
        hairColor: colorSchema,
        lipColor: colorSchema,
        mouthColor: colorSchema,
        pantsColor: colorSchema,
        racketColor: colorSchema,
        shirtColor: colorSchema,
        shoeColor: colorSchema,
        skinColor: colorSchema,
        sockColor: colorSchema,
      },
    };

    // TennisMatch schema has 2^20 (1,048,576) theoretical permutations
    const tennisMatchSchema = {
      type: 'object',
      properties: {
        leftPlayer: playerSchema,
        rightPlayer: playerSchema,
      },
    };

    const start = performance.now();
    const examples = generateExample(tennisMatchSchema, 'application/json');
    const elapsed = performance.now() - start;

    // 1. Must cap at 10 examples
    assert.ok(examples.length > 0 && examples.length <= 10, `Expected <= 10 examples, got ${examples.length}`);

    // 2. Must complete within a strict performance budget (< 50ms)
    assert.ok(elapsed < 50, `Expected execution < 50ms, took ${elapsed}ms`);

    // 3. Output structure must still be complete and well-formed
    const sample = examples[0].exampleValue;
    assert.ok(sample.leftPlayer && typeof sample.leftPlayer === 'object');
    assert.ok(sample.rightPlayer && typeof sample.rightPlayer === 'object');
    assert.ok(sample.leftPlayer.eyeColor !== undefined);
  });

  it('should generate deterministic UUID examples across repeated invocations', () => {
    const uuidSchema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    };

    const ex1 = generateExample(uuidSchema, 'application/json');
    const ex2 = generateExample(uuidSchema, 'application/json');

    assert.strictEqual(ex1[0].exampleValue.id, '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    assert.strictEqual(ex2[0].exampleValue.id, '3fa85f64-5717-4562-b3fc-2c963f66afa6');
    assert.strictEqual(ex1[0].exampleValue.id, ex2[0].exampleValue.id);
  });

  it('should generate exactly one example per top-level oneOf variant when nested oneOf exists', () => {
    const reproSchema = {
      oneOf: [
        {
          title: 'PlainVariant',
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['plain'] },
            value: { type: 'string' },
          },
        },
        {
          title: 'NestedOneOfVariant',
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['nested'] },
            entry: {
              oneOf: [{ type: 'string' }, { type: 'object', properties: { id: { type: 'string' } } }],
            },
          },
        },
      ],
    };

    const examples = generateExample(reproSchema, 'application/json');
    assert.strictEqual(examples.length, 2, `Expected 2 examples, got ${examples.length}`);
    assert.strictEqual(examples[0].exampleSummary, 'PlainVariant');
    assert.strictEqual(examples[1].exampleSummary, 'NestedOneOfVariant');
    assert.deepStrictEqual(examples[0].exampleValue, { kind: 'plain', value: 'string' });
    assert.deepStrictEqual(examples[1].exampleValue, { kind: 'nested', entry: 'string' });
  });

  it('should merge properties across allOf schemas without overwriting prior objects', () => {
    const allOfSchema = {
      allOf: [
        { type: 'object', properties: { first: { type: 'string' } } },
        { type: 'object', properties: { second: { type: 'integer' } } },
      ],
    };

    const examples = generateExample(allOfSchema, 'application/json');
    assert.strictEqual(examples.length, 1);
    assert.deepStrictEqual(examples[0].exampleValue, { first: 'string', second: 0 });
  });
});

describe('getTypeInfo', () => {
  it('should format non-string const values as strings in allowedValues', () => {
    const numSchema = { type: 'number', const: 1 };
    const info = getTypeInfo(numSchema);
    assert.strictEqual(info.allowedValues, '1');
    assert.strictEqual(typeof info.allowedValues, 'string');
    // Ensure .split('┃') works without throwing TypeError
    assert.deepStrictEqual(info.allowedValues.split('┃'), ['1']);
  });

  it('should preserve falsy const values (0, false, empty string)', () => {
    const zeroSchema = { type: 'integer', const: 0 };
    const zeroInfo = getTypeInfo(zeroSchema);
    assert.strictEqual(zeroInfo.allowedValues, '0');

    const falseSchema = { type: 'boolean', const: false };
    const falseInfo = getTypeInfo(falseSchema);
    assert.strictEqual(falseInfo.allowedValues, 'false');

    const emptyStrSchema = { type: 'string', const: '' };
    const emptyStrInfo = getTypeInfo(emptyStrSchema);
    assert.strictEqual(emptyStrInfo.allowedValues, '∅');
  });

  it('should identify dataType as const when schema has const without explicit type', () => {
    const constSchema = { const: 1 };
    const info = getTypeInfo(constSchema);
    assert.strictEqual(info.type, 'const');
    assert.strictEqual(info.allowedValues, '1');

    const zeroSchema = { const: 0 };
    const zeroInfo = getTypeInfo(zeroSchema);
    assert.strictEqual(zeroInfo.type, 'const');
    assert.strictEqual(zeroInfo.allowedValues, '0');
  });

  it('should correctly format const in array items', () => {
    const arraySchema = {
      type: 'array',
      items: { type: 'number', const: 42 },
    };
    const info = getTypeInfo(arraySchema);
    assert.strictEqual(info.allowedValues, '42');

    const zeroArraySchema = {
      type: 'array',
      items: { type: 'integer', const: 0 },
    };
    const zeroInfo = getTypeInfo(zeroArraySchema);
    assert.strictEqual(zeroInfo.allowedValues, '0');
  });

  it('should resolve anyOf with nullable primitive as string┃null', () => {
    const schema = {
      anyOf: [{ type: 'string' }, { type: 'null' }],
      description: 'The information package identifier.',
      title: 'Informationpackageidentifier',
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'string┃null');
    assert.strictEqual(info.description, 'The information package identifier.');
  });

  it('should resolve anyOf with format (e.g. uuid┃null)', () => {
    const schema = {
      anyOf: [{ type: 'string', format: 'uuid' }, { type: 'null' }],
      description: 'User identifier',
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'uuid┃null');
    assert.strictEqual(info.format, 'uuid');
    assert.strictEqual(info.description, 'User identifier');
  });

  it('should resolve oneOf with multiple primitives (e.g. integer┃string)', () => {
    const schema = {
      oneOf: [{ type: 'integer' }, { type: 'string' }],
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'integer┃string');
  });

  it('should inherit constraints from non-null subschema in anyOf', () => {
    const schema = {
      anyOf: [
        {
          type: 'string',
          minLength: 5,
          maxLength: 20,
          pattern: '^[a-z]+$',
        },
        { type: 'null' },
      ],
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'string┃null');
    assert.strictEqual(info.pattern, '^[a-z]+$');
    assert.strictEqual(info.constrain, '5 to 20 chars');
  });

  it('should inherit allowedValues from enum in anyOf', () => {
    const schema = {
      anyOf: [
        {
          type: 'string',
          enum: ['pending', 'completed'],
        },
        { type: 'null' },
      ],
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'enum┃null');
    assert.strictEqual(info.allowedValues, 'pending┃completed');
  });

  it('should capture contentMediaType, contentEncoding, and contentSchema', () => {
    const schema = {
      type: 'string',
      contentMediaType: 'application/json',
      contentEncoding: 'base64',
      contentSchema: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
    };
    const info = getTypeInfo(schema);
    assert.strictEqual(info.type, 'string');
    assert.strictEqual(info.contentMediaType, 'application/json');
    assert.strictEqual(info.contentEncoding, 'base64');
    assert.deepStrictEqual(info.contentSchema, {
      type: 'object',
      properties: { id: { type: 'integer' } },
    });
  });
});

describe('isBinaryFileField', () => {
  it('should return true for format: binary (OpenAPI 3.0)', () => {
    assert.strictEqual(isBinaryFileField({ type: 'string', format: 'binary' }), true);
  });

  it('should return true for contentEncoding: binary', () => {
    assert.strictEqual(isBinaryFileField({ type: 'string', contentEncoding: 'binary' }), true);
  });

  it('should return true for contentMediaType without contentEncoding base64 (OpenAPI 3.1)', () => {
    assert.strictEqual(isBinaryFileField({ type: 'string', contentMediaType: 'image/png' }), true);
    assert.strictEqual(isBinaryFileField({ type: 'string', contentMediaType: 'application/pdf' }), true);
  });

  it('should return false for base64 encoded strings', () => {
    assert.strictEqual(isBinaryFileField({ type: 'string', contentMediaType: 'image/png', contentEncoding: 'base64' }), false);
    assert.strictEqual(isBinaryFileField({ type: 'string', contentEncoding: 'base64' }), false);
  });

  it('should return false for regular primitive schemas', () => {
    assert.strictEqual(isBinaryFileField({ type: 'string' }), false);
    assert.strictEqual(isBinaryFileField({ type: 'integer' }), false);
    assert.strictEqual(isBinaryFileField(null), false);
  });
});

describe('generateExample with contentEncoding and contentMediaType', () => {
  it('should generate base64 example string when contentEncoding is base64', () => {
    const result = generateExample(
      { type: 'string', contentMediaType: 'image/png', contentEncoding: 'base64' },
      'application/json',
      null,
      null,
      true,
      true,
      'json'
    );
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].exampleValue, 'ZXhhbXBsZQ==');
  });

  it('should generate serialized JSON string example when contentMediaType is application/json with contentSchema', () => {
    const result = generateExample(
      {
        type: 'string',
        contentMediaType: 'application/json',
        contentSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', default: 'Alice' },
          },
        },
      },
      'application/json',
      null,
      null,
      true,
      true,
      'json'
    );
    assert.strictEqual(result.length, 1);
    const parsed = JSON.parse(result[0].exampleValue);
    assert.strictEqual(parsed.name, 'Alice');
  });
});

describe('standardizeExample', () => {
  it('should return undefined for a null example instead of throwing', () => {
    assert.equal(standardizeExample(null), undefined);
  });

  it('should wrap a single object with a value property', () => {
    assert.deepEqual(standardizeExample({ value: 1, summary: 's' }), { Example: { value: 1, summary: 's' } });
  });

  it('should ignore null entries of an examples map instead of throwing', () => {
    assert.deepEqual(standardizeExample({ a: null, b: { value: 2 } }), { b: { value: 2 } });
  });

  it('should return undefined for undefined', () => {
    assert.equal(standardizeExample(undefined), undefined);
  });
});
