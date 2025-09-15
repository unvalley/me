"use client";

import type { Book, SortKey, ScatterItem } from "./types";

export const CARD_W = 160; // px
export const CARD_H = 240; // px
export const CARD_META_H = 44; // caption (title/author) height used for grid spacing
export const GAP = 24; // px

export const sortBooks = (books: Book[], key: SortKey): Book[] => {
  const sorted = [...books];
  sorted.sort((a, b) => {
    if (key === "title" || key === "author") {
      return a[key].localeCompare(b[key]);
    }
    if (key === "year" || key === "rating") {
      return b[key] - a[key];
    }
    return 0;
  });
  return sorted;
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const computeGridColumns = (containerW: number) => {
  const cols = Math.max(1, Math.floor((containerW + GAP) / (CARD_W + GAP)));
  return cols;
};

export const computeGridPosition = (
  index: number,
  containerW: number,
): { x: number; y: number } => {
  const cols = computeGridColumns(containerW);
  const col = index % cols;
  const row = Math.floor(index / cols);
  // Include caption height to prevent overlap between rows in grid mode
  return { x: col * (CARD_W + GAP), y: row * (CARD_H + CARD_META_H + GAP) };
};

export const makeInitialScatter = (
  ids: string[],
  containerW: number,
  containerH: number,
  existing?: Record<string, ScatterItem>,
): Record<string, ScatterItem> => {
  const xMax = Math.max(0, containerW - CARD_W);
  const yMax = Math.max(0, containerH - CARD_H);
  const next: Record<string, ScatterItem> = { ...(existing ?? {}) };
  for (const id of ids) {
    if (!next[id]) {
      next[id] = {
        x: Math.round(randomBetween(0, xMax)),
        y: Math.round(randomBetween(0, yMax)),
        rot: Math.round(randomBetween(-8, 8)),
        z: 1,
      };
    }
  }
  // Reassign z to ensure deterministic stacking
  let zBase = 10;
  ids.forEach((id) => {
    next[id].z = zBase++;
  });
  return next;
};

export const storage = {
  save: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  },
  load: <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
};
