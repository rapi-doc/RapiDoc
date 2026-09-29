# RapiDoc Automated Visual Regression Tests

This test suite automates visual layout verifications for RapiDoc using Playwright.

## Scope of Visual Tests
The visual regression tests capture screenshots and compare them against baselines for:
1. **Public Showcase Examples:** URLs from `docs/src/data/example-list.yaml` (e.g. `/examples/code-highlight.html`, `/examples/petstore.html`).
2. **Internal Edge-Case Tests:** URLs from `docs/src/data/tests.yaml` (e.g. `/tests/circular-refs.html`, `/tests/swagger-v2.html`).

## Running Visual Tests
```bash
# Install Playwright browser binaries
npx playwright install --with-deps chromium

# Run visual regression test suite
npm run test:visual
```
