import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export default async function BlogPost(props: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const params = await props.params;
  const slug = params.slug.join("/");

  try {
    const { default: MDXContent, metadata } = await import(
      "../_articles/" + `${slug}.mdx`
    );

    return (
      <article className="mx-auto max-w-2xl py-16">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl ">{metadata.title}</h1>
          <time className="text-gray-600 dark:text-gray-400">
            {new Date(metadata.date).toDateString()}
          </time>
        </div>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent />
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  const articles = await fs.readdir(
    path.join(process.cwd(), "app", "blog", "_articles"),
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
    const metadata = (await import("../_articles/" + `${slug}.mdx`)).metadata;
    return {
      title: metadata.title,
      description: metadata.summary || metadata.description,
    };
  } catch {
    return {
      title: "Blog Post",
      description: "Blog post content",
    };
  }
}
