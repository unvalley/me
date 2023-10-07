import { GoogleAnalyticsScript } from "./GoogleAnalytics";
import siteMetadata from "@/data/siteMetadata";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        plausible?: (...args: any[]) => void;
        sa_event?: (...args: any[]) => void;
    }
}

const isProduction = process.env.NODE_ENV === "production";

export const Analytics = () => {
    return isProduction && siteMetadata.analytics.googleAnalyticsId ? <GoogleAnalyticsScript /> : null
};