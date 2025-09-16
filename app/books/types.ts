export type Book = {
  // Use ISBN-13 as the unique id
  isbn: string;
  title: string;
  comment?: string;
  buyUrl?: string;
};

export type LayoutMode = "scatter" | "grid";
export type SortKey = "title";

export type ScatterItem = {
  x: number;
  y: number;
  rot: number; // deg
  z: number; // z-index
};
