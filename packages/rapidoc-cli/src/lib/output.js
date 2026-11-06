/**
 * Terminal output. Icons only when the stream is a terminal and NO_COLOR is unset (TERM=dumb counts as
 * no terminal); piped or in CI, plain text with "error:" / "warning:" prefixes. --quiet keeps errors
 * and warnings only. Results and progress go to stdout, warnings and errors to stderr.
 */

const decorated = (stream) =>
  Boolean(stream.isTTY) && !("NO_COLOR" in process.env) && process.env.TERM !== "dumb";

let quiet = false;

/** Applies the global --quiet option. */
export function setQuiet(value) {
  quiet = Boolean(value);
}

/** `icon` followed by a space on a terminal; `plain` (default: nothing) otherwise. */
export function icon(emoji, plain = "", stream = process.stdout) {
  return decorated(stream) ? `${emoji} ` : plain;
}

/** Progress and results: hidden by --quiet. */
export function info(text = "") {
  if (!quiet) process.stdout.write(`${text}\n`);
}

/** A line that reports success: hidden by --quiet. */
export function success(text, indent = "") {
  info(`${indent}${icon("✅")}${text}`);
}

export function warn(text, indent = "") {
  process.stderr.write(`${indent}${icon("⚠️ ", "warning: ", process.stderr)}${text}\n`);
}

export function error(text, indent = "") {
  process.stderr.write(`${indent}${icon("❌", "error: ", process.stderr)}${text}\n`);
}
