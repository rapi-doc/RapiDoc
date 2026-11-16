import {
  createBrowserFetchPlugin,
  isUrlLike,
  pageUrl,
} from "../../rapidoc/src/utils/spec-loader.js";
import { loadSpec } from "./load-spec.js";

/** Loads a spec in the browser: `spec` is a URL (relative to the page), spec text or a spec object. */
export function loadSpecInBrowser(spec) {
  let input = spec;
  let specLocation;
  if (typeof spec === "string" && isUrlLike(spec)) {
    // Resolved against the page once, so the spec and its relative $refs are fetched from the same base
    specLocation = new URL(spec.trim(), pageUrl()).href;
    input = specLocation;
  }
  return loadSpec(input, {
    plugins: [createBrowserFetchPlugin(specLocation)],
    isLocation: isUrlLike,
  });
}
