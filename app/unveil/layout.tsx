import type { ReactNode } from "react";

import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function UnveilLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 pb-20 text-neutral-900 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 pt-12 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-6 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50">
              UNVEIL
            </h1>
            <span className="text-[12px] uppercase tracking-[0.5em] text-neutral-400 dark:text-zinc-500">
              curated resale feed
            </span>
          </div>
          <div className="flex items-start gap-4">
            <ThemeSwitch />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-neutral-200 pt-6 text-xs uppercase tracking-[0.3em] text-neutral-400 dark:border-zinc-800 dark:text-zinc-500">
          UNVEIL
        </footer>
      </div>
    </div>
  );
}
