export const headerNavLinks = [
  { href: "/blog", title: "BLOG" },
  { href: "/tools", title: "TOOLS" },
  { href: "/books", title: "BOOKS" },
  { href: "/about", title: "ABOUT" },
];

export const talks = [
  {
    title: "Plugin System in Rust based JavaScript/TypeScript Linters",
    event: "TSKaigi 2025",
    topic: "Biome, Oxc, deno_lint, Rust, TypeScript, Linter",
    href: "https://speakerdeck.com/unvalley/typescript-linters",
  },
  {
    title: "OSSと継続的に関わる方法の模索",
    event: "maguro.dev #1",
    topic: "OSS",
    href: "https://speakerdeck.com/unvalley/exploring-ways-to-stay-continuously-involved-with-oss",
  },
  {
    title: "AIと作るEphemeral Markdown Paper",
    event: "Findy 個人開発のAI活用LT",
    topic: "TypeScript,AI",
    href: "https://speakerdeck.com/unvalley/building-an-ephemeral-markdown-paper-with-ai",
  },
  {
    title: "Thoughts and experiences on Rust and TypeScript",
    event: "nagoya.ts #3",
    topic: "Rust,TypeScript",
    href: "https://speakerdeck.com/unvalley/thoughts-and-experiences-on-rust-and-typescript",
  },
  {
    title: "Next generation front-end crosstalk",
    event: "Vue Fes 2024",
    topic: "JavaScript Toolchain, Rust",
    href: "https://vuefes.jp/2024/en#event",
  },
  {
    title:
      "Exploring Type-Informed Lint Rules in Rust based TypeScript Linters | Rust製TypeScript Linterにおける型情報Lintルールの模索",
    event: "TSKaigi 2024",
    topic: "Biome, Oxc, deno_lint, Rust, TypeScript, Linter",
    href: "https://speakerdeck.com/unvalley/exploring-type-informed-lint-rules-in-rust-based-linters",
  },
  {
    title:
      "Behind VS Code Extensions for JavaScript / TypeScript Linting and Formatting",
    event: "VSCode Conference Japan 2024",
    topic: "VSCode Extension, JavaScript, TypeScript, Linter",
    href: "https://speakerdeck.com/unvalley/behind-biome",
  },
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
    title: "Ephe",
    description:
      "An Ephemeral Markdown Paper for today. Less but handy features for plain Markdown lovers.",
    imgSrc: "",
    href: "https://github.com/unvalley/ephe",
  },
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
    href: "https://github.com/unvalley/tabx",
  },
  {
    title: "UNV (This blog)",
    description: "A personal blog built with Next.js and MDX.",
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
  category: "services" | "daily" | "ai";
}[] = [
  {
    name: "Dia Browser",
    description: "The AI browser where you can chat with your tabs.",
    imgSrc: "",
    href: "https://diabrowser.com",
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
    name: "Cosense",
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
  // {
  // 	name: "PostCoffee",
  // 	description:
  // 		"A coffee subscription for specialty coffee based on preferences (Japan Only). You can use my coupon code: coffee-u8wgk7",
  // 	imgSrc: "",
  // 	href: "https://postcoffee.co/subscription/",
  // 	affiliate: false,
  // 	category: "services",
  // },
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
  {
    name: "Arc'teryx Items",
    description: "Functionality and Design.",
    imgSrc: "",
    href: "https://unvalley.me/blog/1754673967",
    affiliate: false,
    category: "daily",
  },
  {
    name: "Cursor",
    description: "AI Code Editor.",
    imgSrc: "",
    href: "https://cursor.so",
    affiliate: false,
    category: "ai",
  },
  {
    name: "Perplexity",
    description: "An AI-powered search engine.",
    imgSrc: "",
    href: "https://www.perplexity.ai",
    affiliate: false,
    category: "ai",
  },
  {
    name: "ChatGPT",
    description: "An AI chatbot by OpenAI.",
    imgSrc: "",
    href: "https://chat.openai.com",
    affiliate: false,
    category: "ai",
  },
  {
    name: "GitHub Copilot",
    description: "An AI pair programmer by GitHub.",
    imgSrc: "",
    href: "https://github.com/features/copilot",
    affiliate: false,
    category: "ai",
  },
  {
    name: "Claude (Max Plan)",
    description: "AI assistant built by Anthropic",
    imgSrc: "",
    href: "https://claude.ai",
    affiliate: false,
    category: "ai",
  },
  {
    name: "Google Gemini",
    description: "An AI chatbot by Google.",
    imgSrc: "",
    href: "https://bard.google.com",
    affiliate: false,
    category: "ai",
  },
  {
    name: "Ephe",
    description: "An Ephemeral Markdown Paper build by me",
    imgSrc: "",
    href: "https://ephe.app/landing",
    affiliate: false,
    category: "services",
  },
];
