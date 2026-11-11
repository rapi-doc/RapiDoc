#!/usr/bin/env python3
"""Copies one rapidoc release into the package: the bundle, its license file and integration.json.

    python scripts/sync_assets.py                 # from the monorepo's packages/rapidoc/dist
    python scripts/sync_assets.py --from DIR      # from another dist folder
    python scripts/sync_assets.py --npm           # from the npm registry, the version in RAPIDOC_VERSION
    python scripts/sync_assets.py --npm 12.2.0    # from the npm registry, another version

The three files must come from the same release: integration.json carries the SRI hash of the bundle.
"""

from __future__ import annotations

import argparse
import io
import json
import shutil
import tarfile
import urllib.request
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
ASSETS = PROJECT / "src/rapidoc/assets"
FILES = ["rapidoc-min.js", "rapidoc-min.js.LICENSE.txt", "integration.json"]


def from_directory(source: Path) -> None:
    missing = [name for name in FILES if not (source / name).exists()]
    if missing:
        raise SystemExit(f"{source} has no {', '.join(missing)}; build rapidoc first (npm run build:rapidoc)")
    for name in FILES:
        shutil.copyfile(source / name, ASSETS / name)


def from_npm(version: str) -> None:
    url = f"https://registry.npmjs.org/rapidoc/-/rapidoc-{version}.tgz"
    with urllib.request.urlopen(url) as response:  # noqa: S310 (a fixed https registry URL)
        archive = tarfile.open(fileobj=io.BytesIO(response.read()), mode="r:gz")
    for name in FILES:
        member = archive.extractfile(f"package/dist/{name}")
        if member is None:
            raise SystemExit(f"rapidoc {version} has no dist/{name}")
        (ASSETS / name).write_bytes(member.read())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--from", dest="source", type=Path, default=PROJECT.parents[1] / "packages/rapidoc/dist")
    parser.add_argument(
        "--npm",
        metavar="VERSION",
        nargs="?",
        const=(PROJECT / "RAPIDOC_VERSION").read_text(encoding="utf-8").strip(),
        help="download this rapidoc release from npm (default: the version in RAPIDOC_VERSION)",
    )
    args = parser.parse_args()
    ASSETS.mkdir(parents=True, exist_ok=True)
    if args.npm:
        from_npm(args.npm)
    else:
        from_directory(args.source)
    version = json.loads((ASSETS / "integration.json").read_text(encoding="utf-8"))["version"]
    print(f"rapidoc {version} in {ASSETS.relative_to(PROJECT)}:", ", ".join(FILES))


if __name__ == "__main__":
    main()
