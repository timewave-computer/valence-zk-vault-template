import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components";
import { AppProviders, WalletStateSync } from "@/context";
import "./globals.css";
import "@valence-protocol/domain-modal-react/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valence ZK Vaults Demo",
  description: "Front end demo app for Valence ZK Vaults",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen px-4 sm:px-6 lg:px-8">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grid-cols-1 min-h-screen justify-center `}
      >
        <AppProviders>
          {/* this is a temporary hack to keep the wallet state synced when use leaves the page */}
          <WalletStateSync />
          <div className="max-w-7xl mx-auto">
            <Header />
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
