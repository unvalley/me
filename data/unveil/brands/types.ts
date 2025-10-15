export interface UnveilBrandMeta {
  slug: string;
  name: string;
  description: string;
  founded?: string;
  headquarters?: string;
  website?: string;
  heroImage?: string;
  keyTechnologies?: string[];
  focusKeywords?: string[];
}

export interface UnveilBrandDataset {
  meta: UnveilBrandMeta;
  items: Array<{
    slug: string;
    name: string;
    thumbnail?: string;
    summary?: string;
    focusKeywords?: string[];
  }>;
  overview?: {
    history?: string;
    designPhilosophy?: string;
    materials?: string[];
  };
  insights?: Array<{
    title: string;
    body: string;
  }>;
}
