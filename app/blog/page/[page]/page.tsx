import { POSTS_PER_PAGE } from "@/lib/constants";
import siteMetadata from "@/data/siteMetadata";
import { ListLayout } from "@/components/layouts/ListLayout";
import { allCoreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { Metadata } from "next";

export async function generateStaticParams() {
  const totalPosts = allBlogs;
  const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const posts = allCoreContent(sortedBlogPost(allBlogs));
  const pageNumber = Number.parseInt(page);
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  );
}