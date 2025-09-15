export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  rating: number; // 0-5
  coverUrl: string;
  description: string;
  buyUrl?: string;
};

export type LayoutMode = "scatter" | "grid";
export type SortKey = "title" | "author" | "year" | "rating";

export type ScatterItem = {
  x: number;
  y: number;
  rot: number; // deg
  z: number; // z-index
};

