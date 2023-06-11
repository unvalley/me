import Link from "@/components/Link";
import NewsletterForm from "@/components/NewsletterForm";
import { PageSEO } from "@/components/SEO";
import Tag from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { allCoreContent, sortedBlogPost } from "@/lib/utils/contentlayer";
import formatDate from "@/lib/utils/formatDate";
import { allBlogs } from "contentlayer/generated";
import { InferGetStaticPropsType } from "next";

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
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <p
                        className={`mb-8 bg-clip-text text-4xl font-extrabold leading-[60px] tracking-tight text-transparent ${headingColorClass} md:text-6xl md:leading-[86px]`}
                    >
                        What's up
                    </p>
                    <p className="mt-4 mb-8">
                        This is an{" "}
                        <a
                            href="https://twitter.com/unvalley_"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-500"
                        >
                            @unvalley_
                        </a>{" "}
                        's blog.
                    </p>
                    <div className="flex flex-col">
                        {/* <Link href="/projects" className="hover:underline">
              <Twemoji emoji="hammer-and-wrench" /> What have I built?
            </Link>
            <Link href="/blog" className="hover:underline">
              <Twemoji emoji="memo" /> My writings
            </Link>
            <Link href="/snippets" className="hover:underline">
              <Twemoji emoji="dna" /> Useful snippets collected by me
            </Link>
            <Link href="/about" className="hover:underline">
              <Twemoji emoji="face-with-monocle" /> More about me and myself
            </Link>
            <Link href="/resume" className="hover:underline">
              <Twemoji emoji="briefcase" /> My resume
            </Link> */}
                    </div>
                </div>
                <hr />
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {!posts.length && "No posts found."}
                    {posts.slice(0, MAX_DISPLAY).map((post) => {
                        const { slug, date, title, summary, tags } = post;
                        return (
                            <li key={slug} className="py-12">
                                <article>
                                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
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
                                        <div className="space-y-5 xl:col-span-3">
                                            <div className="space-y-6">
                                                <div>
                                                    <h2 className="text-2xl font-bold leading-8 tracking-tight">
                                                        <Link
                                                            href={`/blog/${slug}`}
                                                            className="text-gray-900 dark:text-gray-100"
                                                        >
                                                            {title}
                                                        </Link>
                                                    </h2>
                                                    <div className="flex flex-wrap">
                                                        {tags.map((tag) => (
                                                            <Tag
                                                                key={tag}
                                                                text={tag}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                                                    {summary}
                                                </div>
                                            </div>
                                            <div className="text-base font-medium leading-6">
                                                <Link
                                                    href={`/blog/${slug}`}
                                                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                                    aria-label={`Read "${title}"`}
                                                >
                                                    Read more &rarr;
                                                </Link>
                                            </div>
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
                    <Link
                        href="/blog"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label="all posts"
                    >
                        All Posts &rarr;
                    </Link>
                </div>
            )}
            {siteMetadata.newsletter.provider !== "" && (
                <div className="flex items-center justify-center pt-4">
                    <NewsletterForm />
                </div>
            )}
        </>
    );
}
