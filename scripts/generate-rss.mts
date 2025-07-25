import GithubSlugger from "github-slugger";
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import siteMetadata from "../data/siteMetadata.js";
import { escaper } from "./html-escaper.mts";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags: string[];
  draft: boolean;
}

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

interface TagCount {
  [key: string]: number;
}

const articlesDirectory = path.join(process.cwd(), "app", "blog", "_articles");

// Load all blog posts
async function getAllBlogs(): Promise<BlogPost[]> {
  const articles = readdirSync(articlesDirectory);
  const posts: BlogPost[] = [];

  for (const article of articles) {
    if (!article.endsWith(".mdx")) continue;

    const filePath = path.join(articlesDirectory, article);
    const fileContent = readFileSync(filePath, "utf8");

    // Extract metadata from export const metadata = {...}
    const metadataMatch = fileContent.match(
      /export\s+const\s+metadata\s*=\s*({[\s\S]*?})\s*$/m
    );

    if (!metadataMatch) continue;

    let metadata: PostMetadata;
    try {
      // Use Function constructor to safely evaluate the object literal
      metadata = new Function(`return ${metadataMatch[1]}`)() as PostMetadata;
    } catch (e) {
      console.error(`Failed to parse metadata for ${article}:`, e);
      continue;
    }

    posts.push({
      slug: article.replace(/\.mdx$/, ""),
      title: metadata.title,
      date: metadata.date,
      summary: metadata.description,
      tags: metadata.tags || [],
      draft: metadata.draft || false,
    });
  }

  return posts.filter((post) => !post.draft);
}

// TODO: refactor into contentlayer once compute over all docs is enabled
export async function getAllTags(allBlogs: BlogPost[]): Promise<TagCount> {
  const tagCount: TagCount = {};
  // Iterate through each post, putting all found tags into `tags`
  const githubSlugger = new GithubSlugger();

  for (const file of allBlogs) {
    if (file.tags && file.draft !== true) {
      for (const tag of file.tags) {
        const formattedTag = githubSlugger.slug(tag);
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1;
        } else {
          tagCount[formattedTag] = 1;
        }
      }
    }
  }

  return tagCount;
}

const generateRssItem = (post: BlogPost): string => `
  <item>
    <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${escaper(post.title)}</title>
    <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.summary ? `<description>${escaper(post.summary)}</description>` : ""}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags?.map((t) => `<category>${t}</category>`).join("")}
  </item>
`;

const generateRss = (posts: BlogPost[], page = "feed.xml"): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escaper(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}/blog</link>
      <description>${escaper(siteMetadata.description)}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join("")}
    </channel>
  </rss>
`;

async function generateRSS(): Promise<void> {
  const allBlogs = await getAllBlogs();
  const sortedPosts = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // RSS for blog posts
  if (sortedPosts.length > 0) {
    const rss = generateRss(sortedPosts);
    writeFileSync("./public/feed.xml", rss);
  }

  if (siteMetadata.generateRssByTags) {
    const tags = await getAllTags(allBlogs);
    for (const tag of Object.keys(tags)) {
      const filteredPosts = sortedPosts.filter((post) =>
        post.tags.map((t) => new GithubSlugger().slug(t)).includes(tag)
      );
      const rss = generateRss(filteredPosts, `tags/${tag}/feed.xml`);
      const rssPath = path.join("public", "tags", tag);
      mkdirSync(rssPath, { recursive: true });
      writeFileSync(path.join(rssPath, "feed.xml"), rss);
    }
  }
}

generateRSS();
