import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotesOrganizer | Beyond Note-Taking. Master Your Knowledge.",
  description: "The definitive hub for frameworks, guides, and AI-powered tools to transform your scattered notes into a structured, interconnected knowledge base.",
  other: {
    "google-adsense-account": "ca-pub-9751155071098091",
  }
};

const GA_MEASUREMENT_ID = "G-T3JM54B7WM";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9751155071098091"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-slate-900 text-gray-200`}>
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
} 