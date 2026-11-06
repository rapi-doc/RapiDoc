import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ProblemError, UsageError } from "../lib/errors.js";
import { openBrowser } from "../lib/open.js";
import { icon, info } from "../lib/output.js";
import { startOnFreePort } from "../lib/ports.js";

/*
 * rapidoc preview <spec>: one spec in <rapi-doc>, no portal and no config. A small HTTP server sends
 *   /                  the page: a full-screen <rapi-doc> and a script that reloads the spec on change
 *   /rapidoc-min.js    the browser bundle of the `rapidoc` package (and its .LICENSE.txt)
 *   /spec/<path>       files of the spec's folder (so relative $refs resolve), never cached
 *   /events            server-sent events: "reload" when a file in that folder changes
 * A spec given as a URL is loaded from there, without reloading.
 */

const TYPES = {
  ".yaml": "application/yaml",
  ".yml": "application/yaml",
  ".json": "application/json",
  ".js": "text/javascript",
  ".txt": "text/plain",
};
const isUrl = (target) => /^https?:\/\//i.test(target);
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const encodePath = (relative) => relative.split(path.sep).map(encodeURIComponent).join("/");

/** The `rapidoc` package's dist/rapidoc-min.js. */
function rapidocBundle() {
  let bundle;
  try {
    bundle = fileURLToPath(import.meta.resolve("rapidoc"));
  } catch {
    throw new ProblemError(
      "`rapidoc preview` needs the rapidoc package:\n   npm install -D rapidoc",
    );
  }
  if (!fs.existsSync(bundle))
    throw new ProblemError(`${bundle} is missing; build it with \`npm run build:rapidoc\`.`);
  return bundle;
}

function page({ title, specUrl, theme, live }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · RapiDoc preview</title>
<style>html, body { margin: 0; height: 100%; } rapi-doc { width: 100%; height: 100%; }</style>
<script type="module" src="/rapidoc-min.js"></script>
</head>
<body>
<rapi-doc spec-url="${escapeHtml(specUrl)}" show-header="false" color-scheme="auto"${theme ? ` theme="${escapeHtml(theme)}"` : ""}></rapi-doc>
${
  live
    ? `<script>
  // Reload the spec when a file changes (rapidoc preview watches the spec's folder).
  const doc = document.querySelector("rapi-doc");
  const specUrl = ${JSON.stringify(specUrl)};
  new EventSource("/events").onmessage = () =>
    doc.setAttribute("spec-url", specUrl + "?v=" + Date.now());
</script>`
    : ""
}
</body>
</html>
`;
}

export default {
  name: "preview",
  usage: "preview <spec>",
  summary: "Shows one OpenAPI spec in <rapi-doc>, reloading on save (no portal needed)",
  description:
    "Serves the spec (a file or URL) in a page with <rapi-doc>, on localhost. Relative $refs to other\nfiles in the spec's folder work; when any file there changes, the page reloads the spec.",
  positionals: { name: "spec", max: 1 },
  options: {
    port: {
      type: "string",
      kind: "port",
      value: "number",
      default: 4000,
      description: "Port to listen on",
    },
    host: {
      type: "string",
      value: "host",
      default: "localhost",
      description: "Address to listen on (0.0.0.0 shares the spec's folder with your network)",
    },
    open: { type: "boolean", description: "Open the preview in the browser" },
    theme: {
      type: "string",
      value: "name",
      description: "<rapi-doc> theme (for example ember, cobalt, mono)",
    },
  },
  examples: [
    "rapidoc preview openapi.yaml",
    "rapidoc preview specs/orders.yaml --open --port 4100",
    "rapidoc preview https://example.com/openapi.json",
  ],

  async run({ values, positionals }) {
    const target = positionals[0];
    if (!target)
      throw new UsageError("rapidoc preview needs a spec: rapidoc preview <spec>", {
        command: "preview",
      });
    const bundle = rapidocBundle();

    let specUrl;
    let folder;
    let title;
    if (isUrl(target)) {
      specUrl = target;
      title = new URL(target).pathname.split("/").pop() || target;
    } else {
      const fullPath = path.resolve(target);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile())
        throw new ProblemError(`File not found: ${fullPath}`);
      folder = path.dirname(fullPath);
      title = path.basename(fullPath);
      specUrl = `/spec/${encodePath(path.basename(fullPath))}`;
    }

    const html = page({ title, specUrl, theme: values.theme, live: Boolean(folder) });
    const listeners = new Set();
    const send = (res, status, type, body) => {
      res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
      res.end(body);
    };

    const handler = (req, res) => {
      const url = new URL(req.url, "http://preview");
      if (url.pathname === "/") return send(res, 200, "text/html; charset=utf-8", html);
      if (url.pathname === "/rapidoc-min.js" || url.pathname === "/rapidoc-min.js.LICENSE.txt") {
        const file = url.pathname.endsWith(".txt") ? `${bundle}.LICENSE.txt` : bundle;
        if (!fs.existsSync(file)) return send(res, 404, "text/plain", "Not found");
        return send(res, 200, TYPES[path.extname(file)], fs.readFileSync(file));
      }
      if (url.pathname === "/events" && folder) {
        res.writeHead(200, {
          "content-type": "text/event-stream",
          "cache-control": "no-store",
          connection: "keep-alive",
        });
        res.write(": connected\n\n");
        listeners.add(res);
        req.on("close", () => listeners.delete(res));
        return undefined;
      }
      if (url.pathname.startsWith("/spec/") && folder) {
        const file = path.resolve(folder, decodeURIComponent(url.pathname.slice("/spec/".length)));
        // Only files inside the spec's folder.
        if (
          !file.startsWith(folder + path.sep) ||
          !fs.existsSync(file) ||
          !fs.statSync(file).isFile()
        )
          return send(res, 404, "text/plain", "Not found");
        return send(
          res,
          200,
          TYPES[path.extname(file)] ?? "application/octet-stream",
          fs.readFileSync(file),
        );
      }
      return send(res, 404, "text/plain", "Not found");
    };

    const server = await startOnFreePort(
      (port) =>
        new Promise((resolve, reject) => {
          const candidate = http.createServer(handler);
          candidate.once("error", reject);
          candidate.listen(port, values.host, () => resolve(candidate));
        }),
      values.port,
      { host: values.host },
    );
    const { port } = server.address();
    const shownHost = ["0.0.0.0", "::"].includes(values.host) ? "localhost" : values.host;
    const pageUrl = `http://${shownHost}:${port}/`;

    let watcher;
    if (folder) {
      let timer;
      watcher = fs.watch(folder, { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          for (const res of listeners) res.write("data: reload\n\n");
        }, 100);
      });
    }

    info(`\n${icon("👀")}Previewing ${title}`);
    info(`   • URL:      ${pageUrl}`);
    info(
      folder
        ? `   • Reloads:  when a file in ${folder} changes`
        : "   • Source:   loaded from the URL (no reload)",
    );
    info("");
    if (values.open) openBrowser(pageUrl);

    const stop = () => {
      watcher?.close();
      for (const res of listeners) res.end();
      server.close(() => process.exit(0));
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  },
};
