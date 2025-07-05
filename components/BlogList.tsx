"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";

interface BlogItem {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
}

interface BlogListProps {
  items: BlogItem[];
}

export function BlogList({ items }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [items, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredItems.map((item) => {
          const { slug, date, title, description, tags } = item;
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>
                        {new Date(date).toDateString()}
                      </time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl  leading-8 tracking-tight">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap">
                          {tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${tag}`}
                              className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
        {filteredItems.length === 0 && (
          <li className="py-12">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No articles found matching your search.
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
