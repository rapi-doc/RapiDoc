import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateExample } from '../../packages/rapidoc/src/utils/schema-utils.js';

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
    const result = generateExample(
      undefined,
      'application/json',
      null,
      singleExample,
      true,
      true,
      'json',
      false
    );

    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0].exampleValue, { id: 202, title: 'Document' });
    assert.strictEqual(result[0].exampleSummary, 'Doc Example');
  });

  it('should process multiple "examples" map correctly', () => {
    const examplesMap = {
      dog: { summary: 'A Dog', value: { type: 'dog', barks: true } },
      cat: { summary: 'A Cat', value: { type: 'cat', meows: true } },
    };
    const result = generateExample(
      undefined,
      'application/json',
      examplesMap,
      undefined,
      true,
      true,
      'json',
      false
    );

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
    const boolResult = generateExample(
      { type: 'boolean', example: false },
      'application/json',
      null,
      null,
      true,
      true,
      'json'
    );
    assert.strictEqual(boolResult.length, 1);
    assert.strictEqual(boolResult[0].exampleValue, false);

    // Number 0
    const zeroResult = generateExample(
      { type: 'integer', example: 0 },
      'application/json',
      null,
      null,
      true,
      true,
      'json'
    );
    assert.strictEqual(zeroResult.length, 1);
    assert.strictEqual(zeroResult[0].exampleValue, 0);

    // Empty string
    const emptyStrResult = generateExample(
      { type: 'string', example: '' },
      'text/plain',
      null,
      null,
      true,
      true,
      'text'
    );
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
});

