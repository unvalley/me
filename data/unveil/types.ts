export type Marketplace = "mercari" | "yahoo-flea-market" | "rakuten" | "stockx";

export type Condition =
  | "new"
  | "used-like-new"
  | "used-good"
  | "used-fair";

export interface UnveilListing {
  id: string;
  title: string;
  marketplace: Marketplace;
  url: string;
  priceJPY: number | null;
  priceCurrency: string;
  priceLabel?: string;
  size?: string | null;
  color?: string | null;
  condition?: Condition | "unknown" | null;
  sold: boolean;
  lastSeen: string;
  listedAt?: string;
  tags: string[];
  notes?: string;
  thumbnail?: string;
}

export interface UnveilDatasetMeta {
  slug: string;
  brand: string;
  updatedAt: string;
  recordCount: number;
  sources: string[];
  summary: string;
  scopeNote?: string;
}

export interface UnveilDataset {
  meta: UnveilDatasetMeta;
  listings: UnveilListing[];
}

export interface UnveilManifest {
  defaultSlug?: string;
  datasets: UnveilDatasetMeta[];
}

export const marketplaceMeta: Record<Marketplace, { label: string; region: string }> = {
  mercari: {
    label: "メルカリ",
    region: "JP",
  },
  "yahoo-flea-market": {
    label: "ヤフオク! フリマ",
    region: "JP",
  },
  rakuten: {
    label: "楽天市場",
    region: "JP",
  },
  stockx: {
    label: "StockX",
    region: "US",
  },
};
