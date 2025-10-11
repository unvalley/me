import type { Metadata } from "next";
import { UnveilClient } from "./Client";
import { loadDefaultUnveilDataset } from "@/data/unveil/server";

export const metadata: Metadata = {
  title: "UNVEIL",
  description: "厳選されたブランドの二次流通品を探すための新しいツール",
  alternates: {
    canonical: "/unveil",
  },
  openGraph: {
    title: "UNVEIL",
    description: "厳選されたブランドの二次流通品を探すための新しいツール",
    url: "https://unvalley.me/unveil",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function UnveilPage() {
  const dataset = await loadDefaultUnveilDataset();
  return <UnveilClient dataset={dataset} />;
}
