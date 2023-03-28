export function joinURLandPath(url, path) {
  if (url.length > 0 && path.length > 0 && url.slice(-1) === path.charAt(0)) return url.slice(0, -1) + path;
  return url + path;
}

export function parseURL(variables, url, path) {
  if (!variables) return url;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{${key}}`, 'g');
    url = url.replace(regex, value.value);
  }

  return joinURLandPath(url, path);
}
