import { Image } from "./Image";
import { CustomLink } from "./Link";

export const Card = ({ title, description, imgSrc, href }) => (
	<div className="md p-4 md:w-1/2" style={{ maxWidth: "544px" }}>
		<div
			className={`${
				imgSrc && "h-full"
			}  overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
		>
			{imgSrc &&
				(href ? (
					<CustomLink href={href} aria-label={`Link to ${title}`}>
						<Image
							alt={title}
							src={imgSrc}
							className="object-cover object-center md:h-36 lg:h-48"
							width={544}
							height={306}
						/>
					</CustomLink>
				) : (
					<Image
						alt={title}
						src={imgSrc}
						className="object-cover object-center md:h-36 lg:h-48"
						width={544}
						height={306}
					/>
				))}
			<div className="p-6">
				<div className="mb-3 text-2xl leading-8 font-helvetica">
					{href ? (
						<CustomLink href={href} aria-label={`Link to ${title}`}>
							{title}
						</CustomLink>
					) : (
						title
					)}
				</div>
				<p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">
					{description}
				</p>
				{href && (
					<CustomLink
						href={href}
						className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
						aria-label={`Link to ${title}`}
					>
						Learn more &rarr;
					</CustomLink>
				)}
			</div>
		</div>
	</div>
);
