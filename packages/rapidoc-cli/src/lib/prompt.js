import { CancelledError } from "./errors.js";

/*
 * Questions, through @clack/prompts (imported only when the CLI asks something). The rules:
 * - canAsk(): only when stdin and stdout are terminals, CI is unset, and --yes wasn't given. Otherwise
 *   commands use their defaults (assumingYes(): --yes accepts them) or fail naming the option to pass.
 * - Every question is also an option, so anything a question sets can be scripted.
 * - Ctrl+C (or Esc) on a question throws CancelledError: "Cancelled.", exit 130.
 * Tests: RAPIDOC_PROMPT_ANSWERS, a JSON array, answers the questions in order without a terminal
 * (like RAPIDOC_PORTAL_MODULE, a hook for tests only). `null` in it answers like Ctrl+C.
 */

let assumeYes = false;
let scripted;

/** Applies the global --yes option. */
export function setAssumeYes(value) {
  assumeYes = Boolean(value);
}

/** --yes was given: questions take their default answer. */
export const assumingYes = () => assumeYes;

function scriptedAnswers() {
  if (scripted === undefined) {
    const raw = process.env.RAPIDOC_PROMPT_ANSWERS;
    scripted = raw ? JSON.parse(raw) : null;
  }
  return scripted;
}

export function canAsk() {
  if (assumeYes) return false;
  if (scriptedAnswers()) return true;
  return Boolean(process.stdin.isTTY && process.stdout.isTTY) && !process.env.CI;
}

async function ask(kind, options) {
  const answers = scriptedAnswers();
  if (answers) {
    if (!answers.length) throw new Error(`No scripted answer left for "${options.message}"`);
    const answer = answers.shift();
    if (answer === null) throw new CancelledError();
    if (kind === "text" && answer === "" && options.defaultValue !== undefined)
      return options.defaultValue;
    return answer;
  }
  const clack = await import("@clack/prompts");
  const answer = await clack[kind](options);
  if (clack.isCancel(answer)) throw new CancelledError();
  return answer;
}

/** A line of text; empty input gives `defaultValue`. */
export const text = (options) => ask("text", options);
/** Yes or no. */
export const confirm = (options) => ask("confirm", options);
/** One of `options: [{ value, label, hint? }]`. */
export const select = (options) => ask("select", options);
/** Any of `options`, `initialValues` checked. */
export const multiselect = (options) => ask("multiselect", options);

/** A heading before a series of questions (terminal only). */
export async function intro(title) {
  if (scriptedAnswers()) return;
  (await import("@clack/prompts")).intro(title);
}

/** Closes a series of questions (terminal only). */
export async function outro(message) {
  if (scriptedAnswers()) return;
  (await import("@clack/prompts")).outro(message);
}
