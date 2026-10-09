import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { processFetchResponse } from '../../packages/rapidoc/src/utils/response-utils.ts';

describe('processFetchResponse', () => {
  it('should parse JSON response and format with 2-space indentation', async () => {
    const rawData = { id: 101, message: 'hello', tags: ['a', 'b'] };
    const response = new Response(JSON.stringify(rawData), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseIsBlob, false);
    assert.equal(result.responseText, JSON.stringify(rawData, null, 2));
    assert.deepEqual(result.respJson, rawData);
  });

  it('should parse application/x-ndjson as raw text', async () => {
    const ndjson = '{"line":1}\n{"line":2}\n';
    const response = new Response(ndjson, {
      headers: { 'content-type': 'application/x-ndjson' },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseIsBlob, false);
    assert.equal(result.responseText, ndjson);
  });

  it('should format XML responses with indentations', async () => {
    const xml = '<root><user id="1"><name>Alice</name></user></root>';
    const response = new Response(xml, {
      headers: { 'content-type': 'application/xml' },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseIsBlob, false);
    assert.ok(result.responseText.includes('<root>'));
    assert.ok(result.responseText.includes('  <user id="1">'));
    assert.ok(result.responseText.includes('    <name>Alice</name>'));
  });

  it('should identify binary PDF responses as download blobs and extract filename from Content-Disposition', async () => {
    const pdfData = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
    const response = new Response(pdfData, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="report-2026.pdf"',
      },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseIsBlob, true);
    assert.equal(result.responseBlobType, 'download');
    assert.equal(result.respContentDisposition, 'report-2026.pdf');
    assert.ok(result.responseBlobUrl);
  });

  it('should support RFC 5987 encoded filename* in Content-Disposition header', async () => {
    const data = new Uint8Array([1, 2, 3]);
    const response = new Response(data, {
      headers: {
        'content-type': 'application/octet-stream',
        'content-disposition': "attachment; filename*=UTF-8''my%20document.zip",
      },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseIsBlob, true);
    assert.equal(result.respContentDisposition, 'my document.zip');
  });

  it('should handle empty responses gracefully', async () => {
    const response = new Response('', {
      headers: { 'content-type': 'text/plain' },
    });

    const result = await processFetchResponse(response);
    assert.equal(result.responseText, '');
    assert.equal(result.responseIsBlob, false);
  });
});
