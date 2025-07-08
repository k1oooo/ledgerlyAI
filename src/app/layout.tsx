import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Ledgerly",
  description: "AI Accountant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
