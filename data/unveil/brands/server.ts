import { promises as fs } from "node:fs";
import path from "node:path";

import type { UnveilBrandDataset, UnveilBrandMeta } from "./types";

const BRANDS_DIR = path.join(process.cwd(), "public", "unveil", "brands");
const PRETTY_DIR = path.join(BRANDS_DIR, "pretty");

async function readJsonFile<T>(filePath: string): Promise<T> {
  const contents = await fs.readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

async function readBrandFile(slug: string): Promise<UnveilBrandDataset> {
  const prettyPath = path.join(PRETTY_DIR, `${slug}.json`);
  try {
    return await readJsonFile<UnveilBrandDataset>(prettyPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    const legacyPath = path.join(BRANDS_DIR, `${slug}.json`);
    return readJsonFile<UnveilBrandDataset>(legacyPath);
  }
}

export async function loadBrandDataset(slug: string): Promise<UnveilBrandDataset> {
  const dataset = await readBrandFile(slug);
  if (!dataset.meta) {
    throw new Error(`Brand dataset "${slug}" is missing meta block`);
  }
  return dataset;
}

export interface BrandManifestEntry extends UnveilBrandMeta {
  itemCount: number;
}

export async function listBrandManifest(): Promise<BrandManifestEntry[]> {
  try {
    const manifestPath = path.join(BRANDS_DIR, "manifest.json");
    const manifest = await readJsonFile<Array<BrandManifestEntry>>(manifestPath);
    return manifest;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    // Fallback: scan pretty directory
    const entries: BrandManifestEntry[] = [];
    try {
      const files = await fs.readdir(PRETTY_DIR);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const slug = file.replace(/\.json$/, "");
        const dataset = await readBrandFile(slug);
        entries.push({
          ...dataset.meta,
          itemCount: dataset.items.length,
        });
      }
    } catch (scanError) {
      if ((scanError as NodeJS.ErrnoException).code !== "ENOENT") {
        throw scanError;
      }
    }
    return entries;
  }
}
