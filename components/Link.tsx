import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type CustomLinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const CustomLink = ({
  href,
  children,
  className,
  ...rest
}: CustomLinkProps) => {
  const isInternalLink = href?.startsWith("/");
  const isAnchorLink = href?.startsWith("#");

  if (isInternalLink) {
    return (
      <Link href={href} className={className} {...(rest as any)}>
        {children}
      </Link>
    );
  }

  if (isAnchorLink) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};
