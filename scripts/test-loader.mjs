import { registerHooks } from "node:module";
import { transformSync } from "esbuild";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    // Vite's `?raw` import (a file's text as the default export), for the MCP project writer
    if (specifier.endsWith("?raw")) {
      const resolved = nextResolve(specifier.slice(0, -4), context);
      return { ...resolved, url: `${resolved.url}?raw` };
    }
    let target = specifier;
    if (specifier === "~") {
      target = fileURLToPath(new URL("../packages/rapidoc/src/index.js", import.meta.url));
    } else if (specifier.startsWith("~/")) {
      target = fileURLToPath(
        new URL("../packages/rapidoc/src/" + specifier.slice(2), import.meta.url),
      );
    } else if (specifier === "@rapidoc/prerender") {
      target = fileURLToPath(
        new URL("../packages/rapidoc-prerender/src/index.js", import.meta.url),
      );
    } else if (specifier === "@rapidoc/mcp") {
      target = fileURLToPath(new URL("../packages/rapidoc-mcp/src/index.js", import.meta.url));
    }

    try {
      return nextResolve(target, context);
    } catch (err) {
      if (target.endsWith(".js")) {
        try {
          return nextResolve(target.slice(0, -3) + ".ts", context);
        } catch {}
      } else {
        try {
          return nextResolve(target + ".ts", context);
        } catch {}
        try {
          return nextResolve(target + ".js", context);
        } catch {}
      }
      throw err;
    }
  },
  load(url, context, nextLoad) {
    if (url.endsWith("?raw")) {
      const text = fs.readFileSync(fileURLToPath(url.slice(0, -4)), "utf-8");
      return {
        format: "module",
        source: `export default ${JSON.stringify(text)};`,
        shortCircuit: true,
      };
    }
    if (url.endsWith(".ts")) {
      const filePath = fileURLToPath(url);
      const source = fs.readFileSync(filePath, "utf-8");
      const transformed = transformSync(source, {
        loader: "ts",
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
            useDefineForClassFields: false,
          },
        },
      });
      return { format: "module", source: transformed.code, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
