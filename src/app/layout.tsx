import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import IntroProvider from "@/components/IntroProvider";

// Display headlines — editorial serif
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Eyebrows / labels / nav — tracked caps
const cinzel = Cinzel({
  variable: "--font-cinzel-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Body / UI
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
      className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-ink text-beige antialiased"
      >
        <IntroProvider>{children}</IntroProvider>
      </body>
    </html>
  );
}
