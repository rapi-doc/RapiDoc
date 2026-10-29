import { formatXml } from "./xml-utils.js";
import { schemaToAST, generateExample, standardizeExample } from "./schema-utils.js";

/**
 * Parses and processes a standard Fetch API Response into RapiDoc formatted response state.
 * Handles JSON parsing, XML formatting, NDJSON streaming format, charset decoding,
 * and binary MIME sniffing with RFC 5987 Content-Disposition decoding.
 *
 * @param {Response} fetchResponse - Standard Fetch Response object
 * @returns {Promise<{
 *   responseText: string,
 *   respJson?: any,
 *   respBlob?: Blob,
 *   respText?: string,
 *   responseIsBlob: boolean,
 *   responseBlobType: string,
 *   responseBlobUrl: string,
 *   respContentDisposition: string
 * }>}
 */
export async function processFetchResponse(fetchResponse) {
  let respBlob;
  let respJson;
  let respText;
  let responseIsBlob = false;
  let responseBlobType = "";
  let responseBlobUrl = "";
  let respContentDisposition = "";
  let responseText = "";

  let contentType = fetchResponse.headers.get("content-type");
  const respEmpty = (await fetchResponse.clone().text()).length === 0;
  if (respEmpty) {
    responseText = "";
  } else if (contentType) {
    contentType = contentType.split(";")[0].trim();
    if (contentType === "application/x-ndjson") {
      responseText = await fetchResponse.text();
    } else if (contentType.includes("json")) {
      if (/charset=[^"']+/.test(contentType)) {
        const encoding = contentType.split("charset=")[1];
        const buffer = await fetchResponse.arrayBuffer();
        try {
          respText = new TextDecoder(encoding).decode(buffer);
        } catch {
          respText = new TextDecoder("utf-8").decode(buffer);
        }
        try {
          respJson = JSON.parse(respText);
          responseText = JSON.stringify(respJson, null, 2);
        } catch {
          responseText = respText;
        }
      } else {
        respJson = await fetchResponse.json();
        responseText = JSON.stringify(respJson, null, 2);
      }
    } else if (
      /^font\/|tar$|zip$|7z$|rtf$|msword$|excel$|\/pdf$|\/octet-stream$|^application\/vnd\./.test(
        contentType,
      )
    ) {
      responseIsBlob = true;
      responseBlobType = "download";
    } else if (contentType.startsWith("image")) {
      responseIsBlob = true;
      responseBlobType = "image";
    } else if (/^audio|^image|^video/.test(contentType)) {
      responseIsBlob = true;
      responseBlobType = "view";
    } else {
      respText = await fetchResponse.text();
      if (contentType.includes("xml")) {
        responseText = formatXml(respText, { textNodesOnSameLine: true, indentor: "  " });
      } else {
        responseText = respText;
      }
    }
    if (responseIsBlob) {
      const contentDisposition = fetchResponse.headers.get("content-disposition") || "";
      let filenameFromContentDisposition = "filename";
      if (contentDisposition) {
        const filenameStarRegexMatch = contentDisposition.match(/filename\*=\s*UTF-8''([^;]+)/);
        if (filenameStarRegexMatch) {
          filenameFromContentDisposition = decodeURIComponent(filenameStarRegexMatch[1]);
        } else {
          const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (filenameMatch) {
            filenameFromContentDisposition = filenameMatch[1];
          }
        }
      }
      respContentDisposition = filenameFromContentDisposition;
      respBlob = await fetchResponse.blob();
      if (typeof URL !== "undefined" && URL.createObjectURL) {
        responseBlobUrl = URL.createObjectURL(respBlob);
      }
    }
  } else {
    respText = await fetchResponse.text();
    responseText = respText;
  }

  return {
    responseText,
    respJson,
    respBlob,
    respText,
    responseIsBlob,
    responseBlobType,
    responseBlobUrl,
    respContentDisposition,
  };
}

/**
 * Pre-computes schema ASTs, examples, and headers for all response codes and MIME types.
 * Pure function extracted from api-response component to enable caching and unit testing.
 *
 * @param {object} responses - OpenAPI responses map
 * @param {object} [options]
 * @param {boolean|string} [options.callback=false]
 * @param {boolean|string} [options.webhook=false]
 * @returns {{
 *   headersForEachRespStatus: object,
 *   mimeResponsesForEachStatus: object,
 *   defaultStatus: string,
 *   defaultMimeType: string
 * }}
 */
export function prepareResponseDefinitions(responses, options = {}) {
  const { callback = false, webhook = false } = options;
  const isCallbackOrWebhook =
    callback === true || callback === "true" || webhook === true || webhook === "true";

  const headersForEachRespStatus = {};
  const mimeResponsesForEachStatus = {};
  let defaultStatus = "";
  let defaultMimeType = "";

  if (!responses || typeof responses !== "object") {
    return {
      headersForEachRespStatus,
      mimeResponsesForEachStatus,
      defaultStatus,
      defaultMimeType,
    };
  }

  for (const statusCode of Object.keys(responses)) {
    if (statusCode === "$$ref") {
      continue;
    }
    if (!defaultStatus) {
      defaultStatus = statusCode;
    }
    const allMimeResp = {};
    const content = responses[statusCode]?.content;

    if (content && typeof content === "object") {
      for (const mimeResp of Object.keys(content)) {
        const mimeRespObj = content[mimeResp];
        if (!defaultMimeType) {
          defaultMimeType = mimeResp;
        }

        const schemaTree = mimeRespObj?.schema ? schemaToAST(mimeRespObj.schema) : null;
        const respExamples = generateExample(
          mimeRespObj?.schema,
          mimeResp,
          standardizeExample(mimeRespObj?.examples),
          standardizeExample(mimeRespObj?.example),
          !isCallbackOrWebhook,
          isCallbackOrWebhook,
          mimeResp.includes("json") ? "json" : "text",
        );

        allMimeResp[mimeResp] = {
          description: responses[statusCode].description,
          examples: respExamples,
          selectedExample: respExamples[0]?.exampleId || "",
          schemaTree,
        };
      }
    }

    const tempHeaders = [];
    if (responses[statusCode]?.headers) {
      for (const key of Object.keys(responses[statusCode].headers)) {
        tempHeaders.push({ name: key, ...responses[statusCode].headers[key] });
      }
    }
    headersForEachRespStatus[statusCode] = tempHeaders;
    mimeResponsesForEachStatus[statusCode] = allMimeResp;
  }

  return {
    headersForEachRespStatus,
    mimeResponsesForEachStatus,
    defaultStatus,
    defaultMimeType,
  };
}
