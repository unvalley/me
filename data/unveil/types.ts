export type Marketplace =
  | "mercari"
  | "yahoo-flea-market"
  | "rakuten"
  | "stockx";

export type Condition = "new" | "used-like-new" | "used-good" | "used-fair";

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
  datasets: UnveilDatasetMeta[];
  defaultSlug?: string;
}

export const marketplaceMeta: Record<
  Marketplace,
  { label: string; region: string }
> = {
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

export interface UnveilBrandSpotlightItem {
  slug: string;
  name: string;
  description?: string;
  thumbnail?: string;
  highlights?: string[];
  aliases?: string[];
}

export interface UnveilBrandProfile {
  slug: string;
  name: string;
  headline?: string;
  summary: string;
  story?: string;
  heroImage?: string;
  focusAreas?: string[];
  foundedIn?: string;
  headquarters?: string;
  spotlightItems?: UnveilBrandSpotlightItem[];
  resources?: Array<{ title: string; url: string }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}
