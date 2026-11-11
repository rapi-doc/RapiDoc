"""uvicorn examples.app:app --port 4403  →  http://localhost:4403/docs"""

from fastapi import FastAPI

from rapidoc_fastapi import setup_rapidoc

app = FastAPI(title="FastAPI example", version="1.0.0", docs_url=None, redoc_url=None)


@app.get("/hello", tags=["Greetings"], summary="Say hello")
def hello(name: str = "world") -> dict[str, str]:
    return {"message": f"Hello, {name}!"}


setup_rapidoc(app, options={"render_style": "focused", "color_scheme": "light", "show_header": False})
