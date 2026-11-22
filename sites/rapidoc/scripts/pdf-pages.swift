// Renders pages of a PDF to PNG files with macOS's PDFKit, for rapipdf-images.mjs.
//
//   swift sites/rapidoc/scripts/pdf-pages.swift <file.pdf> <out-prefix> <scale> <page> [<page> ...]
//
// Pages count from 1; each is written to <out-prefix>-<page>.png on a white background, at <scale>
// times its size in points. Prints the page count first, so the caller can check its page numbers.

import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 5, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])), let scale = Double(args[3]) else {
  FileHandle.standardError.write("usage: pdf-pages.swift <file.pdf> <out-prefix> <scale> <page>...\n".data(using: .utf8)!)
  exit(1)
}
print("pages \(doc.pageCount)")

for arg in args[4...] {
  guard let n = Int(arg), n >= 1, n <= doc.pageCount, let page = doc.page(at: n - 1) else { continue }
  let box = page.bounds(for: .mediaBox)
  let width = Int(box.width * scale)
  let height = Int(box.height * scale)
  guard let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4,
    hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)
  else { continue }
  NSGraphicsContext.saveGraphicsState()
  let ctx = NSGraphicsContext(bitmapImageRep: rep)!
  NSGraphicsContext.current = ctx
  let cg = ctx.cgContext
  cg.setFillColor(NSColor.white.cgColor)
  cg.fill(CGRect(x: 0, y: 0, width: width, height: height))
  cg.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: cg)
  NSGraphicsContext.restoreGraphicsState()
  let file = "\(args[2])-\(n).png"
  try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: file))
  print(file)
}
