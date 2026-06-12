import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Stamp",
  description: "A Base Mini App for onchain recipe stamps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="base:app_id" content="6a2a38a165478aa1565a9da9" />
        <meta
          name="talentapp:project_verification"
          content="d5a9aa4743824ea4be8ee35e5e769f5eb386d2dc772cb888f75a929e80919096a2677f04fdb0a4a10ab2b15275e92191ed82361337a539178b47ab803ebe516d"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
