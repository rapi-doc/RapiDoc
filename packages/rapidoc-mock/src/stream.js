/**
 * OpenAPI 3.2 sequential media types: a body that is a stream of items, each described by the media type's
 * `itemSchema` (Server-Sent Events, JSON Lines / NDJSON, JSON Text Sequences). The mock answers them with one
 * chunk per item, sent `interval` ms apart.
 */

/** How many items are streamed when they are generated from the item schema */
export const GENERATED_STREAM_ITEMS = 5;
/** Default gap between streamed items, in ms */
export const DEFAULT_STREAM_INTERVAL = 300;

const JSONL_TYPES = new Set([
  "application/jsonl",
  "application/x-jsonl",
  "application/jsonlines",
  "application/x-jsonlines",
  "application/ndjson",
  "application/x-ndjson",
]);

/**
 * The kind of stream a media type is: `sse`, `jsonl`, `json-seq`, or "" when it is not one.
 * @param {string} mediaType
 */
export function streamKind(mediaType) {
  const type = String(mediaType || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (type === "text/event-stream") return "sse";
  if (JSONL_TYPES.has(type)) return "jsonl";
  if (type === "application/json-seq") return "json-seq";
  return "";
}

const SSE_FIELDS = ["event", "id", "retry", "data"];

/** One item as its chunk: an SSE event (fields as `name: value` lines, then a blank line), or a JSON line */
export function itemChunk(item, mediaType) {
  const text = (value) => (typeof value === "string" ? value : JSON.stringify(value));
  const kind = streamKind(mediaType);
  if (kind === "sse") {
    const fields = item && typeof item === "object" && !Array.isArray(item) ? item : { data: item };
    const lines = [];
    for (const field of SSE_FIELDS) {
      if (fields[field] === undefined || fields[field] === null) continue;
      for (const line of text(fields[field]).split("\n")) lines.push(`${field}: ${line}`);
    }
    return `${lines.join("\n")}\n\n`;
  }
  return `${kind === "json-seq" ? "\u001e" : ""}${text(item)}\n`;
}

/** A stream written as text (an example's value), cut into its events or lines */
export function splitStreamText(text, mediaType) {
  const sse = streamKind(mediaType) === "sse";
  return String(text)
    .split(sse ? /\n\n+/ : /\n+/)
    .filter((part) => part.trim())
    .map((part) => `${part}${sse ? "\n\n" : "\n"}`);
}

/** A generated item repeated GENERATED_STREAM_ITEMS times, its `id` (if it has one) numbered from 1 */
export function repeatItem(item) {
  return Array.from({ length: GENERATED_STREAM_ITEMS }, (_, i) => {
    if (!item || typeof item !== "object" || Array.isArray(item) || !("id" in item)) return item;
    return { ...item, id: typeof item.id === "number" ? i + 1 : String(i + 1) };
  });
}

/**
 * A body that sends the chunks one at a time, `interval` ms apart (the first at once), and ends after the last.
 * A client that disconnects cancels it.
 */
export function timedStream(chunks, interval) {
  const encoder = new TextEncoder();
  let timer;
  return new ReadableStream({
    start(controller) {
      let i = 0;
      const next = () => {
        if (i >= chunks.length) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(chunks[i++]));
        timer = setTimeout(next, interval);
      };
      next();
    },
    cancel() {
      clearTimeout(timer);
    },
  });
}

/**
 * The items of a streamed request body (JSON Lines, JSON Text Sequences): each line parsed as JSON. Throws
 * with the line number when one isn't. SSE bodies are not parsed (returns null).
 */
export function parseStreamBody(text, mediaType) {
  const kind = streamKind(mediaType);
  if (kind !== "jsonl" && kind !== "json-seq") return null;
  const items = [];
  String(text)
    .split("\n")
    .forEach((raw, i) => {
      const line = (raw.startsWith("\u001e") ? raw.slice(1) : raw).trim();
      if (!line) return;
      try {
        items.push(JSON.parse(line));
      } catch {
        throw new Error(`line ${i + 1} is not valid JSON`);
      }
    });
  return items;
}
