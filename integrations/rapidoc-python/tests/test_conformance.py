"""Runs the conformance fixtures of @rapidoc/embed against the Python port of the contract."""

import json
import os
from pathlib import Path

import pytest

from rapidoc import contract

# In the monorepo the fixtures are next door; in a repository of its own, point this at a copy of
# node_modules/@rapidoc/embed/conformance/fixtures.
FIXTURES = Path(
    os.environ.get(
        "RAPIDOC_CONFORMANCE_DIR",
        Path(__file__).resolve().parents[3] / "packages/rapidoc-embed/conformance/fixtures",
    )
)

CASES = sorted(path.name for path in FIXTURES.iterdir() if (path / "input.json").exists())


SPEC_OPEN = '<script type="application/json" slot="rapidoc-spec">'
SPEC_CLOSE = "</script>"
UNSAFE_IN_SCRIPT = ("<", ">", "&", chr(0x2028), chr(0x2029), "\n")


def split_page(html):
    """The page without its inline spec, and the inline spec's text (None when there is none)."""
    start = html.find(SPEC_OPEN)
    if start == -1:
        return html, None
    begin = start + len(SPEC_OPEN)
    end = html.index(SPEC_CLOSE, begin)
    return html[:begin] + html[end:], html[begin:end]


def assert_same_page(actual, expected):
    """The contract's comparison: byte for byte, except the inline spec, which is compared as parsed JSON."""
    actual_page, actual_spec = split_page(actual)
    expected_page, expected_spec = split_page(expected)
    assert actual_page == expected_page
    if expected_spec is None:
        return
    assert not any(char in actual_spec for char in UNSAFE_IN_SCRIPT)
    assert json.loads(actual_spec) == json.loads(expected_spec)


def test_fixtures_found():
    assert len(CASES) >= 24, f"no conformance fixtures in {FIXTURES}"


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
    assert_same_page(render(options), expected)


def test_compares_a_page_byte_for_byte_except_the_inline_spec():
    def page(spec, title="T"):
        return f"<title>{title}</title>\n      {SPEC_OPEN}{spec}{SPEC_CLOSE}\n    </rapi-doc>\n"

    assert_same_page(page('{"b":1,"a":2.0}'), page('{"a":2,"b":1}'))
    for actual, expected in (
        (page('{"a":3,"b":1}'), page('{"a":2,"b":1}')),
        (page("{}", "T "), page("{}")),
        (page('{"a":"<"}'), page('{"a":"x"}')),
    ):
        with pytest.raises(AssertionError):
            assert_same_page(actual, expected)


def test_rejects_an_attribute_name_that_ends_in_a_newline():
    for name in ("x\n", "a b", "1abc", "", 'x" onload="alert(1)'):
        with pytest.raises(ValueError):
            contract.attribute_name(name)
    assert contract.attribute_name("allowTry") == "allow-try"


def test_inline_json_cannot_end_its_script_element():
    spec = {"info": {"title": "</script><b>&", "note": "a" + chr(0x2028) + "b" + chr(0x2029), "name": "Zoë"}}
    text = contract.inline_json(spec)
    assert "<" not in text and ">" not in text and "&" not in text
    assert chr(0x2028) not in text and chr(0x2029) not in text
    assert "Zoë" in text, "other non-ASCII characters are written as they are"
    assert json.loads(text) == spec
