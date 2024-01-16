import Image from "next/image";
import { Instagram, PhoneCall, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="p-2  border-t-2 border-primary">
      <div className="max-w-6xl grid mx-auto grid-cols-2 justify-items-stretch items-center">
        <div>
          <Image
            alt="logo_reduce"
            src="/logo_reduce.png"
            width={150}
            height={150}
          />
        </div>

        <div className="justify-self-center space-y-2.5 text-primary text-xl">
          <div className="flex flex-1 space-x-1 items-center">
            <Instagram />
            <p>@Bumperpass</p>
          </div>

          <div className="flex flex-1 space-x-1 items-center">
            <PhoneCall />
            <p>000-000-000</p>
          </div>
          <div className="flex flex-1 space-x-1 items-center">
            <Mail />
            <p>Info@bumperpass.com</p>
          </div>
        </div>
        <div className="col-span-2 justify-self-center text-sm font-medium leading-none">
          <p>© All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
