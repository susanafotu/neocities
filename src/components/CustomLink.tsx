import Link from "next/link";

export default function CustomLink({
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