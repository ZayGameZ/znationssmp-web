import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

// Cinzel = engraved heraldic display face (headings, brand). Inter = readable body.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "ZNations SMP — Civilization Server Hub",
  description: "The central hub of ZNations SMP: towns, nations, economy, and the living world. Java and Bedrock crossplay.",
  icons: {
    icon: "/brand/zn-shield.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`dark ${cinzel.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
