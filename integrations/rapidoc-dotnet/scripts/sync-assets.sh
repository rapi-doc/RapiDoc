#!/usr/bin/env bash
# Copies one rapidoc release into the project: the bundle, its license file and integration.json.
#
#   scripts/sync-assets.sh                 from the monorepo's packages/rapidoc/dist
#   scripts/sync-assets.sh --from DIR      from another dist folder
#   scripts/sync-assets.sh --npm           from the npm registry, the version in RAPIDOC_VERSION
#   scripts/sync-assets.sh --npm 12.2.1    from the npm registry, another version
#
# The three files must come from the same release: integration.json carries the SRI hash of the bundle.
set -euo pipefail

project="$(cd "$(dirname "$0")/.." && pwd)"
assets="$project/src/RapiDoc.AspNetCore/assets"
files=(rapidoc-min.js rapidoc-min.js.LICENSE.txt integration.json)
source_dir="$project/../../packages/rapidoc/dist"
npm_version=""

case "${1:-}" in
  --from)
    source_dir="${2:?--from needs a folder}"
    ;;
  --npm)
    npm_version="${2:-$(tr -d '[:space:]' < "$project/RAPIDOC_VERSION")}"
    ;;
  "") ;;
  *)
    echo "usage: sync-assets.sh [--from DIR | --npm [VERSION]]" >&2
    exit 2
    ;;
esac

mkdir -p "$assets"

if [ -n "$npm_version" ]; then
  work="$(mktemp -d)"
  trap 'rm -rf "$work"' EXIT
  curl --fail --silent --show-error --location \
    "https://registry.npmjs.org/rapidoc/-/rapidoc-$npm_version.tgz" --output "$work/rapidoc.tgz"
  tar -xzf "$work/rapidoc.tgz" -C "$work"
  source_dir="$work/package/dist"
fi

for file in "${files[@]}"; do
  if [ ! -f "$source_dir/$file" ]; then
    echo "$source_dir has no $file; build rapidoc first (npm run build:rapidoc)" >&2
    exit 1
  fi
  cp "$source_dir/$file" "$assets/$file"
done

version="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$assets/integration.json" | head -1)"
echo "rapidoc $version in src/RapiDoc.AspNetCore/assets: ${files[*]}"
