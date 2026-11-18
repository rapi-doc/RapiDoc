---
title: mock.config.yaml
description: State what Rapi Mock could not read off your spec - a resource's key, what an operation does.
---

The mock reads the data model off the spec, and some APIs don't show it the way the mock expects: the key sits inside the record, or the id travels in the query string. State what it could not see in a `mock.config.yaml` beside the spec:

```yaml title="mock.config.yaml"
version: 1

resources:
  Pod:
    key: metadata.name # the field that tells one record from another

operations:
  deleteVideo: # an operationId, or "DELETE /videos"
    resource: Video
    action: delete
    key: query.id # where the record's key comes from
  sendMessage:
    action: none # keep no state for this one
```

- **`resources.<Name>.key`** names the key of a resource; a dotted path reaches inside the record. Naming a schema the mock did not take for a resource makes it one.
- **`operations.<id>`** says what an operation does: `resource`, `action`, and `key` for the ones that work on one record.
- **What you state is taken as stated.** It is no longer labelled Needs review.
- **With several APIs,** put the same two sections under `apis.<api id>`.

Every key is listed in the [reference](/docs/reference/config-file/).

## Where the file is found

In the folder being mocked, beside the first spec, then in the current folder. `--mock-config <file>` names another. It is read with `--stateful` only.

## When the spec changes under it

An entry that no longer fits the spec is skipped and named when the mock starts, so a renamed operation or field doesn't silently undo a correction:

```text
mock.config.yaml: videos: operations.deleteVideo.key: the operation has no query parameter videoId
```

## Finding what to correct

- [`rapidoc lint --stateful`](/docs/correcting/lint/) lists what the mock assumed, at its place in the spec. It reads this file, so the list shrinks as you settle things.
- The [Mock UI](/docs/mock-ui/tour/) shows the same as **Needs review** labels.

An operation labelled Stateful can be corrected the same way, if you spot one the mock got wrong.
