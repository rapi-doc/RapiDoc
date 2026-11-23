// The shape of a product comparison (components/ComparisonTable.astro). One data file per product,
// e.g. page-data/rapi-mock-comparison.ts. Every verdict about another product is checked against that
// product's own documentation, listed in `sources`, and `checked` says when.

/** yes: supported. partial: by hand, a plugin, a paid plan, or part of the row. no: not supported. */
export type Verdict = 'yes' | 'partial' | 'no';

export interface Cell {
  verdict: Verdict;
  /** A few words where the verdict needs them: the limit, the plan, how */
  note?: string;
}

export interface ComparisonProduct {
  key: string;
  name: string;
  url: string;
}

export interface ComparisonRow {
  feature: string;
  /** One line under the feature, saying what it means */
  detail?: string;
  /** By product key; every product has a cell */
  cells: Record<string, Cell>;
}

export interface Comparison {
  /** The key of our product: its column is marked */
  ours: string;
  /** For screen readers, and the table's description */
  caption: string;
  products: ComparisonProduct[];
  rows: ComparisonRow[];
  /** The day the other products' docs were checked, as YYYY-MM-DD */
  checked: string;
  /** The pages each verdict was checked against, by product key */
  sources: Record<string, { label: string; url: string }[]>;
  /** How to report a wrong cell */
  correction: string;
}
