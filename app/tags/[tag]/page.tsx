import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";
import siteMetadata from "@/data/siteMetadata";
import { kebabCase } from "@/lib/utils/kebabCase";
import type { Metadata } from "next";

const articlesDirectory = path.join(process.cwd(), "app", "blog", "_articles");

export async function generateStaticParams() {
  const articles = await fs.readdir(articlesDirectory);
  const allTags = new Set<string>();

  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;
    const module = await import(`../../blog/_articles/${article}`);
    if (!module.metadata) continue;

    const tags = module.metadata.tags || [];
    for (const tag of tags) {
      allTags.add(kebabCase(tag));
    }
  }

  return Array.from(allTags).map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag} - ${siteMetadata.title}`,
    description: `${tag} tags - ${siteMetadata.author}`,
  };
}

export default async function Tag({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const articles = await fs.readdir(articlesDirectory);

  const items = [];
  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;
    const module = await import(`../../blog/_articles/${article}`);

    if (!module.metadata) continue;

    const tags = module.metadata.tags || [];
    if (!tags.map((t: string) => kebabCase(t)).includes(tag)) continue;

    if (module.metadata.draft) continue;

    items.push({
      slug: article.replace(/\.mdx$/, ""),
      title: module.metadata.title,
      date: module.metadata.date,
      description: module.metadata.description,
      tags: module.metadata.tags || [],
    });
  }

  const sortedItems = items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const title = tag.split(" ").join("-");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <PageTitle>TAG: {title.toUpperCase()}</PageTitle>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {sortedItems.length} post{sortedItems.length !== 1 ? "s" : ""} tagged
          with "{title}"
        </p>
      </div>

      <ul className="space-y-1">
        {sortedItems.length === 0 && (
          <li className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No posts found for this tag.
            </p>
          </li>
        )}
        {sortedItems.map((item) => {
          const { slug, date, title } = item;
          return (
            <li key={slug} className="group">
              <Link
                href={`/blog/${slug}`}
                className="flex items-baseline justify-between gap-2 py-2"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {title}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                    {"·".repeat(3)}
                  </span>
                  <time
                    dateTime={date}
                    className="text-sm text-gray-500 dark:text-gray-400 tabular-nums group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
                  >
                    {formatDate(date)}
                  </time>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
