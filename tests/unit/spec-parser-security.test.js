import { describe, it } from 'node:test';
import assert from 'node:assert';
import ProcessSpec from '../../packages/rapidoc/src/utils/spec-parser.js';

describe('operation security inheritance', () => {
  const cases = [
    ['inherits root security', [{ bearerAuth: [] }], undefined, [{ bearerAuth: [] }]],
    ['preserves explicit public access', [{ bearerAuth: [] }], [], []],
    ['preserves operation overrides', [{ bearerAuth: [] }], [{ otherAuth: [] }], [{ otherAuth: [] }]],
    ['preserves optional authentication', [{ bearerAuth: [] }], [{}, { bearerAuth: [] }], [{}, { bearerAuth: [] }]],
    ['has no requirements when neither level declares security', undefined, undefined, undefined],
  ];

  for (const [name, rootSecurity, operationSecurity, expected] of cases) {
    it(name, async () => {
      const operation = { responses: { 200: { description: 'OK' } } };
      const spec = {
        openapi: '3.0.3',
        info: { title: 'Security inheritance', version: '1.0.0' },
        paths: { '/example': { get: operation } },
        components: {
          securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer' },
            otherAuth: { type: 'http', scheme: 'basic' },
          },
        },
      };

      if (rootSecurity !== undefined) {
        spec.security = rootSecurity;
      }
      if (operationSecurity !== undefined) {
        operation.security = operationSecurity;
      }

      const result = await ProcessSpec.call({ requestUpdate() {}, dispatchEvent() {} }, spec);
      assert.strictEqual(result.specLoadError, false);
      assert.deepStrictEqual(result.tags[0].paths[0].security, expected);
    });
  }
});
