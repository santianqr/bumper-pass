"use client";

import Image from "next/image";
//import { Instagram, PhoneCall, Mail } from "lucide-react";
import { Instagram, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="space-y-8 border-t-2 border-border/40 py-4">
      {pathname === "/" ? (
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Contact
        </h2>
      ) : null}
      <div className="grid grid-cols-2 justify-items-center gap-4">
        <Image src="/bp_logo.webp" width={100} height={100} alt="bp_logo" />
        <div className="space-y-4 text-sm text-primary">
          <div className="flex items-center gap-x-2">
            <Instagram size={32} />
            @Bumperpass
          </div>
          {/*<div className="flex items-center gap-x-2">
            <PhoneCall size={36} />
            000-000-0000
          </div> */}

          <div className="flex items-center gap-x-2">
            <Mail size={32} />
            contact@bumperpass.com
          </div>
        </div>
        <p className="col-span-2 text-xs text-muted-foreground">
          ©All rights reserved
        </p>
      </div>
    </footer>
  );
}
