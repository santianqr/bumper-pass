import Image from "next/image";
import Navbar from "@/components/navbar";
import { CircleUser, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Image src="/logo_long.webp" alt="logo_long" width={100} height={100} />
        <div className="flex items-center space-x-6">
          <Navbar />
          <div className="flex items-center">
            <CircleUser />
            <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </header>
  );
}
