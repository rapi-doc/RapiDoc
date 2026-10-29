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

describe('Swagger 2.0 security definitions', () => {
  it('keeps the description and x- extensions of oauth2 and basic schemes', async () => {
    const spec = {
      swagger: '2.0',
      info: { title: 'Repro', version: '1.0' },
      paths: {},
      securityDefinitions: {
        oauth2: {
          type: 'oauth2',
          description: 'OAuth2 description',
          'x-internal-id': 'oauth',
          flow: 'accessCode',
          authorizationUrl: 'https://example.com/oauth/authorize',
          tokenUrl: 'https://example.com/oauth/token',
          scopes: {},
        },
        basicAuth: { type: 'basic', description: 'Basic description' },
      },
    };

    const result = await ProcessSpec.call({ requestUpdate() {}, dispatchEvent() {} }, spec);
    const scheme = (key) => result.securitySchemes.find((s) => s.securitySchemeId === key);
    assert.strictEqual(scheme('oauth2').description, 'OAuth2 description');
    assert.strictEqual(scheme('oauth2')['x-internal-id'], 'oauth');
    assert.strictEqual(scheme('basicAuth').description, 'Basic description');
  });
});
