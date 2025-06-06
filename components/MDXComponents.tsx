"use client";

import { Image } from "./Image";
import { CustomLink } from "./Link";
import { Pre } from "./Pre";
import { TableOfContentsInline } from "./TableOfContentsInline";
import { coreContent } from "@/lib/utils/contentlayer";
import type { Authors, Blog } from "contentlayer/generated";
import type { ComponentMap } from "mdx-bundler/client";
import { useMDXComponent } from "next-contentlayer2/hooks";
import type React from "react";
import { PostSimple } from "./layouts/PostSimple";
import { AuthorLayout } from "./layouts/AuthorLayout";

type MDXLayout = {
	layout: string;
	content: Blog | Authors;
	toc: string;
	authorDetails: Omit<Authors, "body" | "_raw" | "_id">[];
	prev: Omit<Blog, "body" | "_raw" | "_id">;
	next: Omit<Blog, "body" | "_raw" | "_id">;
	components?: ComponentMap;
	children?: React.ReactNode;
};

const Wrapper = ({ layout, content, children, ...rest }: MDXLayout) => {
	if (content.type === "Blog") {
		return (
			<PostSimple content={content} {...rest}>
				{children}
			</PostSimple>
		);
	}
	return (
		<AuthorLayout content={content} {...rest}>
			{children}
		</AuthorLayout>
	);
};

export const MDXComponents: ComponentMap = {
	Image,
	TOCInline: TableOfContentsInline,
	a: CustomLink,
	pre: Pre,
	wrapper: Wrapper,
};

export const MDXLayoutRenderer = ({ layout, content, ...rest }: MDXLayout) => {
	const MDXLayout = useMDXComponent(content.body.code);
	const mainContent = coreContent(content);

	return (
		<MDXLayout
			layout={layout}
			content={mainContent}
			components={MDXComponents}
			{...rest}
		/>
	);
};
