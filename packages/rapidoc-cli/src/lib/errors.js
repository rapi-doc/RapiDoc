/**
 * The two ways a command fails, and the exit code each one means:
 * - UsageError (2): the command line is wrong (unknown command or option, bad or missing value).
 * - ProblemError (1): the input has problems (invalid spec or config, failed build, missing engine).
 * The dispatcher (src/index.js) prints the message and sets the exit code; commands only throw.
 */
export class UsageError extends Error {
  constructor(message, { command } = {}) {
    super(message);
    this.name = "UsageError";
    this.exitCode = 2;
    this.command = command;
  }
}

export class ProblemError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProblemError";
    this.exitCode = 1;
  }
}
