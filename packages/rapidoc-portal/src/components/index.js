export {
  Tabs,
  TabItem,
  CardGrid,
  Steps,
  LinkCard,
  LinkButton,
  FileTree,
} from "@astrojs/starlight/components";

export { default as Callout } from "./Callout.astro";
// Starlight's Aside API (type, title, icon), drawn as a portal callout
export { default as Aside } from "./Callout.astro";
export { default as Badge } from "./Badge.astro";

// Custom universal Card primitives
export { default as Card } from "./Card.astro";
export { default as CardHeader } from "./CardHeader.astro";
export { default as CardTitle } from "./CardTitle.astro";
export { default as CardDescription } from "./CardDescription.astro";
export { default as CardContent } from "./CardContent.astro";
export { default as CardFooter } from "./CardFooter.astro";

// Interactive & Utility Components
export { default as Button } from "./Button.astro";
export { default as Link } from "./Link.astro";
export { default as Trademark } from "./Trademark.astro";
export { default as SpaceWarning } from "./SpaceWarning.astro";
export { default as OpenPlaygroundButton } from "./OpenPlaygroundButton.astro";
// The portal's frame, for a project's own pages (pages/*.astro). A page with its own document takes the
// portal's <head> tags from `@rapidoc/portal/components/PortalHead.astro`, not from here: importing this
// file brings the styles and scripts of every component in it to the page.
export { default as PortalLayout } from "./PortalLayout.astro";
export { default as PortalHeader } from "./PortalHeader.astro";
export { default as PortalFooter } from "./PortalFooter.astro";
// Phosphor icons (https://phosphoricons.com), the portal's one icon set
export { default as Icon } from "./Icon.astro";
