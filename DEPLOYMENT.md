# Deployment Guide for Detached Subdomain

## Overview

This project includes a Digital Minimalism media platform accessible at `detached.unvalley.me`. The subdomain is configured to serve the `/detached` app route.

## Subdomain Configuration

### DNS Setup
Configure your DNS provider to point `detached.unvalley.me` to your main domain's IP address.

Example DNS records:
```
Type: CNAME
Name: detached
Value: unvalley.me
TTL: 3600
```

### Next.js Configuration
The subdomain routing is handled by Next.js rewrites in `next.config.js`:

- Requests to `detached.unvalley.me` are automatically routed to `/detached`
- All subpaths are mapped accordingly (e.g., `detached.unvalley.me/features` → `/detached/features`)

### Netlify Deployment

Since you're using Netlify, here's how to set up the subdomain:

#### Method 1: Using Netlify's Domain Management (Recommended)

1. **Deploy the Main Site**
   - Your site should already be deployed on Netlify
   - Main site accessible at `unvalley.me`

2. **Add Subdomain in Netlify Dashboard**
   - Go to **Site settings** → **Domain management**
   - Click **Add domain alias**
   - Enter `detached.unvalley.me`
   - Netlify will guide you through the setup

3. **DNS Configuration**
   - If using Netlify DNS: Automatically configured
   - If using external DNS provider, add:
     ```
     Type: CNAME
     Name: detached
     Value: [your-site-name].netlify.app
     TTL: 3600
     ```

4. **SSL Certificate**
   - Netlify automatically provisions SSL certificates
   - Usually active within 15 minutes

#### Method 2: Using _redirects File (Alternative)

Create a `public/_redirects` file:
```
https://detached.unvalley.me/* https://unvalley.me/detached/:splat 200!
```

Note: The Next.js rewrite configuration is already set up and will handle the routing once the subdomain points to your Netlify site.

### Vercel Deployment (Alternative)

1. Deploy the main project to Vercel
2. Add custom domain `detached.unvalley.me` in Vercel dashboard
3. Configure DNS as shown above
4. Vercel will automatically handle SSL certificates

## Environment Variables

No additional environment variables are required for the subdomain functionality.

## Post-Deployment Verification

After setting up the subdomain on Netlify:

1. **Test the subdomain routes:**
   - `https://detached.unvalley.me` → Homepage
   - `https://detached.unvalley.me/features` → Features page
   - `https://detached.unvalley.me/articles` → Articles listing
   - `https://detached.unvalley.me/about` → About page

2. **Verify the layout isolation:**
   - The detached pages should NOT show the main blog navigation
   - Only the "Detached" branding and navigation should be visible

3. **Check SSL certificate:**
   - Ensure HTTPS is working properly
   - Look for the padlock icon in the browser

## Testing Locally

To test subdomain functionality locally:

1. Add to your `/etc/hosts` file:
   ```
   127.0.0.1 detached.localhost
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Visit `http://detached.localhost:3000` to test subdomain routing

Note: You can also test the routes directly at `http://localhost:3000/detached` without subdomain configuration.

## Build Process

The detached site is built as part of the main application build:

```bash
pnpm build
```

This will:
- Compile all TypeScript
- Build both main site and detached site
- Generate static assets
- Create optimized production build

## SEO Configuration

The detached subdomain includes:
- Custom sitemap at `/detached/sitemap.xml`
- Robots.txt configuration
- PWA manifest
- Optimized meta tags for all pages

## Performance Optimizations

- Minimal JavaScript bundle
- Optimized fonts (Inter font family)
- Efficient CSS with Tailwind
- Static generation for all pages
- Optimized images and assets