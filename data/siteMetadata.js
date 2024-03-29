const siteMetadata = {
    title: "UNV",
    author: "unvalley",
    headerTitle: "UNV",
    description: "unvalley personal blog",
    language: "en-us",
    theme: "system", // system, dark or light
    siteUrl: "https://unvalley.me",
    siteRepo: "https://github.com/unvalley/unvalley-me",
    siteLogo: "/static/images/logo.png",
    image: "/static/images/unvalley_512x512.png",
    socialBanner: "",
    github: "https://github.com/unvalley",
    blogGithub: "https://github.com/unvalley/me",
    x: "https://x.com/unvalley_",
    locale: "en-US",
    analytics: {
        // If you want to use an analytics provider you have to add it to the
        // content security policy in the `next.config.js` file.
        // supports plausible, simpleAnalytics, umami or googleAnalytics
        googleAnalyticsId: "G-5BJC0TM8HE", // e.g. UA-000000-2 or G-XXXXXXX
    },
    comment: {
        // If you want to use an analytics provider you have to add it to the
        // content security policy in the `next.config.js` file.
        // Select a provider and use the environment variables associated to it
        // https://vercel.com/docs/environment-variables
        utterancesConfig: {
            // Visit the link below, and follow the steps in the 'configuration' section
            // https://utteranc.es/
            repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO,
            issueTerm: "", // supported options: pathname, url, title
            label: "", // label (optional): Comment 💬
            // theme example: github-light, github-dark, preferred-color-scheme
            // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
            theme: "",
            // theme when dark mode
            darkTheme: "",
        },
        disqusConfig: {
            // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
            shortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
        },
    },
};
module.exports = siteMetadata;
