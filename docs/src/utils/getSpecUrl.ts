// Gets the associatec specs url baed on the path (page name). 
// If the page Name has a mapping then uses the map to get the spec Name else it is {pageName}.yaml
const exampleToSpecMap = {
  "example1": "example1.json",
  "example2": "example2.yaml",
  "example3": "some-example.yaml"
}
export function getSpecUrl(url: URL): string {
  const baseUrl = '../specs';
  const pageName = url.pathname.substring(url.pathname.lastIndexOf('/')+1, url.pathname.lastIndexOf('.'));
  const specFile = exampleToSpecMap[pageName] || `${pageName}.yaml`;
  
  return `${baseUrl}/${specFile}`;
}