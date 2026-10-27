import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allows, decide, emailMatches } from '../src/access.js';
import { claimList } from '../src/auth/oidc.js';
import { safeReturnTo } from '../src/auth/routes.js';
import { createSealer } from '../src/auth/session.js';
import { parseDuration } from '../src/settings.js';
import { candidateFiles } from '../src/static.js';

describe('rapidoc serve helpers', () => {
  it('matches email patterns case-insensitively, with * as a wildcard', () => {
    assert.ok(emailMatches('*@example.com', 'Jane@Example.com'));
    assert.ok(emailMatches('jane@example.com', 'jane@example.com'));
    assert.ok(!emailMatches('*@example.com', 'jane@example.com.evil.io'));
    assert.ok(!emailMatches('*@example.com', 'jane@sub.examplexcom'));
    assert.ok(!emailMatches('*@example.com', ''));
  });

  it('decides per zone: allow, sign-in or forbidden', () => {
    const members = { kind: 'members', groups: ['a'], emails: [] };
    assert.equal(decide({ z: members }, 'z', null), 'sign-in');
    assert.equal(decide({ z: members }, 'z', { groups: ['b'] }), 'forbidden');
    assert.equal(decide({ z: members }, 'z', { groups: ['a'] }), 'allow');
    assert.equal(decide({}, 'unknown', { groups: ['a'] }), 'forbidden', 'unknown zones are never served');
    assert.ok(allows({ kind: 'signed-in' }, {}));
  });

  it('reads groups from dotted claim paths, arrays or strings', () => {
    assert.deepEqual(claimList({ realm_access: { roles: ['x', 'y', 3] } }, 'realm_access.roles'), ['x', 'y']);
    assert.deepEqual(claimList({ groups: 'a b,c' }, 'groups'), ['a', 'b', 'c']);
    assert.deepEqual(claimList({}, 'groups'), []);
  });

  it('parses session lengths', () => {
    assert.equal(parseDuration('30m'), 1800);
    assert.equal(parseDuration('8h'), 28800);
    assert.equal(parseDuration('7d'), 604800);
    assert.equal(parseDuration('8 hours'), null);
  });

  it('keeps sign-in return paths on this site', () => {
    assert.equal(safeReturnTo('/docs/a?x=1#y'), '/docs/a?x=1#y');
    for (const bad of [undefined, '', 'https://evil.example', '//evil.example', '/\\evil.example', '/a\nb', '/_rapidoc/auth/login']) {
      assert.equal(safeReturnTo(bad), '/', String(bad));
    }
  });

  it('maps URL paths to built files and refuses traversal', () => {
    assert.deepEqual(candidateFiles('/'), ['index.html']);
    assert.deepEqual(candidateFiles('/docs/a/'), ['docs/a/index.html']);
    assert.deepEqual(candidateFiles('/docs/a'), ['docs/a', 'docs/a/index.html']);
    assert.deepEqual(candidateFiles('/docs/my%20page/'), ['docs/my page/index.html']);
    assert.equal(candidateFiles('/a/..%2fb'), null);
    assert.equal(candidateFiles('/a/%ZZ'), null);
  });

  it('seals and opens cookies, and rejects other keys and expired tokens', async () => {
    const sealer = createSealer('s'.repeat(32));
    const token = await sealer.seal({ sub: 'u1' }, 60);
    assert.equal((await sealer.open(token)).sub, 'u1');
    assert.equal(await createSealer('t'.repeat(32)).open(token), null);
    assert.equal(await sealer.open(await sealer.seal({ sub: 'u1' }, -120)), null);
  });
});
