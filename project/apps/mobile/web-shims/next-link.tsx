import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children?: ReactNode;
  href: { toString: () => string } | string;
};

export default function Link({ children, href, ...props }: LinkProps) {
  return (
    <a href={typeof href === "string" ? href : href.toString()} {...props}>
      {children}
    </a>
  );
}
