const exampleToSpecMap = {
  "example1": "example1.json",
  "example2": "example2.yaml",
  "example3": "some-example.yaml"
}
export function getSpecUrl(url: URL): string {
  const baseUrl = './specs';
  const pageName = url.pathname.substring(url.pathname.lastIndexOf('/')+1, url.pathname.lastIndexOf('.'));
  const specFile = exampleToSpecMap[pageName] || `${pageName}.yaml`;
  
  return `${baseUrl}/${specFile}`;
}