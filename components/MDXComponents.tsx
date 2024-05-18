import { Image } from "./Image";
import { CustomLink } from "./Link";
import { Pre } from "./Pre";
import { TableOfContentsInline } from "./TableOfContentsInline";
import { coreContent } from "@/lib/utils/contentlayer";
import type { Authors, Blog } from "contentlayer/generated";
import type { ComponentMap } from "mdx-bundler/client";
import { useMDXComponent } from "next-contentlayer/hooks";
import React from "react";

type MDXLayout = {
	layout: string;
	content: Blog | Authors;
	[key: string]: unknown;
};

type Wrapper = {
	layout: string;
	[key: string]: unknown;
};

const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
	const Layout = require(`./layouts/${layout}`).default;
	return <Layout content={content} {...rest} />;
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
