import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZNations Shop - Official Marketplace",
  description: "Central hub and marketplace for ZNations SMP.",
  icons: {
    icon: "/brand/zn-shield.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
