#!/usr/bin/env -S node --no-warnings

import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { setTimeout as delay } from "node:timers/promises";

import type { Condition, UnveilListing } from "../../data/unveil";

interface Options {
  keyword: string;
  pages: number;
  delayMs: number;
  outfile?: string;
}

interface MercariNextData {
  props?: {
    pageProps?: {
      initialState?: Record<string, unknown>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface MercariNextItem {
  id?: string;
  itemId?: string;
  name?: string;
  title?: string;
  price?: number | string;
  thumbnails?: { path?: string }[];
  thumbnailUrls?: string[];
  status?: string;
  soldOut?: boolean;
  created?: number;
  createdAt?: number;
  updated?: number;
  updatedAt?: number;
  itemCondition?: number;
  conditionId?: number;
  brandName?: string;
  categoryName?: string;
  itemSize?: string;
  customFields?: Array<{ name?: string; value?: string }>;
  [key: string]: unknown;
}

interface MercariSearchChunk {
  items: MercariNextItem[];
  nextPageToken?: string;
}

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
};

const CONDITION_MAP: Record<number, Condition> = {
  1: "new",
  2: "used-like-new",
  3: "used-good",
  4: "used-good",
  5: "used-fair",
  6: "used-fair",
};

function parseCli(): Options {
  const { values } = parseArgs({
    options: {
      keyword: {
        type: "string",
        default: "Arc'teryx",
      },
      pages: {
        type: "string",
        default: "3",
      },
      delay: {
        type: "string",
        default: "1200",
      },
      outfile: {
        type: "string",
      },
    },
  });

  const pages = Number.parseInt(values.pages as string, 10);
  const delayMs = Number.parseInt(values.delay as string, 10);

  return {
    keyword: values.keyword as string,
    pages: Number.isFinite(pages) && pages > 0 ? pages : 3,
    delayMs: Number.isFinite(delayMs) && delayMs >= 0 ? delayMs : 1200,
    outfile: values.outfile as string | undefined,
  };
}

async function fetchSearchPage(
  keyword: string,
  pageToken?: string,
): Promise<MercariSearchChunk> {
  const searchUrl = new URL("https://jp.mercari.com/search");
  searchUrl.searchParams.set("keyword", keyword);
  if (pageToken) searchUrl.searchParams.set("page_token", pageToken);

  const response = await fetch(searchUrl, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Mercari request failed with ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const json = extractNextData(html);
  const { items, nextPageToken } = extractItems(json);

  return { items, nextPageToken };
}

function extractNextData(html: string): MercariNextData {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(?<payload>.*?)<\/script>/s,
  );

  if (!match?.groups?.payload) {
    throw new Error("Could not locate Mercari __NEXT_DATA__ payload");
  }

  try {
    return JSON.parse(match.groups.payload) as MercariNextData;
  } catch (error) {
    throw new Error(`Failed to parse __NEXT_DATA__: ${(error as Error).message}`);
  }
}

function extractItems(nextData: MercariNextData): MercariSearchChunk {
  const candidates: unknown[] = [
    nextData.props?.pageProps?.initialState,
    nextData.props?.pageProps,
  ].filter(Boolean) as unknown[];

  for (const candidate of candidates) {
    const state = candidate as Record<string, unknown>;
    const searchState = state.search ?? state.searchResults ?? state.searchResult;

    if (typeof searchState !== "object" || searchState === null) continue;

    const items =
      (searchState as Record<string, unknown>).items ??
      (searchState as Record<string, unknown>).searchResult ??
      (searchState as Record<string, unknown>).searchResults;

    if (Array.isArray(items) && items.length) {
      const nextPageToken =
        (searchState as Record<string, unknown>).nextPageToken ??
        (searchState as Record<string, unknown>).next_page_token ??
        (searchState as Record<string, unknown>).next;

      return {
        items: items as MercariNextItem[],
        nextPageToken: typeof nextPageToken === "string" && nextPageToken.length > 0
          ? nextPageToken
          : undefined,
      };
    }

    if (
      typeof (searchState as Record<string, unknown>).items === "object" &&
      (searchState as Record<string, unknown>).items !== null
    ) {
      const nested = (searchState as Record<string, unknown>).items as Record<string, unknown>;
      if (Array.isArray(nested.items) && nested.items.length) {
        const nextPageToken =
          typeof nested.nextPageToken === "string" && nested.nextPageToken.length > 0
            ? nested.nextPageToken
            : undefined;

        return {
          items: nested.items as MercariNextItem[],
          nextPageToken,
        };
      }
    }
  }

  return { items: [], nextPageToken: undefined };
}

function mapCondition(conditionId?: number): Condition {
  if (!conditionId) return "used-good";
  return CONDITION_MAP[conditionId] ?? "used-good";
}

function parsePrice(value: number | string | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const numeric = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (Number.isFinite(numeric)) return numeric;
  }
  return 0;
}

function buildListings(items: MercariNextItem[]): UnveilListing[] {
  const now = new Date().toISOString();

  return items
    .map((item) => {
      const id = item.id ?? item.itemId;
      const title = item.name ?? item.title;
      if (!id || !title) return null;

      const priceJPY = parsePrice(item.price);
      const thumbnail = item.thumbnailUrls?.[0] ?? item.thumbnails?.[0]?.path;
      const sold = Boolean(item.soldOut || item.status === "sold_out");
      const conditionId = (item.itemCondition ?? item.conditionId) as number | undefined;
      const listedEpoch = item.created ?? item.createdAt ?? item.updated ?? item.updatedAt;
      const listedAt = typeof listedEpoch === "number" && listedEpoch > 0
        ? new Date(listedEpoch * 1000).toISOString()
        : undefined;

      const tags = [item.brandName, item.categoryName]
        .filter((value): value is string => Boolean(value && value.length > 0));

      return {
        id: `mercari-${id}`,
        title,
        marketplace: "mercari",
        url: `https://jp.mercari.com/item/${id}`,
        priceJPY,
        priceCurrency: "JPY",
        priceLabel: priceJPY ? `¥${priceJPY.toLocaleString("ja-JP")}` : "",
        size: typeof item.itemSize === "string" ? item.itemSize : undefined,
        color: extractCustomField(item, "カラー"),
        condition: mapCondition(conditionId),
        sold,
        lastSeen: now,
        listedAt,
        tags,
        notes: undefined,
        thumbnail,
      } satisfies UnveilListing;
    })
    .filter((item): item is UnveilListing => item !== null);
}

function extractCustomField(item: MercariNextItem, field: string): string | undefined {
  const match = item.customFields?.find((entry) => entry?.name === field);
  return match?.value ?? undefined;
}

async function fetchMercariListings({ keyword, pages, delayMs }: Options) {
  const results: UnveilListing[] = [];
  let pageToken: string | undefined;

  for (let pageIndex = 0; pageIndex < pages; pageIndex += 1) {
    const { items, nextPageToken } = await fetchSearchPage(keyword, pageToken);
    if (!items.length) break;

    results.push(...buildListings(items));
    if (!nextPageToken) break;

    pageToken = nextPageToken;
    if (delayMs > 0) await delay(delayMs);
  }

  return results;
}

async function main() {
  const options = parseCli();
  const listings = await fetchMercariListings(options);

  if (options.outfile) {
    await writeFile(options.outfile, JSON.stringify(listings, null, 2), "utf8");
    console.info(`Saved ${listings.length} listings to ${options.outfile}`);
  } else {
    console.log(JSON.stringify(listings, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
