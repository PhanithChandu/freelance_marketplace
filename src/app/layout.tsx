import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "TrustChain — Trustless Freelance Marketplace",
  description: "A Web3-powered freelance marketplace with smart contract escrow, milestone tracking, and on-chain transparency. Hire and work with confidence.",
  keywords: ["freelance", "marketplace", "blockchain", "escrow", "smart contracts", "Web3", "Ethereum"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: '100vh' }}>
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
