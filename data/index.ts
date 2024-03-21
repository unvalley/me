export const headerNavLinks = [
	{ href: "/blog", title: "BLOG" },
	{ href: "/tools", title: "TOOLS" },
	{ href: "/about", title: "ABOUT" },
];

export const talks = [
	{
		title: "Behind Biome | Biomeの裏側 (Parser/Linter)",
		event: "burikaigi2024",
		topic: "Biome",
		href: "https://speakerdeck.com/unvalley/behind-biome",
	},
	{
		title: "Biome is for JavaScripters",
		event: "We Are JavaScripters! @43rd",
		topic: "Biome",
		href: "https://speakerdeck.com/unvalley/biome-is-for-javascripters",
	},
	{
		title: "Better Unit Testing",
		event: "English Night #13",
		topic: "Testing",
		href: "https://speakerdeck.com/unvalley/better-unit-testing",
	},
];

export const projectsData = [
	// latest
	{
		title: "Biome",
		description:
			"One toolchain for your web project. I'm involved as a core contributor.",
		imgSrc: "/static/images/biome-192x192.png",
		href: "https://biomejs.dev",
	},
	{
		title: "TabX",
		description: "A simple and tiny tab management chrome extension (OSS). ",
		imgSrc: "/static/images/tabx_.png",
		href: "https://tabx.app/",
	},
	{
		title: "UNV (This blog)",
		description:
			"A personal blog built with Next.js and MDX. This is based on timlrx/tailwind-nextjs-starter-blog but I updated a lot.",
		imgSrc: "",
		href: "https://github.com/unvalley/me",
	},
] as const;

export const toolsData: {
	name: string;
	description: string;
	imgSrc: string;
	href: string;
	affiliate: boolean;
	category: "services" | "daily";
}[] = [
	{
		name: "Vivaldi",
		description: "A Powerful, Personal and Private web browser",
		imgSrc: "",
		href: "https://vivaldi.com",
		affiliate: false,
		category: "services",
	},
	{
		name: "Spotify",
		description: "Mainly for music. Introducing serendipity by recommendation.",
		imgSrc: "",
		href: "https://spotify.com",
		affiliate: false,
		category: "services",
	},
	{
		name: "Scrapbox",
		description:
			"An app that turns your notes into knowledge. I have accumulated almost all of my experience and knowledge.",
		imgSrc: "",
		href: "https://scrapbox.io",
		affiliate: false,
		category: "services",
	},
	{
		name: "Todoist",
		description: "A To-Do List to Organize Your Work & Life",
		imgSrc: "",
		href: "https://todoist.com",
		affiliate: false,
		category: "services",
	},
	{
		name: "Raycast",
		description: "A blazingly fast, totally extendable launcher.",
		imgSrc: "",
		href: "https://www.raycast.com",
		affiliate: false,
		category: "services",
	},
	{
		name: "AltTab",
		description: "Windows alt-tab on macOS.",
		imgSrc: "",
		href: "https://alt-tab-macos.netlify.app",
		affiliate: false,
		category: "services",
	},
	{
		name: "Bitwarden",
		description: "A freemium open-source password manager.",
		imgSrc: "",
		href: "https://bitwarden.com",
		affiliate: false,
		category: "services",
	},
	{
		name: "PostCoffee",
		description:
			"A coffee subscription for specialty coffee based on preferences (Japan Only). You can use my coupon code: coffee-u8wgk7",
		imgSrc: "",
		href: "https://postcoffee.co/subscription/",
		affiliate: false,
		category: "services",
	},
	{
		name: "neat.run",
		description:
			"A heads-up display of the most important updates to your codebase.",
		imgSrc: "",
		href: "https://neat.run",
		affiliate: false,
		category: "services",
	},
	{
		name: "Shokz OPNCOMM2",
		description: "A headset provided by the company. Comfortable.",
		imgSrc: "",
		href: "",
		affiliate: false,
		category: "daily",
	},
	{
		name: "CASIO A168WA-1A2WJR Silver",
		description: "Cheap but enough and tough.",
		imgSrc: "",
		href: "https://amzn.to/3LRamjy",
		affiliate: true,
		category: "daily",
	},
];
