---
title: Footer
description: Call to action, link columns, newsletter sign-up, social links and copyright.
---

```yaml title="rapidoc.config.yaml"
footer:
  cta:
    title: Ready to ship?
    description: Book your first shipment in minutes.
    links:
      - { label: Get started, href: /docs/quickstart }
      - { label: Contact sales, href: /contact }
  newsletter:
    action: https://example.us1.list-manage.com/subscribe/post?u=...
    field: EMAIL
  columns:
    - title: Company
      links:
        - { label: About, href: /about }
        - { label: Careers, href: /careers }
  social:
    - { icon: github, href: https://github.com/acme }
    - { icon: discord, href: https://discord.gg/acme }
  copyright: © 2026 Acme, Inc.
  branding: true
```

Set `footer: false` to have no footer.

## Call to action

`cta` is a band at the top of the footer with a `title`, an optional `description` and up to three `links`. The first link is a filled button and the others are outlined; set `style: primary` or `style: button` on a link to choose.

## Newsletter

`newsletter` adds an email sign-up form under the footer logo. The form posts to `action`, your newsletter service's form endpoint (Mailchimp, Buttondown, ConvertKit, ...).

| Key | Default |
| :--- | :--- |
| `action` | **Required.** The URL the form posts to. |
| `field` | `email`. The name of the email field your service expects. |
| `title` | `Newsletter` |
| `description` | none |
| `button` | `Subscribe` |

## Columns, social links, copyright

- `columns`: groups of links, each with a `title`.
- `social`: icons for `github`, `x`, `discord`, `linkedin` and `youtube`.
- `copyright`: one line of text.
- `branding`: shows "Powered by RapiDoc". Default `true`.
