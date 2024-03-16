import { db } from "@/server/db";
import type { User, VerificationToken } from "@prisma/client";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
type ForgotPasswordProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function VerifyEmail({
  searchParams,
}: ForgotPasswordProps) {
  if (searchParams.token) {
    const verificationToken = (await db.verificationToken.findUnique({
      where: {
        token: searchParams.token as string,
      },
      include: {
        user: true,
      },
    })) as VerificationToken & { user: User };

    if (!verificationToken) {
      return <div>Invalid token</div>;
    }

    if (new Date() > verificationToken.expires) {
      return <div>Your token has expired</div>;
    }

    await db.user.update({
      where: {
        id: verificationToken.user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    return (
      <div>
        <h1>
          Reset password for <b>{verificationToken.user.email}</b>!
        </h1>
        <ForgotPasswordForm token={searchParams.token as string} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Verify Email</h1>
        No email verification token found. Check your email.
      </div>
    );
  }
}
