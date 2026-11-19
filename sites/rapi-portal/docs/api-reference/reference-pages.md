---
title: Reference pages
description: What each API's reference page shows, its URLs, and how to link to an operation.
---

Every API in `apis:` gets an interactive reference page, rendered by the [RapiDoc](https://rapidocui.com) web component. See one: [the example Bookstore API](/apis/bookstore/).

## URLs

| URL | Shows |
| :--- | :--- |
| `/apis/<id>` | The API's overview: title, description, servers, authentication. |
| `/apis/<id>/<tag>` | The operations of one tag. One page per tag keeps big APIs fast. |
| `/apis/<id>/<tag>#<operation>` | One operation. The anchor is the `operationId` in kebab-case: `createOrder` is `#create-order`. |
| `/apis` | Redirects to the [catalog](/docs/api-reference/catalog/). |
| `/specs/<id>.yaml` | The spec itself (or `.json`, the file's own extension). |

Tag slugs are the tag names in kebab-case: the tag `Shipment Management` is `/apis/shipments/shipment-management`.

An API with [versions](/docs/api-reference/versions/) has these URLs for its default version, and the same below `/apis/<id>/<version>` for each other version.

## The page

- **A version picker** at the top of the sidebar, when the API has [several versions](/docs/api-reference/versions/).
- **A sidebar** on the left lists the tags and their operations, with the HTTP method of each. It is static HTML, so it shows at once, before the reference has loaded, and it stays in view while the page scrolls. Its filter box narrows the list as you type.
- **The reference** shows each operation's parameters, request body, responses and examples, with schemas as an expandable tree or a table.
- **Try** sends a real request to the spec's server from the reader's browser and shows the response.
- **Authentication** lets readers enter an API key, a bearer token, or sign in with OAuth 2 before they try.

The page follows the portal: same header, footer, theme and accent color, and light or dark with the rest of the site.

## Linking to an operation

Give every operation an `operationId`. The anchor is then stable:

```markdown
[Create a shipment](/apis/shipments/shipments#create-shipment)
```

Without an `operationId`, the anchor is built from the summary and changes when the summary is edited, so `rapidoc dev` and `rapidoc build` warn about such operations. Every operation can also be linked by its method and path, which only changes with the endpoint: `#get-orders-orderid`.

## OAuth 2 sign-in for Try

Readers can sign in to your API from the API reference page and call it with **Try**, using their own account. The sign-in runs in the browser, so it works on a plain [static](/docs/deploy/static-hosting/) portal: no `auth` key and no `rapidoc serve`. It covers calls to your API only; the documentation stays public.

### How it works

1. The spec declares an `oauth2` or `openIdConnect` security scheme. RapiDoc shows it in the page's **Authentication** section.
2. The reader presses **Authorize**. RapiDoc opens your provider's sign-in in a popup, using the authorization code flow with PKCE.
3. The provider redirects the popup to `/oauth-receiver.html`, a page every portal build has. It hands the code back to the API page, and RapiDoc exchanges it for an access token at the `tokenUrl`.
4. **Try** sends `Authorization: Bearer <token>` to your API. The token stays in the page's memory and is gone on reload.

### Declare the scheme

Use a standard OpenAPI `oauth2` scheme. For a public client, pre-fill the client ID with `x-client-id` and set `x-pkce-only: true`, which hides the client secret fields, so readers only press **Authorize**:

```yaml title="specs/orders.yaml"
components:
  securitySchemes:
    OAuth:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://acme.okta.com/oauth2/default/v1/authorize
          tokenUrl: https://acme.okta.com/oauth2/default/v1/token
          scopes:
            orders:read: Read your orders
            orders:write: Create and change orders
          x-client-id: portal-try
          x-pkce-only: true
          x-default-scopes: [orders:read]
security:
  - OAuth: [orders:read]
```

More extensions, such as `x-authorize-params` and `x-token-params` for an `audience`, are in RapiDoc's [OAuth guide](https://rapidocui.com/docs/authentication/oauth/).

### At your provider

- Register a **single-page application** (a public client: authorization code with PKCE, no client secret). A secret in a static page is readable by anyone.
- Add `<portal URL>/oauth-receiver.html` as a redirect URL: one URL for the whole portal. For local testing, add `http://localhost:4321/oauth-receiver.html` too.
- Allow the portal's origin for CORS on the token endpoint: the browser calls it directly. Most providers do this for single-page-app clients.
- Your API must also allow the portal's origin for CORS, as for any **Try** request.

### Browser sign-in or portal sign-in

| | Browser sign-in (this section) | [Portal sign-in](/docs/access/overview/) with [`tryIt`](/docs/access/try-it/) |
| :--- | :--- | :--- |
| Hosting | Any static host | `rapidoc serve` |
| Provider set in | The spec's security scheme | The portal config (`auth`) |
| Protects the documentation | No | Yes, with `access` rules |
| Readers sign in | Once per API, with **Authorize** | Once for the whole portal; **Try** has their token |

With portal sign-in and `tryIt`, readers don't need to authorize separately.

## Customizing

Change how RapiDoc renders, such as the schema style, the code sample languages or the font size, with the `rapidoc:` key. See [RapiDoc attributes](/docs/api-reference/rapidoc-attributes/).
