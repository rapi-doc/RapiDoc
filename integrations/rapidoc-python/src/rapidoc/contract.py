"""The RapiDoc integration contract, version 1, in Python.

A port of ``src/core.js`` of ``@rapidoc/embed``: how an integration turns its options into the page
that hosts ``<rapi-doc>``. Pure string functions with no framework import. The output is fixed by the
conformance fixtures of ``@rapidoc/embed`` (``conformance/fixtures``), which ``tests/test_conformance.py``
runs; change it only together with the reference implementation and a new contract version.

Option names are the contract's (``specUrl``, ``scriptUrl``), as in the fixtures. ``rapidoc.starlette.setup_rapidoc``
is the Python-style front end.
"""

from __future__ import annotations

import json
import re
from typing import Any, Mapping

CONTRACT_VERSION = 2

DEFAULT_UI_PATH = "/docs"
# The name DEFAULT_UI_PATH had in version 0.1
DEFAULT_PATH = DEFAULT_UI_PATH
DEFAULT_TITLE = "API Reference"

SCRIPT_FILE = "rapidoc-min.js"
LICENSE_FILE = "rapidoc-min.js.LICENSE.txt"
OAUTH_RECEIVER_FILE = "oauth-receiver.html"

_BASE_STYLE = "html,body{height:100%;margin:0}rapi-doc{height:100vh;width:100%}"
_HTML_TYPE = "text/html; charset=utf-8"
_ATTRIBUTE_NAME = re.compile(r"^[a-z][a-z0-9-]*$")


