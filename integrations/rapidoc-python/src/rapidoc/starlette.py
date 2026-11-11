"""RapiDoc for Starlette apps, FastAPI included (``rapidoc.fastapi`` re-exports this).

Maps the routes and pages of ``rapidoc.contract`` to Starlette routes, and takes the app's own settings
as defaults: its ``openapi_url``, its title and, per request, its ``root_path``.
"""

from __future__ import annotations

from typing import Any, Callable, Mapping, Union

from starlette.requests import Request
from starlette.responses import HTMLResponse, Response

from . import ASSETS, contract, rapidoc_manifest

__all__ = ["setup_rapidoc"]

Nonce = Union[str, Callable[[Request], Union[str, None]], None]


def _attributes(options: Mapping[str, Any] | None) -> dict[str, Any]:
    """Python-style names are accepted too: ``render_style`` is ``render-style``."""
    return {str(key).replace("_", "-"): value for key, value in (options or {}).items()}


def _assets(assets: Any) -> Any:
    if isinstance(assets, Mapping):
        return {
            "scriptUrl": assets.get("script_url", assets.get("scriptUrl")),
            "integrity": assets.get("integrity"),
        }
    return assets


def setup_rapidoc(
    app: Any,
    *,
    ui_path: str | None = None,
    spec_url: str | None = None,
    spec: Any = None,
    title: str | None = None,
    assets: Any = "bundled",
    options: Mapping[str, Any] | None = None,
    head: str | None = None,
    css: str | None = None,
    lang: str = "en",
    nonce: Nonce = None,
    enabled: bool = True,
    path: str | None = None,
) -> None:
    """Adds an API reference to a FastAPI or Starlette app.

    :param ui_path: the URL path the reference page is served at, within the app. Default ``/docs``.
    :param spec_url: URL of the OpenAPI document. Default: the app's ``openapi_url``. A path starting
        with ``/`` is taken as a path of the app, so the app's ``root_path`` is put in front of it.
    :param spec: the OpenAPI document itself (a dict or JSON text), written into the page.
    :param title: page title. Default: the app's title, followed by "API Reference".
    :param assets: ``"bundled"`` (the app serves ``rapidoc-min.js``), ``"cdn"`` (the browser loads the
        same version from jsDelivr, checked against its SRI hash) or ``{"script_url": ..., "integrity": ...}``.
    :param options: attributes of ``<rapi-doc>``: ``{"render_style": "focused", "allow_try": False}``.
    :param head: HTML added to the end of ``<head>``, as given.
    :param css: CSS added in a ``<style>`` element, as given.
    :param lang: language of the page.
    :param nonce: Content-Security-Policy nonce, or a function that reads it from the request.
    :param enabled: ``False`` adds nothing, for example outside development.
    :param path: deprecated, the name ``ui_path`` had in version 0.1.
    """
    if not enabled:
        return
    if ui_path is None:
        ui_path = contract.DEFAULT_UI_PATH if path is None else path

    manifest = rapidoc_manifest()
    base = {
        "uiPath": ui_path,
        "assets": _assets(assets),
        "manifest": manifest,
        "spec": spec,
        "options": _attributes(options),
        "head": head,
        "css": css,
        "lang": lang,
    }
    routes = contract.embed_routes(base)

    taken = {getattr(route, "path", None) for route in getattr(app, "routes", [])}
    clash = next((route["path"] for route in routes if route["path"] in taken), None)
    if clash:
        raise RuntimeError(
            f"rapidoc: the app already has a route at {clash}. FastAPI serves Swagger UI at "
            "/docs unless created with FastAPI(docs_url=None); or pass another ui_path to setup_rapidoc()."
        )

    if spec_url is None and spec is None:
        spec_url = getattr(app, "openapi_url", None)
    if title is None:
        app_title = getattr(app, "title", None)
        title = f"{app_title} - {contract.DEFAULT_TITLE}" if app_title else contract.DEFAULT_TITLE

    def page_options(request: Request) -> dict[str, Any]:
        # Behind a proxy that strips a prefix, the server passes that prefix as root_path
        root_path = request.scope.get("root_path", "").rstrip("/")
        url = spec_url
        if url and url.startswith("/") and not url.startswith("//"):
            url = f"{root_path}{url}"
        return {
            **base,
            "uiPath": f"{root_path}{contract.normalize_path(ui_path)}",
            "specUrl": url,
            "title": title,
            "nonce": nonce(request) if callable(nonce) else nonce,
        }

    files: dict[str, bytes] = {}

    def endpoint(route: Mapping[str, str]) -> Callable[[Request], Response]:
        if route["kind"] == "file":
            name = route["file"]
            etag = f'"{manifest["files"].get(name, {}).get("integrity", name)}"'

            async def serve_file(request: Request) -> Response:
                headers = {"etag": etag, "cache-control": "public, max-age=3600"}
                if request.headers.get("if-none-match") == etag:
                    return Response(status_code=304, headers=headers)
                if name not in files:
                    files[name] = (ASSETS / name).read_bytes()
                return Response(files[name], media_type=route["contentType"], headers=headers)

            return serve_file

        render = (
            contract.render_host_page
            if route["kind"] == "page"
            else contract.render_oauth_receiver_page
        )

        async def serve_page(request: Request) -> Response:
            return HTMLResponse(render(page_options(request)), headers={"cache-control": "no-cache"})

        return serve_page

    for route in routes:
        app.add_route(
            route["path"], endpoint(route), methods=["GET", "HEAD"], include_in_schema=False
        )
