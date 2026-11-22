---
title: Keeping state
description: With --stateful, RapiMock remembers what you create, change and delete.
---

By default every call is answered on its own: a `POST` returns a made-up record, and the next `GET` doesn't know about it. With `--stateful` the mock keeps data, like the real server would:

```bash
npx rapidoc mock openapi.yaml --stateful
```

- **It works out the data model from the spec.** Paths such as `/pets` and `/pets/{petId}` that share a schema become one resource, with its key and its links to other resources. [How it works](/docs/getting-started/how-it-works/) has the details.
- **It starts with data.** Each resource gets 10 records (`--rows`). See [Seed data](/docs/state/seed-data/).
- **Writes are kept.** A create stores a record, an update or delete changes it, and reads and lists return what is stored.
- **Lists filter and page.** Query parameters that match a field filter the list; `limit`, `offset` and `page` page it, and a count beside the records gets the real total.
- **Records stay under their parent.** A comment created at `/articles/{slug}/comments` is listed and found under that article only, whether or not it has a field for the article.
- **Responses keep the spec's shape.** A record goes where the response schema puts it, such as inside `data` next to a `request_id`.
- **Everything else answers as before.** An operation that fits no resource (a login, a search, a file upload) gets its example or generated data.

The data lives in memory and starts fresh on every run.

## What a new record gets

Fields the caller can't send, or left out, are filled the way a server would: an id, timestamps set to now, lists empty, counts at zero. A key the path expects as a number is a number.

## When a record is missing

A read, update or delete of a record that isn't there returns the spec's own `404` response when it documents one.

## Next

- [Sessions](/docs/state/sessions/): a copy of the data per test.
- [API styles](/docs/state/api-styles/): what works with no configuration.
- [Correcting the mock](/docs/correcting/config-file/): when it reads your spec wrongly.
