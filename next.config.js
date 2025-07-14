const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withBundleAnalyzer(
  withMDX({
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    experimental: {
      mdxRs: false,
    },
    transpilePackages: ["shiki"],
    images: {
      domains: ["images.unsplash.com"],
    },
    webpack: (config) => {
      // Handle SVG files
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
  }),
);
