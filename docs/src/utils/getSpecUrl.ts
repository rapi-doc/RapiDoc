// Gets the associated specs url based on the path (page name).
// If the page Name has a mapping then uses the map to get the spec Name else it is {pageName}.yaml
const exampleToSpecMap: Record<string, string> = {
  example1: "example1.json",
  example2: "example2.yaml",
  example3: "some-example.yaml",
  "multi-datatypes-test": "multi-datatypes.yaml",
  "dry-run": "dryrun.yaml",
  "brand-fonts": "bookstore.yaml",
  font: "petstore.yaml",
  reqres: "reqres.yaml",
  search: "petstore.yaml",
  "render-styles": "petstore.yaml",
  "schema-styles": "schema-table.yaml",
};

// Tests that use a shared or different spec (e.g. petstore.yaml in specs-test/)
const testToSpecMap: Record<string, string> = {
  font: "petstore.yaml",
  "hide-show-sections": "petstore.yaml",
  "hide-show-spec": "petstore.yaml",
  "nav-hidden": "petstore.yaml",
  "nav-styles": "petstore.yaml",
  search: "petstore.yaml",
  "theme-n-color": "petstore.yaml",
};

// A test page lives under /tests/<slug> (after any BASE_URL). Shared with ExampleLayout so the
// layout and the spec folder agree on what a test page is.
export function isTestPath(pathname: string): boolean {
  return pathname.includes("/tests/");
}

export function getSpecUrl(url: URL): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const isTest = isTestPath(url.pathname);
  const baseUrl = `${base}/${isTest ? "specs-test" : "specs"}`;

  const segments = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  let lastSegment = segments[segments.length - 1] || "";
  if (lastSegment === "index.html" || lastSegment === "index") {
    lastSegment = segments[segments.length - 2] || "";
  }
  const dotIndex = lastSegment.lastIndexOf(".");
  const pageName = dotIndex > 0 ? lastSegment.substring(0, dotIndex) : lastSegment;

  const specMap = isTest ? testToSpecMap : exampleToSpecMap;
  const specFile = specMap[pageName] || `${pageName}.yaml`;
  return `${baseUrl}/${specFile}`;
}
