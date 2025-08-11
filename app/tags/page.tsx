import { promises as fs } from "node:fs";
import path from "node:path";
import { CustomLink } from "@/components/Link";
import { Tag } from "@/components/Tag";
import { PageTitle } from "@/components/PageTitle";
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
    <div className="flex flex-wrap gap-4">
      {Object.keys(tags).length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No tags found.</p>
      )}
      {sortedTags.map((t) => {
        return (
          <div key={t} className="flex items-center gap-1">
            <Tag text={t} />
            <CustomLink
              href={`/tags/${kebabCase(t)}`}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              ({tags[t]})
            </CustomLink>
          </div>
        );
      })}
    </div>
  );
}
