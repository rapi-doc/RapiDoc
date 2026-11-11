// The site the tests build: VitePress with one guide page and one API.
import { defineConfig } from "vitepress";
import { withRapidoc, rapidocSidebar } from "../../src/index.js";

const root = new URL("..", import.meta.url).pathname;

export default withRapidoc(
  defineConfig({
    title: "Example docs",
    themeConfig: {
      sidebar: [
        { text: "Guides", items: [{ text: "Welcome", link: "/" }] },
        {
          text: "Pets API",
          items: await rapidocSidebar("./openapi/pets.yaml", "/api", { root }),
        },
      ],
    },
  }),
  { apis: { pets: "./openapi/pets.yaml" }, root },
);
