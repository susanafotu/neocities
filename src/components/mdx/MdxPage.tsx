import React from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import CustomLink from "../CustomLink";


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