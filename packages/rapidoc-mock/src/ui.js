/**
 * Serves the Mock UI at `/__mock/ui`: a page with one element, `<rapidoc-mock-ui>`, whose script is built from
 * `ui/` into `dist/ui/mock-ui.js` (`npm run build` in this package; the published package has it). The page
 * reads everything it shows from the control API (control.js), so it holds no knowledge of the specs itself.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { problem } from "./auth.js";

const SCRIPT = fileURLToPath(new URL("../dist/ui/mock-ui.js", import.meta.url));

/** The page. `scriptUrl` is relative to the page's own URL, so the UI also works behind a path prefix. */
const page = (scriptUrl) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>RapiDoc Mock</title>
    <style>
      html, body { height: 100%; margin: 0; }
    </style>
    <script type="module" src="${scriptUrl}"></script>
  </head>
  <body>
    <rapidoc-mock-ui></rapidoc-mock-ui>
  </body>
</html>
`;

/**
 * @param {string[]} segments - The path after `/__mock/ui`
 * @param {boolean} trailingSlash - Whether the request path ended in `/`
 * @returns {Promise<{ status: number, headers: object, body: string }>}
 */
export async function serveUi(segments, trailingSlash) {
  if (!segments.length) {
    return {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" },
      body: page(trailingSlash ? "mock-ui.js" : "ui/mock-ui.js"),
    };
  }
  if (segments.length === 1 && segments[0] === "mock-ui.js") {
    let script;
    try {
      script = await readFile(SCRIPT, "utf8");
    } catch {
      return problem(
        404,
        "Not Found",
        "The Mock UI is not built. In the RapiDoc repository: npm run build --workspace=@rapidoc/mock.",
      );
    }
    return {
      status: 200,
      headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache" },
      body: script,
    };
  }
  return problem(404, "Not Found", `No file ${segments.join("/")} in the Mock UI.`);
}
