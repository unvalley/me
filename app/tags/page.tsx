import { promises as fs } from "node:fs";
import path from "node:path";
import { CustomLink } from "@/components/Link";
import { Tag } from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { kebabCase } from "@/lib/utils/kebabCase";
import type { Metadata } from "next";
import GithubSlugger from "github-slugger";

export const metadata: Metadata = {
  title: `Tags - ${siteMetadata.author}`,
  description: "Things I blog about",
};

const articlesDirectory = path.join(process.cwd(), "app", "blog", "_articles");

async function getAllTags() {
  const articles = await fs.readdir(articlesDirectory);
  const tagCount: Record<string, number> = {};
  const githubSlugger = new GithubSlugger();

  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;
    const module = await import(`../blog/_articles/${article}`);

    if (!module.metadata || module.metadata.draft) continue;

    const tags = module.metadata.tags || [];
    for (const tag of tags) {
      const formattedTag = githubSlugger.slug(tag);
      if (formattedTag in tagCount) {
        tagCount[formattedTag] += 1;
      } else {
        tagCount[formattedTag] = 1;
      }
    }
  }

  return tagCount;
}

export default async function Tags() {
  const tags = await getAllTags();
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

  return (
    <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
          Tags
        </h1>
      </div>
      <div className="flex max-w-lg flex-wrap">
        {Object.keys(tags).length === 0 && "No tags found."}
        {sortedTags.map((t) => {
          return (
            <div key={t} className="mt-2 mb-2 mr-5">
              <Tag text={t} />
              <CustomLink
                href={`/tags/${kebabCase(t)}`}
                className="-ml-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                {` (${tags[t]})`}
              </CustomLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
