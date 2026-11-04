/**
 * A minimal ZIP writer (stored entries, no compression) for the exported MCP project, so the
 * download needs no library. Entries are UTF-8 text files.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * @param {Record<string, string>} files path → text content, in the order they should be stored
 * @returns {Uint8Array} the archive
 */
export function createZip(files) {
  const encoder = new TextEncoder();
  const entries = Object.entries(files).map(([path, text]) => ({
    name: encoder.encode(path),
    data: encoder.encode(String(text ?? "")),
  }));
  for (const e of entries) e.crc = crc32(e.data);

  const localSize = entries.reduce((n, e) => n + 30 + e.name.length + e.data.length, 0);
  const centralSize = entries.reduce((n, e) => n + 46 + e.name.length, 0);
  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);
  let pos = 0;
  const u16 = (v) => {
    view.setUint16(pos, v, true);
    pos += 2;
  };
  const u32 = (v) => {
    view.setUint32(pos, v >>> 0, true);
    pos += 4;
  };
  const bytes = (b) => {
    out.set(b, pos);
    pos += b.length;
  };
  // Fixed timestamp (1980-01-01 00:00), flag bit 11: names are UTF-8
  const DOS_TIME = 0;
  const DOS_DATE = 0x21;
  const FLAGS = 0x0800;

  for (const e of entries) {
    e.offset = pos;
    u32(0x04034b50);
    u16(20);
    u16(FLAGS);
    u16(0); // stored
    u16(DOS_TIME);
    u16(DOS_DATE);
    u32(e.crc);
    u32(e.data.length);
    u32(e.data.length);
    u16(e.name.length);
    u16(0);
    bytes(e.name);
    bytes(e.data);
  }
  const centralOffset = pos;
  for (const e of entries) {
    u32(0x02014b50);
    u16(20);
    u16(20);
    u16(FLAGS);
    u16(0);
    u16(DOS_TIME);
    u16(DOS_DATE);
    u32(e.crc);
    u32(e.data.length);
    u32(e.data.length);
    u16(e.name.length);
    u16(0);
    u16(0);
    u16(0);
    u16(0);
    u32(0);
    u32(e.offset);
    bytes(e.name);
  }
  u32(0x06054b50);
  u16(0);
  u16(0);
  u16(entries.length);
  u16(entries.length);
  u32(centralSize);
  u32(centralOffset);
  u16(0);
  return out;
}
