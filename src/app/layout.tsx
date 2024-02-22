import "@/styles/globals.css";

import { Maven_Pro, Source_Serif_4 } from "next/font/google";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ModeToggle } from "@/components/mode-toggle";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative flex min-h-screen flex-col bg-background font-maven antialiased",
          fontMaven.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
            <Footer />
            <ModeToggle />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
