// The setup snippets the site's own pages show (pages/*.astro), from one place, so every page loads RapiDoc
// the same way and points at the same sample spec. They match the quickstarts: RapiDoc's
// (docs/rapidoc/get-started/quickstart.mdx) and RapiFlow's (sites/rapi-flow/docs/quickstart.mdx), which keep
// their own copies; change those with these. Example and test pages keep the specs they demonstrate.

/** The browser bundle of `<rapi-doc>` and `<rapi-doc-mini>`, from unpkg; the quickstart explains pinning a version */
export const RAPIDOC_SCRIPT_URL = "https://unpkg.com/rapidoc/dist/rapidoc-min.js";
/** The separate bundle of `<rapi-flow>` */
export const RAPIFLOW_SCRIPT_URL = "https://unpkg.com/rapidoc/dist/rapidoc-flow-min.js";

/** The sample spec: OpenAPI 3.1, Try against petstore3.swagger.io, served with CORS open */
export const SAMPLE_SPEC_URL = "https://rapidocui.com/specs/petstore.yaml";
/** Its Arazzo workflows, next to it so their `./petstore.yaml` source resolves */
export const SAMPLE_ARAZZO_URL = "https://rapidocui.com/specs/petstore.arazzo.yaml";

export const RAPIDOC_SCRIPT_TAG = `<script type="module" src="${RAPIDOC_SCRIPT_URL}"></script>`;
export const RAPIFLOW_SCRIPT_TAG = `<script type="module" src="${RAPIFLOW_SCRIPT_URL}"></script>`;

/** The shortest working setup: the script tag and the element */
export const RAPIDOC_SNIPPET = `${RAPIDOC_SCRIPT_TAG}

<rapi-doc spec-url="${SAMPLE_SPEC_URL}"></rapi-doc>`;

/** The RapiDoc quickstart's HTML file */
export const RAPIDOC_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    ${RAPIDOC_SCRIPT_TAG}
    <style>
      body { margin: 0; }
      rapi-doc { height: 100vh; }
    </style>
  </head>
  <body>
    <rapi-doc spec-url="${SAMPLE_SPEC_URL}"></rapi-doc>
  </body>
</html>`;

/** RapiFlow paired with a mocking `<rapi-doc>`, as in RapiFlow's quickstart */
export const RAPIFLOW_SNIPPET = `${RAPIDOC_SCRIPT_TAG}
<!-- A separate bundle: pages without workflows don't load it -->
${RAPIFLOW_SCRIPT_TAG}

<rapi-flow
  arazzo-url="${SAMPLE_ARAZZO_URL}"
  workflow-id="adoptPet"
  for="petstore"
></rapi-flow>

<!-- The workflow borrows this element's OpenAPI spec, server, credentials and mock -->
<rapi-doc id="petstore" spec-url="${SAMPLE_SPEC_URL}" mock-server="true"></rapi-doc>`;
