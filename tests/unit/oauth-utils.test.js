import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { isExpectedOAuthReply, pkceChallenge, randomUrlSafe, readOAuthReply } from '../../packages/rapidoc/src/utils/oauth-utils.js';

describe('OAuth popup helpers', () => {
  it('makes unguessable, URL-safe values of PKCE length', () => {
    const values = new Set(Array.from({ length: 50 }, () => randomUrlSafe()));
    assert.equal(values.size, 50, 'never repeats');
    for (const value of values) {
      assert.match(value, /^[A-Za-z0-9_-]{43}$/);
    }
    assert.match(randomUrlSafe(16), /^[A-Za-z0-9_-]{22}$/);
  });

  it('computes the S256 challenge of RFC 7636', async () => {
    // Appendix B of RFC 7636
    assert.equal(await pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
    const verifier = randomUrlSafe();
    const expected = crypto.createHash('sha256').update(verifier).digest('base64url');
    assert.equal(await pkceChallenge(verifier), expected);
  });

  it('reads code replies from the query and token replies from the fragment, with state', () => {
    assert.deepEqual(readOAuthReply({ search: '?code=abc&state=s1', hash: '' }), {
      responseType: 'code',
      code: 'abc',
      state: 's1',
      error: null,
      errorDescription: null,
    });
    const token = readOAuthReply({ search: '', hash: '#access_token=t+1%2F2&token_type=Bearer&state=s2' });
    assert.equal(token.responseType, 'token');
    assert.equal(token.accessToken, 't 1/2', '+ and %xx are decoded');
    assert.equal(token.state, 's2');
    assert.equal(readOAuthReply({ search: '?error=access_denied&error_description=No&state=s', hash: '' }).error, 'access_denied');
    assert.equal(readOAuthReply({ search: '', hash: '' }), null);
  });

  it('accepts only the reply to this sign-in, from this site and the popup', () => {
    const popup = {};
    const reply = { responseType: 'code', code: 'c', state: 's1' };
    const expected = { state: 's1', origin: 'https://docs.example.com' };
    assert.ok(isExpectedOAuthReply(reply, expected, 'https://docs.example.com', popup, popup));
    assert.ok(!isExpectedOAuthReply(reply, expected, 'https://evil.example', popup, popup), 'other origin');
    assert.ok(!isExpectedOAuthReply(reply, expected, 'https://docs.example.com', {}, popup), 'other window');
    assert.ok(!isExpectedOAuthReply({ ...reply, state: 's2' }, expected, 'https://docs.example.com', popup, popup), 'other state');
    assert.ok(!isExpectedOAuthReply({ ...reply, state: undefined }, expected, 'https://docs.example.com', popup, popup), 'no state');
    assert.ok(!isExpectedOAuthReply({ fake: true }, expected, 'https://docs.example.com', popup, popup), 'not a reply');
    assert.ok(!isExpectedOAuthReply('code', expected, 'https://docs.example.com', popup, popup), 'not an object');
    assert.ok(isExpectedOAuthReply(reply, { state: 's1' }), 'BroadcastChannel replies: same-origin by design, state still checked');
    assert.ok(!isExpectedOAuthReply(reply, { state: '' }), 'an empty expected state never matches');
  });
});
