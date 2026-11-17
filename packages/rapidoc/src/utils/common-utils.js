/* For Delayed Event Handler Execution */
export function debounce(fn, delay) {
  let timeoutID = null;
  return (...args) => {
    clearTimeout(timeoutID);
    const that = this;
    timeoutID = setTimeout(() => {
      fn.apply(that, args);
    }, delay);
  };
}

export const invalidCharsRegEx = /[\s#:?&={}]/g; // used for generating valid html element ids by replacing the invalid chars with hyphen (-)
export const rapidocApiKey = "_rapidoc_api_key";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyToClipboard(data, e) {
  const btnEl = e.target;
  const textArea = document.createElement("textarea");
  textArea.value = data;
  textArea.style.position = "fixed"; // avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    btnEl.innerText = "Copied";
    setTimeout(() => {
      btnEl.innerText = "Copy";
    }, 5000);
  } catch (err) {
    console.error("Unable to copy", err);
  }
  document.body.removeChild(textArea);
}

export function getBaseUrlFromUrl(url) {
  const pathArray = url.split("/");
  return `${pathArray[0]}//${pathArray[2]}`;
}

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getMatchedComponents(searchVal, component) {
  return component.name.toLowerCase().includes(searchVal.toLowerCase());
}

export function getMatchedPaths(searchVal = "", path, tagName = "") {
  if (!searchVal) {
    return true;
  }
  const stringToSearch =
    `${path.method} ${path.path} ${path.summary || ""} ${path.description || ""} ${path.operationId || ""} ${tagName}`.toLowerCase();
  return stringToSearch.includes(searchVal.toLowerCase());
}

export function isInternalOrHidden(item) {
  if (!item || typeof item !== "object") return false;
  return (
    item.xInternal === true ||
    item.xInternal === "true" ||
    item.xHidden === true ||
    item.xHidden === "true" ||
    item["x-internal"] === true ||
    item["x-internal"] === "true" ||
    item["x-hidden"] === true ||
    item["x-hidden"] === "true" ||
    item.rawOperation?.["x-internal"] === true ||
    item.rawOperation?.["x-internal"] === "true" ||
    item.rawOperation?.["x-hidden"] === true ||
    item.rawOperation?.["x-hidden"] === "true"
  );
}

export function schemaKeys(schemaProps, result = new Set()) {
  if (!schemaProps) {
    return result;
  }
  Object.keys(schemaProps).forEach((key) => {
    result.add(key);
    if (schemaProps[key].properties) {
      schemaKeys(schemaProps[key].properties, result);
    } else if (schemaProps[key].items?.properties) {
      schemaKeys(schemaProps[key].items?.properties, result);
    }
  });
  return result;
}

export function advancedSearch(searchVal, allSpecTags, searchOptions = []) {
  if (!searchVal.trim() || searchOptions.length === 0) {
    return;
  }

  const pathsMatched = [];
  allSpecTags.forEach((tag) => {
    tag.paths.forEach((path) => {
      let stringToSearch = "";
      if (searchOptions.includes("search-api-path")) {
        stringToSearch = path.path;
      }
      if (searchOptions.includes("search-api-descr")) {
        stringToSearch = `${stringToSearch} ${(path.summary || "") + (path.description || "")}`;
      }
      if (searchOptions.includes("search-api-params")) {
        stringToSearch = `${stringToSearch} ${path.parameters?.map((v) => v.name).join(" ") || ""}`;
      }

      if (searchOptions.includes("search-api-request-body") && path.requestBody) {
        let schemaKeySet = new Set();
        for (const contentType in path.requestBody?.content) {
          if (path.requestBody.content[contentType].schema?.properties) {
            schemaKeySet = schemaKeys(path.requestBody.content[contentType].schema?.properties);
          }
          stringToSearch = `${stringToSearch} ${[...schemaKeySet].join(" ")}`;
        }
      }

      if (searchOptions.includes("search-api-resp-descr")) {
        stringToSearch = `${stringToSearch} ${Object.values(path.responses)
          .map((v) => v.description || "")
          .join(" ")}`;
      }

      if (stringToSearch.toLowerCase().includes(searchVal.trim().toLowerCase())) {
        pathsMatched.push({
          elementId: path.elementId,
          method: path.method,
          path: path.path,
          summary: path.summary || path.description || "",
          deprecated: path.deprecated,
        });
      }
    });
  });
  return pathsMatched;
}

/*
export function prettyXml(sourceXmlString) {
  const xmlDoc = new DOMParser().parseFromString(sourceXmlString, 'text/xml');
  const xsltDoc = new DOMParser().parseFromString([
    // describes how we want to modify the XML - indent everything
    `<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
      <xsl:strip-space elements="*"/>
        <xsl:template match="para[content-style][not(text())]">
          <xsl:value-of select="normalize-space(.)"/>
        </xsl:template>
        <xsl:template match="node()|@*">
          <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
        </xsl:template>
        <xsl:output indent="yes"/>
      </xsl:stylesheet>`,
  ].join('\n'), 'application/xml');
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDoc);
  const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
  return new XMLSerializer().serializeToString(resultDoc);
}
*/

export function downloadResource(url, fileName) {
  if (url) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
  }
}

export function viewResource(url) {
  if (url) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.target = "_blank";
    a.click();
    a.remove();
  }
}

/**
 * The CSS custom property an `x-badges` `color` names: `red` → `var(--red)`. `primary-color`, the
 * documented name of the theme's accent, is `--primary` since the v12 theme tokens.
 */
export function badgeColorVar(color) {
  return `var(--${color === "primary-color" ? "primary" : color})`;
}

/**
 * A sidebar item's tooltip text: its full name, then its badges on a second line. The item keeps it
 * in data-title; its title shows it only when it adds something (syncNavItemTitle).
 */
export function navItemTitle(label, xBadges) {
  const dot = navBadgeDot(xBadges);
  return dot ? `${label}\nBadges: ${dot.labels.join(", ")}` : String(label);
}

/**
 * A sidebar's pointerover handler (one per sidebar, delegated): gives the item under the pointer a
 * tooltip only when its name is cut off with an ellipsis or it shows badges; any other item has
 * none. Measured on hover, so it follows the sidebar's width, font and zoom. On the item itself,
 * since its children take no pointer events.
 */
export function syncNavItemTitle(event) {
  const row = event.target?.closest?.(".nav-bar-path");
  if (!row?.dataset.title) return;
  const label = row.querySelector(".nav-bar-path-label");
  const cut = Boolean(label && label.scrollWidth > label.clientWidth + 1);
  if (cut || row.querySelector(".nav-badge-dot")) {
    if (row.title !== row.dataset.title) row.title = row.dataset.title;
  } else if (row.hasAttribute("title")) {
    row.removeAttribute("title");
  }
}

/**
 * The badges an operation shows (x-badges and OpenAPI 3.2 kind: badge tags, merged by the spec
 * parser into `xBadges`): those with a label and a color other than `none`. For the nav dot
 * (show-badges-in-nav-bar), shared by <rapi-doc>'s sidebar and @rapidoc/prerender's.
 * @returns {{ color: string, labels: string[] } | null} the first badge's color and every label
 */
export function navBadgeDot(xBadges) {
  const shown = (Array.isArray(xBadges) ? xBadges : []).filter(
    (b) => b && b.label && b.color !== "none",
  );
  if (!shown.length) return null;
  return {
    color: badgeColorVar(shown[0].color || "primary-color"),
    labels: shown.map((b) => String(b.label)),
  };
}
