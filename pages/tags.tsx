import { CustomLink } from "@/components/Link";
import { PageSEO } from "@/components/SEO";
import { Tag } from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import { getAllTags } from "@/lib/utils/contentlayer";
import { kebabCase } from "@/lib/utils/kebabCase";
import { allBlogs } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

// TODO: refactor into contentlayer once compute over all docs is enabled

export const getStaticProps: GetStaticProps<{
	tags: Record<string, number>;
}> = async () => {
	const tags = await getAllTags(allBlogs);

	return { props: { tags } };
};

export default function Tags({
	tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
	return (
		<>
			<PageSEO
				title={`Tags - ${siteMetadata.author}`}
				description="Things I blog about"
			/>
			<div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
				<div className="space-x-2 pt-6 pb-8 md:space-y-5">
					<h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
						Tags
					</h1>
				</div>
				<div className="flex max-w-lg flex-wrap">
					{Object.keys(tags).length === 0 && "No tags found."}
					{sortedTags.map((t) => {
						return (
							<div key={t} className="mt-2 mb-2 mr-5">
								<Tag text={t} />
								<CustomLink
									href={`/tags/${kebabCase(t)}`}
									className="-ml-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
								>
									{` (${tags[t]})`}
								</CustomLink>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
