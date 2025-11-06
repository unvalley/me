import Link from "next/link";
import { CustomLink } from "./Link";
import siteMetadata from "@/data/siteMetadata";

export function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <Link href={siteMetadata.blogGithub}>GitHub</Link>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{" • "}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{" • "}</div>
          <CustomLink href="/">{siteMetadata.title}</CustomLink>
        </div>
      </div>
    </footer>
  );
}
