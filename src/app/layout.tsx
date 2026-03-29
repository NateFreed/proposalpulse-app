import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProposalPulse - AI Proposals That Close Deals",
  description: "Generate professional proposals with AI. Interactive pricing, e-signatures, view tracking. From $9/mo.",
  openGraph: {
    title: "ProposalPulse - AI Proposals That Close",
    description: "AI proposals with interactive pricing and e-signatures. From $9/mo.",
    type: "website",
    siteName: "ProposalPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProposalPulse - AI Proposals That Close",
    description: "AI proposals with interactive pricing and e-signatures. From $9/mo.",
  },
  keywords: ["proposal software", "business proposal", "AI proposal generator", "e-signature", "freelancer tools"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
