/*
 * What the import of a spec while the mock runs (`POST /__mock/apis`) needs beside the server: its error, and
 * the check that the caller is on this machine.
 */

/** A problem with a spec sent to import: answered as a 400 with its message (control.js). */
export class ImportError extends Error {
  name = "ImportError";
}

/** True for an address of this machine (`127.0.0.1`, `::1`, `::ffff:127.0.0.1`). */
const isLoopback = (address) =>
  typeof address === "string" && /^(127\.|::1$|::ffff:127\.)/.test(address);

const LOOPBACK_HOST = /^(localhost|127(\.\d{1,3}){3}|\[::1\])(:\d+)?$/i;

/**
 * True when the request was made on this machine, by a program or by the mock's own page. A connection from
 * this machine is not enough: a reverse proxy in front of the mock connects from it for every caller, and so
 * does the browser of someone here for any web page they have open. So the request must also have been sent to
 * a local name, carry no header a proxy adds, and, when a browser sent it, come from the mock's own origin.
 */
export function isLocalCaller(c) {
  if (!isLoopback(c.env?.incoming?.socket?.remoteAddress)) return false;
  const header = (name) => c.req.header(name);
  if (header("x-forwarded-for") || header("forwarded") || header("x-real-ip")) return false;
  // the address the request was sent to (the Node server builds the URL from the Host header)
  const { host } = new URL(c.req.url);
  if (!LOOPBACK_HOST.test(host)) return false;
  const site = header("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = header("origin");
  if (origin) {
    try {
      if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) return false;
    } catch {
      return false;
    }
  }
  return true;
}
