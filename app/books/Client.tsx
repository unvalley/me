"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Book, LayoutMode, SortKey, ScatterItem } from "./types";
import {
  CARD_H,
  CARD_W,
  GRID_MAX_WIDTH,
  clamp,
  computeGridPosition,
  makeInitialScatter,
  sortBooks,
  storage,
} from "./utils";
import booksJson from "./_data/books.json";
import Image from "next/image";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

type Size = { width: number; height: number };

const useMeasure = (): [React.RefObject<HTMLDivElement>, Size] => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      const cr = entry.contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, size];
};

const STORAGE_KEYS = {
  layout: "books.layoutMode",
  sort: "books.sortKey",
  scatter: "books.scatterPositions",
};

type CardProps = {
  book: Book;
  mode: LayoutMode;
  base: ScatterItem | { x: number; y: number; rot: number; z: number };
  container: Size;
  onOpen: (book: Book) => void;
  onMove: (id: string, next: ScatterItem) => void;
  tabIndex?: number;
};

const CoverImage = ({ book, sizes }: { book: Book; sizes: string }) => {
  const candidates: string[] = [];
  if (book.isbn) {
    const raw = book.isbn.replace(/[^0-9Xx]/g, "");
    // openBD (ISBN-10) first, then hanmoto
    candidates.push(`https://cover.openbd.jp/${raw}.jpg`);
    candidates.push(`https://www.hanmoto.com/bd/img/${raw}.jpg`);
    candidates.push(`https://www.hanmoto.com/bd/img/${raw}.png`);
  }
  const unique = Array.from(new Set(candidates));
  const [idx, setIdx] = useState(0);
  const src = unique[idx] ?? "";
  if (!src) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
    );
  }
  return (
    <Image
      src={src}
      alt={`${book.title} cover`}
      fill
      sizes={sizes}
      className="object-cover"
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
    />
  );
};

