import Image from "next/image";
import { Instagram, PhoneCall, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="container mt-20 space-y-8 py-4 border-t-2 border-border/40">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-center">
        Contact
      </h2>
      <div className="grid grid-cols-2 justify-items-center gap-4">
        <Image src="/bp_logo.webp" width={150} height={150} alt="bp_logo" />
        <div className="space-y-4 text-primary">
          <div className="flex items-center gap-x-2">
            <Instagram size={36} />
            @Bumperpass
          </div>
          <div className="flex items-center gap-x-2">
            <PhoneCall size={36} />
            000-000-0000
          </div>
          <div className="flex items-center gap-x-2">
            <Mail size={36} />
            contact@bumperpass.com
          </div>
        </div>
        <p className="col-span-2">©All rights reserved</p>
      </div>
    </footer>
  );
}
