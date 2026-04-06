import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Memory Match – Find the Pairs",
  description: "A fun and polished memory card matching game. Flip cards to find matching pairs. Choose Easy, Medium, or Hard difficulty and beat your best time!",
  keywords: ["memory game", "card matching", "brain game", "concentration"],
  authors: [{ name: "RelyGroup" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Memory Match – Find the Pairs",
    description: "Flip cards, find pairs, beat your best time. Play the free Memory Match game!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Memory Match – Find the Pairs",
    description: "Flip cards, find pairs, beat your best time.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
