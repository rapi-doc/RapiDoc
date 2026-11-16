import pdfMake from "pdfmake/build/pdfmake.min.js";
import fontFiles from "./vfs_fonts.js";

const FONTS = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-Medium.ttf",
  },
  RobotoMono: {
    normal: "RobotoMono-Regular.ttf",
    bold: "RobotoMono-Regular.ttf",
    italics: "RobotoMono-Regular.ttf",
    bolditalics: "RobotoMono-Regular.ttf",
  },
};

let fontsRegistered = false;

/** The document as pdfmake's output object: `open()`, `download(name)`, `getBlob()`, `getBuffer()`. */
export function createPdf(docDefinition) {
  if (!fontsRegistered) {
    pdfMake.addVirtualFileSystem(fontFiles);
    pdfMake.addFonts(FONTS);
    fontsRegistered = true;
  }
  return pdfMake.createPdf(docDefinition);
}

/** Renders a document definition with pdfmake and opens the PDF in a new window. */
export async function openPdf(docDefinition) {
  await createPdf(docDefinition).open();
}
