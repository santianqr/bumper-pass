"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/#search-now", text: "Search Now!" },
    { href: "/#services", text: "Services" },
    { href: "/#about", text: "About" },
  ];

  return (
    <nav className="ml-6 flex items-center gap-6 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors hover:text-foreground/80  ${pathname === link.href ? "border-b border-foreground pb-1 text-foreground" : "text-foreground/60"}`}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}
