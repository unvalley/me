import { MDXLayoutRenderer } from "@/components/MDXComponents";
import { PageTitle } from "@/components/PageTitle";
import { coreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import { allAuthors, allBlogs } from "contentlayer/generated";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const DEFAULT_LAYOUT = "PostSimple";

export async function generateStaticParams() {
  return allBlogs.map((p) => ({
    slug: p.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const post = allBlogs.find((p) => p.slug === slugStr);
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = post.authors || ["default"];
  const authorList = authors.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return authorResults?.name || author;
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: "./",
      siteName: post.title,
      locale: "ja_JP",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      authors: authorList,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const sortedPosts = sortedBlogPost(allBlogs);
  const postIndex = sortedPosts.findIndex((p) => p.slug === slugStr);
  const prevContent = sortedPosts[postIndex + 1] || null;
  const prev = prevContent ? coreContent(prevContent) : null;
  const nextContent = sortedPosts[postIndex - 1] || null;
  const next = nextContent ? coreContent(nextContent) : null;
  const post = sortedPosts.find((p) => p.slug === slugStr);
  
  if (!post) {
    notFound();
  }

  const authorList = post.authors || ["default"];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults);
  });

  return (
    <>
      {"draft" in post && post.draft !== true ? (
        <MDXLayoutRenderer
          layout={post.layout || DEFAULT_LAYOUT}
          toc={post.toc}
          content={post}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{" "}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  );
}