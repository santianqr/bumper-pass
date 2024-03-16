"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", text: "Search Now!" },
    { href: "/services", text: "Services" },
    { href: "/about", text: "About" },
  ];

  return (
    <nav className="flex items-center gap-6 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors hover:text-foreground/80  ${
            (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))) 
            ? " text-foreground underline decoration-foreground decoration-2 underline-offset-4 " 
            : "text-foreground/60"
          }`}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}
