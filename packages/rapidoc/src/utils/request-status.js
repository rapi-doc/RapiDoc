/**
 * The Try console's request status: what the status line says while a request is open and after it
 * ends. Headless (no Lit, no DOM), so the wording is unit tested on its own.
 *
 * Phases: idle → waiting → (streaming) → done | failed | stopped.
 */
import { streamKind } from "./stream-utils.js";

/** After this long without a response, the status line says the server is slow (the request goes on) */
export const SLOW_AFTER_MS = 10000;

/** A duration for people: `640 ms` under a second, else `3.4 s` */
export function formatElapsed(ms) {
  const value = Math.max(0, Number(ms) || 0);
  return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(1)} s`;
}

/**
 * How many items a streamed body holds so far: SSE events (blocks ended by a blank line) or lines of
 * JSON Lines and JSON Text Sequences. 0 for other media types.
 */
export function countStreamItems(text, contentType) {
  const kind = streamKind(contentType);
  if (!text || !kind || kind === "multipart") return 0;
  if (kind === "sse") {
    return String(text)
      .split(/\n\n/)
      .filter(
        (block, i, all) => block.trim() && (i < all.length - 1 || String(text).endsWith("\n\n")),
      ).length;
  }
  return String(text)
    .split("\n")
    .filter((line, i, all) => line.trim() && i < all.length - 1).length;
}

/** "3 events" / "1 line" for a streamed body */
export function itemsLabel(count, contentType) {
  const noun = streamKind(contentType) === "sse" ? "event" : "line";
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

/**
 * The status line while a request is open (waiting, streaming) or after it was stopped; "" for the
 * other phases, which show the response status instead.
 *
 * @param {object} state
 * @param {"idle"|"waiting"|"streaming"|"done"|"failed"|"stopped"} state.phase
 * @param {number} state.elapsedMs - Since the request was sent
 * @param {string} [state.url] - Where it was sent
 * @param {string} [state.responseText] - The streamed text so far
 * @param {string} [state.contentType] - The response's Content-Type (streams)
 * @param {boolean} [state.wasStreaming] - For `stopped`: the response had started streaming
 */
export function requestStatusText({
  phase,
  elapsedMs,
  url = "",
  responseText = "",
  contentType = "",
  wasStreaming = false,
}) {
  const elapsed = formatElapsed(elapsedMs);
  if (phase === "waiting") {
    return elapsedMs >= SLOW_AFTER_MS
      ? `The server is taking a while (${elapsed})`
      : `Waiting for ${url || "the server"}… ${elapsed}`;
  }
  if (phase === "streaming") {
    return `Streaming… ${itemsLabel(countStreamItems(responseText, contentType), contentType)}, ${elapsed}`;
  }
  if (phase === "stopped") {
    return wasStreaming
      ? `Stopped after ${itemsLabel(countStreamItems(responseText, contentType), contentType)}, ${elapsed}`
      : `Cancelled after ${elapsed}`;
  }
  return "";
}

/**
 * What a failed fetch means. The browser reports a server that doesn't exist, can't be reached, or
 * refuses this page (CORS) with the same error, so the message names all three.
 */
export function networkErrorText(url, method = "") {
  if (String(method).toUpperCase() === "TRACE") {
    return "Browsers don't send TRACE requests from a page. Use the cURL command instead.";
  }
  let host = url;
  try {
    host = new URL(url).host || url;
  } catch {
    // not an absolute URL: name it as given
  }
  return `Couldn't reach ${host}: the server doesn't exist, isn't reachable, or doesn't allow requests from this page (CORS).`;
}
