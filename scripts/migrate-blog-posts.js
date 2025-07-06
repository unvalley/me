const fs = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");

async function migrateBlogPosts() {
  const sourceDir = path.join(process.cwd(), "data", "blog");
  const targetDir = path.join(process.cwd(), "app", "blog", "_articles");

  try {
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Read all MDX files from the source directory
    const files = await fs.readdir(sourceDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    for (const file of mdxFiles) {
      console.log(`Migrating ${file}...`);

      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      // Read the file content
      const content = await fs.readFile(sourcePath, "utf-8");

      // Parse frontmatter
      const { data: frontmatter, content: mdxContent } = matter(content);

      // Convert to new format with export const metadata
      const newContent = `export const metadata = {
  title: "${frontmatter.title}",
  date: "${frontmatter.date}",
  description: "${frontmatter.summary || ""}",
  tags: ${JSON.stringify(frontmatter.tags || [])},
  draft: ${frontmatter.draft || false},
}

${mdxContent}`;

      // Write to new location
      await fs.writeFile(targetPath, newContent);
      console.log(`✓ Migrated ${file}`);
    }

    console.log(
      `\nMigration complete! Migrated ${mdxFiles.length} blog posts.`,
    );
    console.log(`\nNext steps:`);
    console.log(`1. Run 'pnpm install' to install new dependencies`);
    console.log(
      `2. Remove the old 'data/blog' directory when you're satisfied with the migration`,
    );
    console.log(
      `3. Update any other components that reference the old content structure`,
    );
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateBlogPosts();
