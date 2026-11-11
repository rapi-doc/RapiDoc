import pytest
from fastapi import FastAPI
from starlette.applications import Starlette
from starlette.testclient import TestClient

from rapidoc_fastapi import contract, rapidoc_manifest, rapidoc_version, setup_rapidoc


def make_app(**kwargs):
    app = FastAPI(title="Pets", docs_url=None, redoc_url=None)

    @app.get("/pets")
    def pets():
        return []

    setup_rapidoc(app, **kwargs)
    return app


def test_serves_the_contracts_host_page_reading_the_apps_openapi_document():
    client = TestClient(make_app(options={"render_style": "focused"}))
    response = client.get("/docs")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/html; charset=utf-8"
    assert response.text == contract.render_host_page(
        {
            "specUrl": "/openapi.json",
            "title": "Pets - API Reference",
            "options": {"render-style": "focused"},
        }
    )
    assert client.get("/openapi.json").json()["paths"]["/pets"]


def test_keeps_its_routes_out_of_the_openapi_document():
    paths = TestClient(make_app()).get("/openapi.json").json()["paths"]
    assert list(paths) == ["/pets"]


def test_serves_the_oauth_return_page_the_bundle_and_its_license():
    client = TestClient(make_app())
    assert client.get("/docs/oauth-receiver.html").text == contract.render_oauth_receiver_page()

    bundle = client.get("/docs/rapidoc-min.js")
    assert bundle.status_code == 200
    assert bundle.headers["content-type"] == "text/javascript; charset=utf-8"
    assert len(bundle.content) == rapidoc_manifest()["files"]["rapidoc-min.js"]["bytes"]

    license_file = client.get("/docs/rapidoc-min.js.LICENSE.txt")
    assert license_file.text.startswith("Third-party software bundled in rapidoc-min.js")


def test_answers_304_when_the_browser_already_has_the_bundle():
    client = TestClient(make_app())
    etag = client.get("/docs/rapidoc-min.js").headers["etag"]
    assert rapidoc_manifest()["files"]["rapidoc-min.js"]["integrity"] in etag
    again = client.get("/docs/rapidoc-min.js", headers={"if-none-match": etag})
    assert again.status_code == 304
    assert again.content == b""


def test_refuses_the_path_swagger_ui_already_has():
    with pytest.raises(RuntimeError, match=r"docs_url=None"):
        setup_rapidoc(FastAPI())
    app = FastAPI()
    setup_rapidoc(app, path="/reference")
    assert TestClient(app).get("/reference").status_code == 200
    assert "swagger" in TestClient(app).get("/docs").text.lower(), "Swagger UI is left alone"


def test_serves_nothing_when_disabled():
    assert TestClient(make_app(enabled=False)).get("/docs").status_code == 404


def test_puts_the_proxy_prefix_into_the_page():
    client = TestClient(make_app(), root_path="/gateway")
    page = client.get("/docs").text
    assert 'src="/gateway/docs/rapidoc-min.js"' in page
    assert 'spec-url="/gateway/openapi.json"' in page
    assert 'oauth-receiver="/gateway/docs/oauth-receiver.html"' in page


def test_takes_python_style_option_names_and_the_contracts():
    page = TestClient(
        make_app(options={"allow_try": False, "schemaExpandLevel": 2, "heading-text": "Pets"})
    ).get("/docs").text
    assert 'allow-try="false"' in page
    assert 'schema-expand-level="2"' in page
    assert 'heading-text="Pets"' in page


def test_loads_the_pinned_version_from_the_cdn_when_asked():
    client = TestClient(make_app(assets="cdn"))
    page = client.get("/docs").text
    assert f"https://cdn.jsdelivr.net/npm/rapidoc@{rapidoc_version()}/dist/rapidoc-min.js" in page
    assert rapidoc_manifest()["files"]["rapidoc-min.js"]["integrity"] in page
    assert client.get("/docs/rapidoc-min.js").status_code == 404
    assert client.get("/docs/oauth-receiver.html").status_code == 200, "same origin"


def test_takes_a_script_url_an_inline_spec_and_a_nonce_from_the_request():
    spec = {"openapi": "3.1.0", "info": {"title": "Inline", "version": "1"}, "paths": {}}
    client = TestClient(
        make_app(
            assets={"script_url": "/static/rapidoc-min.js"},
            spec=spec,
            nonce=lambda request: request.headers.get("x-nonce"),
        )
    )
    page = client.get("/docs", headers={"x-nonce": "abc"}).text
    assert '<script type="module" src="/static/rapidoc-min.js" nonce="abc"></script>' in page
    assert '"title":"Inline"' in page
    assert "spec-url" not in page, "an inline spec needs no URL"


def test_works_on_a_starlette_app():
    app = Starlette()
    setup_rapidoc(app, spec_url="https://example.com/openapi.yaml", title="Reference")
    page = TestClient(app).get("/docs").text
    assert 'spec-url="https://example.com/openapi.yaml"' in page
    assert "<title>Reference</title>" in page
