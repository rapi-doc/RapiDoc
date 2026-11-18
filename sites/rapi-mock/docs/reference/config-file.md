---
title: mock.config.yaml reference
description: Every key of mock.config.yaml.
---

Your corrections to what the mock worked out. See [the guide](/docs/correcting/config-file/) for when to use it.

```yaml title="mock.config.yaml"
version: 1
resources:
  <Resource>:
    key: <field>
operations:
  <operation>:
    resource: <Resource>
    action: <action>
    key: <source>
apis:
  <api id>:
    resources: ...
    operations: ...
```

## `version`

`1`. Optional, and worth writing: it lets a later format be told from this one. A version the mock does not know is named at start, and what it recognises is still applied.

## `resources.<Resource>`

`<Resource>` is a resource the mock found, or the name of a schema under `components.schemas`. Naming a schema that is not yet a resource makes it one.

| Key | Value |
| :--- | :--- |
| `key` | The field that tells one record from another. A dotted path reaches inside the record: `metadata.name`. |

## `operations.<operation>`

`<operation>` is an `operationId`, or a method and path: `"DELETE /videos"`.

| Key | Value |
| :--- | :--- |
| `action` | `list`, `create`, `createMany`, `read`, `update`, `patch`, `delete`, or `none` to keep no state. |
| `resource` | The resource the operation works on. Not needed with `action: none`. |
| `key` | For `read`, `update`, `patch` and `delete`: where the record's key comes from. `path.<parameter>`, `query.<parameter>` or `body.<field>`. Defaults to the path's last parameter. |

## `apis.<api id>`

With several APIs, the `resources` and `operations` of each go under its id, as `rapidoc mock` names it at start. With one API they can sit at the top level.

## What is checked

An entry is skipped, and named when the mock starts, when:

- the spec has no resource or schema of that name;
- the resource has no field at the key's path;
- the spec has no operation with that id, or that method and path;
- the operation has no parameter the key names;
- a key or value is not one of those above.

`rapidoc lint --stateful` reports the same, as `mock-config`.
