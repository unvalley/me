import { CustomLink } from "@/components/Link";
import { PageTitle } from "@/components/PageTitle";
import Pagination from "@/components/Pagination";
import { Tag } from "@/components/Tag";
import { CoreContent } from "@/lib/utils/contentlayer";
import formatDate from "@/lib/utils/formatDate";
import type { Blog } from "contentlayer/generated";
import { ComponentProps, useState } from "react";

interface Props {
    posts: CoreContent<Blog>[];
    title: string;
    initialDisplayPosts?: CoreContent<Blog>[];
    pagination?: ComponentProps<typeof Pagination>;
}

export default function ListLayout({
    posts,
    title,
    initialDisplayPosts = [],
    pagination,
}: Props) {
    const [searchValue, setSearchValue] = useState("");
    const filteredBlogPosts = posts.filter((post) => {
        const searchContent = post.title + post.summary + post.tags.join(" ");
        return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    });

    // If initialDisplayPosts exist, display it if no searchValue is specified
    const displayPosts =
        initialDisplayPosts.length > 0 && !searchValue
            ? initialDisplayPosts
            : filteredBlogPosts;

    return (
        <>
            <div className="divide-y">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <PageTitle>{title}</PageTitle>
                    <div className="relative max-w-lg">
                        <input
                            aria-label="Search articles"
                            type="text"
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search articles"
                            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        />
                        <svg
                            className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <title>Search</title>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                <ul>
                    {!filteredBlogPosts.length && "No posts found."}
                    {displayPosts.map((post) => {
                        const { slug, date, title, summary, tags } = post;
                        return (
                            <li key={slug} className="py-4">
                                <article className="space-y-2 xl:items-baseline">
                                    <span className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                                        <time dateTime={date}>
                                            {formatDate(date)}
                                        </time>
                                    </span>
                                    <div className="space-y-3">
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
            {pagination && pagination.totalPages > 1 && !searchValue && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </>
    );
}
