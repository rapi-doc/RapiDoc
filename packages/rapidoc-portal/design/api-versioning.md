# API versioning (design)

Status: approved and implemented (2026-10-29).

One entry in `apis:` can have several specs, one per version, like Zudoku's
[versioning](https://zudoku.dev/docs/configuration/api-reference#versioning). Every version has its own
URLs, and the API reference page gets a version picker. An API without versions works exactly as today.

## 1. Config

A new `versions:` key, used instead of `spec:` (exactly one of the two):

```yaml
apis:
  - id: payments
    title: Payments API          # default: info.title of the first version
    category: Billing
    versions:                    # the first one is the default version
      - spec: ./specs/payments-v2.yaml
        version: v2              # URL segment; default: the spec's info.version
        label: v2 (latest)       # picker text; default: the spec's info.version
      - spec: ./specs/payments-v1.yaml
        version: v1
      - ./specs/payments-v0.yaml # a bare path: version and label both from info.version
```

- `version` must be a URL segment: lowercase letters, digits, `.` and `-` (`v2`, `2.1.0`, `2024-06-01`).
  A derived `info.version` is lowercased; if it is not a valid segment the build tells you to set `version`.
- A version whose `spec` is a URL needs `version` (the build doesn't read remote specs). `label` then
  defaults to `version`.
- Versions of one API must have different `version`s.
- Why a separate key instead of letting `spec` take a list: `spec` stays a plain string everywhere, and
  editor autocomplete/validation messages stay simple.

## 2. URLs

| URL | Shows |
| :-- | :-- |
| `/apis/<id>`, `/apis/<id>/<tag>` | the **default** (first) version, as today |
| `/apis/<id>/<version>`, `/apis/<id>/<version>/<tag>` | every other version |
| `/apis/<id>/<default version>[/<tag>]` | redirects to the unversioned URL (keeps the `#operation`) |

So `/apis/<id>` always means "current", existing links keep working when you add versions, and a link
pinned to a version (`/apis/payments/v2/...`) never breaks: it is a real page once v2 stops being the default.
A version that has the same slug as a tag of the default version (`/apis/<id>/<x>`) is a build error.

## 3. How the rest of the portal treats versions

- **Navigation** (`api:` tabs and sidebar items): link to the default version. New optional `version:` next
  to `api:` links to a specific one (`{ api: payments, version: v1, label: Payments v1 (legacy) }`).
  An `api:` tab stays active on every version's pages (its match prefix `/apis/<id>` covers them).
- **Catalog card**: one card per API, linking to the default version; the badge shows the default version's
  label, plus "3 versions" when there is more than one.
- **Search**: every version is indexed. Records of the default version are as today; records of other
  versions link to their versioned URL and their category reads "Payments API · v1".
- **`api-operation` tag**: `spec="payments"` embeds from the default version; a new optional `version="v1"`
  picks another. In `compileMarkdoc()` (plain HTML), `variables.specUrls` takes `payments@v1` keys as well.
- **Spec files**: the default version stays at `/specs/<id><ext>` (`api.specUrl`, unchanged), and every
  version is also at `/specs/<id>/<version><ext>`, so a spec URL pinned to a version stays valid.
- **Access rules**: a rule on `/apis/<id>/**` covers every version and every version's spec. A spec follows
  the page it belongs to: `/specs/<id><ext>` follows `/apis/<id>`, `/specs/<id>/<v><ext>` follows
  `/apis/<id>/<v>` (for the default version, `/apis/<id>`). So `/apis/payments/v3-beta/**` can protect only a
  beta version. A rule `/apis/<id>` without `/**` keeps today's meaning (the root page and the default spec).

## 4. Version picker

At the top of the API sidebar, above "Filter endpoints": a native `<select>` labelled "Version", shown only
when the API has more than one version (works the same in the narrow-screen popover sidebar). Choosing a
version goes to the same tag page (and `#operation`) in that version when the tag exists there, otherwise
to that version's overview. The tags of each version are known at build time and put on the select.

Pages of a non-default version also get a one-line note above the reference: "You're viewing v1. The
current version is v2 (link)."

## 5. Normalized config (for pages and engine code)

`normalizeApi()` adds `versions: [{ version, label, spec, fullPath, isRemote, specUrl, path, isDefault }]`
(path is `/apis/<id>` for the default, else `/apis/<id>/<version>`; specUrl as in §3, plus `pinnedSpecUrl`).
The API-level `spec`, `fullPath`, `isRemote`, `specUrl`, `path` and `version` keep describing the default
version, so code that ignores versions keeps working. An API with `spec:` gets one version.
Consumers that must see all versions: the API reference route, `sync-assets.js`, the search indexer,
`spec-checks.js` and `split-output.js`.

## 6. Migration (`rapidoc migrate --from zudoku`)

- `input: "./openapi.json"` → `spec:` (as today).
- `input: ["./v2.json", "./v1.json"]` → `versions:` with bare paths.
- `input: [{ path: "v2", label: "Version 2.0", input: "./v2.json" }, ...]` → `{ spec, version, label }`;
  mixed arrays work. A one-element array becomes `spec:`.
- `?prefix=/v2` (one file split into versions): not supported. The query is dropped and a warning says each
  of those versions now shows the whole file.
- Zudoku URLs `<path>/<version path>` get redirects to `/apis/<id>/<version>` when they differ.
- Fixes the crash on an `input` array ("The "path" argument must be of type string").

## Out of scope

Splitting one spec into versions, per-version titles/descriptions, a `deprecated` flag, and Redocly's
versioning (Redocly migration is unchanged).
