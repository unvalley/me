"use client";

import { Footer } from "./Footer";
import { CustomLink } from "./Link";
import { MobileNav } from "./MobileNav";
import { headerNavLinks } from "@/data/index";
import siteMetadata from "@/data/siteMetadata";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: Props) => {
  return (
    <div className="mx-auto my-auto max-w-2xl px-4 sm:px-6 xl:max-w-2xl xl:px-0">
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
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
          </div>
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
            {/* <ThemeSwitch /> */}
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
