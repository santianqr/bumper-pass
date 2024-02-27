import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserCog, FolderSearch2, Settings, LogOut } from "lucide-react";

const options = [
  {
    icon: <UserCog />,
    label: "Account",
    href: "/account",
  },
  {
    icon: <FolderSearch2 />,
    label: "User Dashboard",
    href: "/account/dashboard",
  },
  {
    icon: <Settings />,
    label: "Settings",
    href: "/account/settings",
  },
  {
    icon: <LogOut />,
    label: "Log out",
    href: "/api/auth/signout",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href="/">
          <Image
            src="/logo_long.webp"
            alt="logo_long"
            width={150}
            height={150}
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Navbar />
          <Popover>
            <PopoverTrigger>
              <UserAvatar />
            </PopoverTrigger>
            <PopoverContent className="w-48 items-center space-y-1">
              {options.map((option, index) => (
                <Link
                  key={index}
                  className="flex items-center space-x-2"
                  href={option.href}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </Link>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
