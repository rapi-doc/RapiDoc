"""RapiDoc for Python web frameworks.

    from fastapi import FastAPI
    from rapidoc.fastapi import setup_rapidoc

    app = FastAPI(docs_url=None, redoc_url=None)
    setup_rapidoc(app)          # the reference at /docs, reading the app's /openapi.json

``rapidoc.contract`` is the RapiDoc integration contract in Python (a port of ``@rapidoc/embed``): the page,
the routes and the attributes. A framework module (``rapidoc.fastapi``, ``rapidoc.starlette``) only maps
them to that framework's routes. This module imports no framework.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from . import contract

__all__ = ["rapidoc_version", "rapidoc_manifest", "contract", "ASSETS"]

#: One rapidoc release: the bundle, its license file and integration.json
ASSETS = Path(__file__).parent / "assets"


def rapidoc_manifest() -> dict[str, Any]:
    """``integration.json`` of the rapidoc release this package ships: version, files, SRI hashes."""
    file = ASSETS / "integration.json"
    if not file.exists():
        raise RuntimeError(
            "rapidoc: the rapidoc bundle is missing from this installation "
            "(in a source checkout, run scripts/sync_assets.py)"
        )
    return json.loads(file.read_text(encoding="utf-8"))


def rapidoc_version() -> str:
    """The version of rapidoc this package serves."""
    return rapidoc_manifest()["version"]
