"""RapiDoc for FastAPI: ``from rapidoc.fastapi import setup_rapidoc``.

FastAPI apps are Starlette apps, so this is ``rapidoc.starlette.setup_rapidoc``. It reads the app's
``openapi_url`` and title, and refuses ``/docs`` while FastAPI's Swagger UI still has it.
"""

from .starlette import setup_rapidoc

__all__ = ["setup_rapidoc"]
