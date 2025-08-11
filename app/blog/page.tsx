import { promises as fs } from "node:fs";
import path from "node:path";
import siteMetadata from "@/data/siteMetadata";
import type { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { PageTitle } from "@/components/PageTitle";

export const metadata: Metadata = {
  title: `Blog - ${siteMetadata.author}`,
  description: siteMetadata.description,
};

const articlesDirectory = path.join(process.cwd(), "app", "blog", "_articles");

export default async function BlogPage() {
  const articles = await fs.readdir(articlesDirectory);

  const items = [];
  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;
    const module = await import(`./_articles/${article}`);

    if (!module.metadata) throw new Error(`Missing \`metadata\` in ${article}`);

    items.push({
      slug: article.replace(/\.mdx$/, ""),
      title: module.metadata.title,
      date: module.metadata.date,
      description: module.metadata.description,
      tags: module.metadata.tags || [],
      draft: module.metadata.draft || false,
    });
  }

  // Filter out drafts and sort by date
  const publishedItems = items
    .filter((item) => !item.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <PageTitle>BLOG</PageTitle>
      </div>
      <BlogList items={publishedItems} />
    </div>
  );
}
