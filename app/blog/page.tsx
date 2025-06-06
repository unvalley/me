import siteMetadata from "@/data/siteMetadata";
import { ListLayout } from "@/components/layouts/ListLayout";
import { allCoreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { Metadata } from "next";
import { POSTS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Blog - ${siteMetadata.author}`,
  description: siteMetadata.description,
};

export default async function Blog() {
  const posts = sortedBlogPost(allBlogs);
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={allCoreContent(posts)}
      initialDisplayPosts={allCoreContent(initialDisplayPosts)}
      pagination={pagination}
      title="ALL BLOG POSTS"
    />
  );
}