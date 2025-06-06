import { MDXLayoutRenderer } from "@/components/MDXComponents";
import { allAuthors } from "contentlayer/generated";
import { Metadata } from "next";

const DEFAULT_LAYOUT = "AuthorLayout";

export const metadata: Metadata = {
  title: "About",
  description: "About the author of this blog.",
};

export default async function About() {
  const author = allAuthors.find((p) => p.slug === "default");

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <MDXLayoutRenderer
      layout={author.layout || DEFAULT_LAYOUT}
      content={author}
      toc={"About the author of this blog."}
      authorDetails={[author]}
      prev={undefined}
      next={undefined}
    />
  );
}