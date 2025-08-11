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
      return item.title.toLowerCase().includes(query);
    });
  }, [items, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <ul className="space-y-1">
        {filteredItems.map((item) => {
          const { slug, date, title } = item;
          return (
            <li key={slug} className="group">
              <Link
                href={`/blog/${slug}`}
                className="flex items-baseline justify-between gap-2 py-2"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {title}
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
                    {"·".repeat(3)}
                  </span>
                  <time
                    dateTime={date}
                    className="text-sm text-gray-500 dark:text-gray-400 tabular-nums group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
                  >
                    {formatDate(date)}
                  </time>
                </span>
              </Link>
            </li>
          );
        })}
        {filteredItems.length === 0 && (
          <li className="py-8">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No articles found matching your search.
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
