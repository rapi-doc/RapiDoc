import { ProblemError } from "./errors.js";

/*
 * The engines behind the commands are optional peers, imported only by the commands that need them:
 * @rapidoc/portal (dev, build, migrate, folder-wide validate, mock of a portal folder), @rapidoc/server
 * (serve) and @rapidoc/mock (mock). Never import them at the top of a module.
 * RAPIDOC_PORTAL_MODULE, RAPIDOC_SERVER_MODULE and RAPIDOC_MOCK_MODULE swap the module names (tests use
 * them to simulate a missing engine).
 */

const PORTAL_MODULE = process.env.RAPIDOC_PORTAL_MODULE || "@rapidoc/portal";
const SERVER_MODULE = process.env.RAPIDOC_SERVER_MODULE || "@rapidoc/server";
const MOCK_MODULE = process.env.RAPIDOC_MOCK_MODULE || "@rapidoc/mock";

async function tryImport(moduleName) {
  try {
    return await import(moduleName);
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" && err.message.includes(moduleName)) return null;
    throw err;
  }
}

/** The portal engine, or null when it isn't installed (single-spec validate works without it). */
export const tryLoadPortal = () => tryImport(PORTAL_MODULE);

export async function loadPortal(commandName) {
  const portal = await tryLoadPortal();
  if (!portal) {
    throw new ProblemError(
      `\`rapidoc ${commandName}\` needs the portal engine. Install it next to the CLI:\n   npm install -D @rapidoc/portal`,
    );
  }
  return portal;
}

export async function loadServer() {
  const server = await tryImport(SERVER_MODULE);
  if (!server) {
    throw new ProblemError(
      "`rapidoc serve` needs @rapidoc/server. Install it next to the CLI:\n   npm install @rapidoc/server",
    );
  }
  return server;
}

export async function loadMock() {
  const mock = await tryImport(MOCK_MODULE);
  if (!mock) {
    throw new ProblemError(
      "`rapidoc mock` needs @rapidoc/mock. Install it next to the CLI:\n   npm install -D @rapidoc/mock",
    );
  }
  return mock;
}
