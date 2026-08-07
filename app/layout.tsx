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
  openGraph: {
    title: "KoboLens — Nigerian Inflation Calculator",
    description: "See what your Naira was really worth.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "KoboLens — Nigerian Inflation Calculator",
    description: "See what your Naira was really worth.",
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