# create-rapidoc

Scaffolds a [RapiDoc Portal](https://portal.rapidocui.com): a developer portal built from OpenAPI specs and Markdown guides.

```bash
npm create rapidoc@latest my-portal
cd my-portal
npm install
npm run dev
```

Run it in a folder that already has OpenAPI files and the portal uses them: one API reference and navigation tab per spec. Otherwise it adds a sample spec.

Node.js 22.12 or later.

## What it writes

- `rapidoc.config.yaml`: site, theme, header, navigation tabs and APIs
- `package.json` with `@rapidoc/cli` and `@rapidoc/portal`, and `dev`, `build`, `validate` and `preview` scripts
- `docs/`: a home page, a getting-started guide and a Markdoc guide
- `specs/api.yaml` (when the folder has no specs), `.gitignore` and `README.md`

Existing files are kept unless you pass `--force`.

## Options

| Option            | Meaning                                                                           |
| :---------------- | :-------------------------------------------------------------------------------- |
| `--title <title>` | Site title, e.g. `"Acme Developer Portal"`                                        |
| `--force`, `-f`   | Overwrite existing files                                                          |
| `--yes`, `-y`     | Don't ask; use the defaults (in a terminal it asks for the title and which specs) |

`rapidoc init` in [`@rapidoc/cli`](https://www.npmjs.com/package/@rapidoc/cli) does the same in an existing project.

## License

MIT
