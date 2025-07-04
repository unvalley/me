import { promises as fs } from "fs";
import path from "path";
import { CustomLink } from "@/components/Link";
import { Tag } from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { formatDate } from "@/lib/utils/formatDate";
import { Metadata } from "next";

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
    const module = await import("./blog/_articles/" + article);

    if (!module.metadata) throw new Error("Missing `metadata` in " + article);

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

  return (
    <div className="">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {!posts.length && (
          <li className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No posts found.
            </p>
          </li>
        )}
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title, description, tags } = post;
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div className="space-y-1">
                      <div>
                        <h2 className="text-2xl leading-8 tracking-tight">
                          <CustomLink
                            href={`/blog/${slug}`}
                            className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {title}
                          </CustomLink>
                        </h2>
                        <div className="flex flex-wrap py-2">
                          {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
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
