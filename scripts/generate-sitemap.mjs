import { globby } from "globby";
import { writeFileSync } from "node:fs";
import { allBlogs } from "../.contentlayer/generated/index.mjs";
import siteMetadata from "../data/siteMetadata.js";

async function generate() {
	const contentPages = allBlogs
		.map((x) => `/${x._raw.flattenedPath}`)
		.filter((x) => !x.draft && !x.canonicalUrl);
	const pages = await globby([
		"pages/*.{js|tsx}",
		"public/tags/**/*.xml",
		"!pages/_*.{js|tsx}",
		"!pages/api",
		"!pages/404.{js|tsx}",
	]);

	const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
							.concat(contentPages)
							.map((page) => {
								const path = page
									.replace("pages/", "/")
									.replace("public/", "/")
									.replace(".js", "")
									.replace(".mdx", "")
									.replace(".md", "")
									.replace("/feed.xml", "");
								const route = path === "/index" ? "" : path;
								return `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `;
							})
							.join("")}
        </urlset>
    `;

	writeFileSync("public/sitemap.xml", sitemap);
}

generate();
