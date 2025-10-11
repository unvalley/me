import { promises as fs } from "node:fs";
import path from "node:path";

import type { UnveilDataset, UnveilManifest } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "unveil");

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

export async function loadUnveilManifest(): Promise<UnveilManifest> {
  const manifest = await readJsonFile<UnveilManifest>("manifest.json");
  if (!manifest.datasets || manifest.datasets.length === 0) {
    throw new Error("UNVEIL manifest has no dataset entries");
  }
  return manifest;
}

export async function listUnveilBrandOptions(): Promise<
  Array<{ slug: string; label: string }>
> {
  const manifest = await loadUnveilManifest();
  return manifest.datasets.map((dataset) => ({
    slug: dataset.slug,
    label: dataset.brand,
  }));
}

export async function loadUnveilDataset(slug: string): Promise<UnveilDataset> {
  const dataset = await readJsonFile<UnveilDataset>(`${slug}.json`);
  if (!dataset.meta.recordCount || dataset.meta.recordCount !== dataset.listings.length) {
    dataset.meta.recordCount = dataset.listings.length;
  }
  return dataset;
}

export async function loadDefaultUnveilDataset(): Promise<UnveilDataset> {
  const manifest = await loadUnveilManifest();
  const fallback = manifest.datasets[0]?.slug;
  const slug = manifest.defaultSlug ?? fallback;
  if (!slug) {
    throw new Error("UNVEIL manifest is missing defaultSlug and datasets entries");
  }
  return loadUnveilDataset(slug);
}
