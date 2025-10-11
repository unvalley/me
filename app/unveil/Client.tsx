"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import {
  marketplaceMeta,
  type Condition,
  type Marketplace,
  type UnveilDataset,
  type UnveilListing,
} from "@/data/unveil/client";

const conditionLabels: Record<Condition, string> = {
  new: "新品",
  "used-like-new": "中古・ほぼ新品",
  "used-good": "中古・良品",
  "used-fair": "中古・使用感あり",
};

const defaultCondition: Condition = "used-good";

const normalizeCondition = (value: UnveilListing["condition"]): Condition => {
  if (!value) return defaultCondition;
  if (value === "new" || value === "used-like-new" || value === "used-good" || value === "used-fair") {
    return value;
  }
  const normalized = value.toLowerCase();
  if (normalized.includes("新品") || normalized.includes("new")) {
    return "new";
  }
  if (normalized.includes("like") || normalized.includes("美品")) {
    return "used-like-new";
  }
  if (normalized.includes("fair") || normalized.includes("傷")) {
    return "used-fair";
  }
  if (normalized.includes("used") || normalized.includes("中古")) {
    return "used-good";
  }
  return defaultCondition;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
});

type SortKey = "recent" | "price-asc" | "price-desc";

type PriceRange = {
  min: number | null;
  max: number | null;
};

export interface UnveilClientProps {
  dataset: UnveilDataset;
}

