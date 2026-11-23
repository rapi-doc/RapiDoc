// The shape of a product comparison (components/ComparisonTable.astro). One data file per product:
// page-data/rapidoc-comparison.ts, page-data/rapi-mock-comparison.ts. Every cell about another product
// is checked against that product's own documentation, listed in `sources`, and `checked` says when.

/**
 * yes: included (and open source, for ours). partial: part of it, by hand, or only a basic part free.
 * paid: needs the vendor's paid or hosted plan. no: not offered.
 */
export type Verdict = 'yes' | 'partial' | 'paid' | 'no';

export interface Cell {
  verdict: Verdict;
  /** A few words: what it is, or the limit */
  text?: string;
  /** A second, smaller line */
  note?: string;
  /** Makes `text` a link (used in our column, to the docs) */
  href?: string;
}

export interface ComparisonProduct {
  key: string;
  name: string;
  /** Under our product's name in the header, e.g. "MIT · open source" */
  sub?: string;
}

export interface ComparisonRow {
  feature: string;
  /** One line under the feature, saying what it means */
  detail?: string;
  /** By product key; every product has a cell */
  cells: Record<string, Cell>;
}

export interface Comparison {
  /** The key of our product: its column comes first and is marked */
  ours: string;
  /** For screen readers, and the table's description */
  caption: string;
  products: ComparisonProduct[];
  /** Rows in groups; a group's title is a heading row */
  groups: { title?: string; rows: ComparisonRow[] }[];
  /** The legend's wording, where a comparison needs its own */
  legend?: Partial<Record<Verdict, string>>;
  /** The day the other products' docs were checked, as YYYY-MM-DD */
  checked: string;
  /** The pages each verdict was checked against, by product key */
  sources: Record<string, { label: string; url: string }[]>;
}
