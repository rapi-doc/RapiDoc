// Gets the associated specs url based on the path (page name). 
// If the page Name has a mapping then uses the map to get the spec Name else it is {pageName}.yaml
const exampleToSpecMap: Record<string, string> = {
  "example1": "example1.json",
  "example2": "example2.yaml",
  "example3": "some-example.yaml",
  "multi-datatypes-test": "multi-datatypes.yaml",
};

export function getSpecUrl(url: URL): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const baseUrl = `${base}/specs`;

  const segments = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  let lastSegment = segments[segments.length - 1] || '';
  if (lastSegment === 'index.html' || lastSegment === 'index') {
    lastSegment = segments[segments.length - 2] || '';
  }
  const dotIndex = lastSegment.lastIndexOf('.');
  const pageName = dotIndex > 0 ? lastSegment.substring(0, dotIndex) : lastSegment;

  const specFile = exampleToSpecMap[pageName] || `${pageName}.yaml`;
  return `${baseUrl}/${specFile}`;
}