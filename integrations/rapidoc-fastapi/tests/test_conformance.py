"""Runs the conformance fixtures of @rapidoc/embed against the Python port of the contract."""

import json
import os
from pathlib import Path

import pytest

from rapidoc_fastapi import contract

# In the monorepo the fixtures are next door; in a repository of its own, point this at a copy of
# node_modules/@rapidoc/embed/conformance/fixtures.
FIXTURES = Path(
    os.environ.get(
        "RAPIDOC_CONFORMANCE_DIR",
        Path(__file__).resolve().parents[3] / "packages/rapidoc-embed/conformance/fixtures",
    )
)

CASES = sorted(path.name for path in FIXTURES.iterdir() if (path / "input.json").exists())


def test_fixtures_found():
    assert len(CASES) >= 15, f"no conformance fixtures in {FIXTURES}"


@pytest.mark.parametrize("name", CASES)
def test_fixture(name):
    case = json.loads((FIXTURES / name / "input.json").read_text(encoding="utf-8"))
    options = case["options"]
    if case["page"] == "routes":
        expected = json.loads((FIXTURES / name / "expected.json").read_text(encoding="utf-8"))
        assert contract.embed_routes(options) == expected
        return
    render = contract.render_host_page if case["page"] == "host" else contract.render_oauth_receiver_page
    expected = (FIXTURES / name / "expected.html").read_text(encoding="utf-8")
    assert render(options) == expected


def test_inline_json_cannot_end_its_script_element():
    spec = {"info": {"title": "</script><b>&", "note": "a" + chr(0x2028) + "b" + chr(0x2029), "name": "Zoë"}}
    text = contract.inline_json(spec)
    assert "<" not in text and ">" not in text and "&" not in text
    assert chr(0x2028) not in text and chr(0x2029) not in text
    assert "Zoë" in text, "other non-ASCII characters are written as they are"
    assert json.loads(text) == spec
