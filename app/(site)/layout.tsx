import type { ReactNode } from "react";

import { CustomLink } from "@/components/Link";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import siteMetadata from "@/data/siteMetadata";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-auto max-w-2xl px-4 sm:px-6 xl:max-w-2xl xl:px-0">
      <div className="flex min-h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <CustomLink href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              {typeof siteMetadata.headerTitle === "string" ? (
                <div className="text-xl font-mono">{siteMetadata.headerTitle}</div>
              ) : (
                siteMetadata.headerTitle
              )}
            </div>
          </CustomLink>
          <div className="flex items-center text-base leading-5">
            <Navigation />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
