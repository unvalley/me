import "@/css/prism.css";
import "@/css/tailwind.css";
import "katex/dist/katex.css";

import "@fontsource/inter";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";

import { LayoutWrapper } from "@/components/LayoutWrapper";
import siteMetadata from "@/data/siteMetadata";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<ThemeProvider attribute="class" defaultTheme={"light"}>
				<Head>
					<meta content="width=device-width, initial-scale=1" name="viewport" />
				</Head>
                <GoogleAnalytics gaId={siteMetadata.analytics.googleAnalyticsId } />
				<LayoutWrapper>
					<Component {...pageProps} />
				</LayoutWrapper>
			</ThemeProvider>
		</>
	);
}
