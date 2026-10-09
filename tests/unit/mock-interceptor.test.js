import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  compileRoutes,
  enableMockServer,
  disableMockServer,
  updateMockConfig,
  isMockServerActive,
} from '../../packages/rapidoc/src/utils/mock-interceptor.ts';

describe('mock-interceptor', () => {
  const originalFetch = async (url) => {
    return new Response(JSON.stringify({ realNetwork: true, url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const testSpec = {
    servers: [{ url: 'https://api.example.com/v1' }, { url: '/api/v1' }],
    tags: [
      {
        name: 'Users',
        paths: [
          {
            method: 'GET',
            path: '/users/{id}',
            responses: {
              200: {
                content: {
                  'application/json': {
                    example: { id: 1, name: 'Alice' },
                  },
                },
              },
              404: {
                content: {
                  'application/json': {
                    example: { error: 'User not found' },
                  },
                },
              },
            },
          },
          {
            method: 'POST',
            path: '/users',
            responses: {
              201: {
                content: {
                  'application/json': {
                    example: { id: 2, name: 'Bob' },
                  },
                },
              },
            },
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    globalThis.window = globalThis;
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    disableMockServer();
  });

  it('should compile routes and parameter regexes properly', () => {
    const routes = compileRoutes(testSpec);
    assert.strictEqual(routes.length, 2);
    assert.strictEqual(routes[0].routeKey, 'GET /users/{id}');
    assert.strictEqual(routes[1].routeKey, 'POST /users');
  });

  it('should intercept matching GET endpoint and return mock data', async () => {
    enableMockServer(testSpec, { log: 'false' });
    assert.strictEqual(isMockServerActive(), true);

    const res = await fetch('https://api.example.com/v1/users/42');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('x-mock-server'), 'RapiDoc');

    const data = await res.json();
    assert.deepStrictEqual(data, { id: 1, name: 'Alice' });
  });

  it('should match relative paths', async () => {
    enableMockServer(testSpec, { log: 'false' });

    const res = await fetch('/api/v1/users/99');
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.deepStrictEqual(data, { id: 1, name: 'Alice' });
  });

  it('should cycle through multi-status codes in sequence', async () => {
    enableMockServer(testSpec, { log: 'false' });
    updateMockConfig({ statusCode: '404, 200', statusStrategy: 'cycle' });

    const first = await fetch('/api/v1/users/1');
    assert.strictEqual(first.status, 404);

    const second = await fetch('/api/v1/users/1');
    assert.strictEqual(second.status, 200);

    const third = await fetch('/api/v1/users/1');
    assert.strictEqual(third.status, 404);
  });

  it('should pass through non-matching URLs to original fetch', async () => {
    enableMockServer(testSpec, { log: 'false' });

    const res = await fetch('https://other.com/unknown');
    const data = await res.json();
    assert.strictEqual(data.realNetwork, true);
  });

  it('should restore original fetch when disabled', async () => {
    enableMockServer(testSpec, { log: 'false' });
    disableMockServer();
    assert.strictEqual(isMockServerActive(), false);

    const res = await fetch('/api/v1/users/1');
    const data = await res.json();
    assert.strictEqual(data.realNetwork, true);
  });

  describe('no-example-provided edge cases', () => {
    const edgeCaseSpec = {
      servers: [],
      tags: [
        {
          name: 'EdgeCases',
          paths: [
            {
              method: 'GET',
              path: '/writeonly-only',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          password: { type: 'string', writeOnly: true },
                          adminSecret: { type: 'string', writeOnly: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              method: 'GET',
              path: '/allof-primitive',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [{ type: 'string', description: 'Primitive in allOf without example' }],
                      },
                    },
                  },
                },
              },
            },
            {
              method: 'GET',
              path: '/empty-schema',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: { type: 'object' },
                    },
                  },
                },
              },
            },
            {
              method: 'GET',
              path: '/binary-stream',
              responses: {
                200: {
                  content: {
                    'application/octet-stream': {
                      schema: { type: 'string', format: 'binary' },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    };

    it('should omit writeOnly fields in response and return valid empty JSON object {}', async () => {
      enableMockServer(edgeCaseSpec, { log: 'false' });

      const res = await fetch('/writeonly-only');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get('content-type'), 'application/json');

      const data = await res.json();
      assert.deepStrictEqual(data, {}, 'Should omit writeOnly fields, returning {}');
    });

    it('should provide fallback JSON response when allOf primitive has no example', async () => {
      enableMockServer(edgeCaseSpec, { log: 'false' });

      const res = await fetch('/allof-primitive');
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.status, 200);
      assert.strictEqual(data.message, 'OK');
    });

    it('should return empty JSON object {} for empty schema definition', async () => {
      enableMockServer(edgeCaseSpec, { log: 'false' });

      const res = await fetch('/empty-schema');
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.deepStrictEqual(data, {});
    });

    it('should return valid status text for binary stream without example', async () => {
      enableMockServer(edgeCaseSpec, { log: 'false' });

      const res = await fetch('/binary-stream');
      assert.strictEqual(res.status, 200);
      const text = await res.text();
      assert.strictEqual(text, 'OK');
    });
  });
});
