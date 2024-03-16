import * as React from "react";
import { Button } from "./ui/button";
import { Instagram, Mail } from "lucide-react";

interface EmailVerifyProps {
  name: string;
  token: string;
}

export const EmailVerify: React.FC<Readonly<EmailVerifyProps>> = ({
  name,
  token,
}) => (
  <div className="flex max-w-screen-md flex-col space-y-2">
    <div className="w-full bg-gradient-to-r from-[#E62534]/90 to-[#F59F0F]/85 text-white">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Hello, {name}!
      </h3>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Youre almost there!
      </h3>
    </div>
    <div className="text-center text-sm">
      <p>Please confirm your suscription</p>
      <p>You are one step way from</p>
      <p>activating your account</p>
    </div>

    <a
      href={`https://www.bumperpass.com/verify-email?token=${token}`}
      className="text-center"
    >
      <Button>Confirm E-mail</Button>
    </a>
    <p className="text-center text-sm">
      Bumperpass will process your data to send you information about our
      products, services, promotions, surveys and giveaways based on our
      legitimate interest. Your data will not be communicated to third parties.
    </p>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Bumperpass</p>
        <p className="text-xs">www.bumperpass.com</p>
      </div>
      <div>
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
      </div>
    </div>
  </div>
);
