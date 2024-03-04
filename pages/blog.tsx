import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/components/layouts/ListLayout";
import { allCoreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import type { InferGetStaticPropsType } from "next";

export const POSTS_PER_PAGE = 8;

export type X = any

export const getStaticProps = async () => {
    const posts = sortedBlogPost(allBlogs);
    const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE);
    const pagination = {
        currentPage: 1,
        totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    };

    return {
        props: {
            initialDisplayPosts: allCoreContent(initialDisplayPosts),
            posts: allCoreContent(posts),
            pagination,
        },
    };
};

export default function Blog({
    posts,
    initialDisplayPosts,
    pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <PageSEO
                title={`Blog - ${siteMetadata.author}`}
                description={siteMetadata.description}
            />
            <ListLayout
                posts={posts}
                initialDisplayPosts={initialDisplayPosts}
                pagination={pagination}
                title="ALL BLOG POSTS"
            />
        </>
    );
}
