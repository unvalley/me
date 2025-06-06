import { CustomLink } from "@/components/Link";

interface Props {
	totalPages: number;
	currentPage: number;
}

export const Pagination = function Pagination({ totalPages, currentPage }: Props) {
	const prevPage = currentPage - 1 > 0;
	const nextPage = currentPage + 1 <= totalPages;

	return (
		<div className="space-y-2 pt-6 pb-8 md:space-y-5">
			<nav className="flex justify-between">
				{!prevPage && (
					<button
						type="submit"
						className="cursor-auto disabled:opacity-50"
						disabled={!prevPage}
					>
						Previous
					</button>
				)}
				{prevPage && (
					<CustomLink
						href={
							currentPage - 1 === 1 ? "/blog/" : `/blog/page/${currentPage - 1}`
						}
					>
						<button type="submit">Previous</button>
					</CustomLink>
				)}
				<span>
					{currentPage} of {totalPages}
				</span>
				{!nextPage && (
					<button
						type="submit"
						className="cursor-auto disabled:opacity-50"
						disabled={!nextPage}
					>
						Next
					</button>
				)}
				{nextPage && (
					<CustomLink href={`/blog/page/${currentPage + 1}`}>
						<button>Next</button>
					</CustomLink>
				)}
			</nav>
		</div>
	);
};
