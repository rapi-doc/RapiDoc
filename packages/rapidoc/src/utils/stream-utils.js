/**
 * OpenAPI 3.2 sequential media types: a body that is a stream of items, each described by the
 * media type's `itemSchema` (Server-Sent Events, JSON Lines / NDJSON, JSON Text Sequences,
 * multipart/mixed). Headless: no Lit, no DOM.
 */

const JSONL_TYPES = new Set([
  "application/jsonl",
  "application/x-jsonl",
  "application/jsonlines",
  "application/x-jsonlines",
  "application/ndjson",
  "application/x-ndjson",
]);

/** The media type without parameters, lower-cased: `text/event-stream; charset=utf-8` → `text/event-stream` */
function baseType(mimeType) {
  return String(mimeType || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
}

/**
 * The kind of stream a media type is: `sse`, `jsonl`, `json-seq`, `multipart`, or "" for a media
 * type that is not a sequence.
 * @param {string} mimeType
 * @returns {"sse"|"jsonl"|"json-seq"|"multipart"|""}
 */
export function streamKind(mimeType) {
  const type = baseType(mimeType);
  if (type === "text/event-stream") return "sse";
  if (JSONL_TYPES.has(type)) return "jsonl";
  if (type === "application/json-seq") return "json-seq";
  if (type.startsWith("multipart/")) return "multipart";
  return "";
}

/** The heading above an item's schema or example: what one item of the stream is */
export function streamItemLabel(mimeType) {
  return (
    {
      sse: "Each event",
      jsonl: "Each line",
      "json-seq": "Each record",
      multipart: "Each part",
    }[streamKind(mimeType)] || "Each item"
  );
}

const SSE_FIELDS = ["event", "id", "retry", "data"];

/** One Server-Sent Event as text: its fields as `name: value` lines, `data` split per line */
function serializeSseEvent(item) {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    const data = typeof item === "string" ? item : JSON.stringify(item);
    return data
      .split("\n")
      .map((line) => `data: ${line}`)
      .join("\n");
  }
  const lines = [];
  for (const field of SSE_FIELDS) {
    if (item[field] === undefined || item[field] === null) continue;
    const value = typeof item[field] === "string" ? item[field] : JSON.stringify(item[field]);
    for (const line of value.split("\n")) {
      lines.push(`${field}: ${line}`);
    }
  }
  return lines.join("\n");
}

/**
 * Items as the stream's text: SSE events separated by a blank line, one JSON value per line for
 * JSON Lines, each JSON value after a record separator (U+001E) for JSON Text Sequences.
 * @param {Array<any>} items
 * @param {string} mimeType
 * @returns {string}
 */
export function serializeStreamItems(items, mimeType) {
  const kind = streamKind(mimeType);
  const list = Array.isArray(items) ? items : [items];
  if (kind === "sse") {
    return `${list.map(serializeSseEvent).join("\n\n")}\n`;
  }
  const json = list.map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
  if (kind === "json-seq") {
    return json.map((line) => `\u001e${line}`).join("\n");
  }
  return json.join("\n");
}

/** Whether a response with this Content-Type should be read as a stream in the Try console */
export function isStreamingResponse(contentType) {
  const kind = streamKind(contentType);
  return kind === "sse" || kind === "jsonl" || kind === "json-seq";
}

/**
 * Reads a fetch Response body as text as it arrives, calling `onText` with all text so far after
 * each chunk.
 * @param {Response} response
 * @param {(textSoFar: string) => void} onText
 * @returns {Promise<string>} the whole body
 */
export async function readStreamText(response, onText) {
  if (!response.body?.getReader) {
    const text = await response.text();
    onText(text);
    return text;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onText(text);
  }
  text += decoder.decode();
  onText(text);
  return text;
}
