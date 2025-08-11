import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils/formatDate";

export default async function BlogPost(props: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const params = await props.params;
  const slug = params.slug.join("/");

  try {
    const { default: MDXContent, metadata } = await import(
      `../_articles/${slug}.mdx`
    );

    return (
      <article className="mx-auto py-4">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl">{metadata.title}</h1>
          <time className="text-gray-600 dark:text-gray-400">
            {formatDate(metadata.date)}
          </time>
        </div>
        <div className="prose prose-lg dark:prose-invert">
          <MDXContent />
        </div>
      </article>
    );
  } catch (_error) {
    notFound();
  }
}

export async function generateStaticParams() {
  const articles = await fs.readdir(
    path.join(process.cwd(), "app", "blog", "_articles")
  );

  return articles
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => ({
      slug: [name.replace(/\.mdx$/, "")],
    }));
}

export async function generateMetadata(props: {
  params: Promise<{
    slug: string[];
  }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug.join("/");

  try {
    const metadata = (await import(`../_articles/${slug}.mdx`)).metadata;
    return {
      title: metadata.title,
      description: metadata.description,
    };
  } catch {
    return {
      title: "Blog Post",
      description: "Blog post content",
    };
  }
}
