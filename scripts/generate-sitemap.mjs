import { globby } from "globby";
import { writeFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import siteMetadata from "../data/siteMetadata.js";

const articlesDirectory = path.join(process.cwd(), 'app', 'blog', '_articles');

// Load all blog posts
async function getAllBlogs() {
  const articles = readdirSync(articlesDirectory);
  const posts = [];

  for (const article of articles) {
    if (!article.endsWith('.mdx')) continue;
    
    const filePath = path.join(articlesDirectory, article);
    const fileContent = readFileSync(filePath, 'utf8');
    
    // Extract metadata from export const metadata = {...}
    const metadataMatch = fileContent.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})\s*$/m);
    
    if (!metadataMatch) continue;
    
    let metadata;
    try {
      // Use Function constructor to safely evaluate the object literal
      metadata = new Function('return ' + metadataMatch[1])();
    } catch (e) {
      console.error(`Failed to parse metadata for ${article}:`, e);
      continue;
    }
    
    posts.push({
      slug: article.replace(/\.mdx$/, ''),
      draft: metadata.draft || false,
    });
  }

  return posts.filter(post => !post.draft);
}

async function generate() {
	const allBlogs = await getAllBlogs();
	const contentPages = allBlogs.map((x) => `/blog/${x.slug}`);
	
	const pages = await globby([
		"app/**/*.{js|tsx}",
		"public/tags/**/*.xml",
		"!app/_*.{js|tsx}",
		"!app/api",
		"!app/**/layout.{js|tsx}",
		"!app/**/error.{js|tsx}",
		"!app/**/not-found.{js|tsx}",
	]);

	const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
							.concat(contentPages)
							.map((page) => {
								const path = page
									.replace("app/", "/")
									.replace("public/", "/")
									.replace("/page.tsx", "")
									.replace("/page.js", "")
									.replace(".js", "")
									.replace(".tsx", "")
									.replace(".mdx", "")
									.replace(".md", "")
									.replace("/feed.xml", "");
								const route = path === "/index" ? "" : path;
								
								// Skip dynamic routes
								if (route.includes('[') || route.includes(']')) {
									return '';
								}
								
								return `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `;
							})
							.filter(Boolean)
							.join("")}
        </urlset>
    `;

	writeFileSync("public/sitemap.xml", sitemap);
}

generate();