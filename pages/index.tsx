import { CustomLink } from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import { Tag } from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { allCoreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import formatDate from "@/lib/utils/formatDate";
import { allBlogs } from "contentlayer/generated";
import { InferGetStaticPropsType } from "next";
import { PageTitle } from "@/components/PageTitle";

const MAX_DISPLAY = 5;

export const getStaticProps = async () => {
    // TODO: move computation to get only the essential frontmatter to contentlayer.config
    const sortedPosts = sortedBlogPost(allBlogs);
    const posts = allCoreContent(sortedPosts);
    return { props: { posts } };
};

export default function Home({
    posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const headingColorClass =
        "bg-gradient-to-r from-blue-600 to-orange-600 dark:bg-gradient-to-l dark:from-emerald-500 dark:to-lime-600";
    return (
        <>
            <PageSEO
                title={siteMetadata.title}
                description={siteMetadata.description}
            />
            <div className="divide-y">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <h1
                        className="text-4xl
                        leading-9
                        tracking-tight
                        text-gray-900
                        dark:text-gray-100
                        sm:text-3xl
                        sm:leading-10
                        md:text-4xl
                        md:leading-14
                        font-helvetica
                        uppercase
                        "
                    >
                        <a
                            href="https://x.com/unvalley_"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-500"
                        >
                            unvalley
                        </a>{" "}
                        is a software engineer driven by coffee and music.
                    </h1>
                </div>
                <ul>
                    {!posts.length && "No posts found."}
                    {posts.slice(0, MAX_DISPLAY).map((post) => {
                        const { slug, date, title, summary, tags } = post;
                        return (
                            <li key={slug} className="py-4">
                                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                                    <dl>
                                        <dt className="sr-only">
                                            Published on
                                        </dt>
                                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                                            <time dateTime={date}>
                                                {formatDate(date)}
                                            </time>
                                        </dd>
                                    </dl>
                                    <div className="space-y-3 xl:col-span-3">
                                        <div>
                                            <h3 className="text-2xl leading-8 tracking-tight">
                                                <CustomLink
                                                    href={`/blog/${slug}`}
                                                    className="text-gray-900 dark:text-gray-100"
                                                >
                                                    {title}
                                                </CustomLink>
                                            </h3>
                                            <div className="flex flex-wrap">
                                                {tags.map((tag) => (
                                                    <Tag key={tag} text={tag} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                                            {summary}
                                        </div>
                                    </div>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {posts.length > MAX_DISPLAY && (
                <div className="flex justify-end text-base font-medium leading-6">
                    <CustomLink
                        href="/blog"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label="all posts"
                    >
                        All Posts &rarr;
                    </CustomLink>
                </div>
            )}
        </>
    );
}
