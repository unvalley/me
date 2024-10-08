import { MDXLayoutRenderer } from "@/components/MDXComponents";
import { allAuthors } from "contentlayer/generated";
import type { InferGetStaticPropsType } from "next";

const DEFAULT_LAYOUT = "AuthorLayout";

export const getStaticProps = async () => {
	const author = allAuthors.find((p) => p.slug === "default");
	return { props: { author } };
};

export default function About({
	author,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