export function UnveilClient({ dataset }: UnveilClientProps) {
  const { listings, meta } = dataset;

  const uniqueMarketplaces = useMemo(
    () => Array.from(new Set(listings.map((item) => item.marketplace))),
    [listings]
  );

  const uniqueConditions = useMemo(() => {
    const result = new Set<Condition>();
    for (const listing of listings) {
      result.add(normalizeCondition(listing.condition));
    }
    const entries = Array.from(result);
    return entries.length ? entries : [defaultCondition];
  }, [listings]);

  const tagStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of listings) {
      for (const tag of listing.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [listings]);

  const priceStats = useMemo(() => {
    const prices = listings
      .map((item) => item.priceJPY)
      .filter((value): value is number => typeof value === "number");
    if (!prices.length) return { min: null as number | null, max: null as number | null };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [listings]);

  const [query, setQuery] = useState("");
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Marketplace[] | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<Condition[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: priceStats.min,
    max: priceStats.max,
  });

  useEffect(() => {
    setPriceRange((prev) => ({
      min: prev.min ?? priceStats.min ?? null,
      max: prev.max ?? priceStats.max ?? null,
    }));
  }, [priceStats.max, priceStats.min]);

  const toggleMarketplace = (marketplace: Marketplace) => {
    setSelectedMarketplaces((prev) => {
      if (prev === null) {
        const next = uniqueMarketplaces.filter((item) => item !== marketplace);
        return next.length === uniqueMarketplaces.length ? null : next;
      }

      if (prev.includes(marketplace)) {
        const next = prev.filter((value) => value !== marketplace);
        return next.length === 0 ? null : next;
      }

      const next = [...prev, marketplace];
      return next.length === uniqueMarketplaces.length ? null : next;
    });
  };

  const toggleCondition = (condition: Condition) => {
    setSelectedConditions((prev) => {
      if (prev === null) {
        const next = uniqueConditions.filter((item) => item !== condition);
        return next.length === uniqueConditions.length ? null : next;
      }

      if (prev.includes(condition)) {
        const next = prev.filter((value) => value !== condition);
        return next.length === 0 ? null : next;
      }

      const next = [...prev, condition];
      return next.length === uniqueConditions.length ? null : next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((value) => value !== tag);
      }
      return [...prev, tag];
    });
  };

  const visibleListings = useMemo(() => {
    const activeMarketplaces = selectedMarketplaces ?? uniqueMarketplaces;
    const activeConditions = selectedConditions ?? uniqueConditions;

    return listings
      .filter((listing) => {
        const matchesMarketplace = activeMarketplaces.includes(listing.marketplace);
        const listingCondition = normalizeCondition(listing.condition);
        const matchesCondition = activeConditions.includes(listingCondition);
        const matchesAvailability = onlyAvailable ? !listing.sold : true;

        if (!matchesMarketplace || !matchesCondition || !matchesAvailability) {
          return false;
        }

        if (selectedTags.length > 0) {
          const tagMatch = selectedTags.every((tag) => (listing.tags ?? []).includes(tag));
          if (!tagMatch) return false;
        }

        if (priceRange.min !== null && listing.priceJPY !== undefined && listing.priceJPY !== null) {
          if (listing.priceJPY < priceRange.min) return false;
        }

        if (priceRange.max !== null && listing.priceJPY !== undefined && listing.priceJPY !== null) {
          if (listing.priceJPY > priceRange.max) return false;
        }

        if (!query.trim()) return true;
        const normalized = query.trim().toLowerCase();

        return (
          listing.title.toLowerCase().includes(normalized) ||
          (listing.color?.toLowerCase().includes(normalized) ?? false) ||
          (listing.size?.toLowerCase().includes(normalized) ?? false) ||
          (listing.tags ?? []).some((tag) => tag.toLowerCase().includes(normalized)) ||
          listing.notes?.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.priceJPY ?? Number.MAX_SAFE_INTEGER) - (b.priceJPY ?? Number.MAX_SAFE_INTEGER);
        }
        if (sortBy === "price-desc") {
          return (b.priceJPY ?? 0) - (a.priceJPY ?? 0);
        }
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      });
  }, [
    listings,
    onlyAvailable,
    priceRange.max,
    priceRange.min,
    query,
    selectedConditions,
    selectedMarketplaces,
    selectedTags,
    sortBy,
    uniqueConditions,
    uniqueMarketplaces,
  ]);

  const handlePriceChange = (key: keyof PriceRange, value: string) => {
    const numeric = value === "" ? null : Number.parseInt(value, 10) || null;
    setPriceRange((prev) => ({
      ...prev,
      [key]: numeric,
    }));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
        <aside className="hidden space-y-8 lg:block">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-zinc-400">
              フィルター
            </h2>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-zinc-300">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
                マーケットプレイス
              </p>
              <div className="space-y-2">
                {uniqueMarketplaces.map((marketplace) => {
                  const isChecked =
                    selectedMarketplaces === null ||
                    selectedMarketplaces.includes(marketplace);
                  const meta =
                    marketplaceMeta[marketplace] ?? {
                      label: marketplace,
                      region: "--",
                    };
                  return (
                    <label
                      key={marketplace}
                      className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMarketplace(marketplace)}
                          className="h-3.5 w-3.5 accent-black dark:accent-white"
                        />
                        {meta.label}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
                        {meta.region}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
              コンディション
            </p>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-zinc-300">
              {uniqueConditions.map((condition) => {
                const isChecked =
                  selectedConditions === null || selectedConditions.includes(condition);
                return (
                  <label
                    key={condition}
                    className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 transition hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCondition(condition)}
                      className="h-3.5 w-3.5 accent-black dark:accent-white"
                    />
                    {conditionLabels[condition]}
                  </label>
                );
              })}
            </div>
          </section>

          {priceStats.min !== null && priceStats.max !== null ? (
            <section className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
                価格帯 (JPY)
              </p>
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-zinc-300">
                <input
                  type="number"
                  value={priceRange.min ?? ""}
                  min={priceStats.min}
                  max={priceStats.max}
                  placeholder={`${priceStats.min.toLocaleString()}`}
                  onChange={(event) => handlePriceChange("min", event.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-neutral-900 dark:border-zinc-700 dark:focus:border-zinc-300"
                />
                <span className="text-neutral-400">—</span>
                <input
                  type="number"
                  value={priceRange.max ?? ""}
                  min={priceStats.min}
                  max={priceStats.max}
                  placeholder={`${priceStats.max.toLocaleString()}`}
                  onChange={(event) => handlePriceChange("max", event.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-neutral-900 dark:border-zinc-700 dark:focus:border-zinc-300"
                />
              </div>
            </section>
          ) : null}

          {tagStats.length ? (
            <section className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
                クイックフィルター
              </p>
              <div className="flex flex-wrap gap-2">
                {tagStats.map(([tag]) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                          : "border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}
        </aside>

        <section className="space-y-8">
          <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <SearchBar
                onSearch={setQuery}
                placeholder="アイテム名・カラー・サイズ・タグを検索"
                ariaLabel={`${meta.brand}の出品を検索`}
              />
              <div className="flex w-full flex-col gap-3 text-sm lg:w-auto lg:flex-row lg:items-center">
                <label className="flex cursor-pointer items-center gap-2 text-neutral-600 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={() => setOnlyAvailable((value) => !value)}
                    className="h-3.5 w-3.5 accent-black dark:accent-white"
                  />
                  販売中のみ
                </label>

                <div className="flex items-center gap-2 text-neutral-500 dark:text-zinc-400">
                  並び替え
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="rounded-md border border-neutral-300 bg-transparent px-2 py-1 text-sm text-neutral-700 focus:border-neutral-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-zinc-300"
                  >
                    <option value="recent">最新順</option>
                    <option value="price-asc">価格が安い順</option>
                    <option value="price-desc">価格が高い順</option>
                  </select>
                </div>
              </div>
            </div>

            {tagStats.length ? (
              <div className="flex flex-wrap gap-2 lg:hidden">
                {tagStats.map(([tag]) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wide transition ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                          : "border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                  >
                    {tag}
                    <span className="text-neutral-400">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="text-neutral-400 underline decoration-dotted underline-offset-4 hover:text-neutral-700 dark:hover:text-zinc-200"
                  onClick={() => setSelectedTags([])}
                >
                  クリア
                </button>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-800 dark:text-zinc-100">
                {meta.brand} — {visibleListings.length}件
              </h2>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
                {new Date().toLocaleDateString("ja-JP")}
              </p>
            </div>

            {visibleListings.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-10 text-center text-neutral-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
                条件に合う出品が見つかりません。フィルターを調整してみてください。
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleListings.map((listing) => {
                  const metaInfo =
                    marketplaceMeta[listing.marketplace] ?? {
                      label: listing.marketplace,
                      region: "--",
                    };
                  const priceLabel =
                    listing.priceLabel ??
                    (typeof listing.priceJPY === "number"
                      ? `¥${listing.priceJPY.toLocaleString()}`
                      : listing.priceCurrency.toUpperCase());
                  const listingCondition = normalizeCondition(listing.condition);
                  const conditionLabel = conditionLabels[listingCondition];
                  const tags = listing.tags ?? [];

                  return (
                    <article
                      key={listing.id}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-neutral-200 dark:bg-zinc-800">
                        {listing.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={listing.thumbnail}
                            alt={listing.title}
                            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-medium tracking-[0.2em] text-neutral-500 dark:from-zinc-900 dark:to-zinc-800 dark:text-zinc-500">
                            {meta.brand}
                          </div>
                        )}
                        <span className="absolute left-4 top-4 rounded-full border border-neutral-900/20 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-neutral-700 backdrop-blur-sm dark:border-zinc-100/10 dark:bg-zinc-900/70 dark:text-zinc-200">
                          {metaInfo.label}
                        </span>
                        {!listing.sold ? null : (
                          <span className="absolute right-4 top-4 rounded-full bg-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white dark:bg-zinc-100 dark:text-zinc-900">
                            sold
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-4 p-5">
                        <div className="space-y-2">
                          <a
                            href={listing.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm font-semibold tracking-tight text-neutral-900 transition hover:text-neutral-500 dark:text-zinc-100 dark:hover:text-zinc-300"
                          >
                            {listing.title}
                          </a>
                          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-zinc-500">
                            {listing.size ? <span>size {listing.size}</span> : null}
                            {listing.color ? <span>{listing.color}</span> : null}
                            <span>{conditionLabel}</span>
                          </div>
                        </div>

                        {listing.notes ? (
                          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-300">
                            {listing.notes}
                          </p>
                        ) : null}

                        <div className="mt-auto flex items-center justify-between text-sm font-semibold text-neutral-900 dark:text-zinc-100">
                          <span className="text-lg">{priceLabel}</span>
                          <span className="text-xs text-neutral-400 dark:text-zinc-500">
                            最終確認 {dateFormatter.format(new Date(listing.lastSeen))}
                          </span>
                        </div>

                        {tags.length ? (
                          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-neutral-400 dark:text-zinc-500">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-zinc-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