def escape_html(value: Any) -> str:
    """Escapes text for HTML content and double-quoted attribute values."""
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def inline_json(spec: Any) -> str:
    """Compact JSON, keys in input order, that cannot end the <script> element it is written into."""
    if isinstance(spec, str):
        spec = json.loads(spec)
    text = json.dumps(spec, separators=(",", ":"), ensure_ascii=False)
    return (
        text.replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def normalize_path(path: str | None = DEFAULT_UI_PATH) -> str:
    """The page's public URL path without a trailing slash; the site root is the empty string."""
    trimmed = (DEFAULT_UI_PATH if path is None else str(path)).strip().rstrip("/")
    if trimmed == "":
        return ""
    return trimmed if trimmed.startswith("/") else f"/{trimmed}"


def attribute_name(key: str) -> str:
    """``allowTry`` → ``allow-try``; names already in kebab-case pass through."""
    name = re.sub(r"[A-Z]", lambda match: f"-{match.group(0).lower()}", str(key))
    if not _ATTRIBUTE_NAME.match(name):
        raise ValueError(f'rapidoc: "{key}" is not a valid attribute name')
    return name


def _attribute_value(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    if isinstance(value, (dict, list)):
        return json.dumps(value, separators=(",", ":"), ensure_ascii=False)
    return str(value)


def ui_path_of(options: Mapping[str, Any] | None = None) -> str:
    """The URL path the page is served at: ``uiPath``, or ``path``, its name in contract version 1."""
    options = options or {}
    for key in ("uiPath", "path"):
        if options.get(key) is not None:
            return options[key]
    return DEFAULT_UI_PATH


def embed_urls(options: Mapping[str, Any] | None = None) -> dict[str, Any]:
    """Where the page, the bundle and the OAuth return page are, and how the bundle is loaded."""
    options = options or {}
    path = normalize_path(ui_path_of(options))
    assets = options.get("assets") or "bundled"
    urls: dict[str, Any] = {
        "page": path or "/",
        "script": f"{path}/{SCRIPT_FILE}",
        "integrity": None,
        "oauthReceiver": f"{path}/{OAUTH_RECEIVER_FILE}",
    }
    if assets == "cdn":
        manifest = options.get("manifest") or {}
        if not manifest.get("cdn") or SCRIPT_FILE not in (manifest.get("files") or {}):
            raise ValueError('rapidoc: assets "cdn" needs the integration manifest of rapidoc')
        urls["script"] = f"{manifest['cdn']}{SCRIPT_FILE}"
        urls["integrity"] = manifest["files"][SCRIPT_FILE]["integrity"]
    elif isinstance(assets, Mapping):
        if not assets.get("scriptUrl"):
            raise ValueError("rapidoc: assets.scriptUrl is required")
        urls["script"] = str(assets["scriptUrl"])
        urls["integrity"] = assets.get("integrity") or None
    elif assets != "bundled":
        raise ValueError('rapidoc: assets must be "bundled", "cdn" or { scriptUrl }')
    return urls


def to_attributes(options: Mapping[str, Any] | None = None) -> list[tuple[str, str]]:
    """The attributes of <rapi-doc> as (name, value) pairs, sorted by name.

    ``spec-url`` and ``oauth-receiver`` come from the embed options; ``options["options"]`` adds to them
    and wins. ``None`` leaves an attribute out.
    """
    options = options or {}
    attributes: dict[str, Any] = {}
    if options.get("specUrl"):
        attributes["spec-url"] = options["specUrl"]
    attributes["oauth-receiver"] = embed_urls(options)["oauthReceiver"]
    for key, value in (options.get("options") or {}).items():
        attributes[attribute_name(key)] = value
    return sorted(
        (name, _attribute_value(value)) for name, value in attributes.items() if value is not None
    )


def _script_tag(urls: Mapping[str, Any], nonce: str | None) -> str:
    tag = f'<script type="module" src="{escape_html(urls["script"])}"'
    if urls.get("integrity"):
        tag += f' integrity="{escape_html(urls["integrity"])}" crossorigin="anonymous"'
    if nonce:
        tag += f' nonce="{escape_html(nonce)}"'
    return f"{tag}></script>"


def _style_text(css: str) -> str:
    return re.sub(r"</(style)", r"<\\/\1", str(css), flags=re.IGNORECASE)


def render_host_page(options: Mapping[str, Any] | None = None) -> str:
    """The HTML page that hosts <rapi-doc>. ``head`` and ``css`` are written as given."""
    options = options or {}
    urls = embed_urls(options)
    nonce = options.get("nonce")
    nonce_attribute = f' nonce="{escape_html(nonce)}"' if nonce else ""
    lang = options.get("lang") or "en"
    title = options.get("title")
    lines = [
        "<!doctype html>",
        f'<html lang="{escape_html(lang)}">',
        "  <head>",
        '    <meta charset="utf-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1">',
        f"    <title>{escape_html(DEFAULT_TITLE if title is None else title)}</title>",
        f"    <style{nonce_attribute}>{_BASE_STYLE}</style>",
    ]
    if options.get("css"):
        lines.append(f"    <style{nonce_attribute}>{_style_text(options['css'])}</style>")
    lines.append(f"    {_script_tag(urls, nonce)}")
    if options.get("head"):
        lines.append(f"    {options['head']}")
    lines += ["  </head>", "  <body>"]

    attributes = to_attributes(options)
    has_spec = options.get("spec") is not None
    if not attributes:
        lines.append("    <rapi-doc>" if has_spec else "    <rapi-doc></rapi-doc>")
    else:
        lines.append("    <rapi-doc")
        lines += [f'      {name}="{escape_html(value)}"' for name, value in attributes]
        lines.append("    >" if has_spec else "    ></rapi-doc>")
    if has_spec:
        lines.append(
            '      <script type="application/json" slot="rapidoc-spec">'
            f"{inline_json(options['spec'])}</script>"
        )
        lines.append("    </rapi-doc>")
    lines += ["  </body>", "</html>", ""]
    return "\n".join(lines)


def render_oauth_receiver_page(options: Mapping[str, Any] | None = None) -> str:
    """The page the OAuth provider sends the sign-in popup back to; same origin as the host page."""
    options = options or {}
    lang = options.get("lang") or "en"
    return "\n".join(
        [
            "<!doctype html>",
            f'<html lang="{escape_html(lang)}">',
            "  <head>",
            '    <meta charset="utf-8">',
            "    <title>OAuth sign-in</title>",
            f"    {_script_tag(embed_urls(options), options.get('nonce'))}",
            "  </head>",
            "  <body>",
            "    <oauth-receiver></oauth-receiver>",
            "  </body>",
            "</html>",
            "",
        ]
    )


def embed_routes(options: Mapping[str, Any] | None = None) -> list[dict[str, str]]:
    """The routes an integration serves: the two pages, and the bundle's files when assets are bundled."""
    options = options or {}
    path = normalize_path(ui_path_of(options))
    urls = embed_urls(options)
    routes = [
        {"path": urls["page"], "kind": "page", "contentType": _HTML_TYPE},
        {"path": urls["oauthReceiver"], "kind": "oauth-receiver", "contentType": _HTML_TYPE},
    ]
    if (options.get("assets") or "bundled") == "bundled":
        routes += [
            {
                "path": urls["script"],
                "kind": "file",
                "file": SCRIPT_FILE,
                "contentType": "text/javascript; charset=utf-8",
            },
            {
                "path": f"{path}/{LICENSE_FILE}",
                "kind": "file",
                "file": LICENSE_FILE,
                "contentType": "text/plain; charset=utf-8",
            },
        ]
    return routes
