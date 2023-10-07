import Footer from "./Footer";
import { CustomLink } from "./Link";
import { MobileNav } from "./MobileNav";
import SectionContainer from "./SectionContainer";
import ThemeSwitch from "./ThemeSwitch";
import { headerNavLinks } from "@/data/index";
import siteMetadata from "@/data/siteMetadata";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const LayoutWrapper = ({ children }: Props) => {
    return (
        <SectionContainer>
            <div className="flex h-screen flex-col justify-between">
                <header className="flex items-center justify-between py-10">
                    <div>
                        <CustomLink href="/" aria-label={siteMetadata.headerTitle}>
                            <div className="flex items-center justify-between">
                                {typeof siteMetadata.headerTitle ===
                                "string" ? (
                                    <div className="hidden h-6 text-2xl font-semibold sm:block">
                                        {siteMetadata.headerTitle}
                                    </div>
                                ) : (
                                    siteMetadata.headerTitle
                                )}
                            </div>
                        </CustomLink>
                    </div>
                    <div className="flex items-center text-base leading-5">
                        <div className="hidden sm:block">
                            {headerNavLinks.map((link) => (
                                <CustomLink
                                    key={link.title}
                                    href={link.href}
                                    className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                                >
                                    {link.title}
                                </CustomLink>
                            ))}
                        </div>
                        {/* <ThemeSwitch /> */}
                        <MobileNav />
                    </div>
                </header>
                <main className="mb-auto">{children}</main>
                <Footer />
            </div>
        </SectionContainer>
    );
};
