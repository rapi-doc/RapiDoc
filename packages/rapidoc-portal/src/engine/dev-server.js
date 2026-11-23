/**
 * Live preview: project -> temp workspace -> `astro dev`, with a watcher on the project.
 *
 *   docs/ change              -> re-sync the docs copy and search index (Astro hot-reloads)
 *   config or spec change     -> rebuild the workspace and restart the Astro server
 *   page added or removed     -> the same (pages/*.astro are routes; edits to one hot-reload)
 *
 * The temp workspace is deleted on stop(), Ctrl+C (SIGINT), SIGTERM and any other process exit.
 */

import fs from "node:fs";
import path from "node:path";
import { dev as astroDev } from "astro";
import { createAstroConfig } from "./astro-integration.js";
import { createPortalWorkspace, refreshDocs, removePortalWorkspace } from "./temp-workspace.js";
import { reportSpecWarnings } from "./spec-checks.js";
import { PAGES_DIRNAME } from "./project-pages.js";
import { DEV_PAGES_ROUTE } from "./astro-integration.js";
import { extractPageRecords, writePageRecords } from "../search/indexer.js";

const WATCH_DEBOUNCE_MS = 150;

function isInside(filePath, dir) {
  const rel = path.relative(dir, filePath);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

/**
 * Starts the dev server.
 *
 * @param {string} [projectDir] - Folder containing rapidoc.config.yaml
 * @param {object} [options]
 * @param {number} [options.port=4321]
 * @param {string} [options.host='localhost'] - Address to listen on. `0.0.0.0` opens the server to the network:
 *   the dev server does not enforce access rules, so every page is then readable from other machines
 * @param {boolean} [options.keepWorkspace=false] - Leave the temp workspace on stop (debugging)
 * @returns {Promise<{port: number, readonly workspaceDir: string, stop: () => Promise<void>}>}
 */
export async function startDevServer(projectDir = process.cwd(), options = {}) {
  const port = options.port || 4321;
  // Astro: true is every interface, a string that address. `localhost` is the IPv4 loopback address: as a
  // name to listen on it is one address family only (IPv6 on macOS), which a client asking for 127.0.0.1 misses.
  const listenHost = options.host || "localhost";
  const host =
    listenHost === "localhost" ? "127.0.0.1" : listenHost === "0.0.0.0" ? true : listenHost;
  let workspace = null;
  let server = null;
  let watcher = null;
  let stopped = false;

  async function startAstro() {
    workspace = await createPortalWorkspace(projectDir, { kind: "dev" });
    reportSpecWarnings(workspace.config);
    if (workspace.config.access.enabled) {
      console.warn(
        "[rapidoc-portal] Access rules are not enforced by rapidoc dev; test them with rapidoc build && rapidoc serve dist",
      );
    }
    try {
      server = await astroDev(createAstroConfig(workspace, { server: { port, host } }));
    } catch (err) {
      removePortalWorkspace(workspace);
      throw err;
    }
    indexProjectPages();
  }

  /**
   * The project's own pages in the dev search: they have no Markdown source, so each is asked for from
   * the server just started and read as HTML, as a build reads them from its output. Runs after start,
   * without holding it up; a page added later is found after the restart that adds its route.
   */
  async function indexProjectPages() {
    const current = workspace;
    if (!current.config.search || current.pages.length === 0) return;
    const origin = `http://localhost:${server.address.port}${current.config.site.basePath || ""}`;
    try {
      const urls = await (await fetch(`${origin}${DEV_PAGES_ROUTE}`)).json();
      const records = [];
      const queue = [...urls];
      const worker = async () => {
        for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
          try {
            const res = await fetch(`${origin}${url}`, { headers: { accept: "text/html" } });
            if (res.ok)
              records.push(
                ...extractPageRecords(await res.text(), url, {
                  siteTitle: current.config.site.title,
                }),
              );
          } catch {
            // A page that fails to render shows its error in the browser; the search goes on without it.
          }
        }
      };
      await Promise.all(Array.from({ length: 4 }, worker));
      if (stopped || workspace !== current) return;
      current.pageRecords = records;
      writePageRecords(path.join(current.publicDir, "search-index.json"), records);
      console.log(`[rapidoc-portal] Search: ${urls.length} of your own pages added`);
    } catch (err) {
      console.warn(`[rapidoc-portal] Search: your own pages were not added (${err.message})`);
    }
  }

  async function stopAstro() {
    await server?.stop();
    server = null;
    if (!options.keepWorkspace) removePortalWorkspace(workspace);
  }

  let pending = null;
  let restartNeeded = false;
  function onProjectChange(changedPath) {
    const isDocsChange = isInside(changedPath, workspace.projectDocsDir);
    if (!isDocsChange) restartNeeded = true;
    clearTimeout(pending);
    pending = setTimeout(async () => {
      if (stopped) return;
      try {
        if (restartNeeded) {
          restartNeeded = false;
          console.log("[rapidoc-portal] Config, spec or pages changed, restarting dev server...");
          await stopAstro();
          await startAstro();
        } else {
          refreshDocs(workspace);
        }
      } catch (err) {
        console.error(`[rapidoc-portal] Reload failed: ${err.message}`);
      }
    }, WATCH_DEBOUNCE_MS);
  }

  function watchedFiles() {
    const specs = (workspace.config.apis || [])
      .flatMap((api) => api.versions)
      .filter((version) => !version.isRemote && version.fullPath)
      .map((version) => version.fullPath);
    const workflows = (workspace.config.workflows || []).map((workflow) => workflow.fullPath);
    return new Set([workspace.configPath, ...specs, ...workflows]);
  }

  // A page of pages/ that appears or goes away changes the routes, which are set when Astro starts.
  // An edit to one is hot-reloaded by Astro, like any file a page imports.
  function isPageAddedOrRemoved(changedPath) {
    if (!changedPath.endsWith(".astro")) return false;
    if (!isInside(changedPath, path.join(workspace.projectDir, PAGES_DIRNAME))) return false;
    return fs.existsSync(changedPath) !== workspace.pages.some((page) => page.file === changedPath);
  }

  await startAstro();

  // Watch the whole project folder once; filter to docs/, the config file, local specs, workflow files
  // and pages added to or removed from pages/.
  const projectRoot = workspace.projectDir;
  watcher = fs.watch(projectRoot, { recursive: true }, (_event, fileName) => {
    if (!fileName) return;
    const changedPath = path.join(projectRoot, fileName.toString());
    if (
      isInside(changedPath, workspace.projectDocsDir) ||
      watchedFiles().has(changedPath) ||
      isPageAddedOrRemoved(changedPath)
    ) {
      onProjectChange(changedPath);
    }
  });

  async function stop() {
    if (stopped) return;
    stopped = true;
    clearTimeout(pending);
    watcher?.close();
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    await stopAstro();
    // Only now: Astro's own signal handler may exit the process while stopAstro() is awaited.
    process.off("exit", onExit);
  }

  async function onSignal(signal) {
    await stop();
    process.exit(signal === "SIGINT" ? 130 : 143);
  }
  // Vite exits the process on SIGTERM before an async stop() can finish, so the workspace is also
  // removed synchronously when the process exits, whatever ends it.
  function onExit() {
    if (!options.keepWorkspace) removePortalWorkspace(workspace);
  }
  process.on("SIGINT", onSignal);
  process.on("SIGTERM", onSignal);
  process.on("exit", onExit);

  return {
    // The port Astro listens on: it moves to a free one when `port` is taken.
    port: server.address?.port ?? port,
    get workspaceDir() {
      return workspace.root;
    },
    stop,
  };
}
