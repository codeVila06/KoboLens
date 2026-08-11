import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KoboLens — Nigerian Inflation Calculator",
  description:
    "Adjust Nigerian prices for inflation. See what your Naira was really worth using official NBS CPI data from 2009 to 2026.",
  keywords: ["Nigeria", "inflation", "Naira", "CPI", "calculator", "purchasing power"],
  authors: [{ name: "KoboLens" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kobolens.netlify.app"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "KoboLens — Nigerian Inflation Calculator",
    description: "See what your Naira was really worth.",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "KoboLens — Adjust Nigerian prices for inflation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KoboLens — Nigerian Inflation Calculator",
    description: "See what your Naira was really worth.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen">
        <BackgroundSlideshow />
        {children}
      </body>
    </html>
  );
}