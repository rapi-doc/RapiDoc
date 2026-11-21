#!/usr/bin/env node
/**
 * `npm run dev:sites`: the four RapiDoc sites side by side, each on its own port, with links between them
 * pointed at the local servers (RAPIDOC_DEV_LINKS, read by `rapidoc dev`), so a click from one site to
 * another stays on this machine.
 *
 *   rapidocui.com        sites/rapidoc      http://localhost:4329
 *   flow.rapidocui.com   sites/rapi-flow    http://localhost:4330
 *   mock.rapidocui.com   sites/rapi-mock    http://localhost:4327
 *   portal.rapidocui.com sites/rapi-portal  http://localhost:4328
 *
 * Each runs its own npm script (dev:rapidoc-site, ...), so a site started alone behaves the same. Ctrl+C
 * stops all four.
 */
import { spawn } from "node:child_process";

const SITES = [
  { name: "rapidoc", script: "dev:rapidoc-site", origin: "https://rapidocui.com", port: 4329 },
  { name: "flow", script: "dev:flow-site", origin: "https://flow.rapidocui.com", port: 4330 },
  { name: "mock", script: "dev:mock-site", origin: "https://mock.rapidocui.com", port: 4327 },
  { name: "portal", script: "dev:portal-site", origin: "https://portal.rapidocui.com", port: 4328 },
];

const links = SITES.map(({ origin, port }) => `${origin}=http://localhost:${port}`).join(",");
const width = Math.max(...SITES.map((site) => site.name.length));

const children = SITES.map((site) => {
  const child = spawn("npm", ["run", site.script], {
    env: { ...process.env, RAPIDOC_DEV_LINKS: links },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const prefix = `[${site.name.padEnd(width)}] `;
  for (const stream of [child.stdout, child.stderr]) {
    let rest = "";
    stream.on("data", (data) => {
      const lines = (rest + data).split("\n");
      rest = lines.pop();
      for (const line of lines) process.stdout.write(prefix + line + "\n");
    });
  }
  child.on("exit", (code) => {
    process.stdout.write(`${prefix}stopped${code ? ` (exit ${code})` : ""}\n`);
  });
  return child;
});

console.log(
  SITES.map(({ name, port }) => `${name.padEnd(width)}  http://localhost:${port}`).join("\n"),
);

function stopAll() {
  for (const child of children) if (child.exitCode === null) child.kill("SIGTERM");
}
process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
