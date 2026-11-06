import net from "node:net";
import { CancelledError, ProblemError } from "./errors.js";
import { assumingYes, canAsk, confirm } from "./prompt.js";

/** Whether `port` can be listened on at `host` right now. */
export function isPortFree(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.listen({ port, host }, () => server.close(() => resolve(true)));
  });
}

/** The first free port after `port` (up to 50 further), or 0 (let the system pick). */
async function nextFreePort(port, host) {
  for (let candidate = port + 1; candidate <= Math.min(port + 50, 65535); candidate++)
    if (await isPortFree(candidate, host)) return candidate;
  return 0;
}

/**
 * `port` is taken: in a terminal, offer the next free one (no: CancelledError); with --yes, take it;
 * otherwise null (the caller decides: fail, or keep the port).
 */
async function replacementPort(port, host) {
  const next = await nextFreePort(port, host);
  if (canAsk()) {
    const ok = await confirm({
      message: `Port ${port} is in use. Use ${next || "a free one"} instead?`,
      initialValue: true,
    });
    if (!ok) throw new CancelledError();
    return next;
  }
  return assumingYes() ? next : null;
}

const inUse = (err) => err?.code === "EADDRINUSE" || /EADDRINUSE/.test(err?.message ?? "");

/**
 * Starts a server with `start(port)`; when its port is taken, offers the next free one (see
 * replacementPort) and starts it there, else fails naming --port. Starting first (not checking the
 * port first) keeps the server's own checks in their order: a missing build is reported before a busy
 * port. Used by serve and mock.
 */
export async function startOnFreePort(start, port, { host } = {}) {
  try {
    return await start(port);
  } catch (err) {
    if (!inUse(err) || !port) throw err;
    const next = await replacementPort(port, host);
    if (next === null)
      throw new ProblemError(`Port ${port} is in use. Pass --port <number> (0 picks a free one).`);
    return start(next);
  }
}

/**
 * For the dev server, which moves to a free port by itself (Astro): in a terminal or with --yes, settle
 * the port first so the choice is the user's; otherwise leave `port` to the server.
 */
export async function choosePort(port, { host } = {}) {
  if (!port || (await isPortFree(port, host))) return port;
  return (await replacementPort(port, host)) ?? port;
}
