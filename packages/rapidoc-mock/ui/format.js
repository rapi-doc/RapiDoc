/**
 * How the Mock UI writes values, in one place: numbers, counts with their noun, an operation's action, a value of
 * a record, a sample body. These return text; `marked` alone returns markup (a sentence with its names as code).
 */
import { html } from "lit";

/** A number with thousands separators: 1,204. */
export const number = (value) => value.toLocaleString("en");

/** The noun for a count: `plural(1, "error")` is "error", `plural(2, "category", "categories")` "categories". */
export const plural = (value, word, many = `${word}s`) => (value === 1 ? word : many);

/** A count with its noun: "1 error", "1,204 warnings", "2 categories". */
export const count = (value, word, many) => `${number(value)} ${plural(value, word, many)}`;

/** An operation's action as words: `createMany` is "create many", the others are their own name. */
export const actionName = (action) => (action === "createMany" ? "create many" : action);

/** A value as a cell or a line shows it: plain for a simple value, compact JSON for an object or a list. */
export const valueText = (value) => {
  if (value === null) return "null";
  if (value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

/** A body as text for reading: pretty JSON when it is JSON, else as it is. */
export const prettyBody = (body) => {
  if (body === null || body === undefined) return "";
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return String(body);
  }
};

/** A reason the model gives in lower case ("matched Owner by …"), as the start of a sentence. */
export const sentence = (text) => (text ? text[0].toUpperCase() + text.slice(1) : "");

/**
 * A sentence from the mock with the names it marks as code. The mock writes a name it takes from the spec (a
 * resource, a parameter, a field) in backticks, so it can't be read as a word of the sentence.
 */
export const marked = (text) =>
  text
    ? String(text)
        .split("`")
        .map((part, index) => (index % 2 ? html`<code class="name">${part}</code>` : part))
    : "";

/** The same sentence without the marks, where no markup goes: a tooltip, a text to filter by. */
export const plain = (text) => String(text ?? "").replaceAll("`", "");
