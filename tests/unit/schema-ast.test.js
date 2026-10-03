import { describe, it } from 'node:test';
import assert from 'node:assert';
import { schemaToAST } from '../../packages/rapidoc/src/utils/schema-utils.js';

describe('schemaToAST', () => {
  describe('primitive data types', () => {
    it('should generate primitive AST for string schema', () => {
      const ast = schemaToAST({ type: 'string' });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'string');
      assert.strictEqual(ast.required, false);
      assert.strictEqual(ast.deprecated, false);
    });

    it('should generate primitive AST for integer and number schemas', () => {
      const intAst = schemaToAST({ type: 'integer' });
      assert.strictEqual(intAst.kind, 'primitive');
      assert.strictEqual(intAst.type, 'integer');

      const numAst = schemaToAST({ type: 'number' });
      assert.strictEqual(numAst.kind, 'primitive');
      assert.strictEqual(numAst.type, 'number');
    });

    it('should generate primitive AST for boolean and null schemas', () => {
      const boolAst = schemaToAST({ type: 'boolean' });
      assert.strictEqual(boolAst.kind, 'primitive');
      assert.strictEqual(boolAst.type, 'boolean');

      const nullAst = schemaToAST({ type: 'null' });
      assert.strictEqual(nullAst.kind, 'primitive');
      assert.strictEqual(nullAst.type, 'null');
    });

    it('should capture const value in AST', () => {
      const ast = schemaToAST({ const: 'ACTIVE' });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'const');
      assert.strictEqual(ast.allowedValues, 'ACTIVE');
    });

    it('should capture enum values in AST', () => {
      const ast = schemaToAST({ type: 'string', enum: ['pending', 'completed'] });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'enum');
      assert.strictEqual(ast.allowedValues, 'pending┃completed');
    });

    it('should capture format and string length constraints', () => {
      const formatAst = schemaToAST({ type: 'string', format: 'uuid' });
      assert.strictEqual(formatAst.kind, 'primitive');
      assert.strictEqual(formatAst.type, 'uuid');
      assert.strictEqual(formatAst.format, 'uuid');

      const lengthAst = schemaToAST({
        type: 'string',
        minLength: 5,
        maxLength: 20,
      });
      assert.strictEqual(lengthAst.kind, 'primitive');
      assert.strictEqual(lengthAst.constraints, '5 to 20 chars');
    });

    it('should capture numeric range constraints', () => {
      const ast = schemaToAST({
        type: 'integer',
        minimum: 1,
        maximum: 100,
      });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'integer');
      assert.strictEqual(ast.constraints, 'Min 1┃Max 100');
    });

    it('should capture default value', () => {
      const ast = schemaToAST({
        type: 'string',
        default: 'hello',
      });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.defaultValue, 'hello');
    });

    it('should capture contentMediaType and contentEncoding in primitive AST', () => {
      const ast = schemaToAST({
        type: 'string',
        contentMediaType: 'image/png',
        contentEncoding: 'base64',
      });
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'string');
      assert.strictEqual(ast.contentMediaType, 'image/png');
      assert.strictEqual(ast.contentEncoding, 'base64');
    });
  });

  describe('object schemas', () => {
    it('should generate object AST with typed properties array', () => {
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
        required: ['id'],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.strictEqual(ast.properties.length, 2);

      const idProp = ast.properties.find((p) => p.name === 'id');
      const nameProp = ast.properties.find((p) => p.name === 'name');

      assert.ok(idProp);
      assert.strictEqual(idProp.kind, 'primitive');
      assert.strictEqual(idProp.type, 'integer');
      assert.strictEqual(idProp.required, true);

      assert.ok(nameProp);
      assert.strictEqual(nameProp.kind, 'primitive');
      assert.strictEqual(nameProp.type, 'string');
      assert.strictEqual(nameProp.required, false);
    });

    it('should capture object metadata (title, description, deprecated, readOnly, writeOnly, nullable)', () => {
      const schema = {
        type: 'object',
        title: 'Account',
        description: 'User account object',
        deprecated: true,
        readOnly: true,
        nullable: true,
        properties: {
          id: { type: 'string' },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.strictEqual(ast.title, 'Account');
      assert.ok(ast.description.includes('User account object'));
      assert.strictEqual(ast.deprecated, true);
      assert.strictEqual(ast.readOnly, true);
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, 'object ┃ null');
    });

    it('should capture patternProperties as child nodes', () => {
      const schema = {
        type: 'object',
        patternProperties: {
          '^S_': { type: 'string' },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.strictEqual(ast.patternProperties.length, 1);
      assert.strictEqual(ast.patternProperties[0].name, '[pattern: ^S_]');
      assert.strictEqual(ast.patternProperties[0].type, 'string');
    });

    it('should capture additionalProperties as a child node', () => {
      const schema = {
        type: 'object',
        additionalProperties: { type: 'number' },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.ok(ast.additionalProperties);
      assert.strictEqual(ast.additionalProperties.name, '[any-key]');
      assert.strictEqual(ast.additionalProperties.type, 'number');
    });

    it('should represent nested objects hierarchically', () => {
      const schema = {
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
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      const addressProp = ast.properties[0];
      assert.strictEqual(addressProp.kind, 'object');
      assert.strictEqual(addressProp.name, 'address');
      assert.strictEqual(addressProp.properties.length, 1);
      assert.strictEqual(addressProp.properties[0].name, 'city');
      assert.strictEqual(addressProp.properties[0].required, true);
    });
  });

  describe('array schemas', () => {
    it('should generate array AST with primitive items node', () => {
      const schema = {
        type: 'array',
        items: { type: 'string' },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'array');
      assert.ok(ast.items);
      assert.strictEqual(ast.items.kind, 'primitive');
      assert.strictEqual(ast.items.type, 'string');
    });

    it('should generate array AST with object items node', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'array');
      assert.strictEqual(ast.items.kind, 'object');
      assert.strictEqual(ast.items.properties.length, 1);
      assert.strictEqual(ast.items.properties[0].name, 'id');
    });

    it('should capture nested arrayType for array of arrays', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'array',
          items: { type: 'integer' },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'array');
      assert.strictEqual(ast.arrayType, 'integer');
      assert.strictEqual(ast.items.kind, 'array');
    });

    it('should capture array constraints (minItems, maxItems, uniqueItems)', () => {
      const schema = {
        type: 'array',
        minItems: 1,
        maxItems: 10,
        uniqueItems: true,
        items: { type: 'string' },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'array');
      assert.strictEqual(ast.minItems, 1);
      assert.strictEqual(ast.maxItems, 10);
      assert.strictEqual(ast.uniqueItems, true);
    });
  });

  describe('allOf schemas', () => {
    it('should resolve single primitive allOf directly', () => {
      const schema = {
        allOf: [{ type: 'string' }],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'primitive');
      assert.strictEqual(ast.type, 'string');
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
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.strictEqual(ast.properties.length, 2);
      assert.strictEqual(ast.properties.find((p) => p.name === 'id').required, true);
      assert.strictEqual(ast.properties.find((p) => p.name === 'name').required, false);
    });
  });

  describe('oneOf and anyOf schemas', () => {
    it('should generate union AST node with operator and options', () => {
      const schema = {
        oneOf: [{ type: 'string' }, { type: 'number' }],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'union');
      assert.strictEqual(ast.operator, 'oneOf');
      assert.strictEqual(ast.options.length, 2);
      assert.strictEqual(ast.options[0].type, 'string');
      assert.strictEqual(ast.options[1].type, 'number');
    });

    it('should capture option titles in union options', () => {
      const schema = {
        anyOf: [
          {
            type: 'object',
            title: 'Dog',
            properties: { bark: { type: 'boolean' } },
          },
          {
            type: 'object',
            title: 'Cat',
            properties: { meow: { type: 'boolean' } },
          },
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'union');
      assert.strictEqual(ast.operator, 'anyOf');
      assert.strictEqual(ast.options[0].optionTitle, 'Dog');
      assert.strictEqual(ast.options[1].optionTitle, 'Cat');
    });

    it('should retain base properties when schema has regular properties and oneOf', () => {
      const schema = {
        type: 'object',
        properties: {
          type: { type: 'string' },
        },
        required: ['type'],
        oneOf: [
          { type: 'object', title: 'A', properties: { valA: { type: 'string' } } },
          { type: 'object', title: 'B', properties: { valB: { type: 'string' } } },
        ],
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'union');
      assert.strictEqual(ast.properties.length, 1);
      assert.strictEqual(ast.properties[0].name, 'type');
      assert.strictEqual(ast.properties[0].required, true);
      assert.strictEqual(ast.options.length, 2);
    });
  });

  describe('OpenAPI 3.1 multi-type arrays', () => {
    it('should handle multi-primitive types joined (e.g. integer┃string)', () => {
      const schema = { type: ['integer', 'string'] };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'primitive');
      assert.ok(ast.type.includes('integer┃string'));
    });

    it('should recognize OpenAPI 3.1 nullable object as object with nullable: true', () => {
      const schema = {
        type: ['object', 'null'],
        properties: {
          id: { type: 'string' },
        },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'object');
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, 'object ┃ null');
      assert.strictEqual(ast.properties.length, 1);
      assert.strictEqual(ast.properties[0].name, 'id');
    });

    it('should recognize OpenAPI 3.1 nullable array as array with nullable: true', () => {
      const schema = {
        type: ['array', 'null'],
        items: { type: 'string' },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'array');
      assert.strictEqual(ast.nullable, true);
      assert.strictEqual(ast.dataTypeLabel, 'array ┃ null');
      assert.strictEqual(ast.items.type, 'string');
    });

    it('should generate union options for complex type combined with primitive', () => {
      const schema = {
        type: ['string', 'object'],
        properties: { id: { type: 'string' } },
      };
      const ast = schemaToAST(schema);
      assert.strictEqual(ast.kind, 'union');
      assert.strictEqual(ast.operator, 'oneOf');
      assert.strictEqual(ast.options.length, 2);
      assert.strictEqual(ast.options[0].kind, 'object');
      assert.strictEqual(ast.options[1].kind, 'primitive');
    });
  });

  describe('recursion limit & null inputs', () => {
    it('should return null for falsy schema input', () => {
      assert.strictEqual(schemaToAST(null), null);
      assert.strictEqual(schemaToAST(undefined), null);
    });

    it('should cap recursion at level > 8 and mark truncated: true', () => {
      const schema = {
        type: 'object',
        description: 'deeply nested',
        properties: { id: { type: 'string' } },
      };
      const ast = schemaToAST(schema, 9);
      assert.strictEqual(ast.truncated, true);
      assert.strictEqual(ast.properties, undefined);
    });
  });
});
