import "@/styles/globals.css";

import { Maven_Pro, Source_Serif_4 } from "next/font/google";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { getServerAuthSession } from "@/server/auth";

const fontMaven = Maven_Pro({
  subsets: ["latin"],
  variable: "--font-maven",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Bumper Pass | Web App",
  description:
    "Discover personalized license plates effortlessly! Easily create custom license plates based on your preferences. Get unique designs that reflect your style. Start customizing now!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col justify-between bg-background font-sans antialiased",
          fontMaven.variable,
        )}
      >
        <TRPCReactProvider>
          {session ? <Header /> : null}
          <div className="mx-auto w-full max-w-screen-xl">{children}</div>
          {session ? <Footer /> : null}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
