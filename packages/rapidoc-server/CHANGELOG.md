# @rapidoc/server

## 0.1.6

### Patch Changes

- ae8e490: Email access rules (`allow: { emails }`) only match an email the provider marks as verified: `email_verified: true`, or `xms_edov: true` on Microsoft Entra ID. An email without `email_verified` used to count as verified. Microsoft Entra ID sends no `email_verified`, so email rules for Entra ID users need the optional claim `xms_edov` (or app roles in place of email rules). `rapidoc serve` logs a hint when a sign-in's email can't match email rules.
- @rapidoc/mcp@0.1.6

## 0.1.5

### Patch Changes

- @rapidoc/mcp@0.1.5

## 0.1.4

### Patch Changes

- @rapidoc/mcp@0.1.4

## 0.1.3

### Patch Changes

- @rapidoc/mcp@0.1.3

## 0.1.2

### Patch Changes

- @rapidoc/mcp@0.1.2
