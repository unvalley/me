import { Image } from "@/components/Image";
import { CustomLink } from "@/components/Link";
import { PageTitle } from "@/components/PageTitle";
import { BlogSEO } from "@/components/SEO";
import { ScrollTop } from "@/components/ScrollTop";
import SectionContainer from "@/components/SectionContainer";
import { Tag } from "@/components/Tag";
import siteMetadata from "@/data/siteMetadata";
import type { CoreContent } from "@/lib/utils/contentlayer";
import type { Authors, Blog } from "contentlayer/generated";
import type { ReactNode } from "react";

const discussUrl = (slug) =>
	`https://mobile.x.com/search?q=${encodeURIComponent(
		`${siteMetadata.siteUrl}/blog/${slug}`,
	)}`;

const postDateTemplate: Intl.DateTimeFormatOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

interface Props {
	content: CoreContent<Blog>;
	authorDetails: CoreContent<Authors>[];
	next?: { slug: string; title: string };
	prev?: { slug: string; title: string };
	children: ReactNode;
}

export default function PostLayout({
	content,
	authorDetails,
	next,
	prev,
	children,
}: Props) {
	const { slug, date, title, tags } = content;

	return (
		<SectionContainer>
			<BlogSEO
				url={`${siteMetadata.siteUrl}/blog/${slug}`}
				authorDetails={authorDetails}
				{...content}
			/>
			<ScrollTop />
			<article>
				<div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
					<header className="pt-6 xl:pb-6">
						<div className="space-y-1 text-center">
							<div>
								<PageTitle>{title}</PageTitle>
							</div>
							<dl className="space-y-10">
								<div>
									<dt className="sr-only">Published on</dt>
									<dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
										<time dateTime={date}>
											{new Date(date).toLocaleDateString(
												siteMetadata.locale,
												postDateTemplate,
											)}
										</time>
									</dd>
								</div>
							</dl>
						</div>
					</header>
					<div
						className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
						style={{ gridTemplateRows: "auto 1fr" }}
					>
						<dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
							<dt className="sr-only">Authors</dt>
							<dd>
								<ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
									{authorDetails.map((author) => (
										<li
											className="flex items-center space-x-2"
											key={author.name}
										>
											{author.avatar && (
												<Image
													src={author.avatar}
													width={38}
													height={38}
													alt="avatar"
													className="h-10 w-10 rounded-full"
												/>
											)}
											<dl className="whitespace-nowrap text-sm font-medium leading-5">
												<dt className="sr-only">Name</dt>
												<dd className="text-gray-900 dark:text-gray-100">
													{author.name}
												</dd>
												<dt className="sr-only">x</dt>
												<dd>
													{author.x && (
														<CustomLink
															href={author.x}
															className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
														>
															{author.x.replace("https://x.com/", "@")}
														</CustomLink>
													)}
												</dd>
											</dl>
										</li>
									))}
								</ul>
							</dd>
						</dl>
						<div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
							<div className="prose max-w-none pt-10 pb-8 dark:prose-dark">
								{children}
							</div>
							<div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
								<CustomLink href={discussUrl(slug)} rel="nofollow">
									{"Discuss on x"}
								</CustomLink>
							</div>
						</div>
						<footer>
							<div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
								{tags && (
									<div className="py-4 xl:py-8">
										<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
											Tags
										</h2>
										<div className="flex flex-wrap">
											{tags.map((tag) => (
												<Tag key={tag} text={tag} />
											))}
										</div>
									</div>
								)}
								{(next || prev) && (
									<div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
										{prev && (
											<div>
												<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
													Previous Article
												</h2>
												<div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
													<CustomLink href={`/blog/${prev.slug}`}>
														{prev.title}
													</CustomLink>
												</div>
											</div>
										)}
										{next && (
											<div>
												<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
													Next Article
												</h2>
												<div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
													<CustomLink href={`/blog/${next.slug}`}>
														{next.title}
													</CustomLink>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
							<div className="pt-4 xl:pt-8">
								<CustomLink
									href="/blog"
									className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
								>
									&larr; Back to the blog
								</CustomLink>
							</div>
						</footer>
					</div>
				</div>
			</article>
		</SectionContainer>
	);
}
