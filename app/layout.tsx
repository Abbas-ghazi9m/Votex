import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Navbar } from "@/components/layout/Navbar";
import { NetworkBanner } from "@/components/layout/NetworkBanner";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOTEX — Decentralized Secure Digital Voting Platform",
  description:
    "Blockchain-powered voting with transparent verification, smart-contract-enforced one-person-one-vote rules, and tamper-evident election records. Vote Once. Verify Everything. Trust No One.",
  keywords: [
    "blockchain voting",
    "decentralized voting",
    "web3 governance",
    "polygon amoy",
    "tamper evident elections",
    "cryptographic audit",
    "smart contract voting",
  ],
  authors: [{ name: "VOTEX Protocol Engineering Team" }],
  openGraph: {
    title: "VOTEX — Decentralized Secure Digital Voting Platform",
    description: "Vote Once. Verify Everything. Trust No One. Cryptographically verifiable digital elections on Polygon.",
    siteName: "VOTEX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VOTEX — Decentralized Secure Digital Voting",
    description: "Blockchain-powered voting with transparent verification and tamper-evident records.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200 antialiased`}
      >
        <Web3Provider>
          <NetworkBanner />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
