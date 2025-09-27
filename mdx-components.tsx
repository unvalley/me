import type { MDXComponents } from "mdx/types";
import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { CodeBlock } from "@/components/CodeBlock";
import { InstagramEmbed } from "@/components/InstagramEmbed";

export const components: Record<string, FC<any>> = {
  h1: (props) => <h1 className="font-semibold mb-7 text-3xl" {...props} />,
  h2: (props) => <h2 className="mt-14 mb-7 text-2xl" {...props} />,
  h3: (props) => <h3 className="mt-14 mb-7 text-xl" {...props} />,
  ul: (props) => <ul className="mt-7 list-disc list-outside pl-5" {...props} />,
  ol: (props) => (
    <ol className="mt-7 list-decimal list-outside pl-5" {...props} />
  ),
  li: (props) => <li className="pl-1.5" {...props} />,
  a: ({ href, ...props }) => {
    return (
      <Link
        className="break-words underline hover:decoration-wavy"
        href={href || ""}
        draggable={false}
        {...(href?.startsWith("https://")
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        {...props}
      />
    );
  },
  strong: (props) => <strong className="" {...props} />,
  p: (props) => <p className="mt-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="pl-6 -ml-6 sm:pl-10 sm:-ml-10 md:pl-14 md:-ml-14 border-l-4 border-gray-300"
      {...props}
    />
  ),
  pre: ({ children, ...props }: any) => {
    // Check if this is a code block with language
    if (children?.props?.className?.startsWith("language-")) {
      const language = children.props.className.replace("language-", "");
      const code = children.props.children;

      if (typeof code === "string") {
        return <CodeBlock language={language} code={code} />;
      }
    }

    return (
      <pre
        className="mt-7 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: (props: any) => {
    // For inline code
    if (!props.className) {
      return (
        <code
          className="inline bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
          {...props}
        />
      );
    }
    // For code blocks, this will be handled by pre
    return <code {...props} />;
  },
  Image,
  img: async ({ src, alt }) => {
    if (!src) return null;

    return (
      <Image
        className="mt-7"
        src={src}
        alt={alt || ""}
        quality={95}
        draggable={false}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    );
  },
  hr: (props) => <hr className="my-14 w-24 border-gray-300" {...props} />,
  InstagramEmbed,
};

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...components,
  };
}
