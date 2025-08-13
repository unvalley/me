"use client";

import { usePathname } from "next/navigation";
import { CustomLink } from "./Link";
import { headerNavLinks } from "../data/index";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="space-x-3 sm:space-x-4">
      {headerNavLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));

        return (
          <CustomLink
            key={link.title}
            href={link.href}
            className={`font-mono text-sm sm:text-base transition-colors ${
              isActive
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {link.title}
          </CustomLink>
        );
      })}
    </div>
  );
};
