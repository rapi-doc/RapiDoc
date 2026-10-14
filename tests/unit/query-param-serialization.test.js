import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  replacePathParams,
  serializeQueryParam,
  buildQueryString,
  joinServerAndPath,
  constructFetchURL,
} from '../../packages/rapidoc/src/utils/url-utils.js';

describe('URL Utils & Query Parameter Serialization', () => {
  describe('replacePathParams', () => {
    it('should replace single path parameter', () => {
      const result = replacePathParams('/users/{id}', { id: '123' });
      assert.equal(result, '/users/123');
    });

    it('should replace multiple distinct path parameters', () => {
      const result = replacePathParams('/orgs/{orgId}/users/{userId}/repos/{repoId}', {
        orgId: 'acme',
        userId: '42',
        repoId: 'core',
      });
      assert.equal(result, '/orgs/acme/users/42/repos/core');
    });

    it('should replace ALL occurrences of a repeated path parameter (replaceAll)', () => {
      const result = replacePathParams('/users/{userId}/items/{userId}', { userId: 'alice' });
      assert.equal(result, '/users/alice/items/alice');
    });

    it('should percent-encode special characters in path parameters', () => {
      const result = replacePathParams('/search/{category}', { category: 'books & music/rock' });
      assert.equal(result, '/search/books%20%26%20music%2Frock');
    });

    it('should handle missing, null, or undefined path parameter values safely', () => {
      assert.equal(replacePathParams('/users/{id}', { id: null }), '/users/');
      assert.equal(replacePathParams('/users/{id}', { id: undefined }), '/users/');
      assert.equal(replacePathParams('/users/{id}', {}), '/users/{id}');
      assert.equal(replacePathParams('/users/{id}', null), '/users/{id}');
    });
  });

  describe('serializeQueryParam - Array formatting', () => {
    it('should format exploded array (style: form, explode: true)', () => {
      const entries = serializeQueryParam('tags', ['news', 'tech', 'ai'], {
        style: 'form',
        explode: true,
        isArray: true,
      });
      assert.deepEqual(entries, [
        ['tags', 'news'],
        ['tags', 'tech'],
        ['tags', 'ai'],
      ]);

      const qs = buildQueryString([{ name: 'tags', value: ['news', 'tech', 'ai'], style: 'form', explode: true, isArray: true }]);
      assert.equal(qs, 'tags=news&tags=tech&tags=ai');
    });

    it('should format NOT exploded array (style: form, explode: false)', () => {
      const entries = serializeQueryParam('tags', ['news', 'tech', 'ai'], {
        style: 'form',
        explode: false,
        isArray: true,
      });
      assert.deepEqual(entries, [['tags', 'news,tech,ai']]);

      // By default without allowReserved, commas are percent-encoded as %2C
      const qs = buildQueryString([{ name: 'tags', value: ['news', 'tech', 'ai'], style: 'form', explode: false, isArray: true }]);
      assert.equal(qs, 'tags=news%2Ctech%2Cai');
    });

    it('should preserve comma in unexploded array when allowReserved is true', () => {
      const qs = buildQueryString([
        {
          name: 'tags',
          value: ['news', 'tech', 'ai'],
          style: 'form',
          explode: false,
          allowReserved: true,
          isArray: true,
        },
      ]);
      assert.equal(qs, 'tags=news,tech,ai');
    });

    it('should format spaceDelimited array', () => {
      const entries = serializeQueryParam('fields', ['id', 'name', 'status'], {
        style: 'spaceDelimited',
        isArray: true,
      });
      assert.deepEqual(entries, [['fields', 'id name status']]);

      const qs = buildQueryString([{ name: 'fields', value: ['id', 'name', 'status'], style: 'spaceDelimited', isArray: true }]);
      assert.equal(qs, 'fields=id%20name%20status');
    });

    it('should format pipeDelimited array', () => {
      const entries = serializeQueryParam('categories', ['electronics', 'appliances'], {
        style: 'pipeDelimited',
        isArray: true,
      });
      assert.deepEqual(entries, [['categories', 'electronics|appliances']]);

      const qs = buildQueryString([{ name: 'categories', value: ['electronics', 'appliances'], style: 'pipeDelimited', isArray: true }]);
      assert.equal(qs, 'categories=electronics%7Cappliances');
    });

    it('should filter out blank, null, and undefined array entries', () => {
      const qs = buildQueryString([
        { name: 'items', value: ['alpha', '', null, 'beta', undefined, 'gamma'], style: 'form', explode: true, isArray: true },
      ]);
      assert.equal(qs, 'items=alpha&items=beta&items=gamma');
    });

    it('should return empty string for empty array or array containing only blanks', () => {
      assert.equal(buildQueryString([{ name: 'empty', value: [], isArray: true }]), '');
      assert.equal(buildQueryString([{ name: 'blanks', value: ['', null, undefined], isArray: true }]), '');
    });
  });

  describe('serializeQueryParam - Primitives & Reserved Chars', () => {
    it('should serialize primitive values including 0 and false', () => {
      const qs = buildQueryString([
        { name: 'page', value: 0 },
        { name: 'active', value: false },
        { name: 'search', value: 'hello world' },
      ]);
      assert.equal(qs, 'page=0&active=false&search=hello%20world');
    });

    it('should omit empty, null, or undefined primitives', () => {
      const qs = buildQueryString([
        { name: 'empty', value: '' },
        { name: 'nullVal', value: null },
        { name: 'undefVal', value: undefined },
        { name: 'valid', value: 'yes' },
      ]);
      assert.equal(qs, 'valid=yes');
    });

    it('should safely handle RFC 3986 allowReserved characters without corrupting query structure', () => {
      // Delimiters &, =, and + should be encoded even when allowReserved is true to preserve parameter boundaries
      const qs = buildQueryString([
        {
          name: 'redirect',
          value: 'https://example.com/callback?foo=bar&baz=qux',
          allowReserved: true,
        },
      ]);
      assert.equal(qs, 'redirect=https://example.com/callback?foo%3Dbar%26baz%3Dqux');
    });
  });

  describe('serializeQueryParam - Objects', () => {
    it('should serialize object using deepObject brackets', () => {
      const qs = buildQueryString([
        {
          name: 'filter',
          value: { status: 'active', limit: 10 },
          isObject: true,
        },
      ]);
      assert.equal(qs, 'filter%5Bstatus%5D=active&filter%5Blimit%5D=10');
    });

    it('should serialize object from raw JSON string', () => {
      const qs = buildQueryString([
        {
          name: 'filter',
          value: '{"category": "books", "inStock": true}',
          isObject: true,
        },
      ]);
      assert.equal(qs, 'filter%5Bcategory%5D=books&filter%5BinStock%5D=true');
    });

    it('should serialize object with style json', () => {
      const qs = buildQueryString([
        {
          name: 'filter',
          value: { tag: 'sales' },
          style: 'json',
          isObject: true,
        },
      ]);
      assert.equal(qs, 'filter=%7B%22tag%22%3A%22sales%22%7D');
    });

    it('should safely handle invalid JSON string in object query param', () => {
      const qs = buildQueryString([
        {
          name: 'filter',
          value: '{not-valid-json}',
          isObject: true,
        },
      ]);
      assert.equal(qs, '');
    });
  });

  describe('joinServerAndPath', () => {
    it('should cleanly join server URL and path template without double slashes', () => {
      assert.equal(joinServerAndPath('https://api.example.com/', '/users'), 'https://api.example.com/users');
      assert.equal(joinServerAndPath('https://api.example.com', '/users'), 'https://api.example.com/users');
      assert.equal(joinServerAndPath('https://api.example.com/', 'users'), 'https://api.example.com/users');
      assert.equal(joinServerAndPath('https://api.example.com///', '///users'), 'https://api.example.com/users');
    });

    it('should handle empty serverUrl or empty path', () => {
      assert.equal(joinServerAndPath('', '/users/123'), '/users/123');
      assert.equal(joinServerAndPath('https://api.example.com', ''), 'https://api.example.com');
    });
  });

  describe('constructFetchURL', () => {
    it('should construct complete URL with path params, exploded & non-exploded query params, and API keys', () => {
      const url = constructFetchURL({
        serverUrl: 'https://api.example.com/v1/',
        path: '/store/{storeId}/inventory',
        pathParams: { storeId: 'east-1' },
        queryParams: [
          { name: 'category', value: ['electronics', 'computers'], style: 'form', explode: true, isArray: true },
          { name: 'status', value: ['in-stock', 'available'], style: 'form', explode: false, isArray: true },
          { name: 'limit', value: 25 },
        ],
        apiKeys: [{ in: 'query', name: 'api_token', finalKeyValue: 'secret123' }],
      });

      assert.equal(
        url,
        'https://api.example.com/v1/store/east-1/inventory?category=electronics&category=computers&status=in-stock%2Cavailable&limit=25&api_token=secret123'
      );
    });

    it('should correctly append query parameters when path already contains a query string', () => {
      const url = constructFetchURL({
        serverUrl: 'https://api.example.com',
        path: '/items?fixed=true',
        queryParams: [{ name: 'page', value: 2 }],
      });
      assert.equal(url, 'https://api.example.com/items?fixed=true&page=2');
    });
  });
});
