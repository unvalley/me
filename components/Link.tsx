/* eslint-disable jsx-a11y/anchor-has-content */
import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

export const CustomLink = ({
    href,
    ...rest
}: DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
>) => {
    const isInternalLink = href?.startsWith("/");
    const isAnchorLink = href?.startsWith("#");

    if (isInternalLink) {
        return (
            <Link href={href} passHref legacyBehavior>
                <a {...rest} />
            </Link>
        );
    }

    if (isAnchorLink) {
        return <a href={href} {...rest} />;
    }

    return (
        <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
    );
};
