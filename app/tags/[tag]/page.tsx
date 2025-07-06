import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
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
    tags.forEach((tag: string) => allTags.add(kebabCase(tag)));
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
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const title = tag.split(" ").join("-");

  return (
    <div className="">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Tag: {title}
        </h1>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedItems.map((item) => {
          const { slug, date, title, description } = item;
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>
                        {new Date(date).toDateString()}
                      </time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl leading-8 tracking-tight">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h2>
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
    </div>
  );
}
