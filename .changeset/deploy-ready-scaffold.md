---
"create-rapidoc": patch
---

New portals are ready to deploy on Node hosts: `npm start` runs `rapidoc serve`, a `render.yaml` Blueprint is included for Render, and DigitalOcean App Platform and Railway pick up the build and start scripts. `@rapidoc/cli` and `@rapidoc/server` are now dependencies (hosts that drop dev dependencies after the build can still start the portal); `@rapidoc/portal` stays a dev dependency.
