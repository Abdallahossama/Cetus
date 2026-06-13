import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import IntroProvider from "@/components/IntroProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cetus Design — Interior Design Studio",
  description:
    "Cetus Design is an interior design studio crafting refined residential and commercial spaces — from discovery and planning to design and handover.",
  openGraph: {
    title: "Cetus Design — Interior Design Studio",
    description:
      "Refined interiors, thoughtfully delivered. Discover our process, services and portfolio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-navy text-cream antialiased"
      >
        <IntroProvider>{children}</IntroProvider>
      </body>
    </html>
  );
}
