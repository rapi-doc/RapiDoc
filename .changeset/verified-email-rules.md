---
"@rapidoc/server": patch
---

Email access rules (`allow: { emails }`) only match an email the provider marks as verified: `email_verified: true`, or `xms_edov: true` on Microsoft Entra ID. An email without `email_verified` used to count as verified. Microsoft Entra ID sends no `email_verified`, so email rules for Entra ID users need the optional claim `xms_edov` (or app roles in place of email rules). `rapidoc serve` logs a hint when a sign-in's email can't match email rules.
