import "@/css/prism.css";
import "@/css/tailwind.css";
import "katex/dist/katex.css";

import "@fontsource/inter/variable-full.css";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";

import LayoutWrapper from "@/components/LayoutWrapper";
import Analytics from "@/components/analytics";
import siteMetadata from "@/data/siteMetadata";

export default function App({ Component, pageProps }: AppProps) {
    // TODO: fix theme
    return (
        <>
            <ThemeProvider attribute="class" defaultTheme={"dark"}>
                <Head>
                    <meta
                        content="width=device-width, initial-scale=1"
                        name="viewport"
                    />
                </Head>
                <Analytics />
                <LayoutWrapper>
                    <Component {...pageProps} />
                </LayoutWrapper>
            </ThemeProvider>
        </>
    );
}
