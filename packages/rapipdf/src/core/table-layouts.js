/* eslint-disable no-unused-vars */
export const rowLinesTableLayout = {
  hLineWidth(i, node) {
    return i === 1 || i === node.table.body.length ? 1 : 0.5;
  },
  vLineWidth() {
    return 0;
  },
  hLineColor(i, node) {
    return i === 0 || i === 1 || i === node.table.body.length ? "#777" : "lightgray";
  },
};

export const indentGuideLayout = {
  hLineWidth() {
    return 0;
  },
  hLineColor(i, node) {
    return i === 0 || i === node.table.body.length ? "black" : "lightgray";
  },
  vLineWidth(i, node) {
    return i === 0 && node.table.body.length > 3 ? 1 : 0;
  },
  vLineColor() {
    return "#F9EBEA";
  },
  paddingTop() {
    return 0;
  },
  paddingBottom() {
    return 0;
  },
};

export const noBorderLayout = {
  defaultBorder: false,
  hLineWidth() {
    return 0;
  },
  vLineWidth() {
    return 0;
  },
  paddingTop() {
    return 0;
  },
  paddingBottom() {
    return 0;
  },
};
