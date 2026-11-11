# rapidoc (Python)

Serves a [RapiDoc](https://rapidocui.com) API reference from a [FastAPI](https://fastapi.tiangolo.com) or Starlette app: an interactive page for your OpenAPI document, with a console to try requests.

```bash
pip install rapidoc
```

```python
from fastapi import FastAPI
from rapidoc.fastapi import setup_rapidoc

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

`from rapidoc.starlette import setup_rapidoc` is the same function, for any Starlette app. Starlette has no OpenAPI endpoint of its own, so pass `spec_url` or `spec`.

## Notes

- Each release ships one version of `rapidoc`: `rapidoc.rapidoc_version()`.
- The routes are left out of the app's OpenAPI document.
- OAuth sign-in returns to `{path}/oauth-receiver.html`, which the app serves on its own origin, also with `assets="cdn"`.
- [`examples/app.py`](./examples/app.py) is a complete app.

- The package itself requires no framework; `rapidoc.fastapi` uses the Starlette that FastAPI installs. `rapidoc.contract` is the RapiDoc integration contract in plain Python, for building an integration for another framework.

Python 3.10 or later; Starlette 0.27 or later. MIT.

## Releasing (for maintainers)

Releases go to PyPI from GitHub Actions, through a trusted publisher. There is no token and nothing to upload by hand.

1. **Set the version.** Raise `version` in `pyproject.toml`. PyPI refuses a version number that already exists.
2. **Choose the bundle.** To ship a newer RapiDoc, put its npm version in `RAPIDOC_VERSION`. The wheel carries exactly that release of `rapidoc-min.js`. Leave the file alone for a release that only changes the Python code.
3. **Check locally** (optional; the workflow runs the same steps):

   ```bash
   python scripts/sync_assets.py --npm
   python -m pytest
   ```

4. **Merge to `master`.** The "Python package" workflow runs the tests on the oldest and newest supported Python.
5. **Publish.** On GitHub, open Actions, choose **Python package**, click **Run workflow**, tick **Publish the version in pyproject.toml to PyPI**, and run it on `master`. It tests, builds, checks that the wheel contains the bundle, and uploads.
6. **Verify.** `pip install rapidoc==<version>` in a clean environment, and check https://pypi.org/project/rapidoc/.

Which number to raise: a fix or a newer bundle is a patch (0.1.1); a new option or a new framework module is a minor (0.2.0). While the version is 0.x, a change that breaks existing code is also a minor, and is called out in the release notes.

The trusted publisher on PyPI is tied to the workflow file `.github/workflows/publish-python.yml` and the GitHub environment `pypi`. Renaming either stops publishing until the publisher is updated under the project's Publishing settings on PyPI.
