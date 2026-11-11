// @rapidoc/vitepress/client: the component that draws an API reference in a VitePress page.
//
//   <script setup>
//   import { RapidocReference } from '@rapidoc/vitepress/client'
//   </script>
//
//   <RapidocReference api="pets" />
//
// `api` names a document given to `withRapidoc` in the config. The element is loaded in the browser only.
import { defineComponent, h, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, withBase } from "vitepress";
import { toAttributes } from "@rapidoc/embed/core";
import { specs, oauthReceiver } from "virtual:rapidoc-vitepress";

/**
 * How <rapi-doc> sits in a VitePress page: the theme's nav and sidebar replace its own, the page scrolls
 * instead of the element, and its colours follow the theme's light and dark modes.
 */
export const PAGE_ATTRIBUTES = {
  "render-style": "focused",
  "show-header": "false",
  "show-side-nav": "false",
  "auto-height": "true",
  "color-scheme": "auto",
  "allow-spec-url-load": "false",
  "allow-spec-file-load": "false",
};

export const RapidocReference = defineComponent({
  name: "RapidocReference",
  props: {
    /** Name of a document given to `withRapidoc({ apis })`. */
    api: { type: String, default: undefined },
    /** The OpenAPI document itself, instead of `api`. */
    spec: { type: Object, default: undefined },
    /** Attributes of <rapi-doc>, in kebab-case or camelCase. They win over the component's own. */
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const element = ref(null);
    const route = useRoute();
    const document = () => props.spec ?? specs[props.api];

    const attributes = () =>
      Object.fromEntries(
        toAttributes({
          options: {
            ...PAGE_ATTRIBUTES,
            "oauth-receiver": withBase(`/${oauthReceiver}`),
            ...props.options,
          },
        }),
      );

    const fromHash = () => decodeURIComponent(window.location.hash.slice(1));
    // The sidebar's operation links only change the hash; VitePress handles them itself, so tell the element
    const showHash = () => {
      const id = fromHash();
      if (id && element.value?.scrollToPath) element.value.scrollToPath(id);
    };

    onMounted(async () => {
      if (!document()) {
        throw new Error(
          `@rapidoc/vitepress: no API named "${props.api}"; add it to withRapidoc({ apis }) in the config`,
        );
      }
      await import("rapidoc");
      await customElements.whenDefined("rapi-doc");
      await element.value?.loadSpec(structuredClone(document()));
      showHash();
      window.addEventListener("hashchange", showHash);
    });
    onBeforeUnmount(() => window.removeEventListener("hashchange", showHash));
    watch(
      () => route.hash,
      () => showHash(),
    );
    watch(
      () => [props.api, props.spec],
      () => element.value?.loadSpec?.(structuredClone(document())),
    );

    return () =>
      h("rapi-doc", {
        ref: element,
        class: "rapidoc-vitepress",
        // sit on the theme's own background, in both of its modes
        style: "display:block;width:100%;min-height:60vh;--background:var(--vp-c-bg)",
        ...attributes(),
      });
  },
});

export default RapidocReference;
