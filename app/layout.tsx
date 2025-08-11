import "@/css/prism.css";
import "@/css/shiki.css";
import "@/css/tailwind.css";
import "katex/dist/katex.css";

import "@fontsource/inter";

import type { Metadata } from "next";

import siteMetadata from "@/data/siteMetadata";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";
import { CustomLink } from "@/components/Link";
import { MobileNav } from "@/components/MobileNav";
import { headerNavLinks } from "../data";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: "UNV",
    template: `%s | ${siteMetadata.title}`,
  },
  description: "unvalley blog",
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: "./",
    siteName: siteMetadata.title,
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/static/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 antialiased dark:bg-gray-900">
        <Providers>
          <div className="mx-auto my-auto max-w-2xl px-4 sm:px-6 xl:max-w-2xl xl:px-0">
            <div className="flex h-screen flex-col justify-between">
              <header className="flex items-center justify-between py-10">
                <CustomLink href="/" aria-label={siteMetadata.headerTitle}>
                  <div className="flex items-center justify-between">
                    {typeof siteMetadata.headerTitle === "string" ? (
                      <div className="h-6 text-2xl font-semibold sm:block">
                        {siteMetadata.headerTitle}
                      </div>
                    ) : (
                      siteMetadata.headerTitle
                    )}
                  </div>
                </CustomLink>
                <div className="flex items-center text-base leading-5">
                  <div className="hidden sm:block">
                    {headerNavLinks.map((link) => (
                      <CustomLink
                        key={link.title}
                        href={link.href}
                        className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                      >
                        {link.title}
                      </CustomLink>
                    ))}
                  </div>
                  <MobileNav />
                </div>
              </header>
              <main className="mb-auto">{children}</main>
              <Footer />
            </div>
          </div>
        </Providers>
        <GoogleAnalytics gaId={siteMetadata.analytics.googleAnalyticsId} />
      </body>
    </html>
  );
}
