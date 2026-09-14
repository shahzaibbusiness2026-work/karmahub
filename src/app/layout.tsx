import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ProofModal from "@/components/ProofModal";
import Toast from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AccoMarket — Buy & Sell Reddit Accounts | Trusted Account Marketplace",
  description:
    "Find high-quality, verified Reddit accounts with real activity. Secured by automated escrow — fast, transparent and easy.",
  robots: "index, follow",
  openGraph: {
    title: "AccoMarket — Trusted Reddit Account Marketplace",
    description: "Verified Reddit accounts with escrow protection. Browse 1,200+ listings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/*
          Material Symbols font loaded via Google Fonts CDN.
          This is kept as a link tag (not next/font) because Material Symbols
          uses variable font axes that next/font does not yet support fully.
          Using `display=swap` prevents FOIT.
        */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="font-sans bg-white text-gray-800 antialiased min-h-screen flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
          <ProofModal />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
