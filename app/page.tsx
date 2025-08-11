import { promises as fs } from "node:fs";
import path from "node:path";
import { CustomLink } from "@/components/Link";
import siteMetadata from "@/data/siteMetadata";
import type { Metadata } from "next";

const MAX_DISPLAY = 8;

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

const articlesDirectory = path.join(process.cwd(), "app", "blog", "_articles");

export default async function Home() {
  const articles = await fs.readdir(articlesDirectory);

  const items = [];
  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;
    const module = await import(`./blog/_articles/${article}`);

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
  const posts = items
    .filter((item) => !item.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="">
      <ul className="space-y-1">
        {!posts.length && (
          <li className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No posts found.
            </p>
          </li>
        )}
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title } = post;
          return (
            <li key={slug} className="group">
              <CustomLink
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
              </CustomLink>
            </li>
          );
        })}
      </ul>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6 pt-4 pb-8">
          <CustomLink
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </CustomLink>
        </div>
      )}
    </div>
  );
}
