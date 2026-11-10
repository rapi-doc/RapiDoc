# create-rapidoc

## 0.1.5

### Patch Changes

- f823eae: New portals are ready to deploy on Node hosts: `npm start` runs `rapidoc serve`, a `render.yaml` Blueprint is included for Render, and DigitalOcean App Platform and Railway pick up the build and start scripts. `@rapidoc/cli` and `@rapidoc/server` are now dependencies (hosts that drop dev dependencies after the build can still start the portal); `@rapidoc/portal` stays a dev dependency.

## 0.1.4

No changes in this release.

## 0.1.3

No changes in this release.

## 0.1.2

### Patch Changes

- dd8998d: New projects depend on `@rapidoc/cli` and `@rapidoc/portal` of the same release as `create-rapidoc` (was a fixed `^0.1.0`), and `create-rapidoc --version` prints the real version.
