/* eslint-disable jsx-a11y/anchor-has-content */
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

const CustomLink = ({
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

export default CustomLink;