const DraggableCard = ({
  book,
  mode,
  base,
  container,
  onOpen,
  onMove,
  tabIndex,
}: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: book.isbn });
  const dragX = transform?.x ?? 0;
  const dragY = transform?.y ?? 0;

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // Keyboard nudge in scatter mode
    if (mode !== "scatter") return;
    const step = e.shiftKey ? 20 : 10;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowUp") dy = -step;
    if (e.key === "ArrowDown") dy = step;
    if (e.key === "ArrowLeft") dx = -step;
    if (e.key === "ArrowRight") dx = step;
    if (dx !== 0 || dy !== 0) {
      e.preventDefault();
      const xMax = Math.max(0, container.width - CARD_W);
      const yMax = Math.max(0, container.height - CARD_H);
      const next: ScatterItem = {
        x: clamp((base as ScatterItem).x + dx, 0, xMax),
        y: clamp((base as ScatterItem).y + dy, 0, yMax),
        rot: (base as ScatterItem).rot,
        z: (base as ScatterItem).z,
      };
      onMove(book.isbn, next);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(book);
    }
  };

  const x = (base.x ?? 0) + (mode === "scatter" ? dragX : 0);
  const y = (base.y ?? 0) + (mode === "scatter" ? dragY : 0);
  const rot = mode === "scatter" ? (base.rot ?? 0) : 0;

  const draggableProps =
    mode === "scatter" ? { ...listeners, ...attributes } : {};

  return (
    <motion.div
      ref={setNodeRef}
      role="button"
      tabIndex={tabIndex ?? 0}
      aria-label={book.title}
      onKeyDown={onKeyDown}
      onDoubleClick={() => onOpen(book)}
      className="absolute select-none outline-none"
      style={{ zIndex: base.z ?? 1 }}
      initial={false}
      animate={{ x, y, rotate: rot, scale: isDragging ? 1.03 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
      {...draggableProps}
      onClick={(e) => {
        // Avoid click on drag
        if (!isDragging) onOpen(book);
      }}
    >
      <div className="w-[160px]">
        <div className="relative h-[240px] w-[160px] overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-900/10 bg-gray-100 dark:bg-gray-800 dark:ring-white/10">
          <CoverImage book={book} sizes="160px" />
          {/* No text inside cover to avoid duplication with caption */}
        </div>
        <div className="mt-2 space-y-0.5 min-h-[44px]">
          <div
            className="truncate text-[13px] leading-5 font-medium text-gray-900 dark:text-gray-100"
            title={book.title}
          >
            {book.title}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailsPanel = ({
  book,
  onClose,
}: {
  book: Book | null;
  onClose: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // focus trap
  useEffect(() => {
    if (!book) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    first?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable.length > 0) {
        const current = document.activeElement;
        const idx = Array.from(focusable).indexOf(current as HTMLElement);
        let nextIdx = idx;
        if (e.shiftKey) nextIdx = idx <= 0 ? focusable.length - 1 : idx - 1;
        else nextIdx = idx === focusable.length - 1 ? 0 : idx + 1;
        if (idx !== -1) {
          e.preventDefault();
          focusable[nextIdx]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [book, onClose]);

  return (
    <AnimatePresence>
      {book && (
        <>
          <motion.div
            className="fixed inset-0 z-[999] bg-black/30"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book details"
            ref={panelRef}
            className="fixed inset-y-0 right-0 z-[1000] w-full bg-white shadow-xl outline-none dark:bg-gray-900 md:inset-y-auto md:bottom-0 md:top-0 md:h-full md:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <h2 className="text-base font-semibold">{book.title}</h2>
                <button
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  aria-label="Close details"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex gap-4">
                  <div className="relative h-[180px] w-[120px] overflow-hidden rounded-md ring-1 ring-black/5">
                    <CoverImage book={book} sizes="120px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {book.buyUrl && (
                      <a
                        href={book.buyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center text-sm text-blue-600 underline hover:no-underline"
                      >
                        Buy
                      </a>
                    )}
                  </div>
                </div>
                {book.comment && (
                  <div className="mt-4 rounded-lg text-sm leading-6">
                    {book.comment}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const BooksCanvas = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [containerRef, size] = useMeasure();
  const [topOffset, setTopOffset] = useState(0);
  // Initialize with deterministic defaults to avoid SSR/CSR mismatch.
  // Load any persisted values after mount.
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("scatter");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [scatter, setScatter] = useState<Record<string, ScatterItem>>({});
  const [active, setActive] = useState<Book | null>(null);

  const books = useMemo(() => booksJson as Book[], []);
  const sortedForGrid = useMemo(
    () => sortBooks(books, sortKey),
    [books, sortKey],
  );

  // Load persisted settings on mount (client-only)
  useEffect(() => {
    setLayoutMode(storage.load(STORAGE_KEYS.layout, "scatter"));
    setSortKey(storage.load(STORAGE_KEYS.sort, "title"));
    setScatter(storage.load(STORAGE_KEYS.scatter, {}));
  }, []);

  // Init scatter positions after we know container size
  useEffect(() => {
    if (!size.width || !size.height) return;
    setScatter((prev) =>
      makeInitialScatter(
        books.map((b) => b.isbn),
        size.width,
        size.height,
        prev,
      ),
    );
  }, [size.width, size.height, books]);

  // Persist
  useEffect(() => storage.save(STORAGE_KEYS.layout, layoutMode), [layoutMode]);
  useEffect(() => storage.save(STORAGE_KEYS.sort, sortKey), [sortKey]);
  useEffect(() => storage.save(STORAGE_KEYS.scatter, scatter), [scatter]);

  // Measure header and offset canvas below it
  useEffect(() => {
    const header = document.querySelector("header");
    const update = () => {
      const rect = header?.getBoundingClientRect();
      setTopOffset(rect ? Math.round(rect.bottom) : 0);
    };
    update();
    window.addEventListener("resize", update);
    const ro = header ? new ResizeObserver(update) : null;
    if (header && ro) ro.observe(header as Element);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  const gridBaseByIsbn = useMemo(() => {
    const map: Record<
      string,
      { x: number; y: number; rot: number; z: number }
    > = {};
    const gridWidth = Math.max(0, Math.min(size.width, GRID_MAX_WIDTH));
    const leftPad = Math.max(0, Math.floor((size.width - gridWidth) / 2));
    sortedForGrid.forEach((b, i) => {
      const { x, y } = computeGridPosition(i, gridWidth);
      map[b.isbn] = { x: leftPad + x, y, rot: 0, z: 10 + i };
    });
    return map;
  }, [sortedForGrid, size.width]);

  const onDragEnd = (ev: any) => {
    if (layoutMode !== "scatter") return;
    const id: string | undefined = ev?.active?.id;
    if (!id) return;
    const trans = ev?.delta ?? ev?.transform ?? { x: 0, y: 0 };
    setScatter((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const xMax = Math.max(0, size.width - CARD_W);
      const yMax = Math.max(0, size.height - CARD_H);
      const next: ScatterItem = {
        x: clamp(cur.x + (trans.x ?? 0), 0, xMax),
        y: clamp(cur.y + (trans.y ?? 0), 0, yMax),
        rot: cur.rot,
        z: cur.z + 1,
      };
      return { ...prev, [id]: next };
    });
  };

  const handleSortChange = (key: SortKey) => {
    setSortKey(key);
    if (layoutMode === "scatter") {
      // update z to reflect new priority, positions unchanged
      const isbnList = sortBooks(books, key).map((b) => b.isbn);
      setScatter((prev) => {
        const next = { ...prev };
        let zBase = 10;
        isbnList.forEach((i) => {
          if (next[i]) next[i].z = zBase++;
        });
        return next;
      });
    }
  };

  const toggleLayout = () => {
    setLayoutMode((m) => (m === "scatter" ? "grid" : "scatter"));
  };

  return (
    <div className="relative pt-6 pb-8">
      {/* Controls (bottom-right): Sort + Align/Scatter */}
      <div className="pointer-events-auto fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[900]">
        <div className="flex items-center gap-2 rounded-full border border-gray-300/60 bg-gray-50/85 px-2.5 py-1.5 shadow-sm backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/85">
          <div className="relative">
            <label htmlFor="sort" className="sr-only">
              Sort
            </label>
            <select
              id="sort"
              className="min-w-[132px] rounded-full border border-transparent bg-transparent px-2 py-1 text-sm text-gray-800 outline-none hover:bg-gray-50/60 focus:bg-gray-50/60 dark:text-gray-100"
              aria-label="Sort books"
              value={sortKey}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
            >
              <option value="title">Title</option>
            </select>
          </div>
          <div className="h-5 w-px bg-gray-300/70 dark:bg-gray-600/70" />
          <button
            type="button"
            onClick={toggleLayout}
            className="rounded-full border border-gray-300/60 bg-gray-50/60 px-3 py-1.5 text-sm text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-700/60 dark:bg-gray-800/60 dark:text-gray-100 dark:hover:bg-gray-800"
            aria-label={layoutMode === "grid" ? "Scatter" : "Align"}
          >
            {layoutMode === "grid" ? "Scatter" : "Align"}
          </button>
        </div>
      </div>

      {/* Canvas (full-screen under header) */}
      <div
        ref={containerRef}
        className="fixed left-0 right-0 bottom-0 overflow-hidden bg-gray-50 px-6 pb-6 md:px-10 md:pb-10 dark:bg-gray-900"
        style={{ top: topOffset }}
        aria-label="Canvas"
      >
        <DndContext onDragEnd={onDragEnd} sensors={sensors}>
          {books.map((b) => {
            const base =
              layoutMode === "scatter"
                ? scatter[b.isbn]
                : gridBaseByIsbn[b.isbn];
            if (!base) return null;
            return (
              <DraggableCard
                key={b.isbn}
                book={b}
                mode={layoutMode}
                base={base}
                container={size}
                onOpen={setActive}
                onMove={(id, next) =>
                  setScatter((prev) => ({ ...prev, [id]: next }))
                }
              />
            );
          })}
        </DndContext>
      </div>

      {/* Details */}
      <DetailsPanel book={active} onClose={() => setActive(null)} />
    </div>
  );
};
