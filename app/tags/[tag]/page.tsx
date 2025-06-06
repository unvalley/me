import siteMetadata from "@/data/siteMetadata";
import { ListLayout } from "@/components/layouts/ListLayout";
import { allCoreContent, getAllTags } from "@/lib/utils/contentlayer";
import { kebabCase } from "@/lib/utils/kebabCase";
import { allBlogs } from "contentlayer/generated";
import { Metadata } from "next";

export async function generateStaticParams() {
  const tags = await getAllTags(allBlogs);

  return Object.keys(tags).map((tag) => ({
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

export default async function Tag({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const filteredPosts = allCoreContent(
    allBlogs.filter(
      (post) =>
        post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag),
    ),
  );

  // Capitalize first letter and convert space to dash
  const title = tag.split(" ").join("-");

  return <ListLayout posts={filteredPosts} title={title} />;
}