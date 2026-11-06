import { spawn } from "node:child_process";
import { warn } from "./output.js";

/**
 * Opens `url` in the default browser (`--open` on dev and preview). Best effort: a failure is a warning,
 * never an error. RAPIDOC_OPEN_COMMAND swaps the command (tests set it to `echo`).
 */
export function openBrowser(url) {
  const [command, ...args] = process.env.RAPIDOC_OPEN_COMMAND
    ? [process.env.RAPIDOC_OPEN_COMMAND]
    : process.platform === "darwin"
      ? ["open"]
      : process.platform === "win32"
        ? ["cmd", "/c", "start", '""']
        : ["xdg-open"];
  try {
    const child = spawn(command, [...args, url], { stdio: "ignore", detached: true });
    child.on("error", () => warn(`Could not open a browser; open ${url} yourself.`, "   "));
    child.unref();
  } catch {
    warn(`Could not open a browser; open ${url} yourself.`, "   ");
  }
}
