import { InferGetStaticPropsType } from "next";
import { PageSEO } from "../components/SEO";
import { PageTitle } from "../components/PageTitle";
import { toolsData } from "../data/index";
import { CustomLink } from "../components/Link";

export function Tools() {
	const name = "unvalley";
	const services = toolsData.filter((x) => x.category === "services");
	const daily = toolsData.filter((x) => x.category === "daily");

	return (
		<>
			<PageSEO
				title={`Tools - ${name}`}
				description={`Tools what ${name} use.`}
			/>
			<div className="divide-y">
				<div className="space-y-2 pt-6 pb-8 md:space-y-5">
					<PageTitle>TOOLS</PageTitle>
					<p>What I use.</p>
				</div>
				<div className="container prose max-w-none pt-10 pb-8 dark:prose-dark">
					<h2>Services</h2>
					<ul>
						{services.map((x) => (
							<li key={x.name}>
								<CustomLink href={x.href}>{x.name}</CustomLink>
								<span> - {x.description}</span>
							</li>
						))}
					</ul>

					<h2>Daily</h2>
					<ul>
						{daily.map((x) => (
							<li key={x.name}>
								<CustomLink href={x.href}>{x.name}</CustomLink>
								{x.affiliate ? " (Affiliate)" : ""}
								<span> - {x.description}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}
