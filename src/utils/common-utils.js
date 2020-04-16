
/* For Delayed Event Handler Execution */
/*
export function debounce(fn, delay) {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID);
    const args = arguments;
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}
*/

export const invalidCharsRegEx = new RegExp(/[\s#:?&=]/, 'g');

export function copyToClipboard(data, e) {
  const btnEl = e.currentTarget;
  const textArea = document.createElement('textarea');
  textArea.value = data;
  textArea.style.position = 'fixed'; // avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    btnEl.innerText = 'Copied';
    setTimeout(() => {
      btnEl.innerText = 'Copy';
    }, 5000);
  } catch (err) {
    console.error('Unable to copy', err); // eslint-disable-line no-console
  }
  document.body.removeChild(textArea);
}

export function getBaseUrlFromUrl(url) {
  const pathArray = url.split('/');
  return `${pathArray[0]}//${pathArray[2]}`;
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function pathIsInSearch(matchPattern, path) {
  const searchString = `${path.method} ${path.path} ${path.summary || path.description || ''} ${path.operationId || ''}`.toLowerCase();
  return searchString.includes(matchPattern);
}
