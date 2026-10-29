/**
 * Live preview: project -> temp workspace -> `astro dev`, with a watcher on the project.
 *
 *   docs/ change              -> re-sync the docs copy and search index (Astro hot-reloads)
 *   config or spec change     -> rebuild the workspace and restart the Astro server
 *
 * The temp workspace is deleted on stop(), Ctrl+C (SIGINT), SIGTERM and any other process exit.
 */

import fs from "node:fs";
import path from "node:path";
import { dev as astroDev } from "astro";
import { createAstroConfig } from "./astro-integration.js";
import { createPortalWorkspace, refreshDocs, removePortalWorkspace } from "./temp-workspace.js";
import { reportSpecWarnings } from "./spec-checks.js";

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
 * @param {boolean} [options.keepWorkspace=false] - Leave the temp workspace on stop (debugging)
 * @returns {Promise<{port: number, readonly workspaceDir: string, stop: () => Promise<void>}>}
 */
export async function startDevServer(projectDir = process.cwd(), options = {}) {
  const port = options.port || 4321;
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
      server = await astroDev(createAstroConfig(workspace, { server: { port, host: true } }));
    } catch (err) {
      removePortalWorkspace(workspace);
      throw err;
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
          console.log("[rapidoc-portal] Config or spec changed, restarting dev server...");
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
    return new Set([workspace.configPath, ...specs]);
  }

  await startAstro();

  // Watch the whole project folder once; filter to docs/, the config file and local specs.
  const projectRoot = workspace.projectDir;
  watcher = fs.watch(projectRoot, { recursive: true }, (_event, fileName) => {
    if (!fileName) return;
    const changedPath = path.join(projectRoot, fileName.toString());
    if (isInside(changedPath, workspace.projectDocsDir) || watchedFiles().has(changedPath)) {
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
    port,
    get workspaceDir() {
      return workspace.root;
    },
    stop,
  };
}
