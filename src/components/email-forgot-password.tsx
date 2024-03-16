import * as React from "react";
import { Instagram, Mail } from "lucide-react";
import { Button } from "./ui/button";

interface EmailForgotPasswordProps {
  name: string;
  token: string;
}

export const EmailForgotPassword: React.FC<
  Readonly<EmailForgotPasswordProps>
> = ({ name, token }) => (
  <div className="flex max-w-screen-md flex-col space-y-2">
    <div className="w-full bg-gradient-to-r from-[#E62534]/90 to-[#F59F0F]/85 text-white">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Hello, {name}!
      </h3>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        We received a request to reset your password
      </h3>
    </div>
    <div className="text-center text-sm">
      <p>
        Please follow the below to reset your password. Keep in mind it will{" "}
        remain active for only 24 hours. If the link expires, you will need to
        request another one, starting the registrarion process again.
      </p>
      <p>
        If you didnt request a password change, you can disregard this email,{" "}
        and your password wont be alteres.
      </p>
    </div>

    <a
      href={`https://www.bumperpass.com/reset-password?token=${token}`}
      className="text-center"
    >
      <Button>Reset password</Button>
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

//
