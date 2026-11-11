# rapidoc-fastapi

Serves a [RapiDoc](https://rapidocui.com) API reference from a [FastAPI](https://fastapi.tiangolo.com) or Starlette app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
pip install rapidoc-fastapi
```

```python
from fastapi import FastAPI
from rapidoc_fastapi import setup_rapidoc

app = FastAPI(docs_url=None, redoc_url=None)

setup_rapidoc(app)
```

Open `/docs`. The page reads the app's own `/openapi.json`, and nothing is loaded from another site: the package carries the RapiDoc bundle.

FastAPI serves Swagger UI at `/docs` unless you create the app with `docs_url=None`. To keep Swagger UI, give RapiDoc another path: `setup_rapidoc(app, path="/reference")`.

## Options

| Option | Default | |
| :--- | :--- | :--- |
| `path` | `/docs` | Where the reference is served, within the app |
| `spec_url` | the app's `openapi_url` | URL of the OpenAPI document. A path starting with `/` is a path of the app |
| `spec` | | The OpenAPI document itself (a dict or JSON text), written into the page |
| `title` | the app's title + "API Reference" | Page title |
| `assets` | `"bundled"` | `"bundled"`: the app serves `rapidoc-min.js`. `"cdn"`: the browser loads the same version from jsDelivr, checked against its SRI hash. `{"script_url": ..., "integrity": ...}`: a URL of your own |
| `options` | | [Attributes of `<rapi-doc>`](https://rapidocui.com/api/): `{"render_style": "focused", "allow_try": False}`. Names can be written with underscores, hyphens or in camelCase |
| `head`, `css` | | Markup and CSS added to the page as given |
| `lang` | `en` | Language of the page |
| `nonce` | | Content-Security-Policy nonce, or a function that takes the request and returns it |
| `enabled` | `True` | `False` adds nothing, for example outside development |

These are the options of every RapiDoc integration, in Python naming.

## Behind a proxy

When a proxy strips a path prefix, run the app with that prefix as its `root_path` (`uvicorn app:app --root-path /api`, or `FastAPI(root_path="/api")`). The page then uses the prefix for the bundle, the OpenAPI document and the OAuth return page, as FastAPI's own docs do.

## Starlette

`setup_rapidoc` works on any Starlette app. Starlette has no OpenAPI endpoint of its own, so pass `spec_url` or `spec`.

## Notes

- Each release ships one version of `rapidoc`: `rapidoc_fastapi.rapidoc_version()`.
- The routes are left out of the app's OpenAPI document.
- OAuth sign-in returns to `{path}/oauth-receiver.html`, which the app serves on its own origin, also with `assets="cdn"`.
- [`examples/app.py`](./examples/app.py) is a complete app.

Python 3.9 or later; Starlette 0.27 or later. MIT.
