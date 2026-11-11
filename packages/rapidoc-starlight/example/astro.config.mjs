// The site the tests build and `npm run example` serves: Starlight with one guide page and one API.
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightRapidoc from "../src/index.js";

export default defineConfig({
  // Only for this monorepo: Astro imports cookie 2 and Starlight js-yaml 4, while other workspaces hoist older or newer
  // majors of both to the repo root. Bundled, each import resolves to the copy its package installed.
  vite: { resolve: { noExternal: ["cookie", "js-yaml"] } },
  integrations: [
    starlight({
      title: "Example docs",
      sidebar: [{ label: "Guides", items: [{ label: "Welcome", link: "/" }] }],
      plugins: [
        starlightRapidoc({
          uiPath: "/api",
          spec: "./openapi/pets.yaml",
          options: { allowTry: false },
        }),
      ],
    }),
  ],
});
