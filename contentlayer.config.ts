import {
	defineDocumentType,
	type ComputedFields,
	makeSource,
} from "contentlayer2/source-files";
import readingTime from "reading-time";
import path from "node:path";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeCitation from "rehype-citation";
import rehypePrismPlus from "rehype-prism-plus";
import rehypePresetMinify from "rehype-preset-minify";

const root = process.cwd();

const computedFields: ComputedFields = {
	readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
	},
	// FIXME:
	toc: { type: "string", resolve: (doc) => "" },
};

export const Blog = defineDocumentType(() => ({
	name: "Blog",
	filePathPattern: "blog/*.mdx",
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		date: { type: "date", required: true },
		tags: { type: "list", of: { type: "string" } },
		lastmod: { type: "date" },
		draft: { type: "boolean" },
		summary: { type: "string" },
		images: { type: "list", of: { type: "string" } },
		authors: { type: "list", of: { type: "string" } },
		layout: { type: "string" },
		bibliography: { type: "string" },
		canonicalUrl: { type: "string" },
	},
	computedFields,
}));

export const Authors = defineDocumentType(() => ({
	name: "Authors",
	filePathPattern: "authors/**/*.mdx",
	contentType: "mdx",
	fields: {
		name: { type: "string", required: true },
		avatar: { type: "string" },
		job: { type: "string" },
		email: { type: "string" },
		x: { type: "string" },
		linkedin: { type: "string" },
		github: { type: "string" },
		layout: { type: "string" },
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "data",
	documentTypes: [Blog, Authors],
	mdx: {
		esbuildOptions(options) {
			options.target = "esnext";
			return options;
		},
		remarkPlugins: [remarkGfm, remarkMath],
		rehypePlugins: [
			rehypeSlug,
			rehypeAutolinkHeadings,
			rehypeKatex,
			[rehypeCitation, { path: path.join(root, "data") }],
			[rehypePrismPlus, { ignoreMissing: true }],
			rehypePresetMinify,
		],
	},
});
