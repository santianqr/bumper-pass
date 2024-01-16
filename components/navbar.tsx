"use client";

import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-6 text-sm">
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/" ? "dark:text-foreground " : "text-foreground/60"
            }`}
          >
            Search Now!
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/about"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/about"
                ? "dark:text-foreground "
                : "text-foreground/60"
            }`}
          >
            About us
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/services"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/services"
                ? "dark:text-foreground "
                : "text-foreground/60"
            }`}
          >
            Services
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/contact"
            className={`transition-colors hover:text-foreground/80 ${
              pathname === "/contact"
                ? "dark:text-foreground "
                : "text-foreground/60"
            }`}
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <User className="rounded-full bg-gradient-to-r from-primary to-primary/60 text-background" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
