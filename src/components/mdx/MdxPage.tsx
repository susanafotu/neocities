import React from "react";
import Link from "next/link";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";

function CustomLink({
  href,
  children,
  ...props
}: React.LinkHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith("/")) {
    return (
      <Link href={href}>
        {children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <a href={href}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

export function CustomMDX(props: MDXRemoteProps) {
  const components = {
    a: CustomLink,
  };

  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}