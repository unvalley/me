# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog website built with Next.js 15, TypeScript, and MDX content. It's based on the [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) template.

## Essential Commands

### Development
```bash
pnpm dev              # Start development server
pnpm build            # Build for production (includes content generation, sitemap, RSS)
pnpm serve            # Start production server
pnpm analyze          # Analyze bundle size
```

### Content Management
```bash
pnpm post:new         # Interactive CLI to create new blog post
```

### Code Quality
```bash
pnpm lint             # Run Biome linter (currently disabled in config)
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Biome (currently disabled in config)
```

Note: Both linting and formatting are configured but disabled in `biome.jsonc`. Enable them by setting `"enabled": true` in the respective sections.

## Architecture

### Content System
- Blog posts are MDX files in `/data/blog/`
- Posts use Unix timestamps as filenames (e.g., `1739007005.mdx`)
- Content is processed by Contentlayer2 at build time
- Authors defined in `/data/authors/`
- Site configuration in `/data/siteMetadata.js`

### Page Structure
- `/pages/index.tsx` - Homepage with latest posts
- `/pages/blog/[...slug].tsx` - Individual blog post pages
- `/pages/tags/[tag].tsx` - Posts filtered by tag
- `/pages/about.tsx` - About page
- `/pages/tools.tsx` - Tools page

### Component Organization
- `/components/` - Reusable React components
- `/components/layouts/` - Page layout components (AuthorLayout, ListLayout, PostSimple)
- `/components/MDXComponents.tsx` - Custom MDX components
- Path aliases: `@/components/*`, `@/data/*`, `@/lib/*`, `@/css/*`

### Build Process
1. Contentlayer generates static content from MDX files
2. Next.js builds pages with static props
3. Post-build scripts generate sitemap.xml and RSS feeds
4. All pages are statically generated at build time

### Key Features
- MDX support with plugins for math, syntax highlighting, and citations
- Dark mode via `next-themes`
- SEO optimized with security headers
- RSS feed generation (main feed + per tag)
- Google Analytics integration
- Tailwind CSS with custom theme configuration