/**
 * What the control API (control.js) needs beside the APIs: how the mock was started, what may change while it
 * runs, and how to make new seed data. The server (index.js) and the mock in a browser (browser.js) both make one.
 */
import { createStateful } from "./stateful/handlers.js";

/**
 * @param {object} options
 * @param {{ delay: number, seed: number, rows: number }} options.settings - What may change while the mock runs;
 *   kept by reference, so the caller sees the changes
 * @param {object} options.started - How the mock was started, as `/__mock/settings` shows it
 */
export function createRuntime({ settings, started }) {
  return {
    settings,
    started,
    /** New seed data for the given APIs: every session's records are dropped with the old data. */
    async reseed(list, { rows, seed }) {
      const made = await Promise.all(
        list.map((api) => createStateful(api.doc, { seed, rows, config: api.state?.config })),
      );
      list.forEach((api, i) => {
        made[i].config = api.state?.config;
        api.state = made[i];
      });
      Object.assign(settings, { rows, seed });
    },
  };
}
