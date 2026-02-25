import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400"
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"]
});

const data = Space_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const pixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "FlashAlliance | Collective NFT dApp",
  description:
    "FlashAlliance is an ERC20-funded collective NFT trading module built as a standalone dApp."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${data.variable} ${pixel.variable}`}>
        {children}
      </body>
    </html>
  );
}
