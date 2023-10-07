import Link from "@/components/Link";
import { PageTitle }  from "@/components/PageTitle";
import { BlogSEO } from "@/components/SEO";
import ScrollTopAndComment from "@/components/ScrollTopAndComment";
import SectionContainer from "@/components/SectionContainer";
import siteMetadata from "@/data/siteMetadata";
import { CoreContent } from "@/lib/utils/contentlayer";
import formatDate from "@/lib/utils/formatDate";
import type { Blog } from "contentlayer/generated";
import { ReactNode } from "react";

interface Props {
    content: CoreContent<Blog>;
    children: ReactNode;
    next?: { slug: string; title: string };
    prev?: { slug: string; title: string };
}

export default function PostLayout({ content, next, prev, children }: Props) {
    const { slug, date, title } = content;

    return (
        <SectionContainer>
            <BlogSEO
                url={`${siteMetadata.siteUrl}/blog/${slug}`}
                {...content}
            />
            <ScrollTopAndComment />
            <article>
                <div>
                    <header>
                        <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
                            <dl>
                                <div>
                                    <dt className="sr-only">Published on</dt>
                                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                                        <time dateTime={date}>
                                            {formatDate(date)}
                                        </time>
                                    </dd>
                                </div>
                            </dl>
                            <div>
                                <PageTitle>{title}</PageTitle>
                            </div>
                        </div>
                    </header>
                    <div
                        className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
                        style={{ gridTemplateRows: "auto 1fr" }}
                    >
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
                            <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">
                                {children}
                            </div>
                        </div>
                        <footer>
                            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                                {prev && (
                                    <div className="pt-4 xl:pt-8">
                                        <Link
                                            href={`/blog/${prev.slug}`}
                                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        >
                                            &larr; {prev.title}
                                        </Link>
                                    </div>
                                )}
                                {next && (
                                    <div className="pt-4 xl:pt-8">
                                        <Link
                                            href={`/blog/${next.slug}`}
                                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                        >
                                            {next.title} &rarr;
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </footer>
                    </div>
                </div>
            </article>
        </SectionContainer>
    );
}
