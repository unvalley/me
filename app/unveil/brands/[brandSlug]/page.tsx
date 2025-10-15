import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadBrandDataset, listBrandManifest } from "@/data/unveil/brands/server";

interface BrandPageProps {
  params: {
    brandSlug: string;
  };
}

export async function generateStaticParams() {
  const manifest = await listBrandManifest();
  return manifest.map((entry) => ({ brandSlug: entry.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const dataset = await loadBrandDataset(params.brandSlug).catch(() => null);
  if (!dataset) return {};

  const { meta } = dataset;
  const title = `${meta.name} | UNVEIL ブランドガイド`;
  const description = meta.description ?? `${meta.name} の中古・セカンドハンド情報を紹介`; 

  return {
    title,
    description,
    alternates: {
      canonical: `/unveil/brands/${meta.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://unvalley.me/unveil/brands/${meta.slug}`,
      type: "website",
      images: meta.heroImage ? [{ url: meta.heroImage }] : undefined,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const dataset = await loadBrandDataset(params.brandSlug).catch(() => null);
  if (!dataset) {
    notFound();
  }

  const { meta, overview, insights, items } = dataset;

  return (
    <div className="space-y-12">
      <header className="space-y-6 rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
          {meta.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.heroImage}
              alt={`${meta.name} hero`}
              className="h-48 w-full rounded-2xl object-cover shadow-lg lg:h-64 lg:w-80"
            />
          ) : null}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-zinc-500">
                ブランドガイド
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
                {meta.name}
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-zinc-300">
              {meta.description}
            </p>
            <dl className="grid grid-cols-1 gap-4 text-sm text-neutral-500 dark:text-zinc-400 sm:grid-cols-2">
              {meta.founded ? (
                <div>
                  <dt className="uppercase tracking-[0.25em] text-neutral-400">Founded</dt>
                  <dd>{meta.founded}</dd>
                </div>
              ) : null}
              {meta.headquarters ? (
                <div>
                  <dt className="uppercase tracking-[0.25em] text-neutral-400">HQ</dt>
                  <dd>{meta.headquarters}</dd>
                </div>
              ) : null}
              {meta.keyTechnologies?.length ? (
                <div className="sm:col-span-2">
                  <dt className="uppercase tracking-[0.25em] text-neutral-400">Key Technologies</dt>
                  <dd className="flex flex-wrap gap-2 pt-2">
                    {meta.keyTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:border-zinc-700 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {meta.website ? (
                <div className="sm:col-span-2">
                  <dt className="uppercase tracking-[0.25em] text-neutral-400">Official</dt>
                  <dd>
                    <a
                      className="underline decoration-dotted underline-offset-4"
                      href={meta.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {meta.website}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </header>

      {overview ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
            ブランドの背景
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {overview.history ? (
              <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white/70 p-6 text-neutral-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 lg:col-span-2">
                <h3 className="text-sm uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
                  History
                </h3>
                <p className="leading-relaxed">{overview.history}</p>
              </article>
            ) : null}
            <div className="space-y-4">
              {overview.designPhilosophy ? (
                <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white/70 p-6 text-neutral-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
                    Design Philosophy
                  </h3>
                  <p className="leading-relaxed">{overview.designPhilosophy}</p>
                </article>
              ) : null}
              {overview.materials?.length ? (
                <article className="space-y-3 rounded-3xl border border-neutral-200 bg-white/70 p-6 text-neutral-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <h3 className="text-sm uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
                    Materials
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {overview.materials.map((material) => (
                      <li key={material} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-zinc-500" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {insights?.length ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
            Insider Notes
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {insights.map((insight) => (
              <article
                key={insight.title}
                className="space-y-3 rounded-3xl border border-neutral-200 bg-white/70 p-6 text-neutral-600 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
                  {insight.title}
                </h3>
                <p className="leading-relaxed">{insight.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
            代表アイテム
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-zinc-500">
            {items.length} Items
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.slug}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative h-44 w-full overflow-hidden bg-neutral-200 dark:bg-zinc-800">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-sm font-medium tracking-[0.3em] text-neutral-500 dark:from-zinc-900 dark:to-zinc-800 dark:text-zinc-500">
                    {meta.name}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-zinc-100">
                    {item.name}
                  </h3>
                  {item.summary ? (
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-zinc-300">
                      {item.summary}
                    </p>
                  ) : null}
                </div>
                <a
                  className="mt-auto inline-flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500 transition hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                  href={`/unveil/brands/${meta.slug}/items/${item.slug}`}
                >
                  詳細をみる
                  <span aria-hidden className="text-lg">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
