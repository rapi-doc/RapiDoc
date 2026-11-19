/**
 * How the Mock UI writes values, in one place: numbers, counts with their noun, an operation's action, a value of
 * a record, a sample body. No markup: these return text.
 */

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
