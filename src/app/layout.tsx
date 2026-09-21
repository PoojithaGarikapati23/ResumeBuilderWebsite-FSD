import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { HelpdeskChat } from "@/components/HelpdeskChat";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerCraft AI | Your AI Career Assistant",
  description: "Build, optimize, and tailor your resume with AI. Compare against jobs and land your dream role.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <HelpdeskChat />
      </body>
    </html>
  );
}
