---
title: Tokens and scopes
description: How Rapi Mock enforces each operation's security, with real token checks against your issuer.
---

Security is enforced per operation, as the spec declares it.

- **OAuth 2, OpenID Connect and HTTP bearer**: with `--issuer`, the token must be a JWT signed by that issuer, unexpired and for the `--audience`, or the request gets `401`. It must also grant the operation's scopes in its `scope`, `scp` or `permissions` claim, or the request gets `403` with `WWW-Authenticate: Bearer error="insufficient_scope"`.
- **Without `--issuer`**, any bearer token is accepted. The mock says so when it starts.
- **API key** and **HTTP Basic**: the credential must be present.
- **`security: []`**: open.

```bash
npx rapidoc mock openapi.yaml --issuer https://example.us.auth0.com/ --audience https://api.example.com
```

Security is checked before the request is validated, so a caller without access learns nothing about the request format.

| Option | Environment variable | Meaning |
| :--- | :--- | :--- |
| `--issuer <url>` | `RAPIDOC_MOCK_ISSUER` | OpenID Connect issuer whose access tokens are accepted. The server won't start if the issuer can't be discovered. |
| `--audience <id>` | `RAPIDOC_MOCK_AUDIENCE` | The `aud` tokens must have (your API's identifier at the provider). |
