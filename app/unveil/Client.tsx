"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  if (
    value === "new" ||
    value === "used-like-new" ||
    value === "used-good" ||
    value === "used-fair"
  ) {
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

type FilterOption = {
  value: string;
  label: string;
};

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

const normalizeFilterValue = (value: string) => value.trim().toLowerCase();

const collectFilterOptions = (
  listings: UnveilListing[],
  extractor: (listing: UnveilListing) => string | null | undefined
): FilterOption[] => {
  const map = new Map<string, string>();
  for (const listing of listings) {
    const raw = extractor(listing);
    if (!raw) continue;
    const label = raw.trim();
    if (!label) continue;
    const normalized = normalizeFilterValue(label);
    if (!map.has(normalized)) {
      map.set(normalized, label);
    }
  }

  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "ja"));
};

const getPriceValue = (listing: UnveilListing): number | null => {
  if (typeof listing.priceJPY === "number") return listing.priceJPY;
  const legacy = (listing as { priceJpy?: unknown }).priceJpy;
  return typeof legacy === "number" ? legacy : null;
};

const FilterSection = ({
  title,
  defaultOpen = true,
  children,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 pb-4 dark:border-zinc-800">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-xs uppercase tracking-[0.3em] text-neutral-500 transition hover:text-neutral-800 dark:text-zinc-500 dark:hover:text-zinc-100"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
      >
        {title}
        <span
          className={`text-lg leading-none text-neutral-400 transition dark:text-zinc-500 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen ? (
        <div className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-zinc-300">
          {children}
        </div>
      ) : null}
    </div>
  );
};

const filterButtonClass = (
  active: boolean,
  align: "center" | "start" = "center"
) =>
  `flex items-center ${
    align === "start" ? "justify-start gap-3" : "justify-between"
  } rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] transition ${
    active
      ? "border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
      : "border-neutral-300 text-neutral-500 hover:border-neutral-800 hover:text-neutral-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-300 dark:hover:text-zinc-100"
  }`;

const colorSwatchClass =
  "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-[10px] uppercase text-neutral-500 dark:border-zinc-600";

const colorHexMap: Record<string, string> = {
  black: "#111",
  ブラック: "#111",
  黒: "#111",
  white: "#f5f5f5",
  ホワイト: "#f5f5f5",
  白: "#f5f5f5",
  grey: "#9ca3af",
  gray: "#9ca3af",
  グレー: "#9ca3af",
  灰: "#9ca3af",
  blue: "#2563eb",
  ブルー: "#2563eb",
  navy: "#1e3a8a",
  ネイビー: "#1e3a8a",
  red: "#dc2626",
  レッド: "#dc2626",
  赤: "#dc2626",
  green: "#16a34a",
  グリーン: "#16a34a",
  緑: "#16a34a",
  orange: "#f97316",
  オレンジ: "#f97316",
  brown: "#92400e",
  ブラウン: "#92400e",
  ベージュ: "#d6bfa8",
  beige: "#d6bfa8",
  yellow: "#facc15",
  イエロー: "#facc15",
  紫: "#7c3aed",
  purple: "#7c3aed",
};

const resolveColorHex = (label: string) => {
  const normalized = normalizeFilterValue(label);
  for (const [key, value] of Object.entries(colorHexMap)) {
    if (normalized.includes(normalizeFilterValue(key))) {
      return value;
    }
  }
  return "#d4d4d4";
};

export interface UnveilClientProps {
  dataset: UnveilDataset;
}

export function UnveilClient({ dataset }: UnveilClientProps) {
  const { listings, meta } = dataset;
  const brandPageHref = meta.slug ? `/unveil/brands/${meta.slug}` : null;

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

  const colorOptions = useMemo(
    () => collectFilterOptions(listings, (item) => item.color),
    [listings]
  );

  const sizeOptions = useMemo(
    () => collectFilterOptions(listings, (item) => item.size),
    [listings]
  );

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
      .map((item) => getPriceValue(item))
      .filter((value): value is number => typeof value === "number");
    if (!prices.length)
      return { min: null as number | null, max: null as number | null };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [listings]);

  const [query, setQuery] = useState("");
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<
    Marketplace[] | null
  >(null);
  const [selectedConditions, setSelectedConditions] = useState<
    Condition[] | null
  >(null);
  const [selectedColors, setSelectedColors] = useState<string[] | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[] | null>(null);
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

  const toggleColor = (value: string) => {
    if (!colorOptions.length) return;
    setSelectedColors((prev) => {
      if (prev === null) {
        const next = colorOptions
          .map((option) => option.value)
          .filter((item) => item !== value);
        return next.length === colorOptions.length ? null : next;
      }

      if (prev.includes(value)) {
        const next = prev.filter((item) => item !== value);
        return next.length === 0 ? null : next;
      }

      const next = [...prev, value];
      return next.length === colorOptions.length ? null : next;
    });
  };

  const toggleSize = (value: string) => {
    if (!sizeOptions.length) return;
    setSelectedSizes((prev) => {
      if (prev === null) {
        const next = sizeOptions
          .map((option) => option.value)
          .filter((item) => item !== value);
        return next.length === sizeOptions.length ? null : next;
      }

      if (prev.includes(value)) {
        const next = prev.filter((item) => item !== value);
        return next.length === 0 ? null : next;
      }

      const next = [...prev, value];
      return next.length === sizeOptions.length ? null : next;
    });
  };

  const visibleListings = useMemo(() => {
    const activeMarketplaces = selectedMarketplaces ?? uniqueMarketplaces;
    const activeConditions = selectedConditions ?? uniqueConditions;

    return listings
      .filter((listing) => {
        const matchesMarketplace = activeMarketplaces.includes(
          listing.marketplace
        );
        const listingCondition = normalizeCondition(listing.condition);
        const matchesCondition = activeConditions.includes(listingCondition);
        const matchesAvailability = onlyAvailable ? !listing.sold : true;
        const matchesColor =
          selectedColors === null
            ? true
            : (() => {
                const colorValue = listing.color
                  ? normalizeFilterValue(listing.color)
                  : null;
                return (
                  colorValue !== null && selectedColors.includes(colorValue)
                );
              })();
        const matchesSize =
          selectedSizes === null
            ? true
            : (() => {
                const sizeValue = listing.size
                  ? normalizeFilterValue(listing.size)
                  : null;
                return sizeValue !== null && selectedSizes.includes(sizeValue);
              })();
        const listingPrice = getPriceValue(listing);

        if (
          !matchesMarketplace ||
          !matchesCondition ||
          !matchesAvailability ||
          !matchesColor ||
          !matchesSize
        ) {
          return false;
        }

        if (selectedTags.length > 0) {
          const tagMatch = selectedTags.every((tag) =>
            (listing.tags ?? []).includes(tag)
          );
          if (!tagMatch) return false;
        }

        if (priceRange.min !== null) {
          if (listingPrice === null || listingPrice < priceRange.min)
            return false;
        }

        if (priceRange.max !== null) {
          if (listingPrice === null || listingPrice > priceRange.max)
            return false;
        }

        if (!query.trim()) return true;
        const normalized = query.trim().toLowerCase();

        return (
          listing.title.toLowerCase().includes(normalized) ||
          (listing.color?.toLowerCase().includes(normalized) ?? false) ||
          (listing.size?.toLowerCase().includes(normalized) ?? false) ||
          (listing.tags ?? []).some((tag) =>
            tag.toLowerCase().includes(normalized)
          ) ||
          listing.notes?.toLowerCase().includes(normalized)
        );
      })
      .sort((a, b) => {
        const priceA = getPriceValue(a);
        const priceB = getPriceValue(b);
        if (sortBy === "price-asc") {
          return (
            (priceA ?? Number.MAX_SAFE_INTEGER) -
            (priceB ?? Number.MAX_SAFE_INTEGER)
          );
        }
        if (sortBy === "price-desc") {
          return (priceB ?? 0) - (priceA ?? 0);
        }
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      });
  }, [
    listings,
    onlyAvailable,
    selectedColors,
    selectedSizes,
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
        <aside className="hidden space-y-6 lg:block">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
              フィルター
            </p>
          </div>
          <div className="space-y-6 text-sm text-neutral-600 dark:text-zinc-300">
            <FilterSection title="コンディション">
              <div className="flex flex-wrap gap-2">
                {uniqueConditions.map((condition) => {
                  const isActive =
                    selectedConditions === null ||
                    selectedConditions.includes(condition);
                  return (
                    <button
                      key={condition}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => toggleCondition(condition)}
                      className={filterButtonClass(isActive)}
                    >
                      {conditionLabels[condition]}
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {sizeOptions.length ? (
              <FilterSection title="サイズ">
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((option) => {
                    const isActive =
                      selectedSizes === null ||
                      selectedSizes.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => toggleSize(option.value)}
                        className={filterButtonClass(isActive)}
                      >
                        size {option.label}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            ) : null}

            {colorOptions.length ? (
              <FilterSection title="カラー">
                <div className="flex flex-col gap-2">
                  {colorOptions.map((option) => {
                    const isActive =
                      selectedColors === null ||
                      selectedColors.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => toggleColor(option.value)}
                        className={filterButtonClass(isActive, "start")}
                      >
                        <span
                          className={colorSwatchClass}
                          style={{
                            backgroundColor: resolveColorHex(option.label),
                          }}
                          aria-hidden
                        />
                        <span className="tracking-[0.2em]">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            ) : null}

            {priceStats.min !== null && priceStats.max !== null ? (
              <FilterSection title="価格 (JPY)">
                <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>最小</span>
                    <input
                      type="number"
                      value={priceRange.min ?? ""}
                      min={priceStats.min}
                      max={priceStats.max}
                      placeholder={`${priceStats.min.toLocaleString()}`}
                      onChange={(event) =>
                        handlePriceChange("min", event.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>最大</span>
                    <input
                      type="number"
                      value={priceRange.max ?? ""}
                      min={priceStats.min}
                      max={priceStats.max}
                      placeholder={`${priceStats.max.toLocaleString()}`}
                      onChange={(event) =>
                        handlePriceChange("max", event.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-neutral-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-300"
                    />
                  </div>
                </div>
              </FilterSection>
            ) : null}

            <FilterSection title="マーケットプレイス" defaultOpen={false}>
              <div className="flex flex-col gap-2">
                {uniqueMarketplaces.map((marketplace) => {
                  const isChecked =
                    selectedMarketplaces === null ||
                    selectedMarketplaces.includes(marketplace);
                  const meta = marketplaceMeta[marketplace] ?? {
                    label: marketplace,
                    region: "--",
                  };
                  return (
                    <button
                      key={marketplace}
                      type="button"
                      aria-pressed={isChecked}
                      onClick={() => toggleMarketplace(marketplace)}
                      className={filterButtonClass(isChecked, "start")}
                    >
                      <span>{meta.label}</span>
                      <span className="ml-auto text-[10px] tracking-[0.35em] text-neutral-400 dark:text-zinc-500">
                        {meta.region}
                      </span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {tagStats.length ? (
              <FilterSection title="クイックフィルター" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {tagStats.map(([tag]) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        aria-pressed={active}
                        className={filterButtonClass(active)}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            ) : null}
          </div>
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
                    onChange={(event) =>
                      setSortBy(event.target.value as SortKey)
                    }
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

            {sizeOptions.length ? (
              <div className="flex flex-wrap gap-2 lg:hidden">
                {sizeOptions.map((option) => {
                  const active =
                    selectedSizes === null ||
                    selectedSizes.includes(option.value);
                  return (
                    <button
                      key={`size-${option.value}`}
                      type="button"
                      onClick={() => toggleSize(option.value)}
                      aria-pressed={active}
                      className={filterButtonClass(active)}
                    >
                      size {option.label}
                    </button>
                  );
                })}
              </div>
            ) : null}

            {colorOptions.length ? (
              <div className="flex flex-wrap gap-2 lg:hidden">
                {colorOptions.map((option) => {
                  const active =
                    selectedColors === null ||
                    selectedColors.includes(option.value);
                  return (
                    <button
                      key={`color-${option.value}`}
                      type="button"
                      onClick={() => toggleColor(option.value)}
                      aria-pressed={active}
                      className={filterButtonClass(active, "start")}
                    >
                      <span
                        className={colorSwatchClass}
                        style={{
                          backgroundColor: resolveColorHex(option.label),
                        }}
                        aria-hidden
                      />
                      <span className="tracking-[0.2em]">{option.label}</span>
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
                {brandPageHref ? (
                  <a
                    href={brandPageHref}
                    className="inline-flex items-center gap-2 underline decoration-dotted underline-offset-4 hover:text-neutral-500 dark:hover:text-zinc-300"
                  >
                    {meta.brand}
                    <span aria-hidden className="text-base">↗</span>
                  </a>
                ) : (
                  meta.brand
                )}{" "}
                — {visibleListings.length}件
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
                  const metaInfo = marketplaceMeta[listing.marketplace] ?? {
                    label: listing.marketplace,
                    region: "--",
                  };
                  const priceValue = getPriceValue(listing);
                  const priceLabel =
                    listing.priceLabel ??
                    (typeof priceValue === "number"
                      ? `¥${priceValue.toLocaleString()}`
                      : listing.priceCurrency.toUpperCase());
                  const listingCondition = normalizeCondition(
                    listing.condition
                  );
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
                            {listing.size ? (
                              <span>size {listing.size}</span>
                            ) : null}
                            {listing.color ? (
                              <span>{listing.color}</span>
                            ) : null}
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
                            最終確認{" "}
                            {dateFormatter.format(new Date(listing.lastSeen))}
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
